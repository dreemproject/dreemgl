/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$system/base/worker', function(require, exports){
 	var rpchub = require('$system/rpc/rpchub')

	this._allocPromise = rpchub.allocPromise
	this._resolveReturn = rpchub.resolveReturn

	this._atConstructor = function(cores){
		// lets serialize our module system into a worker
		var out = {}
		function collectDeps(deps){
			if(!deps) return
			for(var i = 0; i < deps.length; i++){
				var dep = deps[i]
				if(out[dep]) continue
				var module = define.module[dep] || define.module[dep+'.js']
				if(!module || !module.factory || typeof module.factory !== 'function') continue
				
				// alright so lets recur on deps
				out[dep] = 1
				collectDeps(module.factory.deps)

				// and now add our module
				if(module.factory.body){
					var str = 'define.packagedClass("'+dep+'",['
					if(module.factory.baseclass) str +=  '"'+module.factory.baseclass+'",'
					str += module.factory.body.toString() + ']);\n'
					out[dep] = str
				}
				else{
					out[dep] = 'define(' + module.factory.toString() + ',"'+dep+'");\n'
				}
			}
		}
		collectDeps(this.constructor.module.factory.deps)

		var code = 'var _myworker = '+this.constructor.body.toString()+';\n'
		for(var key in out){
			//console.log(key)
			code += out[key]
		}
		code += 'define.packagedClass("/myworker.js",["$system/base/worker",_myworker]);\n'
		// lets start with requiring /myworker

		code += 'var _worker = define.require(\'/myworker\')();\n'
		
		code += _worker_return.toString() + ';\n'
		code += _worker_return.toString() + ';\n'

		function workermsg(event){
			var msg = event.data
			var ret = _worker[msg.name].apply(_worker, msg.args);
			if(ret && ret.then) ret.then(function(value){
				_worker_return(value, msg.uid)
			})
			else _worker_return(ret, msg.uid)
		}

		function _worker_return(ret, uid){
			// fix the typed object handling
			var transfer
			if(ret && (typeof ret === 'object' || Array.isArray(ret))){
				for(var key in ret){
					var prop = ret[key]
					if(prop && typeof prop.struct === 'function' && prop.array){
						transfer = transfer || []
						transfer.push(prop.array.buffer)
						ret[key] = {
							allocated: prop.allocated,
							array:prop.array,
							length: prop.length,
							slots: prop.slots,
							stride: prop.stride,
							__structarray__: prop.struct.name
						}		
					}
				}
			}
			self.postMessage({value:ret, uid:uid}, transfer)
		}

		code += 'self.onmessage = ' + workermsg.toString() + '\n'

		this._worker = define.worker(code)

		this._worker.onmessage = function(event){
			// lets plug the struct arrays
			this._resolveReturn(event.data)
		}.bind(this)

		// lets make the interface
		for(var key in this){
			var prop = this[key]
			if(typeof prop === 'function' && key[0] !== '_'){
				this[key] = function(key){
					// alright so. what do we do
					var msg = {type:'call', name:key, args:[]}
					for(var i = 1; i < arguments.length; i++){
						msg.args[i - 1] = arguments[i]
						//!TODO add typed array transfer feature
					}
					var prom = this._allocPromise()
					msg.uid = prom.uid
					this._worker.postMessage(msg)
					return prom
				}.bind(this,key)
			}
		}
	}
})
