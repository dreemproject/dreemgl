define.class('$shaders/pickshader', function(require){
	
	this.props = {
		matrix: mat4.identity(),
		color: vec4('gray'),
		visible: 1.0
	}

	//this.dump = 1
	this.vertex = function(){
		if(props.visible < 0.5) return vec4(0.)
		var pos = vec3(props.x + geometry.pos.x * props.w, props.y + geometry.pos.y * props.h, props.z)
		var res = vec4(pos, 1) * props.matrix * view.totalmatrix * system.viewmatrix
		return res 
	}

	this.pixel = function(){
		var col = props.color
		return col
	}

	this.canvasverbs = {
		draw:function(overload){
			this.GETPROPS()
			this.walkTurtle()
			this.PUTPROPS()
		},
		begin:function(overload){
			this.GETPROPS()
			this.beginTurtle()
		},
		end:function(){
			this.endTurtle()
			this.walkTurtle()
			this.PUTPROPS()
		}


		/*
			//overload, scope.propmap.Rect, scope.extstatemap.Rect, scope.statemap.Rect, clsobj 
			// canvasprops <- pops out of the shadercompiler, w types
			// layoutprops <- defined 

			/*
			// shader class with values
			this.x = overload && overload.x !=== undefined? overload.x: state.x === undefined? this.classRect.x: state.x
			this.y = ..
			this.w = ..	
			this.h = ..
			this.margin = state.margin === undefined? ..
			this.padding.

			// fetch the buffers
			// run alignment engine on x / y / w / h / margin / padding
			// run alignment on this
			// writes to canvasbuffer from this
			_array[...] = state.blarp === undefined? this.classRect.blarp: state.blarp

			this.RECTARGS()
			this.GETBUFFER()
			this.ARGSTO(this)
			this.runAlign(buffer,1, margin)
			this.CANVASTOBUFFER()
		
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

		draw2:function(x, y, w, h, margin){
			var doalign = isNaN(x) || isNaN(y)
			this.RECTARGS()
			this.GETBUFFER()
			this.ARGSTO(this)
			if(doalign) this.runAlign(buffer,1, margin)
			this.CANVASTOBUFFER()
		}*/
	}
})
