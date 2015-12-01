/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define(function(require, exports){
	this.RAD = '1'
	this.DEG = '0.017453292519943295'
	this.PI = '3.141592653589793'
	this.PI2 = '6.283185307179586'
	this.E = '2.718281828459045'
	this.LN2 = '0.6931471805599453'
	this.LN10 = '2.302585092994046'
	this.LOG2E = '1.4426950408889634'
	this.LOG10E = '0.4342944819032518'
	this.SQRT_1_2 = '0.70710678118654757'
	this.SQRT2 = '1.4142135623730951'

	exports.rotate2d = function(v, angle){
		var cosa = cos(angle)
		var sina = sin(angle)
		return vec2(v.x * cosa - v.y * sina, v.x * sina + v.y * cosa)
	}

	exports.bezier2d = function(p0, p1, p2, p3, t){
		var t2 = t*t;
		var t3 = t2*t;
		var it = (1-t);
		var it2 = it*it;
		var it3 = it2*it;
	//	return p0 + t*vec2(1,0);
		var pos = p0 * it3  + p1*3*t*it2 + p2 * 3*it*t2 +  p3* t3;
		var deriv = -3.0 * p0 * it2 + 3 * p1 * (it2-2*t*it) + 3 * p2 *( -t2 + it * t * 2) + 3 * p3 * t2;
		deriv = normalize(deriv);
		return vec4(pos.x, pos.y, deriv.x, deriv.y);
    }
})