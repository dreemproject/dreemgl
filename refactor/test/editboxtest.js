/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

//Pure JS based composition
define.class('$server/composition', function($ui$, knob, speakergrid, screen, view, label, numberbox, textbox, $widgets$, propviewer, colorpicker, radiogroup){
	this.render = function(){ return [
		screen({clearcolor:vec4('blue'),flexwrap:"nowrap", flexdirection:"row",hardrect:{
					color:function(){
						var col1 = vec3(0.1,0.1,0.1);
						var col2 = vec3(0.2,0.25,0.5);
						return vec4(mix(col1, col2, 1-uv.y  + noise.noise2d(uv.xy*403.6)*0.02),1.0)
					}
				}
			}
			,speakergrid({flexdirection:"column", bgcolor: "#3b3b3b",minorsize:5,majorsize:25,  majorline:"#505040", minorline:"#404040" }
				,view({flexdirection:"column", bgcolor:vec4(0,0,0,0.2),margin:10, borderradius:5, alignitems:"flex-start", justifycontent:"flex-start"}
					,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:4, padding:4, bgcolor:NaN}
						,numberbox({fontsize: 10, value:10})
					)
					,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:4, padding:4, bgcolor:NaN}
						,numberbox({fontsize: 20, value:10})
					)
					,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:4, padding:4, bgcolor:NaN, alignitems:"flex-start", justifycontent:"flex-start"}
						,radiogroup({fontsize: 20,  values:["undefined" , "a","b","c", undefined]})
					)
				)
				,view({flexdirection:"column", bgcolor:vec4(0,0,0,0.4), margin:10, borderradius:5}
					,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:10, padding:4, bgcolor:NaN}
						,numberbox({title:"Q factor", fontsize: 20, value:10})
					)
					,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:10, padding:4, bgcolor:NaN}
						,radiogroup({title:"random", fontsize: 20, values:["undefined" , "thing","stuff","misc"]})
					)
					,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:10, padding:4, bgcolor:NaN}
						,numberbox({title:"X factor", fontsize: 20, value:20, stepvalue:0.1})
					)
				)
				,view({flexdirection:"row", flex: 1,bgcolor:vec4(0,0,0,0.6), margin:10, borderradius:5}
					,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:10, padding:4, bgcolor:NaN}
						,knob({knobsize: 10, bgcolor:vec4(0,0,0,1)})
					)
					,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:10, padding:4, bgcolor:NaN}
						,knob({knobsize: 20, bgcolor:vec4(0,0,0,1)})
					)
					,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:10, padding:4, bgcolor:NaN}
						,knob({knobsize: 30, bgcolor:vec4(0,0,0,1)})
					)
				)
			)
		)
	]}
})
