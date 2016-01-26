define.class('$ui/view', function (background) {

	this.attributes = {
		format: Config({type: Enum('12','24'),  value: "24"}),
		zoom: 1,
		maxzoom: 365
	}

	// TODO need a way to externally set attribute without triggering render function.
	this.oninit = function () {
		this.animate = function () {
			requestAnimationFrame(window._animate);
			this.zoom = 365 / (1 + (0.5 * Math.sin(Date.now() / 5000) * 365 + 365 / 2))
		}.bind(this);
		if (!window._animate) {
			window._animate = this.animate.bind(this);
			window._animate();
		}
		window._animate = this.animate.bind(this);
	}

	this.render = function() {
		return [
			background({
				format: this.format
			})
		]
	}

})
