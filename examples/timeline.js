/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function($ui$, screen, view, $widgets$timeline$, timeline) {

	var EVENT_COUNT = 10

	var now = new Date()
	var startDate = now.toString()

	now.setHours(96)
	var endDate = now.toString()

	this.render = function() {
		return [
			screen({name:'default'}, [
				view({
					bgcolor: NaN,
					flexdirection: 'column',
					oninit: function () {
						var timeline = this.find('timeline')
						var hstep = 1000 * 60 * 60
						var events = []
						var date
						for(var i = 0; i < EVENT_COUNT; i++) {
							date = new Date(new Date(startDate).getTime() + i * (6 + floor(random() * 3) ) * hstep)
							events.push({
								title: 'E' + i,
								id: i + 1,
								date: date,
								enddate: new Date(date.getTime() + (64 - floor(random() * 64) ) * hstep / 4)
							})
						}
						events.push({
							title: 'event',
							id: 999,
							date: new Date('Mar 10 2016'),
							enddate: new Date('Mar 11 2016')
						})
						timeline.data = events
					}
				},[
					timeline({
						name:'timeline',
						start: startDate,
						end: endDate,
						zoom: 2.8,
						autoexpand: true
					})
				])
			])
		]
	}
})
