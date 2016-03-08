/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition",function(require,$ui$,textbox,checkbox,icon,button,label,view,screen,cadgrid,$widgets$,toolkit){

		this.render=function(){

			return [
				screen(
					{
						flexdirection:"row"
					},
					cadgrid({
							name:"grid",
							flex:3,
							overflow:"scroll",
							bgcolor:vec4(0.08853328227996826,0.11556218564510345,0.16508188843727112,1),
							gridsize:8,
							majorevery:5,
							majorline:vec4(0.06671861559152603,0.26168233156204224,0.34268006682395935,1),
							minorline:vec4(0.1546473354101181,0.1543203890323639,0.12822513282299042,1),
							alignitems:'center',
							flexdirection:'column',
							justifycontent:'center',
							anchor:vec3(0,0,0),
							toolmove:false,
							toolrect:false
						},
						button({
							text:"Adjust Scroll Position",
							marginbottom:20,
							click:function() {
								var box = this.find("smallbox");
								box.scroll = vec2(30, 30);
								box.redraw()
							}
						}),
						view({
							name:"smallbox",
							flex:0,
							width:100,
							height:150,
							bgcolor:"black",
							overflow:"hidden",
							flexdirection:"column"
						},
							icon({icon:"check"}),
							label({text:"Some text"}),
							icon({icon:"star"}),
							label({text:"More text"}),
							label({text:"Some text"}),
							icon({icon:"star"}),
							label({text:"More text"}),
							icon({icon:"star-o"}),
							label({text:"Even more text!"}),
							icon({icon:"times"})
						)
					)
				)
			]
		}
	}
);
