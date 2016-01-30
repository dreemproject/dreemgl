/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$system/base/node', function(){
	this.atConstructor = function(){}

	// Pointer emits events that unify mouse and touch interactions.
	// Mouse interactions will always return an array of pointers of length == 1.
	this.attributes = {
		// fires when pointer is pressed down.
		start:Config({type:Event}),
		// fires when pointer is pressed and moved (dragged).
		move:Config({type:Event}),
		// fires when pointer is released.
		end:Config({type:Event}),
		// fires when pointer is pressed and released quickly.
		tap:Config({type:Event}),
		// fires when pointer moved without being pressed.
		hover:Config({type:Event}),
		// fires when pointer enters an element.
		over:Config({type:Event}),
		// fires when pointer leaves an element.
		out:Config({type:Event}),
		// fires when mouse wheel is used.
		wheel:Config({type:Event})
	}

	// Returns pointer object with calculated deltas, min and max
	var Pointer = function(event, refpointer) {
		this.position = vec2(event.x, event.y)
		this.movement = vec2(event.movementx, event.movementy)
		this.button = event.button
		this.shift = event.shift
		this.alt = event.alt
		this.ctrl = event.ctrl
		this.meta = event.meta
		this.t = Date.now()

		if (refpointer) {
			this.delta = vec2(this.position[0] - refpointer.position[0], this.position[1] - refpointer.position[1])
			this.min = vec2(min(this.position[0], refpointer.position[0]), min(this.position[1], refpointer.position[1]))
			this.max = vec2(max(this.position[0], refpointer.position[0]), max(this.position[1], refpointer.position[1]))
			this.dt = this.t - refpointer.t
		}
		if (event.wheelx !== undefined) this.wheelx = event.wheelx
		if (event.wheely !== undefined) this.wheely = event.wheely
	}

	// Internal API to access Pointer constructor.
	this.calcPointer = function (event, refpointer) {
		return new Pointer(event, refpointer)
	}

})
