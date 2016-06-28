// create a little stamp based button with hover anim
define.class('$base/stamp', function(){

	define.class(this, 'Scrollbar', '$shaders/scrollbarshader', function(){

	})

	this.props = {
		color: vec4("#959595"),
		bgcolor: vec4(1,1,1,0.8),
		inset: 2,
		range: vec2(0.25, 0.9)
	}

	this.cursor = 'ns-resize'

	// this.vertical = function(){
	// 	if (this.vertical){
	// 		this.cursor = "ns-resize";
	// 	}else{
	// 		this.cursor = "ew-resize";
	// 	}
	// }

	this.states = {
		hover: {
			color: 'red'
		}
	}

	this.onpointerhover = function(event){
		this.state = this.states.hover
	}

	this.onpointerout = function(event){
		this.state = this.states.default
	}

	this.onpointerstart = function(){
	}

	this.onpointermove = function(){
		console.log(this)
		// 	var offset = this.value / this.total
		// 	var page = this.page / this.total
		// 	if (this.vertical){
		// 		var p = offset + event.movement[1] / this.layout.height
		// 	} else {
		// 		var p = offset + event.movement[0] / this.layout.width
		// 	}
		// 	var value = clamp(p, 0, 1 - page) * this.total
		// 	if(value != this.value){
		// 		this.value = value
		// 	}
	}

	this.onpointerend = function(event){
		this.state = event.isover ? this._previousstate : this.states.default
	}

	this.draw = function(){
		var c = this.canvas
		c.drawScrollbar(this)
	}

	this.canvasverbs = {
		draw: function(overload){
			this.STAMPPROPS()
			this.DRAWSTAMP()
		}
	}
})
