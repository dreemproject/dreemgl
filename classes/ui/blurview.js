/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

"use strict"

define.class('$ui/view', function(require){
// Example of how to use multiple render passes

	this.attributes = {

		//TODO
		k1: Config({type: float, value:1.0}),
		k2: Config({type: float, value:1.0}),
		k3: Config({type: float, value:1.0}),
		k4: Config({type: float, value:1.0}),
		k5: Config({type: float, value:1.0}),
		k6: Config({type: float, value:1.0}),
		k7: Config({type: float, value:1.0}),
		k8: Config({type: float, value:1.0}),
		k9: Config({type: float, value:1.0}),
		k10: Config({type: float, value:1.0}),
		k11: Config({type: float, value:1.0}),
		k12: Config({type: float, value:1.0}),
		k13: Config({type: float, value:1.0}),
		k14: Config({type: float, value:1.0}),
		k15: Config({type: float, value:1.0}),
		k16: Config({type: float, value:1.0}),
		k17: Config({type: float, value:1.0}),
		filterlength: Config({type: int, value:3}),
		filterscaling: Config({type: float, value:1.0}),

		blurradius: 2.
	}

	// Must define N RenderPass nested classes below to match this count
	this.passes = 8
	// Required for multipass to work
	this.overflow = 'hidden'


	// x or y filter for a 3x3 1 sigma Gaussian
	define.class(this, "ConvPass3", this.RenderPass, function() {
		this.k1 = 0.25
		this.k2 = 0.50
		this.k3 = 0.25
		this.scale = 1.0
		this.spacing = vec2(0.001, 0)

		this.color = function() {
			var col = this.framebuffer.conv1d3(mesh.xy, this.k1, this.k2, this.k3, this.scale, this.spacing)

			return vec4(col.rgb, col.a * view.opacity)
		}
	})


	// x or y filter for a 7x7 1 sigma Gaussian
	define.class(this, "ConvPass7", this.RenderPass, function() {
		this.k1 = 0.006
		this.k2 = 0.061
		this.k3 = 0.242
		this.k4 = 0.383
		this.k5 = 0.242
		this.k6 = 0.061
		this.k7 = 0.006
		this.scale = 1.0
		this.spacing = vec2(0.001, 0)

		this.color = function() {
			var col = this.framebuffer.conv1d7(mesh.xy, this.k1, this.k2, this.k3, this.k4, this.k5, this.k6, this.k7, this.scale, this.spacing)

			return vec4(col.rgb, col.a * view.opacity)
		}
	})


	// Each pass _must_ be named pass0..9, define based on this.passes, e.g. this.passes of
	// 1 must define pass0, 2 must define pass0 and pass1...
	define.class(this, "pass0", this.ConvPass7, function() {
		this.atConstructor = function(view) {
			// horizontal filter
			var width = view._layout.width ? view._layout.width : view.screen.size.x;
			this.spacing = vec2(1.0 / width, 0)
		}
	})

	define.class(this, "pass1", this.ConvPass7, function() {
		this.atConstructor = function(view) {
			// vertical filter
			var height = view._layout.height ? view._layout.height : view.screen.size.y;
			this.spacing = vec2(0, 1.0 / height)
		}
	})

	define.class(this, "pass2", this.pass0, function() {})
	define.class(this, "pass3", this.pass1, function() {})
	define.class(this, "pass4", this.pass0, function() {})
	define.class(this, "pass5", this.pass1, function() {})
	define.class(this, "pass6", this.pass0, function() {})
	define.class(this, "pass7", this.pass1, function() {})

})
