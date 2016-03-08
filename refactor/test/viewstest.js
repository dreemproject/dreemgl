/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

// Randomly display squares in a parent view. Move each view when the parent
// view is clicked.

define.class(function($server$, composition, $ui$, screen, view){
	//internal
// Helper functions

	// Return random[0,max)
	function random(max) {
		var rand = Math.floor(Math.random() * max);
		return rand;
	}

	// Return random color
	function rcolor() {
		var color = vec4(Math.random(), Math.random(), Math.random(), 1);
		return color;
	}

	// Return a random position
	function rpos() {
		var pos = vec3(random(450), random(450), 0);
		return pos;
	}

	// Create N random views
	this.rviews = function(n) {
		// Create dynamic squares (location and color)
		var dynviews = [];
		for (var i=0; i<n; i++) {
			var v = view({
				pos: rpos(),
				size: vec2(50, 50),
				bgcolor: rcolor(),
				position: 'absolute'
			})
			dynviews.push(v);
		}
		return dynviews;
	}

	// When the pointer taps, change the location of each view
	this.updatePositions = function(event){
		// Rewrite the positions of the views
		for (var i=0; i<this.children.length; i++) {
			this.children[i].pos = rpos();
		}
	}

	this.render = function(){
		var views = [
		screen({name:'default', clearcolor:'#484230'},
			 view({name: 'top', size: vec2(500,500), bgcolor: vec4('gray'), pointertap: this.updatePositions},
			 this.rviews(50))
			)
		];
		return views
	}
})

