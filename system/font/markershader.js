/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Parts copyright 2012 Google, Inc. All Rights Reserved. (APACHE 2.0 license)
define.class('$system/draw/$platform/shader$platform', function(require, exports, self){
	this.matrix = mat4()
	this.viewmatrix = mat4()
	this.border_radius = 2.5
	this.gloop = 8

	this.position = function(){
		return mesh.pos * matrix * viewmatrix
	}

	this.color = function(){
		var pos = mesh.pos
		var rect = mesh.rect
		var rel = pos - rect.xy
		// do pixel antialias calc
		var edge = min(length(vec2(length(dFdx(rel)), length(dFdy(rel)))) * SQRT_1_2,1.)

		var other = mesh.other
		var px1 = other.x
		var px2 = other.y
		var nx1 = other.z
		var nx2 = other.w
		// main shape
		
		var field = shape.roundbox(rel, 0,0, rect.z, rect.w, border_radius)
		if(px1 != px2){
			var field2 = shape.roundbox(rel, px1 - rect.x, -rect.w, px2 - px1, rect.w, border_radius)
			field = shape.smoothpoly(field, field2, gloop)
		}
		if(nx1 != nx2){
			var field2 = shape.roundbox(rel, nx1 - rect.x, rect.w, nx2 - nx1, rect.w, border_radius)
			field = shape.smoothpoly(field, field2, gloop)
		}
		
		//dump = field
		//field = marker_style(field, pos)
		var alpha = smoothstep(edge, -edge, field)

		if(alpha < 0.001) discard;

		return vec4(fgcolor.rgb, alpha)
	}

	this.markergeom = define.struct({
		pos:vec2,
		rect:vec4,
		other:vec4,
		data:float,
		corner:float
	}).extend(function(struct){
		// static helper function to pull out marker set from text
		struct.getMarkersFromText = function(textbuf, start, end, deltay){
			var array = []
			if(deltay === undefined) deltay = 0
			if(end < start){
				var t = start
				start = end
				end = t
			}
			// lets access the textbuf geometry
			var length = textbuf.lengthQuad()
			if(end > length) end = length

			for(var o = start, last = o; o < end; o++){
				ch = textbuf.charCodeAt(o)
				if(o == end - 1 || ch == 10){
					var r = textbuf.cursorRect(last)
					var x = (o + 1) == length || ch == 10? textbuf.char_tr_x(o): textbuf.char_tl_x(o+1)
					r.start = last
					r.end = o
					r.w = x - r.x
					r.x2 = r.x + r.w
					r.y2 = r.y + r.h
					r.y += deltay
					r.y2 += deltay
					// check if the previous item is on the same r.y
					// ifso fuse it with this marker
					var prev = array[array.length -1]
					if(prev && abs(prev.y-r.y) < 1e-4){ // fuse marker
						prev.x2 = r.x2
						prev.w += r.w
					}
					else{
						array.push(r)
					}
					last = o+1
				}
			}
			return array
		}

		this.addMarker = function(prev, self, next, font_size, data){
			var px1 = 0,px2 = 0,nx1 = 0,nx2 = 0
			if(prev) px1 = prev.x, px2 = prev.x2
			if(next) nx1 = next.x, nx2 = next.x2
			this.pushQuad(
				self.x - font_size * 3, self.y,  self.x, self.y, self.w, self.h,  px1, px2, nx1, nx2, data, 0,
				self.x2 + font_size * 3, self.y,  self.x, self.y, self.w, self.h,  px1, px2, nx1, nx2, data, 1,
				self.x - font_size * 3, self.y2,  self.x, self.y, self.w, self.h,  px1, px2, nx1, nx2, data, 2,
				self.x2 + font_size * 3, self.y2,  self.x, self.y, self.w, self.h,  px1, px2, nx1, nx2, data, 3
			)
		}
	})
	
	this.mesh = this.markergeom.array()
	this.fgcolor = vec4("ocea");
})