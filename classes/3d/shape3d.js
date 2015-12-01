/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, $containers$, view){


	define.class(this, 'bg', this.Shader, function(){
		
		this.depth_test = 'src_depth < dst_depth';
		
		this.vertexstruct = define.struct({
			pos: vec3,
			norm: vec3,
			uv: vec2			
		})
	
		this.diffusecolor = vec4("#ffffff");
		this.mesh = this.vertexstruct.array();
		
		this.position = function() {						
			
			var temp = (vec4(mesh.norm,1.0) * view.normalmatrix  );						
			transnorm = temp.xyz;			
			pos = vec4(mesh.pos, 1) * view.modelmatrix * view.viewmatrix;
			//campos = vec4(cameraposition, 1.0) * lookatmatrix;
			return pos ; // * matrix *viewmatrix
		}
				
		this.color = function() {
			//return vec4("yellow") ;			
			var tn = normalize(transnorm.xyz);
			return vec4(tn*0.5+0.5,1.0);		
		}
	})		
})