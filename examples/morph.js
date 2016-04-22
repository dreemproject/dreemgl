/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/


define.class("$server/composition", function($ui$, screen, $3d$, morph3d, circle, roundedrect) {
	this.render = function() {
		return [
			screen(
				morph3d({
					bgcolor: vec4('blue'),
					top: 200,
					left: 200,
					oninit: function () {
						this.morphweight = Animate({
							repeat: Infinity,
							0: {value: 1, motion: "sine"},
							1: {value: 0, motion: "sine"},
							2: {value: 1, motion: "sine"}
						})
					}
				}, [
					circle({radius: 200, detail: 64}),
					roundedrect({width: 200, height: 200, radius: 4, detail: 64})
				])
			)
		]
	}
})
