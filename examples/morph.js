/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition",function(require, $ui$, screen, view) {

	define.class(this, "morphview", view, function(){

		this.attributes = {
			weight0: Config({type: Number, value: 0}),
			weight1: Config({type: Number, value: 0}),
			weight2: Config({type: Number, value: 0})
		}

		var anim0 = Animate({
			repeat: Infinity,
			0: {value: 1, motion: "linear"},
			1: {value: 0, motion: "outelastic"},
			2: {value: 0, motion: "linear"},
			3: {value: 1, motion: "outelastic"}
		})

		var anim1 = Animate({
			repeat: Infinity,
			0: {value: 0, motion: "linear"},
			1: {value: 1, motion: "outelastic"},
			2: {value: 0, motion: "outelastic"},
			3: {value: 0, motion: "linear"}
		})

		var anim2 = Animate({
			repeat: Infinity,
			0: {value: 0, motion: "linear"},
			1: {value: 0, motion: "linear"},
			2: {value: 1, motion: "outelastic"},
			3: {value: 0, motion: "outelastic"}
		})

		this.oninit = function() {
			this.weight0 = anim0
			this.weight1 = anim1
			this.weight2 = anim2
		}


		define.class(this, 'morphshape', this.Shader, function(){

			// internal: Total vertex number
			var VTX_COUNT = 512

			// Lets use triangle fan for radial shapes
			this.drawtype = "TRIANGLE_FAN"

			// Vertex buffer contains three morph targets
			var vertstruct = define.struct({
				target0: vec2,
				target1: vec2,
				target2: vec2
			})

			this.mesh = vertstruct.array()

			this.update = function(){

				var mesh = this.mesh = vertstruct.array();

				// Since we are creating a triangle fan mesh,
				// start with the center vertex at (0, 0) for all shapes.
				mesh.push(
					0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0
				)

				for (var i = 0; i <= VTX_COUNT; i++) {

					var segment = i / VTX_COUNT * PI * 2

					// Calculate square shape
					var shape0 = vec2(cos(segment), sin(segment))
					if (abs(shape0[0]) > abs(shape0[1])) {
						shape0[0] = min(shape0[0], pow(0.5, 0.5))
						shape0[0] = max(shape0[0], -pow(0.5, 0.5))
					} else {
						shape0[1] = min(shape0[1], pow(0.5, 0.5))
						shape0[1] = max(shape0[1], -pow(0.5, 0.5))
					}

					// Calculate circle shape
					var shape1 = vec2(cos(segment), sin(segment))

					// Calculate splat shape
					var shape2 = vec2(cos(segment), sin(segment))
					shape2 = vec2.mul_float32(shape2, 0.75)
					shape2 = vec2.mul_float32(shape2, 1 + 0.25 * cos(segment * 4))

					// Add all shapes to the vertex buffer
					mesh.push(
						shape0[0], shape0[1], shape1[0], shape1[1], shape2[0], shape2[1],
						shape0[0], shape0[1], shape1[0], shape1[1], shape2[0], shape2[1],
						shape0[0], shape0[1], shape1[0], shape1[1], shape2[0], shape2[1],
						shape0[0], shape0[1], shape1[0], shape1[1], shape2[0], shape2[1]
					)
				}
			}

			this.position = function(){
				// combine and weight morph targets
				var pos = mesh.target0 * view.weight0
				pos    += mesh.target1 * view.weight1
				pos    += mesh.target2 * view.weight2
				// center shape in view
				pos = pos * min(view.layout.width, view.layout.height) / 3
				pos += vec2(view.layout.width / 2, view.layout.height / 2)
				return vec4(pos, 0, 1) * view.totalmatrix * view.viewmatrix
			}
			this.color = function(){
				return vec4(1, 1, 1, 1)
			}
		})

		this.morphshape = true

	})

	this.render = function() {
		return [screen(
			this.morphview({
				flex: 1
			})
		)]
	}
})
