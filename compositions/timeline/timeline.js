define.class('$ui/label', function (require, $ui$, view) {

	this.flexdirection = 'row'
	this.flex = 1

	this.attributes = {
		hoverid: -1,
		zoom: 1
	}

	this.hardrect = function(){
		this.color = function(){
			var col = vec4()
			var fill = vec4(0.98, 0.98, 0.98, 1)

			var zoom = view.zoom
			// var zoom = 1.0
			var days = uv.x * zoom

			var pattern = 1.0;

			if (zoom * 24 > 1200.0) {
				pattern = days / 7
				fill = vec4(0.9, 0.9, 0.9, 1)
			} else if (zoom * 24 > 200.0) {
				pattern = days * 24 / 24.0
				fill = vec4(0.95, 0.95, 0.95, 1)
			} else if (zoom * 24 > 100.0) {
				pattern = days * 24 / 12
			} else if (zoom * 24 > 50.0) {
				pattern = days * 24 / 6
			} else if (zoom * 24 > 25.0) {
				pattern = days * 24 / 3
			} else if (zoom * 24 > 14.0) {
				pattern = days * 24 / 2
			} else {
				pattern = days * 24
			}

			if (math.odd(pattern - mod(pattern, 1.0))) {
				col = fill
			} else {
				col = mix(fill, 'white', pow(zoom / 365, 0.05))
			}

			return col
		}
	}
	this.hardrect = true
	this.bg = false


	this.oninit = function () {
		this.animate = function () {
			requestAnimationFrame(window._animate);
			this.zoom = 1 + (0.5 * Math.sin(Date.now() / 2000) * 365 + 365 / 2)
		}.bind(this);
		if (!window._animate) {
			window._animate = this.animate.bind(this);
			window._animate();
		}
		window._animate = this.animate.bind(this);
	}

	this.onpointerhover = function(e){
		this.hoverid = this.last_pick_id
	}
	this.typeface = function(){
		this.draworder = 5
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

			for(var i = 0; i < 100; i++) {
				mesh.add_x = random() * 600;
				mesh.add_y = random() * 600;
				mesh.add(view.text,0 ,0 ,0)
			}

			if(view.measure_with_cursor){
				mesh.computeBounds(true)
			}
			this.mesh = mesh
		}
	}

	this.pickrange = 512;
	define.class(this, 'eventrects', this.Shader, function(){
		this.updateorder = 0
		this.draworder = 5
		var vertstruct = define.struct({
			pos: vec2,
			id: float
		})

		this.mesh = vertstruct.array();

		this.update = function(){
			var view = this.view

			var mesh = this.mesh = vertstruct.array();
			for(var i = 1; i <= 512; i++) {
				var w = random() * 100 + 5
				var h = random() * 100 + 5
				var x = random() * 500 + 50
				var y = random() * 500 + 50
				mesh.pushQuad(
					x,y,i,
					x+w, y+0,i,
					x, y+h,i,
					x+w,y+h,i
				)
			}
		}
		this.position = function(){
			return vec4(mesh.pos, 0, 1) * view.totalmatrix * view.viewmatrix
		}
		this.color = function(){
			PickGuid = mesh.id
			if (view.hoverid == mesh.id) {
				return vec4(0, 1, 0, 1)
			}
			return vec4(1, 1, 1, 1)
		}
	})
	this.eventrects = true

	this.render = function() { return [

	]}

})
