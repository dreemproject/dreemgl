/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

// flexbox child flex property example
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
				screen({name: 'default', clearcolor: 'darkmediumgray'},

					view(
						{
							name: 'topview',
							w: 860, h:200, bgcolor: 'artichoke',
							flexdirection: 'column', justifycontent: 'flex-start', flexwrap: 'wrap',
							origwidth: 0,
							animwidth: 0,
							init: function() {
								this.origwidth = this.w
							},
							pointerstart: function() {
								var newWidth = this.w < this.origwidth ? this.origwidth: 500
								this.animwidth = this.w
								this.animwidth = Config({value:newWidth, motion:"inoutquad", duration:1})
							},
							onanimwidth: function() {
								this.w = this.animwidth
							}
						},

						label({text: " red view uses flex=.5, green view flex=1" }),
						// Row #1
						view({
							  flex: 1,
								flexdirection: 'row',
								alignitems: 'stretch'
							},
							// Red view is half as wide as the green view
							view({ flex:.5, bgcolor: 'alabamacrimson' }),
							view({ flex: 1, bgcolor: 'huntergreen'}),
							view({ bgcolor: 'fluorescentorange'})
						),

						label({text: " red view uses w=80, green view flex=1, orange view w=80" }),
						// Row #2
						view({
							  flex: 1,
								flexdirection: 'row',
								alignitems: 'stretch'
							},
							view({w:80, bgcolor: 'alabamacrimson' }),
							view({ flex: 1, bgcolor: 'huntergreen'}),
							view({w:80, bgcolor: 'fluorescentorange'})
						),

						label({text: " all 4 view use flex=.25" }),
						// Row #3
						view({
								flex: 1,
								flexdirection: 'row',
								alignitems: 'stretch'
							},
							view({flex:.25, bgcolor: 'alabamacrimson' }),
							view({flex:.25, bgcolor: 'huntergreen'}),
							view({flex:.25, bgcolor: 'onyx' }),
							view({flex:.25, bgcolor: 'fluorescentorange'})
						)


					)
				)
			];
		};

	}
);

