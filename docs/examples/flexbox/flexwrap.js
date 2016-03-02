/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

// flexbox 'flexwrap' example
define.class("$server/composition",
	function ($ui$, screen, view, label) {

		this.style = {
			label: {
				fontsize: 10,
				fgcolor: 'black',
				bgcolor: NaN
			},
			view_container: {
				padding: vec4(5),
				bgcolor: 'darkmediumgray',
			}
		}

		this.render = function() {
			return[
				screen({name: 'default', clearcolor: 'white'},
					view({bgcolor: 'dimgray'},
						view({flexdirection: 'column', bgcolor: NaN},

							// example flexdirection=row, flexwrap=nowrap
							label({
									text: "flexdirecton: row; flexwrap: 'nowrap'",
									bgcolor: NaN,
								}
							),
							view({
									name:'container',
									w: 100,
								  flexdirection: 'row',
								  flexwrap: 'nowrap'
								},
								view({w:30, h:30, bgcolor: 'alabamacrimson'}),
								view({w:30, h:30, bgcolor: 'huntergreen'}),
								view({w:30, h:30, bgcolor: 'celestialblue'}),
								view({w:30, h:30, bgcolor: 'fluorescentorange'}),
								view({w:30, h:30, bgcolor: 'onyx'}),
								view({w:30, h:30, bgcolor: 'frenchbeige'})
							),

							// container flexdirection=row, flexwrap=wrap
							label({
								margintop: 10,
								text: "flexdirecton: row; flexwrap: 'wrap'",
									bgcolor: NaN,
								}
							),
							view({
									name:'container',
									w: 100,
									padding: vec4(5),
									bgcolor: 'darkmediumgray',
									flexdirection: 'row',
									flexwrap: 'wrap'
								},
								view({w:30, h:30, bgcolor: 'alabamacrimson'}),
								view({w:30, h:30, bgcolor: 'huntergreen'}),
								view({w:30, h:30, bgcolor: 'celestialblue'}),
								view({w:30, h:30, bgcolor: 'fluorescentorange'}),
								view({w:30, h:30, bgcolor: 'onyx'}),
								view({w:30, h:30, bgcolor: 'frenchbeige'})
							)


						)
					)
				)
			];
		};

	});

