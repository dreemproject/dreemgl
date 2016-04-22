/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

//Pure JS based composition
define.class('$server/composition', function(require, $ui$, treeview,  cadgrid, splitcontainer, screen, view, label, $widgets$, propviewer, colorpicker, $$, flowgraph){

	define.class(this, 'fileio', function($server$, fileio){
		var path = require('path');
		var fs = require('fs');

		this.name = 'fileio';

		this.saveComposition = function(name, data){
			this.writefile(name, 'define.class("$server/composition",'+data+')')
		};

		this.newComposition = function(name){
			if(!define.$writefile){
				console.log("writefile api disabled, use -writefile to turn it on. Writefile api is always limited to localhost origins.")
				return null
			}
			console.log("new composition creation requested:", name)
			// todo: create folder in default composition path
			// todo: create default index.js using options from options.
			// todo: if things go wrong, return false

			var path = this.rootdirectory + '/' + name;
			var realpath = define.expandVariables(path);

			var mkdir = true;
			try {
				var stats = fs.statSync(realpath);
				mkdir = !stats.isDirectory();
			} catch (e) {}

			if (mkdir) {
				console.log("Making a new path", realpath);
				fs.mkdirSync(realpath);
			}

			var file = path +'/index.js';
			console.log("write file", file);
			this.writefile(file,
				"define.class('$server/composition', function($ui$, screen, $flow$controllers$, dpad, keyboard, knob, xypad, $flow$displays$, inputs, outputs, labtext, album, shaderviz, $flow$services$, map, omdb, webrequest) {\n"+
				"    this.render = function(){ \n" +
				"        return [\n" +
				"			outputs({name:'out', flowdata:{x:25,y:25}}),\n" +
				"           inputs({name:'in', flowdata:{x:400,y:100}, number:wire('this.rpc.out.number')})\n" +
				"	     ]}\n"+
				"    }\n" +
				");");

			return path;
		};

		this.getCompositionList = function(){

			var root = {collapsed:0, children:[]}

			var pathset = ["compositions"];
			var ret = readRecurDir(define.expandVariables(define['$apps']), '', [])
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
		this.readAllPaths = function(ignoreset //files and directories to ignore while recursively expanding
		){
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
