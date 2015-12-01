/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// dump js

define(function(){

	function dump(arg, space, colors, arraynames){
		if(!colors) colors = dump_plain
		if(space === undefined) space = 100000
		if(space <= 0) return ''
		// ok how shall we go about logging it.
		if(arg === undefined) return colors.undefined
		if(arg === null) return colors.null
		if(typeof arg === 'boolean'){
			if(arg === true) return colors.true
			if(arg === false) return colors.false
		}
		if(typeof arg === 'number'){
			if(isNaN(arg)) return colors.NaN
			return colors.numstart + arg + colors.numend
		}
		if(typeof arg === 'string'){
			var str = arg
			if(arg.length > space) str = arg.slice(0, space) + colors.elip
			str = str.replace(/\r/g,'\\r').replace(/\n/g,'\\n').replace(/\t/g,'\\t')
			return colors.strstart + str + colors.strend
		}
		if(typeof arg === 'function'){
			if(arg.module) return colors.class + define.fileName(arg.module.filename)
			return colors.function
		}
		if(Array.isArray(arg)){
			// lets run over all our items
			var out = arraynames?'':colors.arrstart
			for(var i = 0; i<arg.length; i++){
				if(i) out += colors.arrsep
				if(arraynames){
					if(i < arraynames.length) out += colors.argstart + arraynames[i]+colors.argend+colors.argis
					else out += colors.argstart + 'arguments['+String(i)+']' + colors.argend +colors.argis
				}
				out += dump(arg[i], (space - out.length)/2, colors)
				if(space - out.length <= 0){
					out += colors.elip
					break
				}
			}
			out += arraynames?'':colors.arrend
			return out
		}
		if(typeof arg === 'object'){
			// lets check what kind of object we are. if we are a prototype=object
			if(Object.getPrototypeOf(arg) === Object.prototype){ // plain objects
				var out = colors.objstart
				for(var key in arg){
					if(arg.__lookupGetter__(key)) continue
					if(out !== colors.objstart) out += ','
					out += colors.keystart + key + colors.keyend + colors.keysep + dump(arg[key], (space - out.length)/2, colors)
					if(space - out.length<0){
						out += colors.elip
						break
					}
				}
				out += colors.objend
				return out
			}
			else{
				var constructor = Object.getPrototypeOf(arg).constructor
				var module = constructor && constructor.module
				if(module) return colors.instance + colors.insstart + define.fileName(module.filename) + colors.insend
				if(constructor){
					var name = constructor.toString().match(/function\s+([^\()]*?)\(/)
					if(name) return colors.instance + colors.insstart + name[1] + colors.insend
				}
				return colors.instance + colors.insstart + 'unknown' + colors.insend
			}
			return out
		}

		return typeof arg
	}
	
	dump.plain  = {
		'undefined':'undefined',
		'null':'null',
		'true':'true',
		'false':'false',
		'NaN':'NaN',
		'strstart':"'",
		'strend':"'",
		'function':'function',
		'class':'class:',
		'arrstart':'[',
		'arrend':']',
		'arrsep':',',
		'argstart':'',
		'argend':'',
		'argis':'=',
		'objstart':'{',
		'objend':'}',
		'keystart':'',
		'keyend':'',
		'keysep':':',
		'instance':'instance:',
		'insstart':'',
		'insend':'',
		'numstart':'',
		'numend':'',
		'elip':'..'
	}

	dump.colors = {
		'undefined':'~m~undefined~~',
		'null':'~m~null~~',
		'true':'~m~true~~',
		'false':'~m~false~~',
		'NaN':'~m~NaN~~',
		'strstart':"~g~'",
		'strend':"~g~'~~",
		'function':'~m~function~~',
		'class':'~by~class:~~',
		'arrstart':'~bw~[~~',
		'arrend':'~bw~]~~',
		'arrsep':'~bw~,~~',
		'argstart':'~w~',
		'argend':'~~',
		'argis':'~y~=~~',
		'objstart':'~bw~{~~',
		'objend':'~bw~}~~',
		'keystart':'',
		'keyend':'',
		'keysep':':',
		'instance':'instance:',
		'insstart':'',
		'insend':'',
		'numstart':'~c~',
		'numend':'~~',
		'elip':'~br~..~~'
	}

	return dump
})