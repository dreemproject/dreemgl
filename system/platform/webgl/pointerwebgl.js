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
		this.mousedown = function(e){
			
			this.device.keyboard.checkSpecialKeys(e)

			e.preventDefault()
			this.setstart(mouseToPointers(e))
			window.addEventListener('mousemove', this._mousemove)
			window.addEventListener('mouseup', this._mouseup)
			window.addEventListener('contextmenu', this._mouseup)
			window.removeEventListener('mousemove', this._mousehover)
			window.removeEventListener('mousedown', this._mousedown)
			// Hack to capture mouse up outside iframe
			if (parent.window) parent.window.addEventListener('mouseup', this._mouseup)
			if (parent.window) parent.window.addEventListener('contextmenu', this._mouseup)
		}

		window.addEventListener('mousedown', this.mousedown.bind(this))

		// Internal: handler for `mousemove` event.
		this.mousemove = function(e){
			this.device.keyboard.checkSpecialKeys(e)
			e.preventDefault()
			this.setmove(mouseToPointers(e))
		}
		this._mousemove = this.mousemove.bind(this)

		// Internal: handler for `mousedown` event stops `mousemove` listening.
		this.mouseup = function(e){
			this.device.keyboard.textAreaRespondToMouse(e.pageX, e.pageY)
			this.device.keyboard.checkSpecialKeys(e)

			e.preventDefault()
			this.setend(mouseToPointers(e))
			window.removeEventListener('mousemove', this._mousemove)
			window.removeEventListener('mouseup', this._mouseup)
			window.removeEventListener('contextmenu', this._mouseup)
			window.addEventListener('mousemove', this._mousehover)
			window.addEventListener('mousedown', this._mousedown)
			// Hack to capture mouse up outside iframe
			if (parent.window) parent.window.removeEventListener('mouseup', this._mouseup)
			if (parent.window) parent.window.removeEventListener('contextmenu', this._mouseup)
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

		// scrollwheel fun
		// the different platforms
		var is_osx = navigator.userAgent.indexOf("Macintosh") > -1
		var is_windows = navigator.appVersion.indexOf("Win") > -1
		var is_gecko = 'MozAppearance' in document.documentElement.style
		var is_chrome = navigator.userAgent.indexOf('Chrome') > -1

		// Minimum non-zero wheel value
		// var wheelmin = vec2(1000, 1000)

		document.addEventListener('wheel', function(e){
			e.preventDefault()

			// Set wheel min non-zero value
			//wheelmin[0] = min(wheelmin[0], abs(event.deltaX || wheelmin[0]))
			//wheelmin[1] = min(wheelmin[1], abs(event.deltaY || wheelmin[1]))

			var dx = e.deltaX, dy = e.deltaY

			// line scroll
			if (e.deltaMode === 1){
				dx *= 12
				dy *= 12
			}
			// page scroll
			else if (e.deltaMode === 2){
				dx *= 800
				dy *= 800
			}

			dx /= 2
			dy /= 2

			if (is_osx){

			}
			else if (is_windows){
				dx /= 8;
				dy /= 8;
			}

			this.setwheel(mouseToPointers(e, dx, dy))
		}.bind(this))
	}

})
