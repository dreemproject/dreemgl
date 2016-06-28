define.class('$shaders/pickshader', function(require){
	
	this.font = {
		texture:this.Texture
	}

	this.props = {
		text:'',
		break:'',
		color: vec4('white'),
		outlinecolor: vec4(NaN),
		boldness: 0.,
		outline: 0.,
		x: NaN,
		y: NaN,
		fontsize:12,
		baseline:1,
		italic:NaN,
		linespacing:1.3,
		clipx:NaN,
		clipy:NaN,
		clipw:NaN,
		cliph:NaN,
		unicode:NaN,
		minx:NaN,
		miny:NaN,
		maxx:NaN, 
		maxy:NaN,
		texminx:NaN,
		texminy:NaN,
		texmaxx:NaN,
		texmaxy:NaN,
		waviness:10	
	}

	this.putprops = {
		clipx:true,
		clipy:true,
		clipw:true,
		cliph:true,
		unicode:true,
		minx:true,
		miny:true,
		maxx:true, 
		maxy:true,
		texminx:true,
		texminy:true,
		texmaxx:true,
		texmaxy:true		
	}

	this.staticprops = {
		clipx:true,
		clipy:true,
		clipw:true,
		cliph:true,
		unicode:true,
		minx:true,
		miny:true,
		maxx:true, 
		maxy:true,
		texminx:true,
		texminy:true,
		texmaxx:true,
		texmaxy:true		
	}

	this.pixel = function(){
		//return 'red'
		return sdf_draw()
	}	

	this.vertex = function(){
		// pass through the texture pos
		texturepos = mix(
			vec2(props.texminx, props.texminy),
			vec2(props.texmaxx, props.texmaxy),
			geometry.pos.xy
		)
		return compute_position()		
	}

	this.font_style_t = define.struct({
		pos:vec2,
		fontsize:float,
		color: vec4,
		outlinecolor: vec4,
		boldness: float,
		outline: float,
		visible: bool
	}, "font_style_t")

	this.font_pixelstyle_t = define.struct({
		pos: vec2,
		fontsize: float,
		color:vec4,
		outlinecolor: vec4,
		boldness: float,
		outline: float,
		field: float
	}, "font_pixelstyle_t")


	// default text style
	this.style = function(style){
		return style
	}

	this.pixelstyle = function(){
		return style
	}

	this.renderconfig = {
		subpixel_off: 1.0115,
		subpixel_distance: 3.,
		pixel_contrast: 1.4,
		pixel_gamma_adjust: vec3(1.2)
	}

	this.compute_position = function(){
		// we want to compute a measure of scale relative to the actual pixels
		var matrix = view.totalmatrix  * system.viewmatrix

		var s = font_style_t(
			vec2(props.x, props.y),
			props.fontsize,
			props.color,
			props.outlinecolor,
			props.boldness,
			props.outline,
			(abs(props.unicode - 10.)<0.001 || abs(props.unicode - 32.)<0.001)?false:props.visible>0.5?true:false
		)

		s = style(s)
		
		var pos = mix(
			vec2(
				s.pos.x + s.fontsize * props.minx,
				s.pos.y - s.fontsize * props.miny + s.fontsize * props.baseline
			),
			vec2(
				s.pos.x + s.fontsize * props.maxx,
				s.pos.y - s.fontsize * props.maxy+ s.fontsize * props.baseline
			),
			geometry.pos.xy
		)

		// plug it into varyings
		stylecolor = s.color
		styleoutlinecolor = s.outlinecolor
		stylepack = vec2(s.boldness, s.outline)

		// hide it
		if(!s.visible) return vec4(0.)

		var pos1 = vec4(pos.x, pos.y, 0., 1.) * matrix
		//pos1.w += polygonoffset;

		return pos1
	}

	// draw using SDF texture
	this.sdf_draw = function(){
		var pos = geometry.pos

		var m = length(vec2(length(dFdx(pos)), length(dFdy(pos))))*0.05

		var dist = sdf_decode( sdf_lookup(texturepos)) * 0.003
		var boldness = stylepack.x

		dist -= boldness / 300.
		dist = dist / m * renderconfig.pixel_contrast

		if(stylepack.y>0.){
			dist = abs(dist) - (stylepack.y)
		}

		// TODO(aki): verify that this is correct
		if(dist > 1. + stylepack.y){
			discard
		}

		return vec4(stylecolor.xyz, antialias(-dist))
	}

	this.sdf_draw_subpixel_aa = function(){
		var pos = geometry.pos

		var m = length(vec2(length(dFdx(pos)), length(dFdy(pos))))*SQRT_1_2
		//var m = pixelscale*.5//0.005
		// screenspace length
		//mesh.scaling = 500. * m

		var sub_delta = vec2((m / renderconfig.subpixel_distance)*0.1,0)

		var v1 = sdf_decode(sdf_lookup(pos - sub_delta*2.))
		var v2 = sdf_decode(sdf_lookup(pos - sub_delta))
		var v3 = sdf_decode(sdf_lookup(pos))
		var v4 = sdf_decode(sdf_lookup(pos + sub_delta))
		var v5 = sdf_decode(sdf_lookup(pos + sub_delta*2.))

		var dist = vec3(
			v1+v2+v3,
			v2+v3+v4,
			v3+v4+v5
		) * 0.001

		dist -= stylepack.x / 300.
		dist = dist / m * renderconfig.pixel_contrast

		if(stylepack.z>0.){
			dist = abs(dist) - (stylepack.y)
		}

		// TODO(aki): verify that this is correct
		if(dist.y > 1. + stylepack.y){
			discard
		}

		var alpha = antialias(-dist)

		alpha = pow(alpha, renderconfig.pixel_gamma_adjust)
		//var max_alpha = max(max(alpha.r,alpha.g),alpha.b)
		//if(max_alpha >0.5) max_alpha = 1.
		//return vec4(alpha.b<0.?'yellow'.rgb:'blue'.rgb, 1)
		return vec4(mix(view.bgcolor.rgb, stylefgcolor.rgb, alpha.rgb), view.opacity)//max_alpha)
	}

	this.sdf_decode = function(value){
		return ((.75-value.r)*4.)
	}

	this.sdf_lookup = function(pos){
		return texture2D(this.font.texture, pos, {
			MIN_FILTER: 'LINEAR',
			MAG_FILTER: 'LINEAR',
			WRAP_S: 'CLAMP_TO_EDGE',
			WRAP_T: 'CLAMP_TO_EDGE'
		})
	}

	this.antialias = function(d){
		return smoothstep(-.75, +.75, d)
	}

	this.canvasverbs = {
		draw:function(overload){

			var t = this.turtle

			this.GETPROPS()

			var text = t._text
			var len = text.length

			this.ALLOCPROPS(len)

			var glyphs = this.classNAME.font.glyphs
			var linespacing = t._linespacing
			var baseline = t._baseline
			var fontsize = t._fontsize
			var brk = t._break
			var off = 0
			t._h = fontsize * linespacing

			while(off < len){

				var breakwidth = 0
				var breaksize = 0
				for(var i = off; i < len; i++, breaksize++){
					var unicode = text.charCodeAt(i)
					if(brk){
						if(brk === 'word' && unicode === 32) break
						if(brk === 'char' && i === off+1) break
					}
					breakwidth += glyphs[unicode].advance * fontsize
				}

				if(breakwidth){
					t._w = breakwidth
					t._x = NaN
					this.walkTurtle()

					// lets output a word
					for(var i = 0; i < breaksize; i++){
						//console.log(breaksize, breakwidth)
						var unicode = text.charCodeAt(i+off)
						t._unicode = unicode
						var info = glyphs[unicode]
						this._ADDTOBUFFER()
						t._x += info.advance * fontsize
					}
					off += breaksize
				}
				else{
					t._w = glyphs[32].advance * fontsize
					off++
					t._x = NaN
					this.walkTurtle()
				}
			}
			this.SETPROPSLEN()
		},
		_ADDTOBUFFER:function(){
			var texx = ((info.atlas_x<<6) | info.nominal_w)
			var texy = ((info.atlas_y<<6) | info.nominal_h)
			//this.w = 
			//this.h = this.fontsize * this.linespacing
			// write the item
			this.PUTPROPS({
				minx:info.min_x,
				maxx:info.max_x,
				miny:info.min_y,
				maxy:info.max_y,
				unicode:unicode,
				texminx:info.tmin_x,
				texminy:info.tmin_y,
				texmaxx:info.tmax_x,
				texmaxy:info.tmax_y
			})
		}
	}
})