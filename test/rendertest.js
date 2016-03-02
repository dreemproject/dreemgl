/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

//Pure JS based composition

define.class('$server/composition', function($ui$, screen, view, splitcontainer, label, button, $3d$, cube){

	var pointerdebug = define.class(function pointerdebug($ui$view){

		this.attributes = {
			buttoncolor1: Config({type: vec4, value: vec4("#9090b0")}),
			buttoncolor2: Config({type: vec4, value: vec4("#8080c0")})
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
				return mix(grid(a), mix(vec4(1,1,0.8,1), vec4(0,0,0,1), clamp((1. - mindist) * 1.0, 0.,1. )),clamp((1.-mindist/5.0)*1.0, 0.,1. )/2.)
			}
		}

		this.render = function(){
			return [view({bgcolor: "red", fgcolor: "darkgray", text:"this is a small text that will contain the cursor after move", position:"absolute" ,width: 10})]
		}

		this.pointerhover = function(event){
			var a = this.globalToLocal(event.position)
			this.shaders.hardrect.pointerpos = vec2(a[0], a[1])
			this.redraw()
			if (this.children.length > 0){
				this.children[0].text = Math.round(a[0]) + ", " + Math.round(a[1]);
				this.children[0].pos = vec2(a[0],a[1])
			}
		}
	})

	this.render = function(){ return [
		screen({clearcolor:vec4('red')}
			,view({
				name:'viewbg',
				flexdirection:'column',
				margin:40,
				flex:1,
				borderradius:30,
				bgcolor:'#CBD6D9'
				}
				,button({text:'test', flex:1, click:function(){
					this.parent.appendChild(function(){
						return button({text:'hii',flex:1})
					})
				}})
				,view({clearcolor:"lightblue", mode:'3D', flex:1, margin:2, bgcolor:'lightblue', name:'3dview', borderwidth:0, bordercolor:"black", borderradius:1, camera:vec3(2.1,2,2)}
					,cube({dimension:vec3(1)})
					,cube({dimension:vec3(1), translate:vec3(1.5,0,-1.5)})
					,cube({dimension:vec3(1), translate:vec3(-1.5,0,1.5)})
				)
				,pointerdebug({flex:1,mode:'2D',margin:20})
				,view({
					flex:1,
					borderradius:0,
					name:'view2',
					margin:20,
					mode:'2D',
					blend:{
						acolor:function(){
							return texture.sample(mesh.xy+0.1*sin(8*mesh.x))
							//return 'red'
						}
					},
					bgcolor:'#A39565', bordercolor:"#484230", borderwidth: 20,
					}
					,pointerdebug({flex:1,height:100, width:100, margin:20})
				)
			)
		)
	]}



})
