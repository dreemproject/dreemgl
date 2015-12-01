define.class(function(){

	// alright what does a draggable do?... well
	this.mouseleftdown = function(start){
		// ok we start dragging a rectangle
		// how does that work?
		var origin = this.pos
		this.mousemove = function(pos){
			var delta = [(pos[0]- start[0]), (pos[1]- start[1])]
			this.pos = [origin[0] + delta[0], origin[1] + delta[1]]
			origin[0] += delta[0], origin[1] += delta[1]
		}
	}

	this.mouseleftup = function(){
		this.mousemove = function(){}
	}

	// it waits for leftmousedown
	// then moves itself till leftmouseup
	// and make it do touch too

})