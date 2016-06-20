define.class('$shaders/pickshader', function(require){

	this.props = {
		color: vec4('white'),
		cornerradius: vec4(2),
		borderwidth: vec4(0),
		bordercolor: vec4('#1f1f1f'),
		shadowradius: 2.0,
		shadowoffset: vec2(3.0, 3.0),
		shadowalpha: 0.5
	}

	this.shadowcolor = vec4(0,0,0,0.35)

	// basic rect
	this.geometry = {
		pos: vec3.array()
	}


	this.geometry.pos.pushQuad(
		1.0,-1.0, 1.0,
		1.0, 1.0, 1.0,
	   -1.0,-1.0, 1.0,
	   -1.0, 1.0, 1.0
	)
	this.geometry.pos.pushQuad(
		1.0,-1.0, 0.0,
		1.0, 1.0, 0.0,
	   -1.0,-1.0, 0.0,
	   -1.0, 1.0, 0.0
	)

	this.vertex = function(){
		if (props.visible < 0.5) return vec4(0.0)

		var pos = geometry.pos.xy
		var cor = props.cornerradius
		var bw = props.borderwidth
		var rad = props.shadowradius

		face_id = geometry.pos.z

		// no shadow early out
		if (face_id == 1.0 && length(props.shadowoffset) == 0.0 && rad == 0.0) return vec4(0.0)

		border_weights = vec4(
			max(-pos.y * 2.0 - 1.0, 0.0),
			max(pos.x * 2.0 - 1.0, 0.0),
			max(pos.y * 2.0 - 1.0, 0.0),
			max(-pos.x * 2.0 - 1.0, 0.0))

		var outpos = vec3(
			(max(min(pos.x, 0.5), -0.5) + 0.5) * props.w,
			(max(min(pos.y, 0.5), -0.5) + 0.5) * props.h,
			props.z
		)

		if (pos.y < 0.0 && pos.x < 0.0) {
			outpos.xy = outpos.xy + vec2(1.0 - border_weights.w, 1.0 - border_weights.x) * cor.x
		}
		else if (pos.y < 0.0 && pos.x > 0.0) {
			outpos.xy = outpos.xy + vec2(border_weights.y - 1.0, 1.0 - border_weights.x) * cor.y
		}
		else if (pos.y > 0.0 && pos.x > 0.0) {
			outpos.xy = outpos.xy + vec2(border_weights.y - 1.0, border_weights.z - 1.0) * cor.z
		}
		else if (pos.y > 0.0 && pos.x < 0.0) {
			outpos.xy = outpos.xy + vec2(1.0 - border_weights.w, border_weights.z - 1.0) * cor.w
		}

		if (face_id == 1.0) {
			bw += vec4(rad / 2.0)
		}

		outpos.y = outpos.y - bw.x * border_weights.x
		outpos.y = outpos.y + bw.z * border_weights.z
		outpos.x = outpos.x + bw.y * border_weights.y
		outpos.x = outpos.x - bw.w * border_weights.w

		rectcoords = vec2(outpos.x, outpos.y)

		outpos.x = outpos.x + props.x
		outpos.y = outpos.y + props.y

		if (face_id == 1.0) {
			outpos.xy += vec2(props.shadowoffset)
		}

		roundcornermax = vec4(
			max(max(max(cor.x, cor.z), bw.w),1.),
			max(max(max(cor.x, cor.y), bw.x),1.),
			props.w - max(max(max(cor.y, cor.w), bw.y),1.),
			props.h - max(max(max(cor.w, cor.z), bw.z),1.)
		)

		return vec4(outpos, 1.0) * view.totalmatrix * system.viewmatrix
	}

	this.pixel = function(){
		// center face early out
		var dt = roundcornermax
		if(rectcoords.x > dt.x && rectcoords.y > dt.y && rectcoords.x < dt.z && rectcoords.y < dt.w){
			if (face_id == 0.0) {
				// center fill
				return props.color
			} else if (face_id == 1.0) {
				// center shadow
				return vec4(this.shadowcolor.rgb, this.shadowcolor.a * props.shadowalpha)
			}
		}

		var EDGE_FACTOR = 0.5
		var HALF_EDGE_FACTOR = EDGE_FACTOR / 2.0
		var TL = vec2(-1,-1)
		var TR = vec2(1,-1)
		var BR = vec2(1,1)
		var BL = vec2(-1,1)

		var dist_border = 0.0
		var dist_fill = 0.0
		var bw = props.borderwidth
		var cor = props.cornerradius
		var out_col = vec4(props.color.rgb, 0.0)

		var c1 = rectcoords - vec2(cor.x , cor.x)
		var c2 = rectcoords - vec2(props.w - cor.y, cor.y)
		var c3 = rectcoords - vec2(cor.w, props.h - cor.w)
		var c4 = rectcoords - vec2(props.w - cor.z, props.h - cor.z)

		if (face_id == 0.0) {
			if (border_weights.x >= 0.5 && border_weights.w >= 0.5) {
				var d = bw.w - bw.x
				var offset = vec2(min(-d, 0.0), min(d, 0.0)) - TL * HALF_EDGE_FACTOR
				dist_border = distcirclecorner(c1 - offset, cor.x + min(bw.x, bw.w) + EDGE_FACTOR, TL)
				dist_fill = distcirclecorner(c1, cor.x + EDGE_FACTOR, TL)
			}
			else if (border_weights.x >= 0.5 && border_weights.y >= 0.5) {
				var d = bw.y - bw.x
				var offset = vec2(max(d, 0.0), min(d, 0.0)) - TR * HALF_EDGE_FACTOR
				dist_border = distcirclecorner(c2 - offset, cor.y + min(bw.y, bw.x) + EDGE_FACTOR, TR)
				dist_fill = distcirclecorner(c2, cor.y + EDGE_FACTOR, TR)
			}
			else if (border_weights.z >= 0.5 && border_weights.w >= 0.5) {
				var d = bw.w - bw.z
				var offset = vec2(min(-d, 0.0), max(-d, 0.0)) - BL * HALF_EDGE_FACTOR
				dist_border = distcirclecorner(c3 - offset, cor.w + min(bw.z, bw.w) + EDGE_FACTOR, BL)
				dist_fill = distcirclecorner(c3, cor.w + EDGE_FACTOR, BL)
			}
			else if (border_weights.y >= 0.5 && border_weights.z >= 0.5) {
				var d = bw.z - bw.y
				var offset = vec2(max(-d, 0.0), max(d, 0.0)) - BR * HALF_EDGE_FACTOR
				dist_border = distcirclecorner(c4 - offset, cor.z + min(bw.y, bw.z) + EDGE_FACTOR, BR)
				dist_fill = distcirclecorner(c4, cor.z + EDGE_FACTOR, BR)
			}

			dist_border = (dist_border + EDGE_FACTOR) * 2.0 / EDGE_FACTOR
			out_col = clampmix(props.bordercolor, vec4(props.bordercolor.rgb, 0.0), dist_border)

			dist_fill = (dist_fill + EDGE_FACTOR) * 1.0 / EDGE_FACTOR
			out_col = clampmix(props.color, out_col, dist_fill)
			return out_col
		}

		// shadow
		if (face_id == 1.0) {
			var dist_shadow = 0.0
			var rad = props.shadowradius
			var hrad = rad / 2
			if (border_weights.x >= 0.5 && border_weights.w >= 0.5) {
				var d = bw.w - bw.x
				var offset = vec2(min(-d, 0.0), min(d, 0.0)) - vec2(-hrad, -hrad)
				dist_shadow = distcirclecorner(c1 - offset, cor.x + min(bw.x, bw.w) + rad, TL)
			}
			else if (border_weights.x >= 0.5 && border_weights.y >= 0.5) {
				var d = bw.y - bw.x
				var offset = vec2(max(d, 0.0), min(d, 0.0)) - vec2(hrad, -hrad)
				dist_shadow = distcirclecorner(c2 - offset, cor.y + min(bw.y, bw.x) + rad, TR)
			}
			else if (border_weights.z >= 0.5 && border_weights.w >= 0.5) {
				var d = bw.w - bw.z
				var offset = vec2(min(-d, 0.0), max(-d, 0.0)) - vec2(-hrad, hrad)
				dist_shadow = distcirclecorner(c3 - offset, cor.w + min(bw.z, bw.w) + rad, BL)
			}
			else if (border_weights.y >= 0.5 && border_weights.z >= 0.5) {
				var d = bw.z - bw.y
				var offset = vec2(max(-d, 0.0), max(d, 0.0)) - vec2(hrad, hrad)
				dist_shadow = distcirclecorner(c4 - offset, cor.z + min(bw.y, bw.z) + rad, BR)
			}
			dist_shadow = (dist_shadow + rad) * 1.0 / rad
			out_col = clampmix(vec4(this.shadowcolor.rgb, this.shadowcolor.a * props.shadowalpha), vec4(this.shadowcolor.rgb, 0.0), dist_shadow)
			return out_col
		}

		return 'purple'
	}

	this.distcirclecorner = function(texpos, radius, corner) {
		var t = vec2(max(texpos.x * corner.x, 0.0), max(texpos.y * corner.y, 0.0))
		var distance = length(t * corner) - radius
		return distance
	}

	this.clampmix = function(col, col_src, dist){
		return mix(col, col_src, clamp(dist, 0., 1.))
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
	}
})
