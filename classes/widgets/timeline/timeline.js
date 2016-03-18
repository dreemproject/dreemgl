/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function (background, labels, events, scrollbar) {

	this.flexdirection = 'column'
	this.padding = vec4(0, 48, 0, 15)
	this.bgcolor = NaN
	// TODO(aki): hide overflow

	this.MIN_ZOOM = 0.125
	this.TIME_SCALE = 86400000 // millis to days

	this.attributes = {
		format:     Config({type: Enum('12','24'),  value: "12"}),
		start:      Config({type: String,  value: "Jan 1 2016"}),
		end:        Config({type: String,  value: "Dec 31 2016"}),
		data:       Config({type: Array, value: []}),
		hoursegs:   Config({type: Number, value: 24}),
		segments:   Config({type: vec3, value: vec3()}),
		lockscroll: Config({type: Boolean, value: false}),
		autoexpand: Config({type: Boolean, value: false}),
		change: Config({type: Event})
	}

	this.onzoom = function () {
		if (this._zoom > this.getDuration() / this.TIME_SCALE) {
			this.zoom = this.getDuration() / this.TIME_SCALE
		}
	}

	this.dropEvent = function (eventdata, pointer) {
		var pos = this.globalToLocal(pointer.position).x / this.layout.width
		var stardate = this.getRangeStart() + this.getRange() * pos
		var snap = eventdata.snap || 900000 // snap to 15 min by default
		stardate = floor(stardate / snap) * snap
		var enddate = stardate + (eventdata.duration || 10800000) // 3 hrs default
		this.makeEvent({
			title: eventdata.title,
			date: stardate,
			enddate: enddate,
			metadata: {
				color: eventdata.color,
				location: {
					title: eventdata.title,
					lattitude: eventdata.lattitude,
					longitude: eventdata.longitude
				}
			}
		})
	}

	this.makeEvent = function (eventdata) {
		eventdata.id = eventdata.id || this.data.length + 1
		this.data.push(eventdata)
		this.data = this.data
		this.emitUpward('change', {
			data: this.data,
			start: this.start,
			end: this.end,
			zoom: this.zoom,
			scroll: this.scroll
		})
	}

	this.updateEvent = function (id, eventdata) {
		for (var i = 0; i < this.data.length; i++) {
			if (this.data[i].id === id) {
				for (key in eventdata) {
					this.data[i][key] = eventdata[key]
				}
				this.data = this.data
				this.emitUpward('change', {
					data: this.data,
					start: this.start,
					end: this.end,
					zoom: this.zoom,
					scroll: this.scroll
				})
				break
			}
		}
	}

	this.deleteEvent = function (id) {
		for (var i = 0; i < this.data.length; i++) {
			if (this.data[i].id === id) {
				this.data.splice(i, 1)
				this.data = this.data
				this.emitUpward('change', {
					data: this.data,
					start: this.start,
					end: this.end,
					zoom: this.zoom,
					scroll: this.scroll
				})
				break
			}
		}
	}

	this.ondata = function () {
		var eventstart, eventend
		var starttime = this.getStart()
		var oldstarttime = this.getStart()
		var endtime = this.getEnd()
		if (!this.data) return
		for (var i = 0; i < this.data.length; i++) {
			eventstart = new Date(this.data[i].date)
			eventend = new Date(this.data[i].enddate)
			if (eventend > endtime) endtime = eventend
			if (eventstart < starttime) starttime = eventstart
		}
		this.start = new Date(starttime).toString()
		this.end = new Date(endtime).toString()
		this.scroll = vec2(this.scroll[0] + (oldstarttime - this.getStart()) / this.zoom / this.TIME_SCALE, 0)
	}

	this.onscroll = function() {
		if (this.autoexpand) {

			var starttime = this.getStart()
			var oldstarttime = this.getStart()
			var endtime = this.getEnd()

			var scrollstart = new Date(this.getRangeStart() - this.getRange())
			var scrollend = new Date(this.getRangeEnd() + this.getRange())
			var expand = false

			if (scrollend > endtime) {
				endtime = scrollend
				expand = true
			}
			if (scrollstart < starttime) {
				starttime = scrollstart
				expand = true
			}
			if (expand) {
				window.clearTimeout(this.expandTimeout)
				this.expandTimeout = setTimeout(function() {
					this.start = new Date(starttime).toString()
					this.end = new Date(endtime).toString()
					this.scroll = vec2(this.scroll[0] + (oldstarttime - this.getStart()) / this.zoom / this.TIME_SCALE, 0)
				}.bind(this), 50)
			}

		}

		window.clearTimeout(this.emitChangeTimeout)
		this.emitChangeTimeout = setTimeout(function() {
			this.emitUpward('change', {
				data: this.data,
				start: this.start,
				end: this.end,
				zoom: this.zoom,
				scroll: this.scroll
			})
		}.bind(this), 100)

	}

	this.atDraw = function () {
		this.hscrollbar = this.find("scrollbar")
		if (this.hscrollbar){
			this.hscrollbar.updateScrollbars()
		}
		var daywidth = this._layout.width / this.zoom

		//TODO(aki): Don't use magic numbers!

		if (daywidth < 12) {
			this.segments = vec3(1, 2, 3) // y m w
		} else if (daywidth < 32) {
			this.segments = vec3(2, 3, 4) // m w d
		} else if (daywidth < 440) {
			this.segments = vec3(2, 4, 5) // m d h
		} else if (daywidth < 1040) {
			this.segments = vec3(4, 5, 6) // d h h
		} else {
			this.segments = vec3(4, 5, 6) // d h m
		}

		if (daywidth < 250) {
			this.hoursegs = 4
		} else if (daywidth < 440) {
			this.hoursegs = 8
		} else if (daywidth < 1040) {
			this.hoursegs = 8
		} else if (daywidth < 2100) {
			this.hoursegs = 12
		} else {
			this.hoursegs = 24
		}
	}

	this.getStart = function () {
		return new Date(this.start).getTime()
	}

	this.getEnd = function () {
		return new Date(this.end).getTime()
	}

	this.getDuration = function () {
		return this.getEnd() - this.getStart()
	}

	this.getRange = function () {
		return this.getRangeEnd() - this.getRangeStart()
	}

	this.getRangeStart = function () {
		return this.getStart() + this.zoom * this.scroll[0] * this.TIME_SCALE
	}

	this.getRangeEnd = function () {
		var rangefactor = this.zoom / (this.getDuration() / this.TIME_SCALE)
		return this.getRangeStart() + this.getDuration() * rangefactor
	}

	this.pointermultimove = function(event) {
		if (this.lockscroll) return
		this.hscrollbar = this.find("scrollbar")
		if (event.length === 1) {
			this.scroll = vec2(clamp(this._scroll[0] - event[0].movement[0] / this.layout.width, 0, this.hscrollbar._total - this.hscrollbar._page), 0)
		}
		else if (event.length === 2) {
			var lastzoom = this._zoom

			var center = vec2.mix(event[0].position, event[1].position, 0.5)
			var movement = vec2.mix(event[0].movement, event[1].movement, 0.5)
			var distance = abs(event[0].position[0] - event[1].position[0])
			var oldDistance = abs((event[0].position[0] - event[0].movement[0]) - (event[1].position[0] - event[1].movement[0]))

			// TODO(aki): delta doesent feel right
			var delta = (distance - oldDistance) / this.layout.width * this.zoom * 2
			var newzoom = clamp(this.zoom - delta, this.MIN_ZOOM, this.getDuration() / this.TIME_SCALE)

			this.zoom = newzoom

			var xpos0 = this._scroll[0] * lastzoom + this.globalToLocal(center)[0] / this.layout.width * lastzoom
			var xpos1 = this._scroll[0] * newzoom + this.globalToLocal(center)[0] / this.layout.width * newzoom
			var shiftx = (xpos0 - xpos1) / newzoom

			this.scroll = vec2(clamp(this._scroll[0] + shiftx - movement[0] / this.layout.width, 0, this.hscrollbar._total - this.hscrollbar._page), 0)
		}
	}

	this.pointerwheel = function(event) {
		if (this.lockscroll) return
		this.hscrollbar = this.find("scrollbar")
		if (!event.touch) {
			if (event.wheel[0] && abs(event.wheel[0]) > abs(event.wheel[1])){
				this.scroll = vec2(clamp(this._scroll[0] + event.wheel[0] / this.layout.width, 0, this.hscrollbar._total - this.hscrollbar._page), 0)
			}
			if (event.value[1] && abs(event.value[1]) > abs(event.value[0])){
				var lastzoom = this._zoom

				var delta = event.value[1] / this.layout.width * this.zoom
				var newzoom = clamp(this.zoom + delta, this.MIN_ZOOM, this.getDuration() / this.TIME_SCALE)

				this.zoom = newzoom

				var xpos0 = this.scroll[0] * lastzoom + this.globalToLocal(event.position)[0] / this.layout.width * lastzoom
				var xpos1 = this.scroll[0] * newzoom + this.globalToLocal(event.position)[0] / this.layout.width * newzoom
				var shiftx = (xpos0 - xpos1) / newzoom

				this.scroll = vec2(clamp(this.scroll[0] + shiftx, 0, this.hscrollbar._total - this.hscrollbar._page), 0)
			}
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
