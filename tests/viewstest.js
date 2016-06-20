/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

// Randomly display squares in a parent view. Move each view when the parent
// view is clicked.

define.class('$base/composition', function(require, $base$, screen, view, $views$, button, label){
	// Internal
	// Helper functions

	// Return random[0,max)
	function random(max) {
		var rand = Math.floor(Math.random() * max)
		return rand
	}

	// Return random color
	function rcolor() {
		return vec4(Math.random(), Math.random(), Math.random(), 1)
	}

	// Return a random position
	function rpos() {
		return vec3(random(250), random(250), 0)
	}

	// Create N random views
	this.rviews = function(n) {
		// Create dynamic squares (location and color)
		var dynviews = []
		var pos = rpos()
		for (var i = 0; i < n; i++) {
			pos = rpos()
			var v = button({
				x: pos[0],
				y: pos[1],
				w: 200,
				h: 200,
				title: 'asdf',
				icon: 'apple',
				Background: {
					color: 'red'
				},
				position: 'absolute'
			})
			dynviews.push(v)
		}
		return dynviews
	}

	// When the pointer taps, change the location of each view
	this.updatePositions = function(event){
		// Rewrite the positions of the views
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].pos = rpos()
			// TODO(aki): layout should do automatically
			this.children[i].doLayout()
		}
	}

	this.render = function(){
		return screen(
			{name: 'default', clearcolor: [0.7,0.7,0.7,1]},
			view({
				Background:{
					visible:true,
					color:vec4('tomato'),
					cornerradius: vec4(20, 0, 0, 0),
					bordercolor: [0.5, 0.5, 0, 1],
					borderwidth: vec4(10, 30, 5, 20),
					shadowradius: 130,
					shadowoffset: [0, 170],
					shadowcolor: [0, 0, 0, 1],
					shadowalpha: 1.0
				},
				x: 100.5,
				y: 100.5,
				w: 150,
				h: 150,
				pointertap: this.updatePositions
			})

		)
	}
})
