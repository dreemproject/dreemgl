define.class('$ui/view', function (background, labels, events, scrollbar) {

	this.flexdirection = 'column'
	this.padding = vec4(0, 80, 0, 18)
	this.bgcolor = NaN

	this.attributes = {
		data: Config({type: Array,  value: []}),
		format: Config({type: Enum('12','24'),  value: "24"}),
		zoom: Config({type: Number, value: 7}),
		maxzoom: Config({type: Number, value: 365}),
		scroll: Config({type: Number, value: 4}),
		eventselected: Config({type:Event})
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

	this.pointermultimove = function(event) {
		if (event.length === 1 && event[0].view === this.background) {
			if (event[0].touch) {
				this.scroll = clamp(this._scroll - event[0].movement[0] / this.layout.width, 0, this.hscrollbar._total - this.hscrollbar._page)
			}
		} else if (event.length === 2 && event[0].view === this.background) {
			var lastzoom = this._zoom

			var center = vec2.mix(event[0].position, event[1].position, 0.5)
			var movement = vec2.mix(event[0].movement, event[1].movement, 0.5)
			var distance = abs(event[0].position[0] - event[1].position[0])
			var oldDistance = abs((event[0].position[0] - event[0].movement[0]) - (event[1].position[0] - event[1].movement[0]))

			// TODO(aki): delta doesent feel right
			var delta = (distance - oldDistance) / this.layout.width * this.zoom * 2
			var newzoom = clamp(this.zoom - delta, 1, this.maxzoom)

			this.zoom = newzoom

			var xpos0 = this._scroll * lastzoom + this.globalToLocal(center)[0] / this.layout.width * lastzoom
			var xpos1 = this._scroll * newzoom + this.globalToLocal(center)[0] / this.layout.width * newzoom
			var shiftx = (xpos0 - xpos1) / newzoom

			this.scroll = clamp(this._scroll + shiftx - movement[0] / this.layout.width, 0, this.hscrollbar._total - this.hscrollbar._page)
		}
	}
	this.pointerwheel = function(event) {
		this.hscrollbar = this.find("scrollbar")
		if (event.value[0]){
			this.scroll = clamp(this._scroll + event.value[0] / this.layout.width, 0, this.hscrollbar._total - this.hscrollbar._page)
		}
		if (event.value[1]){
			var lastzoom = this._zoom

			var delta = event.value[1] / this.layout.width * this.zoom
			var newzoom = clamp(this.zoom + delta, 1, this.maxzoom)

			this.zoom = newzoom

			var xpos0 = this._scroll * lastzoom + this.globalToLocal(event.position)[0] / this.layout.width * lastzoom
			var xpos1 = this._scroll * newzoom + this.globalToLocal(event.position)[0] / this.layout.width * newzoom
			var shiftx = (xpos0 - xpos1) / newzoom

			this.scroll = clamp(this._scroll + shiftx, 0, this.hscrollbar._total - this.hscrollbar._page)
		}
	}

	this.ondata = function (data) {
		this.find('events1').data = data.value[0].data
		this.find('events2').data = data.value[1].data
		this.find('events3').data = data.value[2].data
		this.find('events4').data = data.value[3].data
	}

	this.render = function() {
		return [
			background({name: "background"}),
			labels({name: "labels"}),
			events({name: "events1"}),
			events({name: "events2"}),
			events({name: "events3"}),
			events({name: "events4"}),
			scrollbar({name: "scrollbar"})
		]
	}

})
