/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Async js

define(function(){
	// turn a generator into an async loop	
	function async(generator){
		var ret = function(){
			var iter = generator.apply(this, arguments)

			return new Promise(function(resolve, reject){
				function error(e){ reject(e) }
				function next(value){
					var iterval = iter.next(value)
					if(iterval.done === false) iterval.value.then(next, error)
					else resolve(iterval.value)
				}
				next()
			})
		}
		return ret
	}
	return async
})