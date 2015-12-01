/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Parts copyright 2012 Google, Inc. All Rights Reserved. (APACHE 2.0 license)

define.class('$system/draw/$platform/shader$platform', function(require, exports, self){
	this.matrix = mat4()
	this.viewmatrix = mat4()
	this.position = function(){
		return mesh.pos * matrix * viewmatrix
	}
	
	this.color = function(){
		var rel = mesh.edge//cursor_pos
		var dpdx = dFdx(rel)
		var dpdy = dFdy(rel)
		var edge = min(length(vec2(length(dpdx), length(dpdy))) * SQRT_1_2, 1.)
		if(edge > 0.04){
			if(rel.x < dpdx.x) return vec4(fgcolor.rgb,1.)
			return vec4(0.)
		}
		return vec4(fgcolor.rgb, smoothstep(edge, -edge, shape.box(rel, 0,0,0.05,1.)))
	}

	this.cursorgeom = define.struct({
		pos:vec2,
		edge:vec2
	}).extend(function(){

		this.addCursor = function(textbuf, start){
			var pos = textbuf.cursorRect(start)
			//pos.y = 0//this.textbuf.font_size - this.textbuf.font_size * this.textbuf.cursor_sink
			pos.w = textbuf.font_size //+ 10;		
			//console.log("Rik - please find out why cursorwidth is near invisible at small fontsizes ;-) ");
			//this.cursor.mesh.length = 0
			this.pushQuad(
				pos.x, pos.y, 0, 0, 
				pos.x + pos.w, pos.y, 1, 0,
				pos.x, pos.y + pos.h, 0, 1,
				pos.x + pos.w, pos.y + pos.h, 1, 1
			)

		}
	}) 

	this.mesh = this.cursorgeom.array()
	this.fgcolor = vec4("white");
})