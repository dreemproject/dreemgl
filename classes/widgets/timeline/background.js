/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function () {

	this.fgcolor = 'black'
	this.cursor = 'move'

	this.TIME_SCALE = 86400000 // millis to days

	this.attributes = {
		zoom: wire('this.parent.zoom'),
		scroll: wire('this.parent.scroll'),
		hoursegs: Config({type: Number, value: 24}),
		segments: Config({type: vec3, value: vec3()}),
		dayoffset: Config({type: Number, value: 1})
	}

	this.layout = function(){
		this.layout.top = 0
		this.layout.width = this.parent._layout.width
		this.layout.height = this.parent._layout.height
	}

	// Data-binding is buggy. set values at draw.
	this.atDraw = function () {
		this.segments = this.parent._segments
		this.hoursegs = this.parent._hoursegs
		// TODO(aki): this is a hack. Handle dates and timezones better
		var startDate = new Date(this.parent.getStart())
		this.dayoffset = 1 - ((startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000) / this.TIME_SCALE) % 1
	}

	this.hardrect = function(){
		var array = new Float32Array(4 * 2048)
		this.caltexture = this.Texture.fromArray(array, 2048, 1)

		this.update = function () {
			var array = new Float32Array(4 * 2048)
			var start = this.view.parent.getStart()
			for(var i = 0; i < array.length / 4; i++) {
				var day = new Date(start + i * this.TIME_SCALE)
				array[i * 4 + 0] = day.getDate()
				array[i * 4 + 1] = day.getDay()
				array[i * 4 + 2] = day.getMonth()
				array[i * 4 + 3] = day.getFullYear()
			}

			this.caltexture = this.Texture.fromArray(array, 2048, 1)
			this.caltexture.updateid = random()
		}

		this.makepattern = function (field1, field2) {
			if (field1 != field2) return 1.0
			return 0.0
		}

		this.pickpattern = function (val, year, month, weekp, day, hour, minute) {
			if (val == 1.0) return year
			else if (val == 2.0) return month
			else if (val == 3.0) return weekp
			else if (val == 4.0) return day
			else if (val == 5.0) return hour
			else if (val == 6.0) return minute
			return 0.0;
		}


		this.color = function(){
			var fgcolor = vec4("#ffffff")
			var bgcolor = vec4("#4e4e4e")
			var a = 24.0 / view.layout.height
			var b = 48.0 / view.layout.height

			var dayfield1 = (uv.x + (view.scroll.x)) * view.zoom - view.dayoffset
			var dayfield2 = (uv.x + 1.0 / view.layout.width + (view.scroll.x)) * view.zoom - view.dayoffset
			var caldata1 = this.caltexture.point(vec2(dayfield1 / 2048, 0.0)) * 255.0
			var caldata2 = this.caltexture.point(vec2(dayfield2 / 2048, 0.0)) * 255.0

			var year = makepattern(caldata1.a, caldata2.a)
			var month = makepattern(caldata1.b, caldata2.b)
			var week = makepattern(floor(dayfield1 / 7.0), floor(dayfield2 / 7.0))
			var day = makepattern(floor(dayfield1), floor(dayfield2))
			var hour = makepattern(floor(dayfield1 * view.hoursegs), floor(dayfield2 * view.hoursegs))
			var minute = makepattern(floor(dayfield1 * 96.0), floor(dayfield2 * 96.0))

			var color = vec4("#4e4e4e")
			var pattern = 0.0

			pattern += pickpattern(view.segments.x, year, month, week, day, hour, minute)
			if (uv.y > a)
				pattern = max(pattern, 0.5 * pickpattern(view.segments.y, year, month, week, day, hour, minute))
				color = mix(bgcolor, fgcolor, pattern)
			if (uv.y > b)
				pattern = max(pattern, 0.25 * pickpattern(view.segments.z, year, month, week, day, hour, minute))
				color = mix(bgcolor, fgcolor, pattern)

			return color
		}
	}

})
