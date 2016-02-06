define.class('$ui/label', function (require, $ui$, view) {

	this.text = ''
	this.position = 'absolute'
	this.bgcolor = NaN

	this.attributes = {
		zoom: Config({type: Number, value: wire('this.parent.zoom')}),
		scroll: wire('this.parent.scroll'),
		hoverid: -1
	}

	this.layout = function(){
		this.layout.left = 0
		this.layout.top =  90
		this.layout.height =  this.parent.layout.height - 118
		this.layout.width =  this.parent.layout.width
	}

	this.onpointerhover = function(event){
		this.hoverid = this.last_pick_id
	}

	this.pickrange = 1024;

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
			for(var i = 1; i <= 1024; i++) {
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
			var pos = mesh.pos
			pos.x = pos.x - view.zoom * view.scroll[0]
			pos = pos * vec2(view.layout.width / view.zoom, view.layout.height)
			var w = mesh.uv.x * min(max(100 / view.zoom, 1.0), 50.0)
			pos = pos + vec2(w, 0.0)
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

})
