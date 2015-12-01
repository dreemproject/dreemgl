/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, $containers$view) {
	
	var FlexLayout = require('$system/lib/layout')
	var Render = require('$system/base/render')
	var Animate = require('$system/base/animate')

	this.attributes = {
		locationhash: {type:Object, value:{}}
	}

	this.bg = undefined
	this.rpcproxy = false	
	this.viewport = '2D'
	this.dirty = true
	this.flex = NaN
	this.flexdirection = "column"
	
	this.atConstructor = function(){
	}

	this.init = function (previous) {
		// ok. lets bind inputs
		this.modal_stack = []
		this.focus_view = undefined
		this.mouse_view = undefined
		this.mouse_capture = undefined
		this.keyboard = this.device.keyboard
		this.mouse = this.device.mouse 
		this.touch = this.device.touch
		this.bindInputs()
	}

	this.remapmatrix = mat4();
	this.invertedmousecoords = vec2();
	
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

	
	this.remapMouse = function(node, flags){

		var parentlist = []
		var ip = node.parent
		
		var sx =this.device.main_frame.size[0]  / this.device.ratio
		var sy =this.device.main_frame.size[1]  / this.device.ratio
		var mx =  this.mouse._x/(sx/2) - 1.0
		var my = -1 * (this.mouse._y/(sy/2) - 1.0)
		
		while (ip){
			if (ip._viewport || !ip.parent) parentlist.push(ip)
			ip = ip.parent
		}

		var logging = false

		if (logging) console.clear()
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
		var lastmode = "2D"
		
		for(var i = parentlist.length - 1; i >= 0; i--) {
			var P = parentlist[i]

			var newmode = P.parent? P._viewport:"2D"

			if (P.parent) {

				var MM = P._viewport? P.layermatrix: P.totalmatrix
				
				if (!P.layermatrix) console.log("whaaa" )
				mat4.invert(P.layermatrix, this.remapmatrix)

				if (lastmode == "3D") { // 3d to layer transition -> do a raypick.

					if (logging) console.log(i, lastrayafteradjust, "performing raypick on previous clipspace coordinates" )
					
					var startv = UnProject(lastrayafteradjust.x, lastrayafteradjust.y, 0, lastviewmatrix, lastprojection)
					var endv = UnProject(lastrayafteradjust.x, lastrayafteradjust.y, 1, lastviewmatrix, lastprojection)

					camlocal = vec3.mul_mat4(camerapos, this.remapmatrix)
					endlocal = vec3.mul_mat4(endv, this.remapmatrix)

					var R =vec3.intersectplane(camlocal, endlocal, vec3(0,0,-1), 0)
					if (!R)	{
						raystart = vec3(0.5,0.5,0)
					}
					else {
						R = vec3.mul_mat4(R, P.layermatrix)
						if (logging) console.log(i, R, "intersectpoint")
						raystart = R
					}
				}

				raystart = vec3.mul_mat4(raystart, this.remapmatrix)
			
				// console.log(i, ressofar, "layermatrix");

				mat4.scalematrix([P.layout.width/2,P.layout.height/2,1000/2], scaletemp)
				mat4.invert(scaletemp, this.remapmatrix)

				raystart = vec3.mul_mat4(raystart, this.remapmatrix)				
				// console.log(i, ressofar, "scalematrix");	

				raystart = vec3.mul_mat4(raystart, transtemp2)
			
				if (logging)  console.log(i, raystart, "coordinates after adjusting for layoutwidth/height", P._viewport);
				
				lastrayafteradjust = vec3(raystart.x, raystart.y,-1);
				lastprojection = P.drawpass.colormatrices.perspectivematrix;
				lastviewmatrix = P.drawpass.colormatrices.lookatmatrix;
				camerapos = P._camera;
			
			}
			if(i == 0 && node.noscroll){
				mat4.invert(P.drawpass.colormatrices.noscrollmatrix, this.remapmatrix)
			} 
			else {
				mat4.invert(P.drawpass.colormatrices.viewmatrix, this.remapmatrix)
			}
			raystart = vec3.mul_mat4(raystart, this.remapmatrix)
			
			lastmode = newmode
			// console.log(i, raystart, "last");	
		}

		var MM = node._viewport?node.layermatrix: node.totalmatrix
		mat4.invert(MM, this.remapmatrix)
		raystart = vec3.mul_mat4(raystart, this.remapmatrix)
		rayend = vec3.mul_mat4(rayend, this.remapmatrix)

		if (lastmode == "3D"){
			if (logging)  console.log("last mode was 3d..")
		}
		if (logging)  console.log(" ", raystart, "final transform using own worldmodel")

		// console.log("_", ressofar, "result");

		var ret = vec2(raystart.x, raystart.y)
		ret.flags = flags

		return ret
	}
	
	this.debugPick = function(){
		this.device.pickScreen(this.mouse.x, this.mouse.y).then(function(view){
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

	this.bindInputs = function(){
		this.keyboard.down = function(v){
			if(!this.focus_view) return
			if(!this.inModalChain(this.focus_view)) return
			this.focus_view.emitUpward('keydown', v)
		}.bind(this)

		this.keyboard.up = function(v){
			if(!this.focus_view) return
			if(!this.inModalChain(this.focus_view)) return
			this.focus_view.emitUpward('keyup', v)
		}.bind(this)

		this.keyboard.press = function(v){
			// lets reroute it to the element that has focus
			if(!this.focus_view) return
			if(!this.inModalChain(this.focus_view)) return
			this.focus_view.emitUpward('keypress', v)
		}.bind(this)

		this.keyboard.paste = function(v){
			// lets reroute it to the element that has focus
			if(!this.focus_view) return
			if(!this.inModalChain(this.focus_view)) return
			this.focus_view.emitUpward('keypaste', v)
		}.bind(this)

		this.mouse.move = function(){
			// lets check the debug click
			if(this.keyboard.alt && this.keyboard.shift){
				return this.debugPick()
			} else this.last_debug_view = undefined


			// ok so. lets query the renderer for the view thats under the mouse
			if(!this.mouse_capture){
				this.device.pickScreen(this.mouse.x, this.mouse.y).then(function(view){
					if(this.mouse_view !== view){
						if(this.mouse_view) this.mouse_view.emit('mouseout', this.remapMouse(this.mouse_view))
						this.mouse_view = view
						if(view) this.mouse_view.emit('mouseover', this.remapMouse(this.mouse_view))
					}
					if(view) view.emit('mousemove', this.remapMouse(view))

				}.bind(this))
			}
			else{
				this.mouse_capture.emit('mousemove', this.remapMouse(this.mouse_capture))
			}
		}.bind(this)

		this.mouse.leftdown = function(){

			if (!this.mouse_capture) {
				this.mouse_capture = this.mouse_view
			} 
			// lets give this thing focus
			if (this.mouse_view){
				if(this.inModalChain(this.mouse_view)){
					this.setFocus(this.mouse_view)
					this.mouse_view.emit('mouseleftdown', this.remapMouse(this.mouse_view))
				}
				else if(this.modal){
					this.modal_miss = true
					this.modal.emit('miss', this.remapMouse(this.mouse_view))
				}
			} 
		}.bind(this)

		this.mouse.leftup = function(){
			// make sure we send the right mouse out/overs when losing capture
			this.device.pickScreen(this.mouse.x, this.mouse.y).then(function(view){
				if(this.mouse_capture){
					this.mouse_capture.emit('mouseleftup', this.remapMouse(this.mouse_capture, {over:this.mouse_capture === view}))
				}
				if(this.mouse_capture !== view){
					if(this.mouse_capture) this.mouse_capture.emit('mouseout', this.remapMouse(this.mouse_capture))
					if(view){
						var pos = this.remapMouse(view)
						view.emit('mouseover', pos)
						view.emit('mousemove', pos)
					}
				}
				else if(this.mouse_capture) this.mouse_capture.emit('mouseover', this.remapMouse(view))
				this.mouse_view = view
				this.mouse_capture = false
			}.bind(this))
		}.bind(this)

		this.mouse.wheelx = function(){
			if (this.mouse_capture) this.mouse_capture.emitUpward('mousewheelx', this.mouse.wheelx)
			else if(this.inModalChain(this.mouse_view)) this.mouse_view.emitUpward('mousewheelx', this.mouse.wheelx)
		}.bind(this)

		this.mouse.wheely = function(){
			if (this.mouse_capture) this.mouse_capture.emitUpward('mousewheely', this.mouse.wheely)
			else if(this.mouse_view && this.inModalChain(this.mouse_view) ){
				this.mouse_view.emitUpward('mousewheely', this.mouse.wheely)
			}
		}.bind(this)

		this.mouse.zoom = function(){
			if (this.mouse_capture) this.mouse_capture.emitUpward('mousezoom', this.mouse.zoom)
			else if(this.mouse_view && this.inModalChain(this.mouse_view)){
				this.mouse_view.emitUpward('mousezoom', this.mouse.zoom)
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


	// Focus handling


	this.setFocus = function(view){
		if(this.focus_view !== view){
			var old = this.focus_view
			this.focus_view = view
			if(old) old.emit('focuslost')
			view.emit('focusget')
		}
	}

	this.focusNext = function(obj){
		// continue the childwalk.
		var screen = this, found 
		function findnext(node, find){
			for(var i = 0; i < node.children.length; i++){
				var obj = node.children[i]
				if(obj === find){
					found = true
				}
				else if(obj.tabstop && found){
					screen.setFocus(obj)
					return true
				}
				if(findnext(obj, find)) return true
			}
		}
		
		if(!findnext(this, obj)){
			found = true
			findnext(this)
		}
	}

	this.focusPrev = function(obj){
		var screen = this, last
		function findprev(node, find){
			for(var i = 0; i < node.children.length; i++){
				var obj = node.children[i]
				if(find && obj === find){
					if(last){
						screen.setFocus(last)
						return true
					}
				}
				else if(obj.tabstop){
					last = obj
				}
				if(findprev(obj, find)) return true
			}
		}
		if(!findprev(this, obj)){
			findprev(this)
			if(last) screen.setFocus(last)
		}
	}


	// Modal handling


	this.inModalChain = function(node){
		if(!this.modal_stack.length) return true
		var last = this.modal_stack[this.modal_stack.length - 1]
		// lets check if any parent of node hits last
		var obj = node
		while(obj){
			if(obj === last) return true
			obj = obj.parent
		}
		return false
	}
	
	this.closeModal = function(value){
		if(this.modal && this.modal.resolve)
			return this.modal.resolve(value)
	}
	
	this.openModal = function(object){
		return new Promise(function(resolve, reject){
			Render.process(object, undefined, this.globals)
			object.parent = this
			this.children.push(object)
			this.modal_stack.push(object)
			this.modal = object

			object.resolve = function(value, rej){
				// lets close the modal window
				var id = this.screen.children.indexOf(this)
				this.screen.children.splice(id, 1)

				if(rej) reject(value)
				else resolve(value)

				var modal_stack = this.screen.modal_stack
				modal_stack.pop()
				this.screen.modal = modal_stack[modal_stack.length - 1]
				
				this.setDirty()
				this.emitRecursive("destroy")
				this.screen.setDirty(true)
			}

			object.reject = function(value){
				this.resolve(value, true)
			}

			object.reLayout()
			object.setDirty(true)
		}.bind(this))
	}

	// animation

	this.startAnimationRoot = function(obj, key, value, track, promise){
		// ok so. if we get a config passed in, we pass that in
		var config = obj.getAttributeConfig(key)
		var first = obj['_' + key]

		var anim = new Animate(config, obj, key, track, first, value)

		anim.promise = promise
		var animkey = obj.pickguid + '_' + key
		this.anims[animkey] = anim
		obj.redraw()
		return true
	}

	this.stopAnimationRoot = function(obj, key){
		var animkey = obj.pickguid + '_' + key
		var anim = this.anims[animkey]
		if(anim){
			delete this.anims[animkey]			
			if(anim.promise)anim.promise.reject()
		}
	}

	this.pauseAnimationRoot = function(obj, key){
		// uh ok pausing an animation.

	}

	this.playAnimationRoot = function(obj, key){

	}

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
				anim.obj.emit(anim.key, {type:'animation_end', key: anim.key, owner:anim.obj, value:value.last_value})
				anim.obj.redraw()
				if(anim.promise) anim.promise.resolve()
			}
			else{
				// what if we have a value with storage?
				anim.obj['_' + anim.key] = value
				if(anim.config.storage){
					anim.obj['_' + anim.config.storage][anim.config.index] = value
					anim.obj.emit(anim.config.storage, {type:'animation', key: anim.key, owner:anim.obj, value:value.last_value})
				}
				anim.obj.emit(anim.key, {type:'animation', key: anim.key, owner:anim.obj, value:value.last_value})
				redrawlist.push(anim.obj)
			}
		}
	}
})
