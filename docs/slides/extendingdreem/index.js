/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition',function(require, $server$, fileio, $ui$, screen, $docs$examples$components$, search, $widgets$, slideviewer, $$, devices, syntax, index, slides$upload, slides$intro, slides$syntax, slides$paths, slides$internal, slides$external, slides$api, slides$resources){

	this.render = function render() {

		return [
			// `examples/guide/search.js` is used here
			search({name:'omdbsearch', keyword:"Dogs"}),
			screen({
				name:'desktop'
			},
				slideviewer({ name: 'slides',
						slide:{
							padding:15,
							borderradius:20
						},
						flex:1,
						viewport:'2d',
						overflow:'scroll',
						slideheight: 800,
						bgcolor: 'black',
						scroll:Config({persist:true})
					},

					slides$intro({
						flex:1,
						syntaxCode:getSource(syntax)
					}),

					slides$paths({flex: 1}),

					slides$internal({
						flex: 1,
						movies:wire('this.rpc.omdbsearch.results'),
						searchCode:getSource(search),
						compositionCode:getSource(index)
					}),

					slides$external({
						flex: 1,
						apiCode:getSource(devices),
						devices:wire('this.rpc.devbus.active')
					}),

					slides$api({flex: 1}),
					slides$upload({flex:1}),
					slides$resources({flex: 1})
				)
		    ),
			devices({name:'devbus'}),
			fileio({
				name:"fileio",
				ls:function(){
					var path = require('path');
					var fs = require('fs');
					if (!fs || !path) {
						return;
					}

					var files = [];

					var local = define.expandVariables(define.classPath(this));
					var dir = fs.readdirSync(local);
					for(var i = 0; i < dir.length;i++){
						var name = dir[i];
						var stat = fs.statSync(path.join(local, name));
						if(!stat.isDirectory() && name != '.DS_Store'){
							files.push(name)
						}
					}

					return files
				}.bind(this)
			})
		]
	}

	function getSource(obj) {
		return obj.module.factory.body.toString();
	}


});
