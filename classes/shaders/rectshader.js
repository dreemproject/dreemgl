define.class('$shaders/pickshader', function(require){

	var Canvas = require('$base/canvas').prototype

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

	Object.defineProperty(this, 'content',{
		set:function(value){
			this._content = 0
			if(value.indexOf('left') !== -1) this._content |= Canvas.LEFT
			if(value.indexOf('top') !== -1) this._content |= Canvas.TOP
			if(value.indexOf('right') !== -1) this._content |= Canvas.RIGHT
			if(value.indexOf('bottom') !== -1) this._content |= Canvas.BOTTOM
			if(value.indexOf('nowrap') !== -1) this._content |= Canvas.NOWRAP
		},
		get:function(){
			return this._content
		}
	})

	this.margin = [0,0,0,0]
	this.padding = [0,0,0,0]

	this.canvasverbs = {
		begin:function(x, y, w, h, margin, padding, flags){
			this.RECTARGS()
			this.x = x, this.y = y, this.w = w, this.h = h
			this.beginAlign(
				flags !== undefined? flags: this.classNAME._content, 
				margin !== undefined? margin: this.classNAME.margin,
				padding !== undefined? padding: this.classNAME.padding
			)
			this.GETBUFFER()
		},
		end:function(){
			var oldalign = this.align 
			this.endAlign()
			// copy over the max height
			var buffer = this.bufferNAME
			// if this thing wraps we need to do stuff
			if(isNaN(oldalign.inx) || isNaN(oldalign.iny)){ 
				this.runAlign(this.classNAME, buffer, 1, oldalign)
			}
			this.CANVASTOBUFFER()
		},
		draw:function(x, y, w, h){
			var doalign = isNaN(x) || isNaN(y)
			this.RECTARGS()
			// this processes the args and builds up a buffer
			this.GETBUFFER()
			this.ARGSTO(this)
			if(doalign) this.runAlign(this.classNAME, buffer)
			this.CANVASTOBUFFER()
		}
	}
})