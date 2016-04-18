/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

"use strict"

define.class('$ui/view', function(require){
// an implementation of https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life

	// Must define N RenderPass nested classes below to match this count
	this.passes = 1

	// Each pass _must_ be named pass0..9, define based on this.passes, e.g. this.passes = 1
	// must define pass0, 2 must define pass0 and pass1...
	define.class(this, "pass0", this.RenderPass, function() {
		// set to true to use floating point textures on this pass
		this.usefloat = false
		// Turn on double-buffering since we want to feed pass0 back into itself
		this.doublebuffer = true
		// define the color to return in this pass
		this.color = function(){
			// this makes the shader redraw each frame, allowing loopback between the double
			// buffers in pass0
			var time = view.time

			// convert position floats to pixels
			var x = mesh.x * view.layout.width
			var y = mesh.y * view.layout.height

			// account for the pixel ratio
			x *= this.pass0.ratio
			y *= this.pass0.ratio

			// if this is the first time, read from the framebuffer
			if (this.drawcount == 1.) {
				// or use noise
				return vec4(noise.cheapnoise(mesh.xy) > .5)
				return this.framebuffer.pixel(vec2(x,y))
			}

			// count number of neighbors
			var neighbors = 0
			if (this.pass0.pixel(vec2(x - 1, y - 1)).r >= 0.5) neighbors++
			if (this.pass0.pixel(vec2(x - 1, y)).r >= 0.5) neighbors++
			if (this.pass0.pixel(vec2(x - 1, y + 1)).r >= 0.5) neighbors++
			if (this.pass0.pixel(vec2(x, y - 1)).r >= 0.5) neighbors++
			if (this.pass0.pixel(vec2(x, y + 1)).r >= 0.5) neighbors++
			if (this.pass0.pixel(vec2(x + 1, y - 1)).r >= 0.5) neighbors++
			if (this.pass0.pixel(vec2(x + 1, y)).r >= 0.5) neighbors++
			if (this.pass0.pixel(vec2(x + 1, y + 1)).r >= 0.5) neighbors++

			// are we alive?
			var alive = this.pass0.pixel(vec2(x,y))
			if (alive.r > 0.) {
				// Any live cell with two or three live neighbours lives on to the next generation.
				alive = 'white'
				if (neighbors < 2) {
					// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
					alive = 'black'
				} else if (neighbors > 3) {
					// Any live cell with more than three live neighbours dies, as if by over-population.
					alive = 'black'
				}
			} else {
				if (neighbors == 3) {
					// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
					alive = 'white'
				}
			}

			return vec4(alive.rgb, alive.a * view.opacity)
		}
	})
})
