define.class('$ui/view', function (require, hour, event, $ui$, view, label) {

	this.flexdirection = 'column'
	this.bgcolor = 'black'
	this.flex = 1

	this.attributes = {
		date: Config({type: String,  value: ""}),
		format: Config({type: Enum('12','24'),  value: "24"}),
	}

	this.renderHours = function() {
		var hours = []
		for (var i = 0;i < 24; i++) {
			var h = i
			if (this.format == '12') {
				h = (h % 12 || 12) + ' ' + (i < 12 ? 'am' : 'pm')
			}
			else {
				h += ' h'
			}
			hours.push(hour({
				text: h,
				bgcolor: vec4(0, 0, 0, i % 2 ? 0 : 0.01)
			}))
		}
		return hours
	}

	this.renderEvents = function() {
		var events = []
		for (var i = 0;i < this.events.length; i++) {
			events.push(event({
				data: this.events[i]
			}))
		}
		return events
	}

	this.render = function() { return [
		label({
			name:"label",
			text: this.date,
			fgcolor:vec3(0.2,0.2,0.2),
			fontsize:24,
			bgcolor:vec3(0.9,0.9,0.9),
			borderbottomwidth: 1,
			bordercolor: 'black',
			borderradius: 0,
			padding: vec4(12, 8, 12, 4),
		})
			,view({
					flex:1,
					flexdirection: 'column',
					overflow: 'scroll'
				},
				this.renderHours(),
				this.renderEvents()
			)

	]}
})
