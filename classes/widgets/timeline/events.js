/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/label', function (require, $ui$, view, label) {

	this.text = ''
	this.bgcolor = vec4(1, 1, 1, 0.01)
	this.pickalpha = 0
	this.height = 28

	this.attributes = {
		data: Config({type: Array,  value: wire('this.parent.data')}),
		zoom: wire('this.parent.zoom'),
		scroll: wire('this.parent.scroll'),
		rows: Config({type: Number, value: 1})
	}

	this.onrows = function () {
		this.height = this.rows * 28
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

	define.class(this, 'event', view, function(){

		this.bgcolor = '#999999'
		this.position = 'absolute'
		this.flexdirection = 'row'
		this.cursor = 'move'
		this.justifycontent = "center"
		this.borderradius = 6

		var RESIZE_HANDLE_WIDTH = 10

		this.attributes = {
			title: '',
			id: null,
			zoom: Config({type: Number, value: wire('this.parent.zoom')}),
			scroll: wire('this.parent.scroll'),
			duration: 1,
			offset: 0,
			start: 0,
			end: 0,
			row: 0
		}

		var editmode = ''

		this.pointerhover = this.pointerstart = function (event) {
			this.cursor = 'move'
			editmode = 'move'

			var localstart = this.globalToLocal(event.position)
			var localstartx = localstart[0] - (this.offset - this.scroll[0]) * event.view.layout.width
			var pxduration = this.duration * event.view.layout.width

			if (localstartx < min(RESIZE_HANDLE_WIDTH, pxduration / 2)) {
				this.cursor = 'ew-resize'
				editmode = 'setstart'
			} else if (pxduration - localstartx < min(RESIZE_HANDLE_WIDTH, pxduration / 2)) {
				this.cursor = 'ew-resize'
				editmode = 'setend'
			}
		}

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
			if (eventghost.start > eventghost.end) {
				var start = eventghost.start
				eventghost.start = eventghost.end
				eventghost.end = start
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

		this.pointertap = function(event) {
			if (event.clicker === 2) {
				var timeline = this.parent.parent
				timeline.deleteEvent(this.id)
			}
		}

		this.layout = function(){
			this._layout.width = this.parent._layout.width
			this._layout.height = this.parent._layout.height / this.parent.rows
			if (this.row === -1) {
				this._layout.top = 0
				this._layout.height = this.parent._layout.height
			} else {
				this._layout.top = this._layout.height * this.row
			}
		}

		this.atDraw = function () {
			this.duration = new Date(this.end).getTime() - new Date(this.start).getTime()
			this.duration = this.duration / this.parent.parent.TIME_SCALE / this.parent.zoom
			this.offset = new Date(this.start).getTime() - this.parent.parent.getStart()
			this.offset = this.offset / this.parent.parent.TIME_SCALE / this.parent.zoom
			this.find('eventlabel').xoffset = (this.offset - this.scroll[0]) * this.layout.width
			this.find('eventlabel').xwidth = this.duration * this.layout.width
		}

		this.roundedrect = {
			position: function(){
				pos = mesh.pos.xy
				pos.x = pos.x * view.duration + (view.offset - view.scroll[0]) * view.layout.width
				var ca = cos(mesh.angle + PI)
				var sa = sin(mesh.angle + PI)
				var rad  = (mesh.radmult.x * view.borderradius.x + mesh.radmult.y * view.borderradius.y + mesh.radmult.z * view.borderradius.z + mesh.radmult.w * view.borderradius.w)
				pos.x += ca * rad
				pos.y += sa * rad
				uv = vec2(pos.x / view.layout.width,  pos.y / view.layout.height)
				sized = vec2(pos.x, pos.y)
				return vec4(sized.x, sized.y, 0, 1) * view.totalmatrix * view.viewmatrix
			},
			color: function(){
				var col = view.bgcolorfn(vec2(pos.x / view.layout.width, pos.y/view.layout.height))
				return vec4(col.rgb, col.a * view.opacity)
			}
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
			this.fgcolor = "black"
			this.alignself = "center"
			this.padding = vec4(6)

			this.atDraw = function () {
				this.fontsize = 13
				this.bold = true
				this.opacity = this.xwidth < this.layout.width * 0.6 ? 0 : 1
			}

			this.textstyle = function(style, tag) {
				var pos = style.pos
				style.pos = vec3((pos.x + this.xoffset), pos.y, 0)
				return style
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
		var rows = [[],[],[],[],[],[]]
		this.rows = 1
		for (var i = 0; i < data.length; i++) {
			var event = this.event({
				title: data[i].title,
				id: data[i].id,
				bgcolor: vec4(0.75, 0.75, 0.75, 1),
				start: new Date(data[i].date).getTime(),
				end: new Date(data[i].enddate).getTime()
			})
			for (var r = 0; r < rows.length; r++) {
				var canfit = true
				for (var k = 0; k < rows[r].length; k++) {
					if (!(
						(rows[r][k].start > event.end && rows[r][k].end > event.end) ||
						(rows[r][k].start < event.start && rows[r][k].end < event.start)
					)) {
						canfit = false
					}
				}
				if (canfit) {
					event.row = r
					this.rows = max(this.rows, r + 1)
					rows[r].push(event)
					break
				}
			}
		}
		return rows
	}

	this.render = function () {
		return [
			this.renderEvents(this.data),
			this.event({
				name: "eventghost",
				id: -1,
				size: 3,
				opacity: 0.5,
				fontsize: 6,
				start: 0,
				end: 0,
				bgcolor: vec4(0.2, 0.7, 1, 0.5),
				row: -1
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
