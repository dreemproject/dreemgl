/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/label', function (require, $ui$, view) {

	this.text = ''
	this.bgcolor = NaN

	this.attributes = {
		data: Config({type: Array,  value: wire('this.parent.data')}),
		zoom: Config({type: Number, value: wire('this.parent.zoom')}),
		scroll: wire('this.parent.scroll'),
		hoverid: -1,
		eventselected: Config({type:Event})
	}

	this.layout = function(){
		this.layout.width =  this.parent.layout.width
	}

	this.onpointerstart = function(event){
		this.hoverid = this.last_pick_id
		var eventData = this.data[this.hoverid]
		if (eventData) {
			this.emitUpward('eventselected', eventData)
		}
	}

	this.ondata = function (data) {
		this.pickrange = this.data.length
	}

	this.pickrange = 1024;

	define.class(this, 'eventrects', this.Shader, function(){

		var vertstruct = define.struct({
			pos: vec2,
			uv: vec2,
			id: float
		})
		this.mesh = vertstruct.array()

		var startTime = new Date("Jan 01 2016").getTime()

		this.update = function(){
			var view = this.view
			var data = view.data
			var mesh = this.mesh = vertstruct.array();
			for(var i = 0; i < data.length; i++) {

				var date = new Date(data[i].date)
				var enddate = new Date(data[i].enddate)

				var timeOffset = date.getTime() - startTime
				var dayOffset = timeOffset / 1000 / 60 / 60 / 24
				var dayWidth = (enddate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24

				var w = dayWidth
				var h = 1
				var x = dayOffset
				var y = 0

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
				return vec4(0, 1, 0, 1)
			}
			return vec4(0.5, 0.5, 0.5, 1)
		}
	})

	this.eventrects = true

})
