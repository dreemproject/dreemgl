/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

// Composition showing import of class simplebox.js using short syntax with path reference
define.class("$server/composition",
	function (
		$ui$, screen,  // imports from classes/ui folder
		$$, simplebox  // import custom class
	) {
		this.render = function() {
			return[
				screen(
					{name:'normal', bgcolor: 'battleshipgrey'},
					simplebox({x: 10, y:10}),
					simplebox({x: 100, y: 50, w:100, h:60, bgcolor: 'celestialblue'})
				)
			];
		};
	}
);
