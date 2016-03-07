/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/
"use strict"
define.class('$system/base/node', function(require){
// Base UI view object

	var FlexLayout = require('$system/lib/layout')
	var Render = require('$system/base/render')
	this.Shader = require('$system/platform/$platform/shader$platform')
	var view = this.constructor


	this.attributes = {
		// wether to draw it
		visible: true,

		drawtarget: Config({type:Enum('both','pick','color'), value:'both'}),

		// pos(ition) of the view, relative to parent. For 2D only the first 2 components are used, for 3D all three.
		pos: Config({type:vec3, value:vec3(0,0,0),meta:"xyz"}),

		// alias for the x component of pos
		x: Config({alias:'pos', index:0}),
		// alias for the y component of pos
		y: Config({alias:'pos', index:1}),
		// alias for the z component of pos
		z: Config({alias:'pos', index:2}),

		// alias for the x component of pos
		left: Config({alias:'pos', index:0}),
		// alias for the y component of pos
		top: Config({alias:'pos', index:1}),
		// alias for the z component of pos
		front: Config({alias:'pos', index:2}),

		// the bottom/right/rear corner, used by layout
		corner: Config({type:vec3, value:vec3(NaN)}),
		// alias for the x component of corner
		right: Config({alias:'corner', index:0}),
		// alias for  y component of corner
		bottom: Config({alias:'corner', index:1}),
		// alias for z component of corner
		rear: Config({alias:'corner', index:2}),

		// the background color of a view, referenced by various shaders
		bgcolor: Config({group:"style", type:vec4, value: vec4(NaN), meta:"color"}),
		// the background image of a view. Accepts a string-url or can be assigned a require('./mypic.png')
		bgimage: Config({group:"style",type:Object, meta:"texture"}),
		// the opacity of the image
		opacity: Config({group:"style", value: 1.0, type:float}),
		// Per channel color filter, each color is a value in the range 0.0 ~ 1.0 and is multiplied by the color of the background image
		colorfilter: Config({group:"style", type:vec4, value: vec4(1,1,1,1), meta:"color"}),
		// Per channel color filter, each color is a value in the range 0.0 ~ 1.0 and is multiplied by the color of the background image
		bgimagemode: Config({group:"style", type:Enum("stretch", "aspect-fit", "aspect-fill", "custom", "resize"), value:"resize"}),
		bgimageaspect: Config({group:"style", value:vec2(1,1)}),
		bgimageoffset: Config({group:"style", value:vec2(0,0)}),

		// the clear color of the view when it is in '2D' or '3D' viewport mode
		clearcolor: Config({group:"style",type:vec4, value: vec4('transparent'), meta:"color"}),

		// the scroll position of the view matrix, allows to scroll/move items in a viewport. Only works on a viewport:'2D'
		// this property is manipulated by the overflow:'SCROLL' scrollbars
		scroll: Config({type:vec2, value:vec2(0, 0), persist: true}),
		// the zoom factor of the view matrix, allows zooming of items in a viewport. Only works on viewport:'2D'
		zoom: Config({type:float, value:1}),
		// overflow control, shows scrollbars when the content is larger than the viewport. If any value is set, it defaults to viewport:'2D'
		// works the same way as the CSS property
		overflow: Config({type: Enum('','hidden','scroll','auto','hscroll','vscroll'), value:''}),

		// size, this holds the width/height/depth of the view. When set to NaN it means the layout engine calculates the size
		size: Config({type:vec3, value:vec3(NaN), meta:"xyz"}),

		// internal, alias for the x component of size
		w: Config({alias:'size', index:0}),
		// internal, alias for the y component of size
		h: Config({alias:'size', index:1}),
		// internal, alias for the z component of size
		d: Config({alias:'size', index:2}),

		// alias for the x component of size
		width: Config({alias:'size', index:0}),
		// alias for the y component of size
		height: Config({alias:'size', index:1}),
		// alias for the z component of size
		depth: Config({alias:'size', index:2}),

		percentsize: Config({type:vec3, value:vec3(NaN)}),

		// alias for the x component of percentsize NOT IMPLEMENTED
		percentwidth: Config({alias:'percentsize', index:0}),
		// alias for the y component of percentsize NOT IMPLEMENTED
		percentheight: Config({alias:'percentsize', index:1}),
		// alias for the z component of percentsize NOT IMPLEMENTED
		percentdepth: Config({alias:'percentsize', index:2}),

		percentpos: Config({type:vec3, value:vec3(NaN)}),

		// internal, percentage widths/heights NOT IMPLEMENTED
		percentx: Config({alias:'percentpos', index:0}),
		// internal, percentage widths/heights NOT IMPLEMENTED
		percenty: Config({alias:'percentpos', index:1}),
		// internal, percentage widths/heights NOT IMPLEMENTED
		percentz: Config({alias:'percentpos', index:2}),

		// the pixelratio of a viewport. Allows scaling the texture buffer to arbitrary resolutions. Defaults to the system (low/high DPI)
		pixelratio: Config({type: float, value:NaN}),

		// the minimum size for the flexbox layout engine
		minsize: Config({type: vec3, value:vec3(NaN), meta:"xyz"}),
		// the maximum size for the flexbox layout engine
		maxsize: Config({type: vec3, value:vec3(NaN), meta:"xyz"}),

		// alias for the x component of minsize
		minwidth: Config({alias:'minsize', index:0}),
		// alias for the y component of minsize
		minheight: Config({alias:'minsize', index:1}),
		// alias for the z component of minsize
		mindepth: Config({alias:'minsize', index:2}),

		// alias for the x component of maxsize
		maxwidth: Config({alias:'maxsize', index:0}),
		// alias for the y component of maxsize
		maxheight: Config({alias:'maxsize', index:1}),
		// alias for the z component of maxsize
		maxdepth: Config({alias:'maxsize', index:2}),

		// the margin on 4 sides of the box (left, top, right, bottom). Can be assigned a single value to set them all at once
		margin: Config({type: vec4, value: vec4(0,0,0,0), meta: "ltrb"}),
		// alias for the first component of margin
		marginleft: Config({alias:'margin', index:0}),
		// alias for the second component of margin
		margintop: Config({alias:'margin', index:1}),
		// alias for the third component of margin
		marginright: Config({alias:'margin', index:2}),
		// alias for the fourth component of margin
		marginbottom: Config({alias:'margin', index:3}),

		// the padding on 4 sides of the box (left, top, right, bottom) Can be assigned a single value to set them all at once
		padding: Config({type: vec4, value: vec4(0,0,0,0), meta: "ltrb"}),
		// alias for the first component of padding
		paddingleft: Config({alias:'padding', index:0}),
		// alias for the second component of padding
		paddingtop: Config({alias:'padding', index:1}),
		// alias for the third component of padding
		paddingright: Config({alias:'padding', index:2}),
		// alias for the fourth component of padding
		paddingbottom: Config({alias:'padding', index:3}),

		// Scale of an item, only useful for items belof a 3D viewport
		scale: Config({type: vec3, value: vec3(1), meta:"xyz"}),
		// The anchor point around which items scale and rotate, depending on anchor mode its either a factor of size or and absolute value
		anchor: Config({type: vec3, value: vec3(0.)}),
		// the mode with which the anchor is computed. Factor uses the size of an item to find the point, defaulting to center
		anchormode: Config({type:Enum('','factor','absolute'), value:'factor'}),

		// orientation
		orientation: Config({type:vec3, value:vec3(0)}),

		// orientation of the item
		rotate: Config({alias:'orientation', index:2}),

		// rotate the item around x in radians. If you want degrees type it like this: 90*DEG
		rotatex: Config({alias:'orientation', index:0}),

		// rotate the item around y in radians. If you want degrees type it like this: 90*DEG
		rotatey: Config({alias:'orientation', index:1}),

		// the color of the border of an item.
		bordercolor: Config({group:"style",type: vec4, value: vec4(0,0,0,0), meta:"color"}),

		// the radius of the corners of an item, individually settable left, top, right, bottom. Setting this value will switch to rounded corner shaders
		borderradius: Config({group:"style",type: vec4, value: vec4(0,0,0,0)}),

		// the width of the border. Setting this value will automatically enable the border shaders
		borderwidth: Config({group:"style",type: vec4, value: vec4(0,0,0,0)}),

		// alias for the first component of borderwidth
		borderleftwidth: Config({alias:'borderwidth', index:0}),
		// alias for the second component of borderwith
		bordertopwidth: Config({alias:'borderwidth', index:1}),
		// alias for the third component of borderwith
		borderrightwidth: Config({alias:'borderwidth', index:2}),
		// alias for the fourth component of borderwith
		borderbottomwidth: Config({alias:'borderwidth', index:3}),

		// turn on flex sizing. Flex is a factor that distributes either the widths or the heights of nodes by this factor
		// flexbox layout is a web standard and has many great tutorials online to learn how it works
		flex: Config({group:"layout", type: float, value: NaN}),

		// wraps nodes around when the flexspace is full
		flexwrap: Config({group:"layout", type: Enum('wrap','nowrap'), value: "wrap"}),
		// which direction the flex layout is working,
		flexdirection: Config({group:"layout", type: Enum('row','column'), value: "row"}),
		// pushes items eitehr to the start, center or end
		justifycontent: Config({group:"layout", type: Enum('','flex-start','center','flex-end','space-between','space-around'), value: ""}),
		// align items to either start, center, end or stretch them
		alignitems: Config({group:"layout", type: Enum('flex-start','center','flex-end','stretch'), value:"stretch"}),
		// overrides the parents alignitems with our own preference
		alignself: Config({group:"layout", type: Enum('', 'flex-start','center','flex-end','stretch'), value:""}),
		// item positioning, if absolute it steps 'outside' the normal flex layout
		position: Config({group:"layout", type:  Enum('relative','absolute'), value: "relative" }),

		// the layout object, contains width/height/top/left after computing. Its a read-only property and should be used in shaders only.
		// Can be listened to to observe layout changes
		layout: Config({ type:Object, value:{}, meta:"hidden"}),

		// When set to 2D or 3D the render engine will create a separate texture pass for this view and all its children
		// using a 2D viewport is a great way to optimize render performance as when nothing changes, none of the childstructures
		// need to be processed and a single texture can just be drawn by the parent
		// the viewportblend shader can be used to render this texture it into its parent
		viewport: Config({group:"layout", type:Enum('','2d','3d'), value:''}),

		// the field of view of a 3D viewport. Only useful on a viewport:'3D'
		fov: Config({group:"3d", type:float, value: 45}),
		// the nearplane of a 3D viewport, controls at which Z value near clipping start. Only useful on a viewport:'3D'
		nearplane: Config({group:"3d",type:float, value: 0.001}),
		// the farplane of a 3D viewport, controls at which Z value far clipping start. Only useful on a viewport:'3D'
		farplane: Config({group:"3d",type:float, value: 1000}),

		// the position of the camera in 3D space. Only useful on a viewport:'3D'
		camera: Config({group:"3d",type: vec3, value: vec3(-2,2,-2)}),
		// the point the camera is looking at in 3D space. Only useful on a viewport:'3D'
		lookat: Config({group:"3d",type: vec3, value: vec3(0)}),
		// the up vector of the camera (which way is up for the camera). Only useful on a viewport:'3D'
		up: Config({group:"3d",type: vec3, value: vec3(0,-1,0)}),

		// internal, the current time which can be used in shaders to create continous animations
		time:Config({meta:"hidden", value:0}),

		// fires when pointer is pressed down.
		pointerstart:Config({type:Event}),
		// fires when pointer is pressed and moved (dragged).
		pointermove:Config({type:Event}),
		pointermultimove:Config({type:Event}),
		// fires when pointer is released.
		pointerend:Config({type:Event}),
		// fires when pointer is pressed and released quickly.
		pointertap:Config({type:Event}),
		// fires when pointer moved without being pressed.
		pointerhover:Config({type:Event}),
		// fires when pointer enters an element.
		pointerover:Config({type:Event}),
		// fires when pointer leaves an element.
		pointerout:Config({type:Event}),
		// fires when mouse wheel is used.
		pointerwheel:Config({type:Event}),

		// fires when a drag drop item enters
		dragover:Config({type:Event}),
		// fires when a drag drop item moves
		dragmove:Config({type:Event}),
		// fires when a drag drop item leaves
		dragout:Config({type:Event}),

		// fires when a key goes to up. The event argument is {repeat:int, code:int, name:String}
		keyup: Config({type:Event}),
		// fires when a key goes to down. The event argument is {repeat:int, code:int, name:String}
		keydown: Config({type:Event}),
		// fires when a key gets pressed. The event argument is {repeat:int, value:string, char:int}
		keypress: Config({type:Event}),
		// fires when someone pastes data into the view. The event argument is {text:string}
		keypaste: Config({type:Event}),

		// fires when this view loses focus
		blur: Config({type:Event}),

		// drop shadow size
		dropshadowradius:Config({type:float, value:20}),
		// drop shadow movement
		dropshadowoffset:Config({type:vec2, value:vec2(0,0)}),
		// drop shadow hardness
		dropshadowhardness:Config({type:float, value:0.5, minvalue: 0, maxvalue:1}),
		// drop shadow opacity
		dropshadowopacity:Config({type:float, value:0, minvalue: 0, maxvalue:1}),
		// drop shadow color
		dropshadowcolor:Config({type:vec4,meta:"color", value:vec4("black")}),

		// whether this view has focus
		focus: Config({meta:"hidden", value:false, persist:true}),
		// tabstop, sorted by number
		tabstop: NaN,

		cursor: Config({type:Enum(
			'', 'arrow', 'none','wait','text','pointer',
			'zoom-in','zoom-out','grab','grabbing',
			'ns-resize','ew-resize','nwse-resize','nesw-resize',
			'w-resize','e-resize','n-resize','s-resize',
			'nw-resize','ne-resize','sw-resize','se-resize',
			'help','crosshair','move',
			'col-resize','row-resize',
			'vertical-text','context-menu','no-drop','not-allowed',
			'alias','cell','copy'
		), value:''})
	}

	this.name = ""
	this.class = ""

	// trigger redraw
	this.emitFlags(1, [
		'visible','camera','lookat','up','layout'
	])

	// trigger a relayout
	this.emitFlags(2, [
		'pos','corner','size','minsize','maxsize','margin',
		'padding','flex','flexwrap','flexdirection','justifycontent',
		'alignitems','alignself','position',
	])

	// trigger matrix_dirty
	this.emitFlags(4, [
		'orientation', 'pos', 'layout'
	])

	// trigger a redraw.
	this.redraw = function(){
		if(this.draw_dirty) return

		var parent = this
		while(!parent.draw_dirty){
			parent.draw_dirty = true
		}

		if(this.screen) {
			this.screen.redraw()
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

	this.pickview = 0

	// the number of pick ID's to reserve for this view.
	this.boundscheck = true

	// the local matrix
	this.modelmatrix = mat4.identity()
	// the concatenation of all parent model matrices
	this.totalmatrix = mat4.identity()
	// the last view matrix used
	this.viewmatrix = mat4.identity()
	// the viewport matrix used to render the viewportblend
	this.viewportmatrix = mat4.identity()
	// the normal matrix contains the transform without translate (for normals)
	this.normalmatrix = mat4.identity()
	// the remap matrix used to remap pointer vec2 to local space
	this.remapmatrix = mat4();

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
			this.viewportmatrix = prev.viewportmatrix
			this.layout = prev.layout
		}
		else{
			this.modelmatrix = mat4()
			if(this._viewport) this.totalmatrix = mat4.identity()
			else this.totalmatrix = mat4()
			this.viewportmatrix = mat4()
		}

		// create a context
		if(!this.Canvas.drawRect) debugger

		this.canvas = Object.create(this.Canvas)
		this.canvas.initCanvas(this)

		this.atFlag1 = this.redraw
		this.atFlag2 = this.relayout
		this.atFlag4 = this.rematrix
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
			if(this.borderradius[0]>0){
				c.drawRoundedrect()
			}
			else{
				c.drawRect()
			}
		}
		if(this._viewport === '2d'){
			c.setViewMatrix('view')
		}
	}

	// the user draw function
	this.draw = function(){
		this.drawBackground()
		this.drawChildren()
	}

	this.drawChildren = function(){
		var c = this.canvas

		// TODO add boundingbox clipping
		for(var i = 0;i < this.children.length;i++){
			var child = this.children[i]
			// include it in our drawlist
			c.addCanvas(child.canvas, i)
			child.drawView()
		}
	}

	this.drawView = function(){
		var c = this.canvas
		c.width = this._layout.width
		c.height = this._layout.height

		if(!this._viewport && !this.draw_dirty) return

		// clear commandset
		c.clearCmds()
		this.pickdraw = 0
		// update matrices
		this.updateMatrix()

		// alright its a viewport, render to a texture
		if(this._viewport){
			// do the 2d
			var tgt
			if(this._viewport === '2d'){
				this.viewport_target =
				tgt = c.getTarget("viewport", c.RGBA|c.PICK)
				c.pushTarget(tgt)
				c.setOrthoViewMatrix(!this.parent)
			}
			else{
				this.viewport_target =
				tgt = c.getTarget("viewport", c.RGBA|c.DEPTH|c.PICK)
				c.pushTarget(tgt)
				c.setPerspectiveViewMatrix(tgt)
			}
			if(this.draw_dirty){
				c.clear()
				this.atAttributeGetFlag = 2
				this.draw()
				this.atAttributeGetFlag = 0
				this.draw_dirty = false
			}
			c.popTarget()
			//c.blendDraw(tgt)
		}
		else if(this.draw_dirty){
			this.atAttributeGetFlag = 2
			this.draw()
			this.atAttributeGetFlag = 0
			this.draw_dirty = false
		}
	}

	// the drawing canvas
	this.Canvas = {
		initCanvas: function(view){
			this.view = view
			this.scope = view
			this.matrix = mat4.identity()
			this.cmds = []
		},
		clearCmds: function(){
			this.cmds.length = 0
		},
		addCanvas: function(ctx, index){
			ctx.frameid = this.frameid
			this.cmds.push('canvas', ctx.cmds, ctx.view)
		},
		clear: function(){
			this.cmds.push('clear', this.clearcolor !== undefined?this.clearcolor:this.view.clearcolor)
		},
		pushCache: function(uid, isdirty){
			if(!this.cachestack) this.cachestack = []
			if(isdirty || !this.view.draw_cache || !this.view.draw_cache[uid]){
				this.cachestack.push(this.cmds.length, uid)
				return true
			}
			// restore cache
			var cache = this.view.draw_cache[uid]
			this.cmds.push.apply(this.cmds, cache.cmds)
			this.view.pickdraw = cache.pickdraw
			return false
		},
		popCache: function(){
			if(!this.cachestack || !this.cachestack.length) throw new Error('no matching pushcache')
			var uid = this.cachestack.pop()
			var pos = this.cachestack.pop()
			if(!this.view.draw_cache) this.view.draw_cache = {}
			this.view.draw_cache[uid] = {
				cmds:this.cmds.slice(pos, this.cmds.length), 
				pickdraw:this.view.pickdraw
			}
		},
		// create or reuse a matrix by name
		getMatrix: function(name, itarget){
			var target = itarget !== undefined? itarget: this.target.targetguid
			var store = this.view.matrix_store[target]
			if(!store) this.view.matrix_store[target] = store = {}
			var mat = store[name]
			if(!mat) store[name] = mat = mat4()
			return mat
		},
		// load a matrix (return undefined when not there)
		loadMatrix: function(name, itarget){
			var target = itarget !== undefined? itarget: this.target.targetguid
			var store = this.view.matrix_store[target]
			if(!store) return
			return store[name]
		},
		// sets the view matrix
		setViewMatrix: function(iviewmatrix){
			var isstring = typeof iviewmatrix === 'string'
			var viewmatrix = isstring? this.loadMatrix(iviewmatrix) : iviewmatrix
			if(!iviewmatrix) return
			this.cmds.push(
				'setViewMatrix',
				viewmatrix,
				isstring?iviewmatrix:undefined
			)
		},
		// sets the view matrix to default ortho projection which is in device pixels top left 0,0
		setOrthoViewMatrix: function(yflip, xflip, iwidth, iheight, ixscroll, iyscroll, izoom, left, top){
			// lets set up a 2D matrix
			var width = iwidth !== undefined?iwidth:this.target.width
			var height = iheight !== undefined?iheight:this.target.height
			var zoom = izoom !== undefined?izoom: this.scope._zoom
			var xscroll = ixscroll !== undefined? ixscroll: this.scope._scroll[0]
			var yscroll = iyscroll !== undefined? iyscroll: this.scope._scroll[1]

			var viewmatrix = this.getMatrix('view')
			var L = xscroll
			var R = width * zoom + xscroll
			var T = yscroll
			var B = height * zoom + yscroll
			mat4.ortho(xflip?R:L, xflip?L:R, yflip?T:B, yflip?B:T, -100, 100, viewmatrix)

			var noscrollmatrix = this.getMatrix('noscroll')
			var L = left || 0 
			var R = width
			var T = top || 0
			var B = height
			mat4.ortho(xflip?R:L, xflip?L:R, yflip?T:B, yflip?B:T, -100, 100, noscrollmatrix)

			this.setViewMatrix(viewmatrix)
		},
		// set the view matrix to a perspective projection
		setPerspectiveViewMatrix: function(ifov, inear, ifar, icamera, ilookat, iup, iwidth, iheight){
			
			var fov = ifov !== undefined? ifov: this.scope._fov
			var camera = icamera !== undefined? icamera: this.scope._camera 
			var lookat = ilookat !== undefined? ilookat: this.scope._lookat
			var up = iup !== undefined? iup: this.scope._up
			var width = iwidth !== undefined?iwidth:this.target.width
			var height = iheight !== undefined?iheight:this.target.height
			var near = ifov !== undefined? ifov: this.scope._fov
			
			var perspectivematrix = this.getMatrix('perspective')
			var lookatmatrix = this.getMatrix('lookat')
			var viewmatrix = this.getMatrix('view')

			mat4.perspective(fov * PI * 2/360.0 , width/height, near, far, perspectivematrix)
			mat4.lookAt(camera, lookat, up, lookatmatrix)
			mat4.mat4_mul_mat4(matrix, perspectivematrix, viewmatrix)

			this.setViewMatrix(viewmatrix)
		},
		getDoubleTarget: function(name, iflags, iwidth, iheight){
			if(!iframes) iframes = 2
			// lets return a double buffered target which flips on every request
		},
		// get or reuse a render target by name
		getTarget: function(name, iflags, iwidth, iheight){
			var width = iwidth !== undefined?iwidth:this.scope._layout.width
			var height = iheight !== undefined?iheight:this.scope._layout.height
			var flags = iflags !== undefined?iflags:this.RGBA
			var targetguid = this.view.guid + '_' + flags + '_'+ (name || this.cmds.length)
			this.cmds.push(
				'createTarget', 
				targetguid, 
				flags, 
				width,
				height
			)
			return {targetguid:targetguid, width:width, height:height, flags:flags}
		},
		pushTarget: function(target, outputname){

			if(!this.cmdstack) this.cmdstack = []
			this.cmdstack.push(this.cmds, this.target)
			this.cmds = []
			this.target = target

			var pass = {
				target:target, 
				outputname:outputname, 
				cmds:this.cmds, 
				view:this.view
			}
			var draw_passes = this.view.screen.draw_passes
			var id = draw_passes.indexOf(target.targetguid)
			if(id !== -1) draw_passes.splice(id, 2)
			draw_passes.push(target.targetguid, pass)

			if(!this.view.parent)  this.view.screen.main_pass = pass

			// also add it to pick passes
			if(target.flags & this.PICK){
				var pick_passes = this.view.screen.pick_passes
				var id = pick_passes.indexOf(target.targetguid)
				if(id === -1){
					pick_passes.push(target.targetguid, pass)
				}
			}
		},
		popTarget: function(){
			if(!this.cmdstack.length) throw new Error('popTarget empty')
			this.target = this.cmdstack.pop()
			this.cmds = this.cmdstack.pop()
		}
	}
	// copy over texture flags
	for(var key in this.Shader.Texture){
		var prop = this.Shader.Texture[key]
		if(typeof prop === 'number') this.Canvas[key] = prop
	}

	this.doCompileCanvasVerbs = function(name, cls, verbs, defaults, struct){
		if(!this.hasOwnProperty('Canvas')) this.Canvas = Object.create(this.Canvas)

		var verbs = cls._canvasverbs
		var defaults = cls._defaults
		var struct = cls._canvas && cls._canvas.struct
		var canvas = this.Canvas
		var slots = struct && struct.slots
		var def = struct && struct.def
		var cap = name.charAt(0).toUpperCase() + name.slice(1)		

		if(struct){
			function defProp(obj, key, offset, type){
				var index = 'index'+cap
				var buffer = 'buffer'+cap
				var name = key + cap
				if(!(name in cls)){
					Object.defineProperty(obj, name,{
						get:function(){
							var o = this[index] * slots
							var buf = this.canvas[buffer]
							if(type.slots>1){
								var ret = type()
								for(var i = 0; i < type.slots; i++){
									ret[i] = buf.array[o + offset + i]
								}
								return ret
							}
							else{
								return buf.array[o + offset]
							}
						},
						set:function(value){
							// animation!
							if(value instanceof Animate){
								// lets hook an animation on view
								var first = this[name]
								this.canvas.view.screen.startAnimationRoot(
									this.canvas.view.pickview + '_' + this.pickdraw+'_'+key,
									{type:type},
									first, 
									this, 
									name, 
									undefined,
									value.track
								)
								return
							}
							var o = this[index] * slots
							var buf = this.canvas[buffer]
							if(type.slots>1){
								for(var i = 0; i < type.slots; i++){
									buf.array[o + offset + i] = value[i]
								}
							}
							else{
								buf.array[o + offset] = value
							}
							buf.clean = false
							this.canvas.view.redraw()
						}
					})
					//console.log('defining'+name, cls)
				}
			}
			// lets define our getters
			for(var key in def){
				var info = struct.keyInfo(key)
				console.log()
				defProp(this, key, info.offset/4, info.type)
			}
		}

		canvas['array' + cap] = struct
		canvas['class' + cap] = cls

		for(var verb in verbs){
			var fn = verbs[verb]
			var args = define.getFunctionArgs(fn)
			var fnstr = fn.toString()	
			if(!struct){
				fnstr = fnstr.replace(/(\t*)this\.drawINLINE\s*\(\s*\)/,function(m, ind){
					var write = 
					ind+'var draw_canvas = this.view.draw_canvas\n'+
					ind+'var canvas = draw_canvas["'+cap+'"]\n'+
					ind+'if(!canvas){\n'+
					ind+'\tdraw_canvas["'+cap+'"] = canvas = Object.create(this.class'+cap+'.Canvas)\n'+
					ind+'\tcanvas.initCanvas(this.view)\n'+
					ind+'\tthis.addCanvas(canvas)\n'+
					ind+'}\n'+

					ind+'var pickdraw = canvas.pickdraw = ++this.view.pickdraw\n'+
					ind+'var draw_objects = this.view.draw_objects\n'+
					ind+'var obj = draw_objects[pickdraw] || (draw_objects[pickdraw] = Object.create(this.class'+cap+'))\n'+
					ind+'obj.pickdraw = pickdraw\n'+
					ind+'canvas.scope = obj\n'+
					ind+'obj.canvas = canvas\n'

					for(var i = 0; i < args.length; i++){
						write += 'obj.'+args[i]+' = '+args[i] + '\n'
					}
					write += 'obj.draw()\n'
					return write
				})
			}
			else{

				fnstr = fnstr.replace(/(\t*)this\.drawINLINE\s*\(\s*\)/,function(m, ind){
					var write = ind+'var _buf = this.buffer'+cap+'\n'+
						ind+'if(!_buf){\n'+
						ind+'\tthis.buffer'+cap+' = _buf = this.alloc'+cap+'?this.array'+cap+'.array(this.alloc'+cap+'):this.array'+cap+'.array()\n' + 
						ind+'\t_buf.frameid = this.frameid\n'+
						ind+'\tthis.flush'+cap+'()\n'+
						ind+'\tthis.buffer'+cap+' = _buf\n'+
						ind+'}\n'+
						ind+'if(!_buf.appendonly && _buf.frameid !== this.frameid){\n'+
						ind+'\t_buf.length = 0, _buf.frameid = this.frameid\n'+
						ind+'\tthis.flush'+cap+'()\n'+
						ind+'\tthis.buffer'+cap+' = _buf\n'+
						ind+'}\n'+
						ind+'_buf.clean = false\n'+
						ind+'var _len = _buf.length, _alloc = _buf.allocated\n'+
						ind+'this.scope.index'+cap+' = _len\n'+
						ind+'_buf.instancedivisor = this.instancedivisor'+cap+'|| 1\n'+
						ind+'if(_buf.length >= _buf.allocated){\n'+
							ind+'\tvar _ns = _buf.allocated * 2 || 1\n'+
							ind+'\tfor(var _n = new _buf.arrayconstructor(_ns * '+slots+'), _o = _buf.array, _i = 0, _s = _buf.allocated * '+slots+'; _i < _s; _i++) _n[_i] = _o[_i]\n'+
							ind+'\t_buf.array = _n, _buf.allocated = _ns\n'+
						ind+'}\n'+
						ind+'var _array = _buf.array, _off = _len*'+slots+', _obj\n'

					// iterate over the keys
					var off = 0
					for(var key in def) if(typeof def[key] === 'function'){
						// lets output to the array
						// and copy it from the canvas
						var dft = '(this.scope._'+key+' || 0)'
						if(key in defaults) dft = defaults[key]

						var itemslots = def[key].slots
						if(itemslots>1){
							if(args.indexOf(key) !== -1){
								write += ind+'_obj = '+key+'!==undefined?'+key+':this.'+key+'?this.'+key+':'+dft+'\n'
							}
							else{
								write += ind+'_obj = this.'+key+'!==undefined?this.'+key+':'+dft+'\n'
							}
							write += ind+'if(_obj !== undefined){\n'
							for(var i = 0; i < itemslots; i++, off++){
								write += ind+'\t_array[_off + ' + off + '] = _obj['+i+']\n'
							}
							write += ind+'}\n'
						}
						else{
							if(args.indexOf(key) !== -1){
								write += ind+'_array[_off + ' + off + '] = '+key+'!==undefined?'+key+':this.'+key+'!==undefined?this.'+key+':'+dft+'\n'
							}
							else{
								write += ind+'_array[_off + ' + off + '] = this.'+key+'!==undefined?this.'+key+':'+dft+'\n'
							}
							off++
						}
					}
					write += ind+'_buf.length++\n'
					return write
				})
			}
			//console.log(fnstr)
			fnstr = fnstr.replace(/NAME/g, cap)
			canvas[verb+cap] = Function('return '+fnstr)()
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
			this.doCompileCanvasVerbs(key, cls)
		}
	}

	// internal, setting focus to true
	this.onfocus = function(event){
		if(!event.mark){ // someone set it to true that wasnt us
			this.screen.setFocus(this)
		}
	}

	// internal, put a tablistener
	this.ontabstop = function(event){
		if(isNaN(event.old) && !isNaN(event.value)){
			this.addListener('keydown', function(value){
				if(value.name === 'tab'){
					if(value.shift) this.screen.focusPrev(this)
					else this.screen.focusNext(this)
				}
			})
		}
	}

	// draw dirty true
	this.draw_dirty = true
	// layout dirty causes a relayout to occur
	this.layout_dirty = true
	// update matrix stack
	this.matrix_dirty = true

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

	this.defaultKeyboardHandler = function(v, prefix){
		if (!prefix) prefix = ""

		var keyboard = this.screen.keyboard
		keyboard.textarea.focus()

		var name = prefix + 'keydown' + v.name[0].toUpperCase() + v.name.slice(1)
		//this.undo_group++

		if(keyboard.leftmeta || keyboard.rightmeta) name += 'Cmd'
		if(keyboard.ctrl) name += 'Ctrl'
		if(keyboard.alt) name += 'Alt'
		if(keyboard.shift) name += 'Shift'

		if(this[name]) {
			this[name](v)
		}
		else{
			//console.log(name)
			if (this.keydownHandler) this.keydownHandler(name)
		}
	}

	this.setBgImage = function(image){
		// TODO figure it out
		/*
		var shader = this.shaders.hardimage || this.shaders.roundedimage
		if(!shader) return
		var img = shader.texture = Shader.Texture.fromImage(image);
		if(this.bgimagemode === "resize"){
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

	this.computeCursor = function(){
		var node = this
		while(node){
			if(node._cursor !== ''){
				this.screen.pointer.cursor = node._cursor
				break
			}
			node = node.parent
		}
	}


	function UnProject(glx, gly, glz, modelview, projection){
		var inv = vec4()
		var A = mat4.mat4_mul_mat4(modelview, projection)
		var m = mat4.invert(A)
		inv[0] = glx
		inv[1] = gly
		inv[2] = 2.0 * glz - 1.0
		inv[3] = 1.0
		out = vec4.vec4_mul_mat4(inv, m)
		// divide by W to perform perspective!
		out[0] /= out[3]
		out[1] /= out[3]
		out[2] /= out[3]
		return vec3(out)
	}

	// Internal: remap the x and y coordinates to local space
	this.globalToLocal = function(value){
		//TODO(aki): Simplify.
		var sx = this.screen.device.main_frame.size[0]  / this.screen.device.ratio
		var sy = this.screen.device.main_frame.size[1]  / this.screen.device.ratio
		var mx = value[0] / (sx / 2) - 1.0
		var my = -1 * (value[1] / (sy / 2) - 1.0)

		var parentlist = [], ip = this.parent
		while (ip){
			if (ip._viewport || !ip.parent) parentlist.push(ip)
			ip = ip.parent
		}

		var raystart = vec3(mx,my,-100)
		var rayend   = vec3(mx,my,100)
		var lastrayafteradjust = vec3(mx,my,-100)
		var lastprojection = mat4.identity()
		var lastviewmatrix = mat4.identity()
		var camerapos = vec3(0)
		var scaletemp = mat4.scalematrix([1,1,1])
		var transtemp2 = mat4.translatematrix([-1,-1,0])

		var lastmode = "2d"

		this.remapmatrix = mat4.identity()

		for(var i = parentlist.length - 1; i >= 0; i--) {
			var P = parentlist[i]
			var newmode = P.parent? P._viewport:"2d"

			if (P.parent) {

				var MM = P._viewport? P.viewportmatrix: P.totalmatrix

				if (!P.viewportmatrix) console.log(i, "whaaa" )
				mat4.invert(P.viewportmatrix, this.remapmatrix)

				// 3d to layer transition -> do a raypick.
				if (lastmode == "3d") {
					var startv = UnProject(lastrayafteradjust.x, lastrayafteradjust.y, 0, lastviewmatrix, lastprojection)
					var endv = UnProject(lastrayafteradjust.x, lastrayafteradjust.y, 1, lastviewmatrix, lastprojection)

					camlocal = vec3.mul_mat4(camerapos, this.remapmatrix)
					endlocal = vec3.mul_mat4(endv, this.remapmatrix)

					var R = vec3.intersectplane(camlocal, endlocal, vec3(0,0,-1), 0)
					if (!R)	{
						raystart = vec3(0.5,0.5,0)
					} else {
						R = vec3.mul_mat4(R, P.viewportmatrix)
						raystart = R
					}
				}

				raystart = vec3.mul_mat4(raystart, this.remapmatrix)

				mat4.scalematrix([P.layout.width/2,P.layout.height/2,1000/2], scaletemp)
				mat4.invert(scaletemp, this.remapmatrix)

				raystart = vec3.mul_mat4(raystart, this.remapmatrix)
				raystart = vec3.mul_mat4(raystart, transtemp2)

				lastrayafteradjust = vec3(raystart.x, raystart.y,-1);
				lastprojection = P.colormatrices.perspectivematrix;
				lastviewmatrix = P.colormatrices.lookatmatrix;
				camerapos = P._camera;

			}

			if(i == 0 && this.noscroll){
				mat4.invert(P.colormatrices.noscrollmatrix, this.remapmatrix)
			}	else {
				mat4.invert(P.colormatrices.viewmatrix, this.remapmatrix)
			}

			raystart = vec3.mul_mat4(raystart, this.remapmatrix)

			lastmode = newmode
		}

		var MM = this._viewport?this.viewportmatrix: this.totalmatrix
		mat4.invert(MM, this.remapmatrix)
		raystart = vec3.mul_mat4(raystart, this.remapmatrix)
		rayend = vec3.mul_mat4(rayend, this.remapmatrix)

		return vec2(raystart.x, raystart.y)
	}

	// starts a drag view via render function
	this.startDrag = function(pointerevent, render){
		var dragview = this.screen.openOverlay(render)

		if(!dragview.atDragMove){
			dragview.atDragMove = function(position){
				this.x = position[0] - this.width*0.5
				this.y = position[1] - this.height*0.5
			}
		}

		// make sure we pick the screen in pointermove
		pointerevent.pickview = true
		dragview.atDragMove(pointerevent.value)

		var lastdrag
		this.onpointermove = function(event){
			dragview.atDragMove(event.value)
			// lets send dragenter/leave events
			var newdrag = event.pick

			if(!dragview.isDropTarget(newdrag,event)) newdrag = undefined

			if(lastdrag !== newdrag){
				if(lastdrag) lastdrag.emitUpward('dragout',{})
				if(newdrag) newdrag.emitUpward('dragover',{})
				lastdrag = newdrag
			}
			if(newdrag) newdrag.emitUpward('dragmove', event)
		}
		this.onpointerend = function(event){
			this.onpointermove = undefined
			dragview.closeOverlay()
			if(lastdrag){
				lastdrag.emitUpward('dragout',{})
			}
			dragview.atDrop(lastdrag, event)
			this.onpointerend = undefined
		}
	}

	// internal, decide to inject scrollbars into our childarray
	this.atRender = function(){
		if(this._viewport === '2d' && (this._overflow === 'scroll'|| this._overflow==='hscroll' || this._overflow === 'vscroll' || this._overflow === 'auto')){
			if(this.vscrollbar) this.vscrollbar.value = 0
			if(this.hscrollbar) this.hscrollbar.value = 0

			this.scroll = function(event){
				if(event.mark) return
				if(this.vscrollbar){
					this.vscrollbar.value = Mark(event.value[1])
				}
				if(this.hscrollbar){
					this.hscrollbar.value = Mark(event.value[0])
				}
			}

			if(this._overflow === 'scroll' || this._overflow === 'vscroll') this.children.push(
				this.vscrollbar = this.scrollbar({
					position:'absolute',
					vertical:true,
					noscroll:true,
					value:function(event){
						if(event.mark) return
						this.parent.scroll = Mark(vec2(this.parent._scroll[0],this._value))
					},
					layout:function(){
						var parent_layout = this.parent.layout
						var this_layout = this.layout
						this_layout.top = 0
						this_layout.width = 10
						this_layout.height = parent_layout.height
						this_layout.left = parent_layout.width - this_layout.width
					}
				})
			)

			if(this._overflow === 'scroll' || this._overflow === 'hscroll') this.children.push(
				this.hscrollbar = this.scrollbar({
					position: 'absolute',
					vertical: false,
					noscroll: true,
					value: function(event){
						if(event.mark) return
						this.parent.scroll = Mark(vec2(this._value,this.parent._scroll[1]))
					},
					layout: function(){
						var parent_layout = this.parent.layout
						var this_layout = this.layout
						this_layout.left = 0
						this_layout.height = 10
						this_layout.width = parent_layout.width
						this_layout.top = parent_layout.height - this_layout.height
					}
				})
			)

			if(this.hscrollbar) this.hscrollbar.value = Mark(this._scroll[0])
			if(this.vscrollbar) this.vscrollbar.value = Mark(this._scroll[1])

			this.pointerwheel = function(event){
				if(this.vscrollbar && this.vscrollbar._visible){
					this.vscrollbar.value = clamp(this.vscrollbar._value + event.wheel[1], 0, this.vscrollbar._total - this.vscrollbar._page)
				}
				if(this.hscrollbar && this.hscrollbar._visible){
					this.hscrollbar.value = clamp(this.hscrollbar._value + event.wheel[0], 0, this.hscrollbar._total - this.hscrollbar._page)
				}
			}

			//TODO(aki): implement zoom
			// this.pointerzoom = function(event){
			// 	var zoom = event.value.zoom
			// 	var lastzoom = this._zoom
			// 	var newzoom = clamp(lastzoom * (1+0.03 * zoom),0.01,10)
			// 	this.zoom = newzoom
			//
			// 	var pos = this.globalToLocal(event.value.position)
			//
			// 	var shiftx = pos[0] * lastzoom - pos[0] * this._zoom
			// 	var shifty = pos[1] * lastzoom - pos[1] * this._zoom
			//
			// 	this.hscrollbar.value = clamp(this.hscrollbar._value + shiftx, 0, this.hscrollbar._total - this.hscrollbar._page)
			// 	this.vscrollbar.value = clamp(this.vscrollbar._value + shifty, 0, this.vscrollbar._total - this.vscrollbar._page)
			//
			// 	this.updateScrollbars()
			// 	this.redraw()
			// }
		}
	}

	// internal, show/hide scrollbars
	this.updateScrollbars = function(){

		if(this.vscrollbar){
			var scroll = this.vscrollbar
			var totalsize = Math.floor(this.layout.boundh)
			var viewsize = Math.floor(this.layout.height * this.zoom)
			if(totalsize > viewsize+1){
				scroll._visible = true
				scroll._total = totalsize
				scroll._page = viewsize
				var off = clamp(scroll._value,0, scroll._total - scroll._page)
				if(off !== scroll._value) scroll.value = off
			}
			else{
				if(0 !== scroll._offset){
					scroll.value = 0
				}
				scroll._visible = false
			}
		}
		if(this.hscrollbar){
			var scroll = this.hscrollbar
			var totalsize = Math.floor(this._layout.boundw)
			var viewsize = Math.floor(this._layout.width* this.zoom)
			if(totalsize > viewsize + 1){
				scroll._visible = true
				scroll._total = totalsize
				scroll._page = viewsize
				var off = clamp(scroll._value,0, scroll._total - scroll._page)
				if(off !== scroll._value) scroll.value = off
			}
			else{
				if(0 !== scroll._value) scroll.value = 0
				scroll._visible = false
			}
		}
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
				if(this.parent){
					mat4.mat4_mul_mat4(this.modelmatrix, this.parent.totalmatrix, this.viewportmatrix)
				}
				else{
					this.viewportmatrix = this.modelmatrix
				}
				mat4.identity(this.totalmatrix)
			}
			else{
				mat4.mat4_mul_mat4(this.modelmatrix, this.parent.totalmatrix, this.totalmatrix)
			}
		}
	}

	this.moveToFront = function(){
		if(!this.parent) return
		var idx = this.parent.children.indexOf(this)
		this.parent.children.splice(idx, 1)
		this.parent.children.push(this)
		this.parent.redraw()
	}

	this.moveToBack = function(){
		if(!this.parent) return
		var idx = this.parent.children.indexOf(this)
		this.parent.children.splice(idx, 1)
		this.parent.children.unshift(this)
		this.parent.redraw()
	}

	this.childrenInRect = function(rect, exclude) {
		var hits = []
		for (var i = 0;i<this.children.length;i++) {
			var child = this.children[i]
			if (exclude && exclude.indexOf(child) > -1) {
				continue
			}
			if (child.boundsInsideRect(rect)) {
				hits.push(child)
			} 
			else {
				var sub = child.childrenInRect(rect, exclude)
				if (sub.length) {
					hits = hits.concat(sub)
				}
			}
		}

		return hits;
	};

	this.boundsInsideRect = function(r) {
		return r.x <= this._layout.left
			&& r.y <= this._layout.top
			&& r.w >= this._layout.width
			&& r.z >= this._layout.height
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
		}
		ref.oldlayout = layout

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
	
	this.animate = function(key, track){
		return new define.Promise(function(resolve, reject){
			this.startAnimation(key, undefined, track, resolve)
		}.bind(this))
	}

	this.startAnimation = function(key, value, track, resolve){
		if(!this.initialized) return false
		
		return this.screen.startAnimationRoot(
			this.pickview + '_' + key, 
			this.getAttributeConfig(key), 
			this['_'+key], 
			this, 
			key, 
			value, 
			track, 
			resolve
		)
	}

	this.stopAnimation = function(key){
		if(this.initialized) this.screen.stopAnimationRoot(this, key)
	}

	this.playAnimation = function(key){
		if(this.initialized) this.screen.playAnimationRoot(this, key)
	}

	this.pauseAnimation = function(key){
		if(this.initialized) this.screen.pauseAnimationRoot(this, key)
	}

	this.renderChild = function(render){
		// wrap our render function in a temporary view
		var vroot = view()
		// set up a temporary view
		vroot.render = render
		vroot.parent = this
		vroot.rpc = this.rpc
		vroot.screen = this.screen
		vroot.parent_viewport = this._viewport?this:this.parent_viewport
		// render it
		Render.process(vroot, undefined, undefined, true)
		// move the children over
		this.children.push.apply(this.children, vroot.children)
		for(var i = 0; i < vroot.children.length; i++){
			vroot.children[i].parent = this
		}
		// lets cause a relayout
		this.relayout()
	}

	// the draw api
	define.class(this, 'rect', '$shaders/rectshader')

	// Basic usage of the splitcontainer
	this.constructor.examples = {
		Usage:function(){ return [
			view({margin:10, width:50, height:50, bgcolor:'red'}),
			view({width:50, height:50, bgcolor:'green', bordercolor:'pink', borderwidth:10, borderradius:7}),
			view({x:30, y:10, width:50, height:50, bgcolor:'blue'})
		]}
	}

})
