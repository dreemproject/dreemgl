/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$blending/blend', function($blending$, mixer, blurv, blurh){

	this.hblend = define.class('$blending/blend', function(){
		// so we have one output, the size we can specify
		this.size = vec2(0.5, 0.5) // take on the size of the framebuffer
		// we can have multiple input that are named
		this.blendfn = function(){
			var v1 = input.sample(pos.xy)
		}
	})

	this.vblend = define.class('$blending/blend', function(){
		// so we have one output, the size we can specify
		this.size = vec2(0.5, 0.5) // take on the size of the framebuffer
		// we can have multiple input that are named
		this.blendfn = function(){
			var v1 = input.sample(pos.xy)
		}
	})

	this.blending = function(){
		return this.hblend({
			input:this.vblend({
			})
		})
	}
})
