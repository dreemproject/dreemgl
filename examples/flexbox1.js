/* Copyright 2020-2016 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

// Flexbox flexdirection example.
define.class("$server/composition",
	function ($ui$, screen, view) {

		this.render = function () {
			return [
				screen(
					{name: 'default', clearcolor: 'black'},
					// boxes with flexdirection row / horizontal layout 
					view({
							bgcolor: vec4(.2,.3,.3,1.0),
							padding: vec4(5)
						},
						view({w:20, h:20, bgcolor: vec4(.1,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(.2,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(.3,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(.4,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(.5,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(.6,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(.7,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(.8,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(.9,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(1.0,.5,.5,1.0)})
					),
					/* boxes with flexdirectino 'column' / vertical layout */
					view({
							bgcolor: vec4(.2,.4,.4,1.0),
							flexdirection:"column",
							padding: vec4(5)
						},
						view({w:20, h:20, bgcolor: vec4(.1,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(.2,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(.3,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(.4,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(.5,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(.6,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(.7,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(.8,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(.9,.5,.5,1.0)}),
						view({w:20, h:20, bgcolor: vec4(1.0,.5,.5,1.0)})
					)
				)
			];
		}
	}
);
