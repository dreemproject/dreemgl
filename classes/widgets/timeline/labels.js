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
		monthwidth: wire('this.parent.monthwidth'),
		daywidth: wire('this.parent.daywidth'),
		hourwidth: wire('this.parent.hourwidth'),
		hoursegs: wire('this.parent.hoursegs'),
		format: Config({type: Number, value: wire('this.parent.format')})
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
			var monthwidth = view.monthwidth
			var daywidth = view.daywidth
			var w = view.parent.layout.width
			var h = view.parent.layout.height
			var ts = view.parent.TIME_SCALE

			// var mw = w / 11.774193548387096 * 365 / zoom
			// var dw = w / zoom
			// var hw = w / 24 / zoom

			var mesh = this.newText()
			if (view.font) mesh.font = view.font
			if (view.align) mesh.align = view.align
			if (view.fontsize) mesh.fontsize = view.fontsize
			mesh.clear()

			var i, x, y, start, date, text

			start = new Date(view.parent.getStart())// TODO: /add offset

			var startYear = start.getFullYear()
			var startMonth = start.getMonth()
			var startDay = start.getDate()

			date = new Date(start)

			// Year labels
			if (monthwidth < MONTH_COLLAPSE) {
				for (i = 0; i < 4; i++) {
					date = new Date(start)
					date.setYear(startYear + i)
					x = (((date.getTime() - start) / ts) / zoom - scroll[0]) * w
					y = 24
					mesh.add_x = x + 5
					mesh.add_y = y - 5
					mesh.add(date.getFullYear().toString(), 0 ,0 ,0)
				}
			}

			date = new Date(start)

			// Month labels
			if (monthwidth > 100) {
				for (i = 0; i < 120; i++) {
					date = new Date(start)
					date.setMonth(startMonth + i)
					x = (((date.getTime() - start) / ts) / zoom - scroll[0]) * w
					y = monthwidth > MONTH_COLLAPSE ? 24 : 48
					mesh.add_x = x + 5
					mesh.add_y = y - 5
					text = monthwidth > MONTH_COLLAPSE ?
					MONTHS[date.getMonth() % 12] + ' ' + date.getFullYear() :
					MONTHS[date.getMonth() % 12]
					mesh.add(text, 0 ,0 ,0)
				}
			}

			date = new Date(start)

			// Day labels
			if (daywidth > 50) {
				for (i = 0; i < 120; i++) {
					date = new Date(start)
					date.setDate(startDay + i)
					x = (((date.getTime() - start) / ts) / zoom - scroll[0]) * w
					y = 48
					mesh.add_x = x + 5
					mesh.add_y = y - 5
					text = DAYS[(date.getDate() - 1) % 31]
					mesh.add(text, 0 ,0 ,0)
				}
			}

			// // draw day labels
			// start = floor(zoom / 365 * scroll[0] * 12 * 30)
			// if (dw > 60) {
			// 	for (var i = start; i < start + 30; i++) {
			// 		x = i * dw + 5 - scroll[0] * w
			// 		if (x > w) break
			// 		mesh.add_x = x
			// 		mesh.add_y = 24 - 5
			// 		mesh.add(DAYS[i % 31], 0 ,0 ,0)
			// 	}
			// }
			//
			// mesh.fontsize = view.fontsize * 0.75
			//
			// // draw hour labels
			// start = floor(zoom / 365 * scroll[0] * 365 * view.hoursegs)
			// if (hw > (32 / view.hoursegs) && view.hoursegs !== 1) {
			// 	for (var i = start; i < start + 48; i++) {
			// 		var h = 24 / view.hoursegs * i
			// 		x = h * hw + 5 - scroll[0] * w
			// 		if (x > w) break
			// 		mesh.add_x = x
			// 		mesh.add_y = 48 - 5
			// 		if (view.format == 12) {
			// 			h = (h % 12 || 12) + ' ' + (i < 12 ? 'am' : 'pm')
			// 		} else {
			// 			h = h % 24 + ' h'
			// 		}
			// 		mesh.add(h, 0 ,0 ,0)
			// 	}
			// } else {
			// 	mesh.add_x = 0
			// 	mesh.add_y = 72 - 5
			// 	mesh.add('', 0 ,0 ,0)
			// }

			this.mesh = mesh
		}
	}

})
