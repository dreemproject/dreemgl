/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License") you may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Mouse class

define.class('$system/base/pointer', function (require, exports){

	this.tapspeed = 150
	this.ratio = 0

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

		// Sets the start attribute/event.
		this.setstart = function(touchList) {
			var pointers = []
			for (var i = 0; i < touchList.length; i++) {
				pointers.push({
					x: touchList[i].x,
					y: touchList[i].y,
					dx: 0,
					dy: 0,
					t: touchList[i].t
				})
			}
			this.start = pointers
		}

		// Sets the move attribute/event.
		this.setmove = function(touchList) {
			var pointers = []
			for (var i = 0; i < touchList.length; i++) {
				pointers.push({
					x: touchList[i].x,
					y: touchList[i].y,
					dx: this._start[i].x - touchList[i].x,
					dy: this._start[i].y - touchList[i].y,
					t: touchList[i].t
				})
			}
			this.move = pointers
		}

		// Sets the end attribute/event. Also sets tap attribute/event if conditions are met.
		this.setend = function(touchList) {
			var pointers = []
			var taps = []
			for (var i = 0; i < touchList.length; i++) {
				pointers.push({
					x: touchList[i].x,
					y: touchList[i].y,
					dx: this._start[i].x - touchList[i].x,
					dy: this._start[i].y - touchList[i].y,
					t: touchList[i].t
				})
				// TODO(aki): also check minimal distance for taps.
				if (touchList[i].t - this._start[i].t < this.tapspeed){
					taps.push({
						x: touchList[i].x,
						y: touchList[i].y,
						t: touchList[i].t
					})
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
					dx: 0,
					dy: 0,
					t: touchList[i].t
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
				t: Date.now()
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
				t: Date.now()
			}])
		}
		this._mousemove = this.mousemove.bind(this)

		// Handler for `mousedown` event stops `mousemove` listening.
		this.mouseup = function(e){
			e.preventDefault()
			this.setend([{
				x: e.pageX,
				y: e.pageY,
				t: Date.now()
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
				t: Date.now()
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
				t: Date.now()
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
				t: Date.now()
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
				t: Date.now()
			}]
			this.setend(pointers)
		}
		window.addEventListener('touchend', this.touchend.bind(this))
		window.addEventListener('touchcancel', this.touchend.bind(this))
		window.addEventListener('touchleave', this.touchend.bind(this))

	}

})
