/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, exports){

	var Animation = require('$base/animation')

	function templateDRAWSHADER(){
		// first we have all the  objects
		var o1 = overload, o2 = SCOPE.propmap.NAME, o3 = SCOPE.extstatemap.NAME, o4 = SCOPE.statemap.NAME, o5 = this.classNAME
		OVERLOADPROPS

	}
	
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
	
					var allpropkeys = Object.keys(struct.def)
					for(var key in layoutprops){
						if(allpropkeys.indexOf(key) == -1) allpropkeys.push(key)
					}

					fnstr = fnstr.replace(/this\.GETPROPS\s*\(\s*([^\)]*)\s*\)/,function(m,needed){

						if(!needed) needed = '1'

						var code = 'var _scope = this.scope, _o1 = overload, _o2 = _scope.propmap && _scope.propmap.'+clsname+', _o3 = _scope.extstatemap && _scope.extstatemap.'+clsname+', _o4 = _scope.statemap && _scope.statemap.'+clsname+',_o5 = this.class'+clsname+'\n'

						code += 'var '
						for(var i = 0; i < allpropkeys.length; i++){
							var key = allpropkeys[i]
							code += (i?',':'') + '_'+key
						}
						code += '\n'
						for(var ol = 1; ol <= 5; ol++){
							code += 'if(_o'+ol+'){\n'
							for(var i = 0; i < allpropkeys.length; i++){
								var key = allpropkeys[i]
								if(ol !== 1) code += '	if(_'+key+' === undefined) '
								else code += '	'
								code += '_'+key+' = _o'+ol+'.'+key+'\n'
							}
							code += '}\n'
						}
						// store layoutprops on canvas
						code += 'var _turtle = this.turtle\n'
						for(var i = 0; i < allpropkeys.length; i++){
							var key = allpropkeys[i]
							if(key in layoutproparray){
								code += 'if(typeof _'+key + ' === "number"){\n'
								code += '	var _ts = _turtle._static'+key+'\n'
								code += '   _ts[0] = _ts[1] = _ts[2] = _ts[3] = _' + key + '\n'
								code += '	_turtle._'+key+' = _ts\n'
								code += '}\n'
								code += 'else _turtle._'+key+'= _'+key+'\n'
							}
							else{
								code += '_turtle._'+key+' = _'+key+'\n'
							}
						}

						// stringreplace on template.. concatenate to code

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
						code += '	this.shadernames.push("'+clsname+'")\n'
						// TODO, add overloadeaable geometry
						code += '	_shader._propsbuffer = _props\n'
						code += '	this.drawShaderCmd(_shader, _props)\n'
						code += '}\n'
						code += 'if(!_scope.indexstart'+clsname+') _scope.indexstart'+clsname+' = _props.length\n'
						code += '_scope.indexend'+clsname+' = _props.length + _needed\n'
						code += '_turtle._propoff = _props.length\n'
						code += 'this.rangeList.push(_props, _props.length, _needed, this.turtleStack.len)\n'
						code += '_props.length += _needed\n'
						code += ''
						return code
					})

					fnstr = fnstr.replace(/this\.PUTPROPS\s*\(\s*\)/,function(m){
						var code = 'var _turtle = this.turtle\n'
						code += 'var _props = this.propsbuffer'+clsname+'\n'
						code += 'var _array = _props.array\n'
						code += 'var _off = _turtle._propoff * '+slots+'\n'
						var def = struct.def
						var off = 0
						for(var key in def) if(typeof def[key] === 'function'){
							var itemslots = def[key].slots
							var src = '_turtle._'+key
							if(itemslots > 1){
								if(itemslots === 4){
									code += 'var _'+key+' = typeof ' + src + ' === "string"?this.parseColor('+src+',true):'+src+'\n'
								}
								else{
									code += 'var _'+key+' = ' + src + '\n'
								}
								for(var i = 0; i < itemslots; i++, off++){
									code += '_array[_off+'+off+'] = _'+key+'['+i+']\n'
								}
							}
							else{
								code += '_array[_off+'+off+'] = '+src+'\n'
								off++
							}
						}
						return code
						// read layoutprops from canvas (in props)
						// read others from _local

					})

				}
				else{
					// we are on a stamp. now what.
					fnstr = fnstr.replace(/this\.STAMPPROPS\s*\(\s*([^\)]*)\s*\)/, function(m,needed){
						// fetch samp object
						var code = ''
						code += 'var _draw_canvas = this.view.draw_canvas\n'
						code += 'var _canvas = _draw_canvas["'+clsname+'"]\n'
						code += 'if(!_canvas){\n'
						code += '	_draw_canvas["'+clsname+'"] = _canvas = Object.create(this.class'+clsname+'.Canvas)\n'
						code += '	_canvas.initCanvas(this.view)\n'
						code += '}\n'
						code += 'if(_canvas.frameid !== this.frameid){\n'
						code += '	this.addCanvas(_canvas)\n'
						code += '	_canvas.cmds.length = 0\n'
						code += '}\n'

						code += 'var _pickdraw = _canvas.pickdraw = ++this.view.pickdraw\n'
						code += 'var _draw_objects = this.view.draw_objects\n'
						code += 'var _stamp = _draw_objects[_pickdraw] || (_draw_objects[_pickdraw] = Object.create(this.class'+clsname+'))\n'
						code += '_stamp.pickdraw = _pickdraw\n'
						code += '_stamp.canvas = _canvas\n'
						code += '_canvas.scope = _stamp\n'
						code += '_canvas.align = this.align\n'

						code += '_stamp.extstatemap = this.scope.statemap && this.scope.statemap.' + clsname + '\n'
						code += '_stamp.propmap = overload\n'

						code += 'var _o1 = overload, _o2 = this.scope.statemap && this.scope.statemap.'+clsname+', _o3 = _stamp.statemap, _o4 = this.class'+clsname+'\n'

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
							code += '_stamp.'+key+' = _'+key+'\n'
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