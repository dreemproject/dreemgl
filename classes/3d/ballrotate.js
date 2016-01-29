/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $ui$button){
	//internal, this widget controls

	this.attributes = {
		// the target view to control with this
		target: Config({type:string, value:""})
	}
	this.icon = "arrows"
	this.justifycontent = "center"
	this.alignitems = "center"
	this.fontsize = 20;

	this.pointermove = function(event){
		var movement = event.value[0].movement

		var t = this.find(this.target)

		this.camera_start = vec3.sub(t._camera, t._lookat)
		var M4 = mat4.invert(t.viewmatrix)
		var screenup = vec3.normalize(vec3.vec3_mul_mat4(vec3(0,1,0), M4));

		var M1 = mat4.identity()
		var M2 = mat4.rotate(M1, movement[0] * 0.01, t._up)

		var axis = vec3.normalize(vec3.cross(this.camera_start, t._up))
		var M3 = mat4.rotate(M2, movement[1] * 0.01, axis)

		var Rot = vec3.vec3_mul_mat4(this.camera_start, M3)
		var Res = vec3.add(Rot, t._lookat)

		t._camera = Res
		t.redraw()
	}

	var rotator = this.constructor
	// Basic usage of the button.
	this.constructor.examples = {
		Usage:function(){
			return [
				rotator({target:"someview", width:100, height:100})

			]
		}
	}

})
