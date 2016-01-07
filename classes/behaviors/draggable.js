define.class(function(){

	// alright what does a draggable do?... well
	this.mouseleftdown = function(event){
		var start = event.local
		var startx = this.pos[0];
		var starty = this.pos[1];	
		
		var startposition = this.parent.localMouse();
		// ok we start dragging a rectangle
		// how does that work?
		this.mousemove = function(event){
			
			p = this.parent.localMouse()
			var dx = p[0] - startposition[0];
			var dy = p[1] - startposition[1];
	
			console.log(dx,dy);
	

			this.pos = [startx  + dx, starty + dy]
			//origin[0] += delta[0], origin[1] += delta[1]
		}
	}

	this.mouseleftup = function(){
		this.mousemove = function(){}
	}

	// it waits for leftmousedown
	// then moves itself till leftmouseup
	// and make it do touch too

})