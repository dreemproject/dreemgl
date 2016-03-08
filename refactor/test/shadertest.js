/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function(require, $ui$, screen, view){
	this.render = function(){ return [
		screen({name:'default', clearcolor:vec4('black')},
			view({flex:1, bgcolor:'gray', borderradius:20, flexdirection:'column', padding:30},
				view({
					flex:1,
					myvalue:Config({value:0., motion:'linear', duration:0.5}),
					pointerstart:function(){ this.myvalue = 1 },
					pointerend:function(){ this.myvalue = 0 },
					bgcolorfn:function(pos){
						return vec4(0,1,0,1)
						// gradient

						// plasma
						//return pal.pal1(noise.noise3d(vec3(pos.x*10,pos.y*10,time)))

						// something crazy
						//return demo.highdefblirpy(mesh.xy*0.1, time, 1.)

						// fractal
						//
						//return pal.pal1(demo.kali2d(mesh.xy, 10, vec2(-0.65,-0.5+0.1*sin(view.time))).x)

						// circles
						// we have a rectangle
						/*
						var t = time
						var field = float(0)
						var p = pos.xy * vec2(layout.width, layout.height) + vec2(-300,-300)

						var scale = 100
						field = shape.circle(p, 0, 0, 50)
						field = shape.smoothpoly(shape.circle(p, scale*sin(t), scale*cos(t), 50), field, 70.)
						field = shape.smoothpoly(shape.circle(p, scale*sin(2*t), scale*cos(4*t), 50), field, 70.)
						field = shape.smoothpoly(shape.circle(p, scale*sin(3*t), scale*cos(5*t), 50), field, 70.)

						var edge = 1.
						//return pal.pal1(field*0.002)
						var fg = vec4(mycolor.rgb, smoothstep(edge, -edge, field))
						var bg = vec4(0.,0.,0.,0.05)

						return mix(bg.rgba, fg.rgba, fg.a)
						*/
					}
				})
			)
		)
	]}
})
