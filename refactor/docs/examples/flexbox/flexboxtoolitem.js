/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class("$ui/view", function($ui$, label, view) {

	var item = this;
	this.width = 120;
	this.height = 120;
	this.padding = 6;
	this.alignself = '';

	this.pointerstart = function() {
		this.screen.composition.selectedChild = this;
	};

	this.render = function() {
		return [
			view({w:108, h:108, bgcolor: 'gray', flexdirection: 'column', padding: 4},
				label({name: 'viewname', text: 'name: ' + this.name, fgcolor: 'black', bgcolor: null, fontsize: '12', bold: true}),
				label({text: 'alignself: ' + this.alignself, fgcolor: 'black', bgcolor: null, fontsize: '11'})
			)
		]
	}
});

