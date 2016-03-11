define.class(function(exports){

	this.initCanvas = function(view){
		this.view = view
		this.scope = view
		this.matrix = mat4.identity()
		this.cmds = []
		this.stackAlign = []
		this.trackAlign = []
		this.align = this.stackAlign[0] = {x:0,y:0,w:0,h:0,flags:0,total:0}
	}

	this.clearCmds = function(){
		this.cmds.length = 0
		this.stackAlign.len = 0
		this.trackAlign.length = 0
		var align = this.align = this.stackAlign[0]
		align.total = 0
		align.x = this.x = 0
		align.y = this.y = 0
		align.w = this.w = this.width
		align.h = this.h = this.height
	}

	this.TOP = 0
	this.LEFT = 1
	this.RIGHT = 2
	this.HCENTER = 4
	this.BOTTOM = 8
	this.VCENTER = 16
	this.CENTER = this.HCENTER|this.VCENTER
	this.WRAP = 32
	this.INSIDE = 64
	this.NEEDTRACK = this.WRAP| this.RIGHT | this.HCENTER | this.BOTTOM | this.VCENTER

	this.margins = [0,0,0,0]
	this.padding = [0,0,0,0]

	// start an alignment
	this.beginAlign = function(flags, padding){
		// ok lets push the align props

		// store old align
		var oldalign = this.stackAlign[this.stackAlign.len] = this.align
		this.stackAlign.len++

		// fetch new one
		var align = this.align = this.stackAlign[this.stackAlign.len] || {}
		
		align.flags = flags
		var pad = align.padding = padding || this.padding
		var xs,ys,ws,hs 
		if(flags & this.INSIDE){
			xs = this.x
			ys = this.y
			ws = this.w
			hs = this.h 
		}
		else{
			xs = oldalign.x
			ys = oldalign.y
			ws = oldalign.w
			hs = oldalign.h
		}
		align.total |= oldalign.total|flags
		align.xstart =
		align.x = xs + pad[3]		
		align.ystart = 
		align.y = ys + pad[0]
		align.w = ws - pad[1] - pad[3]
		align.h = hs - pad[0] - pad[2]
		align.trackstart = this.trackAlign && this.trackAlign.length || 0
		align.maxx = 0
		align.maxy = 0
		align.maxh = 0
	}

	this.displaceAlign = function(start, key, displace, dbg){
		var track = this.trackAlign
		for(var i = start; i < track.length; i += 3){
			var buf = track[i]
			var off = track[i+1]
			var range = track[i+2]
			var slots = buf.struct.slots
			var rel = buf.struct.offsets[key]
			var array = buf.array
			for(var j = off; j < off+range; j++){
				var offset = j * slots + rel
				array[offset] += displace
			}
		}
	}
	
	this.endAlign = function(argflags, margins){
		// if we are align HCENTER/RIGHT lets do the h-align.
		var align = this.align
		var dx = align.maxx - align.xstart
		var dy = align.maxy - align.ystart

		var start = align.trackstart
		// if the w / h things are NaN.. what do we do
		//if(isNaN(align.w)) align.w = dx
		//if(isNaN(align.h)) align.h = dy

		if(align.flags & this.HCENTER){
			this.displaceAlign(start, 'x', (align.w - dx) / 2)
		}
		else if(align.flags & this.RIGHT){
			this.displaceAlign(start, 'x', align.w - dx)
		}
		if(align.flags & this.VCENTER){
			this.displaceAlign(start, 'y', (align.h - dy) / 2)
		}
		else if(align.flags & this.BOTTOM){
			this.displaceAlign(start, 'y', align.h - dy)
		}

		this.w = dx + align.padding[1] + align.padding[3]
		this.h = dy + align.padding[0] + align.padding[2]

		var oldalign = align
		align = this.align = this.stackAlign[--this.stackAlign.len]
	
		// check if we need to wrap our nested alignment
		if(align.flags & this.WRAP && !(oldalign.flags&this.INSIDE)){
			// ifso we need to check what to delta.
			if(align.x + this.w > align.w){
				var dx = align.xstart - align.x
				var dy = align.maxh //this.padding[0]+ this.padding[2] 
				align.x = align.xstart 
				align.y += dy
				this.displaceAlign(start, 'x', dx, 1)
				this.displaceAlign(start, 'y', dy, 1)
			}
		}

		if(dy > align.maxh) align.maxh = dy

		if(!(argflags & this.INSIDE) && !(oldalign.flags & this.INSIDE)){
			this.runAlign()
		}

		if(margins){
			var m0,m1,m2,m3
			if(typeof margins === 'number') m0 = m1 = m2 = m3 = margins
			else m0 = margins[0], m1 = margins[1], m2 = margins[2], m3 = margins[3]

			this.displaceAlign(start, 'x', m3, 1)
			this.displaceAlign(start, 'y', m0, 1)
			this.align.margins = margins
		}

		align.total |= oldalign.total
	}
	Object.defineProperty(this, 'h2', {
		get:function(){
			return this._h
		},
		set:function(v){
			if(v === 46)debugger
			this._h = v
		}
	})
	this.runAlign = function(cls, buffer, range){
		// ok so if we have 
		var align = this.align
		if(!align || !align.flags) return
		var margins = cls && cls.margins || align.margins || this.margins
		var m0,m1,m2,m3
		if(typeof margins === 'number') m0 = m1 = m2 = m3 = margins
		else m0 = margins[0], m1 = margins[1], m2 = margins[2], m3 = margins[3]

		if(align.total & this.NEEDTRACK && buffer){
			this.trackAlign.push(buffer, buffer.length, range || 1)
		}

		this.x = align.x + m3
		this.y = align.y + m0

		align.x += this.w + m3 + m1
		var hs = this.h + m0 + m2

		if(hs > align.maxh) align.maxh = hs

		// use the next y as the maxy
		var hy = align.y + hs

		if( hy> align.maxy) align.maxy = hy

		if(align.x > align.maxx) align.maxx = align.x
		//if(align.maxy === 36) debugger
		if(align.flags & this.WRAP && align.x >= align.w){
			this.newline()
			this.x = align.x + m3
			this.y = align.y + m0
			align.x += this.w + m3 + m1
		}

	}

	// break terminates an align cycle and does a newline
	this.newline = function(pad){
		var align = this.align
		align.x = align.xstart 
		align.y += align.maxh + this.padding[0]+ this.padding[2] + (pad || 0)
	}

	this.addCanvas = function(ctx, index){
		ctx.trackAlign = this.trackAlign
		ctx.stackAlign = this.stackAlign
		ctx.frameid = this.frameid
		this.cmds.push('canvas', ctx.cmds, ctx.view)
	}

	this.clear = function(){
		this.cmds.push('clear', this.clearcolor !== undefined?this.clearcolor:this.view.clearcolor)
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
	}

	this.pushTarget = function(target, passname, outputname){

		if(!this.cmdstack) this.cmdstack = []
		this.cmdstack.push(this.cmds, this.target)
		this.cmds = []
		this.target = target

		var pass = {
			passname:passname,
			target:target, 
			outputname:outputname, 
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
	}

	this.popTarget = function(){
		if(!this.cmdstack.length) throw new Error('popTarget empty')
		this.target = this.cmdstack.pop()
		this.cmds = this.cmdstack.pop()
	}
		
	// compile the verbs
	exports.compileCanvasVerbs = function(root, canvas, name, cls){

		var verbs = cls._canvasverbs
		var defaults = cls._defaults
		var struct = cls._canvas && cls._canvas.struct
		var slots = struct && struct.slots
		var def = struct && struct.def
		var cap = name.charAt(0).toUpperCase() + name.slice(1)		

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

		canvas['array' + cap] = struct
		canvas['class' + cap] = cls

		for(var verb in verbs){
			var fn = verbs[verb]
			if(typeof fn === 'function'){
				var args = define.getFunctionArgs(fn)
				var fnstr = fn.toString()	

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
					ind+'stamp.canvas = canvas\n'
					for(var i = 0; i < args.length; i++){
						write += 'canvas.'+args[i]+' = stamp.'+args[i]+' = '+args[i] + '\n'
					}
					return write
				})

				fnstr = fnstr.replace(/(\t*)this\.GETBUFFER\s*\(\s*([^\)]*)\s*\)/,function(m, ind, needed){
					var write = ind+'var buffer = this.buffer'+cap+'\n'+
						ind+'if(!buffer){\n'+
						ind+'\tthis.buffer'+cap+' = buffer = this.alloc'+cap+'?this.array'+cap+'.array(this.alloc'+cap+'):this.array'+cap+'.array()\n' + 
						ind+'\tbuffer.frameid = this.frameid\n'+
						ind+'\tthis.flush'+cap+'()\n'+
						ind+'\tthis.buffer'+cap+' = buffer\n'+
						ind+'}\n'+
						ind+'if(!buffer.appendonly && buffer.frameid !== this.frameid){\n'+
						ind+'\tbuffer.length = 0, buffer.frameid = this.frameid\n'+
						ind+'\tthis.flush'+cap+'()\n'+
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
						ind+'}\n'
						//ind+'var _array = buffer.array, _off = _len*'+slots+', _obj\n'
					return write	
				})
				
				fnstr = fnstr.replace(/(\t*)this\.ARGSTOCANVAS\s*\(\s*\)/,function(m, ind){
					var write = ''
					for(var key in def) if(typeof def[key] === 'function' && args.indexOf(key) !== -1){
						write += ind+'if('+key+'!==undefined) this.'+key+' = '+key+'\n'
					}						
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