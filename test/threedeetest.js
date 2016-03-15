/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

//Pure JS based composition
define.class('$server/composition', function($ui$, screen, view, splitcontainer, label, button, $3d$, cube, spherecone, plane){

	var pointerdebug = define.class(function pointerdebug($ui$view){

		this.attributes = {
			buttoncolor1: {type: vec4, value: vec4("#9090b0")},
			buttoncolor2: {type: vec4, value: vec4("#8080c0")}
		}

		this.hardrect  = {
			pointerpos: vec2(0),
			gridcolor: vec4("#ffffff"),
			grid:function(a){
				if (floor(mod(a.x ,50. )) == 0. ||floor(mod(a.y ,50. )) == 0.)	{
					return mix(gridcolor, vec4(0.9,0.9,1.0,1.0), 0.5)
				}
				if (floor(mod(a.x ,10. )) == 0. ||floor(mod(a.y ,10. )) == 0.)	{
					return mix(gridcolor, vec4(0.9,0.9,1.0,1.0), 0.2)
				}
				return gridcolor
			},
			bordercolor: vec4("#c0c0c0"),
			borderwidth: 1,
			cornerradius: 14,
			color: function(){
				var dx = abs(pos.x - pointerpos.x)
				var dy = abs(pos.y - pointerpos.y)
				var mindist = min(dx, dy)
				var a = pos.xy
				return mix(grid(a), mix(vec4(1,1,0.8,1),vec4(0,0,0,1),clamp((1.-mindist)*1.0, 0.,1. )),clamp((1.-mindist/5.0)*1.0, 0.,1. )/2.)
			}
		}

		this.render = function(){
			return [view({bgcolor: "red", fgcolor: "darkgray", text:"this is a small text that will contain the cursor after move", position:"absolute" ,width: 10})]
		}

		// TODO(aki): fix in 3D view
		this.pointermove = function(event){
			var a = this.globalToLocal(event.position)

			this.shaders.hardrect.pointerpos = vec2(a[0],a[1])
			this.redraw()
			if (this.children.length > 0){
				this.children[0].text = Math.round(a[0]) + ", " + Math.round(a[1]);
				this.children[0].pos = vec2(a[0],a[1])
			}
		}
	})


	this.render = function(){ return [
		screen({clearcolor:'#484230', flexdirection:'row'},
			splitcontainer({ vertical: false, flexdirection: "row", bgcolor: "black", flex:1},
				view({
					flex:1,
					flexdirection:"column",
					alignitems:'stretch',
					bgcolor:'red',
					hardrect:{
						color:function(){
							return vec4(0.4, 0.4, 0.4+ mesh.y*0.8,1.0)
						}
					}},
					button({
						label:"Near",
						click:function(){
							var cam = this.find("theview");
							cam.camera = vec3(1,2,3);
							cam.fov = 30;
						}
					}),
					button({
						label:"Far",
						click:function(){
							var cam = this.find("theview");
							cam.camera = vec3(4,0.2,4);
							cam.fov = 90;
						}
					}),
					pointerdebug({width:100, height:100})
				),
				view({
					init:function(){
					},
					flex:4,
					name:'theview',
					bgcolor:'transparent',
					clearcolor: 'rgba(255,255,255,0)',
					viewport: '3d',
					camera: vec3(2,2,2),
					blend:{
						color:function(){
							var t = texture.sample(mesh.xy)
							return mix(t,  vec4(0.6, 0.6, 0.2+ (1-mesh.y)*0.8,1.0), 1-t.a);
						}
					},
					fov: 90,
					camera:Config({motion:'linear', duration:1, persist:true}),
					fov:Config({motion:'easein', duration:1, persist:true})
					}

					,spherecone({
						prop:0,
						pointerstart:function(){
							this.prop = Animate({1:{value:10, motion:'inquad'}})
						},
						shape3d:{
							color:function(){
								var ambient = mix('gray','red',view.prop)
								var diffuse = 'white'
								var specular = 'white'
								var tn = normalize(transnorm.xyz);
								var mypos =  vec4(0,0,1,1.) * view.normalmatrix

								var ref = dot(tn, mypos.xyz)
								return vec4(ambient.xyz*0.3 + diffuse.xyz * ref*0.4 + specular.xyz * pow(ref, 18.0)*0.01,1.)
								return 'red'
							}
						},
						pos:vec3(0,-0.25,0), 
						radius:0.5
					})

				)
			)
		)
	]}

})
