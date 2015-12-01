//Pure JS based composition
define.class(function(require, $server$, composition, fileio, screens, dataset, $containers$, screen, view, splitcontainer, $controls$,  treeview, label, $widgets$, docviewer, codeviewer){

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
		this.fileio(),
		screens(
			screen({
				init:function(){
					// lets load the entire directory structure
					this.rpc.fileio.readAllPaths(['resources','server.js','resources','cache','@/\\.','.git', '.gitignore']).then(function(result){
						var filetree = this.find('filetree')
						var tree = result.value
						tree.name = 'Documentation'
						tree.collapsed = false
						// lets make a dataset
						this.model = filetree.dataset = dataset(tree)
					}.bind(this))
					
				}},
				splitcontainer({vertical: false,  bgcolor: "black", flex:1}
					,view({flexdirection:"column", padding: 0,flex: 0.2}
						,view({alignitems:"center", bgcolor:"#e0e0e0", flexdirection:"row" ,padding: 14},
							label({text:"DreemGL", fgcolor:"black", bgcolor:"#e0e0e0", fontsize: 35 })
						)
						,treeview({
							postLayout:function(){
							},
							init:function(){
								var dataset = this.find('screen').model
								if(dataset) this.dataset = dataset
							},

							name:'filetree', 
							flex:1, 
							select:function(sel){
								if(sel.type === 'setter')debugger
								// we have to grab the last path set and concatenate a path
								var path = ''
								for(var i = sel.path.length - 1; i >= 1; i--){
									path = sel.path[i].name + (path!==''?'/' + path:'')
								}
								this.find('screen').locationhash = {path : '$root/'+path};
							}
						})
					)
					,docviewer({flex:1,
						attributes:{class:{persist:true}},
						init:function(){
							//console.log("INITIALIZIN")
							this.screen.locationhash = function(event){
							//	debugger
								if(event.value.path) require.async(event.value.path).then(function(module){
									this.class = module
								}.bind(this))
							}.bind(this)
							//this.screen.locationhash = this.screen.locationhash
						},
						minsize:vec2(400,400),
						overflow:'scroll'
					//	overflow:'scroll'
					})
				)
			)
		)
	]}
})