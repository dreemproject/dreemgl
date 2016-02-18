/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function () {

	this.fgcolor = 'black'

	this.attributes = {
		zoom: wire('this.parent.zoom'),
		scroll: wire('this.parent.scroll'),
		monthwidth: wire('this.parent.monthwidth'),
		daywidth: wire('this.parent.daywidth'),
		hourwidth: wire('this.parent.hourwidth'),
		hoursegs: wire('this.parent.hoursegs')
	}

	this.layout = function(){
		this.layout.top = 0
		this.layout.height = this.parent.layout.height
	}

	this.hardrect = function(){

		var array = new Float32Array(4 * 2048)
		var start = new Date("Jan 1 2016").getTime()
		for(var i = 0; i < array.length / 4; i++) {
			var day = new Date(start + i * 86400000)
			array[i * 4 + 0] = day.getDate()
			array[i * 4 + 1] = day.getDay()
			array[i * 4 + 2] = day.getMonth()
			array[i * 4 + 3] = day.getFullYear()
		}

		this.caltexture = this.Texture.fromArray(array, 2048, 1)

		this.makepattern = function (field) {
			if (math.odd(field - mod(field, 1.0))) {
				return 1.0
			} else {
				return 0.9
			}
		}

		this.color = function(){
			var MONTH_COLLAPSE = 200.0
			var col = vec4()
			var fill = vec4("#204e4f")
			var a = 24.0 / view.layout.height
			var b = 48.0 / view.layout.height
			// horizontal dividers
			if (abs(uv.y - a) < 0.5 / view.layout.height ||
			abs(uv.y - b) < 0.5 / view.layout.height) {
				return vec4(0.75, 0.75, 0.75, 1.0)
			}
			var zoom = view.zoom
			var dayfield = (uv.x + view.scroll.x) * view.zoom
			var data_u = dayfield / 2048
			var daydata = this.caltexture.point(vec2(data_u, 0))

			var pattern = 0.0
			if (uv.y < a) {
				if (view.monthwidth < MONTH_COLLAPSE) {
					pattern = makepattern(daydata.a * 255.0)
				} else {
					pattern = makepattern(daydata.b * 255.0)
				}
			} else if (uv.y < b) {
				if (view.monthwidth < MONTH_COLLAPSE) {
					pattern = makepattern(daydata.b * 255.0)
				} else {
					pattern = makepattern(dayfield * view.hoursegs)
				}
			} else {
				pattern = makepattern(dayfield * view.hoursegs)
				fill = vec4(0.8, 0.8, 0.8, 1)
			}

			// TODO(aki): crossfade patterns
			return mix(fill, '#4e4e4e', pattern)
		}
	}

})
