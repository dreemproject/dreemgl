define.class('$shaders/pickshader', function(require){

	this.props = {
		color: vec4('white'),
		cornerradius: vec4(2),
		borderwidth: vec4(0),
		bordercolor: vec4('#1f1f1f'),
		shadowradius: 10.0,
		shadowoffset: vec2(25.0, 25.0),
		shadowalpha: 0.35
	}

	this.shadowcolor = vec4(0,0,0,0.35)

	// basic rect
	this.geometry = {
		pos: vec3.array()
	}
	/*
	Faces IDs:
	┌───┬───┬───┐
	│ 5 │ 1 │ 6 │
	├───┼───┼───┤
	│ 2 │ 0 │ 3 │
	├───┼───┼───┤ ┌───┐
	│ 7 │ 4 │ 8 │ │ 9 │ <- shadow
	└───┴───┴───┘ └───┘
	*/


	this.geometry.pos.pushQuad(
		1.0,-1.0, 9.0,
		1.0, 1.0, 9.0,
	   -1.0,-1.0, 9.0,
	   -1.0, 1.0, 9.0
	)
	this.geometry.pos.pushQuad(
	   -0.5,-1.0, 5.0,
	   -0.5,-0.5, 5.0,
	   -1.0,-1.0, 5.0,
	   -1.0,-0.5, 5.0
	)
	this.geometry.pos.pushQuad(
		0.5,-1.0, 1.0,
		0.5,-0.5, 1.0,
	   -0.5,-1.0, 1.0,
	   -0.5,-0.5, 1.0
	)
	this.geometry.pos.pushQuad(
		1.0,-1.0, 6.0,
		1.0,-0.5, 6.0,
		0.5,-1.0, 6.0,
		0.5,-0.5, 6.0
	)
	this.geometry.pos.pushQuad(
	   -0.5,-0.5, 2.0,
	   -0.5, 0.5, 2.0,
	   -1.0,-0.5, 2.0,
	   -1.0, 0.5, 2.0
	)
	this.geometry.pos.pushQuad(
		0.5,-0.5, 0.0,
		0.5, 0.5, 0.0,
	   -0.5,-0.5, 0.0,
	   -0.5, 0.5, 0.0
	)
	this.geometry.pos.pushQuad(
	    1.0,-0.5, 3.0,
		1.0, 0.5, 3.0,
		0.5,-0.5, 3.0,
		0.5, 0.5, 3.0
	)
	this.geometry.pos.pushQuad(
	   -0.5, 0.5, 7.0,
	   -0.5, 1.0, 7.0,
	   -1.0, 0.5, 7.0,
	   -1.0, 1.0, 7.0
	)
	this.geometry.pos.pushQuad(
		0.5, 0.5, 4.0,
		0.5, 1.0, 4.0,
	   -0.5, 0.5, 4.0,
	   -0.5, 1.0, 4.0
	)
	this.geometry.pos.pushQuad(
		1.0, 0.5, 8.0,
		1.0, 1.0, 8.0,
		0.5, 0.5, 8.0,
		0.5, 1.0, 8.0
	)

	this.vertex = function(){

		if (static.visible < 0.5) return vec4(0.0)

		var pos = geometry.pos.xy
		var rad = props.cornerradius
		var bw = props.borderwidth

		face_id = geometry.pos.z

		if (face_id == 9.0 && length(props.shadowoffset) == 0.0 && props.shadowradius == 0.0) return vec4(0.0)

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
			outpos.xy = outpos.xy + vec2(1.0 - border_weights.w, 1.0 - border_weights.x) * rad.x
		}
		else if (pos.y < 0.0 && pos.x > 0.0) {
			outpos.xy = outpos.xy + vec2(border_weights.y - 1.0, 1.0 - border_weights.x) * rad.y
		}
		else if (pos.y > 0.0 && pos.x > 0.0) {
			outpos.xy = outpos.xy + vec2(border_weights.y - 1.0, border_weights.z - 1.0) * rad.z
		}
		else if (pos.y > 0.0 && pos.x < 0.0) {
			outpos.xy = outpos.xy + vec2(1.0 - border_weights.w, border_weights.z - 1.0) * rad.w
		}

		if (face_id == 9.0) {
			bw += vec4(props.shadowradius)
		}

		outpos.y = outpos.y - (bw.x) * border_weights.x
		outpos.y = outpos.y + (bw.z) * border_weights.z
		outpos.x = outpos.x + (bw.y) * border_weights.y
		outpos.x = outpos.x - (bw.w) * border_weights.w

		rectcoords = vec2(outpos.x, outpos.y)

		outpos.x = outpos.x + props.x
		outpos.y = outpos.y + props.y

		if (face_id == 9.0) {
			outpos.xy += vec2(props.shadowoffset)
		}

		return vec4(outpos, 1.0) * view.totalmatrix * system.viewmatrix
	}

	this.clampmix = function(col, col_src, dist){
		return mix(col, col_src, clamp(dist, 0., 1.))
	}

	this.pixel = function(){

		// center face
		if (face_id == 0.0) {
			return props.color
		}

		var EDGE_FACTOR = 2.0

		var dist = 0.0
		var bw = props.borderwidth
		var rad = props.shadowradius
		var out_col = vec4(props.color.rgb, 0.0)

		// edge patches
		if (face_id < 5.0) {
			var hwh = vec2(props.w * 0.5, props.h * 0.5)
			if (length(bw * border_weights) > 0.0) {
				var hb = vec2((bw.y + bw.w) / 2.0, (bw.x + bw.z) / 2.0)
				var b_off = vec2(bw.w, bw.x)
				dist = length(max((abs((rectcoords + b_off) - (hwh + hb)) - (hwh + hb)) + vec2(1.0 / EDGE_FACTOR), 0.0)) * EDGE_FACTOR
				out_col = clampmix(props.bordercolor, vec4(props.bordercolor.rgb, 0.0), dist)
			}
			dist = length(max((abs(rectcoords - hwh) - hwh) + vec2(1.0 / EDGE_FACTOR), 0.0)) * EDGE_FACTOR
			out_col = clampmix(props.color, out_col, dist)
			return out_col
		}

		var topleftcorner = props.cornerradius.x
		var toprightcorner = props.cornerradius.y
		var bottomrightcorner = props.cornerradius.z
		var bottomleftcorner = props.cornerradius.w

		var c1 = vec2(topleftcorner , topleftcorner)
		var c2 = vec2(props.w - toprightcorner, toprightcorner)
		var c3 = vec2(bottomleftcorner, props.h - bottomleftcorner)
		var c4 = vec2(props.w - bottomrightcorner, props.h - bottomrightcorner)

		var c1b = c1
		var c2b = c2
		var c3b = c3
		var c4b = c4

		// corner patches
		if (face_id < 9.0) {
			if (length(bw * border_weights) > 0.0) {
				if (face_id == 5.0) {
					var d = bw.w - bw.x
					var offset = vec2(max(d, 0.0), max(-d, 0.0))
					c1b = rectcoords - c1 + offset
					dist = distcirclecorner(c1b, topleftcorner + min(bw.x, bw.w), vec2(-1, -1))
				} else if (face_id == 6.0) {
					var d = bw.y - bw.x
					var offset = vec2(min(-d, 0.0), max(-d, 0.0))
					c2b = rectcoords - c2 + offset
					dist = distcirclecorner(c2b, toprightcorner + min(bw.y, bw.x), vec2(1, -1))
				} else if (face_id == 7.0) {
					var d = bw.w - bw.z
					var offset = vec2(max(d, 0.0), min(d, 0.0))
					c3b = rectcoords - c3 + offset
					dist = distcirclecorner(c3b, bottomleftcorner + min(bw.z, bw.w), vec2(-1, 1))
				} else if (face_id == 8.0) {
					var d = bw.z - bw.y
					var offset = vec2(max(-d, 0.0), max(d, 0.0))
					c4b = rectcoords - c4 - offset
					dist = distcirclecorner(c4b, bottomrightcorner + min(bw.y, bw.z), vec2(1, 1))
				}
				dist = (dist + 1.0 / EDGE_FACTOR) * EDGE_FACTOR
				out_col = clampmix(props.bordercolor, vec4(props.bordercolor.rgb, 0.0), dist)
			}

			if (face_id == 5.0) {
				dist = distcircle(rectcoords - c1, topleftcorner)
			} else if (face_id == 6.0) {
				dist = distcircle(rectcoords - c2, toprightcorner)
			} else if (face_id == 7.0) {
				dist = distcircle(rectcoords - c3, bottomleftcorner)
			} else if (face_id == 8.0) {
				dist = distcircle(rectcoords - c4, bottomrightcorner)
			}

			dist = (dist + 1.0 / EDGE_FACTOR) * EDGE_FACTOR
			out_col = clampmix(props.color, out_col, dist)
			return out_col
		}

		// shadow
		if (face_id == 9.0) {
			if (border_weights.x >= 0.5 && border_weights.w >= 0.5) {
				var d = bw.w - bw.x
				var offset = vec2(max(d, 0.0), max(-d, 0.0)) + vec2(-rad/2, -rad/2)
				c1b = rectcoords - c1 + offset
				dist = distcirclecorner(c1b, topleftcorner + min(bw.x, bw.w) + rad, vec2(-1, -1))
			}
			else if (border_weights.x >= 0.5 && border_weights.y >= 0.5) {
				var d = bw.y - bw.x
				var offset = vec2(min(-d, 0.0), max(-d, 0.0)) + vec2(rad/2, -rad/2)
				c2b = rectcoords - c2 + offset
				dist = distcirclecorner(c2b, toprightcorner + min(bw.y, bw.x) + rad, vec2(1, -1))
			}
			else if (border_weights.z >= 0.5 && border_weights.w >= 0.5) {
				var d = bw.w - bw.z
				var offset = vec2(max(d, 0.0), min(d, 0.0)) + vec2(-rad/2, rad/2)
				c3b = rectcoords - c3 + offset
				dist = distcirclecorner(c3b, bottomleftcorner + min(bw.z, bw.w) + rad, vec2(-1, 1))
			}
			else if (border_weights.y >= 0.5 && border_weights.z >= 0.5) {
				var d = bw.z - bw.y
				var offset = vec2(max(-d, 0.0), max(d, 0.0)) + vec2(-rad/2, -rad/2)
				c4b = rectcoords - c4 - offset
				dist = distcirclecorner(c4b, bottomrightcorner + min(bw.y, bw.z) + rad, vec2(1, 1))
			}

			dist = (dist + rad) * 1.0 / rad
			out_col = clampmix(this.shadowcolor, vec4(this.shadowcolor.rgb, 0.0), dist)
			return out_col
		}

		return 'purple'
	}

	this.distcircle = function(texpos, radius) {
		var distance = length(texpos) - radius
		return distance
	}

	this.distcirclecorner = function(texpos, radius, corner) {
		var t = vec2(max(texpos.x * corner.x,0.0), max(texpos.y * corner.y,0.0))
		var distance = length(t * corner) - radius
		return distance
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
