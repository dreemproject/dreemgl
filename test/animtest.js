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
					myvalue:0.,
					pointerstart:function(){
						console.log("Animate!")
						this.animate('myvalue',{1:1}).then(function(){
							console.log('Anim1 Complete')
							this.animate('myvalue',{1:{value:0,motion:'inoutexpo'}}).then(function(){
								console.log('Anim2 Complete')
							}.bind(this))
						}.bind(this))
					},
					pointerend:function(){
						this.stopAnimation('myvalue')
					},
					bgcolorfn:function(mesh){
						//return vec4(0,1,0,1)
						// gradient

						// plasma
						return pal.pal1(noise.noise3d(vec3(mesh.x*10*myvalue,mesh.y*10*myvalue,0.1*time)))
					}
				})
			)
		)
	]}
})
