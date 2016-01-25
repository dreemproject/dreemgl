define.class('$ui/label', function (require, $ui$, view) {

	this.attributes = {
		hoverid: -1,
		zoom: 1
	}


	this.hardrect = function(){
		this.mytex = require('$resources/textures/hex_tiles.png')
		this.color = function(){
			return vec4(mytex.sample(uv).rr, 0, 1)
		}
	}

	this.onpointerhover = function(e){
		this.hoverid = this.last_pick_id
	}

	this.hardrect = true
	this.bg = false

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

	this.flexdirection = 'row'
	this.flex = 1

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
				var w = random() * 10 + 5
				var h = random() * 10 + 5
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
