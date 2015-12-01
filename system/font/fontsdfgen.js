/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define(function(require, exports, module){

	module.exports = function generateSDFCache(font){
		vec4[] buf = vec4[]()
		buf.quad.length = font.count
		buf.length = 0
		// we have to allocate actual texture positions
		var font_size = .2
		// if we render to a font we go -1,-1 bottom left to 1,1 top right

		var width = 2048
		var height = 2048
		var margin = 8. / width

		var glyphs = font.glyphs
		var left = -1  + 0.03
		var top = -1 + font_size
		var px = left
		var py = 1
		var o = 0
		var maxh = 0
		var ct = 0

		for(var k in glyphs){
			var info = glyphs[k]
			// 0___14 
			// |   /|
			// |  / |
			// | /  |
			// |/   | 
			// 23---5
			// lets add some vertices
			var gx = ((info.atlas_x<<6) | info.nominal_w)<<1
			var gy = ((info.atlas_y<<6) | info.nominal_h)<<1
			var o = buf.quad.length++
			buf.quad_tl[o] = vec4(info.tmin_x = px, info.tmin_y = py, gx, gy)
			buf.quad_tr[o] = vec4(info.tmax_x = px + font_size * info.width, py, gx|1, gy)
			buf.quad_bl[o] = vec4(px, info.tmax_y = py - font_size * info.height, gx, gy|1)
			buf.quad_br[o] = vec4(px + font_size * info.width, py - font_size * info.height, gx|1, gy|1)

			px += (info.tmax_x - info.tmin_x) + margin//glyph.advance * font_size
			// scale it into texture coordinates
			var my_h = (info.tmin_y - info.tmax_y) + margin
			if(my_h > maxh) maxh = my_h

			info.tmin_x = info.tmin_x *.5 + .5
			info.tmin_y = info.tmin_y *.5 + .5
			info.tmax_x = info.tmax_x *.5 + .5
			info.tmax_y = info.tmax_y *.5 + .5

			if(px + font_size > 1) px = left, py -= maxh, maxh = 0
		}

		genWhitespace(font)
		// lets do a font scaling, and then just stack em horizontally
		sdf_texture = Texture.rgba(width, height)

		sdf_mesh = buf

		font.sdf_texture = sdf_texture
		
		if(dump_sdf){
			mymesh = vec2Rect(0,0,1,1)
			vertex: mymesh[]*vec2(8.,8.) * (m_mesh * m_world * device.m_camera)
			pixel: sdf_texture.sample(pixel mymesh[])// + mix(#black,#red,pixel mymesh[].y)
		}

		glyphy_coords: sdf_mesh[].zw

		if(sdf_bake){
			// lets re-encode our glyph table
			var header = 12 + font.count * 10 * 4 
			var body = sdf_texture.w_ * sdf_texture.h_ * 4
			var data = new Uint8Array(header + body)
			var vuint32 = new Uint32Array(data.buffer)
			var vfloat32 = new Float32Array(data.buffer)
			var vuint16 = new Uint16Array(data.buffer)

			var off = 0
			vuint32[off++] = 0x02F01175
			vuint16[2] = sdf_texture.w_
			vuint16[3] = sdf_texture.h_
			off++
			vuint32[off++] = font.count
			var glyphs = font.glyphs
			var check = 0
			for(var unicode in glyphs){
				var info = glyphs[unicode]
				check++
				vuint32[off++] = unicode
				vfloat32[off++] = info.min_x
				vfloat32[off++] = info.min_y
				vfloat32[off++] = info.max_x
				vfloat32[off++] = info.max_y
				vfloat32[off++] = info.advance
				vfloat32[off++] = info.tmin_x
				vfloat32[off++] = info.tmin_y
				vfloat32[off++] = info.tmax_x
				vfloat32[off++] = info.tmax_y
			}
			data._t_ = 1

			// lets send the data over
			sdf_header = data
			sdf_header_offset = header

			once:(){
				// in this once, we generate our font texture.
				sdf_texture{
					clearAll(#black)
					this{
						vertex:sdf_mesh[].xy
						pixel: glyphy_sdf_generate(pixel sdf_mesh[])
					}
					var data = sdf_header.subarray(sdf_header_offset)
					this.gl.readPixels(0,0,sdf_texture.w, sdf_texture.h, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data)
					console.log(sdf_texture.w, sdf_texture.h)
				
					// ok lets dump the header and the data to disk
					var xhr = new XMLHttpRequest()
					xhr.open("POST", "/bake", false)
					xhr.send(sdf_header)
				}
			}
		}
		else{
			once:(){
				// in this once, we generate our font texture.
				sdf_texture{
					clearAll(#black)
					this{
						vertex:sdf_mesh[].xy
						pixel: glyphy_sdf_generate(pixel sdf_mesh[])
					}
				}
			}			
		}
	}
})