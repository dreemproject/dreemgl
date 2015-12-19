//Pure JS based composition
define.class(function($server$,composition, role,require, $ui$,treeview,  cadgrid, splitcontainer, screen, view, label, button, $widgets$, propviewer, colorpicker, $$, flowgraph){	
	
	define.class(this, 'fileio', function($server$,fileio){
		var path = require('path')
		var fs = require('fs')
		this.name = 'fileio'

		function readRecurDir(base, inname, ignoreset){
			var local = path.join(base, inname)
			var dir = fs.readdirSync(local)
			var out = {name:inname, collapsed:1, children:[]}
			for(var i = 0; i < dir.length;i++){
				var name = dir[i]
				var mypath = path.join(local, name)
				if(ignoreset){
					for(var j = 0; j < ignoreset.length; j++){
						var item = ignoreset[j]
						if(typeof item === 'string'){
							if(mypath.indexOf(item) !== -1)  break
						}
						else{
							if(mypath.match(item)) break
						}
					}
					if(j < ignoreset.length) continue
				}
				var stat = fs.statSync(mypath)
				if(stat.isDirectory()){
					out.children.push(readRecurDir(local, name, ignoreset))
				}
				else{
					out.children.push({name:name, size:stat.size})
				}
			}
			return out
		}

		// recursively read all directories starting from a base path
		// <name> the base path to start reading
		// <ignoreset> files and directories to ignore while recursively expanding
		this.readAllPaths = function(ignoreset){
			// lets read all paths.
			// lets read the directory and return it
			var root = {collapsed:0, children:[]}

			if(ignoreset) ignoreset = ignoreset.map(function(value){
				if(value.indexOf('@') == 0) return new RegExp(value.slice(1))
				return value
			})

			for(var key in define.paths){
				if(ignoreset.indexOf(key) !== -1) continue
				var ret = readRecurDir(define.expandVariables(define['$'+key]), '', ignoreset)
				ret.name = key
				root.children.push(ret)
			}
			return root
		}
	})

	
	
	this.render = function(){		
		return [
			this.fileio()
			,role(
				screen({bg:0,clearcolor:vec4('black'),flexwrap:"nowrap", flexdirection:"row"}
					,flowgraph({
						
					})
				)
			)
		]		
	}
})