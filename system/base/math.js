define(function(require, exports){

	var vectorParser = require('$system/parse/vectorparser')
//	exports.$$ = console.log.bind(console)
	// constants
	exports.RAD = 1
	exports.DEG = 0.017453292519943295
	exports.PI = 3.141592653589793
	exports.PI2 = 6.283185307179586
	exports.E = 2.718281828459045
	exports.LN2 = 0.6931471805599453
	exports.LN10 = 2.302585092994046
	exports.LOG2E = 1.4426950408889634
	exports.LOG10E = 0.4342944819032518
	exports.SQRT_1_2 = 0.70710678118654757
	exports.SQRT2 = 1.4142135623730951

	// primitive types
	exports.string = String
	exports.boolean = 
	exports.bool = define.struct({prim:true, type:'bool', bytes:4, array:Int32Array},'bool')
	exports.float =
	exports.float32 = define.struct({prim:true, type:'float32',bytes:4, array:Float32Array},'float32')
	exports.double =
	exports.float64 = define.struct({prim:true, type:'float64', bytes:8, array:Float64Array},'float64')
	exports.int8 = define.struct({prim:true, type:'int8', bytes:1, array:Int8Array},'int8')
	exports.uint8 = define.struct({prim:true, type:'uint8', bytes:1, array:Uint8Array},'uint8')
	exports.half = define.struct({prim:true, type:'half', bytes:2, array:Int16Array},'half')
	exports.short =
	exports.int16 = define.struct({prim:true, type:'int16', bytes:2, array:Int16Array},'int16')
	exports.uint16 = define.struct({prim:true, type:'uint16', bytes:1, array:Uint16Array},'uint16')
	exports.long =
	exports.int =
	exports.int32 = define.struct({prim:true, type:'int32', bytes:4, array:Int32Array},'int32')
	exports.uint32 = define.struct({prim:true, type:'uint32', bytes:4, array:Uint32Array},'uint32')

	exports.flow = function(value){
		console.log(value)
		return value
	}

	// basic math API
	function typeFn(fn){
		return function(v){
			if(typeof v == 'number') return fn(v)
			var out = v.struct()
			for(var i = 0; i < v.length; i++) out[i] = fn(v[i])
			return out
		}
	}
	function typeFn2(fn){
		return function(v, w){
			if(typeof v == 'number') return fn(v, w)
			var out = v.struct()
			for(var i = 0; i < v.length; i++) out[i] = fn(v[i], w[i])
			return out
		}
	}
	function typeFn3(fn){
		return function(v, w, x){
			if(typeof v == 'number') return fn(v, w, x)
			var out = v.struct()
			if(typeof w == 'number'){
				for(var i = 0; i < v.length; i++) out[i] = fn(v[i], w, x)
			}
			else{
				for(var i = 0; i < v.length; i++) out[i] = fn(v[i], w[i], x[i])
			}
			return out
		}
	}

	exports.sin = typeFn(Math.sin)
	exports.cos = typeFn(Math.cos)
	exports.tan = typeFn(Math.tan)
	exports.asin = typeFn(Math.asin)
	exports.acos = typeFn(Math.acos)
	exports.atan = typeFn(Math.atan)
	exports.atan2 = typeFn2(Math.atan2)
	exports.pow = typeFn2(Math.pow)
	exports.exp = typeFn(Math.exp)
	exports.log = typeFn(Math.log)
	exports.exp2 = typeFn(function(v){return Math.pow(2, v)})
	exports.log2 = typeFn(Math.log2)
	exports.sqrt = typeFn(Math.sqrt)
	exports.inversesqrt = typeFn(function(v){ return 1/Math.sqrt(v)})
	exports.abs = typeFn(Math.abs)
	exports.floor = typeFn(Math.floor)
	exports.ceil = typeFn(Math.ceil)
	exports.min = typeFn2(Math.min)
	exports.max = typeFn2(Math.max)
	exports.mod = typeFn2(Math.mod)
	exports.random = Math.random

	
	
	exports.sign = typeFn(function(v){
		if(v === 0) return 0
		if(v < 0 ) return -1
		return 1
	})

	exports.fract = typeFn(function(v){
		return v - Math.floor(v)
	})

	exports.clamp = typeFn3(function(v, mi, ma){
		if(v < mi) return mi
		if(v > ma) return ma
		return v
	})

	exports.mix = function(a, b, f, o){
		if(typeof a === 'number'){
			return a + f * (b - a)
		}
		o = o || a.struct()
		for(var i = 0; i < a.length; i++){
			o[i] = a[i] + f * (b[i] - a[i])
		}
		return o
	}

	exports.smoothstep = function(e0, e1, v){

	}

	exports.length = function(){
	}

	exports.distance = function(a, b){
	}

	exports.dot = function(a, b){
	}

	exports.cross = function(a, b){
	}

	exports.normalize = function(){
	}

	// Int vectors
	exports.ivec2 = define.struct({
		r:'x',g:'y',
		s:'x',t:'y',
		x:exports.int32,
		y:exports.int32
	}, 'ivec2')

	exports.ivec3 = define.struct({
		r:'x',g:'y',b:'z',
		s:'x',t:'y',p:'z',
		x:exports.int32,
		y:exports.int32,
		z:exports.int32
	}, 'ivec3')

	exports.ivec4 = define.struct({
		r:'x',g:'y',b:'z',a:'w',
		s:'x',t:'y',p:'z',q:'w',
		x:exports.int32,
		y:exports.int32,
		z:exports.int32,
		w:exports.int32,
	}, 'ivec4')

	// Bool vectors
	exports.bvec2 = define.struct({
		x:exports.boolean,
		y:exports.boolean
	}, 'bvec2')

	exports.bvec3 = define.struct({
		x:exports.boolean,
		y:exports.boolean,
		z:exports.boolean
	}, 'bvec3')

	exports.bvec4 = define.struct({
		x:exports.boolean,
		y:exports.boolean,
		z:exports.boolean,
		w:exports.boolean,
	}, 'bvec4')

	function baseApi(exports){
	}

	function matApi(exports){
		baseApi(exports)
	}

	// shared vector api
	function vecApi(exports){
		baseApi(exports)
		function vecFn(fn){
			return function(a, o){
				if(!o) o = exports()
				for(var i = 0; i < a.length; i++) o[i] = fn(a[i])
				return o
			}
		}

		function vecFn2(fn){
			return function(a, b, o){
				if(!o) o = exports()
				for(var i = 0; i < a.length; i++) o[i] = fn(a[i], b[i])
				return o
			}
		}

		exports.sin = vecFn(Math.sin)
		exports.cos = vecFn(Math.cos)
		exports.tan = vecFn(Math.tan)
		exports.asin = vecFn(Math.asin)
		exports.acos = vecFn(Math.acos)
		exports.atan = vecFn(Math.atan)
		exports.pow = vecFn(Math.pow)
		exports.exp = vecFn(Math.exp)
		exports.log = vecFn(Math.log)
		exports.exp2 = vecFn(function(v){return Math.pow(2, v)})
		exports.log2 = vecFn(Math.log2)
		exports.sqrt = vecFn(Math.sqrt)
		exports.inversesqrt = vecFn(function(v){ return 1/Math.sqrt(v)})
		exports.abs = vecFn(Math.abs)
		exports.floor = vecFn(Math.floor)
		exports.ceil = vecFn(Math.ceil)
		exports.min = vecFn(Math.min)
		exports.max = vecFn(Math.max)
		exports.mod = vecFn(Math.mod)

		exports.identity = function(o){
			if(!o) o = exports()
			for(var i = 0;i<o.length;i++) o[i] = 0
			return o
		}

		exports.distance = function(a, b){
			var d = 0
			for(var i = 0; i < a.length; i++){
				d+= Math.pow(a[i] - b[i], 2)
			}
			return Math.sqrt(d)
		}

		exports.len = function(a){
			var d = 0
			for(var i = 0; i < a.length; i++) d += Math.pow(a[i], 2)
			return Math.sqrt(d)
		}

		exports.negate = function(a, o){
			if(!o) o = exports()
			for(var i = 0; i < a.length; i++) o[i] = -a[i]
			return o
		}

		exports.inverse = function(a, o){
			if(!o) o = exports()
			for(var i = 0; i < a.length; i++) o[i] = 1 / a[i]
			return o
		}

		exports.mix = function(a, b, f, o){
			if(!o) o = exports()
			for(var i = 0; i < a.length; i++) o[i] = a[i] + f * (b[i] - a[i])
			return o
		}

		exports.mix2 = function(a, b, f, o){
			if(!o) o = exports()
			for(var i = 0; i < a.length; i++) o[i] = a[i] + f[i] * (b[i] - a[i])
			return o
		}

		exports.greater = function(a, b){
			if(a[i] < b[i]) return false
			return true
		}

		exports.normalize = function(a, o){
			if(!o) o = exports()
			var d = 0
			for(var i = 0; i < a.length; i++) d += Math.pow(a[i], 2)
			d = Math.sqrt(d)
			for(var i = 0; i < a.length; i++) o[i] = a[i] / d
			return o
		}
	}

	// vec2 type
	exports.vec2 = define.struct({
		r:'x',g:'y',
		s:'x',t:'y',		
		x:exports.float32,
		y:exports.float32
	}, 'vec2')
	vecApi(exports.vec2)

	exports.vec2.fromString = function(color){
		var o = this
		if(this === exports.vec2) o = exports.vec2()
		return vectorParser.parseVec2(color, o)
	}

	exports.vec2.random = function( scale, o){
		if(scale === undefined) scale = 1
		if(!o) o = exports.vec2()
		var r = exports.PI2 * Math.random()
		o[0] = cos(r) * scale
		o[1] = sin(r) * scale
		return o
	}

	exports.vec2.mul = 
	exports.vec2.vec2_mul_vec2 = function(a, b, o){
		if(!o) o = exports.vec2()
		o[0] = a[0] * b[0]
		o[1] = a[1] * b[1]
		return o
	}

	exports.vec2.add = 
	exports.vec2.vec2_add_vec2 = function(a, b, o){
		if(!o) o = exports.vec2()
		o[0] = a[0] + b[0]
		o[1] = a[1] + b[1]
		return o;
	}

	exports.vec2.sub =
	exports.vec2.vec2_sub_vec2 = function(a, b, o){
		if(!o) o = exports.vec2()
		o[0] = a[0] - b[0]
		o[1] = a[1] - b[1]
		return o
	}

	exports.vec2.div = 
	exports.vec2.vec2_div_vec2 = function(a, b, o){
		if(!o) o = exports.vec2()
		o[0] = a[0] / b[0]
		o[1] = a[1] / b[1]
		return o
	}

	exports.vec2.mul_mat2 = 
	exports.vec2.vec2_mul_mat2 = function(v, m, o){
		if(!o) o = exports.vec2()
		o[0] = m[0] * v[0] + m[2] * v[1]
		o[1] = m[1] * v[0] + m[3] * v[1]
		return o
	}

	exports.vec2.mul_mat3 = 
	exports.vec2.vec2_mul_mat3 = function(v, m, o){
		if(!o) o = exports.vec2()
		o[0] = m[0] * v[0] + m[2] * v[1] + m[4]
		o[1] = m[1] * v[0] + m[3] * v[1] + m[5]
		return o
	}

	exports.vec2.mul_mat4 = 
	exports.vec2.vec2_mul_mat4 = function(v, m, o){
		if(!o) o = exports.vec2()
		o[0] = m[0] * v[0] + m[4] * v[1] + m[12]
		o[1] = m[1] * v[0] + m[5] * v[1] + m[13]
		return o
	}
	exports.vec2.mul_mat4_t = 
	exports.vec2.vec2_mul_mat4_t = function(v, m, o){
		if(!o) o = exports.vec2()
		o[0] = m[0] * v[0] + m[1] * v[1] + m[3]
		o[1] = m[4] * v[0] + m[5] * v[1] + m[7]
		return o
	}
	
	exports.vec2.mul_float32 = 
	exports.vec2.vec2_mul_float32 = function(v, f, o){
		if(!o) o = exports.vec2()
		o[0] = v[0] * f
		o[1] = v[1] * f
		return o
	}

	exports.vec2.lessThan = function(a, b, o){
		if(!o) o = exports.bvec2()
		o[0] = a[0] < b[0]
		o[1] = a[1] < b[1]
		return o
	}
	
	exports.vec2.lessThanEqual = function(a, b, o){
		if(!o) o = exports.bvec2()
		o[0] = a[0] <= b[0]
		o[1] = a[1] <= b[1]
		return o
	}
	
	exports.vec2.greaterThan = function(a, b, o){
		if(!o) o = exports.bvec2()
		o[0] = a[0] > b[0]
		o[1] = a[1] > b[1]
		return o
	}

	exports.vec2.greaterThanEqual = function(a, b, o){
		if(!o) o = exports.bvec2()
		o[0] = a[0] >= b[0]
		o[1] = a[1] >= b[1]
		return o
	}

	exports.vec2.equal = function(a, b, o){
		if(!o) o = exports.bvec2()
		o[0] = a[0] == b[0]
		o[1] = a[1] == b[1]
		return o
	}

	exports.vec2.equals = function(a, b){
		return a[0] === b[0] && a[1] === b[1]
	}

	exports.vec2.notEqual = function(a, b, o){
		if(!o) o = exports.bvec2()
		o[0] = a[0] != b[0]
		o[1] = a[1] != b[1]
		return o
	}

	exports.vec2.ortho = function(a, o){
		if(!o) o = exports.vec2()
		var x = -a[1];
		var y = a[0];
		o[0] = x;
		o[1] = y;
		return o;	
	}
	
	// vec3 API
	exports.vec3 = define.struct({
		r:'x',g:'y',b:'z',
		s:'x',t:'y',p:'z',
		x:exports.float32, y:exports.float32, z:exports.float32
	}, 'vec3')
	vecApi(exports.vec3)	
	
	exports.vec3.intersectplane = function(origin, direction, normal, dist) {
		var denom = vec3.dot(direction, normal)
		if (denom !== 0) {
			var t = -(vec3.dot(origin, normal) + dist) / denom
			if (t < 0) {
				console.log("t = 0?")
				return null
			}			
			var diradd = vec3.vec3_mul_float(direction, t);
			var res = vec3.add(origin, diradd);
//			console.log(origin, direction, t,diradd, res);
			return res;
		} 
		else {
			if (vec3.dot(normal, origin) + dist === 0) {
				return origin
			} 
			else {
				return null
			}
		}
	}

	exports.vec2.dot = function(a,b){
		return a[0] * b[0] + a[1] * b[1] ;
	}
	exports.vec3.dot = function(a,b){
	//	console.log(a,b);
		return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	}
	
	exports.vec3.fromString = function(color){
		var o = this
		if(this === exports.vec3) o = exports.vec3()
		return vectorParser.parseVec3(color, o)
	}

	exports.vec3.random = function(scale, o){
		if(scale === undefined) scale = 1
		if(!o) o = exports.vec3()
		var r = 2*exports.PI * Math.random()
		var zr = (Math.random() * 2.0) - 1.0
		o[0] = cos(r) * zr
		o[1] = sin(r) * zr
		o[2] = sqrt(1.0 - zr*zr) * scale
		return o
	}

	exports.vec3.mul = 
	exports.vec3.vec3_mul_vec3 = function(a, b, o){
		if(!o) o = exports.vec3()
		o[0] = a[0] * b[0]
		o[1] = a[1] * b[1]
		o[2] = a[2] * b[2]
		return o
	}

	exports.vec3.mulfloat = 
	exports.vec3.vec3_mul_float = function(a, b, o){
		if(!o) o = exports.vec3()
		o[0] = a[0] * b
		o[1] = a[1] * b
		o[2] = a[2] * b
		return o
	}

	exports.vec3.add = 
	exports.vec3.vec3_add_vec3 = function(a, b, o){
		if(!o) o = exports.vec3()
		o[0] = a[0] + b[0]
		o[1] = a[1] + b[1]
		o[2] = a[2] + b[2]
		return o
	}

	exports.vec3.sub =
	exports.vec3.vec3_sub_vec3 = function(a, b, o){
		if(!o) o = exports.vec3()
		o[0] = a[0] - b[0]
		o[1] = a[1] - b[1]
		o[2] = a[2] - b[2]
		return o
	}

	exports.vec3.div = 
	exports.vec3.vec3_div_vec3 = function(a, b, o){
		if(!o) o = exports.vec3()
		o[0] = a[0] / b[0]
		o[1] = a[1] / b[1]
		o[2] = a[2] / b[2]
		return o
	}

	exports.vec3.mul_mat3 = 
	exports.vec3.vec3_mul_mat3 = function(v, m, o){
		if(!o) o = exports.vec3()
		o[0] = v[0] * m[0] + v[1] * m[1] + v[2] * m[2]
		o[1] = v[0] * m[3] + v[1] * m[4] + v[2] * m[5]
		o[2] = v[0] * m[6] + v[1] * m[7] + v[2] * m[8]
		return o
	}

	exports.vec3.mul_mat4 = 
	exports.vec3.vec3_mul_mat4 = function(v, m, o){
		if(!o) o = exports.vec3()
		var vx = v[0], vy = v[1], vz = v[2], vw = 
			m[12] * vx + m[13] * vy + m[14] * vz + m[15]
		vw = vw || 1.0
		o[0] = (m[0] * vx + m[1] * vy + m[2] * vz + m[3]) / vw
		o[1] = (m[4] * vx + m[5] * vy + m[6] * vz + m[7]) / vw
		o[2] = (m[8] * vx + m[9] * vy + m[10] * vz + m[11]) / vw
		return o
	}

	
	exports.vec3.mul_mat4_minor = 
	exports.vec3.vec3_mul_mat4_minor = function(v, m, o){
		if(!o) o = exports.vec3()
		var vx = v[0], vy = v[1], vz = v[2]
		o[0] = vx * m[0] + vy * m[1] + vz * m[2]
		o[1] = vx * m[4] + vy * m[5] + vz * m[6]
		o[2] = vx * m[8] + vy * m[9] + vz * m[10]			
		return o
	}

	exports.vec3.cross = 
	exports.vec3.vec3_cross_vec3 = function(a, b, o){
		if(!o) o = exports.vec3()
		var ax = a[0], ay = a[1], az = a[2] 
		var bx = b[0], by = b[1], bz = b[2]
		o[0] = ay * bz - az * by
		o[1] = az * bx - ax * bz
		o[2] = ax * by - ay * bx
		return o
	}

	exports.vec3.lessThan = function(a, b, o){
		if(!o) o = exports.bvec3()
		o[0] = a[0] < b[0]
		o[1] = a[1] < b[1]
		o[2] = a[2] < b[2]
		return o
	}
	
	exports.vec3.lessThanEqual = function(a, b, o){
		if(!o) o = exports.bvec3()
		o[0] = a[0] <= b[0]
		o[1] = a[1] <= b[1]
		o[2] = a[2] <= b[2]
		return o
	}
	
	exports.vec3.greaterThan = function(a, b, o){
		if(!o) o = exports.bvec3()
		o[0] = a[0] > b[0]
		o[1] = a[1] > b[1]
		o[2] = a[2] > b[2]
		return o
	}

	exports.vec3.greaterThanEqual = function(a, b, o){
		if(!o) o = exports.bvec3()
		o[0] = a[0] >= b[0]
		o[1] = a[1] >= b[1]
		o[2] = a[2] >= b[2]
		return o
	}

	exports.vec3.equal = function(a, b, o){
		if(!o) o = exports.bvec3()
		o[0] = a[0] == b[0]
		o[1] = a[1] == b[1]
		o[2] = a[2] == b[2]
		return o
	}

	exports.vec3.equals = function(a, b){
		return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
	}

	exports.vec3.notEqual = function(a, b, o){
		if(!o) o = exports.bvec3()
		o[0] = a[0] != b[0]
		o[1] = a[1] != b[1]
		o[2] = a[2] != b[2]
		return o
	}

	// vec4 API
	exports.vec4 = define.struct({
		r:'x',g:'y',b:'z',a:'w',
		s:'x',t:'y',p:'z',q:'w',
		x:exports.float32, y:exports.float32, z:exports.float32, w:exports.float32
	}, 'vec4')
	
	vecApi(exports.vec4)

	exports.vec4.dot = function(a,b){
		return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
	}
	
	// converts standard vec4 color in to HSL space (not to be confused with HSV space!) 
	exports.vec4.toHSL = function(inp){
		var max = Math.max(inp[0], inp[1], inp[2]), min = Math.min(inp[0], inp[1], inp[2]);
		var h, s, l = (max + min) / 2;
		var r = inp[0];
		var g = inp[1];
		var b = inp[2];
		if(max == min){
			h = s = 0; // achromatic
		}else{
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			if (max == inp[0]){
					h = (g - b) / d + (g < b ? 6 : 0); 
			}
			else{
				if (max == inp[1]){
					
				h = (b - r) / d + 2; 
				}
				else{
				
				 h = (r - g) / d + 4; 
				}
			}
			h /= 6;
		}
		return [h, s, l, inp[3]];;
	}

	// calculate an RGBA color from an HSLA color
	// h/s/l/a = [0..1] range.
	exports.vec4.fromHSL = function(h,s,l,a,o){
		if(!o) o = exports.vec4()
			
		var r, g, b;

		if(s == 0){
			r = g = b = l; // achromatic
		}else{
			var 
			hue2rgb = function hue2rgb(p, q, t){
				if(t < 0) {
					t += 1;
				}
				else {
					if(t > 1) t -= 1;
				}
				
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}
			

			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}
		o[0] = r;
		o[1] = g;
		o[2] = b;
		o[3] = a?a:1.0
		
		return o;
	}
	
	// converts standard vec4 color in to HSL space (not to be confused with HSV space!) 
	exports.vec4.toHSV = function(inp){
	
	
    var r = inp[0];
    var g = inp[1];
    var b = inp[2];

    var max = Math.max(r, Math.max(g, b)), min = Math.min(r, Math.min(g, b));
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
//    return { h: h, s: s, v: v };


	
	
		return [h, s, v, inp[3]];;
	}

	// calculate an RGBA color from an HSVA color
	// h/s/l/a = [0..1] range.
	exports.vec4.fromHSV = function(h,s,v,a,o){
		if(!o) o = exports.vec4()
			
		h *= 360;
		if (h < 0) h+=360;

		var r = 0.0;
		var g = 0.0;	
		var b = 0.0;

		if(s == 0.0){
			r = g = b = v; // achromatic
		}else{
			var t1 = v;
			var t2 = (1. - s) * v;
			var t3 = (t1 - t2) * (h %60 ) / 60.;
			if (h == 360.) h = 0.;
			if (h < 60.) { r = t1; b = t2; g = t2 + t3 }
			else if (h < 120.) { g = t1; b = t2; r = t1 - t3 }
			else if (h < 180.) { g = t1; r = t2; b = t2 + t3 }
			else if (h < 240.) { b = t1; r = t2; g = t1 - t3 }
			else if (h < 300.) { b = t1; g = t2; r = t2 + t3 }
			else if (h < 360.) { r = t1; g = t2; b = t1 - t3 }
			else { r = 0.; g = 0.; b = 0. }
		}
		o[0] = r;
		o[1] = g;
		o[2] = b;
		o[3] = a?a:1.0
		return o;
		
	}

	
	exports.vec4.equals = function(a,b)
	{
		if (a[0] != b[0]) return false;
		if (a[1] != b[1]) return false;
		if (a[2] != b[2]) return false;
		if (a[3] != b[3]) return false;
		return true;
	}
	exports.vec4.fromString = function(color, alpha){
		var o = this
		if(this === exports.vec4) o = exports.vec4()
		return vectorParser.parseVec4(color, o)
	}

	// TODO wrong
	exports.vec4.random = function(scale, o){
		if(scale === undefined) scale = 1
		if(!o) o = exports.vec3()
		o[0] = Math.random()
		o[1] = Math.random()
		o[2] = Math.random()
		o[3] = Math.random()
		exports.vec4.normalize(o, o)
		return o
	}

	exports.vec4.mul = 
	exports.vec4.vec4_mul_vec4 = function(a, b, o){
		if(!o) o = exports.vec4()
		o[0] = a[0] * b[0]
		o[1] = a[1] * b[1]
		o[2] = a[2] * b[2]
		o[3] = a[3] * b[3]
		return o
	}

	exports.vec4.mul_float32 = 
	exports.vec4.vec4_mul_float32 = function(a, b, o){
		if(!o) o = exports.vec4()
		o[0] = a[0] * b
		o[1] = a[1] * b
		o[2] = a[2] * b
		o[3] = a[3] * b
		return o
	}

	exports.vec4.vec4_mul_float32_rgb = function(a, b, o){
		if(!o) o = exports.vec4()
		o[0] = a[0] * b
		o[1] = a[1] * b
		o[2] = a[2] * b
		o[3] = a[3] 
		return o
	}

	exports.vec4.add = 
	exports.vec4.vec4_add_vec4 = function(a, b, o){
		if(!o) o = exports.vec4()
		o[0] = a[0] + b[0]
		o[1] = a[1] + b[1]
		o[2] = a[2] + b[2]
		o[3] = a[3] + b[3]
		return o
	}

	exports.vec4.sub =
	exports.vec4.vec4_sub_vec4 = function(a, b, o){
		if(!o) o = exports.vec4()
		o[0] = a[0] - b[0]
		o[1] = a[1] - b[1]
		o[2] = a[2] - b[2]
		o[3] = a[3] - b[3]
		return o
	}

	exports.vec4.div = 
	exports.vec4.vec4_div_vec4 = function(a, b, o){
		if(!o) o = exports.vec4()
		o[0] = a[0] / b[0]
		o[1] = a[1] / b[1]
		o[2] = a[2] / b[2]
		o[3] = a[3] / b[3]
		return o
	}

	exports.vec4.mul_mat4 = 
	exports.vec4.vec4_mul_mat4 = function(v, m, o){
		if(!o) o = exports.vec4()
		var vx = v[0], vy = v[1], vz = v[2], vw = v[3]
		o[0] = m[0] * vx + m[1] * vy + m[2] * vz + m[3] * vw
		o[1] = m[4] * vx + m[5] * vy + m[6] * vz + m[7] * vw
		o[2] = m[8] * vx + m[9] * vy + m[10] * vz + m[11] * vw
		o[3] = m[12] * vx + m[13] * vy + m[14] * vz + m[15] * vw
		return o
	}

	
	exports.vec4.mul_quat = 
	exports.vec4.vec4_mul_quat = function(v, q, o){
		if(!o) o = exports.vec4()
		var vx = v[0], vy = v[1], vz = v[2],
			qx = q[0], qy = q[1], qz = q[2], qw = q[3],
			// calculate quat * vec
			ix = qw * vx + qy * vz - qz * vy,
			iy = qw * vy + qz * vx - qx * vz,
			iz = qw * vz + qx * vy - qy * vx,
			iw = -qx * vx - qy * vy - qz * vz
		// calculate result * inverse quat
		o[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy
		o[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz
		o[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx
		o[3] = v[3]
		return o
	}

	exports.vec4.lessThan = function(a, b, o){
		if(!o) o = exports.bvec4()
		o[0] = a[0] < b[0]
		o[1] = a[1] < b[1]
		o[2] = a[2] < b[2]
		o[3] = a[3] < b[3]
		return o
	}
	
	exports.vec4.lessThanEqual = function(a, b, o){
		if(!o) o = exports.bvec4()
		o[0] = a[0] <= b[0]
		o[1] = a[1] <= b[1]
		o[2] = a[2] <= b[2]
		o[3] = a[3] <= b[3]
		return o
	}
	
	exports.vec4.greaterThan = function(a, b, o){
		if(!o) o = exports.bvec4()
		o[0] = a[0] > b[0]
		o[1] = a[1] > b[1]
		o[2] = a[2] > b[2]
		o[3] = a[3] > b[3]		
		return o
	}

	exports.vec4.greaterThanEqual = function(a, b, o){
		if(!o) o = exports.bvec4()
		o[0] = a[0] >= b[0]
		o[1] = a[1] >= b[1]
		o[2] = a[2] >= b[2]
		o[3] = a[3] >= b[3]	
		return o
	}

	exports.vec4.equal = function(a, b, o){
		if(!o) o = exports.bvec4()
		o[0] = a[0] == b[0]
		o[1] = a[1] == b[1]
		o[2] = a[2] == b[2]
		o[3] = a[3] == b[3]
		return o
	}

	exports.vec4.notEqual = function(a, b, o){
		if(!o) o = exports.bvec4()
		o[0] = a[0] != b[0]
		o[1] = a[1] != b[1]
		o[2] = a[2] != b[2]
		o[3] = a[3] != b[3]
		return o
	}

	exports.quat = define.struct({
		x:exports.float32,
		y:exports.float32,
		z:exports.float32,
		w:exports.float32
	}, 'quat')
	vecApi(exports.quat)

	exports.quat.identity = function(o){
		if(!o) o = exports.quat()
		o[0] = o[1] = o[2] = 0, o[3] = 1
		return o
	}

	exports.quat.mul =
	exports.quat.quat_mul_quat = function(a, b, o){
		if(!o) o = exports.quat()
		var ax = a[0], ay = a[1], az = a[2], aw = a[3],
			bx = b[0], by = b[1], bz = b[2], bw = b[3]
		o[0] = ax * bw + aw * bx + ay * bz - az * by
		o[1] = ay * bw + aw * by + az * bx - ax * bz
		o[2] = az * bw + aw * bz + ax * by - ay * bx
		o[3] = aw * bw - ax * bx - ay * by - az * bz
		return o
	}

	exports.quat.rotateX = function(q, angle, o){
		if(!o) o = exports.quat()
		angle *= 0.5
		var ax = q[0], ay = q[1], az = q[2], aw = q[3],
		    bx = sin(angle), bw = cos(angle)

		o[0] = ax * bw + aw * bx
		o[1] = ay * bw + az * bx
		o[2] = az * bw - ay * bx
		o[3] = aw * bw - ax * bx
		return o
	}

	// rotate quaternion Q with angle A around y axis
	exports.quat.rotateY = function(q, angle, o){
		if(!o) o = exports.quat()
		angle *= 0.5
		var ax = q[0], ay = q[1], az = q[2], aw = q[3],
			by = sin(angle), bw = cos(angle)

		o[0] = ax * bw - az * by
		o[1] = ay * bw + aw * by
		o[2] = az * bw + ax * by
		o[3] = aw * bw - ay * by
		return o
	}

	// rotate quaternion Q with angle A around z axis
	exports.quat.rotateZ = function(q, angle, o){
		if(!o) o = exports.quat()
		angle *= 0.5
		var ax = q.x, ay = q.y, az = q.z, aw = q.w,
			bz = sin(angle), bw = cos(angle)

		o[0] = ax * bw + ay * bz
		o[1] = ay * bw - ax * bz
		o[2] = az * bw + aw * bz
		o[3] = aw * bw - az * bz
		return o
	}

	// Calculate w from xyz
	exports.quat.calculateW = function(q, o){
		if(!o) o = exports.quat()
		o[0] = q[0]
		o[1] = q[1]
		o[2] = q[2]
		o[3] = -sqrt(abs(1.0 - x * x - y * y - z * z))
		return o
	}

	// spherelical linear interpolation between quat A and B with f (0-1)
	exports.quat.slerp = function(a, b, f, o){
		if(!o) o = exports.quat()
		var ax = a[0], ay = a[1], az = a[2], aw = a[3],
			bx = b[0], by = b[1], bz = b[2], bw = b[3]

		var omega, cosom, sinom, scale0, scale1

		// calc cosine
		cosom = ax * bx + ay * by + az * bz + aw * bw
		// adjust signs (if necessary)
		if (cosom < 0.0) {
			cosom = -cosom
			bx = - bx, by = - by, bz = - bz, bw = - bw
		}
		// calculate coefficients
		if ( (1.0 - cosom) > 0.000001 ) {
			// standard case (slerp)
			omega  = acos(cosom)
			sinom  = sin(omega)
			scale0 = sin((1.0 - f) * omega) / sinom
			scale1 = sin(f * omega) / sinom
		} 
		else { // linear interpolate if very close
			scale0 = 1.0 - f
			scale1 = f
		}
		// calculate final values
		o[0] = scale0 * ax + scale1 * bx
		o[1] = scale0 * ay + scale1 * by
		o[2] = scale0 * az + scale1 * bz
		o[3] = scale0 * aw + scale1 * bw
		return o
	}

	// invert Q
	exports.quat.invert = function(q, o){
		if(!o) o = exports.quat()
		var a0 = q[0], a1 = q[1], a2 = q[2], a3 = q[3],
			d = a0*a0 + a1*a1 + a2*a2 + a3*a3,
			i = d ? 1.0/d : 0
		o[0] = -a0*i, o[1] = -a1*i, o[2] = -a2*i, o[3] = a3*i
	}

	// Calculates the conjugate of quat Q
	// If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
	exports.quat.conjugate = function(q, o){
		if(!o) o = exports.quat()
		o[0] = -q[0], o[1] = -q[1], o[2] = -q[2], o[3] = q[3]
		return o
	}

	exports.quat.fromMat3 = function(m, o){
		if(!o) o = exports.quat()
		// Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
		// article "Quaternion Calculus and Fast Animation".
		var t = m[0] + m[4] + m[8], r
		if ( t > 0.0 ) {
			// |w| > 1/2, may as well choose w > 1/2
			r = sqrt(T + 1.0)  // 2w
			w = 0.5 * r
			r = 0.5/r  // 1/(4w)
			x = (m[5]-m[7])*r, y = (m[6]-m[2])*r, z = (m[1]-m[3])*r
		} 
		else {
			// |w| <= 1/2
			var i = 0
			if ( m[4] > m[0] ) i = 1
			if ( m[8] > m[i*3+i] ) i = 2
			var j = (i+1)%3
			var k = (i+2)%3
			
			r = sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0)
			o[i] = 0.5 * r
			r = 0.5 / r
			w = (m[j*3+k] - m[k*3+j]) * r
			o[j] = (m[j*3+i] + m[i*3+j]) * r
			o[k] = (m[k*3+i] + m[i*3+k]) * r
		}
		return o
	}

	exports.mat2 = define.struct({
		a:exports.float32, b:exports.float32, c:exports.float32, d:exports.float32
	}, 'mat2')
	matApi(exports.mat2)

	exports.mat2.identity = function(o){
		if(!o) o = exports.mat2()
		o[0] = 1, o[1] = 0
		o[2] = 0, o[2] = 1
	}

	exports.mat2.mul =
	exports.mat2.mat2_mul_mat2 = function(a, b, o){
		if(!o) o = exports.mat2()
		var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3]
		var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3]
		o[0] = a0 * b0 + a2 * b1
		o[1] = a1 * b0 + a3 * b1
		o[2] = a0 * b2 + a2 * b3
		o[3] = a1 * b2 + a3 * b3
		return o
	}

	exports.mat2.rotate = function(a, angle, o){
		if(!o) o = exports.mat2()
		var a00 = a[0], a01 = a[1], 
		    a10 = a[2], a11 = a[3],
		    s = sin(angle), c = cos(angle)
		o[0] = a00 * c + a10 * s
		o[1] = a01 * c + a11 * s
		o[2] = a00 * -s + a10 * c 
		o[3] = a01 * -s + a11 * c
		return o
	}

	exports.mat2.scale = function(a, scale, o){
		if(!o) o = exports.mat2()
		var s0 = s[0], s1 = s[1]
		o[0] = a[0] * s0
		o[1] = a[1] * s0
		o[2] = a[2] * s1
		o[3] = a[3] * s1
		return o
	}

	exports.mat2.transpose = function(a, o){
		if(!o) o = exports.mat2()
		var a01 = a[1]
		o[1] = a[2]
		o[2] = a01
		o[0] = a[0]
		o[3] = a[3]
		return o
	}

	exports.mat2.outerProduct = function(c, r){
		if(!o) o = exports.mat2()
		o[0] = c[0] * r[0]
		o[1] = c[0] * r[1] 
		o[2] = c[1] * r[0] 
		o[3] = c[1] * r[1]
		return o
	}
	
	exports.mat3 = define.struct({
		a:exports.float32, b:exports.float32, c:exports.float32, 
		d:exports.float32, e:exports.float32, f:exports.float32,
		g:exports.float32, h:exports.float32, i:exports.float32
	}, 'mat3')
	matApi(exports.mat3)

	exports.mat3.identity = function(o){
		if(!o) o = exports.mat3()
		o[0] = 1, o[1] = 0, o[2] = 0
		o[3] = 0, o[4] = 1, o[5] = 0
		o[6] = 0, o[7] = 0, o[8] = 1
		return o
	}

	exports.mat3.transpose = function(a, o){
		if(!o) o = exports.mat3()
		if (o === a) {
			var a01 = a[1], a02 = a[2], a12 = a[5]
			o[1] = a[3], o[2] = a[6], o[3] = a01
			m[5] = a[7], o[6] = a02, o[7] = a12
		} else {
			o[0] = a[0], o[1] = a[3], o[2] = a[6]
			o[3] = a[1], o[4] = a[4], o[5] = a[7]
			o[6] = a[2], o[7] = a[5], o[8] = a[8]
		}
		return o
	}

	exports.mat3.invert = function(a, o){
		if(!o) o = exports.mat3()
		var a00 = a[0], a01 = a[1], a02 = a[2],
			a10 = a[3], a11 = a[4], a12 = a[5],
			a20 = a[6], a21 = a[7], a22 = a[8],
			b01 = a22 * a11 - a12 * a21,
			b11 = -a22 * a10 + a12 * a20,
			b21 = a21 * a10 - a11 * a20,
			d = a00 * b01 + a01 * b11 + a02 * b21

		if (!d) return null

		d = 1.0 / d

		o[0] = b01 * d
		o[1] = (-a22 * a01 + a02 * a21) * d
		o[2] = (a12 * a01 - a02 * a11) * d
		o[3] = b11 * d
		o[4] = (a22 * a00 - a02 * a20) * d
		o[5] = (-a12 * a00 + a02 * a10) * d
		o[6] = b21 * d
		o[7] = (-a21 * a00 + a01 * a20) * d
		o[8] = (a11 * a00 - a01 * a10) * d
		return o
	}

	exports.mat3.adjoint = function(a, o){
		if(!o) o = exports.mat3()
		var a00 = a[0], a01 = a[1], a02 = a[2],
			a10 = a[3], a11 = a[4], a12 = a[5],
			a20 = a[6], a21 = a[7], a22 = a[8]

		o[0] = (a11 * a22 - a12 * a21)
		o[1] = (a02 * a21 - a01 * a22)
		o[2] = (a01 * a12 - a02 * a11)
		o[3] = (a12 * a20 - a10 * a22)
		o[4] = (a00 * a22 - a02 * a20)
		o[5] = (a02 * a10 - a00 * a12)
		o[6] = (a10 * a21 - a11 * a20)
		o[7] = (a01 * a20 - a00 * a21)
		o[8] = (a00 * a11 - a01 * a10)
		return o
	}

	exports.mat3.determinant = function(a){
		return a[0] * (a[8] * a[4] - a[5] * a[7]) + 
			a[1] * (-a[8] * a[3] + a[5] * a[6]) + 
			a[2] * (a[7] * a[3] - a[4] * a[6])
	}

	exports.mat3.mul = 
	exports.mat3.mat3_mul_mat3 = function(a, b, o){
		if(!o) o = exports.mat3()
		var a00 = a[0], a01 = a[1], a02 = a[2],
			a10 = a[3], a11 = a[4], a12 = a[5],
			a20 = a[6], a21 = a[7], a22 = a[8],

			b00 = b[0], b01 = b[1], b02 = b[2],
			b10 = b[3], b11 = b[4], b12 = b[5],
			b20 = b[6], b21 = b[7], b22 = b[8]

		o[0] = b00 * a00 + b01 * a10 + b02 * a20
		o[1] = b00 * a01 + b01 * a11 + b02 * a21
		o[2] = b00 * a02 + b01 * a12 + b02 * a22

		o[3] = b10 * a00 + b11 * a10 + b12 * a20
		o[4] = b10 * a01 + b11 * a11 + b12 * a21
		o[5] = b10 * a02 + b11 * a12 + b12 * a22

		o[6] = b20 * a00 + b21 * a10 + b22 * a20
		o[7] = b20 * a01 + b21 * a11 + b22 * a21
		o[8] = b20 * a02 + b21 * a12 + b22 * a22
		return o
	}

	exports.mat3.translate = function(a, b, o){
		if(!o) o = exports.mat3()
		var a00 = a[0], a01 = a[1], a02 = a[2],
			a10 = a[3], a11 = a[4], a12 = a[5],
			a20 = a[6], a21 = a[7], a22 = a[8],
			x = v[0], y = v[1]

		o[0] = a00, o[1] = a01, o[2] = a02
		o[3] = a10, o[4] = a11, o[5] = a12
		o[6] = x * a00 + y * a10 + a20
		o[7] = x * a01 + y * a11 + a21
		o[8] = x * a02 + y * a12 + a22
		return o
	}	

	exports.mat3.rotate = function(a, angle, o){
		if(!o) o = exports.mat3()

		var a00 = a[0], a01 = a[1], a02 = a[2],
			a10 = a[3], a11 = a[4], a12 = a[5],
			a20 = a[6], a21 = a[7], a22 = a[8],
			s = sin(angle), c = cos(angle)

		o[0] = c * a00 + s * a10, o[1] = c * a01 + s * a11, o[2] = c * a02 + s * a12
		o[3] = c * a10 - s * a00, o[4] = c * a11 - s * a01, o[5] = c * a12 - s * a02
		o[6] = a20,               o[7] = a21,               o[8] = a22
		return o
	}

	exports.mat3.scale = function(a, v, o){
		if(!o) o = exports.mat3()
		var x = v[0], y = v[1]
		o[0] = x * a[0], o[1] = x * a[1], o[2] = x * a[2]
		o[3] = y * a[3], o[4] = y * a[4], o[5] = y * a[5]
		o[6] = a[6],     o[7] = a[7],     o[8] = a[8]
		return o
	}

	exports.mat3.fromQuat = function(q, o){
		if(!o) o = exports.mat3()
		var x = q[0], y = q[1], z = q[2], w = q[3],
			x2 = x + x,  y2 = y + y,  z2 = z + z,
			xx = x * x2, yx = y * x2, yy = y * y2,
			zx = z * x2, zy = z * y2, zz = z * z2,
			wx = w * x2, wy = w * y2, wz = w * z2

		o[0] = 1 - yy - zz, o[1] = yx + wz,     o[2] = zx - wy,     
		o[3] = yx - wz,     o[4] = 1 - xx - zz, o[5] = zy + wx,     
		o[6] = zx + wy,     o[7] = zy - wx,     o[8] = 1 - xx - yy
		return o
	}

	exports.mat3.normalFromMat4 = function(a, o){
		if(!o) o = exports.mat3()

		var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
			a20 = a[8], a21 = a[9], a22 = a[10],a23 = a[11],
			a30 = a[12],a31 = a[13],a32 = a[14],a33 = a[15],
			b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10,
			b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11,
			b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12,
			b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30,
			b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31,
			b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32,
			det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06

		if (!det) return null 
		det = 1.0 / det

		o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det
		o[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det
		o[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det

		o[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det
		o[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det
		o[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det

		o[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det
		o[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det
		o[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det
		return o
	}

	
	exports.mat3.outerProduct = function(c, r){
		if(!o) o = exports.mat3()
		o[0] = c[0] * r[0], m01 = c[0] * r[1], m02 = c[0] * r[2] 
		o[1] = c[1] * r[0], m11 = c[1] * r[1], m12 = c[1] * r[2]
		o[2] = c[2] * r[0], m21 = c[2] * r[1], m22 = c[2] * r[2]
		return o
	}

	exports.mat4 = define.struct({
		a:exports.float32, b:exports.float32, c:exports.float32, d:exports.float32,
		e:exports.float32, f:exports.float32, g:exports.float32, h:exports.float32,
		i:exports.float32, j:exports.float32, k:exports.float32, l:exports.float32,
		m:exports.float32, n:exports.float32, o:exports.float32, p:exports.float32
	}, 'mat4')
	matApi(exports.mat4)

	exports.mat4.debug = function(d, inline){
		var r = "";
		for(var i =0 ;i<16;i+=4){
			r += (Array(6).join(' ') + Math.round(d[i]*1000)/1000).slice(-6) + ", ";
			 r +=(Array(6).join(' ') +  Math.round(d[i+1]*1000)/1000).slice(-6) + ", ";
			 r += (Array(6).join(' ') + Math.round(d[i+2]*1000)/1000).slice(-6) + ", ";
			 r += (Array(6).join(' ') + Math.round(d[i+3]*1000)/1000).slice(-6) + "  ";
			if (!inline){ 
				console.log(r); r = "";
			}
		}
		if (inline) console.log(r);
	}
	
	exports.mat4.identity = function(o){
		if(!o) o = exports.mat4()
		o[0] = 1, o[1] = 0, o[2] = 0, o[3] = 0,
		o[4] = 0, o[5] = 1, o[6] = 0, o[7] = 0,
		o[8] = 0, o[9] = 0, o[10]= 1, o[11]= 0,
		o[12]= 0, o[13]= 0, o[14]= 0, o[15]= 1
		return o
	}
	
	exports.mat4.normalFromMat4 = function(a, o){
		if(!o) o = exports.mat4()

		var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
			a20 = a[8], a21 = a[9], a22 = a[10],a23 = a[11],
			a30 = a[12],a31 = a[13],a32 = a[14],a33 = a[15],
			b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10,
			b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11,
			b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12,
			b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30,
			b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31,
			b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32,
			det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06

		if (!det) return null 
		det = 1.0 / det

		o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det
		o[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det
		o[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det

		o[4] = (a02 * b10 - a01 * b11 - a03 * b09) * det
		o[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det
		o[6] = (a01 * b08 - a00 * b10 - a03 * b06) * det

		o[8] = (a31 * b05 - a32 * b04 + a33 * b03) * det
		o[9] = (a32 * b02 - a30 * b05 - a33 * b01) * det
		o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det
		o[15] = 1.0;
		return o
	}
	
	exports.mat4.T2 = function(t, o){
		if(!o) o = exports.mat4()
		o[0] = 1, o[1] = 0, o[2] = 0, o[3] = t[0],
		o[4] = 0, o[5] = 1, o[6] = 0, o[7] = t[1],
		o[8] = 0, o[9] = 0, o[10]= 1, o[11]= t[2],
		o[12]= 0, o[13]= 0, o[14]= 0, o[15]= 1
		return o
	}

	exports.mat4.T = function(tx, ty, tz, o){
		if(!o) o = exports.mat4()
		o[0] = 1, o[1] = 0, o[2] = 0, o[3] = tx,
		o[4] = 0, o[5] = 1, o[6] = 0, o[7] = ty,
		o[8] = 0, o[9] = 0, o[10]= 1, o[11]= tz,
		o[12]= 0, o[13]= 0, o[14]= 0, o[15]= 1
		return o
	}

	exports.mat4.S2 = function(s, o){
		if(!o) o = exports.mat4()
		o[0] = s[0], o[1] = 0,   o[2] = 0,   o[3] = 0,
		o[4] = 0,   o[5] = s[1], o[6] = 0,   o[7] = 0,
		o[8] = 0,   o[9] = 0,   o[10]= s[2], o[11]= 0,
		o[12]= 0,   o[13]= 0,   o[14]= 0,   o[15]= 1
		return o
	}

	exports.mat4.S = function(sx, sy, sz, o){
		if(!o) o = exports.mat4()
		o[0] = sx,  o[1] = 0,   o[2] = 0,   o[3] = 0,
		o[4] = 0,   o[5] = sy,  o[6] = 0,   o[7] = 0,
		o[8] = 0,   o[9] = 0,   o[10]= sz,  o[11]= 0,
		o[12]= 0,   o[13]= 0,   o[14]= 0,   o[15]= 1
		return o
	}

	exports.mat4.ST2 = function(s, t, o){
		if(!o) o = exports.mat4()
		o[0] = s[0], o[1] = 0,    o[2] = 0,    o[3] = t[0],
		o[4] = 0,    o[5] = s[1], o[6] = 0,    o[7] = t[1],
		o[8] = 0,    o[9] = 0,    o[10]= s[2], o[11]= t[2],
		o[12]= 0,    o[13]= 0,    o[14]= 0,    o[15]= 1
		return o
	}

	exports.mat4.ST = function(sx, sy, sz, tx, ty, tz, o){
		if(!o) o = exports.mat4()
		o[0] = sx, o[1] = 0,   o[2] = 0,   o[3] = tx,
		o[4] = 0,  o[5] = sy,  o[6] = 0,   o[7] = ty,
		o[8] = 0,  o[9] = 0,   o[10]= sz,  o[11]= tz,
		o[12]= 0,  o[13]= 0,   o[14]= 0,   o[15]= 1
		return o
	}

	exports.mat4.TS2 = function(t, s, o){
		if(!o) o = exports.mat4()
		o[0] = s[0], o[1] = 0,    o[2] = 0,    o[3] = t[0]*s[0],
		o[4] = 0,    o[5] = s[1], o[6] = 0,    o[7] = t[1]*s[1],
		o[8] = 0,    o[9] = 0,    o[10]= s[2], o[11]= t[2]*s[2],
		o[12]= 0,    o[13]= 0,    o[14]= 0,    o[15]= 1
		return o
	}

	exports.mat4.TS = function(tx, ty, tz, sx, sy, sz, o){
		if(!o) o = exports.mat4()
		o[0] = sx,  o[1] = 0,   o[2] = 0,   o[3] = tx*sx,
		o[4] = 0,   o[5] = sy,  o[6] = 0,   o[7] = ty*sy,
		o[8] = 0,   o[9] = 0,   o[10]= sz,  o[11]= tz*sz,
		o[12]= 0,   o[13]= 0,   o[14]= 0,   o[15]= 1
		return o
	}

	exports.mat4.R2 = function(r, o){
		if(!o) o = exports.mat4()
		var cx = Math.cos(r[0]), cy = Math.cos(r[1]), cz = Math.cos(r[2])
		var sx = Math.sin(r[0]), sy = Math.sin(r[1]), sz = Math.sin(r[2])
		o[0] = cy * cz + sx * sy * sz,  o[1] = -sz*cy+cz*sx*sy,  o[2] = sy*cx,     o[3] = 0
		o[4] = sz * cx,                 o[5] = cx*cz,            o[6] = -sx,       o[7] = 0
		o[8] = -sy * cz + cy * sx * sz, o[9] = sy*sz+cy*sx*cz,   o[10] = cx * cy,  o[11] = 0
		o[13] = 0,                      o[13] = 0,               o[14] = 0,        o[15] = 1
		return o
	}

	exports.mat4.R = function(rz, rx, ry, o){
		if(!o) o = exports.mat4()
		var cx = Math.cos(rx), cy = Math.cos(ry), cz = Math.cos(rz)
		var sx = Math.sin(rx), sy = Math.sin(ry), sz = Math.sin(rz)
		o[0] = cy * cz + sx * sy * sz,  o[1] = -sz*cy+cz*sx*sy,  o[2] = sy*cx,     o[3] = 0
		o[4] = sz * cx,                 o[5] = cx*cz,            o[6] = -sx,       o[7] = 0
		o[8] = -sy * cz + cy * sx * sz, o[9] = sy*sz+cy*sx*cz,   o[10] = cx * cy,   o[11] = 0
		o[13] = 0,                       o[13] = 0,                o[14] = 0,         o[15] = 1
		return o
	}

	
	exports.mat4.RT2 = function(r, t, o){
		if(!o) o = exports.mat4()
		var cx = Math.cos(r[0]), cy = Math.cos(r[1]), cz = Math.cos(r[2])
		var sx = Math.sin(r[0]), sy = Math.sin(r[1]), sz = Math.sin(r[2])

		o[0] = cy * cz + sx * sy * sz,  o[1] = -sz*cy+cz*sx*sy,  o[2] = sy*cx,     o[3] = t[0]
		o[4] = sz * cx,                 o[5] = cx*cz,            o[6] = -sx,       o[7] = t[1]
		o[8] = -sy * cz + cy * sx * sz, o[9] = sy*sz+cy*sx*cz,   o[10] = cx * cy,   o[11] = t[2]
		o[13] = 0,                       o[13] = 0,                o[14] = 0,         o[15] = 1
		return o
	}

	exports.mat4.RT = function(rx, ry, rz, tx, ty, tz, o){
		if(!o) o = exports.mat4()
		var cx = Math.cos(rx), cy = Math.cos(ry), cz = Math.cos(rz)
		var sx = Math.sin(rx), sy = Math.sin(ry), sz = Math.sin(rz)
		o[0] = cy * cz + sx * sy * sz,  o[1] = -sz*cy+cz*sx*sy,  o[2] = sy*cx,     o[3] = tx
		o[4] = sz * cx,                 o[5] = cx*cz,            o[6] = -sx,       o[7] = ty
		o[8] = -sy * cz + cy * sx * sz, o[9] = sy*sz+cy*sx*cz,   o[10] = cx * cy,   o[11] = tz
		o[13] = 0,                       o[13] = 0,                o[14] = 0,         o[15] = 1
		return o
	}

	exports.mat4.RT2 = function(r, t, o){
		if(!o) o = exports.mat4()
		var cx = Math.cos(r[0]), cy = Math.cos(r[1]), cz = Math.cos(r[2])
		var sx = Math.sin(r[0]), sy = Math.sin(r[1]), sz = Math.sin(r[2])

		o[0] = cy * cz + sx * sy * sz,  o[1] = -sz*cy+cz*sx*sy,  o[2] = sy*cx,     o[3] = t[0]
		o[4] = sz * cx,                 o[5] = cx*cz,            o[6] = -sx,       o[7] = t[1]
		o[8] = -sy * cz + cy * sx * sz, o[9] = sy*sz+cy*sx*cz,   o[10] = cx * cy,   o[11] = t[2]
		o[13] = 0,                       o[13] = 0,                o[14] = 0,         o[15] = 1
	}

	exports.mat4.TRT = function(t1x, t1y, t1z, rx, ry, rz, t2x, t2y, t2z, o){
		if(!o) o = exports.mat4()
		var cx = Math.cos(rx), cy = Math.cos(ry), cz = Math.cos(rz)
		var sx = Math.sin(rx), sy = Math.sin(ry), sz = Math.sin(rz)
		o[0] = cy * cz + sx * sy * sz,  o[1] = -sz*cy+cz*sx*sy,  o[2] = sy*cx,     o[3] = t2x + o[0]*t1x + o[1]*t1y + o[2]*t1z
		o[4] = sz * cx,                 o[5] = cx*cz,            o[6] = -sx,       o[7] = t2y + o[4]*t1x + o[5]*t1y + o[6]*t1z
		o[8] = -sy * cz + cy * sx * sz, o[9] = sy*sz+cy*sx*cz,   o[10] = cx * cy,   o[11] = t2z + o[8]*t1x + o[9]*t1y + o[10]*t1z
		o[13] = 0,                       o[13] = 0,                o[14] = 0,         o[15] = 1
		return o
	}

	exports.mat4.TRT2 = function(t1, r, t2, o){
		if(!o) o = exports.mat4()
		var rx = r[0], ry = r[1], rz = r[2]
		var t1x = t1[0], t1y = t1[1], t1z = t[2]
		var t2x = t2[0], t2y = t2[1], t2z = t[2]
		var cx = Math.cos(rx), cy = Math.cos(ry), cz = Math.cos(rz)
		var sx = Math.sin(rx), sy = Math.sin(ry), sz = Math.sin(rz)
		o[0] = cy * cz + sx * sy * sz,  o[1] = -sz*cy+cz*sx*sy,  o[2] = sy*cx,     o[3] = t2x + o[0]*t1x + o[1]*t1y + o[2]*t1z
		o[4] = sz * cx,                 o[5] = cx*cz,            o[6] = -sx,       o[7] = t2y + o[4]*t1x + o[5]*t1y + o[6]*t1z
		o[8] = -sy * cz + cy * sx * sz, o[9] = sy*sz+cy*sx*cz,   o[10] = cx * cy,   o[11] = t2z + o[8]*t1x + o[9]*t1y + o[10]*t1z
		o[13] = 0,                       o[13] = 0,                o[14] = 0,         o[15] = 1
		return o
	}


	exports.mat4.TSRT = function(t1x, t1y, t1z, mx, my, mz, rx, ry, rz, t2x, t2y, t2z, o){
		if(!o) o = exports.mat4()
		var cx = Math.cos(rx), cy = Math.cos(ry), cz = Math.cos(rz)
		var sx = Math.sin(rx), sy = Math.sin(ry), sz = Math.sin(rz)
		o[0] = mx*(cy * cz + sx * sy * sz),  o[1] = my*(-sz*cy+cz*sx*sy),  o[2] = mz*(sy*cx),     o[3] = t2x + (o[0]*t1x + o[1]*t1y + o[2]*t1z)
		o[4] = mx*(sz * cx),                 o[5] = my*(cx*cz),            o[6] = mz*(-sx),       o[7] = t2y + (o[4]*t1x + o[5]*t1y + o[6]*t1z)
		o[8] = mx*(-sy * cz + cy * sx * sz), o[9] = my*(sy*sz+cy*sx*cz),   o[10] = mz*(cx * cy),   o[11] = t2z + (o[8]*t1x + o[9]*t1y + o[10]*t1z)	
		o[13] = 0,                       o[13] = 0,                o[14] = 0,         o[15] = 1
		return o
	}

	exports.mat4.TSRT2 = function(t1, m, r, t2, o){
		if(!o) o = exports.mat4()
		var rx = r[0], ry = r[1], rz = r[2]
		var mx = m[0], my = m[1], mz = m[2]
		var t1x = t1[0], t1y = t1[1], t1z = t1[2]
		var t2x = t2[0], t2y = t2[1], t2z = t2[2]
		var cx = Math.cos(rx), cy = Math.cos(ry), cz = Math.cos(rz)
		var sx = Math.sin(rx), sy = Math.sin(ry), sz = Math.sin(rz)
		o[0] = mx*(cy * cz + sx * sy * sz),  o[1] = my*(-sz*cy+cz*sx*sy),  o[2] = mz*(sy*cx),     o[3] = t2x + (o[0]*t1x + o[1]*t1y + o[2]*t1z)
		o[4] = mx*(sz * cx),                 o[5] = my*(cx*cz),            o[6] = mz*(-sx),       o[7] = t2y + (o[4]*t1x + o[5]*t1y + o[6]*t1z)
		o[8] = mx*(-sy * cz + cy * sx * sz), o[9] = my*(sy*sz+cy*sx*cz),   o[10] = mz*(cx * cy),   o[11] = t2z + (o[8]*t1x + o[9]*t1y + o[10]*t1z)	
		o[13] = 0,                       o[13] = 0,                o[14] = 0,         o[15] = 1
		return o
	}

	exports.mat4.transpose = function(a, o){
		if(!o) o = exports.mat4()
		if (a === o) {
			var a01 = a[1], a02 = a[2], a03 = a[3], a12 = a[6], a13 = a[7], a23 = a[11]
			o[1] = a[4], o[2] = a[8], o[3] = a[12],o[4] = a01
			o[6] = a[9], o[7] = a[13],o[8] = a02,  o[9] = a12
			o[11]= a[14], o[12]= a03,   o[13] = a13,  o[14]= a23
		} 
		else {
			o[0] = a[0], o[1] = a[4], o[2] = a[8], o[3] = a[12]
			o[4] = a[1], o[5] = a[5], o[6] = a[9], o[7] = a[13]
			o[8] = a[2], o[9] = a[6], o[10] = a[10],o[11] = a[14]
			o[12] = a[3], o[13] = a[7], o[14] = a[11],o[15] = a[15]
		}
		return o
	}

	// Invert matrix a
	exports.mat4.invert = function(a, o){
		if(!o) o = exports.mat4()
		var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
			a20 = a[8], a21 = a[9], a22 = a[10],a23 = a[11],
			a30 = a[12],a31 = a[13],a32 = a[14],a33 = a[15],

			b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10,
			b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11,
			b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12,
			b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30,
			b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31,
			b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32,

			d = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06

		if (!d) return exports.mat4.identity() 
		d = 1.0 / d

		o[0]  = (a11 * b11 - a12 * b10 + a13 * b09) * d
		o[1]  = (a02 * b10 - a01 * b11 - a03 * b09) * d
		o[2]  = (a31 * b05 - a32 * b04 + a33 * b03) * d
		o[3]  = (a22 * b04 - a21 * b05 - a23 * b03) * d
		o[4]  = (a12 * b08 - a10 * b11 - a13 * b07) * d
		o[5]  = (a00 * b11 - a02 * b08 + a03 * b07) * d
		o[6]  = (a32 * b02 - a30 * b05 - a33 * b01) * d
		o[7]  = (a20 * b05 - a22 * b02 + a23 * b01) * d
		o[8]  = (a10 * b10 - a11 * b08 + a13 * b06) * d
		o[9]  = (a01 * b08 - a00 * b10 - a03 * b06) * d
		o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * d
		o[11] = (a21 * b02 - a20 * b04 - a23 * b00) * d
		o[12] = (a11 * b07 - a10 * b09 - a12 * b06) * d
		o[13] = (a00 * b09 - a01 * b07 + a02 * b06) * d
		o[14] = (a31 * b01 - a30 * b03 - a32 * b00) * d
		o[15] = (a20 * b03 - a21 * b01 + a22 * b00) * d
		return o
	}

	exports.mat4.adjoint = function(a, o) {
		if(!o) o = exports.mat4()
		var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
			a20 = a[8], a21 = a[9], a22 = a[10],a23 = a[11],
			a30 = a[12],a31 = a[13],a32 = a[14],a33 = a[15]

		o[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22))
		o[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22))
		o[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12))
		o[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12))
		o[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22))
		o[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22))
		o[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12))
		o[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12))
		o[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21))
		o[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21))
		o[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11))
		o[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11))
		o[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21))
		o[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21))
		o[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11))
		o[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11))
		return o
	}

	// multiply matrix a with vector or matrix V
	exports.mat4.mul = 
	exports.mat4.mat4_mul_mat4 = function(a, b, o){
		if(!o) o = exports.mat4()
		var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
			a20 = a[8], a21 = a[9], a22 = a[10],a23 = a[11],
			a30 = a[12],a31 = a[13],a32 = a[14],a33 = a[15]

		var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3]
		o[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30
		o[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31
		o[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32
		o[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33

		b0 = b[4], b1 = b[5], b2 = b[6], b3 = b[7]
		o[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30
		o[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31
		o[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32
		o[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33

		b0 = b[8], b1 = b[9], b2 = b[10], b3 = b[11]
		o[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30
		o[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31
		o[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32
		o[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33

		b0 = b[12], b1 = b[13], b2 = b[14], b3 = b[15]
		o[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30
		o[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31
		o[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32
		o[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33
		return o
	}

	// compute determinant of matrix a
	exports.mat4.determinant = function(a){
		var b00 = a[0] * a[5] - a[1] * a[4], b01 = a[0] * a[6] - a[2] * a[4],
			b02 = a[0] * a[7] - a[3] * a[4], b03 = a[1] * a[6] - a[2] * a[5],
			b04 = a[1] * a[7] - a[3] * a[5], b05 = a[2] * a[7] - a[3] * a[6],
			b06 = a[8] * a[13] - a[9] * a[12], b07 = a[8] * a[14] - a[10] * a[12],
			b08 = a[8] * a[15] - a[11] * a[12], b09 = a[9] * a[14] - a[10] * a[13],
			b10 = a[9] * a[15] - a[11] * a[13], b11 = a[10] * a[15] - a[11] * a[14]

		// Calculate the determinant
		return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	}

	// translate matrix a with vector V
	exports.mat4.translate = function(a, v, o){
		if(!o) o = exports.mat4()
		var x = v[0], y = v[1], z = v[2],
			a00, a01, a02, a03,
			a10, a11, a12, a13,
			a20, a21, a22, a23

		if (a === o) {
			o[12] = a[0] * x + a[4] * y + a[8] * z + a[12]
			o[13] = a[1] * x + a[5] * y + a[9] * z + a[13]
			o[14] = a[2] * x + a[6] * y + a[10] * z + a[14]
			o[15] = a[3] * x + a[7] * y + a[11] * z + a[15]
		} 
		else {
			a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3]
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7]
			a20 = a[8], a21 = a[9], a22 = a[10],a23 = a[11]

			o[0] = a00, o[1] = a01, o[2] = a02, o[3] = a03
			o[4] = a10, o[5] = a11, o[6] = a12, o[7] = a13
			o[8] = a20, o[9] = a21, o[10] = a22,o[11] = a23

			o[12] = a00 * x + a10 * y + a20 * z + a[12]
			o[13] = a01 * x + a11 * y + a21 * z + a[13]
			o[14] = a02 * x + a12 * y + a22 * z + a[14]
			o[15] = a03 * x + a13 * y + a23 * z + a[15]
		}
		return o
	}

	exports.mat4.scalematrix = function(v, o)
	{
		if(!o) {
			o = exports.mat4.identity()
		}
		else{
			for (var i =0 ;i<16;i++) o[i] = 0;
		}
		o[0] = v[0];
		o[5] = v[1];
		o[10] = v[2];
		o[15] = 1;		
		return o;
		
	}
	
	exports.mat4.translatematrix = function(v, o)
	{
		if(!o) {
			o = exports.mat4.identity()
		}
		else{
			for (var i =0 ;i<16;i++) o[i] = 0;
		}
		o[3] = v[0];
		o[7] = v[1];
		o[11] = v[2];
		o[15] = 1;		
		return o;
		
	}


	// scale matrix a with vector V
	exports.mat4.scale = function(a, v, o){
		if(!o) o = exports.mat4()
		var x = v[0], y = v[1], z = v[2]

		o[0] = a[0] * x, o[1] = a[1] * x, o[2] = a[2] * x, o[3] = a[3] * x
		o[4] = a[4] * y, o[5] = a[5] * y, o[6] = a[6] * y, o[7] = a[7] * y
		o[8] = a[8] * z, o[9] = a[9] * z, o[10]= a[10]* z, o[11]= a[11] * z
		o[12]= a[12],    o[13]= a[13],    o[14]= a[14],    o[15]= a[15]
		return o
	}

	// rotate matrix a by angle A in radians around axis v
	exports.mat4.rotate = function(a, angle, v, o){
		if(!o) o = exports.mat4()
		var x = v[0], y = v[1], z = v[2],
			len = Math.sqrt(x * x + y * y + z * z),
			s = Math.sin(angle), 
			c = Math.cos(angle), 
			t = 1 - c,

		len = 1 / len
		x *= len, y *= len, z *= len

		if (abs(len) < 0.000001) return null

		var a00 = a[0], a01 = a[1], a02 = a[2],  a03 = a[3],
			a10 = a[4], a11 = a[5], a12 = a[6],  a13 = a[7],
			a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11]

		// Construct the elements of the rotation matrix
		var b00 = x * x * t + c,     b01 = y * x * t + z * s, b02 = z * x * t - y * s,
			b10 = x * y * t - z * s, b11 = y * y * t + c,     b12 = z * y * t + x * s,
			b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c

		// Perform rotation-specific matrix multiplication
		o[0] = a00 * b00 + a10 * b01 + a20 * b02
		o[1] = a01 * b00 + a11 * b01 + a21 * b02
		o[2] = a02 * b00 + a12 * b01 + a22 * b02
		o[3] = a03 * b00 + a13 * b01 + a23 * b02
		o[4] = a00 * b10 + a10 * b11 + a20 * b12
		o[5] = a01 * b10 + a11 * b11 + a21 * b12
		o[6] = a02 * b10 + a12 * b11 + a22 * b12
		o[7] = a03 * b10 + a13 * b11 + a23 * b12
		o[8] = a00 * b20 + a10 * b21 + a20 * b22
		o[9] = a01 * b20 + a11 * b21 + a21 * b22
		o[10]= a02 * b20 + a12 * b21 + a22 * b22
		o[11]= a03 * b20 + a13 * b21 + a23 * b22

		if (a !== o) { // If the source and destination differ, copy the unchanged last row
			o[12] = a[12]
			o[13] = a[13]
			o[14] = a[14]
			o[15] = a[15]
		}
		return o
	}

	// Rotate matrix a by angle A around x-axis
	exports.mat4.rotateX = function(a, angle, o){
		if(!o) o = exports.mat4()
		var s = Math.sin(angle), c = Math.cos(angle),
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
			a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11]

		if (a !== o){ // If the source and destination differ, copy the unchanged rows
			o[0] = a[0], o[1] = a[1], o[2] = a[2], o[3] = a[3]
			o[12] = a[12],o[13] = a[13],o[14] = a[14],o[15] = a[15]
		}

		// Perform axis-specific matrix multiplication
		o[4] = a10 * c + a20 * s, o[5] = a11 * c + a21 * s
		o[6] = a12 * c + a22 * s, o[7] = a13 * c + a23 * s
		o[8] = a20 * c - a10 * s, o[9] = a21 * c - a11 * s
		o[10] = a22 * c - a12 * s, o[11] = a23 * c - a13 * s
		return o
	}

	// rotate matrix a with angle R around y-axis
	exports.mat4.rotateY = function(a, angle, o){
		if(!o) o = exports.mat4()
		var s = Math.sin(angle), c = Math.cos(angle),
			a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
			a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11]

		if (a !== o) { // If the source and destination differ, copy the unchanged rows
			o[4] = a[4], o[5] = a[5], o[6] = a[6], o[7] = a[7]
			o[12]= a[12], o[13]= a[13], o[14]= a[14], o[15]= a[15]
		}

		// Perform axis-specific matrix multiplication
		o[0] = a00 * c - a20 * s, o[1] = a01 * c - a21 * s
		o[2] = a02 * c - a22 * s, o[3] = a03 * c - a23 * s
		o[8] = a00 * s + a20 * c, o[9] = a01 * s + a21 * c
		o[10] = a02 * s + a22 * c, o[11] = a03 * s + a23 * c
		return o
	}

	// rotate matrix a with angle R around z-axis
	exports.mat4.rotateZ = function(a, angle, o){
		if(!o) o = exports.mat4()
		var s = Math.sin(angle), c = Math.cos(angle),
			a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7]

		if (a !== o) { // If the source and destination differ, copy the unchanged last row
			o[8] = a[8],  o[9] = a[9],  o[10] = a[10], o[11] = a[11]
			o[12] = a[12], o[13] = a[13], o[14] = a[14], o[15] = a[15]
		}
		// Perform axis-specific matrix multiplication
		o[0] = a00 * c + a10 * s, o[1] = a01 * c + a11 * s
		o[2] = a02 * c + a12 * s, o[3] = a03 * c + a13 * s
		o[4] = a10 * c - a00 * s, o[5] = a11 * c - a01 * s
		o[6] = a12 * c - a02 * s, o[7] = a13 * c - a03 * s
		return o
	}

	// Create matrix from quaternion Q and translation V
	exports.mat4.fromQuatTrans = function(q, v, o){
		if(!o) o = exports.mat4()
		// Quaternion math
		var x = q[0], y = q[1], z = q[2], w = q[3],
			x2 = x + x,  y2 = y + y,  z2 = z + z,
			xx = x * x2, xy = x * y2, xz = x * z2,
			yy = y * y2, yz = y * z2, zz = z * z2,
			wx = w * x2, wy = w * y2, wz = w * z2

		o[0] = 1 - (yy + zz), o[1] = xy + wz,       o[2] = xz - wy,       o[3] = 0
		o[4] = xy - wz,       o[5] = 1 - (xx + zz), o[6] = yz + wx,       o[7] = 0
		o[8] = xz + wy,       o[9] = yz - wx,       o[10]= 1 - (xx + yy), o[11] = 0
		o[12] = v[0],        o[13] = v[1],          o[14]= v[2],          o[15] = 1
		return o
	}

	// Create matrix from quaternion Q
	exports.mat4.fromQuat = function(q, o){
		if(!o) o = exports.mat4()
		var x = q[0], y = q[1], z = q[2], w = q[3],
			x2 = x + x,  y2 = y + y,  z2 = z + z,
			xx = x * x2, yx = y * x2, yy = y * y2,
			zx = z * x2, zy = z * y2, zz = z * z2,
			wx = w * x2, wy = w * y2, wz = w * z2

		o[0] = 1 - yy - zz, o[1] = yx + wz,     o[2] = zx - wy,      o[3] = 0
		o[4] = yx - wz,     o[5] = 1 - xx - zz, o[6] = zy + wx,      o[7] = 0
		o[8] = zx + wy,     o[9] = zy - wx,     o[10] = 1 - xx - yy,  o[11] = 0
		o[12] = 0,           o[13] = 0,           o[14] = 0,            o[15] = 1
		return o
	}
	
	// Create matrix from left/right/bottom/top/near/far
	exports.mat4.fustrum = function(L, R, T, B, N, F, o){
		if(!o) o = exports.mat4()
		var rl = 1 / (R - L), tb = 1 / (T - B), nf = 1 / (N - F)
		o[0] = (N * 2) * rl, o[1] = 0,            o[2] = 0,                o[3] = 0
		o[4] = 0,            o[5] = (N * 2) * tb, o[6] = 0,                o[7] = 0
		o[8] = (R + L) * rl, o[9] = (T + B) * tb, o[10] = (F + N) * nf,     o[11] = -1
		o[12] = 0,            o[13] = 0,            o[14] = (F * N * 2) * nf, o[15] = 0
		return o
	}

	// Create perspective matrix FovY, Aspect, Near, Far
	exports.mat4.perspective = function(FY, A, N, F, o){
		if(!o) o = exports.mat4()
		var f = 1.0 / Math.tan(FY / 2), nf = 1 / (N - F)
		
		o[0] = f / A, o[4] = 0,  o[8] = 0,                 o[12] = 0
		o[1] = 0,     o[5] = f,  o[9] = 0,                 o[13] = 0
		o[2] = 0,     o[6] = 0,  o[10] = (F + N) * nf,      o[14] = -1
		o[3] = 0,     o[7] = 0,  o[11] = (2 * F * N) * nf,  o[15] = 0
		return o
	}
 
	// Create orthogonal proj matrix with Left/Right/Bottom/Top/Near/Far
	exports.mat4.ortho = function(L, R, T, B, N, F, o){
		if(!o) o = exports.mat4()
		var lr = 1 / (L - R), bt = 1 / (B - T), nf = 1 / (N - F)
		o[0] = -2 * lr,      o[4] = 0,            o[8] = 0,            o[12] = 0 
		o[1] = 0,            o[5] = -2 * bt,      o[9] = 0,            o[13] = 0 
		o[2] = 0,            o[6] = 0,            o[10] = 2 * nf,       o[14] = 0
		o[3] = (L + R) * lr, o[7] = (T + B) * bt, o[11] = (F + N) * nf, o[15] = 1
		return o
	}

	// Create look at matrix with Eye, LookAt, and Up vectors 
	exports.mat4.lookAt = function(eye, look, up, o){
		if(!o) o = exports.mat4()
		var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
			ex = eye[0], ux = up[0], lx = look[0], 
			ey = eye[1], uy = up[1], ly = look[1],
			ez = eye[2], uz = up[2], lz = look[2]		

		if (Math.abs(ex - lx) < 0.000001 &&
			Math.abs(ey - ly) < 0.000001 &&
			Math.abs(ez - lz) < 0.000001) {
			return exports.mat4.identity(o)
		}

		z0 = ex - lx, z1 = ey - ly, z2 = ez - lz
		len = 1 / sqrt(z0 * z0 + z1 * z1 + z2 * z2)
		z0 *= len, z1 *= len, z2 *= len

		x0 = uy * z2 - uz * z1, x1 = uz * z0 - ux * z2, x2 = ux * z1 - uy * z0
		len = sqrt(x0 * x0 + x1 * x1 + x2 * x2)

		if (!len)  x0 = 0, x1 = 0, x2 = 0
		else  len = 1 / len, x0 *= len, x1 *= len, x2 *= len

		y0 = z1 * x2 - z2 * x1, y1 = z2 * x0 - z0 * x2, y2 = z0 * x1 - z1 * x0
		len = sqrt(y0 * y0 + y1 * y1 + y2 * y2)

		if (!len)  y0 = 0, y1 = 0, y2 = 0
		else len = 1 / len, y0 *= len, y1 *= len, y2 *= len

		
		o[0] = x0, o[4] = y0,  o[8] = z0,  o[12] = 0
		o[1] = x1, o[5] = y1,  o[9] = z1,  o[13] = 0
		o[2] = x2, o[6] = y2, o[10] = z2,  o[14] = 0
		
		o[3] =  -(x0 * ex + x1 * ey + x2 * ez)
		o[7] =  -(y0 * ex + y1 * ey + y2 * ez)
		o[11] = -(z0 * ex + z1 * ey + z2 * ez)
		o[15] = 1
		return o
	}

	exports.mat4.outerProduct = function(c, r, o){
		if(!o) o = exports.mat4()
		o[0] = c[0] * r[0], o[1] = c[0] * r[1], o[2] = c[0] * r[2], o[3] = c[0] * r[3] 
		o[4] = c[1] * r[0], o[5] = c[1] * r[1], o[6] = c[1] * r[2], o[7] = c[1] * r[3]
		o[8] = c[2] * r[0], o[9] = c[2] * r[1], o[10] = c[2] * r[2], o[11] = c[2] * r[3]
		o[12] = c[3] * r[0], o[13] = c[3] * r[1], o[14] = c[3] * r[2], o[15] = c[3] * r[3] 
		return o
	}
	
	exports.rect = define.struct({
		left:exports.float32, 
		top:exports.float32,
		right:exports.float32,
		bottom:exports.float32
	}, 'rect')
	
	exports.rect.identity = function(o){
		if(!o) o = exports.mat3()
		o[0] = 0;
		o[1] = 0;
		o[2] = 0;
		o[3] = 0;
	}
	
	exports.rect.intersects = function(a,b){
		return (a[0]<= b[2] && b[0] <= a[2] && a[1] <= b[3] && b[1] <= a[3]);
	}
	
	var ease = exports.ease = {}

	exports.ease.linear = function(t){ return t }
	exports.ease.inquad = function(t){ return t*t }
	exports.ease.outquad = function(t){ return -t*(t-2.) }
	exports.ease.inoutquad = function(t){ return (t/=0.5) < 1. ? 0.5*t*t : -0.5 * ((--t)*(t-2.) - 1.) }
	exports.ease.incubic = function(t){ return t*t*t }
	exports.ease.outcubic = function(t){ return ((t=t-1)*t*t + 1) }
	exports.ease.inoutcubic = function(t){ return (t/=0.5) < 1. ? 0.5*t*t*t : 1. /2.*((t-=2.)*t*t + 2.) }
	exports.ease.inquart = function(t){ return t*t*t*t }
	exports.ease.outquart = function(t){ return -((t=t-1.)*t*t*t - 1.) }
	exports.ease.inoutquart = function(t){ return (t/=0.5) < 1. ? 0.5*t*t*t*t : -0.5 * ((t-=2.)*t*t*t - 2.) }
	exports.ease.inquint = function(t){ return t*t*t*t*t }
	exports.ease.outquint = function(t){ return ((t=t-1.)*t*t*t*t + 1.) }
	exports.ease.inoutquint = function(t){ return (t/=0.5) < 1. ? 0.5*t*t*t*t*t : 0.5*((t-=2.)*t*t*t*t + 2.) }	
	exports.ease.insine = function(t){ return -cos(t * (PI/2.)) + 1. }
	exports.ease.outsine = function(t){ return sin(t * (PI/2.)) }
	exports.ease.inoutsine = function(t){ return -0.5 * (cos(PI*t) - 1.) }
	exports.ease.inexpo = function(t){ return (t==0.)? 0.: pow(2., 10. * (t - 1.)) }
	exports.ease.outexpo = function(t){ return (t==1.)? 1.: (-pow(2., -10. * t) + 1.) }
	exports.ease.incirc = function(t){ return - (sqrt(1. - t*t) - 1.) }
	exports.ease.outcirc = function(t){ return sqrt(1. - (t=t-1.)*t) }
	exports.ease.inoutcirc = function(t){ return (t/=0.5) < 1.? -0.5 * (sqrt(1. - t*t) - 1.): 0.5 * (sqrt(1. - (t-=2.)*t) + 1.) }
	exports.ease.inoutexpo = function(t){
		if (t==0.) return 0.
		if (t==1.) return 1.
		if ((t/=0.5) < 1.) return 0.5 * pow(2., 10. * (t - 1.)) 
		return 0.5 * (-pow(2., -10. * --t) + 2.) 
	}

	exports.ease.inelastic = function(t){
		var s=1.70158, p=0., a=1.;
		if (t==0.) return 0.
		if (t==1.) return 1.
		if (!p) p=0.3
		if (a < 1.) { a=1.; var s=p/4. }
		else var s = p/(2.*PI) * asin(1./a)
		return -(a*pow(2.,10.*(t-=1.)) * sin( (t*1.-s)*(2.*PI)/p )) 
	}

	exports.ease.outelastic = function(t){
		var s=1.70158, p=0., a=1.
		if (t==0.) return 0.
		if (t==1.) return 1.
		if (!p) p=1.*0.3
		if (a < 1.) { a=1.; var s=p/4.; }
		else var s = p/(2.*PI) * asin (1./a)
		return a*pow(2.,-10.*t) * sin( (t*1.-s)*(2.*PI)/p ) + 1. 
	}

	exports.ease.inoutelastic = function(t){
		var s=1.70158, p=0., a=1.
		if (t==0.) return 0.
		if ((t/=0.5)==2.) return 1.
		if (!p) p=(0.3*1.5)
		if (a < 1.) { a=1.; var s=p/4.; }
		else var s = p/(2.*PI) * asin (1./a)
		if (t < 1.) return -.5*(a*pow(2.,10.*(t-=1.)) * sin( (t*1.-s)*(2.*PI)/p )) 
		return a*pow(2.,-10.*(t-=1.)) * sin( (t*1.-s)*(2.*PI)/p )*0.5 + 1.
	}

	exports.ease.inback = function(t){ var s = 1.70158; return (t/=1.)*t*((s+1.)*t - s) }
	exports.ease.outback = function(t){ var s = 1.70158; return ((t=t/1-1)*t*((s+1)*t + s) + 1) }
	exports.ease.inoutback = function(t){
		var s = 1.70158
		if ((t/=0.5) < 1.) return 0.5*(t*t*(((s*=(1.525))+1.)*t - s)) 
		return 0.5*((t-=2.)*t*(((s*=(1.525))+1.)*t + s) + 2.) 
	}

	exports.ease.inbounce = function(t){
		return 1. - exports.ease.outbounce(1.-t) 
	}

	exports.ease.outbounce = function(t){
		if (t < (1./2.75)) return (7.5625*t*t) 
		else if (t < (2./2.75)) return (7.5625*(t-=(1.5/2.75))*t + 0.75) 
		else if (t < (2.5/2.75)) return (7.5625*(t-=(2.25/2.75))*t + 0.9375) 
		return (7.5625*(t-=(2.625/2.75))*t + .984375) 
	}

	exports.ease.inoutbounce = function(t){
		if (t < 0.5) return ease.inbounce (t*2.) * 0.5 
		return ease.outbounce (t*2.-1.) * 0.5 + 0.5 
	}

	exports.ease.quad = function(t){ return ease.outquad(t)}
	exports.ease.cubic = function(t){ return ease.inoutcubic(t) }
	exports.ease.quart = function(t){ return ease.outquart(t) }
	exports.ease.quint = function(t){ return ease.outquint(t) }
	exports.ease.sine = function(t){ return ease.outsine(t) }
	exports.ease.expo = function(t){ return ease.outexpo(t) }
	exports.ease.elastic = function(t){return ease.outelastic(t) }
	exports.ease.circ = function(t){ return ease.outcirc(t) }
	exports.ease.back = function(t){ return ease.inoutback(t) }
	exports.ease.bounce = function(t){ return ease.outbounce(t) }

	exports.ease.bezier = function(control){
		var b = {}
		b.epsilon = 1.0/(200.0*time)
		b.points = control
		if(control.length != 4) control = [0,0,1,1]
		b.cx = 3.0*control[0]
		b.bx = 3.0 * (control[2] - control[0]) -b.cx
		b.ax = 1.0 - b.cx - b.bx
		b.cy = 3.0 * control[1]
		b.by = 3.0 * (control[3] - control[1]) - b.cy
		b.ay = 1.0 - b.cy - b.by

		function bezierCurveX(t) {
			return ((b.ax * t + b.bx) * t + b.cx) * t
		}

		function bezierCurveY(t) {
			return ((b.ay * t + b.by) * t + b.cy) * t
		}

		function bezierCurveDX(t) {
			return (3.0 * b.ax * t + 2.0 * b.bx) * t + b.cx
		}

		function bezierSolveX(x) {
			var t0, t1, t2, x2, d2, i
			// First try a few iterations of Newton's method -- normally very fast.
			for(t2 = x, i=0; i<8; i++) {
				x2 = bezierCurveX(t2) - x
				if(Math.abs(x2) < b.epsilon) return t2
				d2 = bezierCurveDX(t2)
				if(Math.abs(d2) < 1e-6) break 
				t2 = t2 - x2 / d2
			}
			// Fall back to the bisection method for reliability.
			t0 = 0.0
			t1 = 1.0 
			t2 = x
			if(t2 < t0) return t0
			if(t2 > t1) return t1
			while(t0 < t1) {
				x2 = bezierCurveX(t2)
				if(Math.abs(x2 - x) < b.epsilon) return t2
				if(x > x2) t0 = t2
				else t1 = t2
				t2 = (t1 - t0) *.5 + t0
			}
			return t2 // Failure.
		}

		return function(t){
			bezierCurveY(bezierSolveX(t))
		}
	}

	exports.ease.bret = function(control){ // get the curve
		// pick a d that seems to make sense
		//return t
		var di = 0.01
		var df = 0.01
		// use the bezier array to pass in di and df
		if(control && control.points){
			if(control.points.length == 2){
				di = control.points[0]
				df = control.points[1]
			}
			else{
				di = df = control.points[0]
			}
		}

		var Xi = 0 // we go from 0 
		var Xf = 1 // to 1 , as we are an motion function
		var Xo = Xi - di // as per email
		var Xn = Xf + df // here too
		// compute the constant
		var K = ((Xo - Xf) * (Xi - Xn)) / ((Xo - Xi) * (Xf - Xn))
		
		return function(t){
			// seems to be 1.20001
			var Kt = Math.pow(K, t)
			// so when t starts at 0 and ends at 1 K(t) is just K^t
			return (Xo * (Xi - Xn) + Xn * (Xo - Xi) * Kt) / ((Xo - Xi) * Kt + (Xi - Xn))
		}
	}

	// make a more flexible lut
	for(var key in exports.ease){
		exports.ease[key.toLowerCase()] = exports.ease[key]
	}

	// store the types on define
	define.typeToString = function(type){
		if(type === String) return 'String'
		if(type === Object) return 'Object'
		return type.id
	}

	define.stringToType = function(str){
		if(str === 'String') return String
		if(str === 'Object') return Object
		return define.typemap.types[str]
	}

	define.typemap = {
		types:{
			int:exports.int,
			int32:exports.int32,
			uint32:exports.uint32,
			float:exports.float,
			float32:exports.float32,
			float64:exports.float64,
			vec2:exports.vec2,
			vec3:exports.vec3,
			vec4:exports.vec4,
			ivec2:exports.ivec2,
			ivec3:exports.ivec3,
			ivec4:exports.ivec4,
			bvec2:exports.bvec2,
			bvec3:exports.bvec3,
			bvec4:exports.bvec4,
			mat2:exports.mat2,
			mat3:exports.mat3,
			mat4:exports.mat4
		},
		swizzle:{
			bool:{2:exports.bvec2, 3:exports.bvec3, 4:exports.bvec4},
			int32:{2:exports.ivec2, 3:exports.ivec3, 4:exports.ivec4},
			float32:{2:exports.vec2, 3:exports.vec3, 4:exports.vec4},
		}
	}

	function defineComponent(proto, name, index){
		Object.defineProperty(proto, name, {get:function(){ return this[index] },set:function(v){ 
			this[index] = v 
			if(this.atChange) this.atChange(index)
		}})
	}

	function defineSwiz2(proto, name, i0, i1, vec){
		Object.defineProperty(proto, name, {get:function(){ return vec(this[i0], this[i1]) },set:function(v){ 
			this[i0] = v[0], this[i1] = v[1] 
			if(this.atChange) this.atChange(-1)
		}})
	}

	function defineSwiz3(proto, name, i0, i1, i2, vec){
		Object.defineProperty(proto, name, {get:function(){ return vec(this[i0], this[i1], this[i2]) },set:function(v){ 
			this[i0] = v[0], this[i1] = v[1], this[i2] = v[2] 
			if(this.atChange) this.atChange(-1)
		}})
	}

	function defineSwiz4(proto, name, i0, i1, i2, i3, vec){
		Object.defineProperty(proto, name, {get:function(){ return vec(this[i0], this[i1], this[i2], this[i3]) },set:function(v){ 
			this[i0] = v[0], this[i1] = v[1], this[i2] = v[2], this[i3] = v[3] 
			if(this.atChange) this.atChange(-1)
		}})
	}

	function defineArrayProp(proto, propset, vectypes){
		for(var prop in propset){
			defineComponent(proto, prop, propset[prop])
		}
		// create swizzles
		for(var key1 in propset) for(var key2 in propset){
			defineSwiz2(proto, key1+key2, propset[key1], propset[key2], vectypes[0])
		}
		for(var key1 in propset) for(var key2 in propset) for(var key3 in propset){
			defineSwiz3(proto, key1+key2+key3, propset[key1], propset[key2], propset[key3], vectypes[1])
		}
		for(var key1 in propset) for(var key2 in propset) for(var key3 in propset) for(var key4 in propset){
			defineSwiz4(proto, key1+key2+key3+key4, propset[key1], propset[key2], propset[key3], propset[key4], vectypes[2])
		}
	}

	defineArrayProp(Float32Array.prototype, {x:0, y:1, z:2, w:3}, [exports.vec2, exports.vec3, exports.vec4])
	//defineArrayProp(Float32Array.prototype, {r:0, g:1, b:2, a:3}, [exports.vec2, exports.vec3, exports.vec4])
	defineArrayProp(Int32Array.prototype, {x:0, y:1, z:2, w:3}, [exports.ivec2, exports.ivec3, exports.ivec4])
	//defineArrayProp(Int32Array.prototype, {r:0, g:1, b:2, a:3}, [exports.ivec2, exports.ivec3, exports.ivec4])

	exports.Enum = function Enum(){
		var types = Array.prototype.slice.call(arguments)
		for(var i = 0; i < types.length; i++) types[i] = types[i].toUpperCase()
		return function Enum(value){
			if(typeof value !== 'string')
				throw new Error('Enum not string' + value, types.join('|'))
			value = value.toUpperCase()
			if(types.indexOf(value) === -1)
				throw new Error('Invalid enum value' + value + "" + types.join('|'))

			return value
		}
	}

	// events are passthrough types
	exports.Event = function Event(arg){
		return arg
	}
})