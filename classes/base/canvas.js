define.class(function(exports){

	this.initCanvas = function(view){
		this.view = view
		this.scope = view
		this.matrix = mat4.identity()
		this.cmds = []
		this.stackAlign = []
		this.trackAlign = []
		this.matrixStack = [this.matrix]
		this.matrixStackLen = 0
		this.align = this.stackAlign[0] = {x:0,y:0,w:0,h:0,flags:this.LEFT,total:0}
	}

	this.clearCmds = function(){
		this.cmds.length = 0
		this.stackAlign.len = 0
		this.trackAlign.length = 0
		this.matrixStackLen = 0
		var o = this.matrix
		o[0] = 1, o[1] = 0, o[2] = 0, o[3] = 0,
		o[4] = 0, o[5] = 1, o[6] = 0, o[7] = 0,
		o[8] = 0, o[9] = 0, o[10]= 1, o[11]= 0,
		o[12]= 0, o[13]= 0, o[14]= 0, o[15]= 1
		this.x = undefined
		this.y = undefined
		this.w = this.width
		this.h = this.height
		this.align = this.stackAlign[0]
		this.beginAlign(this.LEFT|this.TOP, this.view.padding)
	}

	this.LEFT = 1
	this.TOP = 2
	this.RIGHT = 4
	this.BOTTOM = 8
	this.NOWRAP = 16
	this.INSIDE = 64
	//this.NEEDTRACK = this.WRAP| this.RIGHT | this.HCENTER | this.BOTTOM | this.VCENTER

	this.push = function(){
		var len = ++this.matrixStackLen
		var n = this.matrix
		var o = this.matrixStack[len] || (this.matrixStack[len] = mat4())
		o[0] = n[0], o[1] = n[1], o[2] = n[2], o[3] = n[3]
		o[4] = n[4], o[5] = n[5], o[6] = n[6], o[7] = n[7]
		o[8] = n[8], o[9] = n[9], o[10]= n[10], o[11]= n[11]
		o[12]= n[12], o[13]= n[13], o[14]= n[14], o[15]= n[15]
	}

	this.pop = function(){
		if(this.matrixStackLen <= 0) return
		var len = --this.matrixStackLen
		this.matrix = this.matrixStack[len]
	}

	this.translate = function(x, y, z){
		mat4.translateXYZ(this.matrix, x, y, z, this.matrix)
	}

	this.rotate = function(x, y, z, r){
		mat4.rotateXYZ(this.matrix, r, x, y, z, this.matrix)
	}

	this.rotateX = function(r){
		mat4.rotateX(this.matrix, r, this.matrix)
	}

	this.rotateY = function(r){
		mat4.rotateY(this.matrix, r, this.matrix)
	}

	this.rotateZ = function(r){
		mat4.rotateZ(this.matrix, r, this.matrix)
	}

	this.scale = function(x,y,z){
		mat4.scaleXYZ(this.matrix, x, y, z, this.matrix)
	}

	// readpixel
	this.readPixels = function(x, y, w, h, buffer){
		return new define.Promise(function(resolve, reject){
			this.cmds.push('readPixels', {x:x,y:y,w:w,h:h, buffer:buffer, resolve:resolve})
		}.bind(this))
	}

	// start an alignment
	this.beginAlign = function(flags, margin, padding){
		// store old align
		var oldalign = this.stackAlign[this.stackAlign.len] = this.align
		this.stackAlign.len++
		
		// fetch new one
		var align = this.align = this.stackAlign[this.stackAlign.len] || {}
	
		if(Array.isArray(padding)){
			 align.p0 = padding[0], align.p1 = padding[1], align.p2 = padding[2], align.p3 = padding[3]
		}
		else if(typeof padding === 'number'){
			 align.p0 = align.p1 = align.p2 = align.p3 = padding
		}
		else{
			align.p0 = align.p1 = align.p2 = align.p3 = 0
		}
		
		if(Array.isArray(margin)){
			align.m0 = margin[0], align.m1 = margin[1], align.m2 = margin[2], align.m3 = margin[3]
		}
		else if(typeof margin === 'number'){
			align.m0 = align.m1 = align.m2 = align.m3 = margin
		}
		else{
			align.m0 = align.m1 = align.m2 = align.m3 = 0
		}
		
		var xs = !isNaN(this.x)? this.x: oldalign.x
		var ys = !isNaN(this.y)? this.y: oldalign.y

		align.xstart = align.x = xs + align.p3	+ align.m3 //+ align.m1
		align.ystart = align.y = ys + align.p0 + align.m0 //+ align.m2

		if(this.w === undefined){
			flags = flags | this.LEFT
			align.computew = true
			align.wrapx = this.width
		}
		else if(this.w === auto){
			flags = flags | this.LEFT
			align.computew = true
			align.w = this.w - align.p1 - align.p3 
		}
		else if(this.w === fill){
			this.w = this.width - align.x - align.m1 + align.p1// - align.m3 //+align.p1
			align.computew = false
			align.w = this.w - align.p1 - align.p3 
		}
		else{
			align.computew = false
			align.w = this.w - align.p1 - align.p3 
			align.wrapx = xs + this.w
		}

		if(this.h === undefined){
			flags = flags | this.TOP
			align.computeh = true
		}
		else if(this.h === auto){
			flags = flags | this.TOP
			align.computeh = true
			align.h = this.h - align.p0 - align.p2
		}
		else if(this.h === fill){
			this.h = this.height - align.y - align.m2 + align.p2
			align.computeh = false
			align.h = this.h - align.p0 - align.p2
		}
		else{
			align.computeh = false
			align.h = this.h - align.p0 - align.p2
		}

		align.flags = flags
		align.trackstart = this.trackAlign && this.trackAlign.length || 0
		align.maxx = 0
		align.maxy = 0
		align.inh = this.h
		align.inw = this.w
		align.inx = this.x
		align.iny = this.y
	}

	this.displaceAlign = function(start, key, displace, dbg){
		var track = this.trackAlign
		var current = this.stackAlign.len
		for(var i = start; i < track.length; i += 4){
			var buf = track[i]
			var off = track[i+1]
			var range = track[i+2]
			var level = track[i+3]
			if(current > level) continue
			var slots = buf.struct.slots
			var rel = buf.struct.offsets[key]
			var array = buf.array
			for(var j = off; j < off+range; j++){
				var offset = j * slots + rel
				array[offset] += displace
			}
		}
	}
		
	this.markAbsolute = function(align){
		var start = align.trackstart
		var track = this.trackAlign
		for(var i = start; i < track.length; i += 4){
			track[i+3] = -1
		}
	}

	this.endAlign = function(){
		// if we are align HCENTER/RIGHT lets do the h-align.
		var align = this.align
		var dx = align.maxx - align.xstart
		var dy = align.maxy - align.ystart

		var start = align.trackstart
		
		if(align.flags & this.LEFT){
		}
		else if(align.flags & this.RIGHT){
			this.displaceAlign(start, 'x', align.w - dx)
		}
		else {
			this.displaceAlign(start, 'x', (align.w - dx) / 2)
		}
		if(align.flags & this.TOP){
		}
		else if(align.flags & this.BOTTOM){
			this.displaceAlign(start, 'y', align.h - dy)
		}
		else{
			this.displaceAlign(start, 'y', (align.h - dy) / 2)
		}

		this.w = dx + align.p1 + align.p3
		this.h = dy + align.p0 + align.p2

		var oldalign = align
		align = this.align = this.stackAlign[--this.stackAlign.len]
		
		if(align && oldalign.maxh > align.maxh) align.maxh  = oldalign.maxh

		// do a bit of math to size our rect to the computed size
		if(oldalign.computew){
			this.w = (oldalign.maxx + oldalign.p1 - oldalign.m1)
			if(isNaN(oldalign.inx)) this.w -= align.x
			else this.w -= oldalign.inx
		}
		else this.w = oldalign.inw
		if(oldalign.computeh){
			this.h = (oldalign.maxy + oldalign.p2 - oldalign.m2)
			//console.log(oldalign.iny)
			if(isNaN(oldalign.iny)) this.h -= align.y
			else this.h -= oldalign.iny
			//console.log(oldalign.y)
		}
		else this.h = oldalign.inh
		
		this.x = oldalign.inx
		this.y = oldalign.iny
		//if(dy > align.maxh) align.maxh = dy
	}

	this.runAlign = function(cls, buffer, range, imargin, oldalign){

		var align = this.align

		var m0 = 0,m1 = 0,m2 = 0,m3 = 0
		if(oldalign){
			m0 = oldalign.m0, m1 = oldalign.m1, m2 = oldalign.m3, m3 = oldalign.m3
		}
		else{
			var margin = imargin || cls && cls.margin
			if(margin !== undefined){
				if(typeof margin === 'number') m0 = m1 = m2 = m3 = margin
				else m0 = margin[0], m1 = margin[1], m2 = margin[2], m3 = margin[3]
			}
		}

		var strw, strh
		if(this.w === fill){
			strw = true
			this.w = this.width - align.xstart - m3
			this.w -= m1 + m3
		}
		if(this.h === fill){
			this.h = this.height - align.y
			this.h -= m0 + m2
		}

		if(cls._absolute){
			if(cls._absolute&1){
				this.y = align.ystart + m0 + cls._top
			}
			if(cls._absolute&2){
				if(isNaN(align.w)) this.x = align.xstart + m3 + cls._right
				this.x = align.xstart + align.w - this.w - cls._right - m1//0//this.width - this.w//align.xstart - m3 + cls._right
			}
			if(cls._absolute&4){
				if(isNaN(align.h)) this.y = align.ystart + m0 + cls._bottom
				else this.y = align.ystart + align.h - this.h - m2//t - align.ystart + m3 + cls._bottom
			}
			if(cls._absolute&8){
				this.x = align.xstart + m3 + cls._left
			}
			this.trackAlign.push(buffer, buffer.length, range || 1, this.stackAlign.len - 1)
			// absolutely align a sub thing
			if(oldalign){
				var dx = this.x - oldalign.xstart + oldalign.p3
				var dy = this.y - oldalign.ystart + oldalign.p0
				var start = oldalign.trackstart
				this.displaceAlign(start, 'x', dx, 1)
				this.displaceAlign(start, 'y', dy, 1)
			}
			var maxx = this.x + this.w + m3
			if(maxx > align.maxx) align.maxx = maxx
			var maxy = this.y + this.h + m0
			if( maxy> align.maxy) align.maxy = maxy

			return
		}

		this.trackAlign.push(buffer, buffer.length, range || 1, this.stackAlign.len)

		var first = Math.abs(align.x-align.xstart) < 0.001
		this.x = align.x + m3 
		this.y = align.y + m0

		align.x += this.w + m3 + m1
		var hs = this.h + m0 + m2

		if(!(align.flags & this.NOWRAP) && !align.computew && !first && align.x > align.wrapx){
			align.x = align.xstart 

			if(strw){
				align.maxh = this.h
				align.y += align.maxy - align.y
			}
			else{
				align.y += align.maxy - align.y//align.lastmaxh || align.maxh
			}
			//console.log(align.y)

			var newx = align.xstart + m3
			var newy =  align.y + m0
			var dx = newx - this.x
			var dy = newy - this.y

			align.x += this.w + m3 + m1

			if(oldalign){
				//console.log('here')
				var start = oldalign.trackstart
				this.displaceAlign(start, 'x', dx, 1)
				this.displaceAlign(start, 'y', dy, 1)
			}
			this.x = newx
			this.y = newy
		}
		//align.lastmaxh = align.maxh
		if(align.x > align.maxx) align.maxx = align.x
		var hy = align.y + hs
		if( hy> align.maxy) align.maxy = hy
	}

	// break terminates an align cycle and does a newline
	this.newline = function(height){
		var align = this.align
		align.x = align.xstart 
		align.y += align.maxy - align.y
	}

	this.addCanvas = function(ctx, index){
		ctx.trackAlign = this.trackAlign
		ctx.stackAlign = this.stackAlign
		ctx.width = this.width
		ctx.height = this.height
		ctx.frameid = this.frameid
		ctx.target = this.target
		ctx.has_view_matrix_set = this.has_view_matrix_set
		this.cmds.push('canvas', ctx.cmds, ctx.view)
	}

	this.clear = function(r, g, b ,a){
		var color = r
		if(r !== undefined && g !== undefined) color = [r,g,b,a]
		this.cmds.push('clear', color !== undefined?color:this.scope.clearcolor)
	}

	this.startCache = function(uid, isdirty){
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
	}
	
	this.stopCache = function(){
		if(!this.cachestack || !this.cachestack.length) throw new Error('no matching pushcache')
		var uid = this.cachestack.pop()
		var pos = this.cachestack.pop()
		if(!this.view.draw_cache) this.view.draw_cache = {}
		this.view.draw_cache[uid] = {
			cmds:this.cmds.slice(pos, this.cmds.length), 
			pickdraw:this.view.pickdraw
		}
	}
	
	this.drawShaderCmd = function(shader, buffer){
		if(!this.has_view_matrix_set){
			if(this.target.flags&this.DEPTH){
				this.setPerspectiveViewMatrix()
			}
			else{
				this.setOrthoViewMatrix()
			}
		}
		shader.view = this.view
		shader._canvas = buffer
		this.cmds.push(
			'drawShader',
			shader
		)
	}

	// create or reuse a matrix by name
	this.getMatrix = function(name, itarget){
		var target = itarget !== undefined? itarget: this.target.targetguid
		var store = this.view.matrix_store[target]
		if(!store) this.view.matrix_store[target] = store = {}
		var mat = store[name]
		if(!mat) store[name] = mat = mat4()
		return mat
	}

	// load a matrix (return undefined when not there)
	this.loadMatrix = function(name, itarget){
		var target = itarget !== undefined? itarget: this.target.targetguid
		var store = this.view.matrix_store[target]
		if(!store) return
		return store[name]
	}

	// sets the view matrix
	this.setViewMatrix = function(iviewmatrix){
		var isstring = typeof iviewmatrix === 'string'
		var viewmatrix = isstring? this.loadMatrix(iviewmatrix) : iviewmatrix
		if(!iviewmatrix) return
		this.cmds.push(
			'setViewMatrix',
			viewmatrix,
			isstring?iviewmatrix:undefined
		)
		this.has_view_matrix_set = true
	}
	
		// sets the view matrix to default ortho projection which is in device pixels top left 0,0
	this.setOrthoViewMatrix = function(yflip, xflip, iwidth, iheight, ixscroll, iyscroll, izoom, left, top){
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
	}
	
	// set the view matrix to a perspective projection
	this.setPerspectiveViewMatrix = function(ifov, inear, ifar, icamera, ilookat, iup, iwidth, iheight){
			
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
	}

	this.getDoubleTarget = function(name, iflags, iwidth, iheight){
		if(!iframes) iframes = 2
		// lets return a double buffered target which flips on every request
	}

	// Copied from texturewebgl
	this.RGB = 1 <<0
	this.RGBA = 1 << 1
	this.ALPHA = 1 << 3
	this.DEPTH = 1 << 4
	this.STENCIL = 1 << 5
	this.LUMINANCE = 1<< 6
	this.PICK = 1<<7
	this.FLOAT = 1<<10
	this.HALF_FLOAT = 1<<11
	this.FLOAT_LINEAR = 1<<12
	this.HALF_FLOAT_LINEAR = 1<<13

	this.getTarget = function(name, iflags, iwidth, iheight){
		if(typeof name !== 'string'){
			throw new Error('Please provide a string unique target identifier')
		}
		var width = iwidth !== undefined?iwidth:this.scope._layout.width
		var height = iheight !== undefined?iheight:this.scope._layout.height
		var flags = iflags !== undefined?iflags:this.RGBA
		var targetguid = this.view.guid + '_' + flags + '_'+ (name || this.cmds.length)
		var target = {targetguid:targetguid, name:name, width:width, height:height, flags:flags, frameid:this.frameid}

		// mark it for the GC
		if(!this.view.render_targets) this.view.render_targets = {}
		this.view.render_targets[targetguid] = target

		//this.cmds.push(
		//	'getTarget', 
		//	target
		//)
		return target
	}

	this.pushTarget = function(name, iflags, iwidth, iheight){
		var target = name
		if(typeof name !== 'object') target = this.getTarget(name, iflags, iwidth, iheight)

		if(!this.cmdstack) this.cmdstack = []
		this.cmdstack.push(this.cmds, this.target)
		this.cmds = []
		this.target = target
		this.width = target.width
		this.height = target.height
		this.has_matrix_set = false
		var pass = {
			target:target, 
			cmds:this.cmds, 
			view:this.view
		}
		var draw_passes = this.view.screen.draw_passes
		var id = draw_passes.indexOf(target.targetguid)
		if(id !== -1) draw_passes.splice(id, 2)
		draw_passes.push(target.targetguid, pass)

		// also add it to pick passes
		if(target.flags & this.PICK){
			var pick_passes = this.view.screen.pick_passes
			var id = pick_passes.indexOf(target.targetguid)
			if(id === -1){
				pick_passes.push(target.targetguid, pass)
			}
		}

		this.has_view_matrix_set = false

		return target
	}

	this.popTarget = function(){
		if(!this.cmdstack.length) throw new Error('popTarget empty')
		this.target = this.cmdstack.pop()
		this.cmds = this.cmdstack.pop()
		if(this.target){
			this.height = this.target.height
			this.width = this.target.width
		}
	}

	var staticCacheMax = 256000
	var staticCache = {}
	var staticCol = vec4()
	this.parseColor = function(col, stc){
		if(stc){
			var out = staticCache[col]
			if(out) return out 
			if(!staticCacheMax){
				return vec4.parse(col, true, staticCol)
			}
			staticCacheMax--
			return staticCache[col] = vec4.parse(col, undefined, true)
		}
		return vec4.parse(col, undefined, true)
	}
		
	// compile the verbs
	exports.compileCanvasVerbs = function(root, canvas, name, cls){

		var verbs = cls._canvasverbs
		var defaults = cls._defaults
		var struct = cls._canvas && cls._canvas.struct
		var slots = struct && struct.slots
		var def = struct && struct.def
		var cap = name.charAt(0).toUpperCase() + name.slice(1)		

		canvas['array' + cap] = struct
		canvas['class' + cap] = cls

		// bail if we dont have any new functions or struct data
		if(canvas[name+'_canvasverbs'] === verbs &&
			canvas[name+'_canvasstruct'] === struct){
			return
		}

		canvas[name+'_canvasverbs'] = verbs
		canvas[name+'_canvasstruct'] = struct

		//!TODO use a proper JS parser / codegen to mod the code

		// put accessors on our root
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
				defProp(root, key, info.offset/4, info.type)
			}
		}

		for(var verb in verbs){
			if(verb[0] === '_') continue
			var fn = verbs[verb]
			if(typeof fn === 'function'){
				var args = define.getFunctionArgs(fn)
				var fnstr = fn.toString()	

				fnstr = fnstr.replace(/(\t*)this\.([\_]+[\_A-Z0-9]+)\s*\(\s*\)/,function(m,ind,name){
					var str = verbs[name].toString()
					return str.slice(12,-1)
				})

				// macros
				fnstr = fnstr.replace(/(\t*)this\.GETSTAMP\s*\(\s*\)/,function(m, ind){
					var write = 
					ind+'var _draw_canvas = this.view.draw_canvas\n'+
					ind+'var canvas = _draw_canvas["'+cap+'"]\n'+
					ind+'if(!canvas){\n'+
					ind+'\t_draw_canvas["'+cap+'"] = canvas = Object.create(this.class'+cap+'.Canvas)\n'+
					ind+'\tcanvas.initCanvas(this.view)\n'+
					ind+'}\n'+
					ind+'if(canvas.frameid !== this.frameid){\n'+
					ind+'\tcanvas.frameid = this.frameid\n'+
					ind+'\tthis.addCanvas(canvas)\n'+
					ind+'\tcanvas.cmds.length = 0\n'+
					ind+'}\n'+

					ind+'var _pickdraw = canvas.pickdraw = ++this.view.pickdraw\n'+
					ind+'var _draw_objects = this.view.draw_objects\n'+
					ind+'var stamp = _draw_objects[_pickdraw] || (_draw_objects[_pickdraw] = Object.create(this.class'+cap+'))\n'+
					ind+'stamp.pickdraw = _pickdraw\n'+
					ind+'canvas.scope = stamp\n'+
					ind+'canvas.align = this.align\n'+
					ind+'canvas.x = canvas.y = undefined\n'+
					ind+'stamp.canvas = canvas\n'
					//for(var i = 0; i < args.length; i++){
					//	write += 'canvas.'+args[i]+' = stamp.'+args[i]+' = '+args[i] + '\n'
					//}
					return write
				})
				
				fnstr = fnstr.replace(/(\t*)this\.RECTARGS\s*\(\s*\)/,function(m, ind){
					 
					//ind+'if(w === undefined && x !== undefined) w = x, x = undefined, console.log("hi")\n'+
					//ind+'if(h ===undefined && y !== undefined) h = y, y = undefined\n'+

					return  ''+
					ind+'if(typeof x === "object") w = x.w, h = x.h, y = x.y, x = x.x\n'+
					ind+'if(isNaN(x)) x = this.x\n'+
					ind+'if(isNaN(y)) y = this.y\n'+
					ind+'if(w === undefined) w = this.class'+cap+'.w\n'+
					ind+'if(h === undefined) h = this.class'+cap+'.h\n'
					/*
					ind+'if(w === stretch){\n'+
					ind+'\tw = this.width \n'+
					ind+'\tvar _margin =  this.class'+cap+'.margin\n'+
					ind+'\tif(typeof _margin === "number") w -= _margin * 2\n'+
					ind+'\telse if(_margin) w -= (_margin[1] + _margin[3])\n'+
					ind+'}\n'+
					ind+'if(h === stretch){\n'+
					ind+'\th = this.height\n'+
					ind+'\tvar _margin =  this.class'+cap+'.margin\n'+
					ind+'\tif(typeof _margin === "number") h -= _margin * 2\n'+
					ind+'\telse if(_margin) h -= (_margin[0] + _margin[2])\n'+
					ind+'}\n'*/
				})


				fnstr = fnstr.replace(/(\t*)this\.GETBUFFER\s*\(\s*([^\)]*)\s*\)/,function(m, ind, needed){
					var write = ind+'var buffer = this.buffer'+cap+'\n'+
						ind+'if(!buffer){\n'+
						ind+'\tthis.buffer'+cap+' = buffer = this.alloc'+cap+'?this.array'+cap+'.array(this.alloc'+cap+'):this.array'+cap+'.array()\n' + 
						ind+'\tthis.buffer'+cap+' = buffer\n'+
						ind+'}\n'+
						ind+'buffer.clean = false\n'+
						ind+'this.scope.index'+cap+' = buffer.length\n'+
						ind+'buffer.instancedivisor = this.instancedivisor'+cap+'|| 1\n'+
						ind+'var _needed = '+(needed?(needed+' || 1'):'1')+'\n'+
						ind+'if(buffer.length + _needed >= buffer.allocated){\n'+
							ind+'\tvar _ns = (buffer.length + _needed > buffer.allocated * 2)? (buffer.length + _needed): buffer.allocated * 2\n'+
							ind+'\tfor(var _n = new buffer.arrayconstructor(_ns * '+slots+'), _o = buffer.array, _i = 0, _s = buffer.allocated * '+slots+'; _i < _s; _i++) _n[_i] = _o[_i]\n'+
							ind+'\tbuffer.array = _n, buffer.allocated = _ns\n'+
						ind+'}\n'+
						ind+'if(buffer.frameid !== this.frameid){\n'+
						ind+'\tthis.buffer'+cap+' = buffer\n'+
						ind+'\tbuffer.length = 0\n'+
						ind+'\tbuffer.frameid = this.frameid\n'+
						ind+'\tvar _shader = Object.create(this.class'+cap+')\n'+
						ind+'\tthis.shaderNAME = _shader\n'+
						ind+'\tthis.drawShaderCmd(_shader, buffer)\n'+
						ind+'}\n'
						//ind+'var _array = buffer.array, _off = _len*'+slots+', _obj\n'
					return write	
				})
				
				fnstr = fnstr.replace(/(\t*)this\.ARGSTO\s*\(\s*([^\)]*)\)/,function(m, ind, where){
					var write = ''
					for(var i = 0; i < args.length; i ++){
						var key = args[i]
						write += ind+'if('+key+'!==undefined ) '+where+'.'+key+' = '+key+'\n'
					}

					//for(var key in def) if(typeof def[key] === 'function' && args.indexOf(key) !== -1){
					//	write += ind+'if('+key+'!==undefined) this.'+key+' = '+key+'\n'
					//}
					return write
				})

				// push canvas into buffer
				fnstr = fnstr.replace(/(\t*)this\.CANVASTOBUFFER\s*\(\s*([^\)]*)\s*\)/,function(m, ind, argmapstr){
					var argmap = {}
					var NaNCheck = false
					if(argmapstr === 'NaN'){
						NaNCheck = true
					}
					else if(argmapstr){ // quickly parse map {key:value}
						// fetch string baseclasses for nested classes and add them
						var maprx = new RegExp(/([$_\w]+)\:([^},\n]+)/g)
						var resul
						while((result = maprx.exec(argmapstr)) !== null) {
							argmap[result[1]] = result[2]
						}
					}
					var write = 'var _array = buffer.array, _off = buffer.length * '+slots+', _obj\n'
					// iterate over the keys
					var off = 0
					for(var key in def) if(typeof def[key] === 'function'){
						// lets output to the array
						// and copy it from the canvas
						var dft = '(this.scope._'+key+' || 0)'
						if(key in defaults) dft = defaults[key]

						var itemslots = def[key].slots
						var value = 'this.'+key+'!==undefined?this.'+key+':this.class'+cap+'.'+key+'!==undefined?this.class'+cap+'.'+key+':'+dft
						if(key in argmap) value = argmap[key]
						if(itemslots>1){
							write += ind+'_obj = '+value+'\n'
							write += ind+'if(_obj !== undefined){\n'
							if(itemslots === 4)
								write += ind+'if(typeof _obj === "string") _obj = this.parseColor(_obj, true)\n'
							for(var i = 0; i < itemslots; i++, off++){
								write += ind + '\t'
								if(NaNCheck) write += 'if(isNaN(_array[_off + ' + off + ']))'
								write += '_array[_off + ' + off + '] = _obj['+i+']\n'
							}
							write += ind+'}\n'
						}
						else{
							write += ind+'\t'
							if(NaNCheck) write += 'if(isNaN(_array[_off + ' + off + '])) this.'+key+'='
							write += '_array[_off + ' + off + '] = '+value+'\n'
							off++
						}
					}
					write += ind+'buffer.length++\n'
					return write
				})
	
				//console.log(fnstr)
				fnstr = fnstr.replace(/NAME/g, cap)
				canvas[verb+cap] = Function('return '+fnstr)()
			}
			else{
				canvas[verb] = fn
			}
		}
	}
})