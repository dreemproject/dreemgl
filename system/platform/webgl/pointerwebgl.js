/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License") you may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// pointer class

define.class('$system/base/pointer', function (require, exports){

	this.ratio = 0

	this.activedown = 0

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
		if (this.ratio == 0) this.ratio = window.devicePixelRatio

		// TODO(aki): DEPRICATE (moved from mousewebgl.js)
		// allright we need to figure out how we send back the mouse events to the worker
		// are we going to send a vec2? or something else
		document.addEventListener('click', function(e){
			this.click = 1
		}.bind(this))
		document.addEventListener('blur', function(e){
			this.blurred = 1
		}.bind(this))
		document.addEventListener('dblclick', function(e){
			this.dblclick = 1
		}.bind(this))
		var click_count = 0
		this.resetClicker = function(){
			click_count = 0
		}

		// Sets the start attribute/event.
		this.setstart = function(touchList) {

			// TODO(aki): DEPRICATE (moved from mousewebgl.js)
			var e = touchList[0].e;
			this.activedown++;
			if(this.last_click !== undefined && e.t - this.last_click < this.clickspeed){
				click_count ++
			}
			else click_count = 1
			this.last_click = e.t
			this.clicker = click_count
			this.x = e.pageX
			this.y = e.pageY
			if(e.button === 0 ) this.cancapture = 1, this.left = 1, this.leftdown = 1
			if(e.button === 1 ) this.cancapture = 3, this.middle = 1
			if(e.button === 2 ) this.cancapture = 2, this.right = 1, this.rightdown = 1
			this.down = {
				x: e.pageX,
				y: e.pageY,
				button: e.button === 0 ? 1 : e.button === 1 ? 3 : 2,
				shift: e.shiftKey,
				alt: e.altKey,
				ctrl: e.ctrlKey,
				meta: e.metaKey
			}
			//

			// TODO(aki): consider moving to screen.
			this.device.keyboard.mouseMove(touchList[0].x, touchList[0].y)
			if (device.keyboard) device.keyboard.checkSpecialKeys(touchList[0].e)

			var pointers = []
			for (var i = 0; i < touchList.length; i++) {
				pointers.push({
					x: touchList[i].x,
					y: touchList[i].y,
					t: touchList[i].t,
					button: touchList[i].button,
					shift: touchList[i].shiftKey,
					alt: touchList[i].altKey,
					ctrl: touchList[i].ctrlKey,
					meta: touchList[i].metaKey
				})
			}
			this.start = pointers
		}

		// Sets the move attribute/event.
		this.setmove = function(touchList) {

			// TODO(aki): DEPRICATE (moved from mousewebgl.js)
			var e = touchList[0].e;
			this._pagex = e.pageX
			this._pagey = e.pageY
			this.x = e.pageX
			this.y = e.pageY
			this.move = {
				x: e.pageX,
				y: e.pageY,
				button: e.button === 0 ? 1 : e.button === 1 ? 3 : 2,
				shift: e.shiftKey,
				alt: e.altKey,
				ctrl: e.ctrlKey,
				meta: e.metaKey
			}
			//

			// TODO(aki): consider moving to screen.
			// TODO(aki): make sure this functions with touch (no buttons)
			// lets move our textarea only if right mouse is down
			if (touchList[0].button == 2){
				this.device.keyboard.mouseMove(touchList[0].x, touchList[0].y)
			}

			var pointers = []
			for (var i = 0; i < touchList.length; i++) {
				pointers.push({
					x: touchList[i].x,
					y: touchList[i].y,
					t: touchList[i].t,
					dx: touchList[i].x - this._start[i].x,
					dy: touchList[i].y - this._start[i].y,
					dt: touchList[i].t - this._start[i].t,
					button: touchList[i].button,
					shift: touchList[i].shiftKey,
					alt: touchList[i].altKey,
					ctrl: touchList[i].ctrlKey,
					meta: touchList[i].metaKey
				})
			}
			this.move = pointers
		}

		// Sets the end attribute/event. Also sets tap attribute/event if conditions are met.
		this.setend = function(touchList) {

			// TODO(aki): DEPRICATE (moved from mousewebgl.js)
			var e = touchList[0].e;
			this.activedown--;
			this.x = e.pageX
			this.y = e.pageY
			this.cancapture = 0
			if (e.button === 0) this.left = 0, this.leftup = 1
			if (e.button === 1) this.middle = 0
			if (e.button === 2) this.right = 0, this.rightup = 1
			this.up = {
				x:e.pageX,
				y:e.pageY,
				button: e.button === 0?1:e.button === 1?3:2,
				shift: e.shiftKey,
				alt: e.altKey,
				ctrl: e.ctrlKey,
				meta: e.metaKey
			}
			//

			// TODO(aki): consider moving to screen.
			this.device.keyboard.mouseMove(touchList[0].x, touchList[0].y)
			if (device.keyboard) device.keyboard.checkSpecialKeys(touchList[0].e)

			var pointers = []
			var taps = []
			for (var i = 0; i < touchList.length; i++) {
				var pointer = {
					x: touchList[i].x,
					y: touchList[i].y,
					t: touchList[i].t,
					dx: touchList[i].x - this._start[i].x,
					dy: touchList[i].y - this._start[i].y,
					dt: touchList[i].t - this._start[i].t,
					button: touchList[i].button,
					shift: touchList[i].shiftKey,
					alt: touchList[i].altKey,
					ctrl: touchList[i].ctrlKey,
					meta: touchList[i].metaKey
				}
				pointers.push(pointer)
				if (pointer.dt < this.tapspeed &&
					abs(pointer.dx) < this.tapdist &&
					abs(pointer.dy) < this.tapdist){
						taps.push(pointer)
				}
			}
			this.end = pointers
			if (taps.length > 0) {
				this.tap = taps;
			}
		}

		// Sets the hover attribute/event.
		this.sethover = function(touchList) {
			var pointers = []
			for (var i = 0; i < touchList.length; i++) {
				pointers.push({
					x: touchList[i].x,
					y: touchList[i].y,
					t: touchList[i].t,
					shift: touchList[i].shiftKey,
					alt: touchList[i].altKey,
					ctrl: touchList[i].ctrlKey,
					meta: touchList[i].metaKey
				})
			}
			this.hover = pointers
		}

		// Handler for `mousedown` event starts `mousemove` listening.
		this.mousedown = function(e){
			e.preventDefault()
			this.setstart([{
				x: e.pageX,
				y: e.pageY,
				t: Date.now(),
				button: e.button === 0 ? 1 : e.button === 1 ? 3 : 2,
				shift: e.shiftKey,
				alt: e.altKey,
				ctrl: e.ctrlKey,
				meta: e.metaKey,
				e: e
			}])
			window.addEventListener('mousemove', this._mousemove)
			window.addEventListener('mouseup', this._mouseup)
			window.removeEventListener('mousemove', this._mousehover)
		}

		window.addEventListener('mousedown', this.mousedown.bind(this))

		// Handler for `mousemove` event.
		this.mousemove = function(e){
			e.preventDefault()
			this.setmove([{
				x: e.pageX,
				y: e.pageY,
				t: Date.now(),
				button: e.button === 0 ? 1 : e.button === 1 ? 3 : 2,
				shift: e.shiftKey,
				alt: e.altKey,
				ctrl: e.ctrlKey,
				meta: e.metaKey,
				e: e
			}])
		}
		this._mousemove = this.mousemove.bind(this)

		// Handler for `mousedown` event stops `mousemove` listening.
		this.mouseup = function(e){
			e.preventDefault()
			this.setend([{
				x: e.pageX,
				y: e.pageY,
				t: Date.now(),
				button: e.button === 0 ? 1 : e.button === 1 ? 3 : 2,
				shift: e.shiftKey,
				alt: e.altKey,
				ctrl: e.ctrlKey,
				meta: e.metaKey,
				e: e
			}])
			window.removeEventListener('mousemove', this._mousemove)
			window.removeEventListener('mouseup', this._mouseup)
			window.addEventListener('mousemove', this._mousehover)
		}
		this._mouseup = this.mouseup.bind(this)

		// Handler for `mousemove` for the purpose of hover tracking.
		this.mousehover = function(e){
			e.preventDefault()
			this.sethover([{
				x: e.pageX,
				y: e.pageY,
				t: Date.now(),
				shift: e.shiftKey,
				alt: e.altKey,
				ctrl: e.ctrlKey,
				meta: e.metaKey,
				e: e
			}])
		}
		this._mousehover = this.mousehover.bind(this)
		window.addEventListener('mousemove', this._mousehover)

		// Handler for `touchstart` event.
		this.touchstart = function(e){
			e.preventDefault()
			// TODO(aki): currently uses single touch. Implement multi-touch!
			var pointers = [{
				x: e.touches[0].pageX,
				y: e.touches[0].pageY,
				t: Date.now(),
				e: e
			}]
			this.setstart(pointers)
		}
		window.addEventListener('touchstart', this.touchstart.bind(this))

		// Handler for `touchmove` event.
		this.touchmove = function(e){
			e.preventDefault()
			// TODO(aki): currently uses single touch. Implement multi-touch!
			var pointers = [{
				x: e.touches[0].pageX,
				y: e.touches[0].pageY,
				t: Date.now(),
				e: e
			}]
			this.setmove(pointers)
		}
		window.addEventListener('touchmove', this.touchmove.bind(this))

		// Handler for `touchend` event.
		this.touchend = function(e){
			e.preventDefault()
			// TODO(aki): currently uses single touch. Implement multi-touch!
			var pointers = [{
				x: e.changedTouches[0].pageX,
				y: e.changedTouches[0].pageY,
				t: Date.now(),
				e: e
			}]
			this.setend(pointers)
		}
		window.addEventListener('touchend', this.touchend.bind(this))
		// TODO(aki): make sure that binding to leave/cancel doesent break UX.
		window.addEventListener('touchcancel', this.touchend.bind(this))
		window.addEventListener('touchleave', this.touchend.bind(this))

		// Handler for `wheel` event. Sets the wheel or zoom attribute/event.
		this.wheelmove = function(e){
			// TODO(aki): test on Firefox and implement polyfils if necessary.
			e.preventDefault()
			if (e.ctrlKey || e.metaKey){
				this.zoom = e.wheelDelta / 120 // TODO(aki): DEPRICATE
			} else {
				// TODO(aki): DEPRICATE (moved from mouse.js)
				this.wheelx = e.deltaX
				this.wheely = e.deltaY
				//
				this.wheel = {
					x: e.deltaX,
					y: e.deltaY,
					e: e
				}
			}
		}
		document.addEventListener('wheel', this.wheelmove.bind(this))
	}

})
