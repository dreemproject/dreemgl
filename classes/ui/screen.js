/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

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
	this.pickbits = 9
	this.guid = ''

	this.atConstructor = function(){
	}

	this.oninit = function () {
		// ok. lets bind inputs
		this.modal_stack = []
		this.draw_passes = []
		this.pick_passes = []
		this.anim_redraw = []
		// use 2 different matrix stores

		this.commandRunner =this.CommandRunner.create(this.device)

		this.pick_map = {}
		this.pick_viewmatrix = mat4()
		this.pick_noscrollmatrix = mat4()

		this.pick_rendertargets = {}
		this.color_rendertargets = {}

		this.focus_view = undefined
		this.keyboard = this.device.keyboard
		this.pointer = this.device.pointer
		this.midi = this.device.midi
		this.bindInputs()

		this.device.atDraw = this.doDraw.bind(this)
		this.device.atResize = this.doResize.bind(this)
	}

	this.nextViewWalk = function(iter, end){
		var doenter =  true//!draw._viewport && draw._visible && draw._drawtarget !== nottype)
		var next = iter.children[0]
		var next_index = 0
		while(!next){ // skip to parent next
			if(iter === end) break
			next_index = iter.draw_index + 1
			iter = iter.parent
			next = iter.children[next_index]
		}
		if(next === end) return undefined
		if(next) next.draw_index = next_index
		return next
	}

	this.atNewlyRendered = function(item){
		var node = this
		var id = 1
		var mul = 1<<(24-this.pickbits)
		while(node){
			node.pickview = id * mul
			this.pick_map[node.pickview] = node
			node = this.nextViewWalk(node, this)
		}
	}

	this.doResize = function(){
		this._maxsize =
		this._size = vec2(this.device.main_frame.size[0] / this.device.ratio, this.device.main_frame.size[1] / this.device.ratio)
		this.relayout()
	}

	this.redraw = function(){
		if(this.draw_dirty) return
		this.draw_dirty = true

		if(this.device) {
			this.device.redraw()
		}
	}

	// command execution
	this.CommandRunner = {
		create:function(device){
			var obj =  Object.create(this)
			this.device = device
			this.cmdstack = []
			return obj
		},
		execute: function(cmds, overlay, replace_matrices){
			this.replace_matrices = replace_matrices
			this.cmds = cmds
			this.cmdid = 0
			this.overlay = overlay
			while(this.cmdid < this.cmds.length){
				// dispatch
				var command = this.cmds[this.cmdid]
				this[command]()
				// unroll the stack
				while(this.cmdstack.length > 0 && this.cmdid === this.cmds.length){
					// pop the stack
					this.cmdid = this.cmdstack.pop()
					this.cmds = this.cmdstack.pop()
				}
			}
		},
		drawShader: function(){
			var shader = this.cmds[this.cmdid+1]
			// lets draw it	
			shader.state = this
			shader.draw(this.device, this.overlay)
			//console.log(shader._context.clean)
			this.cmdid += 2
		},
		setViewMatrix: function(){
			var name = this.cmds[this.cmdid+2]
			this.viewmatrix = this.replace_matrices && this.replace_matrices[name] || this.cmds[this.cmdid+1]
			this.cmdid += 3
		},
		clear: function(){
			var color = this.cmds[this.cmdid+1]
			this.device.clear(color[0], color[1], color[2], color[3])
			this.cmdid += 2
		},
		context: function(){
			var cmds = this.cmds[this.cmdid+1]
			var view = this.cmds[this.cmdid+2]
			this.cmdstack.push(this.cmds, this.cmdid + 3)
			this.cmdid = 0
			this.cmds = cmds
		}
	}

	this.debug_pick = false

	// lets pick the screen
	this.doPick = function(pointer){

		if(!this.main_pass) return {}

		var overlay = {			
			_pixelentry:1
		}

		var pick_passes = this.pick_passes
		if(!pick_passes.length){
			pick_passes.push(0,this.main_pass)
		}

		var pick_matrices

		if(!this.debug_pick){
	
			var scroll = this.scroll
			var sizel = 0, sizer = 1

			mat4.ortho(scroll[0] + pointer[0] - sizel, scroll[0] + pointer[0] + sizer, scroll[1] + pointer[1] - sizer,  scroll[1] + pointer[1] + sizel, -100, 100, this.pick_viewmatrix)
			mat4.ortho(pointer[0] - sizel, pointer[0] + sizer, pointer[1] - sizer, pointer[1] + sizel, -100, 100, this.pick_noscrollmatrix)

			var pickmatrices = {
				noscroll:this.pick_noscrollmatrix,
				view:this.pick_viewmatrix
			}
		}

		for(var passid = 0; passid < pick_passes.length;passid +=2){
			// execute the commandbuffer
			var pass = pick_passes[passid + 1]
			var ismain = this.main_pass === pass

			// lets create a render target!
			var guid = pass.target.targetguid
			var tgt = this.pick_rendertargets[guid]
			if(!tgt){
				if(ismain) tgt = this.Shader.Texture.createRenderTarget(pass.target.flags, 1, 1, this.device)
				else tgt = this.Shader.Texture.createRenderTarget(pass.target.flags, pass.target.width, pass.target.height, this.device)
				this.pick_rendertargets[guid] = tgt
			}

			this.device.bindFramebuffer(tgt)

			this.commandRunner.execute(pass.cmds, overlay, ismain && pickmatrices)
		}
		// gc the framebuffer set somehow?
		this.pick_passes.length = 0

		// then readpixels
		var data 
		if(this.debug_pick){
			data = this.device.readPixels(pointer[0]*this.device.ratio, this.device.main_frame.size[1] - pointer[1] * this.device.ratio, 1, 1)
		}
		else{
			data = this.device.readPixels(0,0,1,1)
		}

		// decode the pass and drawid
		var mask = ((1<<(24-this.pickbits))-1)
		var totalid = data[0]<<16|data[1]<<8|data[2]
		var viewid = totalid&( ((1<<24)-1) - mask)
		var drawid = totalid&mask

		var match = {
			view:this.pick_map[viewid],
			pickdraw:drawid
		}

		return match
	}

	this.doDraw = function(stime, frameid){

		var anim_redraw = this.anim_redraw
		anim_redraw.length = 0

		this.doAnimation(stime, anim_redraw)

		// lets lay it out
		this.doLayout()

		// clean out the drawpasses
		this.draw_passes.length = 0

		// lets draw the screen
		this.context.frameid = frameid
		
		this.drawView()

		var overlay = {
			_pixelentry:0,
			vertex_displace:vec4(0,0,0,0)
		}
		
		this.device.bindFramebuffer(null)

		// lets run over the drawpasses
		var draw_passes = this.draw_passes
		for(var passid = 0; passid < draw_passes.length;passid +=5){
			// execute the commandbuffer
			var pass = draw_passes[passid + 1]

			var ismain = this.main_pass === pass
			// Create the render targets
			var guid = pass.target.targetguid
			var tgt = this.color_rendertargets[guid]
			if(!tgt && !ismain){
				this.color_rendertargets[guid] = tgt = this.Shader.Texture.createRenderTarget(pass.target.flags, pass.target.width, pass.target.height, this.device)
			}
			this.device.bindFramebuffer(tgt)
			this.commandRunner.execute(pass.cmds, overlay)
		}
		// gc the framebuffer set somehow?
		this.draw_passes.length = 0

		if(anim_redraw.length){
			//console.log("REDRAWIN", this.draw_hooks)
			var redraw = false
			for(var i = 0; i < anim_redraw.length; i++){
				var aredraw = anim_redraw[i]
				if(!aredraw.atAfterDraw || aredraw.atAfterDraw()){
					redraw = true
					aredraw.redraw()
				}
			}
			return redraw
		}
	}
	
	this.walkTree = function(view){
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
			for(var key in walk.shaders){
				if(so) so += ", "
				so += key//+':'+walk.shader_order[key]
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
		dump(this, null)
		return found
	}

	// pick a view at the pointer coordinate and console.log its structure
	/*
	this.debugPick = function(x, y){
		this.device.pickScreen(x, y).then(function(msg){
			var view = msg.view
			if(this.last_debug_view === view) return
			this.last_debug_view = view
			console.log(this.walkTree(view))
		}.bind(this))
	}*/

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

		this.emitPointer = function(name, e){
			var p = e.pointer
			var draw = e.view.draw_objects[p.pickdraw]
			if(draw && (draw['_listen_'+name] || draw['on'+name])){
				draw.emit(name, e.pointer)
			}
			else e.view.emitUpward(name, e.pointer)
		}


		// Event handler for `pointer.start` event.
		// Emits `pointerstart` event from `pointer.view` and computes the cursor.
		this.pointer.start = function(e){
			if (e.pointer) {
				this.emit('globalpointerstart', e)
				this.emitPointer('pointerstart',e)
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
				this.emitPointer('pointermove',e)
			} else if (e.pointers) {
				this.emit('globalpointermultimove', e)
			}
		}.bind(this)

		// Event handler for `pointer.end` event.
		// Emits `pointerend` event `pointer.view` and computes the cursor.
		this.pointer.end = function(e){
			if (e.pointer) {
				this.emit('globalpointerend', e)
				this.emitPointer('pointerend',e)
				e.view.computeCursor()
			}
		}.bind(this)

		// Event handler for `pointer.tap` event.
		// Emits `pointertap` event from `pointer.view`.
		this.pointer.tap = function(e){
			if (e.pointer) {
				this.emit('globalpointertap', e)
				this.emitPointer('pointertap',e)
			}
		}.bind(this)

		// Event handler for `pointer.hover` event.
		// Emits `pointerhover` event `pointer.view` and computes the cursor.
		this.pointer.hover = function(e){
			if (e.pointer) {
				this.emit('globalpointerhover', e);
				this.emitPointer('pointerhover',e)
				e.view.computeCursor()
			}
		}.bind(this)

		// Event handler for `pointer.over` event.
		// Emits `pointerover` event from `pointer.view`.
		this.pointer.over = function(e){
			if (e.pointer) {
				this.emit('globalpointerover', e)
				this.emitPointer('pointerover',e)
			}
		}.bind(this)

		// Event handler for `pointer.out` event.
		// Emits `pointerout` event from `pointer.view`.
		this.pointer.out = function(e){
			if (e.pointer) {
				this.emit('globalpointerout', e)
				this.emitPointer('pointerout',e)
			}
		}.bind(this)

		// Event handler for `pointer.wheel` event.
		// Emits `pointerwheel` event from `pointer.view`.
		this.pointer.wheel = function(e){
			if (e.pointer) {
				this.emit('globalpointerwheel', e)
				this.emitPointer('pointerwheel',e)
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
	this.startAnimationRoot = function(animkey, config, first, obj, key, value, track, resolve){
		// ok so. if we get a config passed in, we pass that in
		var anim = new Animate(config, obj, key, track, first, value)
		anim.resolve = resolve
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
				if(('_' + anim.key) in anim.obj){
					anim.obj['_' + anim.key] = value.last_value
					anim.obj.emit(anim.key, {animate:true, end:true, key: anim.key, owner:anim.obj, value:value.last_value})
					anim.obj.redraw()
				}
				else{
					anim.obj[anim.key] = value.last_value
				}
				if(anim.resolve) anim.resolve()
			}
			else{
				// what if we have a value with storage?
				if(('_' + anim.key) in anim.obj){
					anim.obj['_' + anim.key] = value
					if(anim.config.storage){
						anim.obj['_' + anim.config.storage][anim.config.index] = value
						anim.obj.emit(anim.config.storage, {type:'animation', key: anim.key, owner:anim.obj, value:value})
					}
					anim.obj.emit(anim.key, {animate:true, key: anim.key, owner:anim.obj, value:value})
				}
				else{
					anim.obj[anim.key] = value
				}
				redrawlist.push(anim.obj)
			}
		}
	}

})
