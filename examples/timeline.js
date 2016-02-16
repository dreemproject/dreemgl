define.class('$server/composition', function($server$, service, $ui$, screen, view, $widgets$timeline$, timeline) {

	this.render = function() {
		return [
			screen({name:'default'}, [
				view({flexdirection: 'column',
				oninit: function () {
					var startDate = new Date("Jan 1 2016")
					var timeline = this.find('timeline')
					var hstep = 1000 * 60 * 60
					var events = []
					var date
					for(var i = 0; i < 1000; i++) {
						date = new Date(startDate.getTime() + i * (6 + floor(random() * 3) ) * hstep)
						events.push({
							date: date,
							enddate: new Date(date.getTime() + (8 - floor(random() * 8) ) * hstep / 4)
						})
					}
					timeline.data = events
				}
				},[
					timeline({name:'timeline'})
				])
			])
		]
	}
})
