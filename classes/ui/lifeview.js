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
		this.usefloat = true
		// Turn on double-buffering since we want to feed pass0 back into itself
		this.doublebuffer = true
		// define the color to return in this pass

		this.isAlive = function(pos) {
			return this.pass0.pixel(pos).r >= 0.7
		}

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

			// if this is the first time, read from the framebuffer instead of from our last pass
			if (this.drawcount == 1.) {
				return this.framebuffer.pixel(vec2(x,y))
				// or start out with noise
				return vec4(noise.cheapnoise(mesh.xy))
			}

			// count number of neighbors
			var neighbors = 0
			if (this.isAlive(vec2(x - 1, y - 1))) neighbors++
			if (this.isAlive(vec2(x - 1, y))) neighbors++
			if (this.isAlive(vec2(x - 1, y + 1))) neighbors++
			if (this.isAlive(vec2(x, y - 1))) neighbors++
			if (this.isAlive(vec2(x, y + 1))) neighbors++
			if (this.isAlive(vec2(x + 1, y - 1))) neighbors++
			if (this.isAlive(vec2(x + 1, y))) neighbors++
			if (this.isAlive(vec2(x + 1, y + 1))) neighbors++

			// are we alive?
			var color = this.pass0.pixel2(x, y)
			if (color.r >= 0.7) {
				color = 'white'
				// Any live cell with two or three live neighbours lives on to the next generation.
				if (neighbors < 2) {
					// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
					color = vec4(.59,0,1.,1.)
				} else if (neighbors > 3) {
					// Any live cell with more than three live neighbours dies, as if by over-population.
					color = vec4(.59,0,1.,1.)
				}
			} else {
				if (neighbors == 3) {
					// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
					color = 'white'
				}
			}

			// fade colors over time
			if (color.g > .001) {
				color.g -= .004;
			}
			if (color.b > .001) {
				color.b -= .002;
			}
			if (color.r > .001 && color.r < .7) {
				color.r -= .002;
			}

			return color
		}
	})
})
