define.class(function(require, service){
	//The fileio class provides an easy RPC mechanism to load/create/save/enumerate files and directories. The fileio instance should live on the server part of the composition.
	
	var nodehttp = require('$system/server/nodehttp')
	var fs = require('fs')
	var path = require('path')

	// wait for a file to change - then resolve the promise. Returns a promise.
	// <name> The file to read. File paths can use $-shortcuts to refer to various folders
	this.filechange = function(name){
		var filepath = path.join(define.expandVariables(define.$root), name)
		return new Promise(function(resolve){
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
		try{
			return fs.readFileSync(path.join(define.expandVariables(define.$root), name)).toString()
		}
		catch(e){
			return null
		}
	}

	// writefile synchronously writes data to a file. Returns the result of node.js fs.writeFileSync or null in case of exception
	// <name> The file to read. File paths can use $-shortcuts to refer to various folders
	// <data> The data to write
	this.writefile = function(name, data){
		try{
			return fs.writeFileSync(path.join(define.expandVariables(define.$root), name), data)
		}
		catch(e){
			return null
		}
	}
	// reads a directory and returns its contents
	// <name> the name of the directory to read
	this.readdir = function(name){
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