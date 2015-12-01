/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $containers$view){

	// The perspective3d object to rotate.
	this.attributes = {target:{type:string, value:""}}
	
	this.mouseleftdown = function(a){
		
		this.bgcolor = vec4("gray")
		var t = this.find(this.target);
		if (t) 
		{
			this.clickstart = a;
			
			this.mousemove = function(a){
				
				var t = this.find(this.target);
		
				var dx = a[0] - this.clickstart[0];
				var dy = a[1] - this.clickstart[1];
				
				this.camerastart = vec3.sub(t._camera, t._lookat );
				var M4 = mat4.invert(t.viewmatrix);
				
				// console.log(M4);
				var screenup = vec3.normalize(vec3.vec3_mul_mat4(vec3(0,1,0), M4));				
				// var M = mat4.R(0,-dy*0.01,-dx*0.01);					
				// console.log("screenup:", screenup);
				
				var M1 = mat4.identity();
				var M2 = mat4.rotate(M1, dx*0.01, t._up)
				
				var axis = vec3.normalize(vec3.cross(this.camerastart, t._up));
				var M3 = mat4.rotate(M2, dy*0.01, axis)
								
				var Rot = vec3.vec3_mul_mat4(this.camerastart, M3);
				var Res = vec3.add(Rot, t._lookat);
				
				t._camera = Res;
				t.redraw();
				//this.target.updateLookAtMatrix();
				//this.target.setDirty();
				
				this.clickstart = a;
				this.camerastart = vec3.sub(t._camera, t._lookat );
				
			
			}.bind(this);
		}
	}

	this.mouseleftup = function(){
		this.mousemove = function(){};
	}	
})