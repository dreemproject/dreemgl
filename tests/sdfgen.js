/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$base/composition', function(require, $base$, screen, view, $server$, fileio){

	var input_font = require('$resources/fonts/ubuntu_medium_256_arc.glf')
	var output_font = '$resources/fonts/ubuntu_medium_256.glf'
	var varwidth = true
	var xsize = 64
	var ysize = 64

	var myview = define.class(view, function(){

		this.Rect = function(){
			this.margin = [0,0,1,0],
			this.fgcolor = vec4('orange')
		}

		// make our sdf font shader
		define.class(this, 'Sdfgen', '$shaders/fontarcshader', function(){
			this.font = input_font
			this.compute_position = function(){
				// we want to compute a measure of scale relative to the actual pixels
				var matrix = view.totalmatrix  * state.viewmatrix
				var pos = mix(
					vec2(
						canvas.minx,
						canvas.maxy
					),
					vec2(
						canvas.maxx,
						canvas.miny
					),
					mesh.xy
				)

				var pos1 = vec4(pos.x, pos.y, 0., 1.) * matrix
				pos1.w += polygonoffset;
				return pos1
			}
			
			this.color = function(){
				var nominal_size = (ivec2(mod(glyph.zw, 256.)) + 2) / 4
				var atlas_pos = ivec2(glyph.zw) / 256
				var dist = arc_sdf(glyph.xy, nominal_size, atlas_pos) //+ noise.noise3d(vec3(glyph.x, glyph.y, time))*0.6

				return sdf_encode(dist)
			}

			this.canvasverbs = {
				drawUnicode: function(unicode, minx, miny, maxx, maxy){
					this.GETBUFFER(1)
					this.ARGSTOCANVAS()
					var info = (this.font || this.classNAME.font).glyphs[unicode]
					var texx = ((info.atlas_x<<6) | info.nominal_w)
					var texy = ((info.atlas_y<<6) | info.nominal_h)
					this.CANVASTOBUFFER({
						minx:minx,
						maxx:maxx,
						miny:miny,
						maxy:maxy,
						unicode:unicode,
						texminx:texx,
						texminy:texy
					})
				}
			}
		})

		this.draw = function(){
			var c = this.canvas
			
			var tgt = c.pushTarget('surface', c.RGBA, 2048, 2048)

			c.clear(0,0,0,1.)

			var width = 2048
			var height = 2048
			var px = 0
			var py = 0
			var pad = 4
			
			var font = c.classSdfgen.font
			var glyphs = font.glyphs
			var xymap = {}

			for(var unicode in glyphs){
				var info = glyphs[unicode]
				var pw = varwidth?Math.ceil((info.max_x - info.min_x) * xsize):xsize
				xymap[unicode] = {x:px, y:py, w:pw, h:ysize}
				if(unicode == 10 || unicode == 32 || unicode == 9)continue
				c.drawUnicodeSdfgen(unicode, px, py, px + pw, py + ysize)
				px += pw + pad
				if(px+xsize >= width) px = 0, py += ysize + pad
			}

			var sdf_pixel_width = width
			var sdf_pixel_height = int.nextHighestPowerOfTwo(py)

			var header = 12 + font.count * 10 * 4 
			var body = sdf_pixel_width * sdf_pixel_height * 1

			var alldata = new Uint8Array(header + body)
			var vuint32 = new Uint32Array(alldata.buffer)
			var vfloat32 = new Float32Array(alldata.buffer)
			var vuint16 = new Uint16Array(alldata.buffer)

			var off = 0
			vuint32[off++] = 0x02F01175
			vuint16[2] = sdf_pixel_width
			vuint16[3] = sdf_pixel_height
			off++
			vuint32[off++] = font.count
			var glyphs = font.glyphs
			for(var unicode in glyphs){
				var info = glyphs[unicode]
				var map = xymap[unicode]
				var normwidth = map.w / sdf_pixel_width
				var normheight = map.h / sdf_pixel_height

				vuint32[off++] = unicode
				vfloat32[off++] = info.min_x
				vfloat32[off++] = info.min_y
				vfloat32[off++] = info.max_x
				vfloat32[off++] = info.max_y
				vfloat32[off++] = info.advance
				vfloat32[off++] = map.x / sdf_pixel_width
				vfloat32[off++] = map.y / sdf_pixel_height + normheight
				vfloat32[off++] = map.x / sdf_pixel_width + normwidth
				vfloat32[off++] = map.y / sdf_pixel_height
			}

			// lets send the data over
			//var storepixels = alldata.subarray(header)
			var pixoffset = header
			var pixuint8 = new Uint8Array(alldata.buffer)
			// see if this throws
			define.parseGLF(alldata.buffer)
			//console.log(myvuint32[0] === 0x02F01175)
			c.readPixels(0, 0, sdf_pixel_width, sdf_pixel_height).then(function(result){
				for(var y = 0; y < sdf_pixel_height; y++){
					for(var x = 0; x < sdf_pixel_width; x++){
						pixuint8[pixoffset + y * sdf_pixel_width + x] = result[y * sdf_pixel_width * 4 + x * 4]
					}
				}
				var dt = performance.now()
				this.rpc.fileio.writefile(output_font,alldata).then(function(result){
					//console.log('Got result', result, performance.now()-dt)
				})

				//this.rpc.fileio.writefile(output_font,alldata).then(function(){
				//	console.log('file written')
				//})
			}.bind(this))

			c.popTarget()
			c.drawImage(tgt)
		}
	})

	this.render = function(){ return [
		fileio({name:'fileio'}),
		screen({name:'default', bgcolor:'orange',rect:{color:function(){return 'blue'}},clearcolor:vec4('purple')},
			myview({flex:1, bgcolor:'orange'})
		)
	]}
})
