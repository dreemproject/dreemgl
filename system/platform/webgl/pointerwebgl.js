/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

// Pointerwebgl adds mouse and touch listeners and connectes them pointer.js API.

define.class('$system/base/pointer', function (require, exports){

	this._cursor = 'arrow'
	this._tooltip = 'Application'

	Object.defineProperty(this, 'cursor', {
		get:function(){
			return this._cursor
		},
		set:function(value){
			this._cursor = value
			if (value === 'arrow') value = 'default'
			this.device.keyboard.textarea.style.cursor =
			document.body.style.cursor = value
		}
	})

	this.atConstructor = function(device){

		this.device = device

		// Internal: creates pointer array with a single pointer from mouse event data.
		var mouseToPointers = function (event) {
			return [{
				position: vec2(event.pageX, event.pageY),
				movement: vec2(event.movementX, event.movementY),
				button: event.button === 0 ? 1 : event.button === 1 ? 3 : 2,
				shift: event.shiftKey,
				alt: event.altKey,
				ctrl: event.ctrlKey,
				meta: event.metaKey,
				wheel: vec2(event.deltaX, event.deltaY),
				touch: false
			}]
		}.bind(this)

		// Internal: creates pointer array from touch event.
		var touchToPointers = function (event) {
			var array = []
			for (var i = 0; i < event.changedTouches.length; i++) {
				array.push({
					position: vec2(event.changedTouches[i].pageX, event.changedTouches[i].pageY),
					movement: vec2(event.changedTouches[i].movementX, event.changedTouches[i].movementY),
					button: 1,
					shift: event.shiftKey,
					alt: event.altKey,
					ctrl: event.ctrlKey,
					meta: event.metaKey,
					touch: true
				})
			}
			return array
		}.bind(this)

		// Internal: handler for `mousedown` event starts `mousemove` listening.
		this.mousedown = function(e){
			e.preventDefault()
			this.setstart(mouseToPointers(e))
			window.addEventListener('mousemove', this._mousemove)
			window.addEventListener('mouseup', this._mouseup)
			window.removeEventListener('mousemove', this._mousehover)
		}
		window.addEventListener('mousedown', this.mousedown.bind(this))

		// Internal: handler for `mousemove` event.
		this.mousemove = function(e){
			e.preventDefault()
			this.setmove(mouseToPointers(e))
		}
		this._mousemove = this.mousemove.bind(this)

		// Internal: handler for `mousedown` event stops `mousemove` listening.
		this.mouseup = function(e){
			e.preventDefault()
			this.setend(mouseToPointers(e))
			window.removeEventListener('mousemove', this._mousemove)
			window.removeEventListener('mouseup', this._mouseup)
			window.addEventListener('mousemove', this._mousehover)
		}
		this._mouseup = this.mouseup.bind(this)

		// Internal: handler for `mousemove` for the purpose of hover tracking.
		this.mousehover = function(e){
			e.preventDefault()
			this.sethover(mouseToPointers(e))
		}
		this._mousehover = this.mousehover.bind(this)
		window.addEventListener('mousemove', this._mousehover)

		// Internal: handler for `touchstart` event.
		this.touchstart = function(e){
			e.preventDefault()
			this.setstart(touchToPointers(e))
		}
		window.addEventListener('touchstart', this.touchstart.bind(this))

		// Internal: handler for `touchmove` event.
		this.touchmove = function(e){
			e.preventDefault()
			this.setmove(touchToPointers(e))
		}
		window.addEventListener('touchmove', this.touchmove.bind(this))

		// Internal: handler for `touchend` event.
		this.touchend = function(e){
			this.setend(touchToPointers(e))
		}
		window.addEventListener('touchend', this.touchend.bind(this))
		window.addEventListener('touchcancel', this.touchend.bind(this))
		window.addEventListener('touchleave', this.touchend.bind(this))

		// Internal: handler for `wheel` event. Sets the wheel or zoom attribute/event.
		this.wheelmove = function(e){
			e.preventDefault()
			this.setwheel(mouseToPointers(e))
		}
		document.addEventListener('wheel', this.wheelmove.bind(this))
	}

})
