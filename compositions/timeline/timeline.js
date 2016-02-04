define.class('$ui/view', function (background, labels, scrollbar) {

	this.attributes = {
		format: Config({type: Enum('12','24'),  value: "24"}),
		zoom: Config({type: Number, value: 150}),
		maxzoom: Config({type: Number, value: 365}),
		scroll: Config({type: Number, value: 0})
	}

	this.atDraw = function () {
		this.background = this.find("background")
		this.labels = this.find("labels")
		this.hscrollbar = this.find("scrollbar")
		this.hscrollbar.updateScrollbars()

		var segs,  hw = this.layout.width / 24 / this.zoom
		if (hw < 1) {
			segs = 1
		} else if (hw < 12) {
			segs = 2
		} else if (hw < 21) {
			segs = 4
		} else if (hw < 35) {
			segs = 8
		} else if (hw < 55) {
			segs = 12
		} else {
			segs = 24
		}
		// TODO(aki): better data-binding that doesent trigger render
		this.background.hoursegs = segs
		this.labels.hoursegs = segs
	}

	this.pointerwheel = function(event) {
		this.hscrollbar = this.find("scrollbar")
		if (event.value[0]){
			this.scroll = clamp(this._scroll + event.value[0] / this.layout.width, 0, this.hscrollbar._total - this.hscrollbar._page)
		}
		if (event.value[1]){
			var delta = event.value[1] / 10
			var lastzoom = this._zoom
			var newzoom = clamp(this.zoom + delta, 1, this.maxzoom)

			this.zoom = clamp(this.zoom + delta, 1, this.maxzoom)

			var xpos0 = this._scroll * lastzoom + this.globalToLocal(event.position)[0] / this.layout.width * lastzoom
			var xpos1 = this._scroll * newzoom + this.globalToLocal(event.position)[0] / this.layout.width * newzoom
			var shiftx = (xpos0 - xpos1) / newzoom

			this.scroll = clamp(this._scroll + shiftx, 0, this.hscrollbar._total - this.hscrollbar._page)
		}
	}

	this.render = function() {
		return [
			background({name: "background"}),
			labels({name: "labels"}),
			scrollbar({name: "scrollbar"})
		]
	}

})
