/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/label', function () {

	this.position = 'absolute'
	this.bgcolor = NaN
	this.fgcolor = 'white'
	this.drawtarget = 'color'
	this.bold = true;
	this.attributes = {
		zoom: wire('this.parent.zoom'),
		scroll: wire('this.parent.scroll'),
		hoursegs: wire('this.parent.hoursegs'),
		format: Config({type: Number, value: wire('this.parent.format')}),

		segments: Config({type: vec3, value: vec3()})
	}

	var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	var DAYS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th',
		'17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st']
	var MONTH_COLLAPSE = 200.0

	this.typeface = function(){
		this.update = function(){

			var view = this.view
			var zoom = view.zoom
			var scroll = view.scroll
			var w = view.parent.layout.width
			var h = view.parent.layout.height
			var ts = view.parent.TIME_SCALE

			var mesh = this.newText()
			if (view.font) mesh.font = view.font
			if (view.align) mesh.align = view.align
			if (view.fontsize) mesh.fontsize = view.fontsize
			mesh.clear()

			var i, x, y, start, offset, date, text

			start = new Date(view.parent.getStart())
			first = new Date(view.parent.getRangeStart())

			var firstYear = first.getFullYear()
			var firstMonth = first.getMonth()
			var firstDate = first.getDate()
			var firstHour = first.getHours()

			function drawLabel(text, date, xoffset, yoffset) {
				x = (date.getTime() - first) / ts / zoom * w + xoffset + 5
				y = yoffset - 5
				mesh.add_x = x
				mesh.add_y = y
				mesh.add(text, 0, 0, 0)
			}

			function drawYears(yoffset) {
				date = new Date("0")
				date.setYear(firstYear)
				xoffset = (date.getTime() - first) / ts / zoom * w
				x = 0, i = -1
				while (x < w) {
					date = new Date(first)
					date.setYear(firstYear + i)
					drawLabel(date.getFullYear().toString(), date, xoffset, yoffset)
					i++
				}
			}

			function drawMonths(yoffset) {
				date = new Date("0")
				date.setYear(firstYear)
				date.setMonth(firstMonth)
				xoffset = (date.getTime() - first) / ts / zoom * w
				x = 0, i = -1
				while (x < w) {
					date = new Date(first)
					date.setMonth(firstMonth + i)
					drawLabel(MONTHS[date.getMonth() % 12], date, xoffset, yoffset)
					i++
				}
			}

			function drawDays(yoffset) {
				date = new Date("0")
				date.setYear(firstYear)
				date.setMonth(firstMonth)
				date.setDate(firstDate)
				xoffset = (date.getTime() - first) / ts / zoom * w
				x = 0, i = -1
				while (x < w) {
					date = new Date(first)
					date.setDate(firstDate + i)
					drawLabel(DAYS[(date.getDate() - 1) % 31], date, xoffset, yoffset)
					i++
				}
			}

			function drawHours(yoffset) {
				date = new Date("0")
				date.setYear(firstYear)
				date.setMonth(firstMonth)
				date.setDate(firstDate)
				date.setHours(firstHour)
				xoffset = (date.getTime() - first) / ts / zoom * w
				var c = 24 / view.hoursegs
				x = 0, i = -1
				while (x < w) {
					var h = (firstHour + i) % 24
					date = new Date(first)
					date.setHours(firstHour + i)
					if (view.format == 12) {
						text = (h % 12 || 12) + ' ' + (h < 12 ? 'am' : 'pm')
					} else {
						text = h % 24 + ' h'
					}
					if (h % c == 0) {
						drawLabel(text, date, xoffset, yoffset)
					}
					i++
				}
			}

			mesh.fgcolor = vec4(view.fgcolor)
			mesh.fontsize = view.fontsize

			switch (view.segments[0]) {
				case 1:
					drawYears(24)
					break
				case 2:
					drawMonths(24)
					break
				case 4:
					drawDays(24)
					break
			}

			mesh.fontsize = view.fontsize * 0.5
			mesh.fgcolor = vec4(view.fgcolor)

			switch (view.segments[1]) {
				case 2:
					drawMonths(48)
					break
				case 4:
					drawDays(48)
					break
				case 5:
					drawHours(48)
					break
			}

			this.mesh = mesh
		}
	}

})
