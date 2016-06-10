define.class('$base/node', function(require){

	var Animation = require('$base/animation')

	this.attributes = {
		// the bottom/right/rear corner, used by layout
		corner: Config({type:vec3, value:vec3(NaN)}),
		percentsize: Config({type:vec3, value:vec3(NaN)}),
		percentpos: Config({type:vec3, value:vec3(NaN)}),
		// the pixelratio of a viewport. Allows scaling the texture buffer to arbitrary resolutions. Defaults to the system (low/high DPI)
		pixelratio: Config({type: float, value:NaN}),
		// the minimum size for the flexbox layout engine
		minsize: Config({type: vec3, value:vec3(NaN), meta:'xyz'}),
		// the maximum size for the flexbox layout engine
		maxsize: Config({type: vec3, value:vec3(NaN), meta:'xyz'}),
		// Scale of an item, only useful for items belof a 3D viewport
		scale: Config({type: vec3, value: vec3(1), meta:'xyz'}),
		// The anchor point around which items scale and rotate, depending on anchor mode its either a factor of size or and absolute value
		anchor: Config({type: vec3, value: vec3(0.)}),
		// the mode with which the anchor is computed. Factor uses the size of an item to find the point, defaulting to center
		anchormode: Config({type:Enum('','factor','absolute'), value:'factor'}),
		// orientation
		orientation: Config({type:vec3, value:vec3(0)}),
		// turn on flex sizing. Flex is a factor that distributes either the widths or the heights of nodes by this factor
		// flexbox layout is a web standard and has many great tutorials online to learn how it works
		flex: Config({group:'layout', type: float, value: NaN}),
		// wraps nodes around when the flexspace is full
		flexwrap: Config({group:'layout', type: Enum('wrap','nowrap'), value: 'wrap'}),
		// which direction the flex layout is working,
		flexdirection: Config({group:'layout', type: Enum('row','column'), value: 'row'}),
		// pushes items eitehr to the start, center or end
		justifycontent: Config({group:'layout', type: Enum('','flex-start','center','flex-end','space-between','space-around'), value: ''}),
		// align items to either start, center, end or stretch them
		alignitems: Config({group:'layout', type: Enum('flex-start','center','flex-end','stretch'), value:'stretch'}),
		// overrides the parents alignitems with our own preference
		alignself: Config({group:'layout', type: Enum('', 'flex-start','center','flex-end','stretch'), value:''}),
		// item positioning, if absolute it steps 'outside' the normal flex layout
		position: Config({group:'layout', type:  Enum('relative','absolute'), value: 'relative'}),
		// the color of the border of an item.
		bordercolor: Config({group:'style',type: vec4, value: vec4(0,0,0,0), meta:'color'}),
		// the radius of the corners of an item, individually settable left, top, right, bottom. Setting this value will switch to rounded corner shaders
		borderradius: Config({group:'style',type: vec4, value: vec4(0,0,0,0)}),
		// the width of the border. Setting this value will automatically enable the border shaders
		borderwidth: Config({group:'style',type: vec4, value: vec4(0,0,0,0)}),
		// the field of view of a 3D viewport. Only useful on a viewport:'3D'
		camerafov: Config({group:'3d', type:float, value: 45}),
		// the nearplane of a 3D viewport, controls at which Z value near clipping start. Only useful on a viewport:'3D'
		cameranear: Config({group:'3d',type:float, value: 0.001}),
		// the farplane of a 3D viewport, controls at which Z value far clipping start. Only useful on a viewport:'3D'
		camerafar: Config({group:'3d',type:float, value: 1000}),
		// the position of the camera in 3D space. Only useful on a viewport:'3D'
		camerapos: Config({group:'3d',type: vec3, value: vec3(-2,2,-2)}),
		// the point the camera is looking at in 3D space. Only useful on a viewport:'3D'
		cameralookat: Config({group:'3d',type: vec3, value: vec3(0)}),
		// the up vector of the camera (which way is up for the camera). Only useful on a viewport:'3D'
		cameraup: Config({group:'3d',type: vec3, value: vec3(0,-1,0)}),


		// internal, the current time which can be used in shaders to create continous animations
		time:Config({meta:'hidden', value:0}),
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
		focuslost: Config({type:Event}),
		// drop shadow size
		dropshadowradius:Config({type:float, value:20}),
		// drop shadow movement
		dropshadowoffset:Config({type:vec2, value:vec2(0,0)}),
		// drop shadow hardness
		dropshadowhardness:Config({type:float, value:0.5, minvalue: 0, maxvalue:1}),
		// drop shadow opacity
		dropshadowopacity:Config({type:float, value:0, minvalue: 0, maxvalue:1}),
		// drop shadow color
		dropshadowcolor:Config({type:vec4,meta:'color', value:vec4('black')}),
		// whether this view has focus
		focus: Config({meta:'hidden', value:false, persist:true}),
		// tabstop, sorted by number
		tabstop: NaN
		// // alias for the x component of size
		// width: Config({alias:'size', index:0}),
		// // alias for the y component of size
		// height: Config({alias:'size', index:1}),
		// // alias for the z component of size
		// depth: Config({alias:'size', index:2}),
		// // alias for the x component of minsize
		// minwidth: Config({alias:'minsize', index:0}),
		// // alias for the y component of minsize
		// minheight: Config({alias:'minsize', index:1}),
		// // alias for the z component of minsize
		// mindepth: Config({alias:'minsize', index:2}),
		// // alias for the x component of maxsize
		// maxwidth: Config({alias:'maxsize', index:0}),
		// // alias for the y component of maxsize
		// maxheight: Config({alias:'maxsize', index:1}),
		// // alias for the z component of maxsize
		// maxdepth: Config({alias:'maxsize', index:2}),
		// // internal, alias for the x component of size
		// w: Config({alias:'size', index:0}),
		// // internal, alias for the y component of size
		// h: Config({alias:'size', index:1}),
		// // internal, alias for the z component of size
		// d: Config({alias:'size', index:2}),
		// // alias for the x component of pos
		// x: Config({alias:'pos', index:0}),
		// // alias for the y component of pos
		// y: Config({alias:'pos', index:1}),
		// // alias for the z component of pos
		// z: Config({alias:'pos', index:2}),
		// // alias for the x component of pos
		// left: Config({alias:'pos', index:0}),
		// // alias for the y component of pos
		// top: Config({alias:'pos', index:1}),
		// // alias for the z component of pos
		// front: Config({alias:'pos', index:2}),
		// // alias for the x component of corner
		// right: Config({alias:'corner', index:0}),
		// // alias for  y component of corner
		// bottom: Config({alias:'corner', index:1}),
		// // alias for z component of corner
		// rear: Config({alias:'corner', index:2}),
		// // alias for the x component of percentsize NOT IMPLEMENTED
		// percentwidth: Config({alias:'percentsize', index:0}),
		// // alias for the y component of percentsize NOT IMPLEMENTED
		// percentheight: Config({alias:'percentsize', index:1}),
		// // alias for the z component of percentsize NOT IMPLEMENTED
		// percentdepth: Config({alias:'percentsize', index:2}),
		// // internal, percentage widths/heights NOT IMPLEMENTED
		// percentx: Config({alias:'percentpos', index:0}),
		// // internal, percentage widths/heights NOT IMPLEMENTED
		// percenty: Config({alias:'percentpos', index:1}),
		// // internal, percentage widths/heights NOT IMPLEMENTED
		// percentz: Config({alias:'percentpos', index:2}),
		// // alias for the first component of margin
		// marginleft: Config({alias:'margin', index:0}),
		// // alias for the second component of margin
		// margintop: Config({alias:'margin', index:1}),
		// // alias for the third component of margin
		// marginright: Config({alias:'margin', index:2}),
		// // alias for the fourth component of margin
		// marginbottom: Config({alias:'margin', index:3}),
		// // alias for the first component of padding
		// paddingleft: Config({alias:'padding', index:0}),
		// // alias for the second component of padding
		// paddingtop: Config({alias:'padding', index:1}),
		// // alias for the third component of padding
		// paddingright: Config({alias:'padding', index:2}),
		// // alias for the fourth component of padding
		// paddingbottom: Config({alias:'padding', index:3}),
		// // orientation of the item
		// rotate: Config({alias:'orientation', index:2}),
		// // rotate the item around x in radians. If you want degrees type it like this: 90*DEG
		// rotatex: Config({alias:'orientation', index:0}),
		// // rotate the item around y in radians. If you want degrees type it like this: 90*DEG
		// rotatey: Config({alias:'orientation', index:1}),
		// // alias for the first component of borderwidth
		// borderleftwidth: Config({alias:'borderwidth', index:0}),
		// // alias for the second component of borderwith
		// bordertopwidth: Config({alias:'borderwidth', index:1}),
		// // alias for the third component of borderwith
		// borderrightwidth: Config({alias:'borderwidth', index:2}),
		// // alias for the fourth component of borderwith
		// borderbottomwidth: Config({alias:'borderwidth', index:3}),
	}

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

	// Internal unproject function TODO: move to vec
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

	// internal, setting focus to true
	this.onfocus = function(event){
		if(!event.mark){ // someone set it to true that wasnt us
			this.screen.setFocus(this)
		}
	}

	// internal, put a tablistener
	this.ontabstop = function(event){
		if(isNaN(event.old) && !isNaN(event.value)){
			// this.addListener('keydown', function(value){
			// 	if(value.name === 'tab'){
			// 		if(value.shift) this.screen.focusPrev(this)
			// 		else this.screen.focusNext(this)
			// 	}
			// })
		}
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

		var lastmode = '2d'

		this.remapmatrix = mat4.identity()

		for(var i = parentlist.length - 1; i >= 0; i--) {
			var P = parentlist[i]
			var newmode = P.parent? P._viewport:'2d'

			if (P.parent) {

				var MM = P._viewport? P.viewportmatrix: P.totalmatrix

				if (!P.viewportmatrix) console.log(i, 'whaaa' )
				mat4.invert(P.viewportmatrix, this.remapmatrix)

				// 3d to layer transition -> do a raypick.
				if (lastmode == '3d') {
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

	/*
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
	}*/

	/*
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
	}*/

	/*
	this.defaultKeyboardHandler = function(v, prefix){
		if (!prefix) prefix = '

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
	}*/

	this.animate = function(key, track){
		return new define.Promise(function(resolve, reject){
			this.startAnimation(key, undefined, track, resolve)
		}.bind(this))
	}

	// step callback for the animation
	function animStep(value){
		if(this.config.storage){
			this.view['_' + this.config.storage][this.config.index] = value
			this.view.emit(this.config.storage, {animation:true, key: this.key, owner:this.view, value:this.view['_' + this.config.storage]})
		}
		this.view['_' + this.key] = value
		this.view.emit(this.key, {animation:true, key: this.key, owner:this.view, value:value})
	}

	this.startAnimation = function(key, value, track, resolve){
		if(!this.initialized) return false

		// ok so. if we get a config passed in, we pass that in
		var anim = new Animation()

		var config = this._attributes[key]
		// store the config for the animStep
		anim.config = config
		anim.key = key
		anim.type = config.type
		// track overloads config
		if(track) config = track
		// config sets props
		if(config){
			if(config.motion !== undefined) anim.motion = config.motion
			if(config.delay !== undefined) anim.delay = config.delay
			if(config.bounce !== undefined) anim.bounce = config.bounce
			if(config.type !== undefined) anim.type = config.type
			if(config.speed !== undefined) anim.speed = config.speed
			if(!track){
				track = {}
				track[config.duration] = value
			}
		}
		if(!track) throw new Error('no track')
		if(track.motion) anim.motion = track.motion
		anim.first_value = this['_'+key]
		anim.track = track
		anim.resolve = resolve
		anim.atStep = animStep
		anim.view = this

		this.screen.startViewAnimation(this.pickview + '_' + key, anim)
		// start the animation with a redraw
		this.redraw()
	}

	this.stopAnimation = function(key){
		if(this.initialized) this.screen.stopViewAnimation(this.pickview + '_' + key)
	}

	// Basic usage of the splitcontainer
	this.constructor.examples = {
		Usage:function(){ return [
			view({margin:10, width:50, height:50, bgcolor:'red'}),
			view({width:50, height:50, bgcolor:'green', bordercolor:'pink', borderwidth:10, borderradius:7}),
			view({x:30, y:10, width:50, height:50, bgcolor:'blue'})
		]}
	}

})
