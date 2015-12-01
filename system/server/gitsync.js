/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Git synchronize your project automatically

define.class(function(require, exports, self){

	var childPromise = require('./childpromise')
	var async = require('$system/lib/async')
	var promisify = require('$system/lib/promisify')

	self.atConstructor = function(args){
		this.run()
	}

	self.run = async(function*(){
		
		var result = yield childPromise("git",["pull","origin"])
		// check result!
		if(result.stdout.indexOf('Already up-to-date') == 0)
		{
		}
		else{
			console.color("\n~bm~Synchronizing git repo:               ")
			console.log(result.stdout)
		}
		console.color(".")
		var result = yield childPromise("git",["status","--porcelain"])
		// ok lets split stdout in newlines
		var items = result.stdout.split('\n')
		var modified = false;
		
		for(var i = 0; i < items.length; i++){
			var item = items[i]
			var file = item.slice(3)
			if(item.indexOf('??') == 0){
				console.log(((modified==true)?"":"\n")+'A '+file)				
				yield childPromise("git",["add",file])
				modified = true
			}
			else if(item.indexOf(' D') == 0){
				console.log((modified?"":"\n")+'D '+file)
				yield childPromise("git",["rm",file])
				modified = true
			}
			else if(item.indexOf(' U') == 0 || item.indexOf(' M') == 0){
				console.log((modified?"":"\n")+'M '+file)
				yield childPromise("git",["add",file])	
				modified = true 
			}
		}
		if(modified){
			yield childPromise("git",["commit","-m","work"])
			console.color('~br~Pushing: ')
			var result = yield childPromise("git",["push","origin"])
			console.color("~bg~OK!\n")
		}
		else{
		//	console.color("~by~Nothing to do, waiting 5 seconds!\n")
			yield promisify.timeout(5000)
		}
	})
})