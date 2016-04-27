/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/


define.class("$server/composition", function($ui$, screen, view) {
	this.render = function() {
		return [
			screen(
				view({
					flex:1,
					myvalue: Config({motion:'linear',duration:0.5,value:0}),

					pointerstart:function(){
						this.myvalue = 1
					},
					pointerend:function(){
						this.myvalue = 0
					},
					hardrect:{
						dump:1,
						color:function(){
							//return 'red'
							//return mix('blue','purple',view.myvalue)
							return pal.pal1(noise.noise3d(vec3(mesh.x, mesh.y, view.time)))
						}
					},
					bgcolor:'blue',
				})
			)
		]
	}
})
