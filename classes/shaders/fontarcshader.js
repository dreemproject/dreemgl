define.class('$shaders/fontsdfshader', function(require){
	
	this.font = {
		texture:this.Texture,
		tex_geom:ivec2(0),
		item_geom:ivec2(0),
		item_geom_f:vec2(0),
		tex_geom_f:vec2(0)
	}

	// ok how shall we do the different font types?
	// we need a different vertexshader
	// and we need a different pixelshader
	// i suggest we make a separate shader

	this.canvasverbs = {
		_ADDTOBUFFER:function(){
			var texx = ((info.atlas_x<<6) | info.nominal_w)
			var texy = ((info.atlas_y<<6) | info.nominal_h)
			//this.w = 
			//this.h = this.fontsize * this.linespacing
			// write the item
			this.CANVASTOBUFFER({
				minx:info.min_x,
				maxx:info.max_x,
				miny:info.min_y,
				maxy:info.max_y,
				unicode:unicode,
				texminx:texx,
				texminy:texy,
				fontsize:fontsize,
				baseline:baseline
			})
		},
		
	}

	this.position = function(){
		glyph = arc_vertex_transcode()
		return compute_position()		
	}

	this.color = function(){
		//return 'red'
		return atlas_draw()
	}

	this.arc_vertex_transcode = function(){
		var v = vec2(canvas.texminx, canvas.texminy)
		var g = ivec2(v)
		var corner = ivec2(mesh.xy)//ivec2(mod (v, 2.))
		// g /= 2
		var nominal_size = ivec2(mod(v, 64.))
		return vec4(corner * nominal_size, g * 4)
	}

	this.atlas_draw = function(){
		//'trace'
		var nominal_size = (ivec2(mod(glyph.zw, 256.)) + 2) / 4
		var atlas_pos = ivec2(glyph.zw) / 256
		var pos = glyph.xy
		/* isotropic antialiasing */
		var m = length(vec2(length(dFdx(pos)), length(dFdy(pos))))*SQRT_1_2//*0.1

		var dist = arc_sdf(glyph.xy, nominal_size, atlas_pos) //+ noise.noise3d(vec3(glyph.x, glyph.y, time))*0.6

		/*
		var s = font_pixelstyle_t(
			pos,

			view.fgcolor,
			view.outlinecolor,
			view.boldness,
			view.outlinethickness,
			view.outline,
			(abs(mesh.tag.x - 10.)<0.001 || abs(mesh.tag.x - 32.)<0.001)?false:true
		)
		*/

		dist -= stylepack.x

		dist = dist / m * pixel_contrast

		var dist2 = dist;
		if(stylepack.y>0.){
			dist2 = abs(dist) - (stylepack.y)
		}

		// TODO(aki): verify that this is correct
		if(dist > 1. + stylepack.y){
			discard
		}

		var alpha = antialias(-dist)
		var alpha2 = antialias(-dist2)

		return vec4(mix(stylefgcolor.rgb, styleoutlinecolor.rgb, alpha2-alpha), max(alpha, alpha2) * stylefgcolor.a )
	}

	// glyphy shader library
	this.INFINITY = '1e9'
	this.EPSILON = '1e-5'
	this.MAX_NUM_ENDPOINTS = '32'

	//this.paint = function(p, m, pixelscale){
	//	if(abs(mesh.tag.x-32.)<0.01 || abs(mesh.tag.x-10.)<0.01) discard
	//	return vec4(-1.)
	//}

	this.arc_t = define.struct({
		p0:vec2,
		p1:vec2,
		d:float
	}, 'arc_t')

	this.arc_endpoint_t = define.struct({
		/* Second arc endpoint */
		p:vec2,
		/* Infinity if this endpoint does not form an arc with the previous
		 * endpoint.  Ie. a "move_to".  Test with isinf().
		 * Arc depth otherwise.  */
		d:float
	}, 'arc_endpoint_t')

	this.arc_list_t = define.struct({
		/* Number of endpoints in the list.
		 * Will be zero if we're far away inside or outside, in which case side is set.
		 * Will be -1 if this arc-list encodes a single line, in which case line_* are set. */
		num_endpoints:int,

		/* If num_endpoints is zero, this specifies whether we are inside(-1)
		 * or outside(+1).  Otherwise we're unsure(0). */
		side:int,
		/* Offset to the arc-endpoints from the beginning of the glyph blob */
		offset:int,

		/* A single line is all we care about.  It's right here. */
		line_angle:float,
		line_distance:float /* From nominal glyph center */
	}, 'arc_list_t')

	this.isinf = function(v){
		return abs(v) >= INFINITY * .5
	}

	this.iszero = function(v){
		return abs(v) <= EPSILON * 2.
	}

	this.ortho = function(v){
		return vec2(-v.y, v.x)
	}

	this.float_to_byte = function(v){
		return int(v *(256. - EPSILON))
	}

	this.vec4_to_bytes = function(v){
		return ivec4(v *(256. - EPSILON))
	}

	this.float_to_two_nimbles = function(v){
		var f = float_to_byte(v)
		return ivec2(f / 16, int(mod(float(f), 16.)))
	}

	/* returns tan(2 * atan(d)) */
	this.tan2atan = function( d){
		var a = (2. * d)
		var b = (1. - d * d)
		return a/b
	}

	this.arc_endpoint_decode = function(v, nominal_size){
		var p =(vec2(float_to_two_nimbles(v.a)) + v.gb) / 16.
		var d = v.r
		if(d == 0.) d = INFINITY
		else d = float(float_to_byte(d) - 128) * .5 / 127.

		return arc_endpoint_t(p * vec2(nominal_size), d)
	}

	this.arc_center = function(a){
		return mix(a.p0, a.p1, .5) +
		 ortho(a.p1 - a.p0) /(2. * tan2atan(a.d))
	}

	this.arc_wedge_contains = function(a, p){
		var d2 = tan2atan(a.d)
		return dot(p - a.p0,(a.p1 - a.p0) * mat2(1,  d2, -d2, 1)) >= 0. &&
		 dot(p - a.p1,(a.p1 - a.p0) * mat2(1, -d2,  d2, 1)) <= 0.
	}

	this.arc_wedge_signed_dist_shallow = function(a, p){
		var v = normalize(a.p1 - a.p0)

		var line_d = dot(p - a.p0, ortho(v))// * .1abs on sin(time.sec+p.x)

		if(a.d == 0.)
			return line_d
		var d0 = dot((p - a.p0), v)
		if(d0 < 0.)
			return sign(line_d) * distance(p, a.p0)

		var d1 = dot((a.p1 - p), v)
		if(d1 < 0.)
			return sign(line_d) * distance(p, a.p1)

		var d2 = d0 * d1
		var r = 2. * a.d * d2
		r = r / d2
		if(r * line_d > 0.)
			return sign(line_d) * min(abs(line_d + r), min(distance(p, a.p0), distance(p, a.p1)))

		return line_d + r
	}

	this.arc_wedge_signed_dist = function(a, p){
		if(abs(a.d) <= .03) return arc_wedge_signed_dist_shallow(a, p)
		var c = arc_center(a)
		return sign(a.d) * (distance(a.p0, c) - distance(p, c))
	}

	this.arc_extended_dist = function(a, p){
		/* Note: this doesn't handle points inside the wedge. */
		var m = mix(a.p0, a.p1, .5)
		var d2 = tan2atan(a.d)
		if(dot(p - m, a.p1 - m) < 0.)
			return dot(p - a.p0, normalize((a.p1 - a.p0) * mat2(+d2, -1, +1, +d2)))
		else
			return dot(p - a.p1, normalize((a.p1 - a.p0) * mat2(-d2, -1, +1, -d2)))
	}

	this.arc_list_offset = function(p, nominal_size){
		var cell = ivec2(clamp(floor(p), vec2(0.,0.), vec2(nominal_size - 1)))
		return cell.y * nominal_size.x + cell.x
	}

	this.arc_list_decode = function(v, nominal_size){

		var l = arc_list_t()
		var iv = vec4_to_bytes(v)

		l.side = 0 /* unsure */

		if(iv.r == 0) { /* arc-list encoded */
			l.offset = (iv.g * 256) + iv.b
			l.num_endpoints = iv.a
			if(l.num_endpoints == 255) {
				l.num_endpoints = 0
				l.side = -1
			}
			else if(l.num_endpoints == 0){
				l.side = 1
			}

		}
		else { /* single line encoded */
			l.num_endpoints = -1
			l.line_distance = float(((iv.r - 128) * 256 + iv.g) - 0x4000) / float(0x1FFF)
											* max(float(nominal_size.x), float(nominal_size.y))
			l.line_angle = float(-((iv.b * 256 + iv.a) - 0x8000)) / float(0x7FFF) * 3.14159265358979
		}
		return l
	}


	this.arc_list = function(p, nominal_size, _atlas_pos){
		var cell_offset = arc_list_offset(p, nominal_size)
		var arc_list_data = atlas_lookup(cell_offset, _atlas_pos)
		return arc_list_decode(arc_list_data, nominal_size)
	}

	this.arc_sdf = function(p, nominal_size, _atlas_pos){

		var arc_list = arc_list(p, nominal_size, _atlas_pos)

		/* Short-circuits */
		if(arc_list.num_endpoints == 0) {
			/* far-away cell */
			return INFINITY * float(arc_list.side)
		}
		if(arc_list.num_endpoints == -1) {
			/* single-line */
			var angle = arc_list.line_angle //+ 90.*time
			var n = vec2(cos(angle), sin(angle))
			return dot(p -(vec2(nominal_size) * .5), n) - arc_list.line_distance
		}

		var side = float(arc_list.side)
		var min_dist = INFINITY
		var closest_arc = arc_t()
		var endpoint = arc_endpoint_t()
		var endpoint_prev = arc_endpoint_decode(atlas_lookup(arc_list.offset, _atlas_pos), nominal_size)

		for(var i = 1; i < MAX_NUM_ENDPOINTS; i++){
			if(i >= arc_list.num_endpoints) {
				break
			}

			endpoint = arc_endpoint_decode(atlas_lookup(arc_list.offset + i, _atlas_pos), nominal_size)

			var a = arc_t(endpoint_prev.p, endpoint.p, endpoint.d)
			a.p0 = endpoint_prev.p;
			a.p1 = endpoint.p;
			a.d = endpoint.d;

			endpoint_prev = endpoint

			if(!isinf(a.d)){

				if(arc_wedge_contains(a, p)) {
					var sdist = arc_wedge_signed_dist(a, p)
					var udist = abs(sdist) * (1. - EPSILON)
					if(udist <= min_dist) {
						min_dist = udist

						side = sdist <= 0. ? -1. : +1.
					}
				}
				else {
					var udist = min(distance(p, a.p0), distance(p, a.p1))
					if(udist < min_dist) {
						min_dist = udist
						side = 0. /* unsure */
						closest_arc = a
					}
					else if(side == 0. && udist == min_dist) {
						/* If this new distance is the same as the current minimum,
						* compare extended distances.  Take the sign from the arc
						* with larger extended distance. */
						var old_ext_dist = arc_extended_dist(closest_arc, p)
						var new_ext_dist = arc_extended_dist(a, p)

						var ext_dist = abs(new_ext_dist) <= abs(old_ext_dist) ?
							old_ext_dist : new_ext_dist

						//#ifdef SDF_PSEUDO_DISTANCE
						/* For emboldening and stuff: */
						min_dist = abs(ext_dist)
						//#endif
						side = sign(ext_dist)
					}
				}
			}
		}

		if(side == 0.) {
			// Technically speaking this should not happen, but it does.  So try to fix it.
			var ext_dist = arc_extended_dist(closest_arc, p)
			side = sign(ext_dist)
		}

		return min_dist * side
	}

	this.point_dist = function(p, nominal_size, _atlas_pos){
		var arc_list = arc_list(p, nominal_size, _atlas_pos)

		var side = float(arc_list.side)
		var min_dist = INFINITY

		if(arc_list.num_endpoints == 0){
			return min_dist
		}
		var endpoint  = arc_endpoint_t()
		var endpoint_prev = arc_endpoint_decode(atlas.lookup(arc_list.offset, _atlas_pos), nominal_size)
		for(var i = 1; i < MAX_NUM_ENDPOINTS; i++) {
			if(i >= arc_list.num_endpoints) {
				break
			}
			endpoint = arc_endpoint_decode(atlas.lookup(arc_list.offset + i, _atlas_pos), nominal_size)
			if(isinf(endpoint.d)) continue
			min_dist = min(min_dist, distance(p, endpoint.p))
		}
		return min_dist
	}


	this.sdf_encode = function(value){
		var enc = .75-.25 * value
		return vec4(enc,enc,enc,1.)
	}

	this.sdf_generate = function(){
		var glyph = glyph_vertex_transcode(coords)
		var nominal_size = (ivec2(mod(glyph.zw, 256.)) + 2) / 4
		var atlas_pos = ivec2(glyph.zw) / 256

		var p = glyph.xy
		return sdf_encode(sdf(p, nominal_size, atlas_pos))
	}

	this.atlas_lookup = function(offset, _atlas_pos){
		var pos = (vec2(_atlas_pos.xy * this.font.item_geom +
			ivec2(mod(float(offset), this.font.item_geom_f.x), offset / this.font.item_geom.x)) +
			vec2(.5, .5)) / this.font.tex_geom_f

		return texture2D(this.font.texture, pos, {
			MIN_FILTER: 'NEAREST',
			MAG_FILTER: 'NEAREST',
			WRAP_S: 'CLAMP_TO_EDGE',
			WRAP_T: 'CLAMP_TO_EDGE'
		})
	}
})