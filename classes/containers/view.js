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
		pos: {type:vec3, value:vec3(0,0,0)},
		x: {storage:'pos', index:0},
		y: {storage:'pos', index:1},
		z: {storage:'pos', index:2},

		left: {storage:'pos', index:0},
		top: {storage:'pos', index:1},
		front: {storage:'pos', index:2},

		corner: {type:vec3, value:vec3(NaN)},
		right: {storage:'corner', index:0},
		bottom: {storage:'corner',index:1},
		rear: {storage:'corner', index:2},

		bgcolor: {type:vec4, value: vec4('white')},
		bgimage: {type:Object},

		clearcolor: {type:vec4, value: vec4('transparent')},
		scroll: {type:vec2, value:vec2(0, 0)},
		zoom:{type:float, value:1},
		size: {type:vec3, value:vec3(NaN)},

		overflow: {type: Enum('','HIDDEN','SCROLL','AUTO'), value:''},
		pixelratio: {type: float, value:NaN},

		w: {storage:'size', index:0},
		h: {storage:'size', index:1},
		d: {storage:'size', index:2},
		
		width: {storage:'size', index:0},
		height: {storage:'size', index:1},
		depth: {storage:'size', index:2},

		minsize: {type: vec3, value:vec3(NaN)},
		maxsize: {type: vec3, value:vec3(NaN)},

		minwidth: {storage:'minsize', index:0},
		minheight: {storage:'minsize', index:1},
		mindepth: {storage:'minsize', index:2},

		maxwidth: {storage:'maxsize', index:0},
		maxheight: {storage:'maxsize', index:1},
		maxdepth: {storage:'maxsize', index:2},

		margin: {type: vec4, value: vec4(0,0,0,0)},
		marginleft: {storage:'margin', index:0},
		margintop: {storage:'margin', index:1},
		marginright: {storage:'margin', index:2},
		marginbottom: {storage:'margin', index:3},

		padding: {type: vec4, value: vec4(0,0,0,0)},
		paddingleft: {storage:'padding', index:0},
		paddingtop: {storage:'padding', index:1},
		paddingright: {storage:'padding', index:2},
		paddingbottom: {storage:'padding', index:3},

		scale: {type: vec3, value: vec3(1)},
		anchor: {type: vec3, value: vec3(0)},
		rotate: {type: vec3, value: vec3(0)},
		//translate: {type: vec3, value: vec3(0)},

		bordercolor: {type: vec4, value: vec4(0,0,0,0)},

		borderwidth: {type: vec4, value: vec4(0,0,0,0)},
		borderradius: {type: vec4, value: vec4(0,0,0,0)},
		borderleftwidth: {storage:'borderwidth', index:0},
		bordertopwidth: {storage:'borderwidth', index:1},
		borderrightwidth: {storage:'borderwidth', index:2},
		borderbottomwidth: {storage:'borderwidth', index:3},

		flex: {type: float, value: NaN},

		flexwrap: {type: String, value: "wrap"},	//'wrap', 'nowrap'
		flexdirection: {type: String, value: "row"},	//'column', 'row'
		justifycontent: {type: String, value: ""}, //	'flex-start', 'center', 'flex-end', 'space-between', 'space-around'
		alignitems: {type: String, value:"stretch"},  // 	'flex-start', 'center', 'flex-end', 'stretch'
		alignself: {type: String, value:"stretch"},  // 	'flex-start', 'center', 'flex-end', 'stretch'
		position: {type: String, value: "relative" },	//'relative', 'absolute'

		layout: {type:Object, value:{}},

		viewport: {type:Enum('','2D','3D'), value:''},
		
		visible: {type:boolean, value: true},
		fov: {type:float, value: 45},
		nearplane: {type:float, value: 0.001},
		farplane: {type:float, value: 1000},
		
		camera: {type: vec3, value: vec3(-2,2,-2)},
		lookat: {type: vec3, value: vec3(0)},
		up: {type: vec3, value: vec3(0,-1,0)},
		
		time: 0,

		mousedblclick: Event,
		mouseout: Event,
		mouseover: Event,
		mousemove: Event,
		mouseleftdown: Event,
		mouseleftup: Event,
		mouserightdown: Event,
		mouserightup: Event,
		mousewheelx: Event,
		mousewheely: Event,
		mousezoom: Event,
		keyup: Event,
		keydown: Event,
		keypress: Event,
		keypaste: Event,

		focusget: Event,
		focuslost: Event	
	}

	this.camera = this.lookat = this.up = function(){this.redraw();};
	
	this.modelmatrix = mat4.identity()
	this.totalmatrix = mat4.identity()
	this.viewmatrix = mat4.identity()
	this.layermatrix = mat4.identity()
	this.normalmatrix = mat4.identity()
	
	// forward references for shaders
	this.layout = {width:0, height:0, left:0, top:0, right:0, bottom:0}
	this.device = {frame:{size:vec2()}}

	this.rpcproxy = false

	// automatically switch to the rounded shader
	this.borderradius = function(event){
		var value = event.value
		if(typeof value === 'number' && value !== 0 || value[0] !== 0 || value[1] !== 0 || value[2] !== 0 || value[3] !== 0){
			// this switches the bg shader to the rounded one
			this.border = false
			this.border = this.roundedborder
			if (this._borderwidth > 0) this.border = 2
			this.bg = this.roundedrect
		}
		else {
			this.border = false;
			this.bg = this.hardrect
			this.border = this.hardborder;
			if (this._borderwidth > 0) this.border = 2
		}
	}

	// turn on the border shader
	this.borderwidth = function(event){
		var value = event.value
		if(typeof value === 'number' && value !== 0 || value[0] !== 0 || value[1] !== 0 || value[2] !== 0 || value[3] !== 0){
			// turn it on by assigning an order number
			this.border = 2
		}
		else this.border = false
		this.relayout()
	}

	this.mode = function(event){
		if(event.value === '3D'){
			this.bg = null
			this.border = null
		}
	}

	this.overflow = function(){
		if(this._overflow){
			if(!this._viewport) this._viewport = '2D'
		}
	}

	this.localMouse = function(){
		return vec2(this.screen.remapMouse(this))
	}

	// make a style property you can assign a bunch of props to like a prop copier
	Object.defineProperty(this, 'style', {
		get:function(){ // its really just a forward to this
			return this
		},
		set:function(obj){
			// TODO add failure when someone does 
			if(Array.isArray(obj)){
				for(var i = 0; i < obj.length; i++){
					var subobj = obj[i]
					for(key in subobj) this[key] = subobj[key]
				}
			}
			else for(var key in obj) this[key] = obj[key]
		}
	})

	this.draw_dirty = 3
	this.layout_dirty = true
	this.update_dirty = true

	this.init = function(prev){
		this.anims = {}
		//this.layout = {width:0, height:0, left:0, top:0, right:0, bottom:0}
		this.shader_list = []
		this.modelmatrix = mat4()
		this.totalmatrix = mat4.identity()
		this.layermatrix = mat4()

		if(prev){
			this._layout =
			this.oldlayout = prev._layout
		}

		if(this._bgimage){
			// set the bg shader
			this.bg = this.hardimage
		}

		// create shaders
		for(var key in this.shader_order){
			var order = this.shader_order[key]
			if(!order) continue
			var shader = this[key]
			if(shader){
				var prevshader = prev && prev[key+'shader']
				var shobj
				// ok so instead of comparing constructor, lets compare the computational result
				if(prevshader && (prevshader.constructor === shader || prevshader.isShaderEqual(shader.prototype))){
					shobj = prevshader
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
				this[key + 'shader'] = shobj
				shobj.shadername = key
				shobj.order = order
				this.shader_list.push(shobj)
			}
		}

		if(this._bgimage){
			if(typeof this._bgimage === 'string'){
				require.async(this._bgimage).then(function(result){
					var img = this.bgshader.texture = Shader.Texture.fromImage(result)
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

		if(this.debug !== undefined && this.debug.indexOf('shaderlist') !== -1){
			console.log(this.shader_order)
		}

		if(this._viewport){
			// give it a blendshader
			this.blendshader = new this.blend(this)
		}

		this.sortShaders()
	}

	this.emitUpward = function(key, msg){
		if(this['_listen_'+key] || this['on'+key]) return this.emit(key, msg)
		if(this.parent) this.parent.emitUpward(key, msg)
	}

	this.atDraw = function(){
		if(this.debug !== undefined && this.debug.indexOf('atdraw')!== -1) console.log(this)
	}

	this.sortShaders = function(){
		this.shader_list = this.shader_list.sort(function(a, b){
			return this.shader_order[a.shadername] > this.shader_order[b.shadername]
		}.bind(this))
		// re-denormalize the order property
		for(var i = 0; i < this.shader_list.length;i++){
			var shader = this.shader_list[i]
			shader.order = this.shader_order[shader.shadername]
		}
	}

	this.shaderOrder = function(key, value){
		if(!this.hasOwnProperty('shader_order')) this.shader_order = Object.create(this.shader_order || {})
		// the first time is always false

		if(this.shader_order[key] === undefined){
			this.shader_order[key] = false
			return
		}
		this.shader_order[key] = value
	}

	// custom hook in the inner class assignment to handle nested shaders specifically
	this.atInnerClassAssign = function(key, value){

		// set the shader order

		if(!value || typeof value === 'number' || typeof value === 'boolean'){
			// if we are at runtime, something else must happen
			this.shaderOrder(key, value)
			if(this.shader_list) this.sortShaders()
			return 
		}

		var order = this.shader_order && this.shader_order[key] || 1
		// its a shader redirect
		if(typeof value === 'string'){
			this[key] = this[value]
			var order = this.shader_order[key]
			if(typeof order !== 'number') this.shaderOrder(key, order)
			return
		}

		// its a class assignment
		if(typeof value === 'function' && Object.getPrototypeOf(value.prototype) !== Object.prototype){
			this['_' + key] = value
			if(value.prototype instanceof Shader){
				this.shaderOrder(key, order)
			}
			return
		}
		// its inheritance
		var cls = this['_' + key]
		this['_' + key] = cls.extend(value, this)

		// check if we need to turn it on
		if(cls.prototype instanceof Shader){
			var order = this.shader_order[key]
			if(order !== null && typeof order !== 'number'){
				this.shaderOrder(key, 1)
			}
		}
	}

	this.relayout = function(shallow){
		// so we need to have a list of child layers.
		if(!this.layer || this.layer.layout_dirty) return
		var child_layer_list = this.layer.child_layer_list
		for(var i = 0; i < child_layer_list.length;i++){
			var child = child_layer_list[i]
			child.relayout(true)
		}
		var parent = this
		while(parent){
			var layer = parent.layer
			if(!layer || layer.layout_dirty) break
			layer.layout_dirty = true
			parent = layer.parent 
			if(shallow) break
		}
		// layout happens in the drawloop
		this.redraw()
	}

	// redraw our view and bubble up the layer dirtiness to the root
	this.redraw = function(){
		if(!this.layer || this.layer.draw_dirty === 3) return
		var parent = this
		while(parent){
			var layer = parent.layer
			if(!layer) break
			if(layer.draw_dirty === 3) return
			layer.draw_dirty = 3
			parent = layer.parent 
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


		var shaders = this.shader_list
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

	// called by doLayout
	this.updateMatrices = function(parentmatrix, parentviewport, depth){
			
		if (parentviewport== '3D'){// && !this._mode ){	
		
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
				mat4.mat4_mul_mat4(parentmatrix, this.modelmatrix, this.layermatrix)
			}
			else{
				this.layermatrix = this.modelmatrix
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
		if(this._viewport === '2D' && (this._overflow === 'SCROLL'|| this._overflow === 'AUTO')){
			if(this.vscrollbar) this.vscrollbar.offset = 0
			if(this.hscrollbar) this.hscrollbar.offset = 0
			this.children.push(
				this.vscrollbar = this.scrollbar({
					position:'absolute',
					vertical:true,
					noscroll:true,
					value:function(){
						this.parent._scroll = vec2(this.parent._scroll[0],this._value)
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
					position:'absolute',
					vertical:false,
					noscroll:true,
					value:function(){
						this.parent._scroll = vec2(this._value,this.parent._scroll[1])
					},
					layout:function(){
						var parent_layout = this.parent.layout
						var this_layout = this.layout
						this_layout.left = 0
						this_layout.height = 10
						this_layout.width = parent_layout.width
						this_layout.top = parent_layout.height - this_layout.height
					}
				})
			)
			this.mousewheelx = function(pos){
				if(this.hscrollbar._visible){
					this.hscrollbar.value = clamp(this.hscrollbar._value + pos, 0, this.hscrollbar._total - this.hscrollbar._page)
				}
			}

			this.mousewheely = function(pos){
				if(this.vscrollbar._visible){
					this.vscrollbar.value = clamp(this.vscrollbar._value + pos, 0, this.vscrollbar._total - this.vscrollbar._page)
				}
			}

			this.mousezoom = function(zoom){
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
			this.bg = -1
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
			for(var i = 0; i < children.length;i++){
				var child = children[i]
				var clayout = child.layout
				clayout.absx = layout.absx + clayout.left 
				clayout.absy = layout.absx + clayout.top

				emitPostLayoutAndComputeBounds(child, boundsobj, child._viewport)
			}
		}

		if((node.ref._listen_layout || node.ref.onlayout) && 
			(layout.left !== oldlayout.left || layout.top !== oldlayout.top ||
			 layout.width !== oldlayout.width || layout.height !== oldlayout.height)) {
			// call setter
			// lets reset the scroll position
			ref.emit('layout', {type:'setter',owner:ref,key:'layout', value:layout})
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
			this['_' + key] = value
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
	define.class(this, 'bg', this.Shader, function(){})
	// standard border is undecided too
	define.class(this, 'border', this.Shader, function(){})

	define.class(this, 'hardrect', this.Shader, function(){
		this.mesh = vec2.array()
		this.mesh.pushQuad(0,0,1,0,0,1,1,1)
		this.position = function(){
			uv = mesh.xy
			pos = vec2(mesh.x * view.layout.width, mesh.y * view.layout.height)
			return vec4(pos, 0, 1) * view.totalmatrix * view.viewmatrix
		}
		this.color = function(){
			return view.bgcolor
		}
	})
	
	define.class(this, 'hardborder', this.Shader, function(){
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
			return view.bordercolor;
		}
	})

	// make rect the default bg shader
	this.bg = this.hardrect

	define.class(this, 'hardimage', this.hardrect, function(){
		this.texture = Shader.Texture.fromType(Shader.Texture.RGBA)
		this.color = function(){
			return this.texture.sample(mesh.xy)
		}
	})
	this.hardimage = false

	// rounded rect shader class
	define.class(this, 'roundedrect', this.Shader, function(){

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
			return view.bgcolor
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

	// the blending shader
	define.class(this, 'blend', this.Shader, function(){
		this.omit_from_shader_list = true
		this.texture = Shader.prototype.Texture.fromType('rgba_depth_stencil')
		this.mesh = vec2.array()
		this.mesh.pushQuad(0,0, 0,1, 1,0, 1,1)
		this.width = 0
		this.height = 0

		this.color = function(){
			return texture.sample(mesh.xy+vec2(0))
		}

		this.position = function(){
			return vec4( mesh.x * width, mesh.y * height, 0, 1) * view.layermatrix * view.viewmatrix
		}
	})
	this.blend = null
	
	// rounded corner border shader
	define.class(this, 'roundedborder', this.Shader, function(){
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
			return view.bordercolor
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
	this.border = false

	// lets pull in the scrollbar on the view
	define.class(this, 'scrollbar', require('$controls/scrollbar'),function(){
		this.bg = -1
	})
})