/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$base/view', function() {
// Screens are the root of a view hierarchy, typically mapping to a physical device.

	this.attributes = {
		// internal, the locationhash is a parsed JS object version of the #var2=1;var2=2 url arguments
		locationhash: Config({type:Object, value:{}}),
		// when the browser comes out of standby it fires wakup event
		wakeup: Config({type:Event}),
		status:""
	}

	this.viewport = '2d'
	this.dirty = true
	this.cursor = 'arrow'
	this.tooltip = 'Application'
	this.pickbits = 8
	this.guid = ''

	this.oninit = function () {
		this.modal_stack = []
		this.draw_passes = []
		this.pick_passes = []
		this.anim_redraw = []

		this.commandRunner =this.CommandRunner.create(this)

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

		this.device.atDraw = this.drawColor.bind(this)
		this.device.atResize = this.resizeScreen.bind(this)
		this.device.atResolveRenderTarget = this.resolveRenderTarget.bind(this)
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
			id++
			node = this.nextViewWalk(node, this)
		}
	}

	this.resizeScreen = function(){
		this._size = vec2(this.device.main_frame.width / this.device.ratio, this.device.main_frame.height / this.device.ratio)
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
		create:function(screen){
			var obj =  Object.create(this)
			this.screen = screen
			this.device = screen.device
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
		getTarget: function(){
			var target = this.cmds[this.cmdid+1]
			this.cmdid += 2
		},
		drawShader: function(){
			var shader = this.cmds[this.cmdid+1]
			// lets draw it
			shader.system = this
			shader.draw(this.device, this.overlay)
			//console.log(shader._canvas.clean)
			this.cmdid += 2
		},
		setTotalMatrix: function(){
			this.totalmatrix = this.cmds[this.cmdid+1]
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
		canvas: function(){
			var cmds = this.cmds[this.cmdid+1]
			var view = this.cmds[this.cmdid+2]
			this.cmdstack.push(this.cmds, this.cmdid + 3)
			this.cmdid = 0
			this.cmds = cmds
		},
		readPixels: function(){
			var prop = this.cmds[this.cmdid + 1]
			this.cmdid += 2
			prop.resolve(this.device.readPixels(prop.x, prop.y, prop.w, prop.h, prop.buffer))
		}
	}

	this.debug_pick = false

	this.resolveRenderTarget = function(target){
		var res
		if(this.current_pass_is_pick && target.flags & this.Canvas.PICK){
			res = this.pick_rendertargets[target.targetguid]
		}
		else{
			res = this.color_rendertargets[target.targetguid]
		}
		return res
	}

	this.destroyRenderTarget = function(target){
		var tgt
		if(target.flags & this.Canvas.PICK){
			tgt = this.pick_rendertargets[target.targetguid]
			if(tgt){
				delete this.pick_rendertargets[target.targetguid]
				tgt.delete()
			}
		}
		tgt = this.color_rendertargets[target.targetguid]
		if(tgt){
			delete this.color_rendertargets[target.targetguid]
			tgt.delete()
		}
	}

	// lets pick the screen
	this.drawPick = function(pointer){

		if(!this.pick_passes || !this.pick_passes.length) return {}

		this.current_pass_is_pick = true

		var overlay = {
			_pixelentry:1
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

		var last_pick_main
		var pick_passes = this.pick_passes
		for(var passid = pick_passes.length - 1; passid >=0 ;passid -=2){
			// execute the commandbuffer
			var pass = pick_passes[passid]

			var ismain = !pass.view.parent && pass.target.name === 'viewport'

			if(ismain) last_pick_main = pass

			// lets create a render target!
			var guid = pass.target.targetguid
			var tgt = this.pick_rendertargets[guid]

			if(!tgt){
				if(ismain){
					if(!this.debug_pick){
						tgt = this.Texture.asRenderTarget(pass.target.flags, 1, 1, this.device)
					}
				}
				else{
					tgt = this.Texture.asRenderTarget(pass.target.flags, pass.target.width, pass.target.height, this.device)
				}
				this.pick_rendertargets[guid] = tgt
			}
			else if(tgt.width !== pass.target.width || tgt.height !== pass.target.height){
				tgt.resize(pass.target.width, pass.target.height)
			}

			this.device.bindFramebuffer(tgt)

			this.commandRunner.execute(pass.cmds, overlay, ismain && pickmatrices)
		}
		// gc the framebuffer set somehow?
		this.pick_passes.length = 0
		this.pick_passes.push(0,last_pick_main)

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
		var totalid = (data[0]<<16)|(data[1]<<8)|data[2]
		var viewid = totalid&( ((1<<24)-1) - mask)
		var drawid = totalid&mask

		//console.log(viewid>>16, drawid)
		var match = {
			view:this.pick_map[viewid],
			pickdraw:drawid
		}

		this.current_pass_is_pick = false

		return match
	}

	this.drawColor = function(stime, frameid){

		var anim_redraw = this.anim_redraw
		anim_redraw.length = 0

		this._time = stime

		// this.doAnimation(stime, anim_redraw)

		// lets lay it out
		this.doLayout()

		// clean out the drawpasses
		this.draw_passes.length = 0

		// lets draw the screen
		this.canvas.frameid = frameid

		this.drawView(stime, frameid)

		var overlay = {
			_pixelentry:0
		}

		this.device.bindFramebuffer(null)

		// lets run over the drawpasses
		var draw_passes = this.draw_passes
		for(var passid = draw_passes.length-1; passid >=0; passid -= 2){
			// execute the commandbuffer
			var pass = draw_passes[passid]
			var ismain = !pass.view.parent && pass.target.name === 'viewport'
			// Create the render targets
			var guid = pass.target.targetguid
			var tgt = this.color_rendertargets[guid]
			if(!tgt && !ismain){
				this.color_rendertargets[guid] = tgt = this.Shader.Texture.asRenderTarget(pass.target.flags, pass.target.width, pass.target.height, this.device)
			}
			else if(tgt && (tgt.width !== pass.target.width || tgt.height !== pass.target.height)){
				tgt.resize(pass.target.width, pass.target.height)
			}

			this.device.bindFramebuffer(tgt)
			this.commandRunner.execute(pass.cmds, overlay)
		}
		// gc the framebuffer set somehow?
		this.draw_passes.length = 0

		// lets rapidly walk all the commands for a getTarget

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

	// internal, bind all keyboard/pointer inputs for delegating it into the view tree
	this.bindInputs = function(){
		this.keyboard.down = function(v){
			if(!this.focus_view) return
			this.focus_view.emitUpward('keydown', v)
		}.bind(this)

		this.keyboard.up = function(v){
			if(!this.focus_view) return
			this.focus_view.emitUpward('keyup', v)
		}.bind(this)

		this.keyboard.press = function(v){
			// lets reroute it to the element that has focus
			if(!this.focus_view) return
			this.focus_view.emitUpward('keypress', v)
		}.bind(this)

		this.keyboard.paste = function(v){
			// lets reroute it to the element that has focus
			if(!this.focus_view) return
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
				this.emitPointer('pointerstart',e)
				this.pointer.cursor = e.view.getCursor()
				this.setFocus(e.view)
			}
		}.bind(this)

		// Event handler for `pointer.move` event.
		// Emits `pointermove` event from `pointer.view`.
		this.pointer.move = function(e){
			if (e.pointer) {
				this.emitPointer('pointermove',e)
			} else if (e.pointers) {
			}
		}.bind(this)

		// Event handler for `pointer.end` event.
		// Emits `pointerend` event `pointer.view` and computes the cursor.
		this.pointer.end = function(e){
			if (e.pointer) {
				this.emitPointer('pointerend',e)
				this.pointer.cursor = e.view.getCursor()
			}
		}.bind(this)

		// Event handler for `pointer.tap` event.
		// Emits `pointertap` event from `pointer.view`.
		this.pointer.tap = function(e){
			if (e.pointer) {
				this.emitPointer('pointertap',e)
			}
		}.bind(this)

		// Event handler for `pointer.hover` event.
		// Emits `pointerhover` event `pointer.view` and computes the cursor.
		this.pointer.hover = function(e){
			if (e.pointer) {
				this.emitPointer('pointerhover',e)
				this.pointer.cursor = e.view.getCursor()
			}
		}.bind(this)

		// Event handler for `pointer.over` event.
		// Emits `pointerover` event from `pointer.view`.
		this.pointer.over = function(e){
			if (e.pointer) {
				this.emitPointer('pointerover',e)
			}
		}.bind(this)

		// Event handler for `pointer.out` event.
		// Emits `pointerout` event from `pointer.view`.
		this.pointer.out = function(e){
			if (e.pointer) {
				this.emitPointer('pointerout',e)
			}
		}.bind(this)

		// Event handler for `pointer.wheel` event.
		// Emits `pointerwheel` event from `pointer.view`.
		this.pointer.wheel = function(e){
			if (e.pointer) {
				this.emitPointer('pointerwheel',e)
			}
		}.bind(this)
	}
})
