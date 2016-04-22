/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/button', function(require, $ui$, view, icon) {

	this.attributes = {
		ballsize: 16,
		icon: "",
		triangle: false,
		triangleangle: 0,
		borderradius: 8,
		borderwidth: 3,
		bordercolor: "#6c6c6c",
		bgcolor: "#00ffff",
		width: 16,
		height: 16,
		cursor: "pointer",
		alignitems: "center",
		justifycontent: "center"
	}

	this.ontriangleangle = function() {
		var tri = this.find("thetri")
		if (tri) {
			tri.angle = this.triangleangle - PI / 2
			tri.bgcolor = this.bordercolor
		}
	}

	this.onballsize = function() {
		this.width = this.ballsize
		this.height = this.ballsize
		this.borderradius = this.ballsize / 2
	}

	define.class(this, "triangledisp", view, function() {
		this.attributes = {angle: 0, radius: 8}

		this.hardrect = function() {
			this.mesh = vec3.array()
			this.mesh.push(0, 0, 0)
			this.mesh.push((PI * 2) / 3, 0, 0)
			this.mesh.push((PI * 2 * 2) / 3, 0, 0)

			this.color = function() {
				return view.bgcolor
			}

			this.position = function() {
				var p = vec2(sin(mesh.x - view.angle) * view.radius, cos(mesh.x - view.angle) * view.radius)
				return vec4(p.xy + vec2(0, 7), 0, 1) * view.totalmatrix * view.viewmatrix
			}
		}
	})

	this.onbgcolor = function() {
		var hsv = vec4.toHSV(this.bgcolor)
		var lighter = vec4.fromHSV(hsv[0], hsv[1] * 0.5, Math.min(1, hsv[2] * 1.5), 1)
		var pressed = vec4.fromHSV(hsv[0], Math.min(hsv[1] * 1.5, 1.0), Math.min(1, hsv[2] * 1.8), 1)
		this.buttoncolor1 = this.bgcolor
		this.buttoncolor2 = this.bgcolor
		this.hovercolor1 = lighter
		this.hovercolor2 = lighter
		this.pressedcolor1 = lighter
		this.pressedcolor2 = lighter
	}

	this.onbordercolor = function() {
		var tri = this.find("thetri");
		if (tri) {
			tri.angle = this.triangleangle - PI / 2
			tri.bgcolor = this.bordercolor
		}
	}

	this.render =function() {
		if (this.icon && this.icon.length > 0) return [
			icon({icon:this.icon, alignself:"center", alignself:'stretch', fgcolor:wire("this.parent.bordercolor")})
		]
		if (this.triangle) return [
			this.triangledisp({name:"thetri", alignself:'stretch',bgcolor:wire("this.bordercolor")})
		]
		return []
	}
})
