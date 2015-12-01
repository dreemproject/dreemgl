/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define(function(require, exports){
	exports.getType = function(type){
		if(type === null) return 'void'
		var name = this.typemap[type.id] || type.id
		return name
	},
	exports.extensions = {
		OES_texture_float:1,
		OES_texture_half_float:1,
		WEBGL_lose_context:1,
		OES_standard_derivatives:1,
		OES_vertex_array_object:1,
		WEBGL_debug_renderer_info:1,
		WEBGL_debug_shaders:1,
		WEBGL_compressed_texture_s3tc:1,
		WEBGL_depth_texture:1,
		OES_element_index_uint:1,
		EXT_texture_filter_anisotropic:1,
		EXT_frag_depth:1,
		WEBGL_draw_buffers:1,
		ANGLE_instanced_arrays:1,
		OES_texture_float_linear:1,
		OES_texture_half_float_linear:1,
		EXT_blend_minmax:1,
		EXT_shader_texture_lod:1,
	},
	exports.variables = {
		gl_PointCoord:vec2,
		gl_FrontFacing:bool,
		gl_FragCoord:vec4,
		gl_Position:vec4,
		gl_PointSize:float32,
		gl_ClipDistance:float32,
		gl_VertexID:int32,
		gl_InstanceID:int32,
		gl_MaxVertexAttribs:int32,
		gl_MaxVertexUniformVectors:int32,
		gl_MaxVaryingVectors:int32,
		gl_MaxVertexTextureImageUnits:int32,
		gl_MaxCombinedTextureImageUnits:int32,
		gl_MaxTextureImageUnits:int32,
		gl_MaxFragmentUniformVectors:int32,
		gl_MaxDrawBuffers:int32,
		discard:int32
	},
	exports.typemap = {
		bool:'bool',
		float32:'float',
		float64:'double',
		int16:'short',
		int32:'int'
	},
	exports.uniforms = {
		bool:function(gl, loc, v){ gl.uniform1i(loc, v) },
		float:function(gl, loc, v){ gl.uniform1f(loc, v) },
		double:function(gl, loc, v){ gl.uniform1f(loc, v) },
		short:function(gl, loc, v){ gl.uniform1i(loc, v) },
		int:function(gl, loc, v){ gl.uniform1i(loc, v) },
		vec2:function(gl, loc, v){ gl.uniform2f(loc, v[0], v[1]) },
		vec3:function(gl, loc, v){ gl.uniform3f(loc, v[0], v[1], v[2]) },
		vec4:function(gl, loc, v){ gl.uniform4f(loc, v[0], v[1], v[2], v[3]) },
		ivec2:function(gl, loc, v){ gl.uniform2i(loc, v[0], v[1]) },
		ivec3:function(gl, loc, v){ gl.uniform3i(loc, v[0], v[1], v[2]) },
		ivec4:function(gl, loc, v){ gl.uniform4i(loc, v[0], v[1], v[2], v[3]) },
		bvec2:function(gl, loc, v){ gl.uniform2i(loc, v[0]) },
		bvec3:function(gl, loc, v){ gl.uniform3i(loc, v[0], v[1], v[2]) },
		bvec4:function(gl, loc, v){ gl.uniform4i(loc, v[0], v[1], v[2], v[3]) },
		mat2:function(gl, loc, v){ gl.uniformMatrix2fv(loc, false, v) },
		mat3:function(gl, loc, v){ gl.uniformMatrix3fv(loc, false, v) },
		mat4:function(gl, loc, v){ gl.uniformMatrix4fv(loc, false, v) }
	},
	exports.uniform_gen = {
		bool:{call:'uniform1i', args:1},
		float:{call:'uniform1f', args:1},
		double:{call:'uniform1f', args:1},
		short:{call:'uniform1i', args:1},
		int:{call:'uniform1i', args:1},
		vec2:{call:'uniform2f', args:2},
		vec3:{call:'uniform3f', args:3},
		vec4:{call:'uniform4f', args:4},
		ivec2:{call:'uniform2i', args:2},
		ivec3:{call:'uniform3i', args:3},
		ivec4:{call:'uniform4i', args:4},
		bvec2:{call:'uniform2i', args:2},
		bvec3:{call:'uniform3i', args:3},
		bvec4:{call:'uniform4i', args:4},
		mat2:{call:'uniformMatrix2fv', args:1, mat:1},
		mat3:{call:'uniformMatrix3fv', args:1, mat:1},
		mat4:{call:'uniformMatrix4fv', args:1, mat:1},
	
	}
	/*types:{
		half, float, double, short, long, int,
		bool,
		mat2, mat3, mat4
		vec2, vec3, vec4
		ivec2, ivec3, ivec4
		bvec2, bvec3, bvec4
		hvec2, hvec3, hvec4
		dvec2, dvec3, dvec4
		fvec2, fvec3, fvec4
		sampler2D
		samplerCube
	},*/
	exports.functions = {
		typeof:1, sizeof:int32, debug:1, radians:1, degrees:1,
		sin:1, cos:1, tan:1,
		asin:1, acos:1, atan:1,
		pow:1, exp:1, log:1, exp2:1, log2:1,
		sqrt:1, inversesqrt:1,
		abs:1, sign:1, floor:1, ceil:1, fract:1,
		mod:1, min:1, max:1, clamp:1,
		mix:1, step:2, smoothstep:3,
		length:float32, distance:float32,
		dot:float32, cross:1, normalize:1,
		faceforward:1, reflect:1, refract:1,
		matrixCompMult:1,
		lessThan:bool, lessThanEqual:bool,
		greaterThan:bool, greaterThanEqual:bool,
		equal:bool, notEqual:bool,
		any:bool, all:bool, not:bool,
		dFdx:1, dFdy:1,
		texture2DLod:vec4,
		texture2DProjLod:vec4,
		textureCubeLod:vec4,
		texture2D:vec4,
		texture2DProj:vec4,
		textureCube:vec4
	}
	exports.gl = {
		DEPTH_BUFFER_BIT:0x100,STENCIL_BUFFER_BIT:0x400,COLOR_BUFFER_BIT:0x4000,
		
		POINTS:0x0,LINES:0x1,LINE_LOOP:0x2,LINE_STRIP:0x3,TRIANGLES:0x4,TRIANGLE_STRIP:0x5,TRIANGLE_FAN:0x6,
		
		ZERO:0x0,ONE:0x1,SRC_COLOR:0x300,ONE_MINUS_SRC_COLOR:0x301,SRC_ALPHA:0x302,ONE_MINUS_SRC_ALPHA:0x303,DST_ALPHA:0x304,ONE_MINUS_DST_ALPHA:0x305,
		DST_COLOR:0x306,ONE_MINUS_DST_COLOR:0x307,SRC_ALPHA_SATURATE:0x308,FUNC_ADD:0x8006,BLEND_EQUATION:0x8009,
		
		BLEND_EQUATION_RGB:0x8009,BLEND_EQUATION_ALPHA:0x883d,FUNC_SUBTRACT:0x800a,FUNC_REVERSE_SUBTRACT:0x800b,
		BLEND_DST_RGB:0x80c8,BLEND_SRC_RGB:0x80c9,BLEND_DST_ALPHA:0x80ca,BLEND_SRC_ALPHA:0x80cb,CONSTANT_COLOR:0x8001,
		ONE_MINUS_CONSTANT_COLOR:0x8002,CONSTANT_ALPHA:0x8003,ONE_MINUS_CONSTANT_ALPHA:0x8004,BLEND_COLOR:0x8005,
		
		ARRAY_BUFFER:0x8892,ELEMENT_ARRAY_BUFFER:0x8893,ARRAY_BUFFER_BINDING:0x8894,ELEMENT_ARRAY_BUFFER_BINDING:0x8895,

		STREAM_DRAW:0x88e0,STATIC_DRAW:0x88e4,DYNAMIC_DRAW:0x88e8,BUFFER_SIZE:0x8764,BUFFER_USAGE:0x8765,

		CURRENT_VERTEX_ATTRIB:0x8626,FRONT:0x404,BACK:0x405,FRONT_AND_BACK:0x408,
		
		TEXTURE_2D:0xde1,CULL_FACE:0xb44,
		
		BLEND:0xbe2,DITHER:0xbd0,STENCIL_TEST:0xb90,DEPTH_TEST:0xb71,SCISSOR_TEST:0xc11,POLYGON_OFFSET_FILL:0x8037,

		SAMPLE_ALPHA_TO_COVERAGE:0x809e,SAMPLE_COVERAGE:0x80a0,NO_ERROR:0x0,
		
		INVALID_ENUM:0x500,INVALID_VALUE:0x501,
		
		INVALID_OPERATION:0x502,OUT_OF_MEMORY:0x505,
		
		CW:0x900,CCW:0x901,LINE_WIDTH:0xb21,ALIASED_POINT_SIZE_RANGE:0x846d,
		ALIASED_LINE_WIDTH_RANGE:0x846e,
		
		CULL_FACE_MODE:0xb45,FRONT_FACE:0xb46,
		
		DEPTH_RANGE:0xb70,DEPTH_WRITEMASK:0xb72,
		DEPTH_CLEAR_VALUE:0xb73,DEPTH_FUNC:0xb74,
		
		STENCIL_CLEAR_VALUE:0xb91,STENCIL_FUNC:0xb92,STENCIL_FAIL:0xb94,
		STENCIL_PASS_DEPTH_FAIL:0xb95,STENCIL_PASS_DEPTH_PASS:0xb96,STENCIL_REF:0xb97,STENCIL_VALUE_MASK:0xb93,
		STENCIL_WRITEMASK:0xb98,STENCIL_BACK_FUNC:0x8800,STENCIL_BACK_FAIL:0x8801,STENCIL_BACK_PASS_DEPTH_FAIL:0x8802,
		STENCIL_BACK_PASS_DEPTH_PASS:0x8803,STENCIL_BACK_REF:0x8ca3,STENCIL_BACK_VALUE_MASK:0x8ca4,
		STENCIL_BACK_WRITEMASK:0x8ca5,
		
		VIEWPORT:0xba2,SCISSOR_BOX:0xc10,COLOR_CLEAR_VALUE:0xc22,COLOR_WRITEMASK:0xc23,
		
		UNPACK_ALIGNMENT:0xcf5,PACK_ALIGNMENT:0xd05,
		
		MAX_TEXTURE_SIZE:0xd33,MAX_VIEWPORT_DIMS:0xd3a,

		SUBPIXEL_BITS:0xd50,RED_BITS:0xd52,GREEN_BITS:0xd53,BLUE_BITS:0xd54,ALPHA_BITS:0xd55,DEPTH_BITS:0xd56,STENCIL_BITS:0xd57,

		POLYGON_OFFSET_UNITS:0x2a00,POLYGON_OFFSET_FACTOR:0x8038,TEXTURE_BINDING_2D:0x8069,
		
		SAMPLE_BUFFERS:0x80a8,SAMPLES:0x80a9,SAMPLE_COVERAGE_VALUE:0x80aa,SAMPLE_COVERAGE_INVERT:0x80ab,
		
		COMPRESSED_TEXTURE_FORMATS:0x86a3,
		DONT_CARE:0x1100,FASTEST:0x1101,NICEST:0x1102,GENERATE_MIPMAP_HINT:0x8192,
		
		BYTE:0x1400,UNSIGNED_BYTE:0x1401,
		SHORT:0x1402,UNSIGNED_SHORT:0x1403,INT:0x1404,UNSIGNED_INT:0x1405,FLOAT:0x1406,DEPTH_COMPONENT:0x1902,
		ALPHA:0x1906,RGB:0x1907,RGBA:0x1908,LUMINANCE:0x1909,LUMINANCE_ALPHA:0x190a,UNSIGNED_SHORT_4_4_4_4:0x8033,
		UNSIGNED_SHORT_5_5_5_1:0x8034,UNSIGNED_SHORT_5_6_5:0x8363,
		
		FRAGMENT_SHADER:0x8b30,VERTEX_SHADER:0x8b31,
		
		MAX_VERTEX_ATTRIBS:0x8869,MAX_VERTEX_UNIFORM_VECTORS:0x8dfb,MAX_VARYING_VECTORS:0x8dfc,
		MAX_COMBINED_TEXTURE_IMAGE_UNITS:0x8b4d,MAX_VERTEX_TEXTURE_IMAGE_UNITS:0x8b4c,MAX_TEXTURE_IMAGE_UNITS:0x8872,
		MAX_FRAGMENT_UNIFORM_VECTORS:0x8dfd,SHADER_TYPE:0x8b4f,DELETE_STATUS:0x8b80,LINK_STATUS:0x8b82,
		VALIDATE_STATUS:0x8b83,ATTACHED_SHADERS:0x8b85,ACTIVE_UNIFORMS:0x8b86,ACTIVE_ATTRIBUTES:0x8b89,
		SHADING_LANGUAGE_VERSION:0x8b8c,CURRENT_PROGRAM:0x8b8d,NEVER:0x200,LESS:0x201,EQUAL:0x202,LEQUAL:0x203,
		GREATER:0x204,NOTEQUAL:0x205,GEQUAL:0x206,ALWAYS:0x207,KEEP:0x1e00,REPLACE:0x1e01,INCR:0x1e02,DECR:0x1e03,
		INVERT:0x150a,INCR_WRAP:0x8507,DECR_WRAP:0x8508,VENDOR:0x1f00,RENDERER:0x1f01,VERSION:0x1f02,NEAREST:0x2600,
		
		LINEAR:0x2601,NEAREST_MIPMAP_NEAREST:0x2700,LINEAR_MIPMAP_NEAREST:0x2701,NEAREST_MIPMAP_LINEAR:0x2702,
		LINEAR_MIPMAP_LINEAR:0x2703,TEXTURE_MAG_FILTER:0x2800,TEXTURE_MIN_FILTER:0x2801,TEXTURE_WRAP_S:0x2802,
		
		TEXTURE_WRAP_T:0x2803,TEXTURE:0x1702,TEXTURE_CUBE_MAP:0x8513,TEXTURE_BINDING_CUBE_MAP:0x8514,
		TEXTURE_CUBE_MAP_POSITIVE_X:0x8515,TEXTURE_CUBE_MAP_NEGATIVE_X:0x8516,TEXTURE_CUBE_MAP_POSITIVE_Y:0x8517,
		TEXTURE_CUBE_MAP_NEGATIVE_Y:0x8518,TEXTURE_CUBE_MAP_POSITIVE_Z:0x8519,TEXTURE_CUBE_MAP_NEGATIVE_Z:0x851a,
		
		MAX_CUBE_MAP_TEXTURE_SIZE:0x851c,TEXTURE0:0x84c0,TEXTURE1:0x84c1,TEXTURE2:0x84c2,TEXTURE3:0x84c3,TEXTURE4:0x84c4,
		
		TEXTURE5:0x84c5,TEXTURE6:0x84c6,TEXTURE7:0x84c7,TEXTURE8:0x84c8,TEXTURE9:0x84c9,TEXTURE10:0x84ca,TEXTURE11:0x84cb,
		TEXTURE12:0x84cc,TEXTURE13:0x84cd,TEXTURE14:0x84ce,TEXTURE15:0x84cf,TEXTURE16:0x84d0,TEXTURE17:0x84d1,
		TEXTURE18:0x84d2,TEXTURE19:0x84d3,TEXTURE20:0x84d4,TEXTURE21:0x84d5,TEXTURE22:0x84d6,TEXTURE23:0x84d7,
		TEXTURE24:0x84d8,TEXTURE25:0x84d9,TEXTURE26:0x84da,TEXTURE27:0x84db,TEXTURE28:0x84dc,TEXTURE29:0x84dd,
		TEXTURE30:0x84de,TEXTURE31:0x84df,ACTIVE_TEXTURE:0x84e0,REPEAT:0x2901,CLAMP_TO_EDGE:0x812f,MIRRORED_REPEAT:0x8370,
		
		FLOAT_VEC2:0x8b50,FLOAT_VEC3:0x8b51,FLOAT_VEC4:0x8b52,INT_VEC2:0x8b53,INT_VEC3:0x8b54,INT_VEC4:0x8b55,BOOL:0x8b56,
		BOOL_VEC2:0x8b57,BOOL_VEC3:0x8b58,BOOL_VEC4:0x8b59,FLOAT_MAT2:0x8b5a,FLOAT_MAT3:0x8b5b,FLOAT_MAT4:0x8b5c,
		
		SAMPLER_2D:0x8b5e,SAMPLER_CUBE:0x8b60,VERTEX_ATTRIB_ARRAY_ENABLED:0x8622,VERTEX_ATTRIB_ARRAY_SIZE:0x8623,
		
		VERTEX_ATTRIB_ARRAY_STRIDE:0x8624,VERTEX_ATTRIB_ARRAY_TYPE:0x8625,VERTEX_ATTRIB_ARRAY_NORMALIZED:0x886a,
		VERTEX_ATTRIB_ARRAY_POINTER:0x8645,VERTEX_ATTRIB_ARRAY_BUFFER_BINDING:0x889f,COMPILE_STATUS:0x8b81,LOW_FLOAT:0x8df0,
		
		MEDIUM_FLOAT:0x8df1,HIGH_FLOAT:0x8df2,LOW_INT:0x8df3,MEDIUM_INT:0x8df4,HIGH_INT:0x8df5,FRAMEBUFFER:0x8d40,
		
		RENDERBUFFER:0x8d41,RGBA4:0x8056,RGB5_A1:0x8057,RGB565:0x8d62,DEPTH_COMPONENT16:0x81a5,STENCIL_INDEX:0x1901,
		
		STENCIL_INDEX8:0x8d48,DEPTH_STENCIL:0x84f9,
		
		RENDERBUFFER_WIDTH:0x8d42,RENDERBUFFER_HEIGHT:0x8d43,
		RENDERBUFFER_INTERNAL_FORMAT:0x8d44,RENDERBUFFER_RED_SIZE:0x8d50,RENDERBUFFER_GREEN_SIZE:0x8d51,
		RENDERBUFFER_BLUE_SIZE:0x8d52,RENDERBUFFER_ALPHA_SIZE:0x8d53,RENDERBUFFER_DEPTH_SIZE:0x8d54,
		RENDERBUFFER_STENCIL_SIZE:0x8d55,
		
		FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE:0x8cd0,FRAMEBUFFER_ATTACHMENT_OBJECT_NAME:0x8cd1,
		FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL:0x8cd2,FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE:0x8cd3,
		COLOR_ATTACHMENT0:0x8ce0,DEPTH_ATTACHMENT:0x8d00,STENCIL_ATTACHMENT:0x8d20,DEPTH_STENCIL_ATTACHMENT:0x821a,
		NONE:0x0,FRAMEBUFFER_COMPLETE:0x8cd5,FRAMEBUFFER_INCOMPLETE_ATTACHMENT:0x8cd6,
		FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:0x8cd7,FRAMEBUFFER_INCOMPLETE_DIMENSIONS:0x8cd9,
		FRAMEBUFFER_UNSUPPORTED:0x8cdd,FRAMEBUFFER_BINDING:0x8ca6,RENDERBUFFER_BINDING:0x8ca7,

		MAX_RENDERBUFFER_SIZE:0x84e8,INVALID_FRAMEBUFFER_OPERATION:0x506,UNPACK_FLIP_Y_WEBGL:0x9240,
		UNPACK_PREMULTIPLY_ALPHA_WEBGL:0x9241,CONTEXT_LOST_WEBGL:0x9242,UNPACK_COLORSPACE_CONVERSION_WEBGL:0x9243,
		BROWSER_DEFAULT_WEBGL:0x9244		
	}

	exports.compare = {
		'<':exports.gl.LESS,
		'<=':exports.gl.LEQUAL,
		'>':exports.gl.GREATER,
		'>=':exports.gl.GEQUAL,
		'!==':exports.gl.NOTEQUAL,
		'!=':exports.gl.NOTEQUAL,
		'==':exports.gl.EQUAL,
		'===':exports.gl.EQUAL
	}
})