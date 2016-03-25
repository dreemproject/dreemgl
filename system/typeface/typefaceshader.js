/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/
// Parts copyright 2012 Google, Inc. All Rights Reserved. (APACHE 2.0 license)
define.class('$system/platform/$platform/shader$platform', function(require, exports, baseclass){
	//internal

	// the font
	this.font = require('$resources/fonts/opensans_regular_ascii.glf')

	// initial pixel and vertex shaders
	this.position = "glyphy_mesh()"
	this.color = "glyphy_pixel()"

	//this.fgcolor = vec4("blue")
	//this.boldness = 0
	//this.outline = false
	this.pixel_contrast = 1.4
	this.pixel_gamma_adjust = vec3(1.2)
	this.subpixel_off = 1.0115
	this.subpixel_distance = 3.

	// forward ref of things we need on view
	this.view = {
		_fgcolor:vec4(),
		_bgcolor:vec4(),
		_totalmatrix:mat4(),
		_viewmatrix:mat4(),
		_polygonoffset:0.0,
		_outlinecolor:vec4(),
		_outlinethickness:0.0,
		_boldness: 0.0,
		_outline: false,
		_opacity:1.0,
		textstyle: function(style, tag){ return style },
		//textstyle: function(fgcolor, pos, tag){return fgcolor;},
		//textpositionfn:function(pos, tag){return pos;},
		screen:{
				device:{
					frame:{
						size:vec2()
					}
				}
			}
	}

	// lets define a custom struct and subclass the array
	this.textgeom = define.struct({
		pos:vec4, // x y z w unicode in w
		tex:vec2,
		tag:vec4,
	}).extend(function(exports, self){

		this.align = "left"
		this.start_x = 0
		this.start_y = 0
		this.text_x = 0
		this.text_y = 0
		this.shift = vec2(0)
		this.add_x = 0
		this.add_y = 0

		this.fontsize = 10
		this.linespacing = 1.0
		this.italic_ness = 0
		// defines the line
		this.cursorspacing = 1.3
		this.cursor_sink = 0.32

		this.scaling = 0
		this.distance = 0

		this.debug = false

		//this.bgcolor = vec3('black')
		//this.fgcolor = vec4('white')

		this.__defineGetter__('line_height', function(){
			return this.fontsize * this.linespacing
		})

		this.__defineGetter__('min_y', function(){
			return this.fontsize * this.linespacing
		})

		this.__defineGetter__('block_y', function(){
			return this.add_y - this.line_height + this.cursor_sink * this.fontsize
		})

		this.__defineGetter__('bound_w', function(){
			return this.text_w
		})

		this.__defineGetter__('bound_h', function(){
			return this.text_h + this.cursor_sink * this.fontsize
		})

		this.clear = function(){
			this.text_w = 0
			this.text_h = 0
			this.add_x = this.start_x
			this.add_y = this.start_y //=== null? this.min_y:0
		}

		this.measurestring = function(string){
			var res = {w:0, h:0};
			if (!string || string.length == 0) return res;

			var length = string.length
			// alright lets convert some text babeh!
			for(var i = 0; i < length; i++){
				var unicode = string.struct? string.array[i * 4]: string.charCodeAt(i)
				var info = this.font.glyphs[unicode]
				if(!info) info = this.font.glyphs[32]
				res.w += info.advance * this.fontsize
			}

			return res;
		}

		this.addWithinWidth = function(string, maxwidth, indent, m1, m2, m3){

			if (!indent)  indent = 0;
			var words = string.split(' ');
			var lines = []
			var widths  = []
			var currentline = []
			var currentw = this.add_x;

			for(var i = 0;i < words.length; i++) {
				var s = this.measurestring("_" + words[i]);
				if (currentw > 0) {
					if (currentw + s.w > maxwidth) {
						lines.push(currentline);
						widths.push(currentw);
						currentw = indent;
						currentline = [];
					}
				}
				currentw+= s.w;
				currentline.push(words[i]);
			}

			if (currentline.length > 0) {
				lines.push(currentline);
				widths.push(currentw);
			}

			if (this.align === "left") {
				for (var i = 0;i<lines.length;i++) {
					var line = lines[i];
					for (var j = 0;j<line.length;j++) this.add(line[j] + ((j<line.length-1)?' ':'') , m1, m2, m3);
					if (i < lines.length -1)
					{
						this.add_y += this.fontsize * this.cursorspacing
						this.add_x = indent;
					}
				}
			} else if (this.align === "right") {
				for (var i = 0;i<lines.length;i++) {
					this.add_x = maxwidth - widths[i];
					var line = lines[i];
					for (var j = 0;j<line.length;j++) this.add(line[j] + ' ', m1, m2, m3);
					this.add_y += this.fontsize * this.cursorspacing
				}
			} else if (this.align === "center") {
				for (var i = 0;i<lines.length;i++) {
					this.add_x = maxwidth/2 - widths[i]/2;
					var line = lines[i];
					for (var j = 0;j<line.length;j++) this.add(line[j] + ' ', m1, m2, m3);
					this.add_y += this.fontsize * this.cursorspacing
				}
			} else if (this.align === "justify") {
				for (var i = 0;i<lines.length;i++) {
					this.add_x = 0;
					var line = lines[i];
					var spacer = 0;

					if (line.length > 1)  spacer = (maxwidth - widths[i])/ (line.length-1)

					for (var j = 0;j<line.length;j++) {
						this.add(line[j]+' ', m1, m2, m3);
						this.add_x += spacer;
					}
					this.add_y += this.fontsize * this.cursorspacing
				}
			}

		}


		self.pushQuad = function(){
			this.clean = false
			var slots = this.slots
			if(arguments.length !== slots * 4) throw new Error('Please use individual components to set a quad for '+slots)
			var off = this.length * slots
			this.length += 6
			if(this.length >= this.allocated){
				this.ensureSize(this.length)
			}
			// ok so lets just write it out
			var out = this.array
			for(var i = 0; i < slots; i++){ // iterate the components
				out[off + i      ] = arguments[i]
				out[off + i + 1*slots] = out[off + i + 4*slots] = arguments[i + 1*slots]
				out[off + i + 2*slots] = out[off + i + 3*slots] = arguments[i + 2*slots]
				out[off + i + 5*slots] = arguments[i + 3*slots]
			}
		}

		// what do we need to know?


		this.addGlyph = function(info, unicode, m1, m2, m3) {

			var fontsize = this.fontsize
			var x1 = this.add_x + fontsize * info.min_x
			var x2 = this.add_x + fontsize * info.max_x
			var y1 = this.add_y - fontsize * info.min_y
			var y2 = this.add_y - fontsize * info.max_y
			var advance = info.advance
			var italic = this.italic_ness * info.height * fontsize
			var cz = this.add_z ? this.add_z:0;
			var dx = 0
			this.clean = false
			var slots = this.slots
			//if(arguments.length !== slots * 4) throw new Error('Please use individual components to set a quad for '+slots)

			var o = this.length * slots
			this.length += 6
			if(this.length >= this.allocated){
				this.ensureSize(this.length)
			}

			// m1 is the formatting layout
			if(m1 < 0){
				var format = m1 * -1
				//var m1info = unicode === 10?this.font.glyphs[9]:info
				//var indent = parseInt(m1/65536)
				var mode = Math.floor(format/256)%256
				var padding = format%256
				// mode is 1, space left
				// mode is 2, space right
				// mode is 3, space left/right
				// mode is 4, scale indent
				if(mode){
					var padskip = padding * info.advance * fontsize
					if(mode&1) x1 += padskip, x2 += padskip, dx += padskip
					if(mode&2) dx += padskip
					if(mode == 4){
						x2 += padskip, dx = (padding - 1)* info.advance * fontsize
					}
				}
			}
			else if(unicode === 10){
				x2 = 0
				advance = 0
			}
			var a = this.array

			if(this.font.baked){
				// INLINED for optimization.
				a[o + 2] = a[o + 12] = a[o + 32] = a[o + 22] = a[o + 52] = a[o + 42] = cz
				a[o + 3] = a[o + 13] = a[o + 33] = a[o + 23] = a[o + 53] = a[o + 43] = fontsize
				a[o + 6] = a[o + 16] = a[o + 36] = a[o + 26] = a[o + 56] = a[o + 46] = unicode
				a[o + 7] = a[o + 17] = a[o + 37] = a[o + 27] = a[o + 57] = a[o + 47] = m1
				a[o + 8] = a[o + 18] = a[o + 38] = a[o + 28] = a[o + 58] = a[o + 48] = m2
				a[o + 9] = a[o + 19] = a[o + 39] = a[o + 29] = a[o + 59] = a[o + 49] = m3
				// top left
				a[o + 0] = x1
				a[o + 1] = y1
				a[o + 4] = info.tmin_x
				a[o + 5] = info.tmin_y

				// top right
				a[o + 10] = a[o + 30] = x2
				a[o + 11] = a[o + 31] = y1
				a[o + 14] = a[o + 34] = info.tmax_x
				a[o + 15] = a[o + 35] = info.tmin_y
				// bottom left
				a[o + 20] = a[o + 50] = x1+italic
				a[o + 21] = a[o + 51] = y2
				a[o + 24] = a[o + 54] = info.tmin_x
				a[o + 25] = a[o + 55] = info.tmax_y
				// bottom right
				a[o + 40] = x2 + italic
				a[o + 41] = y2
				a[o + 44] = info.tmax_x
				a[o + 45] = info.tmax_y

				/*
				this.pushQuad(
					x1, y1, cz, fontsize, info.tmin_x, info.tmin_y, unicode, m1, m2, m3,
					x2, y1, cz, fontsize, info.tmax_x, info.tmin_y, unicode, m1, m2, m3,
					x1 + italic, y2, cz, fontsize, info.tmin_x, info.tmax_y, unicode, m1, m2, m3,
					x2 + italic, y2, cz, fontsize, info.tmax_x, info.tmax_y, unicode, m1, m2, m3
				)*/
			}
			else {
				var gx = ((info.atlas_x<<6) | info.nominal_w)<<1
				var gy = ((info.atlas_y<<6) | info.nominal_h)<<1

				// INLINED for optimization. text is used a lot
				a[o + 2] = a[o + 12] = a[o + 32] = a[o + 22] = a[o + 52] = a[o + 42] = cz
				a[o + 3] = a[o + 13] = a[o + 33] = a[o + 23] = a[o + 53] = a[o + 43] = fontsize
				a[o + 6] = a[o + 16] = a[o + 36] = a[o + 26] = a[o + 56] = a[o + 46] = unicode
				a[o + 7] = a[o + 17] = a[o + 37] = a[o + 27] = a[o + 57] = a[o + 47] = m1
				a[o + 8] = a[o + 18] = a[o + 38] = a[o + 28] = a[o + 58] = a[o + 48] = m2
				a[o + 9] = a[o + 19] = a[o + 39] = a[o + 29] = a[o + 59] = a[o + 49] = m3
				// top left
				a[o + 0] = x1
				a[o + 1] = y1
				a[o + 4] = gx
				a[o + 5] = gy

				// top right
				a[o + 10] = a[o + 30] = x2
				a[o + 11] = a[o + 31] = y1
				a[o + 14] = a[o + 34] = gx|1
				a[o + 15] = a[o + 35] = gy
				// bottom left
				a[o + 20] = a[o + 50] = x1+italic
				a[o + 21] = a[o + 51] = y2
				a[o + 24] = a[o + 54] = gx
				a[o + 25] = a[o + 55] = gy|1
				// bottom right
				a[o + 40] = x2 + italic
				a[o + 41] = y2
				a[o + 44] = gx|1
				a[o + 45] = gy|1
				/*
				this.pushQuad(
					x1, y1, cz, fontsize, gx, gy, unicode, m1, m2, m3,
					x2, y1, cz, fontsize, gx|1, gy, unicode, m1, m2, m3,
					x1 + italic, y2, cz,fontsize, gx, gy|1, unicode, m1, m2, m3,
					x2 + italic, y2, cz, fontsize, gx|1, gy|1, unicode, m1, m2, m3
				)*/
			}
			this.add_x += advance * fontsize + dx
			if(this.add_x > this.text_w) this.text_w = this.add_x
		}

		this.computeBounds = function(with_cursor){
			var text_w = 0
			var text_h = 0
			var length = this.lengthQuad()
			for(var i = 0; i < length; i++){
				var o = i  * 6 * 10
				var x1 = this.array[o]
				var y1 = this.array[o + 1]
				var fontsize = this.array[o + 3]
				var unicode = this.array[o + 6]
				var info = this.font.glyphs[unicode]
				if(!info) info = this.font.glyphs[32]
				var add_x = x1 - fontsize * info.min_x + (unicode === 10 ? 0 : info.advance * fontsize)
				var add_y = y1 + fontsize * info.min_x //+ this.fontsize * this.linespacing
				if(add_x > text_w) text_w = add_x
				if(add_y > text_h) text_h = add_y
			}
			if(with_cursor){
				var info = this.font.glyphs[32]
				if (info) {
					text_w += info.advance * this.fontsize
					if(!text_h) text_h = this.fontsize * this.linespacing
				}
			}
			this.text_w = text_w
			this.text_h = text_h
		}

		// lets add some strings
		this.add = function(string, im1, im2, im3){
			var length = string.length
			this.ensureSize(this.length + length)

			var m1 = im1, m2 = im2, m3 = im3
			// alright lets convert some text babeh!
			var array
			if(string.struct) array = string.array
			var glyphs = this.font.glyphs
			for(var i = string.start || 0; i < length; i++){
				var unicode
				if(array){
					unicode = array[i * 4]
					m1 = array[i*4+1]
					m2 = array[i*4+2]
					m3 = array[i*4+3]
				}
				else{
					unicode = string.charCodeAt(i)
				}

				var info = glyphs[unicode]
				if(!info) info = glyphs[32], unicode = 32

				// lets add some vertices
				if(unicode == 10){ // newline
					this.add_x = this.start_x
					this.add_y += this.fontsize * this.cursorspacing
				}

				this.addGlyph(info, unicode, m1, m2, m3)
				//if(!(m1<0) &&  unicode == 10){ // newline
				//	this.add_x = this.start_x
				//	this.add_y += this.fontsize * this.linespacing
				//}
			}
			if(this.add_y > this.text_h) this.text_h = this.add_y
		}

		// lets add some strings
		this.addAtPos = function(string, pos, m1, m2, m3){
			var length = string.length

			this.add_x = pos[0];
			this.add_y = pos[1];
			this.add_z = pos[2];

			// alright lets convert some text babeh!
			for(var i = 0; i < length; i++){
				var unicode = string.struct? string.array[i * 4]: string.charCodeAt(i)
				var info = this.font.glyphs[unicode]
				if(!info) info = this.font.glyphs[32]
				// lets add some vertices
				this.addGlyph(info, unicode, m1, m2, m3)
				if(unicode == 10){ // newline
					this.add_x = this.start_x
					this.add_y += this.fontsize * this.cursorspacing
				}
			}
			if(this.add_y > this.text_h) this.text_h = this.add_y
		}

		this.__defineGetter__('char_count', function(){
			return this.lengthQuad()
		})

		// get the character coordinates
		this.charCoords = function(off){
			if(off >= this.lengthQuad()){
				return {
					x:this.add_x,
					y:this.add_y, //- this.line_height +this.fontsize * this.cursor_sink,
					w:0,
					h:this.line_height
				}
			}
			var info = this.font.glyphs[this.charCodeAt(off)]
			if(!info) info = this.font.glyphs[32]
			if(isNaN(off))debugger
			var coords = {
				x: this.array[off * 6 * 10 + 0] - this.fontsize * info.min_x,
				y: this.array[off * 6 * 10 + 1] + this.fontsize * info.min_y,
				w: info.advance * this.fontsize,
				h: this.line_height
			}
			return coords
		}

		this.char_tl_x = function(off){
			return this.array[off * 6 * 10 + 0]
		}

		this.char_tr_x = function(off){
			return this.array[off * 6 * 10 + 0 + 10]
		}

		this.tagAt = function(off, tagid){
			return this.array[off * 6 * 10 + 6 + (tagid||0)]
		}

		this.offsetFromTag = function(tagid, tag, start){
			var off = start || 0, len = this.length
			while(Math.abs(this.array[off * 6 * 10 + 7 + tagid] - tag) > 0.001){

				if(off >= len) return -1
				off ++

			}
			return off
		}

		this.offsetFromPos = function(x, y){
			var height = this.line_height
			//console.log(x, y)
			//if(y < 0) return -2
			var array = this.array
			var fontsize = this.fontsize
			var line_height = this.line_height
			var glyphs = this.font.glyphs
			var sink = fontsize * this.cursor_sink

			for(var len = this.lengthQuad(), o = len - 1; o >= 0; o--){

				var char_code = parseInt(array[o * 6*10 + 6])
				var info = glyphs[char_code]

				var y2 = array[o * 6 * 10 + 1] + fontsize * info.min_y + sink
				var y1 = y2 - line_height

				if(y>=y1 && y<=y2){
					var tl_x = this.array[o * 6 * 10 + 0]
					var tr_x = this.array[o * 6 * 10 + 0 + 10]
					var hx = (tl_x+tr_x)/2

					// lets debug paint these 2
					if(this.debug_mesh){
						this.debug_mesh.length = 0
						this.debug_mesh.add(tl_x, y1, 3, 3, 0.)
						this.debug_mesh.add(tr_x, y2, 3, 3, 1.)
						this.debug_mesh.add(x, y, 3, 3, 2.)
					}

					if(this.charCodeAt(o-1) == 10 && x< tl_x){
						return o
					}
					if(x >= tl_x && x <= hx){
						return o
					}
					if(o == 0 && x < tl_x){
						return -1 // to the left
					}
					if(o == len - 1 && x > tr_x){
						//if(char_code ==10) return o
						return -4 // to the right of self
					}
					if(x > hx){
						//if(char_code == 10) return o
						return o + 1
					}
				}
				if(y>y2){
					//console.log(y, y2, -3)
					return -3 // below self
				}
			}
			return -2 // above self
		}

		this.cursorRect = function(off){
			var coords= this.charCoords(off)
			// do a little bit of alignment fixery
			var m1 = this.tagAt(off,1)
			if(m1<0){

				// lets check the alignment mode
				var format = m1 * -1
				//var indent = parseInt(m1/65536)
				var mode = Math.floor(format/256)%256

				if(this.charCodeAt(off) === 10){
					coords = this.charCoords(off-1)
					if(this.charCodeAt(off-1) !== 10){
						coords.x = coords.x + coords.w
					}
					else{
						// add padd
						coords.x = coords.x + coords.w
						var padding = format%256
						var info = this.font.glyphs[10]
						var fontsize = this.array[off * 6 * 10 + 3]
						coords.x += (padding-1) * info.advance * fontsize
					}
				}
				else if(mode&1){
					var coords1 = this.charCoords(off - 1)
					coords.x = coords1.x + coords1.w
				}
			}
			coords.y -= coords.h - this.fontsize * this.cursor_sink
			return coords
		}

		this.charCodeAt = function(off){
			return this.array[off * 6 * 10 + 6]
		}

		this.charAt = function(off){
			return String.fromCharCode(this.charCodeAt(off))
		}

		this.serializeText = function(start, end){
			var str = ''
			for(var i = start; i < end; i++){
				str += String.fromCharCode(this.charCodeAt(i))
			}
			return str
		}

		this.serializeTags = function(start, end){
			// lets serialize the tags array
			var out = vec4.array(end - start)
			var a = this.array
			var o = out.array
			for(var i = start, x = 0; i < end; x +=4, i++){
				o[x] = a[i * 6 * 10 + 6]
				o[x+1] = a[i * 6 * 10 + 7]
				o[x+2] = a[i * 6 * 10 + 8]
				o[x+3] = a[i * 6 * 10 + 9]
			}
			out.length = x>>2
			return out
		}

		this.setLength = function(len){

			// if we are inserting at a newline, we need to grab the previous
			var off = len
			if(this.charCodeAt(len) === 10) off -=1
			var m1 = this.array[off * 6 * 10 + 7]
			// if its a padded character we need to compute the new add_x differently
			if(m1<0 && (-m1)&65535){

				var format = m1 * -1
				//var indent = parseInt(m1/65536)
				var mode = Math.floor(format/256)%256
				var rect = this.charCoords(off)

				this.length = len * 6
				this.add_x = rect.x //+ rect.w
				this.add_y = rect.y
				// rip off padding

				if(mode&1){
					var padding = format%256
					var info = this.font.glyphs[this.array[off * 6 * 10 + 6]]
					var fontsize = this.array[off * 6 * 10 + 3]
					this.add_x -= padding * info.advance * fontsize//- rect.w
				}
				else if(mode&2){
					console.log(2)
					var padding = format%256
					var info = this.font.glyphs[this.array[off * 6 * 10 + 6]]
					var fontsize = this.array[off * 6 * 10 + 3]
					this.add_x += padding * info.advance * fontsize//- rect.w
				}
				else if(mode === 4){
					console.log(4)
					var padding = format%256
					var info = this.font.glyphs[this.array[off * 6 * 10 + 6]]
					var fontsize = this.array[off * 6 * 10 + 3]
					this.add_x += padding * info.advance * fontsize - rect.w
				}
				return
			}

			var rect = this.charCoords(off)
			this.length = len * 6
			this.add_x = rect.x
			this.add_y = rect.y
			if(off !== len)this.add_x += rect.w
		}

		this.insertText = function(off, text){
			// ok lets pull in the 'rest' as string
			//var str = this.serializeText(off, this.lengthQuad())
			var tags = this.serializeTags(off, this.lengthQuad())
			// lets set the length and start adding
			var rect = this.charCoords(off)
			this.setLength(off)
			this.add(text)
			this.add(tags)
			this.computeBounds(true)
			return text.length
		}

		this.removeText = function(off, end){
			var tags = this.serializeTags(end, this.lengthQuad())
			this.setLength(off)
			this.add(tags)
			// recompute the bounds
			this.computeBounds(true)

			return tags.length
		}
	})

	// for type information
	this.mesh = this.textgeom.array()

	// this thing makes a new text array buffer
	this.newText = function(length){
		var buf = this.textgeom.array((length||0)*6)
		buf.font = this.font
		buf.clear()
		return buf
	}

	this.subpixel = false

	this.glyphy_mesh_sdf = function(){
		return glyphy_compute_position()
	}


	this.glyphy_mesh_atlas = function(){
		glyph = glyph_vertex_transcode(mesh.tex)
		return glyphy_compute_position()
	}

	// glyphy shader library
	this.GLYPHY_INFINITY = '1e9'
	this.GLYPHY_EPSILON = '1e-5'
	this.GLYPHY_MAX_NUM_ENDPOINTS = '32'

	//this.paint = function(p, m, pixelscale){
	//	if(abs(mesh.tag.x-32.)<0.01 || abs(mesh.tag.x-10.)<0.01) discard
	//	return vec4(-1.)
	//}

	this.moddist = function(pos, dist){
		return dist
	}

	this.glyphy_arc_t = define.struct({
		p0:vec2,
		p1:vec2,
		d:float
	}, 'glyphy_arc_t')

	this.glyphy_arc_endpoint_t = define.struct({
		/* Second arc endpoint */
		p:vec2,
		/* Infinity if this endpoint does not form an arc with the previous
		 * endpoint.  Ie. a "move_to".  Test with glyphy_isinf().
		 * Arc depth otherwise.  */
		d:float
	}, 'glyphy_arc_endpoint_t')

	this.glyphy_arc_list_t = define.struct({
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
	}, 'glyphy_arc_list_t')

	this.glyphy_isinf = function(v){
		return abs(v) >= GLYPHY_INFINITY * .5
	}

	this.glyphy_iszero = function(v){
		return abs(v) <= GLYPHY_EPSILON * 2.
	}

	this.glyphy_ortho = function(v){
		return vec2(-v.y, v.x)
	}

	this.glyphy_float_to_byte = function(v){
		return int(v *(256. - GLYPHY_EPSILON))
	}

	this.glyphy_vec4_to_bytes = function(v){
		return ivec4(v *(256. - GLYPHY_EPSILON))
	}

	this.glyphy_float_to_two_nimbles = function(v){
		var f = glyphy_float_to_byte(v)
		return ivec2(f / 16, int(mod(float(f), 16.)))
	}

	/* returns tan(2 * atan(d)) */
	this.glyphy_tan2atan = function( d){
		var a = (2. * d)
		var b = (1. - d * d)
		return a/b
	}

	this.glyphy_arc_endpoint_decode = function(v, nominal_size){
		var p =(vec2(glyphy_float_to_two_nimbles(v.a)) + v.gb) / 16.
		var d = v.r
		if(d == 0.) d = GLYPHY_INFINITY
		else d = float(glyphy_float_to_byte(d) - 128) * .5 / 127.

		return glyphy_arc_endpoint_t(p * vec2(nominal_size), d)
	}

	this.glyphy_arc_center = function(a){
		return mix(a.p0, a.p1, .5) +
		 glyphy_ortho(a.p1 - a.p0) /(2. * glyphy_tan2atan(a.d))
	}

	this.glyphy_arc_wedge_contains = function(a, p){
		var d2 = glyphy_tan2atan(a.d)
		return dot(p - a.p0,(a.p1 - a.p0) * mat2(1,  d2, -d2, 1)) >= 0. &&
		 dot(p - a.p1,(a.p1 - a.p0) * mat2(1, -d2,  d2, 1)) <= 0.
	}

	this.glyphy_arc_wedge_signed_dist_shallow = function(a, p){
		var v = normalize(a.p1 - a.p0)

		var line_d = dot(p - a.p0, glyphy_ortho(v))// * .1abs on sin(time.sec+p.x)

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

	this.glyphy_arc_wedge_signed_dist = function(a, p){
		if(abs(a.d) <= .03) return glyphy_arc_wedge_signed_dist_shallow(a, p)
		var c = glyphy_arc_center(a)
		return sign(a.d) * (distance(a.p0, c) - distance(p, c))
	}

	this.glyphy_arc_extended_dist = function(a, p){
		/* Note: this doesn't handle points inside the wedge. */
		var m = mix(a.p0, a.p1, .5)
		var d2 = glyphy_tan2atan(a.d)
		if(dot(p - m, a.p1 - m) < 0.)
			return dot(p - a.p0, normalize((a.p1 - a.p0) * mat2(+d2, -1, +1, +d2)))
		else
			return dot(p - a.p1, normalize((a.p1 - a.p0) * mat2(-d2, -1, +1, -d2)))
	}

	this.glyphy_arc_list_offset = function(p, nominal_size){
		var cell = ivec2(clamp(floor(p), vec2(0.,0.), vec2(nominal_size - 1)))
		return cell.y * nominal_size.x + cell.x
	}

	this.glyphy_arc_list_decode = function(v, nominal_size){

		var l = glyphy_arc_list_t()
		var iv = glyphy_vec4_to_bytes(v)

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

	this.glyphy_antialias = function(d){
		return smoothstep(-.75, +.75, d)
	}

	this.glyphy_arc_list = function(p, nominal_size, _atlas_pos){
		var cell_offset = glyphy_arc_list_offset(p, nominal_size)
		var arc_list_data = glyphy_atlas_lookup(cell_offset, _atlas_pos)
		return glyphy_arc_list_decode(arc_list_data, nominal_size)
	}

	this.glyphy_sdf = function(p, nominal_size, _atlas_pos){

		var arc_list = glyphy_arc_list(p, nominal_size, _atlas_pos)

		/* Short-circuits */
		if(arc_list.num_endpoints == 0) {
			/* far-away cell */
			return GLYPHY_INFINITY * float(arc_list.side)
		}
		if(arc_list.num_endpoints == -1) {
			/* single-line */
			var angle = arc_list.line_angle //+ 90.*time
			var n = vec2(cos(angle), sin(angle))
			return dot(p -(vec2(nominal_size) * .5), n) - arc_list.line_distance
		}

		var side = float(arc_list.side)
		var min_dist = GLYPHY_INFINITY
		var closest_arc = glyphy_arc_t()
		var endpoint = glyphy_arc_endpoint_t()
		var endpoint_prev = glyphy_arc_endpoint_decode(glyphy_atlas_lookup(arc_list.offset, _atlas_pos), nominal_size)

		for(var i = 1; i < GLYPHY_MAX_NUM_ENDPOINTS; i++){
			if(i >= arc_list.num_endpoints) {
				break
			}

			endpoint = glyphy_arc_endpoint_decode(glyphy_atlas_lookup(arc_list.offset + i, _atlas_pos), nominal_size)

			var a = glyphy_arc_t(endpoint_prev.p, endpoint.p, endpoint.d)
			a.p0 = endpoint_prev.p;
			a.p1 = endpoint.p;
			a.d = endpoint.d;

			endpoint_prev = endpoint

			if(!glyphy_isinf(a.d)){

				if(glyphy_arc_wedge_contains(a, p)) {
					var sdist = glyphy_arc_wedge_signed_dist(a, p)
					var udist = abs(sdist) * (1. - GLYPHY_EPSILON)
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
						var old_ext_dist = glyphy_arc_extended_dist(closest_arc, p)
						var new_ext_dist = glyphy_arc_extended_dist(a, p)

						var ext_dist = abs(new_ext_dist) <= abs(old_ext_dist) ?
							old_ext_dist : new_ext_dist

						//#ifdef GLYPHY_SDF_PSEUDO_DISTANCE
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
			var ext_dist = glyphy_arc_extended_dist(closest_arc, p)
			side = sign(ext_dist)
		}

		return min_dist * side
	}

	this.glyphy_point_dist = function(p, nominal_size, _atlas_pos){
		var arc_list = glyphy_arc_list(p, nominal_size, _atlas_pos)

		var side = float(arc_list.side)
		var min_dist = GLYPHY_INFINITY

		if(arc_list.num_endpoints == 0){
			return min_dist
		}
		var endpoint  = glyphy_arc_endpoint_t()
		var endpoint_prev = glyphy_arc_endpoint_decode(glyphy_atlas.lookup(arc_list.offset, _atlas_pos), nominal_size)
		for(var i = 1; i < GLYPHY_MAX_NUM_ENDPOINTS; i++) {
			if(i >= arc_list.num_endpoints) {
				break
			}
			endpoint = glyphy_arc_endpoint_decode(glyphy_atlas.lookup(arc_list.offset + i, _atlas_pos), nominal_size)
			if(glyphy_isinf(endpoint.d)) continue
			min_dist = min(min_dist, distance(p, endpoint.p))
		}
		return min_dist
	}

	this.glyph_vertex_transcode = function(v){
	  var g = ivec2(v)
	  var corner = ivec2(mod (v, 2.))
	  g /= 2
	  var nominal_size = ivec2(mod (vec2(g), 64.))
	  return vec4(corner * nominal_size, g * 4)
	}

	this.glyphy_sdf_encode = function(value){
		var enc = .75-.25 * value
		return vec4(enc,enc,enc,1.)
	}

	this.glyphy_sdf_decode = function(value){
		return ((.75-value.r)*4.)
	}

	this.glyphy_sdf_generate = function(){
		var glyph = glyph_vertex_transcode(glyphy_coords)
		var nominal_size = (ivec2(mod(glyph.zw, 256.)) + 2) / 4
		var atlas_pos = ivec2(glyph.zw) / 256

		var p = glyph.xy
		return glyphy_sdf_encode(glyphy_sdf(p, nominal_size, atlas_pos))
	}

	this.glyphy_sdf_lookup = function(pos){
		return texture2D(mesh.font.texture, pos, {
			MIN_FILTER: 'LINEAR',
			MAG_FILTER: 'LINEAR',
			WRAP_S: 'CLAMP_TO_EDGE',
			WRAP_T: 'CLAMP_TO_EDGE'
		})
	}

	this.glyphy_atlas_lookup = function(offset, _atlas_pos){
		var pos = (vec2(_atlas_pos.xy * mesh.font.item_geom +
			ivec2(mod(float(offset), mesh.font.item_geom_f.x), offset / mesh.font.item_geom.x)) +
			vec2(.5, .5)) / mesh.font.tex_geom_f

		return texture2D(mesh.font.texture, pos, {
			MIN_FILTER: 'NEAREST',
			MAG_FILTER: 'NEAREST',
			WRAP_S: 'CLAMP_TO_EDGE',
			WRAP_T: 'CLAMP_TO_EDGE'
		})
	}

	// draw using atlas
	this.time = 0

	this.atExtend = function(){
		this.mesh.font = this.font
		baseclass.atExtend.call(this)
	}

	this.font_style_t = define.struct({
		pos:vec3,
		fgcolor: vec4,
		outlinecolor: vec4,
		boldness: float,
		outlinethickness: float,
		outline: bool,
		visible: bool
	}, "font_style_t")

	// default text style
	this.style = function(style, tag){
		return style
	}

	this.glyphy_compute_position = function(){
		// we want to compute a measure of scale relative to the actual pixels
		var matrix = view.totalmatrix  * view.viewmatrix

		var s = font_style_t(
			vec3(mesh.pos.x + mesh.shift.x, mesh.pos.y + mesh.shift.y, mesh.pos.z),
			view.fgcolor,
			view.outlinecolor,
			view.boldness,
			view.outlinethickness,
			view.outline,
			(abs(mesh.tag.x - 10.)<0.001 || abs(mesh.tag.x - 32.)<0.001)?false:true
		)

		s = view.textstyle(s, mesh.tag)
		// plug it into varyings
		stylefgcolor = s.fgcolor
		styleoutlinecolor = s.outlinecolor
		stylepack = vec3(s.boldness, s.outlinethickness, s.outline ? 1.0 : 0.0)

		// hide it
		if(!s.visible) return vec4(0.)

		var pos1 = vec4(s.pos, 1.) * matrix
		pos1.w += view.polygonoffset;
		return pos1
	}

	// draw using SDF texture
	this.glyphy_sdf_draw = function(){
		var pos = mesh.tex

		var m = length(vec2(length(dFdx(mesh.pos)), length(dFdy(mesh.pos))))*0.002

		var dist = glyphy_sdf_decode( glyphy_sdf_lookup(pos)) * 0.0012

		dist -= stylepack.x / 300.
		dist = dist / m * pixel_contrast

		//dist = moddist(pos, dist)
		// TODO(aki): verify that this is correct
		if(dist >= 1. + stylepack.y){
			discard
		}	

		var alpha = glyphy_antialias(-dist)

		if(stylepack.z>0.){
			var dist2 = abs(dist) - (stylepack.y) +2.

			var alpha2 = glyphy_antialias(-dist2)

			var rgb = mix(stylefgcolor.rgb, styleoutlinecolor.rgb, alpha2*8.);

			return vec4(rgb, alpha * stylefgcolor.a * view.opacity)
		}

		return vec4(stylefgcolor.rgb, alpha * stylefgcolor.a * view.opacity)

		//if(mesh.gamma_adjust.r != 1.){
		//	alpha = pow(alpha, 1. / mesh.gamma_adjust.r)
		//}

		//return vec4(col.rgb, pow(glyphy_antialias(-dist), mesh.gamma_adjust.x))
	}

	this.glyphy_sdf_draw_subpixel_aa = function(){
		var pos = mesh.tex

		var m = length(vec2(length(dFdx(pos)), length(dFdy(pos))))*SQRT_1_2
		//var m = pixelscale*.5//0.005
		// screenspace length
		mesh.scaling = 500. * m

		var sub_delta = vec2((m / subpixel_distance)*0.1,0)

		var v1 = glyphy_sdf_decode(glyphy_sdf_lookup(pos - sub_delta*2.))
		var v2 = glyphy_sdf_decode(glyphy_sdf_lookup(pos - sub_delta))
		var v3 = glyphy_sdf_decode(glyphy_sdf_lookup(pos))
		var v4 = glyphy_sdf_decode(glyphy_sdf_lookup(pos + sub_delta))
		var v5 = glyphy_sdf_decode(glyphy_sdf_lookup(pos + sub_delta*2.))

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

		var alpha = glyphy_antialias(-dist)

		alpha = pow(alpha, pixel_gamma_adjust)
		//var max_alpha = max(max(alpha.r,alpha.g),alpha.b)
		//if(max_alpha >0.5) max_alpha = 1.
		//return vec4(alpha.b<0.?'yellow'.rgb:'blue'.rgb, 1)
		return vec4(mix(view.bgcolor.rgb, stylefgcolor.rgb, alpha.rgb), view.opacity)//max_alpha)
	}

	this.glyphy_atlas_draw = function(){
		//'trace'
		var nominal_size = (ivec2(mod(glyph.zw, 256.)) + 2) / 4
		var atlas_pos = ivec2(glyph.zw) / 256
		var pos = glyph.xy
		/* isotropic antialiasing */
		var m = length(vec2(length(dFdx(pos)), length(dFdy(pos))))*SQRT_1_2//*0.1

		var dist = glyphy_sdf(glyph.xy, nominal_size, atlas_pos) //+ noise.noise3d(vec3(glyph.x, glyph.y, time))*0.6

		dist -= stylepack.x
		//debug(mesh.distance)
		dist = dist / m * pixel_contrast

		var dist2 = dist;
		if(stylepack.z>0.){
			dist2 = abs(dist) - (stylepack.y)
		}

		// TODO(aki): verify that this is correct
		if(dist > 1. + stylepack.y){
			discard
		}

		var alpha = glyphy_antialias(-dist)
		var alpha2 = glyphy_antialias(-dist2)

		//if(mesh.gamma_adjust.r != 1.){
		//	alpha = pow(alpha, 1. / mesh.gamma_adjust.r)
		//}

		var rgb = mix(stylefgcolor.rgb, styleoutlinecolor.rgb, alpha2-alpha);

		return vec4(this.textpixel(rgb, pos, dist), max(alpha, alpha2) * stylefgcolor.a * view.opacity)
	}

	this.glyphy_mesh = this.glyphy_mesh_sdf
	this.glyphy_pixel = this.glyphy_sdf_draw

	this.textpixel = function(col, pos, dist) {
		return col;
	}

})
