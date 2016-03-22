/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition", function ($ui$, screen, view, label) {
		this.render = function() {
			return[
				screen( { name:'normal', clearcolor: 'white' }
					,view({
							name: 'container', w: 305, bgcolor: 'battleshipgrey',
							oninit: function() {
								for (var i=0; i<this.children.length; i++) {
									console.log("child #" + i + ": name=" + this.children[ i ].name);
									this.children[ i ].text = "view #" + i;
								}
							}
						}
						,label({ name: 'v1', w: 80, h:30, margin: 10, bgcolor: 'amaranthred' })
						,label({ name: 'v2', w: 80, h:30, margin: 10, bgcolor: 'castletongreen' })
						,label({ name: 'v3', w: 80, h:30, margin: 10, bgcolor: 'amber' })
					)
				)
			];
		};
	}
);
