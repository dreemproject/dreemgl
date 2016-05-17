define.class('$shaders/pickshader', function(require){

	this.position = function(){
		if(canvasprops.visible < 0.5) return vec4(0.)
		var pos = vec3(canvasprops.x + mesh.x * canvasprops.w, canvasprops.y + mesh.y * canvasprops.h, canvasprops.z)
		var res = vec4(pos, 1) * canvasprops.matrix * state.totalmatrix * state.viewmatrix
		return res
	}

	this.bgcolor = vec4('gray')

	this.color = function(){
		var col = canvasprops.bgcolor
//		return mix('red','green',mesh.y)
		return col// vec4(col.rgb, col.a)
	}

	this.defaults = {
	//	x:'this.scope._layout?0:this.scope.x',
//		y:'this.scope._layout?0:this.scope.y',
//		w:'this.scope._layout?this.scope._layout.width:this.scope.w',
//		h:'this.scope._layout?this.scope._layout.height:this.scope.h',
//		fgcolor:'this.scope._layout?this.scope._bgcolor:this.scope.color'
	}

	this.contentalign = 
	this.wrapalign = 

	this.canvasprops = {
		visible:float,
		matrix:mat4,
		bgcolor:vec4,
		x:float,
		y:float,
		w:float,
		h:float,
		z:float
	}

	this.canvasverbs = {
		begin:function(x, y, w, h, margin, padding, alignfn, wrapfn){
			//console.log(this.align.x)
			this.RECTARGS()

			this.x = x, this.y = y, this.w = w, this.h = h
			// just store the margin on our align
			this.align.margin = margin,
			this.beginAlign(
				alignfn !== undefined? alignfn: this.classNAME.aligncontent, 
				wrapfn !== undefined? wrapfn: this.classNAME.wrapcontent, 
				this.align.margin,
				padding
			)
			this.GETBUFFER()
		},
		end:function(dbg){
			var oldalign = this.align

			this.endAlign()
			var buffer = this.bufferNAME
			
			if(isNaN(oldalign.inx) || isNaN(oldalign.iny)){ 
				this.runAlign(buffer, 1, this.align.margin, oldalign)
			}
			else{ // we have to mark our nesting to be absolute and not touched by outer layouts
				this.markAbsolute(oldalign)
			}

			//console.error(this.align.x, this.align.y)
			this.CANVASTOBUFFER()

		},
		draw:function(x, y, w, h, margin){
			var doalign = isNaN(x) || isNaN(y)
			this.RECTARGS()
			this.GETBUFFER()
			this.ARGSTO(this)
			if(doalign) this.runAlign(buffer,1, margin)
			this.CANVASTOBUFFER()
		}
	}
})