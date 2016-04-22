/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

// Display every icon in a parent view.

define.class(function($server$, composition, $ui$, screen, view, icon){
	// internal

	// Display every icon
	this.rviews = function() {
		var keys = Object.keys(icon.icontable);

		var dynviews = [];
		for (var i=0; i<keys.length; i++) {
			dynviews.push(icon({icon:keys[i], width: 40, height: 40, fontsize: 30, fgcolor: "white"}));
		}

		return dynviews;
	}


	this.render = function(){
		var views = [
		screen({name:'default', clearcolor:'#484230'},
			 view({name: 'top', bgcolor: vec4('gray'), flexdirection: 'row', flexwrap: 'wrap', margin: 10},
			 this.rviews())
			)
		];
		return views
	}
})

