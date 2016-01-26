define.class('$ui/label', function (require, $ui$, view) {

	this.flexdirection = 'row'
	this.flex = 1
	this.fgcolor = 'black'

	this.attributes = {
		hoverid: -1,
		zoom: 1,
		maxzoom: 365,
		hoursegs: 1,
		xres: 1,
		yres: 1
	}

	this.onzoom = function () {
		if (this.zoom > 16) {
			this.hoursegs = 1
		} else if (this.zoom > 7.9) {
			this.hoursegs = 2
		} else if (this.zoom > 4) {
			this.hoursegs = 4
		} else if (this.zoom > 2.6) {
			this.hoursegs = 8
		} else if (this.zoom > 1.3) {
			this.hoursegs = 12
		} else {
			this.hoursegs = 24
		}
	}

	this.hardrect = function(){
		this.makepattern = function (field, repeat, zoom) {
			var f = field * repeat
			// TODO: mod() breaks without point!
			if (mod(f, 1.0) < 1.0 / view.xres * zoom * repeat) {
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
			var a = 24.0 / view.yres
			var b = 48.0 / view.yres
			var c = 72.0 / view.yres
			// horizontal dividers
			if (abs(uv.y - a) < 0.5 / view.yres ||
			abs(uv.y - b) < 0.5 / view.yres ||
			abs(uv.y - c) < 0.5 / view.yres) {
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
	}
	this.hardrect = true
	this.bg = false


	this.oninit = function () {
		this.animate = function () {
			requestAnimationFrame(window._animate);
			this.zoom = 365 / (1 + (0.5 * Math.sin(Date.now() / 3000) * 365 + 365 / 2))
			// TODO(aki): why this.width/height eaquals NaN?
			this.xres = this.layout.width
			this.yres = this.layout.height
		}.bind(this);
		if (!window._animate) {
			window._animate = this.animate.bind(this);
			window._animate();
		}
		window._animate = this.animate.bind(this);
	}

	// this.onpointerhover = function(e){
	// 	this.hoverid = this.last_pick_id
	// 	console.log(this.hoverid)
	// }
	var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	this.typeface = function(){
		// this.draworder = 5
		this.update = function(){
			var view = this.view

			var mesh = this.newText()
			if(view.font) mesh.font = view.font

			mesh.fontsize = view.fontsize
			mesh.boldness = view.boldness
			mesh.add_y = mesh.line_height

			mesh.align = view.align
			mesh.start_x = view.padding[0]
			mesh.start_y = mesh.line_height + view.padding[1]
			mesh.clear()

			// draw month labels
			for(var i = 0; i < 12; i++) {
				mesh.add_x = i * view.xres / 11.774193548387096 * 365 / view.zoom
				mesh.add_y = 24
				mesh.add(MONTHS[i],0 ,0 ,0)
			}

			// draw day labels
			for(var i = 0; i < 62; i++) {
				mesh.add_x = i * view.xres / view.zoom
				mesh.add_y = 48
				mesh.add((i + 1).toString(), 0 ,0 ,0)
			}

			// draw hour labels
			for(var i = 0; i < 48; i++) {
				var h = 24 / view.hoursegs * i;
				if (view.hoursegs == 1) break;
				mesh.add_x = h * view.xres / 24 / view.zoom
				mesh.add_y = 72
				mesh.add((h % 24).toString(), 0 ,0 ,0)
			}

			// if (view.measure_with_cursor)	mesh.computeBounds(true)
			this.mesh = mesh
		}
	}

	this.pickrange = 512;
	define.class(this, 'eventrects', this.Shader, function(){
		var vertstruct = define.struct({
			pos: vec2,
			uv: vec2,
			id: float
		})
		this.mesh = vertstruct.array()
		this.update = function(){
			var view = this.view
			var mesh = this.mesh = vertstruct.array();
			for(var i = 1; i <= 512; i++) {
				var w = 0
				var h = 1
				var x = floor(random() * 365 * 24) / 24
				var y = 0
				mesh.pushQuad(
					x   ,y    , 0, 0, i,
					x+w , y   , 1, 0, i,
					x   , y+h , 0, 1, i,
					x+w ,y+h  , 1, 1, i
				)
			}
		}
		this.position = function(){
			// var pos = mesh.pos + vec2(uv.x, 0.0) // TODO: not working
			var pos = mesh.pos
			pos = pos * vec2(view.xres / view.zoom, view.yres - 72) + vec2(0, 72)
			var w = mesh.uv.x * min(max(100 / view.zoom, 1.0), 5.0)
			pos = pos + vec2(w, 0.0) // TODO: min requires point
			return vec4(pos, 0, 1) * view.totalmatrix * view.viewmatrix
		}
		this.color = function(){
			PickGuid = mesh.id
			if (view.hoverid == mesh.id) {
				return vec4(0, 1, 0, 1)
			}
			return vec4(0.5, 0.5, 0.5, 1)
		}
	})
	this.eventrects = true

	this.render = function() { return [

	]}

})
