/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require, $ui$, button, view, menubutton) {
	
	var FlexLayout = require('$system/lib/layout')
	var Render = require('$system/base/render')
	var Animate = require('$system/base/animate')

	this.attributes = {
		// the locationhash is a parsed JS object version of the #var2=1;var2=2 url arguments
		locationhash: Config({type:Object, value:{}}),
		// when the browser comes out of standby it fires wakup event
		wakeup: Config({type:Event}),

		// globally hookable input events
		globalkeyup: Config({type:Event}),
		globalkeydown: Config({type:Event}),
		globalkeypress: Config({type:Event}),
		globalkeypaste: Config({type:Event}),
		globalmousemove: Config({type:Event}),
		globalmouseleftdown: Config({type:Event}),
		globalmouseleftup: Config({type:Event}),
		globalmouserightdown: Config({type:Event}),
		globalmouserightup: Config({type:Event}),
		globalmousewheelx: Config({type:Event}),
		globalmousewheely: Config({type:Event}),
		status:""
	}

	this.bg = false

	this.rpcproxy = false	
	this.viewport = '2d'
	this.dirty = true
	this.flex = NaN
	this.flexdirection = "column"
	this.cursor = 'arrow'
	
	this.tooltip = 'Application'

	this.atConstructor = function(){
	}

	this.oninit = function (previous) {
		// ok. lets bind inputs
		this.modal_stack = []
		this.focus_view = undefined
		this.mouse_view = undefined
		this.mouse_capture = undefined
		this.keyboard = this.device.keyboard
		this.mouse = this.device.mouse 
		this.touch = this.device.touch
		this.midi = this.device.midi
		this.bindInputs()
	}
	
	this.defaultKeyboardHandler = function(target, v, prefix){
		if (!prefix) prefix = "";
		if(!v.name) return console.log("OH NOES",v)		
		var keyboard = this.screen.keyboard
		keyboard.textarea.focus()
		var name = prefix + 'keydown' + v.name[0].toUpperCase() + v.name.slice(1)
		this.undo_group++

		if(keyboard.leftmeta || keyboard.rightmeta) name += 'Cmd'
		if(keyboard.ctrl) name += 'Ctrl'
		if(keyboard.alt) name += 'Alt'
		if(keyboard.shift) name += 'Shift'
				
		if(target[name]) {
			target[name](v)
		}
		else{
			console.log(name);
			if (target.keydownHandler) target.keydownHandler(name);
		}
	}

	this.remapmatrix = mat4();
	this.invertedmousecoords = vec2();
	
	// display a classic "rightclick" or "dropdown" menu at position x,y - if no x,y is provided, last mouse coordinates will be substituted instead.
	this.contextMenu = function(commands, x,y){
		
		if (!y) y = this.mouse._y;
		if (!x) x = this.mouse._x;
		
		this.openModal(function(){
			var res = [];
			for(var a in commands){
				var c = commands[a];
				//console.log("menucommand: ", c);
				var act = c.clickaction;
				if (!act && c.commands){
					act = function(){
						console.log("opening submenu?"); 
						console.log(this.constructor.name, this.layout);
						this.screen.contextMenu(this.commands, this.layout.absx + this.layout.width, this.layout.absy);
						return true;
					}
				}
				res.push(
					menubutton({
						padding:vec4(5 ,0,5,4),
						margin:0,
						borderradius: 6,
						bold:false,
						text:c.name,
						
						buttoncolor1:"#a3a3a3",
						borderwidth:0,
						hovercolor1:"#737373",
						hovercolor2:"#737373", 
						buttoncolor2:"#a3a3a3",
						textcolor:"#3b3b3b",
						textactivecolor:"white",
						clickaction: act,
						commands: c.commands,
						click:function(){
							var close = false;
							if(this.clickaction) close = this.clickaction()
							if (!close) this.screen.closeModal(true);
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
				miss:function(){
					this.screen.closeModal(false)
				},
				init:function(){									
				},
				pos:[x,y],
				size:[300,NaN],position:'absolute'
			}, res)
		}.bind(this)).then(function(result){
			
		})

				
	};
	
	function UnProject(glx, gly, glz, modelview, projection){
		var inv = vec4();

		var A = mat4.mat4_mul_mat4(modelview, projection);
		var m = mat4.invert(A);



		inv[0]=glx;
		inv[1]=gly;
		inv[2]=2.0*glz-1.0;
		inv[3]=1.0;

		out = vec4.vec4_mul_mat4(inv, m);


		// divide by W to perform perspective!
		out[0] /= out[3];
		out[1] /= out[3];
		out[2] /= out[3];


		return vec3(out);
	}

	this.globalMouse = function(node){
		var sx = this.device.main_frame.size[0]  / this.device.ratio
		var sy = this.device.main_frame.size[1]  / this.device.ratio
		var mx = this.mouse._x/(sx/2) - 1.0
		var my = -1 * (this.mouse._y/(sy/2) - 1.0)

		return vec2(this.mouse._x, this.mouse._y);
	}
	
	// internal: remap the mouse to a view node	
	this.remapMouse = function(node, dbg){
			
		var parentlist = []
		var ip = node.parent
		
		var sx = this.device.main_frame.size[0]  / this.device.ratio
		var sy = this.device.main_frame.size[1]  / this.device.ratio
		var mx = this.mouse._x/(sx/2) - 1.0
		var my = -1 * (this.mouse._y/(sy/2) - 1.0)

		while (ip){
			if (ip._viewport || !ip.parent) parentlist.push(ip)
			ip = ip.parent
		}
		var logging = false
		if (dbg) 
		{
			logging = true;
		}
		
		if (logging)
		{
			//console.clear()
			console.log(node.constructor.name)
			console.log(node.layout);

		}
		if (logging){
			var	parentdesc = "Parentchain: "
			for(var i =parentlist.length-1;i>=0;i--) {
				parentdesc += parentlist[i].constructor.name + "("+parentlist[i]._viewport+") "
			}
			console.log(parentdesc)
		}
		
		var raystart = vec3(mx,my,-100)
		var rayend   = vec3(mx,my,100)
		var lastrayafteradjust = vec3(mx,my,-100)
		var lastprojection = mat4.identity()
		var lastviewmatrix = mat4.identity()
		var camerapos = vec3(0)
		var scaletemp = mat4.scalematrix([1,1,1])
		var transtemp2 = mat4.translatematrix([-1,-1,0])
		
		if (logging)  console.log(parentlist.length-1, raystart, "mousecoords in GL space")
		var lastmode = "2d"
		
		for(var i = parentlist.length - 1; i >= 0; i--) {
			var P = parentlist[i]
			
			var newmode = P.parent? P._viewport:"2d"
			if (logging) console.log(i, "logging for ", newmode, raystart, P.parent);
			if (P.parent) {

				var MM = P._viewport? P.viewportmatrix: P.totalmatrix
				
				if (!P.viewportmatrix) console.log(i, "whaaa" )
				mat4.invert(P.viewportmatrix, this.remapmatrix)

				if (lastmode == "3d") { // 3d to layer transition -> do a raypick.

					if (logging) console.log(i, lastrayafteradjust, "performing raypick on previous clipspace coordinates" )
					
					var startv = UnProject(lastrayafteradjust.x, lastrayafteradjust.y, 0, lastviewmatrix, lastprojection)
					var endv = UnProject(lastrayafteradjust.x, lastrayafteradjust.y, 1, lastviewmatrix, lastprojection)

					camlocal = vec3.mul_mat4(camerapos, this.remapmatrix)
					endlocal = vec3.mul_mat4(endv, this.remapmatrix)

					var R = vec3.intersectplane(camlocal, endlocal, vec3(0,0,-1), 0)
					if (!R)	{
						raystart = vec3(0.5,0.5,0)
					}
					else {
						R = vec3.mul_mat4(R, P.viewportmatrix)
						if (logging) console.log(i, R, "intersectpoint")
						raystart = R
					}
				}

				raystart = vec3.mul_mat4(raystart, this.remapmatrix)
			
				// console.log(i, ressofar, "viewportmatrix");
				
				if (logging)  console.log(i, "LAYOUT", P.layout.width, P.layout.height);
				
				mat4.scalematrix([P.layout.width/2,P.layout.height/2,1000/2], scaletemp)
				mat4.invert(scaletemp, this.remapmatrix)

				raystart = vec3.mul_mat4(raystart, this.remapmatrix)				
				// console.log(i, ressofar, "scalematrix");	

				raystart = vec3.mul_mat4(raystart, transtemp2)
			
				lastrayafteradjust = vec3(raystart.x, raystart.y,-1);
				lastprojection = P.drawpass.colormatrices.perspectivematrix;
				lastviewmatrix = P.drawpass.colormatrices.lookatmatrix;
				camerapos = P._camera;
				
				if (logging){
					if (lastprojection) mat4.debug(lastprojection);
				if (lastviewmatrix) 	mat4.debug(lastviewmatrix);
					console.log(i, raystart, "coordinates after adjusting for layoutwidth/height", P._viewport);
				}				

				
			
			}
			if(i == 0 && node.noscroll){
				if (logging) 
				{
					console.log("i==0, noscroll!");
				}
				mat4.invert(P.drawpass.colormatrices.noscrollmatrix, this.remapmatrix)
			} 
			else {
				if (logging){	
					console.log(i, "noscroll = false -  using regular viewmatrix!");
					mat4.debug(P.drawpass.colormatrices.viewmatrix);
				}
				mat4.invert(P.drawpass.colormatrices.viewmatrix, this.remapmatrix)
				
			}
			if (logging) mat4.debug(this.remapmatrix);
			raystart = vec3.mul_mat4(raystart, this.remapmatrix)
			
			lastmode = newmode
			// console.log(i, raystart, "last");	
		}
		if (logging) console.log(node._viewport, node.viewportmatrix, node.totalmatrix);
		var MM = node._viewport?node.viewportmatrix: node.totalmatrix
		mat4.invert(MM, this.remapmatrix)
		raystart = vec3.mul_mat4(raystart, this.remapmatrix)
		rayend = vec3.mul_mat4(rayend, this.remapmatrix)

		if (lastmode == "3d"){
			if (logging)  console.log("last mode was 3d..")
		}
		if (logging)
		{
		//	mat4.debug(MM);
			console.log(" ", raystart, "final transform using own worldmodel")
		}

		// console.log("_", ressofar, "result");

		return vec2(raystart.x, raystart.y)
	}
	
	// pick a view at the mouse coordinate and console.log its structure
	this.debugPick = function(){
		this.device.pickScreen(this.mouse.x, this.mouse.y).then(function(msg){
			var view = msg.view
			if(this.last_debug_view === view) return
			this.last_debug_view = view
			var found 
			function dump(walk, parent){
				var layout = walk.layout || {}
				var named = (new Function("return function "+(walk.name || walk.constructor.name)+'(){}'))()
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

	
	this.releaseCapture = function(){
		this.mouse_capture = undefined;
	}
	// bind all keyboard/mouse/touch inputs for delegating it into the view tree
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

		this.mouse.move = function(){
			this.emit('globalmousemove', {global:this.globalMouse(this)})
			// lets check the debug click
			if(this.keyboard.alt && this.keyboard.shift){
				return this.debugPick()
			} else this.last_debug_view = undefined

			// ok so. lets query the renderer for the view thats under the mouse
			if(!this.mouse_capture){
				this.device.pickScreen(this.mouse.x, this.mouse.y).then(function(view){
					if(!this.inModalChain(view)){
						this.mouse_view = view
						return
					}
					// lets find the mouseover or mousemove view
					var mo_view = view && view.findEmitUpward('mouseover')
					this.mouse_view = view
					if(this.mouse_over !== mo_view || mo_view && this.last_over_pick_id !== mo_view.last_pick_id){
						if(this.mouse_over) this.mouse_over.emitUpward('mouseout', {local:this.remapMouse(this.mouse_over)})
						this.mouse_over = mo_view
						if(this.mouse_over) this.mouse_over.emitUpward('mouseover', {global:this.globalMouse(this),local:this.remapMouse(this.mouse_over)})
					}
					if(view){
						view.computeCursor()
						view.emitUpward('mousemove', {global:this.globalMouse(this), local:this.remapMouse(view)})
					}
					this.last_over_pick_guid = view.last_pick_id

				}.bind(this))
			}
			else{
				this.mouse_capture.emitUpward('mousemove', {global:this.globalMouse(this),local:this.remapMouse(this.mouse_capture)})
			}
		}.bind(this)

		this.mouse.leftdown = function(){
			this.emit('globalmouseleftdown', {global:this.globalMouse(this)})

			if (!this.mouse_capture) {
				this.mouse_capture = this.mouse_view
			} 
			// lets give this thing focus
			//if (this.mouse_view){
				if(this.inModalChain(this.mouse_view)){
					this.setFocus(this.mouse_view)
					this.mouse_view.emitUpward('mouseleftdown', {global:this.globalMouse(this),local:this.remapMouse(this.mouse_view)})
				}
				else if(this.modal){
					this.modal.emitUpward('miss', {global:this.globalMouse(this)})
				}
			//} 
		}.bind(this)

		this.mouse.leftup = function(){
			this.emit('globalmouseleftup', {global:this.globalMouse(this)})
			// make sure we send the right mouse out/overs when losing capture
			this.device.pickScreen(this.mouse.x, this.mouse.y).then(function(view){
				if(this.mouse_capture){
					this.mouse_capture.emitUpward('mouseleftup', {global:this.globalMouse(this),local:this.remapMouse(this.mouse_capture), isover:this.mouse_capture === view})
				}
				if(this.mouse_capture !== view){
					if(this.mouse_capture) this.mouse_capture.emitUpward('mouseout', {global:this.globalMouse(this),local:this.remapMouse(this.mouse_capture)})
					if(view){
						var pos = this.remapMouse(view)
						view.computeCursor()
						view.emitUpward('mouseover', {local:pos})
						view.emitUpward('mousemove', {local:pos})
					}
				}
				else if(this.mouse_capture) this.mouse_capture.emitUpward('mouseover', {global:this.globalMouse(this),local:this.remapMouse(this.mouse_capture)})
				this.mouse_view = view
				this.mouse_capture = false
			}.bind(this))
		}.bind(this)

		this.mouse.wheelx = function(){
			this.emit('globalmousewheelx', {wheel:this.mouse.wheelx, global:this.globalMouse(this)})
			if (this.mouse_capture) this.mouse_capture.emitUpward('mousewheelx', {wheel:this.mouse.wheelx,global:this.globalMouse(this), local:this.remapMouse(this.mouse_capture)})
			else if(this.inModalChain(this.mouse_view)) this.mouse_view.emitUpward('mousewheelx', {wheel:this.mouse.wheelx, global:this.globalMouse(this),local:this.remapMouse(this.mouse_view)})
		}.bind(this)

		this.mouse.wheely = function(){
			this.emit('globalmousewheely', {wheel:this.mouse.wheely, global:this.globalMouse(this)})
			if (this.mouse_capture) this.mouse_capture.emitUpward('mousewheely', {wheel:this.mouse.wheely,global:this.globalMouse(this), local:this.remapMouse(this.mouse_capture)})
			else if(this.mouse_view && this.inModalChain(this.mouse_view) ){
				this.mouse_view.emitUpward('mousewheely', {wheel:this.mouse.wheely, global:this.globalMouse(this), local:this.remapMouse(this.mouse_view)})
			}
		}.bind(this)

		this.mouse.zoom = function(){
			if (this.mouse_capture) this.mouse_capture.emitUpward('mousezoom', {zoom:this.mouse.zoom, global:this.globalMouse(this), local:this.remapMouse(this.mouse_capture)})
			else if(this.mouse_view && this.inModalChain(this.mouse_view)){
				this.mouse_view.emitUpward('mousezoom', {zoom:this.mouse.zoom, global:this.globalMouse(this),local:this.remapMouse(this.mouse_view)})
			}
		}.bind(this)


		/*
		this.mouse.click = function () {
			if(this.modal_miss){
				this.modal_miss = false
				return
			}
			if (this.lastmouseguid > 0) {
				if (this.uieventdebug){
					console.log(" clicked: " + this.guidmap[this.lastmouseguid].constructor.name);
				}
				var overnode = this.guidmap[this.lastmouseguid];
				if (this.inModalChain(overnode) && overnode && overnode.emit) overnode.emit('click')
			}
		}.bind(this)

		this.mouse.dblclick = function () {
			if(this.modal_miss){
				this.modal_miss = false
				return
			}			
			if (this.lastmouseguid > 0) {
				if (this.uieventdebug){
					console.log(" clicked: " + this.guidmap[this.lastmouseguid].constructor.name);
				}
				var overnode = this.guidmap[this.lastmouseguid];
				if (this.inModalChain(overnode) && overnode && overnode.emit) overnode.emit('dblclick')
			}
		}.bind(this)

		*/
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

	// focus the next view from view
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

	// focus the previous view from view
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

	// check if a view is in the modal chain
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
	
	// close the current modal window
	this.closeModal = function(value){
		if(this.modal && this.modal.resolve)
			return this.modal.resolve(value)
	}
		
	this.releaseCapture = function(){
		if(this.mouse_capture){
			this.mouse_capture.emitUpward('mouseout', {global:this.globalMouse(this),local:this.remapMouse(this.mouse_capture)})
			this.mouse_capture = undefined				
		}
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
		return new Promise(function(resolve, reject){
			
			this.releaseCapture()

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
	}

	// animation


	// internal, start an animation, delegated from view
	this.startAnimationRoot = function(obj, key, value, track, promise){
		// ok so. if we get a config passed in, we pass that in
		var config = obj.getAttributeConfig(key)

		var first = obj['_' + key]

		var anim = new Animate(config, obj, key, track, first, value)
		anim.promise = promise
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

	// called when something renders
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
				if(anim.promise) anim.promise.resolve()
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
