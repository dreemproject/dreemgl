/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, $ui$, view){

	define.class(this, 'shape3d', this.Shader, function(){
		this.draworder = 0
		
		this.depth_test = 'src_depth < dst_depth'
		
		this.vertexstruct = define.struct({
			pos: vec3,
			norm: vec3,
			uv: vec2
		})
	
		this.diffusecolor = vec4("#ffffff")
		this.mesh = this.vertexstruct.array()
		
		this.position = function() {				
			
			var temp = (vec4(mesh.norm,1.0) * view.normalmatrix)
			transnorm = temp.xyz
			pos = vec4(mesh.pos, 1) * view.totalmatrix * view.viewmatrix
			return pos // * matrix *viewmatrix
		}
				
		this.color = function() {
			//return vec4("yellow") ;			
			var tn = normalize(transnorm.xyz);
			return vec4(tn*0.5+0.5,1.0);		
		}
	})
	this.shape3d = true	
	this.hardrect =false;
})