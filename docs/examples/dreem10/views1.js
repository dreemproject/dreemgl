/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

// views in DreemGL (1)
define.class("$server/composition", function ($ui$, screen, view) {
		this.render = function() {
			return[
				screen( {name:'default', clearcolor: 'coolgrey'},
				  view({
							name: 'outerView', w: 500, h: 500, padding: 10,
							bordersize: 10, bordercolor: 'alabamacrimson', bgcolor: 'battleshipgrey'
						},
						view({w:30,h:30,bgcolor:'alabamacrimson'}),
						view({w:30,h:30,bgcolor:'huntergreen'}),
						view({w:30,h:30,bgcolor:'celestialblue'}),
						view({w:30,h:30,bgcolor:'fluorescentorange'}),
						view({w:30,h:30,bgcolor:'onyx'}),
						view({w:30,h:30,bgcolor:'frenchbeige'})
					)
				)
			];
		};
	}
);
