define.class('$ui/label', function (require, $ui$, view) {

	this.text = ''
	this.bgcolor = NaN

	this.attributes = {
		data: Config({type: Array,  value: []}),
		zoom: Config({type: Number, value: wire('this.parent.zoom')}),
		scroll: wire('this.parent.scroll'),
		hoverid: -1,
		eventselected: Config({type:Event})
	}

	this.layout = function(){
		this.layout.width =  this.parent.layout.width
	}

	this.onpointerhover = function(event){
		this.hoverid = this.last_pick_id
		var eventData = this.data[this.hoverid]
		if (eventData) {
			this.emitUpward('eventselected', eventData)
		}
	}

	this.ondata = function (data) {
		this.pickrange = this.data.length
	}

	this.pickrange = 1024;

	define.class(this, 'eventrects', this.Shader, function(){

		var vertstruct = define.struct({
			pos: vec2,
			uv: vec2,
			id: float
		})
		this.mesh = vertstruct.array()

		var startTime = new Date("Jan 01 2016").getTime()

		this.update = function(){
			var view = this.view
			var data = view.data
			var mesh = this.mesh = vertstruct.array();
			for(var i = 0; i < data.length; i++) {

				// HACK: move dates to 2016 for demo
				var date = new Date(data[i].date)
				date.setYear(2016)

				var timeOffset = date.getTime() - startTime
				var dayOffset = timeOffset / 1000 / 60 / 60 / 24

				var w = 0
				var h = 1
				var x = dayOffset
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
