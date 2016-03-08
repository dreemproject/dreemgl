/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition",function($ui$, screen, icon, label, view, cadgrid, $widgets$, table) {

		this.render = function() {
			return [
				screen(
					cadgrid({
						name:"grid",
						bgcolor:"#4e4e4e",
						gridsize:10,
						majorevery:5,
						majorline:vec4(0.4,0.4,0.4,1),
						minorline:vec4(0.2,0.2,0.2,1),
						alignself:'stretch',
						flexdirection:'row',
						alignitems:"center",
						justifycontent:'space-around'
					},
						table({
							width:400,
							height:400,
							columns:5,
							alignsection:"center",
							style:{
								rowcol: {
									borderwidth:vec4(0,1,0,0),
									bordercolor:"white"
								},
								rowcol_column2: {
									borderwidth:vec4(0,1,1,1),
									bordercolor:"yellow",
									padding:30,
									width:30
								}
							}
						},
							icon({icon:"facebook"}),
							icon({icon:"digg"}),
							icon({icon:"cc"}),
							icon({icon:"envelope"}),
							icon({icon:"empire"}),
							icon({icon:"eye"}),
							icon({icon:"circle"}),
							icon({icon:"circle-o"}),
							icon({icon:"star"}),
							icon({icon:"star-o"})
						),
						table({
							name:"foo",
							width:400,
							height:400,
							rows:3,
							alignsection:"center",
							justifysection:"space-around",
							style:{
								rowcol: {
									borderwidth:vec4(0,0,0,1),
									bordercolor:"white"
								}
							}
						},
							icon({icon:"star"}),
							icon({icon:"facebook"}),
							icon({icon:"digg"}),
							icon({icon:"cc"}),
							icon({icon:"envelope"}),
							icon({icon:"empire"}),
							icon({icon:"eye"}),
							icon({icon:"circle"}),
							icon({icon:"circle-o"}),
							icon({icon:"star"}),
							icon({icon:"star-o"}),
							icon({icon:"star-o"})
						)
					)
				)
			]
		}
	}
)
