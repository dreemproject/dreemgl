/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function (require, $ui$, view, label, screen, splitcontainer, noisegrid, button, $widgets$map$,map, urlfetch, $$,  mapcontrols, acceleroremote, $3d$, ballrotate){
	this.render = function(){
		return [
			urlfetch({name: "urlfetch"}),
			screen({name:"index"
				,style:{$:{fontsize:12}}
					,acceleromove: function(x,y,z){
						//console.log("moving:" , x,y,z);
						var d = 1000/5.0;
						this.find("mapinside").camera = Animate({0.5:vec3(x*d, y*d, z*d)});
					}
					,acceleropan: function(x,y,z){console.log("panning:", x,y,z);}
				}
				,view({flex: 1, bgcolor: "#5b5b5b"}
					,splitcontainer({bgcolor: "green"},
						mapcontrols({bgcolor:NaN, flex:0.2,flexwrap:"nowrap"}),
						view({bgcolor:NaN, flex:0.8},
							noisegrid({padding: 0, flex:1}
								,map({name: "themap"})
							)
						)
					)
				)
			)
			,screen({name:"acceleroremote"},acceleroremote({target:"index"}))
			,screen({name:"mobile"}
				,map({name: "mobilemap"})
				,view({bgcolor:NaN},
					button({icon:"home", justifycontent:"center", aligncontent:"center", flex:1,fontsize: 20, padding:20}),ballrotate({flex:1, padding:20,name:"ballrotate1", target:"mapinside"}))
				,label({bgcolor:NaN,bold:true, text:"DreemGL Mapping: Mobile", position:"absolute", x:10, y:10})
			)
		];
	}
})
