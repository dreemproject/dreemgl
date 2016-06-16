/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, exports){

	var Animation = require('$base/animation')
	
	var layoutprops = {
		x:1,
		y:1,
		w:1,
		h:1,
		margin:1,
		padding:1,
		align:1,
		walk:1
	}

	var layoutproparray = {
		margin:1,
		padding:1
	}

	// magical words

	// propstypeNAME <- props struct type
	// propsbufferNAME  <- current propsbuffer
	// propsallocNAME <- allocation default size

	// classNAME <- the shader class
	// shaderNAME <- the shader instance
	// drawNAME <- drawing fn
	// beginNAME <- nested drawing begin
	// endNAME <- nested drawing end
	// verbNAME <- any user verbname




	this.compileCanvasVerbs = function(root, canvas, name, cls){

		var verbs = cls._canvasverbs
		var defaults = cls._defaults
		var clsname = name.charAt(0).toUpperCase() + name.slice(1)		

		for(var verb in verbs){
			if(verb[0] === '_') continue
			var fn = verbs[verb]

			if(typeof fn === 'function'){
				var args = define.getFunctionArgs(fn)
				var fnstr = fn.toString()

				fnstr = fnstr.replace(/^function\s*\(/, function(){
					return 'function '+verb+name+'('
				})

				fnstr = fnstr.replace(/(\t*)this\.([\_]+[\_A-Z0-9]+)\s*\(\s*\)/,function(m,ind,name){
					var str = verbs[name].toString()
					return str.slice(12,-1)
				})
		
				canvas['class'+clsname] = cls

				// we are on a shader
				if(cls._propstruct){
					var struct = cls._propstruct && cls._propstruct.struct
					var slots = struct && struct.slots

					canvas['propstype' + clsname] = struct
					
					var props = cls._props

					var structoffset = {}
					// compute struct offsets
					var offset = 0
					var structbytes = struct.primary.bytes
					for(var ikey in struct.def){
						var itype = struct.def[ikey]
						structoffset[ikey] = offset / structbytes
						offset += itype.bytes
					}
					//var allpropkeys = Object.keys(struct.def)
					//for(var key in layoutprops){
					//	if(allpropkeys.indexOf(key) == -1) allpropkeys.push(key)
					//}

					function propOverload(props, tmpvar, first, tab){
						var code = ''
						for(var key in props){
							if(key in cls._putprops) continue
							if(!first) code += tab+'if(_'+key+' === undefined) '
							else code += tab
							code += '_'+key+' = '+tmpvar+'.'+key+'\n'
						}
						return code
					}

					fnstr = fnstr.replace(/this\.GETPROPS\s*\(\s*\)/,function(m){
		
						if(!args.length) console.error('Please give draw macro atleast one argument:'+clsname+' '+fnstr)

						var code = '\nvar _scope = this.scope, _scopepropmap = _scope._propmap, _scopeextstate = _scope._extstate, _scopestate = _scope._state\n'

						//, _o1 = '+args[0]+', _o2 = _scope.propmap && _scope.propmap.'+clsname+', _o3 = _scope.extstatemap && _scope.extstatemap.'+clsname+', _o4 = _scope.statemap && _scope.statemap.'+clsname+',_o5 = this.class'+clsname+'\n'
						// delay, duration and ease

						var vars = ''
						code += 'var '
						for(var key in props){
							if(key in cls._putprops) continue
							vars += (vars?',':'') + '_'+key
						}
						code += vars + '\n'

						code += 'if('+args[0]+'){\n'
						code += propOverload(props, args[0], true,'	')
						code += '}\n'

						code += 'if(_scopepropmap){\n'
						code += '	var _o2 = _scopepropmap.'+clsname+'\n'
						code += '	if(_o2){\n'
						code += propOverload(props, '_o2', false,'		')
						code += '	}\n'
						code += '}\n'

						code += 'if(_scopeextstate){\n'
						code += '	var _o3 = _scopeextstate.'+clsname+'\n'
						code += '	if(_o3){\n'
						code += propOverload(props, '_o3', false,'		')
						code += '	}\n'
						code += '}\n'

						code += 'if(_scopestate){\n'
						code += '	var _o4 = _scopestate.'+clsname+'\n'
						code += '	if(_o4){\n'
						code += propOverload(props, '_o4', false,'		')
						code += '	}\n'
						code += '}\n'

						code += 'if(_scopepropmap){\n'
						code += '	if(_duration === undefined) _duration = _scopepropmap.duration\n'
						code += '	if(_delay === undefined) _delay = _scopepropmap.delay\n'
						code += '	if(_ease === undefined) _ease = _scopepropmap.ease\n'
						code += '}\n'
						code += 'if(_scopeextstate){\n'
						code += '	if(_duration === undefined) _duration = _scopeextstate.duration\n'
						code += '	if(_delay === undefined) _delay = _scopeextstate.delay\n'
						code += '	if(_ease === undefined) _ease = _scopeextstate.ease\n'
						code += '}\n'
						code += 'if(_scopestate){\n'
						code += '	if(_duration === undefined) _duration = _scopestate.duration\n'
						code += '	if(_delay === undefined) _delay = _scopestate.delay\n'
						code += '	if(_ease === undefined) _ease = _scopestate.ease\n'
						code += '}'

						code += 'var _o5 = this.class'+clsname+'\n'
						code += propOverload(props, '_o5', false,'')

						// store layoutprops on canvas
						code += 'var _turtle = this.turtle\n'
						for(var key in props){//i = 0; i < allpropkeys.length; i++){
							if(key in cls._putprops) continue
							if(key in layoutproparray){
								code += 'if(typeof _'+key + ' === "number"){\n'
								code += '	var _ts = _turtle._cache_'+key+' || (_turtle._cache_'+key+'=[])\n'
								code += '   _ts[0] = _ts[1] = _ts[2] = _ts[3] = _' + key + '\n'
								code += '	_turtle._'+key+' = _ts\n'
								code += '}\n'
								code += 'else _turtle._'+key+'= _'+key+'\n'
							}
							else{
								code += '_turtle._'+key+' = _'+key+'\n'
							}
						}

						return code
					})

					fnstr = fnstr.replace(/this\.ALLOCPROPS\s*\(\s*([^\)]*)\s*\)/,function(m,needed){
						if(!needed) needed = '1'
						var code = '\n'

						code += 'var _props = this.propsbuffer'+clsname+'\n'
						code += 'var _shader = this.shader'+clsname+'\n'
						code += 'if(!_props){\n'
						code += '	this.propsbuffer'+clsname+' = _props = this.propstype'+clsname+'.array(this.propsalloc'+clsname+' || 0)\n'
						code += '}\n'
						code += '_props.clean = false\n'
						code += '_props.instancedivisor = 1\n'
						code += 'var _needed = '+needed+'\n'
						code += 'if(_props.length + _needed >= _props.allocated){\n'
						code += '	var _ns = (_props.length + _needed > _props.allocated * 2)? (_props.length + _needed): _props.allocated * 2\n'
						code += '	for(var _n = new _props.arrayconstructor(_ns * '+slots+'), _o = _props.array, _i = 0, _s = _props.allocated * '+slots+'; _i < _s; _i++) _n[_i] = _o[_i]\n'
						code += '	_props.array = _n, _props.allocated = _ns\n'
						code += '}\n'
						code += 'if(_props.frameid !== this.frameid){\n'
						code += '	this.propsbuffer'+clsname+' = _props\n'
						code += '	_props.length = 0\n'
						code += '	_props.frameid = this.frameid\n'
						code += '	this.shader'+clsname+' = _shader = Object.create(this.class'+clsname+')\n'
						code += '	_shader._maxanimtime = 0\n'
						code += '	this.shadernames.push("'+clsname+'")\n'
						// TODO, add overloadeaable geometry
						code += '	_shader._propsbuffer = _props\n'
						code += '	this.drawShaderCmd(_shader, _props)\n'
						code += '}\n'
						code += 'if(!_scope.indexstart'+clsname+') _scope.indexstart'+clsname+' = _props.length\n'
						code += '_scope.indexend'+clsname+' = _props.length + _needed\n'
						code += '_turtle._propoff = _props.length\n'
						code += '_turtle._propcount = 0\n'
						code += 'var _level\n'
						code += 'if(typeof _x === "number" && !isNaN(_x) || typeof _x === "function" || typeof _y === "number" && !isNaN(_y) || typeof _y === "function") _level = this.turtleStack.len - 1\n'
						code += 'else  _level = this.turtleStack.len\n'
						code += 'this.rangeList.push(_props, _props.length, _needed, _level)\n'
						code += '_props.length += _needed\n'
						code += ''

						return code
					})

					fnstr = fnstr.replace(/this\.PUTPROPS\s*\(\s*([^\)]*)\s*\)/,function(m, argmapstr){
						
						var argmap = {}
						if(argmapstr){ // quickly parse map {key:value}
							// fetch string baseclasses for nested classes and add them
							var argmaprx = new RegExp(/([$_\w]+)\:([^},\n]+)/g)
							var result
							while((result = argmaprx.exec(argmapstr)) !== null) {
								argmap[result[1]] = result[2]
							}
						}

						var code = '\n'
						code += 'var _turtle = this.turtle\n'
						code += 'var _props = this.propsbuffer'+clsname+'\n'
						code += 'var _shader = this.shader'+clsname+'\n'
						code += 'var _array = _props.array\n'
						code += 'var _changed = -1\n'
						code += 'var _off = (_turtle._propoff + _turtle._propcount++) * '+slots+'\n'

						// inject animation check and calculation

						var def = struct.def

						code += 'var _oduration =  _array[_off+'+structoffset['duration']+']\n'
						code += 'var _ostarttime =  _array[_off+'+structoffset['animstarttime']+']\n'

						code += 'if(this.view._time < _ostarttime + _oduration){\n'
						code += '	var _fac = Math.max(0,Math.min(1.,(this.view._time - _ostarttime)/ _oduration)) \n'
						code += '	var _1fac = 1 - _fac\n'
						for(var key in def) if(typeof def[key] === 'function'){
							var oldkey = 'OLD_' + key
							if(!(oldkey in def)) continue
							var off = structoffset[key]
							var oldoff = structoffset[oldkey]
							var itemslots = def[key].slots
							for(var i = 0; i < itemslots; i++, off++,oldoff++){
								code += '	_array[_off + '+off+'] = _fac * _array[_off+'+off+'] + _1fac * _array[_off+'+oldoff+']\n'
							}
						}
						code += '}'

						var off = 0
						for(var key in def) if(typeof def[key] === 'function'){

							if(key.indexOf('OLD_') === 0) continue

							var itemslots = def[key].slots

							var src = '_turtle._' + key

							if(key in argmap){
								src = argmap[key]
							}

							//if(key.indexOf("static_DOT_") === 0){
							//	src = '_turtle._'+key.slice(11)
							//}
	
							//else if(key.indexOf("putargs_DOT_") === 0){
							//	src = argmap[key.slice(12)]
							//	if(!src){
							//		src = '0.'
									//continue
									//console.log("Found putargs property which is not sent in PUTPROPS"+key)
							//	}
							//}

							if(key.indexOf("stamp_DOT_") === 0){
								src = 'this.scope.'+key.slice(10)								
							}

							var oldkey = 'OLD_' + key

							if(itemslots > 1){
								if(itemslots === 4){
									code += 'var _'+key+' = typeof ' + src + ' === "string"?this.parseColor('+src+',true):'+src+'\n'
								}
								else{
									code += 'var _'+key+' = ' + src + '\n'
								}
								if(oldkey in def){
									var oldoff = structoffset[oldkey]
									for(var i = 0, o = off; i < itemslots; i++, o++,oldoff++){
										code += 'if(_'+key+'['+i+'] !== _array[_off+'+o+']){\n'
										code += '	_changed = '+o+'\n'
										code += '}\n'
										code += '_array[_off+'+oldoff+'] = _array[_off+'+o+']\n'
									}	
								}
								for(var i = 0; i < itemslots; i++, off++){
									code += '_array[_off+'+off+'] = _'+key+'['+i+']\n'
								}
							}
							else{

								if(oldkey in def){
									code += 'if('+src+' !== _array[_off+'+off+']){\n'
									code += '	_changed = '+off+'\n'
									code += '}\n'
									code += '_array[_off+'+structoffset[oldkey]+'] = _array[_off+'+off+']\n'
								}

								code += '_array[_off+'+off+'] = '+src+'\n'
								off++
							}
						}

						code += 'if(_changed >= 0){\n'
						//var durationoff = struct.keyInfo('static_DOT_duration').offset / struct.primary.bytes

						//console.log(durationoff)
						code += '	var _time = this.view._time\n'
						code += '	_array[_off+'+ structoffset['animstarttime']+'] = _time + _turtle._delay\n'
						code += '	_time += _turtle._duration + _turtle._delay\n'
						code += '	if(_time > _shader._maxanimtime) _shader._maxanimtime = _time\n'
						code += '}\n'
						console.log(code)
						return code
						// read layoutprops from canvas (in props)
						// read others from _local

					})

					fnstr = fnstr.replace(/this\.SETPROPSLEN\s*\(\s*\)/,function(m){
						return '_props.length = _turtle._propoff + _turtle._propcount\n'
					})
				}
				else{
					// we are on a stamp. now what.
					fnstr = fnstr.replace(/this\.STAMPPROPS\s*\(\s*([^\)]*)\s*\)/, function(m,needed){

						if(!args.length) console.error('Please give draw macro atleast one argument:'+clsname+' '+fnstr)

						// fetch samp object
						var code = ''
						code += 'var _draw_canvas = this.view.draw_canvas\n'
						code += 'var _canvas = _draw_canvas["' + clsname + '"]\n'
						code += 'if(!_canvas){\n'
						code += '	_draw_canvas["' + clsname + '"] = _canvas = Object.create(this.class'+clsname+'.Canvas)\n'
						code += '	_canvas.initCanvas(this.view)\n'
						code += '}\n'
						code += 'if(_canvas.frameid !== this.frameid){\n'
						code += '	this.addCanvas(_canvas)\n'
						code += '	_canvas.cmds.length = 0\n'
						code += '}\n'

						code += 'var _pickdraw = _canvas.pickdraw = ++this.view.pickdraw\n'
						code += 'var _draw_objects = this.view.draw_objects\n'
						code += 'var _stamp = _draw_objects[_pickdraw]\n'
						code += 'if(!_stamp){\n'
						code += '	_stamp = _draw_objects[_pickdraw] = Object.create(this.class'+clsname+')\n'
						code += '	_stamp._state = _stamp.statemap = _stamp.states && _stamp.states.default'
						code += '}\n'
						code += '_stamp.pickdraw = _pickdraw\n'
						code += '_stamp.canvas = _canvas\n'
						code += '_canvas.scope = _stamp\n'
						code += '_canvas.align = this.align\n'

						code += '_stamp._extstate = this.scope._state && this.scope._state.' + clsname + '\n'
						code += '_stamp._propmap = overload\n'

						code += 'var _o1 = '+args[0]+', _o2 = this.scope._state && this.scope._state.'+clsname+', _o3 = _stamp._state, _o4 = this.class'+clsname+'\n'

						var keys = ''
						for(var key in cls._props) keys += (keys?',':'')+'_'+key
						code += 'var ' + keys + '\n'

						for(var ol = 1; ol <= 4; ol++){
							code += 'if(_o'+ol+'){\n'
							for(var key in cls._props){
								if(ol !== 1) code += '	if(_'+key+' === undefined) '
								else code += '	'
								code += '_'+key+' = _o'+ol+'.'+key+'\n'
							}
							code += '}\n'
						}

						// store layoutprops on canvas
						for(var key in cls._props){
							if(key in layoutproparray){
								code += 'if(typeof _'+key + ' === "number"){\n'
								code += '	var _ts = _stamp._static'+key+'\n'
								code += '   _ts[0] = _ts[1] = _ts[2] = _ts[3] = _' + key + '\n'
								code += '	_stamp.'+key+' = _ts\n'
								code += '}\n'
								code += 'else _stamp.'+key+'= _'+key+'\n'
							}
							else{

								code += '_stamp.'+key+' = _'+key+'\n'
							}
						}

						return code
					})

					fnstr = fnstr.replace(/this\.DRAWSTAMP\s*\(\s*([^\)]*)\s*\)/, function(m,needed){
						return '_stamp.draw()'
					})
				}

				fnstr = fnstr.replace(/NAME/g, clsname)

				canvas[verb + clsname] = Function('return '+fnstr)()
			}
			else{
				canvas[verb] = fn
			}
		}
	}
})