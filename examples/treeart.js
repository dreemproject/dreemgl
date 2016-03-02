/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition",function(require, $ui$, screen, view) {
	this.render = function() {
		return [screen(
			view({
				flex:1,
				init:function(){
					console.log('here')
				},
				bgcolor:'red',
				hardrect:{
					color:function(){
						return mix('brown',pal.pal1(mesh.depth/14+0.1*view.time),mesh.depth/12)*sin(mesh.pos.y*PI)*pow(abs(sin(mesh.pos.x*PI)),0.2)
					},
					mesh:define.struct({
						pos:vec2,
						path:float,
						depth:float
					}).array(),
					position:function(){

						// lets walk
						var path = mesh.path
						var pos = vec2(0,0)
						var scale = vec2(1,1)
						var dir = vec2(0,-1)
						var depth = int(mesh.depth)
						for(var i = 0; i < 14; i++){
							if(i >= depth) break
							var right = mod(path, 2.)
						    if(right>0.){
						    	dir = math.rotate2d(dir, 30.*math.DEG*sin(view.time))
						    }
						    else{
						    	dir = math.rotate2d(dir, -30.*math.DEG*sin(1.2*view.time+0.1*mesh.depth))
						    }
						    pos += (dir * scale)*1.9
						    scale = scale * vec2(0.8,0.8)
							path = floor(path / 2.)
						}
						// alright we found a pos and dir

						var p = (math.rotate2d(mesh.pos*scale, atan(dir.y,dir.x)) + pos)  * vec2(30,30) + vec2(200,300)

						return vec4(p, 0, 1) * view.totalmatrix * view.viewmatrix
					},
					update:function(){
						var mesh = this.mesh = this.mesh.struct.array()

						// first triangle
						function recur(path, depth){

							mesh.pushQuad(
								-1,-1, path, depth,
								1,-1, path, depth,
								-1,1, path, depth,
								1,1, path, depth
							)
							if(depth>13)return

							recur(path, depth+1)
							recur(path + Math.pow(2, depth), depth+1)
						}
						recur(0,0)

						10101101

					}
				}
			})
		)]
	}
})
