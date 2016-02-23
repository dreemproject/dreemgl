/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/label', function (require, $ui$, view) {

	this.text = ''
	this.bgcolor = vec4(1, 1, 1, 0.05)
	this.pickalpha = 0

	this.attributes = {
		data: Config({type: Array,  value: wire('this.parent.data')}),
		zoom: Config({type: Number, value: wire('this.parent.zoom')}),
		scroll: wire('this.parent.scroll'),
		hoverid: -1,
		makeStart: null,
		makeEnd: null,
		eventselected: Config({type:Event})
	}

	this.pointermove = function(event) {
		var eventghost = this.find('eventghost')
		eventghost.start = this.parent.getRangeStart() + this.parent.getRange() * (event.min[0] / this.layout.width)
		eventghost.end = this.parent.getRangeStart() + this.parent.getRange() * (event.max[0] / this.layout.width)
		this.hoverid = this.last_pick_id // TODO(aki): hack to force draw. Remove.
	}

	this.pointerend = function(event) {
		var eventghost = this.find('eventghost')
		var eventdata = {
			date: eventghost.start,
			enddate: eventghost.end,
			title: 'New Event',
			metadata: {
				location: {
					name: 'New Location',
					lattitude: 0,
					longitute: 0
				}
			}
		}
		this.parent.makeEvent(eventdata)
		eventghost.start = 0
		eventghost.end = 0
		this.hoverid = this.last_pick_id // TODO(aki): hack to force draw. Remove.
	}

	this.onpointertap = function(event){
		this.hoverid = this.last_pick_id
		if (!this.data) return
		var eventData = this.data[this.hoverid]
		if (eventData) {
			this.emitUpward('eventselected', eventData)
		}
	}

	this.ondata = function (data) {
		if (!this.data) return
		this.pickrange = this.data.length
	}

	define.class(this, 'eventghost', view, function(){
		this.bgcolor = '#4466FF'

		this.attributes = {
			zoom: Config({type: Number, value: wire('this.parent.zoom')}),
			scroll: wire('this.parent.scroll'),
			duration: 1,
			offset: 0,
			start: 0,
			end: 0
		}

		this.layout = function(){
			this.layout.width =  this.parent.layout.width
			this.layout.height =  this.parent.layout.height
		}

		this.atDraw = function () {
			this.offset = new Date(this.start).getTime() - this.parent.parent.getStart()
			this.duration = new Date(this.end).getTime() - new Date(this.start).getTime()
			this.offset = this.offset / this.parent.parent.TIME_SCALE / this.parent.zoom
			this.duration = this.duration / this.parent.parent.TIME_SCALE / this.parent.zoom
		}

		this.hardrect = {
			position: function(){
				var start = view.start
				var pos = vec2(mesh.x * view.duration + view.offset - view.scroll[0], mesh.y)
				return vec4(pos.x * view.layout.width, pos.y * view.layout.height, 0, 1) * view.totalmatrix * view.viewmatrix
			}
		}
	})

	define.class(this, 'eventrects', this.Shader, function(){

		var vertstruct = define.struct({
			pos: vec2,
			uv: vec2,
			id: float
		})
		this.mesh = vertstruct.array()

		this.update = function(){
			var startTime = this.view.parent.getStart()
			var view = this.view
			if (!this.data) return
			var data = view.data
			var mesh = this.mesh = vertstruct.array();
			for (var i = 0; i < data.length; i++) {

				var date = new Date(data[i].date)
				var enddate = new Date(data[i].enddate)

				var timeOffset = date.getTime() - startTime
				var dayOffset = timeOffset / 1000 / 60 / 60 / 24
				var dayWidth = (enddate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24

				// TODO(aki): Improve dumb stacking of ovelapping events
				var overlapsnext = false
				if (data[i + 1] && data[i + 1].date <= data[i].enddate) {
					overlapsnext = true
				}
				var overlapsprev = false
				if (i > 0 && data[i - 1].enddate >= data[i].date) {
					overlapsprev = true
				}

				var w = dayWidth
				var h = overlapsprev || overlapsnext ? 0.5 : 1
				var x = dayOffset
				var y = overlapsprev ? 0.5 : 0

				mesh.pushQuad(
					x  , y  , 0, 0, i,
					x+w, y  , 1, 0, i,
					x  , y+h, 0, 1, i,
					x+w, y+h, 1, 1, i
				)
			}
		}

		this.position = function(){
			var pos = mesh.pos
			pos.x = pos.x - view.zoom * view.scroll[0]
			pos = pos * vec2(view.layout.width / view.zoom, view.layout.height)
			return vec4(pos, 0, 1) * view.totalmatrix * view.viewmatrix
		}
		this.color = function(){
			PickGuid = mesh.id
			if (view.hoverid == mesh.id){
				return vec4(0.5, 0.75, 1, 1)
			}
			return vec4(0.75, 0.75, 0.75, 1)
		}
	})

	this.eventrects = true

	this.render = function () {
		return [
			this.eventghost({name: "eventghost"})
		]
	}

})
