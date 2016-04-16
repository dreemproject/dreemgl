/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

"use strict"

define.class('$ui/view', function(require){
// Example of how to use multiple render passes

	this.attributes = {
		blurradius: 2.
	}

	// Must define N RenderPass nested classes below to match this count
	this.passes = 1
	// Required for multipass to work
	this.overflow = 'hidden'

	// Each pass _must_ be named pass0..9, define based on this.passes, e.g. this.passes of
	// 1 must define pass0, 2 must define pass0 and pass1...
	define.class(this, "pass0", this.RenderPass, function(require) {
		this.color = function(){
			// x,y pixel spacing is used to average neighboring pixels
			var px = 1.0 / this.width
			var py = 1.0 / this.height
			var col = this.framebuffer.average(mesh.xy, px, py)

			return vec4(col.rgb, col.a * view.opacity)
		}
	})

})
