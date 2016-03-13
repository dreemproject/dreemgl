define.class('$shaders/pickshader', function(){

	this.position = function(){
		if(canvas.visible < 0.5) return vec4(0.)
		var pos = vec3(canvas.x + mesh.x * canvas.w, canvas.y + mesh.y * canvas.h, canvas.z)
		var res = vec4(pos, 1) * canvas.matrix * view.totalmatrix * state.viewmatrix
		return res
	}

	this.fgcolor = vec4('gray')

	this.color = function(){
		var col = canvas.fgcolor
		return vec4(col.rgb, col.a)
	}

	this.defaults = {
		x:'this.scope._layout?0:this.scope.x',
		y:'this.scope._layout?0:this.scope.y',
		w:'this.scope._layout?this.scope._layout.width:this.scope.w',
		h:'this.scope._layout?this.scope._layout.height:this.scope.h',
		fgcolor:'this.scope._layout?this.scope._bgcolor:this.scope.color'
	}

	this.canvas = {
		visible:float,
		matrix:mat4,
		fgcolor:vec4,
		x:float,
		y:float,
		w:float,
		h:float,
		z:float
	}

	this.canvasverbs = {
		layer:function(){
			this.GETBUFFER()
		},
		draw:function(x, y, w, h){
			if(w === undefined && x !== undefined) w = x, x = undefined
			if(h ===undefined && y !== undefined) h = y, y = undefined
			// this processes the args and builds up a buffer
			this.GETBUFFER()
			this.ARGSTOCANVAS()
			if((x === undefined || y === undefined)) this.runAlign(this.classNAME, buffer)
			this.CANVASTOBUFFER()
		}
	}
})