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
						view({flexdirection:"column"},
							label({text:"Columns w/styled column", marginbottom:30}),
							table({
									width:400,
									height:100,
									columns:5,
									alignsection:"center",
									style:{
										rowcol: {
											borderwidth:vec4(0,1,0,0),
											bordercolor:"white"
										},
										rowcol_column3: {
											borderwidth:vec4(1,1,0,0),
										},
										rowcol_column2: {
											bgcolor:vec4(1,1,1,0.2),
											borderwidth:vec4(0,0,5,5),
											bordercolor:"white",
											paddingtop:20,
											width:30
										}
									}
								},
								label({text:"col1"}),
								label({text:"col2"}),
								label({text:"col3"}),
								label({text:"col4"}),
								label({text:"col5"}),
								label({text:"col1"}),
								label({text:"col2"}),
								label({text:"col3"}),
								label({text:"col4"}),
								label({text:"col5"})
							)
						),
						view({flexdirection:"column"},
							label({text:"Rows w/styled row", marginbottom:30}),
							table({
									name:"foo",
									width:400,
									height:200,
									rows:3,
									alignsection:"center",
									justifysection:"space-around",
									style:{
										rowcol: {
											borderwidth:vec4(0,0,0,1),
											bordercolor:"white"
										},
										rowcol_row2: {
											borderwidth:vec4(0,0, 1,1),
										},
										rowcol_row1: {
											bgcolor:vec4(1,1,1,0.2),
											borderwidth:vec4(5,5,0,0),
											bordercolor:"white",
											height:30
										}
									}
								},
								label({text:"row1"}),
								label({text:"row2"}),
								label({text:"row3"}),
								label({text:"row1"}),
								label({text:"row2"}),
								label({text:"row3"}),
								label({text:"row1"}),
								label({text:"row2"}),
								label({text:"row3"}),
								label({text:"row1"}),
								label({text:"row2"}),
								label({text:"row3"})
							)
						)
					)
				)
			]
		}
	}
)
