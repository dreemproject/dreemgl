define(function(require, exports, module){
	
	var Texture = require('$system/platform/$platform/texture$platform')

	module.exports = function parseFont(blob){
		if(!blob) return
		if(blob._parsedFont) return blob._parsedFont

		// lets parse the font
		var vuint16 = new Uint16Array(blob)
		var vuint32 = new Uint32Array(blob)
		var vfloat32 = new Float32Array(blob)
		var vuint8 = new Uint8Array(blob)

		var font = {}

		if(vuint32[0] == 0x02F01175){ // baked format
			font.baked = true
			// lets parse the glyph set
			font.tex_geom = ivec2(vuint16[2], vuint16[3])
			font.tex_geom_f = vec2(font.tex_geom[0], font.tex_geom[1])
			var length = font.count = vuint32[2]

			if(length>10000) throw new Error('Font seems incorrect')
			var off = 3

			var glyphs = font.glyphs = {}
			for(var i = 0; i < length; i++){
				var unicode = vuint32[off++]
				var glyph = {
					min_x: vfloat32[off++],
					min_y: vfloat32[off++],
					max_x: vfloat32[off++],
					max_y: vfloat32[off++],
					advance: vfloat32[off++],
					tmin_x: vfloat32[off++],
					tmin_y: vfloat32[off++],
					tmax_x: vfloat32[off++],
					tmax_y: vfloat32[off++]
				}				
				glyphs[unicode] = glyph
				glyph.width = glyph.max_x - glyph.min_x 
				glyph.height = glyph.max_y - glyph.min_y
			}
			font.tex_array = blob.slice(off * 4)
		}
		else if(vuint32[0] == 0x01F01175){ // glyphy format
			// lets parse the glyph set
			font.tex_geom = ivec2(vuint16[2], vuint16[3])
			font.item_geom = ivec2(vuint16[4], vuint16[5])
			font.tex_geom_f = vec2(font.tex_geom[0], font.tex_geom[1])
			font.item_geom_f = vec2(font.item_geom[0], font.item_geom[1])

			var length = font.count = vuint32[3] / (7*4)

			if(length>10000) throw new Error('Font seems incorrect')
			var off = 4

			var glyphs = font.glyphs = Object.create(null)
			for(var i = 0;i<length;i++){
				var unicode = vuint32[off++]
				var glyph = glyphs[unicode] = {
					min_x: vfloat32[off++],
					min_y: vfloat32[off++],
					max_x: vfloat32[off++],
					max_y: vfloat32[off++],
					advance: vfloat32[off++],
					nominal_w: vuint8[off*4],
					nominal_h: vuint8[off*4+1],
					atlas_x: vuint8[off*4+2],
					atlas_y: vuint8[off*4+3]
				}
				off++
				glyph.width = glyph.max_x - glyph.min_x 
				glyph.height = glyph.max_y - glyph.min_y
			}
			font.tex_array = blob.slice(off * 4)
		}
		else throw new Error('Error in font file')
		
		if(!(32 in font.glyphs)) font.count++
		font.glyphs[32] = { // space
			min_x: 0,
			min_y: -0.3,
			max_x: 0.5,
			max_y: 1.,
			tmin_x: 0,
			tmin_y: 0,
			tmax_x: 24,
			tmax_y: 24,
			nominal_w:24,
			nominal_h:24,
			advance: 0.5,
			width: 0,
			height: 0,
		}
		if(!(10 in font.glyphs)) font.count++
		font.glyphs[10] = { // newline
			min_x: 0,
			min_y: 0,
			max_x: 0.5,
			max_y: 0,
			tmin_x:0,
			tmin_y:0,
			tmax_x:24,
			tmax_y:24,
			nominal_w:24,
			nominal_h:24,
			advance:0.5,
			width: 0,
			height: 0
		}
		if(!(9 in font.glyphs)) font.count++
		font.glyphs[9] = { // tab
			min_x: 0,
			min_y: -0.3,
			max_x: 2,
			max_y: 1.,
			tmin_x:0,
			tmin_y:0,
			tmax_x:24*4,
			tmax_y:24,
			nominal_w:24 * 4,
			nominal_h:24,
			advance:2,
			width: 2,
			height: 1
		}

		font.texture = Texture.fromArray(font.tex_array, font.tex_geom[0], font.tex_geom[1])

		return font
	}
})