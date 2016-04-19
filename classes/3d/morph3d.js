/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, $ui$, view){
// Morphing 3d geometry class.
// Target geometries are specified as children.
// Both target geometries should have the same vertex attribues and vertex count.

	this.attributes = {
		// Morph weight - determines the interpolation between target shapes
		morphweight: Config({type: float, value: 0}),
		// Shape color
		bgcolor: Config({type: vec4, value: vec4(1, 1, 1, 1)}),
		// Shape opacity
		opacity: Config({value: 1.0, type: float})
	}

	// Overridable bgcolor function
	this.bgcolorfn = function(pos){
		return this.bgcolor
	}

	define.class(this, 'shape3d', this.Shader, function(){
		this.draworder = 0

		this.depth_test = 'src_depth < dst_depth'

		this.vertexstruct = define.struct({
			pos: vec3,
			norm: vec3,
			uv: vec2
		})

		this.diffusecolor = vec4("#ffffff")
		this.mesh0 = this.vertexstruct.array()
		this.mesh1 = this.vertexstruct.array()

		this.update = function () {
			var t0 = this.view.children[0]
			var t1 = this.view.children[1]

			t0.shaders.shape3d.update()
			t1.shaders.shape3d.update()

			this.mesh0 = t0.shaders.shape3d.mesh
			this.mesh1 = t1.shaders.shape3d.mesh

			if (this.mesh0.array.length !== this.mesh1.array.length) {
				throw new Error('Morph geometries mismatch buffer length.')
			} else if (this.mesh0.array.length % 8 !== 0) {
				throw new Error('Morph targets should encode pos (vec3), norm (vec3), uv (vec2).')
			}
		}

		this.position = function(){
			pos = mesh0.pos * view.morphweight
			pos += mesh1.pos * (1 - view.morphweight)
			norm = mesh0.norm * view.morphweight
			norm += mesh1.norm * (1 - view.morphweight)
			uv = mesh0.uv * view.morphweight
			uv += mesh1.uv * (1 - view.morphweight)
			return vec4(pos, 1) * view.totalmatrix * view.viewmatrix
		}

		this.color = function(){
			var col = view.bgcolorfn(uv)
			return vec4(col.rgb, col.a * view.opacity)
		}
	})

	this.shape3d = true
	this.hardrect = false

	this.render = function () {
		if (this.children.length !== 2) {
			throw new Error('Morphtargets attribute should have exatly 2 elements.')
		}
		this.children[0].visible = false
		this.children[1].visible = false
		return this.children
	}
})
