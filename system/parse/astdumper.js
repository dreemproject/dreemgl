/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define(function(require, exports, module){
	module.exports = function dump(ast, defs, depth){
		if(!ast) return ''
		if (depth === undefined) depth = "";
		var out = ast.type + '\n'
		//for(var key in ast) out += depth + ' - ' + key
		var lut = defs[ast.type]
		if(!lut) console.log('Cannot find', ast.type, ast)
		for(var item in lut){
			var type = lut[item]
			if(type === 3){ // object
				var array  = ast[item]
				if(array) for(var i =0 ; i < array.length; i++){
					var item = array[i]
					out += depth + item.key.name + ':' + dump(item.value, defs, '')
				}
			}
			if(type === 2){//array
				var array  = ast[item]
				if(array) for(var i = 0; i<array.length; i++) {
					out += depth + item + ':' + dump(array[i], defs, depth + ' ')
				}				
			}
			else if(type === 1){ // object
				var obj = ast[item]
				if(obj !== undefined)
					out += depth + item + ':' + dump(obj, defs, depth + ' ')
			}
			else if(type === 0){
				var value = ast[item]
				if(value !== undefined)
					out += depth + item + ':' + ast[item]
			}
		}
		return out
	}	
})
