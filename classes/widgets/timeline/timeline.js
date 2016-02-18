/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function (background, labels, events, scrollbar) {

	this.flexdirection = 'column'
	this.padding = vec4(0, 56, 0, 18)
	this.bgcolor = NaN

	this.MIN_ZOOM = 0.25
	this.TIME_SCALE = 86400000 // millis to days

	this.attributes = {
		format:  Config({type: Enum('12','24'),  value: "12"}),

		start:   Config({type: String,  value: "Jan 1 2016"}),
		end:     Config({type: String,  value: "Dec 31 2016"}),

		data:    Config({type: Array,  value: []}),

		zoom: Config({type: Number, value: 0.5}),
		scroll: Config({type: Number, value: 0}),

		monthwidth: Config({type: Number, value: 0}),
		daywidth: Config({type: Number, value: 0}),
		hourwidth: Config({type: Number, value: 0}),
		hoursegs: Config({type: Number, value: 24}),

		eventselected: Config({type:Event})
	}

	this.atDraw = function () {
		this.background = this.find("background")
		this.labels = this.find("labels")
		this.hscrollbar = this.find("scrollbar")
		this.hscrollbar.updateScrollbars()

		this.monthwidth = this.layout.width * 30 / this.zoom
		this.daywidth = this.layout.width / this.zoom
		this.hourwidth = this.layout.width / 24 / this.zoom

		this.hoursegs = 1
		if (this.hourwidth < 9) {
			this.hoursegs = 1
		} else if (this.hourwidth < 22) {
			this.hoursegs = 4
		} else if (this.hourwidth < 44) {
			this.hoursegs = 8
		} else if (this.hourwidth < 88) {
			this.hoursegs = 12
		} else {
			this.hoursegs = 24
		}
		// TODO(aki): better data-binding that doesent trigger render
		// This should be handled by data binding
		this.background.monthwidth = this._monthwidth
		this.background.daywidth = this._daywidth
		this.background.hourwidth = this._hourwidth
		this.background.hoursegs = this._hoursegs
		this.labels.monthwidth = this._monthwidth
		this.labels.daywidth = this._daywidth
		this.labels.hourwidth = this._hourwidth
		this.labels.hoursegs = this._hoursegs

	}

	this.getStart = function () {
		return new Date(this.start).getTime()// / this.TIME_SCALE
	}
	this.getEnd = function () {
		return new Date(this.end).getTime()// / this.TIME_SCALE
	}
	this.getRange = function () {
		return this.getEnd() - this.getStart()
	}
	this.getOffset = function () {
		return this.zoom * this.scroll
	}

	this.pointermultimove = function(event) {
		if (event.length === 1 && event[0].view === this.background) {
			if (event[0].touch) {
				this.scroll = clamp(this._scroll - event[0].movement[0] / this.layout.width, 0, this.hscrollbar._total - this.hscrollbar._page)
			}
		} else if (event.length === 2 && event[0].view === this.background) {
			var lastzoom = this._zoom

			var center = vec2.mix(event[0].position, event[1].position, 0.5)
			var movement = vec2.mix(event[0].movement, event[1].movement, 0.5)
			var distance = abs(event[0].position[0] - event[1].position[0])
			var oldDistance = abs((event[0].position[0] - event[0].movement[0]) - (event[1].position[0] - event[1].movement[0]))

			// TODO(aki): delta doesent feel right
			var delta = (distance - oldDistance) / this.layout.width * this.zoom * 2
			var newzoom = clamp(this.zoom - delta, this.MIN_ZOOM, this.getRange() / this.TIME_SCALE)

			this.zoom = newzoom

			var xpos0 = this._scroll * lastzoom + this.globalToLocal(center)[0] / this.layout.width * lastzoom
			var xpos1 = this._scroll * newzoom + this.globalToLocal(center)[0] / this.layout.width * newzoom
			var shiftx = (xpos0 - xpos1) / newzoom

			this.scroll = clamp(this._scroll + shiftx - movement[0] / this.layout.width, 0, this.hscrollbar._total - this.hscrollbar._page)
		}
	}
	this.pointerwheel = function(event) {
		this.hscrollbar = this.find("scrollbar")
		if (event.value[0] && abs(event.value[0]) > abs(event.value[1])){
			this.scroll = clamp(this._scroll + event.value[0]*10.0 / this.layout.width, 0, this.hscrollbar._total - this.hscrollbar._page)
		}
		if (event.value[1] && abs(event.value[1]) > abs(event.value[0])){
			var lastzoom = this._zoom

			var delta = event.value[1] / this.layout.width * this.zoom
			var newzoom = clamp(this.zoom + delta, this.MIN_ZOOM, this.getRange() / this.TIME_SCALE)

			this.zoom = newzoom

			var xpos0 = this._scroll * lastzoom + this.globalToLocal(event.position)[0] / this.layout.width * lastzoom
			var xpos1 = this._scroll * newzoom + this.globalToLocal(event.position)[0] / this.layout.width * newzoom
			var shiftx = (xpos0 - xpos1) / newzoom

			this.scroll = clamp(this._scroll + shiftx, 0, this.hscrollbar._total - this.hscrollbar._page)
		}
	}

	this.render = function() {
		return [
			background({name: "background"}),
			labels({name: "labels"}),
			events({name: "events"}),
			scrollbar({name: "scrollbar"})
		]
	}

})
