/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

// Pointerwebgl adds mouse and touch listeners and connectes them pointer.js API.

define.class('$system/base/pointer', function (require, exports) {

	this._cursor = 'arrow'
	this._tooltip = 'Application'

	Object.defineProperty(this, 'cursor', {
		configurable:true,
		get:function() {
			return this._cursor
		},
		set:function(value) {
			this._cursor = value
			if (value === 'arrow') value = 'default'

			this.device.keyboard.textarea.style.cursor =
			document.body.style.cursor = value
		}
	})

	this.atConstructor = function(device) {
		this.device = device
		var window = this.device.window
		// Internal: creates pointer array with a single pointer from mouse event data.
		var mouseToPointers = function (event, wheelx, wheely) {
			return [{
				value: vec2(event.pageX, event.pageY),
				position: vec2(event.pageX, event.pageY),
				button: event.button === 0 ? 1 : event.button === 1 ? 3 : 2,
				shift: event.shiftKey,
				alt: event.altKey,
				ctrl: event.ctrlKey,
				meta: event.metaKey,
				wheel: vec2(wheelx, wheely),
				touch: false
			}]
		}.bind(this)

		// Internal: creates pointer array from touch event.
		var touchToPointers = function (event) {
			var array = []
			for (var i = 0; i < event.changedTouches.length; i++) {
				array.push({
					value: vec2(event.changedTouches[i].pageX, event.changedTouches[i].pageY),
					position: vec2(event.changedTouches[i].pageX, event.changedTouches[i].pageY),
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
		this.mousedown = function(e) {

			this.device.keyboard.checkSpecialKeys(e)

			e.preventDefault()
			this.setstart(mouseToPointers(e))
			window.removeEventListener('mousemove', this._mousehover)
			window.removeEventListener('mousedown', this._mousedown)
			window.addEventListener('mousemove', this._mousemove)
			window.addEventListener('mouseup', this._mouseup)
			window.addEventListener('contextmenu', this._mouseup)
			// Hack to capture mouse up outside iframe
			if(typeof parent !== 'undefined'){
				if (parent.window) parent.window.addEventListener('mouseup', this._mouseup)
				if (parent.window) parent.window.addEventListener('contextmenu', this._mouseup)
			}
		}
		this._mousedown = this.mousedown.bind(this)

		window.addEventListener('mousedown', this._mousedown)

		// Internal: handler for `mousemove` event.
		this.mousemove = function(e) {
			this.device.keyboard.checkSpecialKeys(e)
			e.preventDefault()
			this.setmove(mouseToPointers(e))
		}
		this._mousemove = this.mousemove.bind(this)

		// Internal: handler for `mousedown` event stops `mousemove` listening.
		this.mouseup = function(e) {

			//console.log(e.button)
			if(e.button === 2) this.device.keyboard.textAreaRespondToMouse(e.pageX, e.pageY)
			//this.device.keyboard.checkSpecialKeys(e)
			e.preventDefault()
			this.setend(mouseToPointers(e))

			window.removeEventListener('mousemove', this._mousemove)
			window.removeEventListener('mouseup', this._mouseup)
			window.removeEventListener('contextmenu', this._mouseup)
			window.addEventListener('mousemove', this._mousehover)
			window.addEventListener('mousedown', this._mousedown)
			// Hack to capture mouse up outside iframe
			if(typeof parent !== 'undefined'){
				if (parent.window) parent.window.removeEventListener('mouseup', this._mouseup)
				if (parent.window) parent.window.removeEventListener('contextmenu', this._mouseup)
			}
		}
		this._mouseup = this.mouseup.bind(this)

		// Internal: handler for `mousemove` for the purpose of hover tracking.
		this.mousehover = function(e) {
			e.preventDefault()
			this.sethover(mouseToPointers(e))
		}
		this._mousehover = this.mousehover.bind(this)
		window.addEventListener('mousemove', this._mousehover)

		// Internal: handler for `touchstart` event.
		this.touchstart = function(e) {
			e.preventDefault()
			this.setstart(touchToPointers(e))
		}
		window.addEventListener('touchstart', this.touchstart.bind(this))

		// Internal: handler for `touchmove` event.
		this.touchmove = function(e) {
			e.preventDefault()
			this.setmove(touchToPointers(e))
		}
		window.addEventListener('touchmove', this.touchmove.bind(this))

		// Internal: handler for `touchend` event.
		this.touchend = function(e) {
			this.setend(touchToPointers(e))
		}
		window.addEventListener('touchend', this.touchend.bind(this))
		window.addEventListener('touchcancel', this.touchend.bind(this))
		window.addEventListener('touchleave', this.touchend.bind(this))

		// scrollwheel fun
		// the different platforms
		//var is_osx = navigator.userAgent.indexOf("Macintosh") > -1
		var is_windows = typeof navigator !== 'undefined' && navigator.appVersion.indexOf("Win") > -1
		//var is_gecko = 'MozAppearance' in document.documentElement.style
		//var is_chrome = navigator.userAgent.indexOf('Chrome') > -1

		window.addEventListener('wheel', function(e) {
			e.preventDefault()

			var d = vec2(e.deltaX, e.deltaY)

			// line scroll
			if (e.deltaMode === 1) {
				vec2.mul_float32(d, 6, d)
			}

			// page scroll
			else if (e.deltaMode === 2) {
				vec2.mul_float32(d, 400, d)
			}

			else if (is_windows) {
				vec2.mul_float32(d, 0.125, d)
			}

			this.setwheel(mouseToPointers(e, d[0], d[1]))
		}.bind(this))
	}

})
