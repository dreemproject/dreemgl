define.class('$ui/view', function (require, event, $ui$, view, label) {

	this.flexdirection = 'column'
	this.flex = 1
	this.borderleftwidth = 1
	this.bordercolor = vec4(0, 0, 0, 0.25)


	this.attributes = {
		width: Config({type: Number,  value: 0}),
		index: Config({type: Number,  value: 0}),
		date: Config({type: String,  value: ""}),
		format: Config({type: Enum('12','24'),  value: "24"})
	}

	this.renderHours = function() {
		var step = 1;
		if (this.width < 150) {
			step = 24;
		} else if (this.width < 300) {
			step = 12;
		} else if (this.width < 500) {
			step = 6;
		} else if (this.width < 700) {
			step = 3;
		} else if (this.width < 1500) {
			step = 2;
		}
		var hours = []
		for (var i = 0;i < 24 / step; i++) {
			var h = i * step;
			if (this.format == '12') {
				h = (h % 12 || 12) + ' ' + (i < 12 ? 'am' : 'pm')
			}
			else {
				h += ' h'
			}
			hours.push(label({
				text: h,
				fontsize: 16,
				flex: 1,
				width: this.width / step,
				bgcolor: vec4(0, 0, 0, ((i + this.index * 24 / step) % 2) ? 0 : 0.03),
				minheight: 32,
				fgcolor: vec4(0, 0, 0, 0.75),
				padding: vec4(4, 3, 4, 1)
			}))
		}
		return hours
	}

	this.render = function() { return [
		label({
			name:"label",
			text: this.date,
			fgcolor:vec3(0.2,0.2,0.2),
			fontsize:18,
			bgcolor:vec4(0.9, 0.9, 0.9, this.index % 2 ? 0.5 : 0.9),
			borderbottomwidth: 1,
			bordercolor: vec4(0, 0, 0, 0.25),
			borderradius: 0,
			padding: vec4(6, 4, 6, 2),
		})
			,view({
					flex:1,
					flexdirection: 'row'
				},
				this.renderHours()
			)
	]}

})
