/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$system/base/node', function(require){
	var Animate = require('$system/base/animate')
	var FlexLayout = require('$system/lib/layout')
	var Shader = this.Shader = require('$system/platform/$platform/shader$platform')
	
	var view = this.constructor

	this.attributes = {
		// a simple boolean to turn visibility of a node on or off
		visible: {type:boolean, value: true},

		// pos(ition) of the view, relative to parent. For 2D only the first 2 components are used, for 3D all three.
		pos: {type:vec3, value:vec3(0,0,0)},

		// alias for the x component of pos
		x: {alias:'pos', index:0},
		// alias for the y component of pos
		y: {alias:'pos', index:1},
		// alias for the z component of pos
		z: {alias:'pos', index:2},

		// alias for the x component of pos
		left: {alias:'pos', index:0},
		// alias for the y component of pos
		top: {alias:'pos', index:1},
		// alias for the z component of pos
		front: {alias:'pos', index:2},

		// the bottom/right/rear corner 
		corner: {type:vec3, value:vec3(NaN)},
		// alias for the x component of corner
		right: {alias:'corner', index:0},
		// alias for  y component of corner
		bottom: {alias:'corner',index:1},
		// alias for z component of corner
		rear: {alias:'corner', index:2},

		// the background color of a view, referenced by various shaders
		bgcolor: {group:"style", type:vec4, value: vec4('white'), meta:"color"},
		// the background image of a view. Accepts a string-url or can be assigned a require('./mypic.png')
		bgimage: {group:"style",type:Object, meta:"texture"},
		// the opacity of the image
		opacity: {group:"style", value: 1.0, type:float},

		// the clear color of the view when it is in '2D' or '3D' viewport mode
		clearcolor: {group:"style",type:vec4, value: vec4('transparent'), meta:"color"},
		
		// the scroll position of the view matrix, allows to scroll/move items in a viewport. Only works on a viewport:'2D'
		// this property is manipulated by the overflow:'SCROLL' scrollbars
		scroll: {type:vec2, value:vec2(0, 0), persist: true},
		// the zoom factor of the view matrix, allows zooming of items in a viewport. Only works on viewport:'2D'
		zoom:{type:float, value:1},
		// overflow control, shows scrollbars when the content is larger than the viewport. Only works on viewport:'2D'
		// works the same way as the CSS property
		overflow: {type: Enum('','hidden','scroll','auto'), value:''},

		// size, this holds the width/height/depth of the view. When set to NaN it means the layout engine calculates the size
		size: {type:vec3, value:vec3(NaN)},

		// alias for the x component of size
		w: {alias:'size', index:0},
		// alias for the y component of size
		h: {alias:'size', index:1},
		// alias for the z component of size
		d: {alias:'size', index:2},
		
		// alias for the x component of size
		width: {alias:'size', index:0},
		// alias for the y component of size
		height: {alias:'size', index:1},
		// alias for the z component of size
		depth: {alias:'size', index:2},

		// the pixelratio of a viewport. Allows scaling the texture buffer to arbitrary resolutions. Defaults to the system (low/high DPI)
		pixelratio: {type: float, value:NaN},

		// the minimum size for the flexbox layout engine
		minsize: {type: vec3, value:vec3(NaN)},
		// the maximum size for the flexbox layout engine
		maxsize: {type: vec3, value:vec3(NaN)},

		// alias for the x component of minsize
		minwidth: {alias:'minsize', index:0},
		// alias for the y component of minsize
		minheight: {alias:'minsize', index:1},
		// alias for the z component of minsize
		mindepth: {alias:'minsize', index:2},

		// alias for the x component of maxsize
		maxwidth: {alias:'maxsize', index:0},
		// alias for the y component of maxsize
		maxheight: {alias:'maxsize', index:1},
		// alias for the z component of maxsize
		maxdepth: {alias:'maxsize', index:2},

		// the margin on 4 sides of the box (left, top, right, bottom). Can be assigned a single value to set them all at once
		margin: {type: vec4, value: vec4(0,0,0,0)},
		// alias for the first component of margin
		marginleft: {alias:'margin', index:0},
		// alias for the second component of margin
		margintop: {alias:'margin', index:1},
		// alias for the third component of margin
		marginright: {alias:'margin', index:2},
		// alias for the fourth component of margin
		marginbottom: {alias:'margin', index:3},

		// the padding on 4 sides of the box (left, top, right, bottom) Can be assigned a single value to set them all at once
		padding: {type: vec4, value: vec4(0,0,0,0)},
		// alias for the first component of padding
		paddingleft: {alias:'padding', index:0},
		// alias for the second component of padding
		paddingtop: {alias:'padding', index:1},
		// alias for the third component of padding
		paddingright: {alias:'padding', index:2},
		// alias for the fourth component of padding
		paddingbottom: {alias:'padding', index:3},

		// Scale of an item, only useful for items belof a 3D viewport
		scale: {type: vec3, value: vec3(1)},
		// The anchor point around which items scale and rotate, depending on anchor mode its either a factor of size or and absolute value
		anchor: {type: vec3, value: vec3(0.)},
		// the mode with which the anchor is computed. Factor uses the size of an item to find the point, defaulting to center
		anchormode: {type:Enum('','factor','absolute'), value:'factor'},
		// rotate the item around x, y or z in radians. If you want degrees type it like this: 90*DEG
		rotate: {type: vec3, value: vec3(0)},

		// the color of the border of an item. 
		bordercolor: {group:"style",type: vec4, value: vec4(0,0,0,0), meta:"color"},

		// the radius of the corners of an item, individually settable left, top, right, bottom. Setting this value will switch to rounded corner shaders
		borderradius: {group:"style",type: vec4, value: vec4(0,0,0,0)},

		// the width of the border. Setting this value will automatically enable the border shaders
		borderwidth: {group:"style",type: vec4, value: vec4(0,0,0,0)},

		// alias for the first component of borderwidth
		borderleftwidth: {alias:'borderwidth', index:0},
		// alias for the second component of borderwith
		bordertopwidth: {alias:'borderwidth', index:1},
		// alias for the third component of borderwith
		borderrightwidth: {alias:'borderwidth', index:2},
		// alias for the fourth component of borderwith
		borderbottomwidth: {alias:'borderwidth', index:3},

		// turn on flex sizing. Flex is a factor that distributes either the widths or the heights of nodes by this factor
		// flexbox layout is a web standard and has many great tutorials online to learn how it works
		flex: {group:"layout", type: float, value: NaN},

		// wraps nodes around when the flexspace is full
		flexwrap: {group:"layout", type: Enum('wrap','nowrap'), value: "wrap"},	
		// which direction the flex layout is working,
		flexdirection: {group:"layout", type: Enum('row','column'), value: "row"},
		// pushes items eitehr to the start, center or end
		justifycontent: {group:"layout", type: Enum('','flex-start','center','flex-end','space-between','space-around'), value: ""}, 
		// align items to either start, center, end or stretch them
		alignitems: {group:"layout", type: Enum('flex-start','center','flex-end','stretch'), value:"stretch"},  
		// overrides the parents alignitems with our own preference
		alignself: {group:"layout", type: Enum('flex-start','center','flex-end','stretch'), value:"stretch"},  
		// item positioning, if absolute it steps 'outside' the normal flex layout 
		position: {group:"layout", type:  Enum('relative','absolute'), value: "relative" },	

		// the layout object, contains width/height/top/left after computing. Its a read-only property and should be used in shaders only.
		// Can be listened to to observe layout changes
		layout: { type:Object, value:{}, meta:"hidden"},

		// When set to 2D or 3D the render engine will create a separate texture pass for this view and all its children
		// using a 2D viewport is a great way to optimize render performance as when nothing changes, none of the childstructures
		// need to be processed and a single texture can just be drawn by the parent
		// the viewportblend shader can be used to render this texture it into its parent
		viewport: {group:"layout", type:Enum('','2d','3d'), value:''},
	

		// the field of view of a 3D viewport. Only useful on a viewport:'3D'
		fov: {group:"3d", type:float, value: 45},
		// the nearplane of a 3D viewport, controls at which Z value near clipping start. Only useful on a viewport:'3D'
		nearplane: {group:"3d",type:float, value: 0.001},
		// the farplane of a 3D viewport, controls at which Z value far clipping start. Only useful on a viewport:'3D'
		farplane: {group:"3d",type:float, value: 1000},
		
		// the position of the camera in 3D space. Only useful on a viewport:'3D'
		camera: {group:"3d",type: vec3, value: vec3(-2,2,-2)},
		// the point the camera is looking at in 3D space. Only useful on a viewport:'3D'
		lookat: {group:"3d",type: vec3, value: vec3(0)},
		// the up vector of the camera (which way is up for the camera). Only useful on a viewport:'3D'
		up: {group:"3d",type: vec3, value: vec3(0,-1,0)},
		
		// the current time which can be used in shaders to create continous animations
		time:{meta:"hidden"} ,

		// fired when the mouse doubleclicks
		mousedblclick: Event,
		// fires when the mouse moves 'out' of the view. The event argument is the mouse position as {local:vec2}
		mouseout: Event,
		// fires when the mouse moves over the view. The event argument is the mouse position as {local:vec2}
		mouseover: Event,
		// fires when the mouse moves. The event argument is the mouse position as {local:vec2}
		mousemove: Event,
		// fires when the left mouse button is down. The event argument is the mouse position as {local:vec2}
		mouseleftdown: Event,
		// fires when the left mouse button is up. The event argument is the mouse position as {local:vec2}
		mouseleftup: Event,
		// fires when the right mouse button is down. The event argument is the mouse position as {local:vec2}
		mouserightdown: Event,
		// fires when the right mouse button is up. The event argument is the mouse position as {local:vec2}
		mouserightup: Event,
		// fires when the mouse wheels x coordinate changes, also for 2 finger scroll on mac. The event argument is {wheel:float, local:vec2}
		mousewheelx: Event,
		// fires when the mouse wheels y coordinate changes, alsof or 2 finger scroll on mac. The event argument is {wheel:float, local:vec2}
		mousewheely: Event,
		// fires when pinchzoom is used in chrome, or when meta-mouse wheel is used (under review). The event argument is the mouse position as {zoom:float, local:vec2}
		mousezoom: Event,

		// fires when a key goes to up. The event argument is {repeat:int, code:int, name:String}
		keyup: Event,
		// fires when a key goes to down. The event argument is {repeat:int, code:int, name:String}
		keydown: Event,
		// fires when a key gets pressed. The event argument is {repeat:int, value:string, char:int}
		keypress: Event,
		// fires when someone pastes data into the view. The event argument is {text:string}
		keypaste: Event,
		// wether this view has focus
		focus: false,
		// tabstop, sorted by number
		tabstop: NaN
	}

	this.camera = this.lookat = this.up = function(){this.redraw();};

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

	// forward references for shaders
	this.layout = { width:0, height:0, left:0, top:0, right:0, bottom:0}
	this.device = {frame:{size:vec2()}}

	// turn off rpc proxy generation for this prototype level
	this.rpcproxy = false

	// listen to switch the shaders when borderradius changes
	this.borderradius = function(event){
		var value = event.value
		if(typeof value === 'number' && value !== 0 || value[0] !== 0 || value[1] !== 0 || value[2] !== 0 || value[3] !== 0){
			// this switches the bg shader to the rounded one
			this.bg = this.roundedrect
			this.border = this.roundedborder
		}
		else {
			this.bg = this.hardrect
			this.border = this.hardborder
		}
		if(this._borderwidth[0] === 0 && this._borderwidth[1] === 0 && this._borderwidth[2] === 0 && this._borderwidth[3] === 0) this.border = false
	}

	// listen to switch shaders when border width changes
	this.borderwidth = function(event){
		var value = event.value
		if(typeof value === 'number' && value !== 0 || value[0] !== 0 || value[1] !== 0 || value[2] !== 0 || value[3] !== 0){
			// turn it on by assigning an order number
			this.border = true
		}
		else this.border = false
		this.relayout()
	}

	// listen to the viewport to turn off our background and border shaders when 3D
	this.viewport = function(event){
		if(event.value === '3d'){
			this.bg = false
			this.border = false
		}
	}

	// automatically turn a viewport:'2D' on when we  have an overflow (scrollbars) set
	this.overflow = function(){
		if(this._overflow){
			if(!this._viewport) this._viewport = '2d'
		}
	}

	// put a tablistener
	this.tabstop = function(event){
		if(isNaN(event.old) && !isNaN(event.value)){
			this.addListener('keydown', function(value){
				if(value.name === 'tab'){
					if(value.shift) this.screen.focusPrev(this)
					else this.screen.focusNext(this)
				}
			})
		}
	}

	// returns the mouse in local coordinates
	this.localMouse = function(){
		return vec2(this.screen.remapMouse(this))
	}

	// style property, to be determined
	Object.defineProperty(this, 'style', {
		get:function(){ // its really just a forward to this
			return this
		},
		set:function(obj){
			// TODO add failure when someone does 
			if(Array.isArray(obj)){
				for(var i = 0; i < obj.length; i++){
					var subobj = obj[i]
					for(var key in subobj) this[key] = subobj[key]
				}
			}
			else for(var key in obj) this[key] = obj[key]
		}
	})

	// draw dirty is a bitmask of 2 bits, the guid-dirty and the color-dirty
	this.draw_dirty = 3
	// layout dirty causes a relayout to occur (only on viewports)
	this.layout_dirty = true
	// update dirty causes a redraw to occur (only on viewports)
	this.update_dirty = true

	// initialization of a view
	this.init = function(prev){
		this.anims = {}
		//this.layout = {width:0, height:0, left:0, top:0, right:0, bottom:0}
		this.shader_list = []
		this.modelmatrix = mat4()
		if(this._viewport) this.totalmatrix = mat4.identity()
		else this.totalmatrix = mat4()
		this.viewportmatrix = mat4()

		if(prev){
			this._layout =
			this.oldlayout = prev._layout
		}

		if(this._bgimage){
			// set the bg shader
			this.bg = this.hardimage
		}
		// create shaders
		for(var key in this.shader_enable){
			var enable = this.shader_enable[key]
			if(!enable) continue

			var shader = this[key]
			if(shader){
				var shname = key + 'shader'
				var prevshader = prev && prev[shname]
				var shobj
				// ok so instead of comparing constructor, lets compare the computational result
//				if(prevshader && prevshader.constructor !== shader) console.log(shader)
				if(prevshader && (prevshader.constructor === shader || prevshader.isShaderEqual(shader.prototype))){
					shobj = prevshader
					shobj.constructor = shader
					shobj.view = this
					shobj.outer = this
					// ok now check if we need to dirty it

					if(shobj._view_listeners) for(var shkey in shobj._view_listeners){

						this.addListener(shkey, shobj.reupdate.bind(shobj))
						var value = this[shkey]

						if(!(value && value.struct && value.struct.equals(value, prev[shkey]) || value === prev[shkey])){
							shobj.reupdate(shkey)
						}
					}
				}
				else{
					shobj = new shader(this)
				}
				this[shname] = shobj
				shobj.shadername = shname
				this.shader_list.push(shobj)
			}
		}

		if(this._bgimage){
			if(typeof this._bgimage === 'string'){
				require.async(this._bgimage).then(function(result){
					// Second argument for dali loading (DALI)
					var img = this.bgshader.texture = Shader.Texture.fromImage(result, this._bgimage)
					if(isNaN(this._size[0])){
						this._size = img.size
						this.relayout()
					}
					else this.redraw()
				}.bind(this))
			}
			else{
				var img = this.bgshader.texture = Shader.Texture.fromImage(this._bgimage)
				if(isNaN(this._size[0])) this._size = img.size
			}
		}

		//if(this.debug !== undefined && this.debug.indexOf('shaderlist') !== -1){
		//	console.log(this.shader_order)
		//}

		if(this._viewport){
			if(this.bgshader) this.bgshader.noscroll = true
			if(this.bordershader) this.bordershader.noscroll = true
			this.viewportblendshader = new this.viewportblend(this)
		}

		this.sortShaders()
	}

	// emit an event upward (to all parents) untill a listener is hit
	this.emitUpward = function(key, msg){
		if(this['_listen_'+key] || this['on'+key]) return this.emit(key, msg)
		if(this.parent) this.parent.emitUpward(key, msg)
	}

	// called at every frame draw
	this.atDraw = function(){
		if(this.debug !== undefined && this.debug.indexOf('atdraw')!== -1) console.log(this)
	}

	// internal, sorts the shaders
	this.sortShaders = function(){
		
		this.shader_draw_list = this.shader_list.slice(0).sort(function(a, b){
			return this[a.shadername].draworder > this[b.shadername].draworder
		}.bind(this))

		this.shader_update_list = this.shader_list.slice(0).sort(function(a, b){
			return this[a.shadername].updateorder > this[b.shadername].updateorder
		}.bind(this))
		//console.log(this.shader_draw_list)
	}


	// custom hook in the inner class assignment to handle nested shaders specifically
	this.atInnerClassAssign = function(key, value){

		if(!this.hasOwnProperty('shader_enable')) this.shader_enable = Object.create(this.shader_enable || {})

		// set the shader order
		if(!value || typeof value === 'number' || typeof value === 'boolean'){
			this.shader_enable[key] = value? true: false
			return 
		}

		// its a class assignment
		if(typeof value === 'function' && Object.getPrototypeOf(value.prototype) !== Object.prototype){
			this['_' + key] = value

			if(value.prototype instanceof Shader){
				this.shader_enable[key] = true
			}
			return
		}
		// its inheritance
		var cls = this['_' + key]
		this['_' + key] = cls.extend(value, this)

		// check if we need to turn it on
		if(cls.prototype instanceof Shader){
			this.shader_enable[key] = true
		}
	}

	// cause this node, all childnodes and relevant parent nodes to relayout

	this.relayoutRecur = function(){
		this.layout_dirty = true
		this.redraw_dirty = 3
		for(var i = 0;i < this.child_viewport_list.length;i++){
			this.child_viewport_list[i].relayoutRecur()
		}
	}

	this.relayout = function(shallow){
		if(this.screen)this.screen.relayoutRecur()
		return
		var parent = this.parent_viewport
		// ok we haz parent viewport, they we have to check if we are _overflow is something
		while(parent){
			parent.redraw()
			parent.layout_dirty = true

			if(parent === parent.parent_viewport){
				parent = parent.parent && parent.parent.parent_viewport
			}
			else{
				parent = parent.parent_viewport
				if(parent._overflow) break
			}
		}
	}

	// redraw our view and bubble up the viewport dirtiness to the root
	this.redraw = function(){
		if(!this.parent_viewport || this.parent_viewport.draw_dirty === 3) return
		var parent = this
		while(parent){
			var viewport = parent.parent_viewport
			if(!viewport) break
			if(viewport.draw_dirty === 3) return
			viewport.draw_dirty = 3
			parent = viewport.parent
		}
		if(this.device && this.device.redraw) this.device.redraw()
	}
	
	// updates all the shaders
	this.reupdate = function(){
		var shaders = this.shader_list
		if(shaders) for(var i = 0; i < shaders.length; i++){
			shaders[i].reupdate()
		}
	}
	
	// things that trigger a relayout
	this.pos =
	this.corner =
	this.size =
	this.minsize =
	this.maxsize = 
	this.margin =
	this.padding =
	this.flex =
	this.flexwrap =
	this.flexdirection =
	this.justifycontent =
	this.alignitems =
	this.alignself =
	this.position =
	this.relayout

	this.getViewGuid = function(){
		if(this.viewguid) return this.viewguid
		if(this.pickguid){
			this.viewguid = '' +this.pickguid
		}
		var node = this, id = ''
		while(node){
			if(node.parent) id += node.parent.children.indexOf(node)
			node = node.parent
		}
		return this.viewguid = id
	}

	// this gets called by the render engine
	this.updateShaders = function(){
		if(!this.update_dirty) return
		this.update_dirty = false

		// we can wire up the shader 
		if(!this._shaderswired){
			this.atAttributeGet = function(attrname){
				//if(this.constructor.name === 'label')
				//console.log(this.constructor.name, attrname, this['_'+attrname])
				// monitor attribute wires for geometry
				// lets add a listener 
				if(!shader._view_listeners) shader._view_listeners = {}
				shader._view_listeners[attrname] = 1

				this.addListener(attrname,shader.reupdate.bind(shader, attrname))

			}.bind(this)
		}


		var shaders = this.shader_update_list
		for(var i = 0; i < shaders.length; i ++){
			var shader = shaders[i]
			if(shader.update && shader.update_dirty){
				shader.update_dirty = false				
				shader.update()
			}
		}
	
		if(!this._shaderswired) {
			this._shaderswired = true
			this.atAttributeGet = undefined
		}
	}

	// called by doLayout, to update the matrices to layout and parent matrix
	this.updateMatrices = function(parentmatrix, parentviewport, depth){
			
		if (parentviewport == '3d'){// && !this._mode ){	
		
			mat4.TSRT2(this.anchor, this.scale, this.rotate, this.pos, this.modelmatrix);
			//mat4.debug(this.modelmatrix);
		}
		else {
		//	console.log("2d" ,this.constructor.name, this.translate, );
			
			// compute TSRT matrix
			if(this.layout){
				var s = this._scale
				var r = this._rotate
				var t0 = this.layout.left, t1 = this.layout.top, t2 = 0

				//if (this._position === "absolute"){ // layout engine does this
				//	t0 = this._pos[0]
				//	t1 = this._pos[1]
				//}
				var hw = (  this.layout.width !== undefined ? this.layout.width: this._size[0] ) / 2
				var hh = ( this.layout.height !== undefined ? this.layout.height: this._size[1]) / 2
				mat4.TSRT(-hw, -hh, 0, s[0], s[1], s[2], r[0], r[1], r[2], t0 + hw * s[0], t1 + hh * s[1], t2, this.modelmatrix);
			}
			else {
				var s = this._scale
				var r = this._rotate
				var t = this._translate
				var hw = this._size[0] / 2
				var hh = this._size[1] / 2
				mat4.TSRT(-hw, -hh, 0, s[0], s[1], s[2], 0, 0, r[2], t[0] + hw * s[0], t[1] + hh * s[1], t[2], this.modelmatrix);
			}
		}

		if(this._viewport){

			if(parentmatrix) {
				mat4.mat4_mul_mat4(parentmatrix, this.modelmatrix, this.viewportmatrix)
			}
			else{
				this.viewportmatrix = this.modelmatrix
			}
			this.totalmatrix = mat4.identity();
			this.modelmatrix = mat4.identity();	
			parentmode = this._viewport;
			parentmatrix = mat4.identity();
		}
		else{
			if(parentmatrix) mat4.mat4_mul_mat4(parentmatrix, this.modelmatrix, this.totalmatrix)
		}
		

		var children = this.children
		if(children) for(var i = 0; i < children.length; i++){
			var child = children[i]
			if(child._viewport) continue // it will get its own pass
			child.updateMatrices(this.totalmatrix, parentmode, depth)
		}
	}

	// decide to inject scrollbars into our childarray
	this.atRender = function(){
		if(this._viewport === '2d' && (this._overflow === 'scroll'|| this._overflow === 'auto')){
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

			this.children.push(
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
				}),
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

			this.mousewheelx = function(event){
				var wheel = event.wheel
				if(this.hscrollbar._visible){
					this.hscrollbar.value = clamp(this.hscrollbar._value + wheel, 0, this.hscrollbar._total - this.hscrollbar._page)
				}
			}

			this.mousewheely = function(event){
				var wheel = event.wheel
				if(this.vscrollbar._visible){
					this.vscrollbar.value = clamp(this.vscrollbar._value + wheel, 0, this.vscrollbar._total - this.vscrollbar._page)
				}
			}

			this.mousezoom = function(event){
				var zoom = event.zoom
				var lastzoom = this._zoom
				var newzoom = clamp(lastzoom * (1+0.03 * zoom),0.01,10)
				this.zoom = newzoom
				
				var pos = this.localMouse()

				var shiftx = pos[0] * lastzoom - pos[0] * this._zoom
				var shifty = pos[1] * lastzoom - pos[1] * this._zoom 
 				
				this.hscrollbar.value = clamp(this.hscrollbar._value + shiftx, 0, this.hscrollbar._total - this.hscrollbar._page)
				this.vscrollbar.value = clamp(this.vscrollbar._value + shifty, 0, this.vscrollbar._total - this.vscrollbar._page)

				this.updateScrollbars()
				this.redraw()
			}
		}
	}
	
	// show/hide scrollbars
	this.updateScrollbars = function(){

		if(this.vscrollbar){
			var scroll = this.vscrollbar
			var totalsize = Math.floor(this.layout.boundh), viewsize = Math.floor(this.layout.height * this.zoom)

			if(totalsize > viewsize){
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
			var totalsize = Math.floor(this.layout.boundw), viewsize = Math.floor(this.layout.width* this.zoom)
			if(totalsize > viewsize){
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

	// internal, used to compute bounding rects and emit layout event
	function emitPostLayoutAndComputeBounds(node, boundsobj, nochild){
		var ref = node.ref
		var oldlayout = ref.oldlayout || {}
		var layout = ref._layout 

		// lets also emit the layout 
		if(boundsobj){
			if(ref.measured_width !== undefined || ref.measured_height !== undefined){
				var width = layout.absx + max(layout.width,ref.measured_width)
				var height = layout.absy + max(layout.height, ref.measured_height)
			}
			else{
				var width = layout.absx + layout.width
				var height = layout.absy + layout.height
			}
			if(width > boundsobj.boundw) boundsobj.boundw = width
			if(height > boundsobj.boundh) boundsobj.boundh = height
		}

		if(!nochild){
			var children = node.children
			for(var i = 0; i < children.length; i++){
				var child = children[i]
				var clayout = child.layout
				clayout.absx = layout.absx + clayout.left 
				clayout.absy = layout.absy + clayout.top

				emitPostLayoutAndComputeBounds(child, boundsobj, child._viewport)
			}
		}

		if((node.ref._listen_layout || node.ref.onlayout) && 
			(layout.left !== oldlayout.left || layout.top !== oldlayout.top ||
			 layout.width !== oldlayout.width || layout.height !== oldlayout.height)) {
			// call setter
			// lets reset the scroll position
			ref.emit('layout', {type:'setter', owner:ref, key:'layout', value:layout})
		}
		ref.oldlayout = layout
	}

	// called by the render engine
	this.doLayout = function(width, height){
		if(!isNaN(this._flex)){ // means our layout has been externally defined
			var layout = this._layout
			var flex = this._flex
			var size = this._size
			var flexwrap = this._flexwrap
			this._flex = 1
			this._size = vec2(layout.width, layout.height)
			this._flexwrap = false

			if(this.measure) this.measure() // otherwise it doesnt get called

			var copynodes = FlexLayout.fillNodes(this)
			FlexLayout.computeLayout(copynodes)
			
			// lets compute a bounding box of all our children

			//this.sublayout = this.layout
			this._flex = flex
			this._size = size
			this._flexwrap = flexwrap
			this._layout = layout
	
			// this also computes the inner bounding box
			this.layout.absx = 0
			this.layout.absy = 0
			this.layout.boundw = 0
			this.layout.boundh = 0

			emitPostLayoutAndComputeBounds(copynodes, this.layout)

			this.updateScrollbars()
		}
		else{
			var copynodes = FlexLayout.fillNodes(this)
			FlexLayout.computeLayout(copynodes)
			emitPostLayoutAndComputeBounds(copynodes)
		}

		this.updateMatrices(this.parent?this.parent.totalmatrix:undefined, this._viewport)
	}

	this.startAnimation = function(key, value, track, resolve){
		if(this.screen) return this.screen.startAnimationRoot(this, key, value, track, resolve)
		else{
			return false
	//		this['_' + key] = value
		}
	}

	this.stopAnimation = function(key){
		if(this.screen) this.screen.stopAnimationRoot(this, key)
	}

	this.playAnimation = function(key){
		if(this.screen) this.screen.playAnimationRoot(this, key)
	}

	this.pauseAnimation = function(key){
		if(this.screen) this.screen.pauseAnimationRoot(this, key)
	}

	// standard bg is undecided
	define.class(this, 'bg', this.Shader, function(){
		this.updateorder = 0
	})

	// standard border is undecided too
	define.class(this, 'border', this.Shader, function(){
		this.updateorder = 0
	})

	define.class(this, 'hardrect', this.Shader, function(){
		this.updateorder = 0
		this.draworder = 0
		this.mesh = vec2.array()
		this.mesh.pushQuad(0,0,1,0,0,1,1,1)
		this.position = function(){
			uv = mesh.xy
			pos = vec2(mesh.x * view.layout.width, mesh.y * view.layout.height)
			return vec4(pos, 0, 1) * view.totalmatrix * view.viewmatrix
		}
		this.color = function(){
			return vec4(view.bgcolor.rgb, view.bgcolor.a * view.opacity)
		}
	})
	this.hardrect = false

	define.class(this, 'hardborder', this.Shader, function(){
		this.updateorder = 0
		this.draworder = 1
		this.mesh = vec2.array();
		
		this.update = function(){
			var view = this.view
			var width = view.layout?view.layout.width:view.width
			var height = view.layout?view.layout.height:view.height
			var bw1 = view.borderwidth[0]/width;
			var bw2 = view.borderwidth[1]/width;
			var bw3 = view.borderwidth[2]/height;
			var bw4 = view.borderwidth[3]/height;

			var mesh = this.mesh = vec2.array();
//			console.log(bw, height);

			mesh.pushQuad(0,0, bw1,0,0,1,bw1,1);
			mesh.pushQuad(1-bw2,0, 1,0,1-bw2,1,1,1);
			mesh.pushQuad(0,0, 1,0,0,bw3,1,bw3);
			mesh.pushQuad(0,1-bw4, 1,1-bw4,0,1,1,1);
		}
		
		this.mesh.pushQuad(0,0,1,0,0,1,1,1)
		this.mesh.pushQuad(0,0,1,0,0,1,1,1)
		this.mesh.pushQuad(0,0,1,0,0,1,1,1)
		this.mesh.pushQuad(0,0,1,0,0,1,1,1)
		this.position = function(){
			uv = mesh.xy
			pos = vec2(mesh.x * view.layout.width, mesh.y * view.layout.height)
			return vec4(pos, 0, 1) * view.totalmatrix * view.viewmatrix
		}
		this.color = function(){
			return vec4(view.bordercolor.rgb, view.bordercolor.a * view.opacity);
		}
	})
	this.hardborder = false
	// make rect the default bg shader
	this.bg = this.hardrect

	// hard edged bgimage shader
	define.class(this, 'hardimage', this.hardrect, function(){
		this.updateorder = 0
		this.draworder = 0
		this.texture = Shader.Texture.fromType(Shader.Texture.RGBA)
		this.color = function(){
			var col = this.texture.sample(mesh.xy)
			return vec4(col.rgb, col.a * view.opacity)
		}
	})
	this.hardimage = false

	// rounded rect shader class
	define.class(this, 'roundedrect', this.Shader, function(){
		this.updateorder = 0
		this.draworder = 0
		this.vertexstruct = define.struct({
			pos: vec2,
			angle: float,
			radmult: vec4,
			uv:vec2
		})

		this.mesh = this.vertexstruct.array()
	
		this.depth_test = ""

		// matrix and viewmatrix should be referenced on view
		this.opacity = 0.0
		this.drawtype = this.TRIANGLE_FAN
		this.color_blend = 'src_alpha * src_color + (1 - src_alpha) * dst_color'
  
		this.update = function(){
			var view = this.view
			var width = view.layout?view.layout.width:view.width
			var height = view.layout?view.layout.height:view.height
			var radius = view.borderradius

			var mesh = this.mesh = this.vertexstruct.array()

			if (vec4.equals(radius, vec4(0,0,0,0))) {
				mesh.push([width/2,height/2], 0, [1,0,0,0], 0.5,0.5)
				mesh.push([0,0], 0, [1,0,0,0], 0,0)
				mesh.push([width,0], 0, [1,0,0,0], 1,0)
				mesh.push([width,height], 0, [1,0,0,0], 1,1)
				mesh.push([0,height], 0, [1,0,0,0], 0,1)
				mesh.push([0,0], 0, [1,0,0,0], 0,0)
			}
			else{
				
				var divbase = 0.15;
				var pidiv1 = Math.floor(Math.max(2, divbase* PI * radius[0]))
				var pidiv2 = Math.floor(Math.max(2, divbase* PI * radius[1]))
				var pidiv3 = Math.floor(Math.max(2, divbase* PI * radius[2]))
				var pidiv4 = Math.floor(Math.max(2, divbase* PI * radius[3]))
				
				var pimul1 = (PI*0.5)/(pidiv1-1)
				var pimul2 = (PI*0.5)/(pidiv2-1)
				var pimul3 = (PI*0.5)/(pidiv3-1)
				var pimul4 = (PI*0.5)/(pidiv4-1)

				this.mesh.push([width/2,height/2], 0, [0,0,0,0], 0.5,0.5)

				for(var p = 0;p<pidiv1;p++) this.mesh.push(vec2(radius[0] ,radius[0]), p*pimul1, vec4(1,0,0,0), 1,0)	
				for(var p = 0;p<pidiv2;p++) this.mesh.push(vec2(width - radius[1]-1, radius[1]), p*pimul2 + PI/2, vec4(0,1,0,0), 1,0)
				for(var p = 0;p<pidiv3;p++) this.mesh.push(vec2(width - radius[2]-1, height - radius[2]-1), p*pimul3+ PI, vec4(0,0,1,0), 1,1)
				for(var p = 0;p<pidiv4;p++) this.mesh.push(vec2(radius[3], height - radius[3]-1), p*pimul4 + PI + PI/2, vec4(0,0,0,1), 0,1)
				
				this.mesh.push(vec2( radius[0] ,radius[0]), 0, vec4(1,0,0,0), 1,0)
			}	
		}

		this.color = function(){
			return vec4(view.bgcolor.rgb, view.bgcolor.a * view.opacity)
		}

		this.position = function(){
			pos = mesh.pos.xy
			var ca = cos(mesh.angle + PI)
			var sa = sin(mesh.angle + PI)
			
			var rad  = (mesh.radmult.x * view.borderradius.x + mesh.radmult.y * view.borderradius.y + mesh.radmult.z * view.borderradius.z + mesh.radmult.w * view.borderradius.w)
			pos.x += ca * rad
			pos.y += sa * rad
			
			uv = vec2(pos.x/view.layout.width,  pos.y/view.layout.height)
			
			sized = vec2(pos.x, pos.y)
			return vec4(sized.x, sized.y, 0, 1) * view.totalmatrix * view.viewmatrix
		}
	})
	this.roundedrect = false
	
	define.class(this, 'viewportblend', this.Shader, function(){
		this.draworder = 10
		this.updateorder = 10
		this.omit_from_shader_list = true
		this.texture = Shader.prototype.Texture.fromType('rgba_depth_stencil')
		this.mesh = vec2.array()
		this.mesh.pushQuad(0,0, 0,1, 1,0, 1,1)
		this.width = 0
		this.height = 0

		this.position = function(){
			return vec4( mesh.x * width, mesh.y * height, 0, 1) * view.viewportmatrix * view.viewmatrix
		}

		this.color = function(){
			var col = texture.sample(mesh.xy)
			return vec4(col.rgb, col.a * view.opacity)
		}
	})
	this.viewportblend = false

	// rounded corner border shader
	define.class(this, 'roundedborder', this.Shader, function(){
		this.draworder = 1
		this.updateorder = 1
		this.vertexstruct = define.struct({
			pos: vec2,
			angle: float,
			radmult: vec4,			
			uv:vec2
		})
		this.mesh = this.vertexstruct.array()
		this.drawtype = this.TRIANGLE_STRIP
		
		this.update = function(){

			var view = this.view
			var width = view.layout? view.layout.width: view.width
			var height = view.layout? view.layout.height: view.height

			var mesh = this.mesh = this.vertexstruct.array()
						
			var borderradius = view.borderradius
			var borderwidth = view.borderwidth

			var scale0 = ((borderradius[0]-borderwidth[0]))/Math.max(0.01, borderradius[0])
			var scale1 = ((borderradius[1]-borderwidth[0]))/Math.max(0.01, borderradius[1])
			var scale2 = ((borderradius[2]-borderwidth[0]))/Math.max(0.01, borderradius[2])
			var scale3 = ((borderradius[3]-borderwidth[0]))/Math.max(0.01, borderradius[3])
			
			var pidiv = 20
			
			var divbase = 0.15
			var pidiv1 = Math.floor(Math.max(2, divbase* PI * borderradius[0]))
			var pidiv2 = Math.floor(Math.max(2, divbase* PI * borderradius[1]))
			var pidiv3 = Math.floor(Math.max(2, divbase* PI * borderradius[2]))
			var pidiv4 = Math.floor(Math.max(2, divbase* PI * borderradius[3]))
			
			var pimul1 = (PI*0.5)/(pidiv1-1)
			var pimul2 = (PI*0.5)/(pidiv2-1)
			var pimul3 = (PI*0.5)/(pidiv3-1)
			var pimul4 = (PI*0.5)/(pidiv4-1)

			for(var p = 0; p < pidiv1; p ++){
				this.mesh.push(vec2( borderradius[0] ,borderradius[0]), p*pimul1, vec4(1,0,0,0), 1,0);
				this.mesh.push(vec2( borderradius[0] ,borderradius[0]), p*pimul1, vec4(scale0,0,0,0), 1,0);
			}
			
			for(var p = 0;p<pidiv2;p++){
				this.mesh.push(vec2(width-borderradius[1],borderradius[1]), p*pimul2 + PI/2, vec4(0,1,0,0), 1,0);
				this.mesh.push(vec2(width-borderradius[1],borderradius[1]), p*pimul2 + PI/2, vec4(0,scale1,0,0), 1,0);
			}
			for(var p = 0;p<pidiv3;p++){
				this.mesh.push(vec2(width-borderradius[2],height-borderradius[2]), p*pimul3 + PI, vec4(0,0,1,0), 1,1);
				this.mesh.push(vec2(width-borderradius[2],height-borderradius[2]), p*pimul3 + PI, vec4(0,0,scale2,0), 1,1);
			}
			for(var p = 0;p<pidiv4;p++){
				this.mesh.push(vec2(borderradius[3],height-borderradius[3]), p*pimul4 + PI + PI/2, vec4(0,0,0,1), 0,1);
				this.mesh.push(vec2(borderradius[3],height-borderradius[3]), p*pimul4 + PI + PI/2, vec4(0,0,0,scale3), 0,1);
			}				
			this.mesh.push(vec2( borderradius[0] ,borderradius[0]), 0, vec4(1,0,0,0), 1,0);
			this.mesh.push(vec2( borderradius[0] ,borderradius[0]), 0, vec4(scale0,0,0,0), 1,0);
		
		}
		
		this.color = function(){
			return vec4(view.bordercolor.rgb, view.opacity * view.bordercolor.a)
		}
		
		this.position = function(){
			
			pos = mesh.pos.xy

			var ca = cos(mesh.angle + PI)
			var sa = sin(mesh.angle+PI)
			

			
			var rad  = dot(mesh.radmult, view.borderradius)
			pos.x += ca * rad
			pos.y += sa * rad
			
			uv = vec2(pos.x/view.width,  pos.y/view.height)
			
			sized = vec2(pos.x, pos.y)
			return vec4(sized.x, sized.y, 0, 1) * view.totalmatrix * view.viewmatrix
		}
	})
	this.roundedborder = false


	// lets pull in the scrollbar on the view
	define.class(this, 'scrollbar', require('$ui/scrollbar'),function(){
		this.bg = {
			noscroll:true
		}
	})
})
