/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, service){
	// The fileio class provides an easy RPC mechanism to load/create/save/enumerate files and directories. The fileio instance should live on the server part of the composition.
	// do not ever put this in a web-facing composition as it has no security features
	var $localbound = define.$localbound
	this.name = "fileio"

	var nodehttp = require('$system/server/nodehttp')
	var fs = require('fs')
	var path = require('path')

	// wait for a file to change - then resolve the promise. Returns a promise.
	// <name> The file to read. File paths can use $-shortcuts to refer to various folders
	this.filechange = function(name){
		name = define.safePath(name)
		if(!name) return null
		var filepath = path.join(define.expandVariables(define.$root), name)
		return new define.Promise(function(resolve){
			// lets wait for a  filechange, then resolve it
			var stat = JSON.stringify(fs.statSync(filepath))
			var myitv = setInterval(function mytimeout(){
				var newstat = JSON.stringify(fs.statSync(filepath))
				if(stat !== newstat){
					clearInterval(myitv)
					resolve(fs.readFileSync(filepath).toString())
				}
			}, 100)
		})
	}

	// Return the full contents of a file as a string. Returns the result of node.js fs.readFileSync or null in case of exception
	// <name> The file to read. File paths can use $-shortcuts to refer to various folders
	this.readfile = function(name){
		// only support reading tagged names
		name = define.safePath(name)
		if(!name) return null
		try{
			return fs.readFileSync(define.expandVariables(name)).toString()
		}
		catch(e){
			return null
		}
	}

	// writefile synchronously writes data to a file. Returns the result of node.js fs.writeFileSync or null in case of exception
	// <name> The file to read. File paths can use $-shortcuts to refer to various folders
	// <data> The data to write
	this.writefile = function(name, data){
		if(!define.$writefile){
			console.log("writefile api disabled, use -writefile to turn it on. Writefile api is always limited to localhost origins.")
			return null
		}
		name = define.safePath(name)
		if(!name) return null
		try{
			var fullname = define.expandVariables(name);
			console.log("writing file:",fullname);
			return fs.writeFileSync(fullname, data)
		}
		catch(e){
			return null
		}
	}
	// reads a directory and returns its contents
	// <name> the name of the directory to read
	this.readdir = function(name){
		name = define.safePath(name)
		if(!name) return null
		// lets read the directory and return it
		try{
			var dir = fs.readdirSync(path.join(define.expandVariables(define.$root), name))
			return dir
		}
		catch(e){
			return []
		}
		// lets do a query
	}
})
