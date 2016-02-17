/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function(require, $ui$, screen, view){
	this.render = function(){ return [
		screen({name:'default', clearcolor:vec4('black')},
			view({flex:1, bgcolor:'gray', borderradius:20, flexdirection:'column', padding:30},
				view({
					flex:1,
					myvalue:Config({value:0., motion:'linear', duration:0.5}),
					pointerstart:function(){ this.myvalue = 1 },
					pointerend:function(){ this.myvalue = 0 },
					koe:require('$resources/textures/checker.png'),
					schaap:require('$resources/textures/envmap1.png'),
					bgcolorfn:function(mesh){
						//return vec4(0,1,0,1)
						// gradient
						return mix(koe.sample(math.rotate2d(mesh.xy-.5,time)+.5), schaap.sample(mesh.xy), mod(time+ myvalue*atan(mesh.x-.5, mesh.y-.5),1.))
						//koe.sample(mesh.xy) * schaap.sample(mesh.xy)

						// plasma
						//return pal.pal1(noise.noise3d(vec3(mesh.x*10,mesh.y*10,view.time)))

						// something crazy
						//return demo.highdefblirpy(mesh.xy*0.1, time, 1.)

						// fractal
						//
						//return pal.pal1(demo.kali2d(mesh.xy, 10, vec2(-0.65,-0.5+0.1*sin(view.time))).x)

						// circles
						// we have a rectangle
/*
						var t = view.time
						var field = float(0)
						var p = mesh.xy * vec2(view.layout.width, view.layout.height) + vec2(-300,-300)

						var scale = 100
						field = shape.circle(p, 0, 0, 50)
						field = shape.smoothpoly(shape.circle(p, scale*sin(t), scale*cos(t), 50), field, 70.)
						field = shape.smoothpoly(shape.circle(p, scale*sin(2*t), scale*cos(4*t), 50), field, 70.)
						field = shape.smoothpoly(shape.circle(p, scale*sin(3*t), scale*cos(5*t), 50), field, 70.)

						var edge = 1.
						//return pal.pal1(field*0.002)
						var fg = vec4(view.mycolor.rgb, smoothstep(edge, -edge, field))
						var bg = vec4(0.,0.,0.,0.05)

						return mix(bg.rgba, fg.rgba, fg.a)
*/
					}
				})
			)
		)
	]}
})
