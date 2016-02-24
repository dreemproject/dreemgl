/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/label', function (require, $ui$, view, label) {

	this.text = ''
	this.bgcolor = vec4(1, 1, 1, 0.05)
	this.pickalpha = 0

	this.attributes = {
		data: Config({type: Array,  value: wire('this.parent.data')}),
		zoom: Config({type: Number, value: wire('this.parent.zoom')}),
		scroll: wire('this.parent.scroll'),
		hoverid: -1
	}

	this.pointermove = function(event) {
		var eventghost = this.find('eventghost')
		var timeline = this.parent
		eventghost.title = ''
		eventghost.start = timeline.getRangeStart() + timeline.getRange() * (event.min[0] / this.layout.width)
		eventghost.end = timeline.getRangeStart() + timeline.getRange() * (event.max[0] / this.layout.width)
		this.redraw()
	}

	this.pointerend = function(event) {
		var eventghost = this.find('eventghost')
		var timeline = this.parent
		if (abs(event.delta.x) > 2) {
			var eventdata = {
				title: 'New Event',
				date: eventghost.start,
				enddate: eventghost.end,
				metadata: {
					location: {
						name: 'New Location',
						lattitude: 0,
						longitute: 0
					}
				}
			}
			timeline.makeEvent(eventdata)
		}
		eventghost.start = 0
		eventghost.end = 0
	}

	this.onpointertap = function(event){
		this.hoverid = this.last_pick_id
		var eventData = this.data[this.hoverid]
	}

	this.ondata = function (data) {
		this.pickrange = this.data.length
	}

	define.class(this, 'event', view, function(){

		this.bgcolor = '#999999'
		this.position = 'absolute'
		this.flexdirection = 'row'
		this.cursor = 'move'

		var RESIZE_HANDLE_WIDTH = 10

		this.attributes = {
			title: '',
			id: null,
			zoom: Config({type: Number, value: wire('this.parent.zoom')}),
			scroll: wire('this.parent.scroll'),
			duration: 1,
			offset: 0,
			start: 0,
			end: 0
		}

		var editmode = ''

		var initPointer = function (event) {
			var localstart = this.globalToLocal(event.position)
			var localstartx = localstart[0] - this.offset * this.layout.width
			if (localstartx < RESIZE_HANDLE_WIDTH) {
				this.cursor = 'ew-resize'
				editmode = 'setstart'
			} else if (localstartx > this.duration * this.layout.width - RESIZE_HANDLE_WIDTH) {
				this.cursor = 'ew-resize'
				editmode = 'setend'
			} else {
				this.cursor = 'move'
				editmode = 'move'
			}
		}

		this.pointerhover = initPointer
		this.pointerstart = initPointer

		this.pointermove = function(event) {
			var eventghost = this.parent.find('eventghost')
			var timeline = this.parent.parent
			var offset = event.delta[0] / timeline.layout.width
			if (editmode == 'setstart') {
				eventghost.start = this.start + timeline.getRange() * offset
				eventghost.end = this.end
			} else if (editmode == 'move') {
				eventghost.start = this.start + timeline.getRange() * offset
				eventghost.end = this.end + timeline.getRange() * offset
			} else if (editmode == 'setend') {
				eventghost.start = this.start
				eventghost.end = this.end + timeline.getRange() * offset
			}
			this.redraw()
		}

		this.pointerend = function(event) {
			if (abs(event.delta[0]) < 2) return
			var eventghost = this.parent.find('eventghost')
			var timeline = this.parent.parent
			timeline.updateEvent(this.id, {
				date: eventghost.start,
				enddate: eventghost.end,
			})
			eventghost.start = 0
			eventghost.end = 0
		}

		this.layout = function(){
			this._layout.top = 0
			this._layout.width = this.parent._layout.width
			this._layout.height = this.parent._layout.height
		}

		this.atDraw = function () {
			this.offset = new Date(this.start).getTime() - this.parent.parent.getStart()
			this.duration = new Date(this.end).getTime() - new Date(this.start).getTime()
			this.offset = this.offset / this.parent.parent.TIME_SCALE / this.parent.zoom
			this.duration = this.duration / this.parent.parent.TIME_SCALE / this.parent.zoom

			this.find('eventlabel').xoffset = (this.offset - this.scroll[0]) * this.layout.width
			this.find('eventlabel').xwidth = this.duration * this.layout.width
		}

		this.hardrect = {
			position: function(){
				var pos = vec2(mesh.x * view.duration + view.offset - view.scroll[0], mesh.y)
				return vec4(pos.x * view.layout.width, pos.y * view.layout.height, 0, 1) * view.totalmatrix * view.viewmatrix
			}
		}

		define.class(this, 'eventlabel', label, function(){
			this.xoffset = 0
			this.xwidth = 0
			this.atDraw = function () {
				this.opacity = this.xwidth < this.layout.width ? 0 : 1
			}
			this.textpositionfn = function (pos, tag) {
				return vec3((pos.x + this.xoffset), pos.y, 0)
			}
		})

		this.render = function () {
			return [
				this.eventlabel({
					name: 'eventlabel',
					text: this.title
				})
			]
		}
	})

	this.renderEvents = function (data) {
		events = []
		for (var i = 0; i < data.length; i++) {
			events.push(this.event({
				title: data[i].title,
				id: data[i].id,
				bgcolor: vec4(0.75, 0.75, 0.75, 1),
				start: new Date(data[i].date).getTime(),
				end: new Date(data[i].enddate).getTime()
			}))
		}
		return events
	}

	this.render = function () {
		return [
			this.renderEvents(this.data),
			this.event({
				name: "eventghost",
				id: -1,
				bgcolor: '#4466FF',
				opacity: 0.5
			})
		]
	}

	// define.class(this, 'eventrects', this.Shader, function(){
	//
	// 	var vertstruct = define.struct({
	// 		pos: vec2,
	// 		uv: vec2,
	// 		id: float
	// 	})
	// 	this.mesh = vertstruct.array()
	//
	// 	this.update = function(){
	// 		var startTime = this.view.parent.getStart()
	// 		var view = this.view
	// 		var data = view.data
	// 		var mesh = this.mesh = vertstruct.array();
	// 		for (var i = 0; i < data.length; i++) {
	//
	// 			var date = new Date(data[i].date)
	// 			var enddate = new Date(data[i].enddate)
	//
	// 			var timeOffset = date.getTime() - startTime
	// 			var dayOffset = timeOffset / 1000 / 60 / 60 / 24
	// 			var dayWidth = (enddate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24
	//
	// 			var w = dayWidth
	// 			var h = 1
	// 			var x = dayOffset
	// 			var y = 0
	//
	// 			mesh.pushQuad(
	// 				x  , y  , 0, 0, i,
	// 				x+w, y  , 1, 0, i,
	// 				x  , y+h, 0, 1, i,
	// 				x+w, y+h, 1, 1, i
	// 			)
	// 		}
	// 	}
	//
	// 	this.position = function(){
	// 		var pos = mesh.pos
	// 		pos.x = pos.x - view.zoom * view.scroll[0]
	// 		pos = pos * vec2(view.layout.width / view.zoom, view.layout.height)
	// 		return vec4(pos, 0, 1) * view.totalmatrix * view.viewmatrix
	// 	}
	// 	this.color = function(){
	// 		PickGuid = mesh.id
	// 		if (view.hoverid == mesh.id){
	// 			return vec4(0.5, 0.75, 1, 1)
	// 		}
	// 		return vec4(0.75, 0.75, 0.75, 1)
	// 	}
	// })
	//
	// this.eventrects = true

})
