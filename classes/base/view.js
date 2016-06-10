/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

"use strict"

define.class('$base/node', function(require){
	// Base UI view Object

	var FlexLayout = require('$system/lib/layout')

	var view = this.constructor

	var Canvas = require('$base/canvas')

	this.Shader = require('$base/shader')
	this.Texture = require('$base/texture')
	this.Canvas = Object.create(Canvas.prototype)

	this.attributes = {
		// visibility
		visible: true,
		drawtarget: Config({type:Enum('both','pick','color'), value:'both'}),
		// pos(ition) of the view, relative to parent. For 2D only the first 2 components are used, for 3D all three.
		pos: Config({type:vec3, value:vec3(0,0,0), meta:'xyz'}),
		// the clear color of the view when it is in '2D' or '3D' viewport mode
		clearcolor: Config({group:'style',type:vec4, value: vec4('transparent'), meta:'color'}),
		// size, this holds the width/height/depth of the view. When set to NaN it means the layout engine calculates the size
		size: Config({type:vec3, value:vec3(NaN), meta:'xyz'}),
		// the margin on 4 sides of the box (left, top, right, bottom). Can be assigned a single value to set them all at once
		margin: Config({type: vec4, value: vec4(0,0,0,0), meta: 'ltrb'}),
		// the padding on 4 sides of the box (left, top, right, bottom) Can be assigned a single value to set them all at once
		padding: Config({type: vec4, value: vec4(0,0,0,0), meta: 'ltrb'}),
		// the layout object, contains width/height/top/left after computing. Its a read-only property and should be used in shaders only.
		// Can be listened to to observe layout changes
		layout: Config({ type:Object, value:{}, meta:'hidden'}),
		bgimagemode: Config({group:'style', type:Enum('stretch', 'aspect-fit', 'aspect-fill', 'custom', 'resize'), value:'resize'}),
		bgimageaspect: Config({group:'style', value:vec2(1,1)}),
		bgimageoffset: Config({group:'style', value:vec2(0,0)}),
		// the background color of a view, referenced by various shaders
		bgcolor: Config({group:'style', type:vec4, value: vec4(NaN), meta:'color'}),
		// the background image of a view. Accepts a string-url or can be assigned a require('./mypic.png')
		bgimage: Config({group:'style',type:Object, meta:'texture'}),
		// the opacity of the image
		opacity: Config({group:'style', value: 1.0, type:float}),
		// the scroll position of the view matrix, allows to scroll/move items in a viewport. Only works on a viewport:'2D'
		// this property is manipulated by the overflow:'SCROLL' scrollbars
		scroll: Config({type:vec2, value:vec2(0, 0), persist: true}),
		// the zoom factor of the view matrix, allows zooming of items in a viewport. Only works on viewport:'2D'
		zoom: Config({type:float, value:1}),
		// overflow control, shows scrollbars when the content is larger than the viewport. If any value is set, it defaults to viewport:'2D'
		// works the same way as the CSS property
		overflow: Config({type: Enum('','hidden','scroll','auto','hscroll','vscroll'), value:''}),
		// When set to 2D or 3D the render engine will create a separate texture pass for this view and all its children
		// using a 2D viewport is a great way to optimize render performance as when nothing changes, none of the childstructures
		// need to be processed and a single texture can just be drawn by the parent
		// the viewportblend shader can be used to render this texture it into its parent
		viewport: Config({group:'layout', type:Enum('','2d','3d'), value:''})
	}

	this.name = ''
	this.class = ''

	// trigger a redraw.
	this.redraw = function(){
		if(this.draw_dirty) return
		var parent = this
		var screen = this.screen
		while(parent !== screen && !parent.draw_dirty){
			parent.draw_dirty = true
			parent = parent.parent
		}
		if(screen) {
			screen.redraw()
		}
	}

	// trigger a relayout
	this.relayout = function(){
		if(this.layout_dirty) return
		var parent = this
		while(!parent.layout_dirty){
			parent.layout_dirty = true
		}
		this.redraw()
	}

	// trigger a matrix update
	this.rematrix = function(){
		if(this.matrix_dirty) return
		this.matrix_dirty = true
		this.redraw()
	}

	// draw dirty true
	this.draw_dirty = true
	// layout dirty causes a relayout to occur
	this.layout_dirty = true
	// update matrix stack
	this.matrix_dirty = true

	this.pickview = 0

	// the number of pick ID's to reserve for this view.
	this.boundscheck = true

	// the local matrix
	this.modelmatrix = mat4.identity()
	// the concatenation of all parent model matrices
	this.totalmatrix = mat4.identity()

	// forward references for shaders
	this.layout = {width:0, height:0, left:-1, top:-1, right:0, bottom:0}
	this.screen = {device:{size:vec2(), frame:{size:vec2()}}}

	// turn off rpc proxy generation for this prototype level
	this.rpcproxy = false

	// internal, initialization of a view
	this.atViewInit = function(prev){

		this.anims = {}
		this.matrix_store = {}
		this.draw_canvas = {}
		this.draw_objects = {}
		//this.layout = {width:0, height:0, left:0, top:0, right:0, bottom:0}

		this.initialized = true

		// matrices
		if(prev){
			this.modelmatrix = prev.modelmatrix
			this.totalmatrix = prev.totalmatrix
			this.layout = prev.layout
		}
		else{
			this.modelmatrix = mat4()
			if(this._viewport) this.totalmatrix = mat4.identity()
			else this.totalmatrix = mat4.identity()
		}

		this.canvas = Object.create(this.Canvas)
		this.canvas.initCanvas(this)

		this.atFlag1 = this.redraw
		this.atFlag2 = this.relayout
		this.atFlag4 = this.rematrix
	}

	this.atViewDestroy = function(){
		for(var key in this.render_targets){
			this.screen.destroyRenderTarget(this.render_targets[key])
		}
	}

	this.drawBackground = function(){
		var c = this.canvas
		if(this._viewport === '2d'){
			c.setViewMatrix('noscroll')
		}
		if (this.dropshadowopacity > 0){
			c.drawDropshadow()
		}
		if(this.bgimage){
			if(this.borderradius[0]>0){
				c.drawImage()
			}
			else{
				c.drawRoundedimage()
			}
		}
		else if(!isNaN(this.bgcolor[0])){
			c.bgcolor = this.bgcolor
			if(this.borderradius[0]>0){
				c.drawRoundedrect(0, 0, c.width, c.height)
			}
			else{
				c.drawRect({x:0, y:0, w:c.width, h:c.height})
			}
		}
		if(this._viewport === '2d'){
			c.setViewMatrix('view')
		}
	}

	// the user draw function
	this.draw = function(stime, frameid){
		this.drawBackground(stime, frameid)
		this.drawChildren(stime, frameid)
	}

	this.drawChildren = function(stime, frameid){
		var c = this.canvas
		var redraw
		// TODO add boundingbox clipping
		for(var i = 0;i < this.children.length;i++){
			var child = this.children[i]
			// include it in our drawlist
			c.addCanvas(child.canvas, i)
			child.drawView(stime, frameid)
		}
		return redraw
	}

	this.drawView = function(stime, frameid){
		var c = this.canvas
		c.width = this._layout.width
		c.height = this._layout.height
		this._time = this.screen._time
		if(!this._viewport && !this.draw_dirty) return

		// clear commandset
		c.clearCmds()

		// lets set our turtle values
		var t = c.turtle

		//TODO pull these from a view?
		t._align = float.LEFTTOP
		t._walk = float.LRTBWRAP			
		t._margin = [0,0,0,0]
		t._padding = [0,0,0,0]

		c.beginTurtle()

		var redraw
		// alright its a viewport, render to a texture
		if(this._viewport){
			// do the 2d
			var tgt
			if(this._viewport === '2d'){
				this.viewport_target =
				tgt = c.pushTarget('viewport', c.RGBA|c.PICK)
				c.setOrthoViewMatrix(!this.parent)
			}
			else{
				this.viewport_target =
				tgt = c.pushTarget('viewport', c.RGBA|c.DEPTH|c.PICK)
				c.setPerspectiveViewMatrix()
			}
			if(this.draw_dirty){
				c.clear(this.clearcolor)
				this.atAttributeGetFlag = 2
				redraw = this.draw(stime, frameid)
				this.atAttributeGetFlag = 0
				this.draw_dirty = false
			}
			c.popTarget()
			//c.blendDraw(tgt)
		}
		else if(this.draw_dirty){
			this.atAttributeGetFlag = 2
			redraw = this.draw(stime, frameid)
			this.atAttributeGetFlag = 0
			this.draw_dirty = false
		}

		c.endTurtle()

		this.layoutchanged = false
		// check time
		if(this._flag_time&2 || redraw){
			this.screen.anim_redraw.push(this)
		}

		for(var guid in this.render_targets){
			var target = this.render_targets[guid]
			if(target.frameid !== c.frameid){
				this.render_targets[guid] = undefined
				this.screen.destroyRenderTarget(target)
			}
		}
	}

	// lets manage the drawcanvas
	this.atInnerClassAssign = function(key, value){
		// its a class assignment
		var cls
		if(typeof value === 'function' && Object.getPrototypeOf(value.prototype) !== Object.prototype){
			this['_' + key] = value
			cls = value.prototype
		}
		else{
			// its inheritance
			cls = this['_' + key]
			cls = this['_' + key] = cls.extend(value, this)
			cls = cls.prototype
		}
		if(cls._canvasverbs){
			if(!this.hasOwnProperty('Canvas')) this.Canvas = Object.create(this.Canvas)

			Canvas.compileCanvasVerbs(this, this.Canvas, key, cls)
			//}
			//else debugger
		}
	}

	this.onbgimage = function(){
		if(this.initialized){
			if(typeof this._bgimage === 'string'){
				// Path to image was specified
				if(require.loaded(this._bgimage)){
					var img = require(this._bgimage)
					this.setBgImage(img)
				}
				else{
					// check if loaded already
					require.async(this._bgimage, 'jpeg').then(function(result){
						this.setBgImage(result)
					}.bind(this))
				}
			}
			else{
				this.setBgImage(this._bgimage)
			}
		}
		this.redraw
	}

	this.setBgImage = function(image){
		// TODO figure it out
		/*
		var shader = this.shaders.hardimage || this.shaders.roundedimage
		if(!shader) return
		var img = shader.texture = Shader.Texture.fromImage(image);
		if(this.bgimagemode === 'resize'){
			this._size = img.size
			this.relayout()
		} else if (img) {
			this.onbgimagemode()
		}
		else this.redraw()*/
	}

	// internal, emit an event upward (to all parents) untill a listener is hit
	this.emitUpward = function(key, msg){
		if(this['_listen_'+key] || this['on'+key]){
			this.emit(key, msg)
			return this
		}
		if(this.parent) return this.parent.emitUpward(key, msg)
	}

	this.findEmitUpward = function(key){
		if(this['_listen_'+key] || this['on'+key]){
			return this
		}
		if(this.parent) return this.parent.findEmitUpward(key)
	}

	// called in draw
	this.updateMatrix = function(){
		var frameid = this.canvas.frameid
		// lets check what kind of matrix to make.
		if(this.matrix_dirty){
			if(this.canvas.target_mode === '3d'){
				mat4.TSRT2(this.anchor, this.scale, this.orientation, this.pos, this.modelmatrix);
			}
			else { // its 2d
				var layout = this._layout
				// compute TSRT matrix
				var s = this._scale
				var r = this._orientation
				var t0 = layout.left, t1 = layout.top, t2 = 0
				var hw = layout.width / 2
				var hh = layout.height / 2
				mat4.TSRT(-hw, -hh, 0, s[0], s[1], s[2], 0, 0, r[2], t0 + hw * s[0], t1 + hh * s[1], t2, this.modelmatrix);
			}
			this.last_matrix_update = frameid
			this.matrix_dirty = false
		}

		if(this.last_matrix_update === frameid || this.parent && this.parent.last_matrix_update !== this.last_parent_matrix_update){
			if(this.parent) this.last_parent_matrix_update = this.parent.last_matrix_update
			if(this._viewport){
				//if(this.parent){
				//	mat4.mat4_mul_mat4(this.modelmatrix, this.parent.totalmatrix, this.viewportmatrix)
				//}
				//else{
				//	this.viewportmatrix = this.modelmatrix
				//}
				mat4.identity(this.totalmatrix)
			}
			else{
				mat4.mat4_mul_mat4(this.modelmatrix, this.parent.totalmatrix, this.totalmatrix)
			}
		}
	}

	function emitPostLayout(node){
		var ref = node.ref
		var oldlayout = ref.oldlayout || {}
		var layout = ref._layout

		var children = node.children
		for(var i = 0; i < children.length; i++){
			var child = children[i]
			emitPostLayout(child)
		}
		ref.layout_dirty = false

		var oldlayout = ref.oldlayout || {}
		if(layout.left !== oldlayout.left || layout.top !== oldlayout.top ||
			 layout.width !== oldlayout.width || layout.height !== oldlayout.height){
			ref.emit('layout', {type:'setter', owner:ref, key:'layout', value:layout})
			ref.oldlayout = layout
			ref.layoutchanged = true
		}

		if(ref._bgimage){
			ref.onbgimagemode()
		}
	}

	this.doLayout = function(){
		if(!this.layout_dirty) return
		var copynodes = FlexLayout.fillNodes(this)
		FlexLayout.computeLayout(copynodes)
		emitPostLayout(copynodes)
	}

	this.renderChild = function(render){
		// wrap our render function in a temporary view
		var vroot = view()
		// set up a temporary view
		vroot.render = render
		vroot.parent = this
		vroot.rpc = this.rpc
		vroot.screen = this.screen
		vroot.parent_viewport = this._viewport? this: this.parent_viewport
		// render it
		this.screen.composition.processRender(vroot, undefined, undefined, true)
		// move the children over
		this.children.push.apply(this.children, vroot.children)
		for(var i = 0; i < vroot.children.length; i++){
			vroot.children[i].parent = this
		}
		// lets cause a relayout
		this.relayout()
	}

	// the draw api
	define.class(this, 'Rect', '$shaders/rectshader')
	define.class(this, 'Image', '$shaders/imageshader')

})
