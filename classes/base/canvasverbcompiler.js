/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, exports){
	var Animation = require('$base/animation')
	this.compileCanvasVerbs = function(root, canvas, name, cls){

		var verbs = cls._canvasverbs
		var defaults = cls._defaults
		var struct = cls._canvasprops && cls._canvasprops.struct
		var slots = struct && struct.slots
		var def = struct && struct.def
		var cap = name.charAt(0).toUpperCase() + name.slice(1)		

		// lets overload our canvas attributes
		if(root.canvasprops){
			cls.canvasprops = root.canvasprops
			function defStampProp(obj, key){
				Object.defineProperty(obj, key, {
					configurable:true,
					get:function(value){

					},
					set:function(value){
						// lets forward this key on all our stamps key+caps
						var sn = this.canvas.shadernames
						for(var i = 0; i < sn.length; i++){
							this[key+sn[i]] = value
						}
					}
				})
			}
			for(var key in root.canvasprops){
				defStampProp(root, key)
			}
		}

		canvas['array' + cap] = struct
		canvas['class' + cap] = cls

		// bail if we dont have any new functions or struct data
		if(canvas[name + '_canvasverbs'] === verbs &&
			canvas[name + '_canvasstruct'] === struct){
			return
		}

		canvas[name+'_canvasverbs'] = verbs
		canvas[name+'_canvasstruct'] = struct

		//!TODO use a proper JS parser / codegen to mod the code

		// put accessors on our root
		if(struct){
			function defProp(obj, key, offset, type){
				var indexstart = 'indexstart' + cap
				var indexend = 'indexend' + cap
				var buffer = 'buffer' + cap
				var name = key + cap

				function setValue(stamp, value, start){
					var buf = stamp.canvas[buffer]
					if(!buf) return
					var isv = 0

					for(var i = stamp[indexstart], l = stamp[indexend]; i < l; i++){
						var o = i * slots
						if(type.slots>1){
							for(var s = 0; s < type.slots; s++, isv++){
								buf.array[o + offset + s] = value[s] + (start?start[isv]:0)
							}
						}
						else{
							buf.array[o + offset] = value + (start?start[isv]:0)
							isv++
						}
					}
					buf.clean = false
					// lets store the value on the stamp for re-use...
					
					stamp['_' + key + cap] = value
					stamp.canvas.view.redraw()
				}

				function getValue(stamp){
					var o = stamp[indexstart] * slots
					var buf = stamp.canvas[buffer]
					if(!buf) return vec4(1,0,1,1)

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
				}

				function animStep(value){
					// we have to reference stamp by ID
					var stamp = this.view.draw_objects[this.pickdraw]
					setValue(stamp, value, this.add && this.start_values)
				}

				// lets first just get this
				
				if(!(name in cls)){
					Object.defineProperty(obj, name,{
						get:function(){
							return getValue(this)
						},
						set:function(value){
							// animation!
							if(value instanceof Animate){

								// lets hook an animation on view
								var view = this.canvas.view

								var anim = new Animation()
								
								anim.type = type
								anim.add = value.add

								if(value.add) anim.first_value = type(0)
								else anim.first_value = this[name]

								anim.atStep = animStep
								anim.track = value.track
								anim.view = view
								anim.pickdraw = this.pickdraw

								var config = value.track
								if(config.motion !== undefined) anim.motion = config.motion
								if(config.delay !== undefined) anim.delay = config.delay
								if(config.bounce !== undefined) anim.bounce = config.bounce
								if(config.speed !== undefined) anim.speed = config.speed

								// copy all first values
								var i = this[indexstart], l = this[indexend]
								var sv = anim.start_values = new Float32Array((l - i) * type.slots)
								var buf = this.canvas[buffer]
								var isv = 0
								for(;i < l; i++){
									var o = i * slots
									for(var j = 0; j < type.slots; j++, isv++){
										sv[isv] = buf.array[o + offset + j]
									}
								}

								var guid = view.pickview + '_' + this.pickdraw+'_'+key

								view.screen.startViewAnimation(guid, anim)
								view.redraw()
								return
							}
							setValue(this, value)
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
				fnstr = fnstr.replace(/(\t*)this\.DOSTAMP\s*\(([^\)]*)\)/,function(m, ind, args){
					return '\tthis.GETSTAMP()\n'+
					       '\tthis.ARGSTO(stamp)\n'+
			               '\tstamp.draw('+args+')\n'
				})

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
					//ind+'canvas.innerwidth = this.align.w !== undefined? this.align.w: this.innerwidth\n'+
					//ind+'canvas.innerheight = this.align.h !== undefined? this.align.h: this.innerheight\n'+
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
					var write =  ''+
						ind+'if(typeof x === "object")'

					if(args.indexOf('padding')!== -1) write += 'padding = x.padding,'
					if(args.indexOf('margin') !==-1) write += 'margin = x.margin,'
					write += 'w = x.w, h = x.h, y = x.y, x = x.x\n'
					//ind+'if(isNaN(x)) x = this.x\n'+
					//ind+'if(isNaN(y)) y = this.y\n'+
					if(args.indexOf('padding')!== -1) write += ind+'if(padding === undefined) padding = this.scope.padding'+cap+'!==undefined?this.scope.padding'+cap+':this.class'+cap+'.padding\n'
					if(args.indexOf('margin')!== -1) write += ind+'if(margin === undefined) margin = this.class'+cap+'.margin\n'
					write +=
						ind+'if(x === undefined) x = this.class'+cap+'.x\n'+
						ind+'if(y === undefined) y = this.class'+cap+'.y\n'+
						ind+'if(w === undefined) w = this.class'+cap+'.w\n'+
						ind+'if(h === undefined) h = this.class'+cap+'.h\n'
						ind+'if(x === float) x = undefined\n'+
						ind+'if(y === float) y = undefined\n'+
						ind+'if(typeof h === "function") h = h(this, this.align)\n'

					return write
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
						// store the index how do we store the length?
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
						ind+'\tthis.shadernames.push("NAME")\n'+
						ind+'\tthis.drawShaderCmd(_shader, buffer)\n'+
						ind+'}\n'+
						ind+'if(!this.scope.indexstart'+cap+')this.scope.indexstart'+cap+' = buffer.length\n'+
						ind+'this.scope.indexend'+cap+' = buffer.length + '+(needed || 1)+'\n'
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
						//var dft = '(this.scope._'+key+' || 0)'
						//if(key in defaults) dft = defaults[key]

						var itemslots = def[key].slots
						var value = 'this.scope._'+key+cap+'!==undefined?this.scope._'+key+cap+':this.'+key+'!==undefined?this.'+key+':this.class'+cap+'.'+key+'!==undefined?this.class'+cap+'.'+key+':1'//+':'+dft
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