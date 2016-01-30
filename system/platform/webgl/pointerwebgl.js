/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$system/base/pointer', function (require, exports){

	this.tapspeed = 150
	this.tapdist = 5

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

		var getMousePointerData = function (event) {
			return [{
				x: event.pageX,
				y: event.pageY,
				movementx: event.movementX,
				movementy: event.movementY,
				button: event.button === 0 ? 1 : event.button === 1 ? 3 : 2,
				shift: event.shiftKey,
				alt: event.altKey,
				ctrl: event.ctrlKey,
				meta: event.metaKey,
				// TODO(aki): test on Firefox and implement polyfils if necessary.
				wheelx: event.deltaX,
				wheely: event.deltaY,
				touch: false,
				event: event
			}]
		}

		var getTouchPointerData = function (event) {
			var array = []
			// TOD(aki): make multitouch
			for (var i = 0; i < event.changedTouches.length; i++) {
				array.push({
					// TODO: verify movement
					x: event.changedTouches[i].pageX,
					y: event.changedTouches[i].pageY,
					movementx: event.changedTouches[i].movementX,
					movementy: event.changedTouches[i].movementY,
					button: 1,
					shift: event.shiftKey,
					alt: event.altKey,
					ctrl: event.ctrlKey,
					meta: event.metaKey,
					touch: true,
					event: event
				})
			}
			return array
		}

		// Internal: emits `start` event.
		// Sets `pointer.view` by screen picking witht the first pointer.
		this.setstart = function(pointerlist) {
			var pointers = []
			for (var i = 0; i < pointerlist.length; i++) {
				pointers.push(this.calcPointer(pointerlist[i]))
			}
			this.device.pickScreen(pointers[0].position, true).then(function(view){
				// TODO(aki): Handle views better with multi-touch
				this.view = view
				if (view) {
					this.start = pointers
					if(!('ontouchstart' in window)){
						this.device.keyboard.pointerMove(pointers[0].position)
						if (device.keyboard) device.keyboard.checkSpecialKeys(pointerlist[0].event)
					}
				}
			}.bind(this))
		}

		// Internal: emits `move` event.
		this.setmove = function(pointerlist) {
			if (this.view) {
				var pointers = []
				for (var i = 0; i < pointerlist.length; i++) {
					pointers.push(this.calcPointer(pointerlist[i], this._start[i]))
				}
				this.move = pointers
				// lets move our textarea only if right mouse is down
				if (pointerlist[0].button == 2){
					if(!('ontouchstart' in window)){
						this.device.keyboard.pointerMove(pointerlist[0].position)
					}
				}
			}
		}

		// Internal: emits `end` event.
		// Emits `tap` event if conditions are met.
		this.setend = function(pointerlist) {
			if (this.view) {
				var pointers = []
				var taps = []
				for (var i = 0; i < pointerlist.length; i++) {
					var pointer = this.calcPointer(pointerlist[i], this._start[i])
					pointers.push(pointer)
					if (pointer.dt < this.tapspeed &&
						abs(pointer.delta[0]) < this.tapdist &&
						abs(pointer.delta[1]) < this.tapdist){
							taps.push(pointer)
					}
				}
				this.device.pickScreen(pointers[0].position, true).then(function(view){
					pointers[0].isover = this.view === view
					// TODO(aki): figure out how to do this immediately
					this.end = pointers
					if (taps.length > 0) {
						this.tap = taps
					}
					if(!('ontouchstart' in window)){
						this.device.keyboard.pointerMove(pointers[0].position)
						if (device.keyboard) device.keyboard.checkSpecialKeys(pointerlist[0].event)
					}
				}.bind(this))
			}
		}

		// Internal: emits `hover` event.
		// Emits `over` and `out` events if conditions are met.
		// Sets `pointer.view` by screen picking witht the first pointer.
		this.sethover = function(pointerlist) {
			var pointers = []
			for (var i = 0; i < pointerlist.length; i++) {
				pointers.push(this.calcPointer(pointerlist[i]))
			}
			this.device.pickScreen(pointers[0].position).then(function(view){
				if (this.view !== view) {
					if (this.view) this.out = pointers
					this.view = view
					if (view) this.over = pointers
				}
				if (this.view) {
					this.hover = pointers
				}
			}.bind(this))
		}

		// Internal: emits `out` event.
		// This is only used by touchend event to clear "over" states.
		// Resets `pointer.view`.
		this.setout = function(pointerlist) {
			var pointers = []
			for (var i = 0; i < pointerlist.length; i++) {
				pointers.push(this.calcPointer(pointerlist[i]))
			}
			if (this.view) {
				this._over = undefined
				this.out = pointers
			}
		}

		// Internal: emits `wheel` event.
		this.setwheel = function(pointerlist) {
			var pointers = []
			for (var i = 0; i < pointerlist.length; i++) {
				pointers.push(this.calcPointer(pointerlist[i]))
			}
			if (this.view) {
				this.wheel = this.calcPointer(pointers)
			}
		}

		// Internal: handler for `mousedown` event starts `mousemove` listening.
		this.mousedown = function(e){
			e.preventDefault()
			this.setstart(getMousePointerData(e))
			window.addEventListener('mousemove', this._mousemove)
			window.addEventListener('mouseup', this._mouseup)
			window.removeEventListener('mousemove', this._mousehover)
		}

		window.addEventListener('mousedown', this.mousedown.bind(this))

		// Internal: handler for `mousemove` event.
		this.mousemove = function(e){
			e.preventDefault()
			this.setmove(getMousePointerData(e))
		}
		this._mousemove = this.mousemove.bind(this)

		// Internal: handler for `mousedown` event stops `mousemove` listening.
		this.mouseup = function(e){
			e.preventDefault()
			this.setend(getMousePointerData(e))
			window.removeEventListener('mousemove', this._mousemove)
			window.removeEventListener('mouseup', this._mouseup)
			window.addEventListener('mousemove', this._mousehover)
		}
		this._mouseup = this.mouseup.bind(this)

		// Internal: handler for `mousemove` for the purpose of hover tracking.
		this.mousehover = function(e){
			e.preventDefault()
			this.sethover(getMousePointerData(e))
		}
		this._mousehover = this.mousehover.bind(this)
		window.addEventListener('mousemove', this._mousehover)

		// Internal: handler for `touchstart` event.
		this.touchstart = function(e){
			e.preventDefault()
			this.setstart(getTouchPointerData(e))
			this.sethover(getTouchPointerData(e))
		}
		window.addEventListener('touchstart', this.touchstart.bind(this))

		// Internal: handler for `touchmove` event.
		this.touchmove = function(e){
			e.preventDefault()
			this.setmove(getTouchPointerData(e))
		}
		window.addEventListener('touchmove', this.touchmove.bind(this))

		// Internal: handler for `touchend` event.
		this.touchend = function(e){
			this.setend(getTouchPointerData(e))
			this.setout(getTouchPointerData(e))
		}
		window.addEventListener('touchend', this.touchend.bind(this))
		// TODO(aki): make sure that binding to leave/cancel doesent break UX.
		window.addEventListener('touchcancel', this.touchend.bind(this))
		window.addEventListener('touchleave', this.touchend.bind(this))

		// Internal: handler for `wheel` event. Sets the wheel or zoom attribute/event.
		this.wheelmove = function(e){
			e.preventDefault()
			this.setwheel(getMousePointerData(e))
		}
		document.addEventListener('wheel', this.wheelmove.bind(this))
	}

})
