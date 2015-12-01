/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// childPromise turns a childprocess into a promise that resolves with the output of the process

define(function(require){
	var child_process = require('child_process')

	return function childPromise(execpath, args){
		return new Promise(function(resolve, reject){

			var child = child_process.spawn(execpath, args)

			var result = {stdout:'', stderr:'', code:0}
			child.stdout.on('data', function(buf){
				result.stdout += buf.toString()
			})

			child.stderr.on('data', function(buf){
				result.stderr += buf.toString()
			})

			child.on('close', function(code){
				result.code = 0
				resolve(result)
			})

			child.on('error', function(error){
				reject(error)
			})
		})
	}
})