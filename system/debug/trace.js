/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// trace JS

define(function(require, exports){

	var dump = require('$debug/dump')
	var file_color = {}
	var file_colorid = 1
	var file_colors = ['r','g','b','y','m','c']
	var from_file_len = 25
	var trace_arg_clip = 150
	var trace_depth = 0

	function trace(fn, filename, tracelevel, fnname){
		if(!fnname)fnname = ''
		var fc = file_color[filename]
		if(!fc) fc = file_color[filename] = file_colorid++ 
		//eturn fn
		// lets check if we need to process our prototype
		var shortname = define.fileName(filename)
		if(typeof fn == 'function'){
			if(fn.__tracewrapped__){
				throw new Error('dbltrace!')
				return fn
			}
			// lets set trace levels for objects.
			var obj = fn.prototype

			var mytrace = obj.__trace__ !== undefined? obj.__trace__: fn.__trace__
			var bail = false
			if(parseInt(tracelevel) != tracelevel){ // its a targetted string
				if(tracelevel !== mytrace) bail = true
				else tracelevel = 0 // turn it off for nested items
			}
			else if(mytrace > tracelevel){
				return fn
			}

			// Dont wrap constructor functions, but enumerate the prototypes
			if(Object.getPrototypeOf(obj) !== Object.prototype || Object.keys(obj).length !== 0){
				var keys = Object.keys(fn)
				for(var i = 0; i < keys.length; i++){
					var key = keys[i]
					if(!fn.__lookupSetter__(key)){
						fn[key] = trace(fn[key], filename, tracelevel, fnname+'::'+key)
					}
				}
				var keys = Object.keys(obj)
				for(var i = 0; i < keys.length; i++){
					var key = keys[i]
					if(!obj.__lookupSetter__(key)){
						obj[key] = trace(obj[key], filename, tracelevel, fnname+' '+key)
					}
				}
			}
			else{ 
				if(bail) return fn
				// parse out argument names
				var argnames = fn.toString().match(/\(([^\)]*)\)/)[1].replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/[^\n]*/g,'').replace(/[\r\n\s]*/g,'').split(/\s*,\s*/)
				if(argnames[0] === '') argnames.shift()
				// wrapper function
				function wrapper(){
					var out = '~w~' + Array(trace_depth+2).join('-')+' ~' + file_colors[fc % file_colors.length] + '~' + shortname + '~~'+ fnname
					// dump the arguments
					out += '(' + dump(Array.prototype.slice.call(arguments), trace_arg_clip, dump.colors, argnames)+ ')'
 					
					var stack = new Error().stack.split('\n')
					var from = stack[2]
					if(from.indexOf('define.js') !== -1) from = stack[3]
					var fromfile = from.match(/\/[A-Za-z0-9\.]+\:\d+/)
					if(fromfile){
						var ff = fromfile[0].slice(1)
						if(ff.length >= from_file_len) ff = ff.slice(-from_file_len+1)
						else ff += Array(from_file_len-ff.length).join(' ')
						out = '~w~' + ff + '~~ ' + out
					}
					else out = 'system'+Array(from_file_len-5).join(' ') + out
					
					console.color(out + '\n')

					trace_depth++
					try{
						var ret = fn.apply(this, arguments)
					}
					/*catch(e){
						if(e instanceof Error){
							if(!e.__traced__){
								var msg =  e.stack.split(/\n/)
								var fromfile = msg[1].match(/\/([A-Za-z0-9\.]+)\:(\d+)/)
								console.color(Array(trace_depth+2).join('-') + "~br~Exception ~y~" + fromfile[1] + '~bg~:'+fromfile[2]+'~~ ' + msg[0]+'\n')
							}
							e.__traced__ = 1
						}
						throw(e)
					}*/
					finally{
						trace_depth--
					}
					return ret
				}
				wrapper.__tracewrapped__ = 1
				// some people might put extra things on our function, but dont recur
				if(fnname.indexOf('::') ==- -1 && Object.keys(fn).length !== 0){
					var keys = Object.keys(fn)
					for(var i = 0; i < keys.length; i++){
						var key = keys[i]
						if(!fn.__lookupSetter__(key)){
							wrapper[key] = trace(fn[key], filename, tracelevel, fnname+'::'+key)
						}
					}
				}
				return wrapper
			}
		}
		return fn
	}

	return trace
})