define.class('$shaders/pickshader', function(require){

	this.props = {
		color: vec4("#959595"),
		bgcolor: vec4(1,1,1,0.8),
		inset: 2.0,
		range: vec2(0, 1)
	}

	this.pickalpha = 0.99

	// basic rect
	this.geometry = {
		pos: vec2.array()
	}

	this.geometry.pos.pushQuad(
		1.0,-1.0,
		1.0, 1.0,
	   -1.0,-1.0,
	   -1.0, 1.0
	)

	this.vertex = function(){
		if (props.visible < 0.5) return vec4(0.0)
		var outpos = vec3(
			(max(min(geometry.pos.x, 0.5), -0.5) + 0.5) * props.w,
			(max(min(geometry.pos.y, 0.5), -0.5) + 0.5) * props.h,
			props.z
		)

		rectcoords = vec2(outpos.x, outpos.y)

		is_horizontal = 1.0
		if (props.h > props.w) is_horizontal = 0.0

		outpos.x = outpos.x + props.x
		outpos.y = outpos.y + props.y
		return vec4(outpos, 1.0) * view.totalmatrix * system.viewmatrix
	}

	this.TL = 'vec2(-1,-1)'
	this.TR = 'vec2(1,-1)'
	this.BR = 'vec2(1,1)'
	this.BL = 'vec2(-1,1)'

	this.pixel = function(){
		var field = -100.0
		var radius = min(props.w, props.h) / 2.0
		var out_col = props.bgcolor

		var EDGE = min(length(vec2(length(dFdx(rectcoords)), length(dFdy(rectcoords)))) * SQRT_1_2, 1.0)
		var HALF_EDGE = EDGE / 2.0

		var c1 = rectcoords - vec2(HALF_EDGE) + TL * radius
		var c2 = rectcoords - vec2(HALF_EDGE) - vec2(props.w, 0) + TR * radius
		var c3 = rectcoords - vec2(HALF_EDGE) - vec2(0, props.h) + BL * radius
		var c4 = rectcoords - vec2(HALF_EDGE) - vec2(props.w, props.h) + BR * radius

		if (is_horizontal == 1.0) {
			c1 -= vec2(props.w * props.range.x, 0.0)
			c3 -= vec2(props.w * props.range.x, 0.0)
			c2 += vec2(props.w * (1.0 - props.range.y), 0.0)
			c4 += vec2(props.w * (1.0 - props.range.y), 0.0)
		} else {
			c1 -= vec2(0.0, props.h * props.range.x)
			c2 -= vec2(0.0, props.h * props.range.x)
			c3 += vec2(0.0, props.h * (1.0 - props.range.y))
			c4 += vec2(0.0, props.h * (1.0 - props.range.y))
		}

		field = max(distcirclecorner(c1, radius + EDGE - props.inset, TL), field)
		field = max(distcirclecorner(c2, radius + EDGE - props.inset, TR), field)
		field = max(distcirclecorner(c3, radius + EDGE - props.inset, BL), field)
		field = max(distcirclecorner(c4, radius + EDGE - props.inset, BR), field)

		field = (field + EDGE) * 1.0 / EDGE
		out_col = clampmix(props.color, out_col, field)

		return out_col
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
		}
	}
})
