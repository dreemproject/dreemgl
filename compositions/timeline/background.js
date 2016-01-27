define.class('$ui/label', function (events, $ui$, view) {

	this.flex = 1
	this.flexdirection = 'column'
	this.fgcolor = 'black'
	this.height = 300

	this.attributes = {
		format: 12,
		zoom: wire('this.parent.zoom'),
		hoursegs: 1
	}

	this.onzoom = function () {
		this.parent.zoom = this.zoom
		// TODO: trigger when browser resizes
		var hw = this.layout.width / 24 / this.zoom;
		if (hw < 1) {
			this.hoursegs = 1
		} else if (hw < 12) {
			this.hoursegs = 2
		} else if (hw < 21) {
			this.hoursegs = 4
		} else if (hw < 35) {
			this.hoursegs = 8
		} else if (hw < 55) {
			this.hoursegs = 12
		} else {
			this.hoursegs = 24
		}
	}

	this.bg = function(){
		this.makepattern = function (field, repeat, zoom) {
			var f = field * repeat
			// TODO: mod() breaks without point!
			if (mod(f, 1.0) < 1.0 / view.layout.width * zoom * repeat) {
				return 0.75
			} else if (math.odd(f - mod(f, 1.0))) {
				return 1.0
			} else {
				return 0.9
			}
		}

		this.color = function(){
			var col = vec4()
			var fill = vec4(0.098, 0.098, 0.098, 1)
			var a = 24.0 / view.layout.height
			var b = 48.0 / view.layout.height
			var c = 72.0 / view.layout.height
			// horizontal dividers
			if (abs(uv.y - a) < 0.5 / view.layout.height ||
			abs(uv.y - b) < 0.5 / view.layout.height ||
			abs(uv.y - c) < 0.5 / view.layout.height) {
				return vec4(0.75, 0.75, 0.75, 1.0)
			}
			var zoom = view.zoom
			var dayfield = uv.x * view.zoom
			var hour = makepattern(dayfield, view.hoursegs, zoom)
			var day = makepattern(dayfield, 1, zoom)
			var week = makepattern(dayfield, 1.0 / 7, zoom) // TODO: breaks without point!
			var month = makepattern(dayfield, 1.0 / 31, zoom)
			var pattern = week;
			if (uv.y < a) {
				pattern = month
			} else if (uv.y < b) {
				pattern = week * day
			} else if (uv.y < c) {
				pattern = hour
			} else {
				pattern = hour
				fill = vec4(0.8, 0.8, 0.8, 1)
			}
			// TODO(aki): crossfade patterns
			return mix(fill, 'white', pattern)
		}
		// this.dump = 1
	}

	var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	var DAYS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th',
		'17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st']

	this.typeface = function(){
		this.update = function(){

			var view = this.view
			var zoom = view.zoom
			var w = view.layout.width
			var h = view.layout.height

			var mw = w / 11.774193548387096 * 365 / zoom;
			var dw = w / zoom;
			var hw = w / 24 / zoom;

			var mesh = this.newText()
			if (view.font) mesh.font = view.font
			if (view.align) mesh.align = view.align
			if (view.fontsize) mesh.fontsize = view.fontsize
			mesh.clear()

			var x = 0
			// draw month labels
			// TODO(aki): calculate and display months correctly
			if (mw > 110) {
				for (var i = 0; i < 12; i++) {
					x = i * mw + 5
					if (x > w) break
					mesh.add_x = x
					mesh.add_y = 24 - 5
					mesh.add(MONTHS[i],0 ,0 ,0)
				}
			}

			// draw day labels
			if (dw > 60) {
				for (var i = 0; i < 62; i++) {
					x = i * dw + 5
					if (x > w) break
					mesh.add_x = x
					mesh.add_y = 48 - 5
					mesh.add(DAYS[i % 31], 0 ,0 ,0)
				}
			}

			mesh.fontsize = view.fontsize * 0.75

			// draw hour labels
			// console.log(hw)
			if (hw > (32 / view.hoursegs) && view.hoursegs !== 1) {
				for (var i = 0; i < 48; i++) {
					var h = 24 / view.hoursegs * i
					x = h * hw + 5
					if (x > w) break
					mesh.add_x = x
					mesh.add_y = 72 - 5
					if (view.format == 12) {
						h = (h % 12 || 12) + ' ' + (i < 12 ? 'am' : 'pm')
					} else {
						h = h % 24 + ' h'
					}
					mesh.add(h, 0 ,0 ,0)
				}
			} else {
				mesh.add_x = 0
				mesh.add_y = 72 - 5
				mesh.add('', 0 ,0 ,0)
			}

			this.mesh = mesh
		}
	}

	this.render = function() { return [
		view({
			height: 72,
			bgcolor: vec4(0,0,0,0)
		}),
		events({
			flex: 1
		}),
		events({
			flex: 1
		}),
		events({
			flex: 1
		})
		,events({
			flex: 1
		}),
		events({
			flex: 1
		}),
		events({
			flex: 1
		}),
		events({
			flex: 1
		})
		,events({
			flex: 1
		}),
		events({
			flex: 1
		}),
		events({
			flex: 1
		}),
		events({
			flex: 1
		})
		,events({
			flex: 1
		})
	]}

})
