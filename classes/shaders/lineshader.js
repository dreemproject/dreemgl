define.class('$shaders/pickshader', function(require){
	
	this.props = {
		prevposx: 0,
		prevposy: 0,
		startposx: 0,
		startposy: 0,

		endposx: 0,
		endposy: 0,
		nextposx: 0,
		nextposy: 0,

		color: vec4('white'),
		outlinewidth: vec4(0),
		outlinecolor: vec4('#1f1f1f'),
		shadowradius: 0.25,
		shadowoffset: vec2(2, 2),
		shadowalpha: 0.35
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

	//this.dump = 1
	this.vertex = function(){
		if(props.visible < 0.5) return vec4(0.)
	
		var pos = geometry.pos
		var border = vec2(0., 0.)
		if(pos.x < -.5){
			if(pos.y < -.5) border = props.borderwidth.wx
			else border = props.borderwidth.wz
		}
		else{
			if(pos.y <= -.5) border = props.borderwidth.yx
			else border = props.borderwidth.yz
		}

		var posfac = pos*.5+.5

		var out3 = vec3(
			posfac.x * props.w,// + border.x * pos.x,
			posfac.y * props.h,// + border.y * pos.y, 
			props.z
		)
		
		if(pos.z > .5){
			if(props.shadowradius < 0.001){
				return vec4(0.)
			}
			out3.x += pos.x * props.shadowradius + props.shadowoffset.x
			out3.y += pos.y * props.shadowradius + props.shadowoffset.y
			isshadow = 1.
		}
		else{
			isshadow = 0.
		}

		coordpos = out3.xy

		// store rounded corner maximae
		roundcornermax = vec4(
			max(max(max(props.cornerradius.x, props.cornerradius.z), props.borderwidth.w),1.),
			max(max(max(props.cornerradius.x, props.cornerradius.y), props.borderwidth.x),1.),
			props.w - max(max(max(props.cornerradius.y, props.cornerradius.w), props.borderwidth.y),1.),
			props.h - max(max(max(props.cornerradius.w, props.cornerradius.z), props.borderwidth.z),1.)
		)

		equalborder = 
			abs(props.borderwidth.x - props.borderwidth.y) +
			abs(props.borderwidth.z - props.borderwidth.w) +
			abs(props.borderwidth.y - props.borderwidth.z) < 0.01?1.0:0.

		var res = vec4(vec3(out3.x + props.x, out3.y + props.y, out3.z), 1) * view.totalmatrix * system.viewmatrix
		return res 
	}

	this.bordermix = function(dist, wd){
		// do the field
		if(dist < - 0.5*wd){
			return mix(props.bordercolor, props.color, clamp(abs(dist+.5*wd)-.5*wd,0.,1.))
		}
		else{
			return mix(props.bordercolor, vec4(props.bordercolor.xyz,0.), clamp(dist,0.,1.))
		}
	}

	this.pixel = function(){
		if(isshadow > 0.5){
			// return props.shadowcolor
			var dist = roundedshadowdistance(coordpos + vec2(props.shadowradius) - props.shadowoffset.xy) * 2.
			dist =  (dist + props.shadowradius) / props.shadowradius
			return mix(vec4(this.shadowcolor.xyz, props.shadowalpha), vec4(this.shadowcolor.xyz,0.),clamp(dist,0.,1.))
		}
		else{
			var dist = roundedrectdistance(coordpos) * 2.
			if(dist < -10000.){
				return props.color
			}
			else{
				if(equalborder>0.5){
					var wd = props.borderwidth.x
					if(wd > 0.){
						return bordermix(dist, wd)
					}
				}
				else{ // do the lines
					if(props.borderwidth.x > 0.01 && coordpos.y < roundcornermax.y){
						return bordermix(-coordpos.y, props.borderwidth.x) 
					}
					if(props.borderwidth.z > 0.01 && coordpos.y > roundcornermax.w){
						return bordermix(coordpos.y-props.h, props.borderwidth.z) 
					}
					if(props.borderwidth.w > 0.01 && coordpos.x < roundcornermax.x){
						return bordermix(-coordpos.x, props.borderwidth.w) 
					}
					if(props.borderwidth.y > 0.01 && coordpos.x > roundcornermax.z){
						return bordermix(coordpos.x-props.w, props.borderwidth.y) 
					}
				}
			}
			return mix(props.color, vec4(props.color.xyz,0), dist)
		}
	}

	this.roundedrectdistance = function(sized){
		var width = props.w
		var height = props.h
		var topleftcorner = props.cornerradius.x
		var toprightcorner = props.cornerradius.y
		var bottomleftcorner = props.cornerradius.z
		var bottomrightcorner = props.cornerradius.w

		var c1 = vec2(topleftcorner , topleftcorner)
		var c2 = vec2(bottomleftcorner, height - bottomleftcorner)
		var c3 = vec2(width - bottomrightcorner, height - bottomrightcorner)
		var c4 = vec2(width - toprightcorner, toprightcorner)

		var dist = 0.0

		var dt = roundcornermax
		
		if(sized.x > dt.x && sized.y > dt.y && sized.x < dt.z && sized.y < dt.w){
			return -100000.	
		}

		if (sized.x <= c1.x && sized.y < c1.y) {
			return distcircle(sized - c1, topleftcorner)
		} 
		if (sized.x >= c3.x && sized.y >= c3.y) {
			return  distcircle(sized - c3, bottomrightcorner)
		} 
		if (sized.x <= c2.x && sized.y >= c2.y) {
			return distcircle(sized - c2, bottomleftcorner)
		}
		if (sized.x >= c4.x && sized.y <= c4.y) {
			return distcircle(sized - c4, toprightcorner)
		}

		var hwh = vec2(.5*width, .5*height)
		var d = abs(sized - hwh) - hwh
		return min(max(d.x,d.y),0.) + length(max(d,0.))
	}

	this.roundedshadowdistance = function(sized){
		var width = props.w + props.shadowradius * 2
		var height = props.h + props.shadowradius * 2
		var topleftcorner = props.cornerradius.x + props.shadowradius
		var toprightcorner = props.cornerradius.y + props.shadowradius
		var bottomleftcorner = props.cornerradius.z + props.shadowradius
		var bottomrightcorner = props.cornerradius.w + props.shadowradius

		var c1 = vec2(topleftcorner, topleftcorner)
		var c2 = vec2(bottomleftcorner, height - bottomleftcorner)
		var c3 = vec2(width - bottomrightcorner, height - bottomrightcorner)
		var c4 = vec2(width - toprightcorner, toprightcorner)

		var dist = 0.0

		var dt = roundcornermax

		if (sized.x <= c1.x && sized.y < c1.y) {
			return  distcircle(sized - c1, topleftcorner)
		} 
		if (sized.x >= c3.x && sized.y >= c3.y) {
			return  distcircle(sized - c3, bottomrightcorner)
		} 
		if (sized.x <= c2.x && sized.y >= c2.y) {
			return distcircle(sized - c2, bottomleftcorner)
		}
		if (sized.x >= c4.x && sized.y <= c4.y) {
			return distcircle(sized - c4, toprightcorner)
		}

		var hwh = vec2(.5*width, .5*height)
		var d = abs(sized - hwh) - hwh
		return min(max(d.x,d.y),0.) + length(max(d,0.))
	}

	this.distcircle = function (texpos, radius) {
		var c = texpos
		var distance = length(c) - radius;
		return distance;
	}

	this.canvasverbs = {
		draw:function(overload){
			this.GETPROPS()
			this.ALLOCPROPS()
			this.walkTurtle()
			this.PUTPROPS()
		},
		begin:function(overload){
			this.GETPROPS()
			this.ALLOCPROPS()
			this.beginTurtle()
		},
		end:function(){
			var t = this.turtle
			this.endTurtle()
			this.walkTurtle(t)
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
