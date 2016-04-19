/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

"use strict"

define.class('$ui/view', function(require){
// Example of how to use multiple render passes

	// k0 is the weight for the center pixel. k1 is used for +1 and -1 away,
	// k2 is used for +2 and -2 away, ...
	this.attributes = {
		k0: Config({type: float, value:1.0}),
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
		filterlength: Config({type: int, value:3}),
		filterscaling: Config({type: float, value:1.0}),

		blurradius: 2.
	}

	// Compute the kernel parameters given blurradius.
	// The value of sigma is .5 * blurradius
	// The filter length is 2*blurradius + 1 (in the range of 1 to 21)
	// For large blurradius, 21 filter parameters are computed.
	this.buildKernel = function() {
		var sigma = 0.5 * this.blurradius;

		var radius = Math.floor(this.blurradius);
		if (radius < 1) radius = 1;
		if (radius > 10) radius = 10;

		// Compute the kernel as an array. Compute one side only, but keep track
		// of the sum from both sides.
		var kernel = [];
    var scaling = 1.0 / (Math.sqrt(2 * Math.PI) * sigma);
		var sum = 0.0;
		for (var x=0; x<radius+1; x++) {
			var g = Math.exp(-x*x/(2 * sigma * sigma)) * scaling;
			sum += g;
			if (x > 0) sum += g;
			kernel.push(g);
		}

		// Normalize the kernel so that the terms sum to 1
		for (var i=0; i<kernel.length; i++) {
			kernel[i] = kernel[i] / sum;
		}

		//console.log('kernel', radius, kernel);

		// Set the k values (shaders don't support arrays)
		this.filterscaling = 1.0;
		this.filterlength = 2 * radius + 1;
		this.k0 = kernel[0];
		this.k1 = kernel[1];
		this.k2 = kernel[2];
		this.k3 = kernel[3];
		this.k4 = kernel[4];
		this.k5 = kernel[5];
		this.k6 = kernel[6];
		this.k7 = kernel[7];
		this.k8 = kernel[8];
		this.k9 = kernel[9];
		this.k10 = kernel[10];
	}


	this.atConstructor = function() {
		this.buildKernel();
	}

	// Rebuild the kernel when the blurradius changes
	this.onblurradius = function(ev,v,o) {
		this.buildKernel();
	}

	// Must define N RenderPass nested classes below to match this count
	this.passes = 2
	// Required for multipass to work
	this.overflow = 'hidden'


	// x or y shader filter for a 1D Gaussian
	define.class(this, "Gaussian1D", this.RenderPass, function() {
		// Shader requires all instance variables to be defined.
		this.spacing = vec2(1, 0)

		this.color = function() {
			var col = this.framebuffer.conv1d(mesh.xy, view.filterlength, view.filterscaling, this.spacing, view.k0, view.k1, view.k1, view.k2, view.k2, view.k3, view.k3, view.k4, view.k4, view.k5, view.k5, view.k6, view.k6, view.k7, view.k7, view.k8, view.k8, view.k9, view.k9, view.k10, view.k10)

			return vec4(col.rgb, col.a * view.opacity)
		}
	})


	// Each pass _must_ be named pass0..9, define based on this.passes, e.g. this.passes of
	// 1 must define pass0, 2 must define pass0 and pass1...
	define.class(this, "pass0", this.Gaussian1D, function() {
		this.atConstructor = function(view) {
			// horizontal filter
			this.spacing = vec2(1.0, 0)
		}
	})

	define.class(this, "pass1", this.Gaussian1D, function() {
		this.atConstructor = function(view) {
			// vertical filter
			this.spacing = vec2(0, 1.0)
		}

		// I can't seem to embed the logic of what pass to use in base class.
		this.color = function() {
			var col = this.pass0.conv1d(mesh.xy, view.filterlength, view.filterscaling, this.spacing, view.k0, view.k1, view.k1, view.k2, view.k2, view.k3, view.k3, view.k4, view.k4, view.k5, view.k5, view.k6, view.k6, view.k7, view.k7, view.k8, view.k8, view.k9, view.k9, view.k10, view.k10)

			return vec4(col.rgb, col.a * view.opacity)
		}

	})

})
