define.class('$shaders/pickshader', function(require){
	
	this.font = {
		texture:this.Texture
	}

	this.fgcolor = vec4('gray')
	this.fontsize = 10
	this.linespacing = 1.3
	this.baseline = 1

	this.canvas = {	
		fgcolor: vec4,
		outlinecolor: vec4,
		boldness: float,
		outline: float,
		x: float,		
		y: float,
		fontsize:float,
		minx:float,
		miny:float,
		maxx:float, 
		maxy:float,
		texminx:float,
		texminy:float,
		texmaxx:float,
		texmaxy:float,
		unicode:float,
		baseline:float,
		clipx:float,
		clipy:float,
		clipw:float,
		cliph:float
		//line: float,
		//char: float,
		//charpos: float,
		//addpos: float
		//w: float,
		//h: float,
		//texx2: float,
		//texx2: float,
	}

	this.defaults = {
//		x:'this.scope._layout?0:this.scope.x',
//		y:'this.scope._layout?0:this.scope.y',
//		fgcolor:'this.scope._layout?this.scope._fggcolor:this.scope.fgcolor'
	}

	this.font_style_t = define.struct({
		pos:vec2,
		fontsize:float,
		fgcolor: vec4,
		outlinecolor: vec4,
		boldness: float,
		outline: float,
		visible: bool
	}, "font_style_t")

	this.position = function(){
		// pass through the texture pos
		texturepos = mix(
			vec2(canvas.texminx, canvas.texminy),
			vec2(canvas.texmaxx, canvas.texmaxy),
			mesh.xy
		)
		return compute_position()		
	}

	this.color = function(){
		//return 'red'
		return sdf_draw()
	}	

	// default text style
	this.style = function(style){
		return style
	}

	this.pixelstyle = function(){
		return style
	}

	this.subpixel_off = 1.0115
	this.subpixel_distance = 3.
	this.polygonoffset = 0.
	this.pixel_contrast = 1.4
	this.pixel_gamma_adjust = vec3(1.2)

	this.font_pixelstyle_t = define.struct({
		pos: vec2,
		fontsize: float,
		fgcolor:vec4,
		outlinecolor: vec4,
		boldness: float,
		outline: float,
		field: float
	}, "font_pixelstyle_t")

	this.compute_position = function(){
		// we want to compute a measure of scale relative to the actual pixels
		var matrix = view.totalmatrix  * state.viewmatrix

		var s = font_style_t(
			vec2(canvas.x, canvas.y),
			canvas.fontsize,
			canvas.fgcolor,
			canvas.outlinecolor,
			canvas.boldness,
			canvas.outline,
			(abs(canvas.unicode - 10.)<0.001 || abs(canvas.unicode - 32.)<0.001)?false:true
		)

		s = style(s)
		
		var pos = mix(
			vec2(
				s.pos.x + s.fontsize * canvas.minx,
				s.pos.y - s.fontsize * canvas.miny + s.fontsize * canvas.baseline
			),
			vec2(
				s.pos.x + s.fontsize * canvas.maxx,
				s.pos.y - s.fontsize * canvas.maxy+ s.fontsize * canvas.baseline
			),
			mesh.xy
		)

		// plug it into varyings
		stylefgcolor = s.fgcolor
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
		var pos = mesh.xy

		var m = length(vec2(length(dFdx(pos)), length(dFdy(pos))))*0.05

		var dist = sdf_decode( sdf_lookup(texturepos)) * 0.003
		var boldness = stylepack.x

		dist -= boldness / 300.
		dist = dist / m * pixel_contrast

		if(stylepack.y>0.){
			dist = abs(dist) - (stylepack.y)
		}

		// TODO(aki): verify that this is correct
		if(dist > 1. + stylepack.y){
			discard
		}

		//return 'red'
		return vec4(stylefgcolor.xyz, antialias(-dist))
		//return vec4(col.rgb, pow(glyphy_antialias(-dist), mesh.gamma_adjust.x))
	}

	this.sdf_draw_subpixel_aa = function(){
		var pos = mesh.tex

		var m = length(vec2(length(dFdx(pos)), length(dFdy(pos))))*SQRT_1_2
		//var m = pixelscale*.5//0.005
		// screenspace length
		mesh.scaling = 500. * m

		var sub_delta = vec2((m / subpixel_distance)*0.1,0)

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
		dist = dist / m * pixel_contrast

		if(stylepack.z>0.){
			dist = abs(dist) - (stylepack.y)
		}

		// TODO(aki): verify that this is correct
		if(dist.y > 1. + stylepack.y){
			discard
		}

		var alpha = antialias(-dist)

		alpha = pow(alpha, pixel_gamma_adjust)
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
		drawWrap:function(str, x, y){
			if(x !== undefined) this.px = x
			if(y !== undefined) this.py = y
			// ok so how does this work.
			if(typeof str !== 'string') str = str+''

			// well first we get the buffer
			this.GETBUFFER(str.length)
			this.ARGSTO(this)

			var glyphs = (this.font || this.classNAME.font).glyphs
			var off = 0
			var strlen = str.length
			var linespacing = this.linespacing || this.classNAME.linespacing 
			var baseline = this.baseline || this.classNAME.baseline

			while(off < strlen){
				var wordwidth = 0
				for(var i = off; i < strlen; i++){
					var unicode = str.charCodeAt(i)
					if(unicode === 32) break
					wordwidth += glyphs[unicode].advance * this.fontsize
				}
				this.w = wordwidth 
				this.h = this.fontsize * linespacing
				if(wordwidth){
					// do alignment on a word width
					// if this.px > this.width lets move to the next line
					if(this.x > this.width){
						this.y += this.fontsize * linespacing
						this.x = 0 + this.marginleft
					}

					// lets output a word
					for(var i = off; i < strlen; i++){
						var unicode = str.charCodeAt(i)
						if(unicode === 32) break
						var info = glyphs[unicode]
						this._ADDTOBUFFER()
						this.x += info.advance * this.fontsize
					}
					off = i
				}
				else{
					off++
					this.x += glyphs[32].advance * this.fontsize
				}
				// lets skip spaces

				// and then lets loop for more words

			}
			this.px = this.x
			this.py = this.y
		},
		draw:function(str, x, y){
			// ok so how does this work.
			if(typeof str !== 'string') str = str+''

			var glyphs = (this.font || this.classNAME.font).glyphs
			var fontsize = this.fontsize || this.classNAME.fontsize
			var off = 0, width = 0,  strlen = str.length
			var linespacing = this.linespacing || this.classNAME.linespacing 
			var baseline = this.baseline || this.classNAME.baseline
			
			var width = 0
			for(var i = 0; i < strlen; i++){
				var unicode = str.charCodeAt(i)
				width += glyphs[unicode].advance * fontsize
			}

			this.w = width 
			this.h = fontsize * linespacing

			if(x !== undefined) this.px = x
			if(y !== undefined) this.py = y

			// well first we get the buffer
			this.GETBUFFER(str.length)
			this.ARGSTO(this)

			// do alignment on our full thing
			if((x === undefined || y === undefined)) this.runAlign(this.classNAME, buffer, strlen)

			// lets output a word
			for(var i = 0; i < strlen; i++){
				var unicode = str.charCodeAt(i)
				var info = glyphs[unicode]
				//console.log(buffer.length, this.y)
				//this.y = 0
				this._ADDTOBUFFER()

				this.x += info.advance * fontsize
			}
		},
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
				texminx:info.tmin_x,
				texminy:info.tmin_y,
				texmaxx:info.tmax_x,
				texmaxy:info.tmax_y,
				fontsize:fontsize,
				baseline:baseline
			})
		},


	}
})