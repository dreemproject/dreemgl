/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Parts copyright 2012 Google, Inc. All Rights Reserved. (APACHE 2.0 license)

define.class('$system/platform/$platform/shader$platform', function(require){
	this.view = {totalmatrix:mat4(), viewmatrix:mat4(), cursorcolor:vec4()}

	this.position = function(){
		return mesh.pos * view.totalmatrix  * view.viewmatrix
	}
	
	this.color = function(){
		return view.cursorcolor
		//var rel = mesh.edge//cursor_pos
		//var edge = 0.1
		//var dpdx = dFdx(rel)
		//var dpdy = dFdy(rel)
		//var edge = min(length(vec2(length(dpdx), length(dpdy))) * SQRT_1_2, 1.)
		//if(edge > 0.04){
		//	if(rel.x < dpdx.x) return vec4(fgcolor.rgb,1.)
		//	return vec4(0.)
		//}
		//return vec4(view.cursorcolor.rgb, smoothstep(edge, -edge, shape.box(rel, 0,0,0.15,1.)))
	}

	this.vertexstruct = define.struct({
		pos:vec2,
		edge:vec2
	}).extend(function(){

		this.addCursor = function(textbuf, start){
			var pos = textbuf.cursorRect(start)

			pos.w = textbuf.fontsize*0.1 

			this.pushQuad(
				pos.x, pos.y, 0, 0, 
				pos.x + pos.w, pos.y, 1, 0,
				pos.x, pos.y + pos.h, 0, 1,
				pos.x + pos.w, pos.y + pos.h, 1, 1
			)

		}
	}) 

	this.mesh = this.vertexstruct.array()
})