/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define(function(require, exports){
	exports.noise = require('./noiselib')
	exports.pal = require('./palettelib')
	exports.math = require('./mathlib')

	exports.kali2d = function(pos, steps, space){

		var v = pos
		for(var i = 0; i < 130; i ++){
			if(i > int(steps)) break
			v = abs(v)

			v = v / (v.x * v.x + v.y * v.y) + space
		}			
		return v
	}

	exports.fractzoom = function(pos, time, zoom){
		var dt = sin((80/60)*time*math.PI)
		var mypos = pos.xy*.01*sin(0.04*time+0.05*dt)
		var dx = 0.01*sin(0.01*time)
		var dy = -0.01*sin(0.01*time)
		mypos = math.rotate2d(mypos,0.1*time)
		var kali1 =  kali2d(mypos+vec2(0.0001*time), 30, vec2(-0.8280193310201044,-0.858019331020104-dx))
		//var kali2 =  kali2d(mypos+vec2(0.0001*time), 40, vec2(-0.8280193310201044,-0.858019331020104-dy))
		//var c1 =vec4(d.y, 0. ,sin(0.1*time)*6*kali2.y, 1.)
		var c1 = pal.pal2(kali1.y+dt)
		//var c2 = pal.pal2(kali2.y+dt)
		//return mix(c1,c2,sin(length(pos-.5)+time))
		var mp = highdefblirpy(pos.xy*0.05*sin(0.1*time), time,1.)
		return  mix(pal.pal4(mp.r+0.1*time),c1,c1.b)		
	}

	exports.highdefblirpy = function(pos, time, zoom){
		var xs = 20. * zoom
		var ys = 22. * zoom
		var x = pos.x*xs+0.1*time
		var y = pos.y*ys
		var ns = noise.snoise3(x, y, 0.1*time)
		return	pal.pal0(ns) + 0.5*(vec4(1.)*sin(-8*time + (length(pos-.5)-.01*ns+ .0001*noise.snoise3(x*10, y*10, 0.1*time))*2400))
	}
})