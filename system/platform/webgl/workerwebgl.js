/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$system/base/worker', function(exports){

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

		var code = ''
		for(var key in out){
			//console.log(key)
			code += out[key]
		}
		code += 'define.packagedClass("/myworker.js",["$system/base/worker",'+this.constructor.body.toString()+']);\n'
		// lets start with requiring /myworker

		code += 'var worker = define.require(\'/myworker\');console.log(worker)'
	
		define.worker(code)
		// and fill up our own interface with proxy objects
		// lets fire up a worker
		// ok so we have to collect our own class structure and dependencies and send them over in packged form
		// awesome.
		// alright. lets do it.
		// ok lets log this shit
		//console.log(this.constructor)
		//define.worker()


	}
})
