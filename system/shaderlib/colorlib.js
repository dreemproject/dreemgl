/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define(function(require, exports){
	
	exports.hue2rgb = function hue2rgb(p, q, t){
		if(t < 0.) {
			t += 1.;
		}
		else {
			if(t > 1.) t -= 1.;
		}
		
		if(t < 1./6.) return p + (q - p) * 6. * t;
		if(t < 1./2.) return q;
		if(t < 2./3.) return p + (q - p) * (2./3. - t) * 6.;
		return p;
	}
			
	exports.hsla = function( hlsa){

		var h = hlsa.x;
		var s = hlsa.y;
		var l = hlsa.z;
		
		var r = 0.0;
		var g = 0.0;	
		var b = 0.0;

		if(s == 0.0){
			r = g = b = l; // achromatic
		}else{
			

			var q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
			var p = 2.0 * l - q;
			r = this.hue2rgb(p, q, h + 1./3.);
			g = this.hue2rgb(p, q, h);
			b = this.hue2rgb(p, q, h - 1./3.);
		}

		return  vec4(r,g,b,hlsa.w);
		
		
	}
	
	exports.hsva = function( hsva){

		
		var h = hsva.x * 360;
		var s = hsva.y ;
		var v = hsva.z ;
		var r = 0.0;
		var g = 0.0;	
		var b = 0.0;
		if (h<0.) h+=360.;
		if(s == 0.0){
			r = g = b = v; // achromatic
		}else{
			var t1 = v;
			var t2 = (1. - s) * v;
			var t3 = (t1 - t2) * (mod(h ,60.) ) / 60.;
			if (h == 360.) h = 0.;
			if (h < 60.) { r = t1; b = t2; g = t2 + t3 }
			else if (h < 120.) { g = t1; b = t2; r = t1 - t3 }
			else if (h < 180.) { g = t1; r = t2; b = t2 + t3 }
			else if (h < 240.) { b = t1; r = t2; g = t1 - t3 }
			else if (h < 300.) { b = t1; g = t2; r = t2 + t3 }
			else if (h < 360.) { r = t1; g = t2; b = t1 - t3 }
			else { r = 0.; g = 0.; b = 0. }
		}
		
		return  vec4(r,g,b,hsva.w);
		
		
	}
})