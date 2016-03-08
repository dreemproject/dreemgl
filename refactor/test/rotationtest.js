/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function(require, $ui$, screen, view) {
	this.render = function() {
		return [
			screen({name:'default', clearcolor:'#ffffff '},
				view({
						//viewport:'2d',
						name:'view-0',
						position:'absolute',
						top:100,
						left:100,
						width:100,
						height:100,
						bgcolor:'#c0c0c0 ',
						rotate:vec3(0,0,45.0*DEG)
					},
					view({
						name:'view-0-0',
						position:'absolute',
						top:10,
						left:10,
						width:50,
						height:50,
						bgcolor:'#ff3d3d ',
						rotate:vec3(0,0,60.*DEG)
					},
					view({
						name:'view-0-0',
						position:'absolute',
						top:10,
						left:10,
						width:10,
						height:10,
						bgcolor:'orange '
					}))
				)
			)
		]
	}
})
