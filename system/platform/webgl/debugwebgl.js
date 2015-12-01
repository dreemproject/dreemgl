/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Parts copyright 2012 Google, Inc. All Rights Reserved. (APACHE 2.0 license)
define.class('./shaderwebgl', function(require, exports){
	this.matrix = mat4()

	this.position = function(){
		return mesh.pos * matrix
	}
	
	this.color = function(){
		if(mesh.debug == 0.) return 'red'
		if(mesh.debug == 1.) return 'green'
		if(mesh.debug == 2.) return 'blue'
		return 'white'
	}

	this.debuggeom = define.struct({
		pos:vec2,
		debug:float
	}).extend(function(){

		this.add = function(x, y, w, h, dbg){
			this.pushQuad(
				x, y, dbg, 
				x + w, y, dbg,
				x, y + h, dbg,
				x + w, y + h, dbg
			)
		}
	})

	this.mesh = this.debuggeom.array()
})