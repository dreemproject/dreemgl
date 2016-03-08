/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function($server$, service, $ui$, screen, view, $widgets$timeline$, timeline) {

	var START_DATE = "Feb 1 2016"
	var END_DATE = "Feb 17 2016"
	var EVENT_COUNT = 10

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
							date = new Date(new Date(START_DATE).getTime() + i * (6 + floor(random() * 3) ) * hstep)
							events.push({
								title: 'E' + i,
								id: i + 1,
								date: date,
								enddate: new Date(date.getTime() + (64 - floor(random() * 64) ) * hstep / 4)
							})
						}
						timeline.data = events
					}
				},[
					timeline({
						name:'timeline',
						start: START_DATE,
						end: END_DATE,
						zoom: 1
					})
				])
			])
		]
	}
})
