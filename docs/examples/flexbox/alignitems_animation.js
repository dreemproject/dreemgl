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
				fontsize: 12,
				margintop: 10,
		    fgcolor: 'black',
				bgcolor: NaN
			}
		}

		this.render = function() {
			return[
				screen({name: 'default', clearcolor: 'white'},

					view({y: -10, h:400, paddingleft: '10', bgcolor: 'darkmediumgray',
						    flexdirection: 'column'},

						label({text: "Container: alignitems: 'stretch'"}),
						view({
							  origheight: 0,
								h: 80,
								w: 360,
							  padding: '0',
								bgcolor: 'artichoke',
								flexdirection: 'row',
								alignitems: 'stretch',
								animheight: 0,
							  init: function() {
									this.origheight = this.h
								},
								pointerstart: function() {
									var newHeight = this.h > this.origheight ? this.origheight: 150
									this.animheight = this.h
									this.animheight = Config({value:newHeight, motion:"inoutquad", duration:1})
								},
								onanimheight: function() {
									this.h = this.animheight
								}
							},
							view({w:90, bgcolor: 'alabamacrimson', justifycontent: 'center'},
							  label({text:'h not set'})),
							view({w:90, h:15, bgcolor: 'huntergreen', justifycontent: 'center'},
								label({text:'h=15'})),
							view(
								{w:90, bgcolor: 'celestialblue', justifycontent: 'center'},
								label({text:'h not set'})),
							view({w:90, h: 40, bgcolor: 'fluorescentorange', justifycontent: 'center'},
								label({text:'h=40'}))
						)
					)
				)
			];
		};

	}
);

