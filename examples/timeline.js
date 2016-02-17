define.class('$server/composition', function($server$, service, $ui$, screen, view, $widgets$timeline$, timeline) {

	var START_DATE = new Date("Feb 15 2016")
	var END_DATE = new Date("May 21 2016")
	var MAX_ZOOM = ceil((END_DATE - START_DATE) / 1000 / 60 / 60 / 24)
	var EVENT_COUNT = 1000

	this.render = function() {
		return [
			screen({name:'default'}, [
				view({flexdirection: 'column',
				oninit: function () {
					var timeline = this.find('timeline')
					var hstep = 1000 * 60 * 60
					var events = []
					var date
					for(var i = 0; i < EVENT_COUNT; i++) {
						date = new Date(START_DATE.getTime() + i * (6 + floor(random() * 3) ) * hstep)
						events.push({
							date: date,
							enddate: new Date(date.getTime() + (12 - floor(random() * 12) ) * hstep / 4)
						})
					}
					timeline.data = events
				}
				},[
					timeline({
						name:'timeline',
						start: START_DATE,
						end: END_DATE,
						minzoom: 0.25,
						maxzoom: MAX_ZOOM
					})
				])
			])
		]
	}
})
