/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

// flexbox 'alignself' example
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

					view({h:400, paddingleft: 10, bgcolor: 'darkmediumgray',
							flexdirection: 'column', justifycontent: 'flex-start'},

						label({text: "alignitems: 'center'" }),
						// First row with alignitems='center' on container
						view({
								h: 120,
								w: 240,
								bgcolor: 'artichoke',
								flexdirection: 'row',
								alignitems: 'center'
							},
							view({w:80, h:80, bgcolor: 'alabamacrimson' }),
							view({w:80, h:80, bgcolor: 'huntergreen'}),
							view({w:80, h:80, bgcolor: 'fluorescentorange'})
						),

						label({text: "alignself on item overrides container aligitems='center'" }),
						// Second row with alignitems='center' on container, but children overriding
						// the value using alignself.
						view({
								h: 120,
								w: 240,
								bgcolor: 'artichoke',
								flexdirection: 'row',
								alignitems: 'center'
							},
							view({w:80, h:80, bgcolor: 'alabamacrimson', alignself: 'flex-start'}),
							view({w:80, h:80, bgcolor: 'huntergreen', alignself: 'flex-end'}),
							view({w:80, bgcolor: 'fluorescentorange', alignself: 'stretch'})
						)
					)
				)
			];
		};

	}
);

