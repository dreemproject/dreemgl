define.class('$ui/view', function (require, day, $ui$, view, label) {

	var DAYS = 10
	this.flexdirection = 'row'
	this.flex = 1

	this.attributes = {
		width: Config({type: Number,  value: 800})
	}

	this.renderDays= function() {
		var days = []
		for (var i = 0;i < DAYS; i++) {
			days.push(day({
				flex: 1,
				width: this.width / DAYS,
				index: i
			}))
		}
		return days
	}

	this.render = function() { return [
		this.renderDays()
	]}

	this.oninit = function () {
		var animate = function() {
			requestAnimationFrame(animate);
			this.width = Math.sin(Date.now() / 2000) * 8000 + 8050
		}.bind(this)
		animate()
	}

})
