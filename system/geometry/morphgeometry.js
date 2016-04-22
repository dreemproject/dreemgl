/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/


define(function(require, exports){

	var VTX_COUNT = 512

	var vertexstruct = define.struct({
		pos: vec3,
		norm: vec3,
		uv: vec2
	})

	var morphvertexstruct = define.struct({
		pos: vec3,
		norm: vec3,
		uv: vec2,
		pos1: vec3,
		norm1: vec3,
		uv1: vec2
	})

	exports.createMorph = function(geom0, geom1){
		var geom = morphvertexstruct.array()
		if (geom0 && geom1) {
			if (geom0.length !== geom1.length) {
				throw new Error("Morph geometries mismatch buffer length.")
			} else {
				for (var i = geom0.length - 1; i >= 0; i--) {
					geom.push(
						geom0.array[i * 8 + 0],
						geom0.array[i * 8 + 1],
						geom0.array[i * 8 + 2],
						geom0.array[i * 8 + 3],
						geom0.array[i * 8 + 4],
						geom0.array[i * 8 + 5],
						geom0.array[i * 8 + 6],
						geom0.array[i * 8 + 7],
						geom1.array[i * 8 + 0],
						geom1.array[i * 8 + 1],
						geom1.array[i * 8 + 2],
						geom1.array[i * 8 + 3],
						geom1.array[i * 8 + 4],
						geom1.array[i * 8 + 5],
						geom1.array[i * 8 + 6],
						geom1.array[i * 8 + 7]
					)
				}
			}
		}
		return geom
	}

	exports.createCircle = function(radius){
		var geom = vertexstruct.array()
		geom.push(
			0, 0, 0,
			0, 0, 1,
			0.5, 0.5
		)
		for (var i = 0; i < VTX_COUNT; i++) {
			var segment = i / VTX_COUNT * PI * 2
			var pos = vec2(cos(segment), sin(segment))
			geom.push(
				pos[0] * radius, pos[1] * radius, 0,
				0, 0, 1,
				pos[0] / 2 + 0.5, pos[1] / 2 + 0.5
			)
		}
		return geom
	}

	exports.createCircle = function(radius){
		var geom = vertexstruct.array()
		geom.push(
			0, 0, 0,
			0, 0, 1,
			0.5, 0.5
		)
		for (var i = 0; i < VTX_COUNT; i++) {
			var segment = i / VTX_COUNT * PI * 2
			var pos = vec2(cos(segment), sin(segment))
			geom.push(
				pos[0] * radius, pos[1] * radius, 0,
				0, 0, 1,
				pos[0] / 2 + 0.5, pos[1] / 2 + 0.5
			)
		}
		return geom
	}

	exports.createRect = function(width, height){
		var geom = vertexstruct.array()
		geom.push(
			0, 0, 0,
			0, 0, 1,
			0.5, 0.5
		)
		for (var i = 0; i < VTX_COUNT; i++) {
			var segment = i / VTX_COUNT * PI * 2
			var pos = vec2(cos(segment), sin(segment))
			if (abs(pos[0]) > abs(pos[1])) {
				pos[0] = min(pos[0], pow(0.5, 0.5))
				pos[0] = max(pos[0], -pow(0.5, 0.5))
			} else {
				pos[1] = min(pos[1], pow(0.5, 0.5))
				pos[1] = max(pos[1], -pow(0.5, 0.5))
			}
			pos[0] /= pow(0.5, 0.5)
			pos[1] /= pow(0.5, 0.5)
			geom.push(
				pos[0] * width, pos[1] * height, 0,
				0, 0, 1,
				pos[0] / 2 + 0.5, pos[1] / 2 + 0.5
			)
		}
		return geom
	}

	exports.createRoundedRect = function(width, height, radius){
		var geom = vertexstruct.array()
		geom.push(
			0, 0, 0,
			0, 0, 1,
			0.5, 0.5
		)
		for (var i = 0; i < VTX_COUNT; i++) {
			var segment = i / VTX_COUNT * PI * 2
			var pos = vec2(cos(segment), sin(segment))
			pos[0] *= radius
			pos[1] *= radius
			if (pos[0] > 0) {
				pos[0] += width - radius
			} else {
				pos[0] -= width - radius
			}
			if (pos[1] > 0) {
				pos[1] += height - radius
			} else {
				pos[1] -= height - radius
			}
			pos[0] /= width
			pos[1] /= height
			geom.push(
				pos[0] * width, pos[1] * height, 0,
				0, 0, 1,
				pos[0] / 2 + 0.5, pos[1] / 2 + 0.5
			)
		}
		return geom
	}

})
