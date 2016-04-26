/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

"use strict"

define.class('$ui/view', function(require){
// Uses multiple render passes to tint the color of the view's contents

	this.attributes = {
		tintcolor: Config({type: vec4, value: vec4(1,1,1,1), meta:"color"})
	}

	// Must define N RenderPass nested classes below to match this count
	this.passes = 2
	// Required for multipass to work
	this.overflow = 'hidden'

	var tintview = this.constructor;
	this.constructor.examples = {
		Usage: function () {
			return [
				tintview({
					tintcolor:"blue",
					bgimagemode:"resize",
					bgimage:"$resources/textures/portrait.jpg"
				})
			]
		}
	}

	// Each pass _must_ be named pass0..9, define based on this.passes, e.g. this.passes = 1
	// must define pass0, 2 must define pass0 and pass1...
	define.class(this, "pass0", this.RenderPass, function() {
		this.color = function(){
			var col = this.framebuffer.sample(mesh.xy) * view.tintcolor
			return vec4(col.rgb, col.a * view.opacity)
		}
	})

	define.class(this, "pass1", this.RenderPass, function() {
		this.color = function(){
			var col = this.pass0.sample(mesh.xy * 2)
			return vec4(col.rgb, col.a * view.opacity)
		}
	})
})
