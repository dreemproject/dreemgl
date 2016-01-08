//Pure JS based composition
define.class('$server/composition', function(require, $ui$,treeview,  cadgrid, splitcontainer, screen, view, label, button, $widgets$, propviewer, colorpicker, $$, flowgraph){	

	define.class(this, 'fileio', function($server$,fileio){
		var path = require('path')
		var fs = require('fs')
		this.name = 'fileio'
		
		this.rootdirectory = '$compositions'

		this.saveComposition = function(name, data){
			fs.writeFile(define.expandVariables(name)+'/index.js', 'define.class("$server/composition",'+data+')')
		}

		this.newComposition = function (name){
			console.log("new composition creation requested:", name);
			// todo: create folder in default composition path
			// todo: create default index.js using options from options.
			// todo: if things go wrong, return false
			var path = define.expandVariables(this.rootdirectory)+'/'+name
			var file = path +'/index.js';
			try{
				fs.mkdirSync(path)
			}catch(e){}

			fs.writeFileSync(file,
			"define.class('$server/composition',function(){\n"+
			"	this.render = function(){ return [\n"+
			"	]}\n"+
			"})")
			return  this.rootdirectory + '/' + name
		}

		this.getCompositionList = function(){
			
			var root = {collapsed:0, children:[]}
			
			var pathset = ["compositions"];
			var ret = readRecurDir(define.expandVariables(define['$compositions']), '', [])
			ret.name = "compositions"
			root.children.push(ret)
			return root

			return [];
		}
		
		function readRecurDir(base, inname, ignoreset){
			var local = path.join(base, inname)
			var dir = fs.readdirSync(local)
			var out = {isfolder:true, name:inname, collapsed:1, children:[]}
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
					out.children.push({name:name, isfolder:false, size:stat.size})
				}
			}
			return out
		}

		// recursively read the flowgraph related class library
		this.readFlowLibrary = function(ignoreset){
			var root = {collapsed:0, children:[]}
			
			var pathset = ["flow"];
			var ret = readRecurDir(define.expandVariables(define['$flow']), '', [])
			ret.name = "flow"
			root.children.push(ret)
			return root
			
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
			this.fileio(),
			screen({
				bg:0,
				clearcolor:vec4('black'),
				flexwrap:"nowrap", 
				flexdirection:"row",
				style:{
					$:{
						fontsize:12
					}
				}},
				flowgraph()
			)
		]		
	}
})