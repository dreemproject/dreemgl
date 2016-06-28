define.class('$shaders/pickshader', function(require){
	
	this.props = {
		p1x: 0,
		p1y: 0,

		p2x: 0,
		p2y: 0,
		p3x: 0,
		p3y: 0,

		p4x: 0,
		p4y: 0,

		sx:NaN,
		sy:NaN,

		color: vec4('white'),
		linewidth:50,
		outlinewidth: 0,
		outlinecolor: vec4('#1f1f1f'),
		shadowradius: 0.25,
		shadowoffset: vec2(2, 2),
		shadowalpha: 0.35
	}

	this.putprops={
		p1x: 1,
		p1y: 1,
		p2x: 1,
		p2y: 1,
		p3x: 1,
		p3y: 1,
		p4x: 1,
		p4y: 1
	}

	this.shadowcolor = vec4(0, 0, 0, 0.35)

	// baseic rect
	this.geometry = {
		pos:vec3.array()
	}

	// the line shadow
	this.geometry.pos.pushQuad(
		-1, -1, 1,  
		1, -1, 1,
		-1, 1, 1,
		1, 1, 1
	)

	// the line segment itself
	this.geometry.pos.pushQuad(
		-1, -1, 0,
		1, -1, 0,
		-1, 1, 0,
		1, 1, 0
	)

	this.geometry.pos.push(
		0, 0, -1,
		0.5, 1, -1,
		1, 0, -1
	)

	this.intersect = function(n1, dir1, n3, dir2, bail){
		var n2 = n1 + dir1
		var n4 = n3 + dir2
		var part0 = n1.x * n2.y - n1.y * n2.x
		var part1 = n3.x * n4.y - n3.y * n4.x
		var det = (n1.x - n2.x) * (n3.y - n4.y) - (n1.y - n2.y) * (n3.x - n4.x)
		if( abs(det)< 3.){
			return bail
		}
		return vec2(
			(part0 * (n3.x - n4.x) - (n1.x - n2.x) * part1) / det,
			(part0 * (n3.y - n4.y) - (n1.y - n2.y) * part1) / det
		)
	}

	//this.dump = 1
	this.vertex = function(){
		if(props.visible < 0.5) return vec4(0.)
	
		var pos = geometry.pos
		
		// miter cap
		if(pos.z <-0.5){
			return vec4(0.)
		}

		// shadow
		if(pos.z > 0.5){
			return vec4(0.)
		}

		var p1 = vec2(props.p1x, props.p1y)
		var p2 = vec2(props.p2x, props.p2y)
		var p3 = vec2(props.p3x, props.p3y)
		var p4 = vec2(props.p4x, props.p4y)

		// alright lets draw a rectangle from startpos to endpos
		var dir0 = p2 - p1
		var dir1 = p3 - p2
		var dir2 = p4 - p3

		var ndir0 = vec2(dir0.y, -dir0.x)
		var ndir1 = vec2(dir1.y, -dir1.x)
		var ndir2 = vec2(dir2.y, -dir2.x)

		// lets get the width normals
		var norm0 = normalize(ndir0) * props.linewidth *.5
		var norm1 = normalize(ndir1) * props.linewidth *.5//(normalize(ndir1) * props.linewidth)
		var norm2 = normalize(ndir2) * props.linewidth *.5//(normalize(ndir2) * props.linewidth)

		// get the mixing value for left/right side of our segment
		var m = pos.x * .5 + .5

		// make intersection without ifs
		//var outpos = vec2(0.)
		var outpos = intersect(
			mix(p1, p3, m) + mix(norm0, norm1, m) * pos.y,
			mix(dir0, dir1, m),
			mix(p2, p4, m) + mix(norm1, norm2, m) * pos.y,
			mix(dir1, dir2, m),
			mix(p2, p3, m) + norm1*pos.y
		)

		gradient = pos.y

		var res = vec4(outpos.x, outpos.y, 0., 1) * view.totalmatrix * system.viewmatrix
		return res 
	}

	this.pixel = function(){
		// we want a distance field in pixels?
		var lw = props.linewidth
		var grad = clamp(abs((abs(gradient)-1.)) * lw,0.,1.)
		return mix(vec4(props.color.xyz,0.),vec4(props.color.xyz,props.color.w),grad)
	}
	
	this.canvasverbs = {
		draw:function(overload){
			this.GETPROPS()
			this.ALLOCPROPS()

			// ok so, now we draw a line from _
			var t = this.turtle

			// if we have sx / sy defined
			if(isNaN(t._sx) || isNaN(t._sy)){
				// alright
				if(t._frameidNAME !== this.frameid){
					t._frameidNAME = this.frameid
					t._ptsNAME = 1
					t._p1xNAME = t._p2xNAME = t._p3xNAME = t._p4xNAME = t._x
					t._p1yNAME = t._p2yNAME = t._p3yNAME = t._p4yNAME = t._y
					return
				}

				// atleast have previous coordinate
				t._ptsNAME++
				t._p1xNAME = t._p2xNAME
				t._p1yNAME = t._p2yNAME
				t._p2xNAME = t._p3xNAME
				t._p2yNAME = t._p3yNAME
				t._p3xNAME = t._x
				t._p3yNAME = t._y
				t._p4xNAME = t._p3xNAME + (t._p3xNAME - t._p2xNAME)
				t._p4yNAME = t._p3yNAME + (t._p3yNAME - t._p2yNAME)

				if(t._ptsNAME === 2){// 2 points, align first 
					t._p1xNAME = t._p2xNAME - (t._p3xNAME - t._p2xNAME)
					t._p1yNAME = t._p2yNAME - (t._p3yNAME - t._p2yNAME)
				}
				else{
					// write back to previous output the new p1x
					this.PUTPREVIOUS({
						p4x: t._p3xNAME,
						p4y: t._p3yNAME
					})
				}
			}
			else{
				t._ptsNAME = 4
				t._p2xNAME = t.sx
				t._p2yNAME = t.sy
				t._p3xNAME = t._x
				t._p3yNAME = t._y
				t._p1xNAME = t._p2xNAME - (t._p3xNAME - t._p2xNAME)
				t._p1yNAME = t._p2yNAME - (t._p3yNAME - t._p2yNAME)
				t._p4xNAME = t._p3xNAME + (t._p3xNAME - t._p2xNAME)
				t._p4yNAME = t._p3yNAME + (t._p3yNAME - t._p2yNAME)
				if(isNaN(t._x) || isNaN(t._y)){
					t._p3xNAME = t.sx
					t._p3yNAME = t.sy
					t._ptsNAME = 1
					return
				}
			}
			this.PUTPROPS({
				p1x: t._p1xNAME,
				p1y: t._p1yNAME,
				p2x: t._p2xNAME,
				p2y: t._p2yNAME,
				p3x: t._p3xNAME,
				p3y: t._p3yNAME,
				p4x: t._p4xNAME,
				p4y: t._p4yNAME,
			})

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
