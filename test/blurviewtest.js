/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function($server$, composition, $ui$, screen, view, blurview, icon, label, slider, require){
	this.render = function(){
		return [
			screen({name:'default'},
						 view({flex: 1, flexdirection:"column"},
									slider({
										flex:0,
										width:300,
										minhandlethreshold:26,
										height:15,
										value:0.1,
										bgcolor:"darkyellow",
										fgcolor:"white",
										onvalue:function(ev,v,o) {
											// Scale the blurradius from 0-25
											var blur = 1 + v * 25;
											
											var view = this.find('blur');
											if (view) {
												view.blurradius = blur;
											}
										}
									}),

									blurview({name: 'blur', flex: 1, blurradius: 8},
													 icon({icon: 'chain', fontsize: 100}),
													 label({text: 'Hello!', fontsize: 100}),
													 view({
														 width:200,
														 height:200,
														 borderwidth:1,
														 bordercolor:"white",
														 bgimagemode:"center",
														 bgimage:require('$resources/textures/landscape.jpg')
													 })
													)
								 )
						)
		]
	}
})

