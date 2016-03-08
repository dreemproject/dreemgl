/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

// flexbox 'alignitems' example
define.class("$server/composition",
	function ($ui$, screen, view, label) {

		this.style = {
			label: {
				fontsize: 10,
				margintop: 10,
				fgcolor: 'black',
				bgcolor: NaN
			}
		}

		this.render = function() {
			return[
				screen({name: 'default', clearcolor: 'white'},

					view({h:400, padding: '10', bgcolor: 'darkmediumgray',
							flexdirection: 'column', justifycontent: 'space-between'},

						label({text: "alignitems: 'flex-start'" }),
						view({
								h: 50,
								w: 300,
								bgcolor: 'battleshipgrey',
								flexdirection: 'row',
								alignitems: 'flex-start'
							},
							view({w:30, h:20, bgcolor: 'alabamacrimson'}),
							view({w:30, h:15, bgcolor: 'huntergreen'}),
							view({w:30, h:30, bgcolor: 'celestialblue'}),
							view({w:30, h:25, bgcolor: 'fluorescentorange'}),
							view({w:30, h:40, bgcolor: 'onyx'}),
							view({w:30, h:30, bgcolor: 'frenchbeige'})
						),

						label({text: "alignitems: 'flex-end'" }),
						view({
								h: 50,
								w: 300,
								bgcolor: 'battleshipgrey',
								flexdirection: 'row',
								alignitems: 'flex-end'
							},
							view({w:30, h:20, bgcolor: 'alabamacrimson'}),
							view({w:30, h:15, bgcolor: 'huntergreen'}),
							view({w:30, h:30, bgcolor: 'celestialblue'}),
							view({w:30, h:25, bgcolor: 'fluorescentorange'}),
							view({w:30, h:40, bgcolor: 'onyx'}),
							view({w:30, h:30, bgcolor: 'frenchbeige'})
						),

						label({text: "alignitems: 'center'" }),
						view({
								h: 50,
								w: 300,
								bgcolor: 'battleshipgrey',
								flexdirection: 'row',
								alignitems: 'center'
							},
							view({w:30, h:20, bgcolor: 'alabamacrimson'}),
							view({w:30, h:15, bgcolor: 'huntergreen'}),
							view({w:30, h:30, bgcolor: 'celestialblue'}),
							view({w:30, h:25, bgcolor: 'fluorescentorange'}),
							view({w:30, h:40, bgcolor: 'onyx'}),
							view({w:30, h:30, bgcolor: 'frenchbeige'})
						),

						label({text: "alignitems: 'stretch'" }),
						view({
								h: 50,
								w: 300,
								bgcolor: 'battleshipgrey',
								flexdirection: 'row',
								alignitems: 'stretch'
							},
							view({w:30, bgcolor: 'alabamacrimson'}),
							view({w:30, h:15, bgcolor: 'huntergreen'}),
							view({w:30, h:30, bgcolor: 'celestialblue'}),
							view({w:30, bgcolor: 'fluorescentorange'}),
							view({w:30, h:40, bgcolor: 'onyx'}),
							view({w:30, h:30, bgcolor: 'frenchbeige'})
						)
					)
				)
			];
		};

	}
);

