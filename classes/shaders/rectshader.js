define.class('$shaders/pickshader', function(require){

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
	//	x:'this.scope._layout?0:this.scope.x',
//		y:'this.scope._layout?0:this.scope.y',
//		w:'this.scope._layout?this.scope._layout.width:this.scope.w',
//		h:'this.scope._layout?this.scope._layout.height:this.scope.h',
//		fgcolor:'this.scope._layout?this.scope._bgcolor:this.scope.color'
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
		begin:function(x, y, w, h, margin, padding, flags){
			this.RECTARGS()
			this.x = x, this.y = y, this.w = w, this.h = h
			this.beginAlign(
				flags !== undefined? flags: this.classNAME._align, 
				margin !== undefined? margin: this.classNAME.margin,
				padding !== undefined? padding: this.classNAME.padding
			)
			this.GETBUFFER()
		},
		end:function(){
			var oldalign = this.align 
			this.endAlign()
			var buffer = this.bufferNAME
			if(isNaN(oldalign.inx) || isNaN(oldalign.iny)){ 
				this.align.computeh = false
				this.runAlign(this.classNAME, buffer, undefined, 1, oldalign)
			}
			else{ // we have to mark our nesting to be absolute and not touched by outer layouts
				this.markAbsolute(oldalign)
			}
			this.CANVASTOBUFFER()
		},
		draw:function(x, y, w, h, margin){
			var doalign = isNaN(x) || isNaN(y)
			this.RECTARGS()
			this.GETBUFFER()
			this.ARGSTO(this)
			if(doalign) this.runAlign(this.classNAME, buffer,1, margin)
			this.CANVASTOBUFFER()
		}
	}
})