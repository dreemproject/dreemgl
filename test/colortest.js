/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

//Pure JS based composition
define.class('$server/composition', function($ui$, screen, view, splitcontainer, label, button, $widgets$, colorpicker){
	this.render = function(){ return [
		screen({clearcolor:'#484230', flexdirection:'row'},
			splitcontainer({ vertical: false, flexdirection: "row", bgcolor: "black", flex:1},
				view({
					flex:1,
					flexdirection:"column",
					alignitems:'stretch',
					bgcolor:'blue',
					bg:{
						color:function(){
							var col1 = vec3(0.1,0.1,0.1);
							var col2 = vec3(0.2,0.25,0.5);
							return vec4(mix(col1, col2, 1-uv.y  + noise.noise2d(uv.xy*403.6)*0.02),1.0)
						}
					}},
					view({bg:0, padding:4},
					colorpicker({margin:4, flex:1, value:vec4("#342563"), bgcolor:vec4(0,0,0,0.4)}),
					colorpicker({margin:4, flex:1, value:vec4("#D0F612"), bgcolor:vec4(0,0,0,0.4)}),
					colorpicker({margin:4, flex:1, value:vec4("#102030"), bgcolor:vec4(0,0,0,0.4)})
					)
					,view({flexdirection:"row", bgcolor:"transparent",padding:7 },
						button({
							text:"Set Vec4",
							click:function(){
								var cp = this.find("colorpicker");
								cp.value = vec4("blue");
								console.log(cp.color);
							}
						}),

						button({
							text:"Set HSL",
							click:function(){
								var cp = this.find("colorpicker");
								cp.value = vec4.fromHSL(Math.random(),Math.random(),Math.random());
								console.log(cp.color);
							}
						})
					)
				)
			)
		)
	]}
})
