define.class(function(exports){

	this.initCanvas = function(view){
		this.view = view
		this.scope = view
		this.matrix = mat4.identity()
		this.cmds = []
	}

	this.clearCmds = function(){
		this.cmds.length = 0
		this.visible = 1.0
	}
		
	this.leftfloorAlign = function(x, y){
		if(x !== undefined) return
		this.x = this.px + this.margin[3]
		this.y = this.py + this.margin[0] + this.pmax - this.h
		this.px += this.w + this.margin[1] + this.margin[3]
		var hs = this.h + this.margin[0] + this.margin[2]
		if(this.px >= this.width){
			this.py += this.pmax
			this.x = 0 + this.margin[3]
			this.y = this.py + this.margin[0] + this.pmax - this.h
			this.px = this.w + this.margin[1] + this.margin[3]
		}
		this.visible = this.py >= this.height?0.:1.0
	}

	this.leftAlign = function(x, y){
		if(x !== undefined) return
		this.x = this.px + this.margin[3]
		this.y = this.py + this.margin[0]
		this.px += this.w + this.margin[1] + this.margin[3]
		var hs = this.h + this.margin[0] + this.margin[2]
		if(hs > this.ph) this.ph = hs
		if(this.px >= this.width){
			this.py += this.ph 
			this.ph = 0
			this.x = 0 + this.margin[3]
			this.y = this.py + this.margin[0]
			this.px = this.w + this.margin[1] + this.margin[3]
		}
		this.visible = this.py >= this.height?0.:1.0
	}

	this.startAlign = function(fn, pmax){
		this.pmax = pmax
		this.px = 0
		this.py = 0
		this.ph = 0
		this.margin = [0,0,0,0]
		if(typeof fn === 'string'){
			this.align = this[fn + 'Align']
		}
		else{
			this.align = fn || this.alignLeft
		}
	}

	this.stopAlign = function(){

	}

	this.addCanvas = function(ctx, index){
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

					for(var key in def) if(typeof def[key] === 'function' && args.indexOf(key) !== -1){
						write += 'if('+key+'!==undefined) this.'+key+' = '+key+'\n'
					}

					if('x' in def && 'y' in def){
						var xoff = struct.keyInfo('x').offset / 4 || 0
						var yoff = struct.keyInfo('y').offset / 4 || 0
						write += 'if(this.align)this.align(x,y,_buf,_off+'+xoff+',_off+'+yoff+')\n'
					}

					// iterate over the keys
					var off = 0
					for(var key in def) if(typeof def[key] === 'function'){
						// lets output to the array
						// and copy it from the canvas
						var dft = '(this.scope._'+key+' || 0)'
						if(key in defaults) dft = defaults[key]

						var itemslots = def[key].slots
						if(itemslots>1){
							//if(args.indexOf(key) !== -1){
							//	write += ind+'_obj = '+key+'!==undefined?'+key+':this.'+key+'!==undefined?this.'+key+':'+dft+'\n'
							//}
							//else{
							write += ind+'_obj = this.'+key+'!==undefined?this.'+key+':'+dft+'\n'
							//}
							write += ind+'if(_obj !== undefined){\n'
							for(var i = 0; i < itemslots; i++, off++){
								write += ind+'\t_array[_off + ' + off + '] = _obj['+i+']\n'
							}
							write += ind+'}\n'
						}
						else{
							//if(args.indexOf(key) !== -1){
							//	write += ind+'_array[_off + ' + off + '] = '+key+'!==undefined?'+key+':this.'+key+'!==undefined?this.'+key+':'+dft+'\n'
							//}
							//else{
							write += ind+'_array[_off + ' + off + '] = this.'+key+'!==undefined?this.'+key+':'+dft+'\n'
							//}
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
})