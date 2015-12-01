//Pure JS based composition
define.class(function($server$, composition, screens, $containers$, screen, view){
	this.render = function(){ return [
		screens(
			screen({clearcolor:vec4('black')},
				view({flex:1, bgcolor:'gray', borderradius:20, flexdirection:'column', padding:30},
					/*label({text:'Live shader coding', 
						font:{
							moddist:function(pos, dist){
								//view.fgcolor = 
								//	 pal.pal1()

								return dist + 2.*demo.kali2d(pos.xy, 10, vec2(-0.65,-0.5+0.1*sin(view.time))).x
								//mix('red','green',pos.x)
							}
						},
						fontsize: 138, marginbottom:20, fgcolor:'black'
					}),*/
					view({
						attributes:{
							mycolor:{value:vec4('orange'), motion:'linear', duration:1}
						},
						mouseleftdown:function(){
							this.mycolor = 'blue'
						},
						mouseleftup:function(){
							this.mycolor = 'red'
						},
						flex:1,
						bg:{
							color:function(){

								//return vec4(0,1,0,1)
								// gradient
								//return mix('red','blue', mesh.y)

								// plasma
								//return pal.pal1(noise.noise3d(vec3(mesh.x*10,mesh.y*10,view.time)))

								// something crazy
								//return demo.highdefblirpy(mesh.xy*0.1, view.time, 1.)

								// fractal
								//
								//return pal.pal1(demo.kali2d(mesh.xy, 10, vec2(-0.65,-0.5+0.1*sin(view.time))).x)

								// circles
								// we have a rectangle
								
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
								

							}
						}
					})
				)
			)
		)
	]}
})