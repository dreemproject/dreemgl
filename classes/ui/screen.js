/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require, $ui$, view, menubutton) {
// Screens are the root of a view hierarchy, typically mapping to a physical device.

	var Render = require('$system/base/render')
	var Animate = require('$system/base/animate')
	var ASTScanner = require('$system/parse/astscanner')

	this.attributes = {
		// internal, the locationhash is a parsed JS object version of the #var2=1;var2=2 url arguments
		locationhash: Config({type:Object, value:{}}),
		// when the browser comes out of standby it fires wakup event
		wakeup: Config({type:Event}),
		status:"",
		globalkeydown: Config({type:Event}),
		globalkeyup: Config({type:Event}),
		globalkeypress: Config({type:Event}),
		globalkeypaste: Config({type:Event}),
		globalpointerstart: Config({type:Event}),
		globalpointermove: Config({type:Event}),
		globalpointerend: Config({type:Event}),
		globalpointertap: Config({type:Event}),
		globalpointerhover: Config({type:Event}),
		globalpointerover: Config({type:Event}),
		globalpointerout: Config({type:Event}),
		globalpointerwheel: Config({type:Event}),
		globalpointermultimove: Config({type:Event})
	}

	this.bgcolor = NaN

	this.rpcproxy = false
	this.viewport = '2d'
	this.dirty = true
	this.flex = NaN
	this.flexdirection = "column"
	this.cursor = 'arrow'

	this.tooltip = 'Application'

	this.atConstructor = function(){
	}

	this.oninit = function () {
		// ok. lets bind inputs
		this.modal_stack = []
		this.focus_view = undefined
		this.keyboard = this.device.keyboard
		this.pointer = this.device.pointer
		this.midi = this.device.midi
		this.bindInputs()
	}

	// TODO(aki): move menu into a configurable component.
	// internal, display a classic "rightclick" or "dropdown" menu at position x,y - if no x,y is provided, last pointer coordinates will be substituted instead.
	this.contextMenu = function(commands, x,y){
		this.openModal(function(){
			var res = []
			for(var a in commands){
				var c = commands[a]
				//console.log("menucommand: ", c)
				var act = c.clickaction
				if (!act && c.commands){
					act = function(){
						console.log("opening submenu?")
						console.log(this.constructor.name, this.layout)
						this.screen.contextMenu(this.commands, this.layout.absx + this.layout.width, this.layout.absy)
						return true
					}
				}
				res.push(
					menubutton({
						padding:vec4(5 ,0,5,4),
						margin:0,
						borderradius: 6,
						bold:false,
						text:c.name,

						bgcolor:"#a3a3a3",
						borderwidth:0,
						hovercolor1:"#737373",
						hovercolor2:"#737373",
						buttoncolor2:"#a3a3a3",
						textcolor:"#3b3b3b",
						textactivecolor:"white",
						clickaction: act,
						commands: c.commands,
						click:function(){
							var close = false
							if(this.clickaction) close = this.clickaction()
							if (!close) this.screen.closeModal(true)
						}
					})
				)
			}

			return view({bgcolor:"#a3a3a3",flexdirection:"column",
				dropshadowopacity: 0.4,
				padding:4,
				dropshadowhardness:0,
				dropshadowradius: 20,
				dropshadowoffset:vec2(9,9),
				borderradius:7,
				onfocuslost:function(){
					this.screen.closeModal(false)
				},
				init:function(){
				},
				pos:[x,y],
				size:[300,NaN],position:'absolute'
			}, res)
		}).then(function(result){

		})
	}

	// pick a view at the pointer coordinate and console.log its structure
	this.debugPick = function(x, y){
		this.device.pickScreen(x, y).then(function(msg){
			var view = msg.view
			if(this.last_debug_view === view) return
			this.last_debug_view = view
			var found
			function dump(walk, parent){
				var layout = walk.layout || {}
				var named = (new Function("return function " + (walk.name || walk.constructor.name) + '(){}'))()
				Object.defineProperty(named.prototype, 'zflash', {
					get:function(){
						// humm. ok so we wanna flash it
						// how do we do that.
						window.view = this.view
						return "window.view set"
					}
				})
				var obj = new named()
				obj.geom = 'x:'+layout.left+', y:'+layout.top+', w:'+layout.width+', h:'+layout.height
				if(walk._viewport) obj.viewport = walk._viewport
				// write out shader modes
				var so = ''
				for(var key in walk.shader_order){
					if(walk.shader_order[key]){
						if(so) so += ", "
						so += key+':'+walk.shader_order[key]
					}
				}
				obj.shaders = so
				obj.view = walk

				if(walk._text) obj.text = walk.text

				if(walk === view) found = obj
				if(walk.children){
					//obj.children = []
					for(var i = 0; i < walk.children.length;i++){
						obj[i] = dump(walk.children[i], obj)
					}
				}
				obj._parent = parent
				return obj
			}
			var ret = dump(this, null)
			if(!found) console.log("Could not find", view)
			else console.log(found)
		}.bind(this))
	}

	// internal, bind all keyboard/pointer inputs for delegating it into the view tree
	this.bindInputs = function(){
		this.keyboard.down = function(v){
			this.emit('globalkeydown', v)
			if(!this.focus_view) return
			if(!this.inModalChain(this.focus_view)) return
			this.focus_view.emitUpward('keydown', v)
		}.bind(this)

		this.keyboard.up = function(v){
			this.emit('globalkeyup', v)
			if(!this.focus_view) return
			if(!this.inModalChain(this.focus_view)) return
			this.focus_view.emitUpward('keyup', v)
		}.bind(this)

		this.keyboard.press = function(v){
			this.emit('globalkeypress', v)
			// lets reroute it to the element that has focus
			if(!this.focus_view) return
			if(!this.inModalChain(this.focus_view)) return
			this.focus_view.emitUpward('keypress', v)
		}.bind(this)

		this.keyboard.paste = function(v){
			this.emit('globalkeypaste', v)
			// lets reroute it to the element that has focus
			if(!this.focus_view) return
			if(!this.inModalChain(this.focus_view)) return
			this.focus_view.emitUpward('keypaste', v)
		}.bind(this)


		// Event handler for `pointer.start` event.
		// Emits `pointerstart` event from `pointer.view` and computes the cursor.
		this.pointer.start = function(e){
			if (e.pointer) {
				this.emit('globalpointerstart', e)
				e.view.emitUpward('pointerstart', e.pointer)
				e.view.computeCursor()
				if(this.inModalChain(e.view)){
					this.setFocus(e.view)
				} else if (this.modal){
					this.modal.emitUpward('focuslost', {global: e.pointer.position})
				}
			}
		}.bind(this)

		// Event handler for `pointer.move` event.
		// Emits `pointermove` event from `pointer.view`.
		this.pointer.move = function(e){
			if (e.pointer) {
				this.emit('globalpointermove', e)
				e.view.emitUpward('pointermove', e.pointer)
			} else if (e.pointers) {
				this.emit('globalpointermultimove', e)
				e.view.emitUpward('pointermultimove', e.pointers)
			}
		}.bind(this)

		// Event handler for `pointer.end` event.
		// Emits `pointerend` event `pointer.view` and computes the cursor.
		this.pointer.end = function(e){
			if (e.pointer) {
				this.emit('globalpointerend', e)
				e.view.emitUpward('pointerend', e.pointer)
				e.view.computeCursor()
			}
		}.bind(this)

		// Event handler for `pointer.tap` event.
		// Emits `pointertap` event from `pointer.view`.
		this.pointer.tap = function(e){
			if (e.pointer) {
				this.emit('globalpointertap', e);
				e.view.emitUpward('pointertap', e.pointer)
			}
		}.bind(this)

		// Event handler for `pointer.hover` event.
		// Emits `pointerhover` event `pointer.view` and computes the cursor.
		this.pointer.hover = function(e){
			if (e.pointer) {
				this.emit('globalpointerhover', e);

				e.view.emitUpward('pointerhover', e.pointer)
				e.view.computeCursor()
			}
		}.bind(this)

		// Event handler for `pointer.over` event.
		// Emits `pointerover` event from `pointer.view`.
		this.pointer.over = function(e){
			if (e.pointer) {
				this.emit('globalpointerover', e);
				e.view.emitUpward('pointerover', e.pointer)
			}
		}.bind(this)

		// Event handler for `pointer.out` event.
		// Emits `pointerout` event from `pointer.view`.
		this.pointer.out = function(e){
			if (e.pointer) {
				this.emit('globalpointerout', e);
				e.view.emitUpward('pointerout', e.pointer)
			}
		}.bind(this)

		// Event handler for `pointer.wheel` event.
		// Emits `pointerwheel` event from `pointer.view`.
		this.pointer.wheel = function(e){
			if (e.pointer) {
				this.emit('globalpointerwheel', e);
				e.view.emitUpward('pointerwheel', e.pointer)
			}
		}.bind(this)
	}

	// set the focus to a view node
	this.setFocus = function(view){
		if(this.focus_view !== view){
			var old = this.focus_view
			this.focus_view = view
			if(old) old.focus = Mark(false)
			view.focus = Mark(true)
		}
	}

	// internal, focus the next view from view
	this.focusNext = function(view){
		// continue the childwalk.
		var screen = this, found
		function findnext(node, find){
			for(var i = 0; i < node.children.length; i++){
				var view = node.children[i]
				if(view === find){
					found = true
				}
				else if(!isNaN(view.tabstop) && found){
					screen.setFocus(view)
					return true
				}
				if(findnext(view, find)) return true
			}
		}

		if(!findnext(this, view)){
			found = true
			findnext(this)
		}
	}

	// internal, focus the previous view from view
	this.focusPrev = function(view){
		var screen = this, last
		function findprev(node, find){
			for(var i = 0; i < node.children.length; i++){
				var view = node.children[i]
				if(find && view === find){
					if(last){
						screen.setFocus(last)
						return true
					}
				}
				else if(!isNaN(view.tabstop)){
					last = view
				}
				if(findprev(view, find)) return true
			}
		}
		if(!findprev(this, view)){
			findprev(this)
			if(last) screen.setFocus(last)
		}
	}

	// Modal handling

	// internal, check if a view is in the modal chain
	this.inModalChain = function(view){
		if(!view) return false
		if(!this.modal_stack.length) return true

		var last = this.modal_stack[this.modal_stack.length - 1]
		// lets check if any parent of node hits last
		var obj = view
		while(obj){
			if(obj === last){
				return true
			}
			obj = obj.parent
		}
		return false
	}

	// open a modal window from object like so: this.openModal( view({size:[100,100]}))
	this.closeModal = function(value){
		// lets close the modal window
		var modal_stack = this.modal_stack

		var mymodal = modal_stack.pop()
		if(!mymodal) return

		var id = this.screen.children.indexOf(mymodal)
		this.screen.children.splice(id, 1)

		this.modal = modal_stack[modal_stack.length - 1]

		mymodal.emitRecursive("destroy")

		this.redraw()

		mymodal.resolve(value)
	}

	this.openModal = function(render){
		var prom = new Promise(function(resolve, reject){
			// wrap our render function in a temporary view
			var vroot = view()
			// set up stuff
			vroot.render = render
			vroot.parent = this
			vroot.screen = this
			vroot.rpc = this.rpc
			vroot.parent_viewport = this
			// render it
			Render.process(vroot, undefined, undefined, true)

			var mychild = vroot.children[0]
			//console.log(mychild)
			this.children.push(mychild)
			mychild.parent = this
			mychild.resolve = resolve
			this.modal_stack.push(mychild)
			this.modal = mychild

			// lets cause a relayout
			this.relayout()
		}.bind(this))
		return prom
	}

	// open an overlay
	this.openOverlay = function(render){
		var vroot = view()
		// set up stuff
		vroot.render = render
		vroot.parent = this
		vroot.screen = this
		vroot.rpc = this.rpc
		vroot.parent_viewport = this
		// render it
		Render.process(vroot, undefined, undefined, true)

		var mychild = vroot.children[0]
		//console.log(mychild)
		this.children.push(mychild)
		mychild.parent = this
		this.relayout()
		// close function
		mychild.closeOverlay = function(){
			var idx = this.parent.children.indexOf(this)
			if(idx == -1) return
			this.parent.children.splice(idx, 1)
			this.parent.relayout()
		}

		return mychild
	}

	// animation

	// internal, start an animation, delegated from view
	this.startAnimationRoot = function(obj, key, value, track, resolve){
		// ok so. if we get a config passed in, we pass that in
		var config = obj.getAttributeConfig(key)

		var first = obj['_' + key]

		var anim = new Animate(config, obj, key, track, first, value)
		anim.resolve = resolve
		var animkey = obj.getViewGuid() + '_' + key
		this.anims[animkey] = anim
		obj.redraw()
		return true
	}

	// internal, stop an animation, delegated from view
	this.stopAnimationRoot = function(obj, key){
		var animkey = obj.getViewGuid() + '_' + key
		var anim = this.anims[animkey]
		if(anim){
			delete this.anims[animkey]
			if(anim.promise)anim.promise.reject()
		}
	}

	// internal, called when something renders
	this.atRender = function(){
		// lets add a debugview
		//this.children.push(debugview({}))
	}

	// internal, called by the renderer to animate all items in our viewtree
	this.doAnimation = function(time, redrawlist){
		for(var key in this.anims){
			var anim = this.anims[key]
			if(anim.start_time === undefined) anim.start_time = time
			var mytime = time - anim.start_time
			var value = anim.compute(mytime)
			if(value instanceof anim.End){
				delete this.anims[key]
				//console.log(value.last_value)
				anim.obj['_' + anim.key] = value.last_value
				anim.obj.emit(anim.key, {animate:true, end:true, key: anim.key, owner:anim.obj, value:value.last_value})
				anim.obj.redraw()
				if(anim.resolve) anim.resolve()
			}
			else{
				// what if we have a value with storage?
				anim.obj['_' + anim.key] = value
				if(anim.config.storage){
					anim.obj['_' + anim.config.storage][anim.config.index] = value
					anim.obj.emit(anim.config.storage, {type:'animation', key: anim.key, owner:anim.obj, value:value})
				}
				anim.obj.emit(anim.key, {animate:true, key: anim.key, owner:anim.obj, value:value})
				redrawlist.push(anim.obj)
			}
		}
	}

})
