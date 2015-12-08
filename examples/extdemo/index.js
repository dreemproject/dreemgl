/* Copyright 2015 Teem2 LLC - Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, $server$, composition, role, $ui$, screen, $examples$guide$search, $widgets$, slideviewer, $$, devices, syntax, index, slides$intro, slides$syntax, slides$paths, slides$internal, slides$external, slides$api, slides$resources){

	function getSource(obj) {
		return obj.module.factory.body.toString();
	}

	this.render = function render() {

		return [
			// `examples/guide/search.js` is used here
			$examples$guide$search({name:'search', keyword:"Aliens"}),
			role(
				screen({name:'desktop'},
					slideviewer(
						{ name: 'slides',
  						  slide:{
							padding:15,
							borderradius:20
						  },
						  slideheight: 800,
						  position: 'absolute',
						  x: 0,
						  bgcolor: 'black',
						  viewport:'2d',
						  overflow:'scroll',
						  attributes:{scroll:{persist:true}}
						},
						slides$intro({
							flex:1,
							syntaxCode:getSource(syntax)
						}),
						slides$syntax({flex: 1, syntaxCode:getSource(syntax)}),
						slides$paths({flex: 1}),
						slides$internal({
							flex: 1,
							movies:wire('this.rpc.search.results'),
							searchCode:getSource($examples$guide$search),
							compositionCode:getSource(index)
						}),
						slides$external({
							flex: 1,
							apiCode:getSource(devices),
							devices:wire('this.rpc.devbus.active')
						}),
						slides$api({flex: 1}),
						slides$resources({flex: 1})
					)
				)
		    ),
			devices({name:'devbus'})
		]
	}
});