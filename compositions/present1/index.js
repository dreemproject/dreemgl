/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition",function(module, $server$, service, $ui$, screen, view, $flow$services$, map, omdb, webrequest, $flow$controllers$, xypad, knob, keyboard, dpad, $flow$displays$, shaderviz, labtext, inputs, outputs, album, $flow$devices$, estimote) {

	define.classPath(this)

	this.render = function() {
		return [
			xypad({name:"xypad0", flowdata:{x:41, y:354}}),
			shaderviz({name:"shaderviz", flowdata:{x:445, y:109}, shaderpos:wire("this.rpc.xypad0.pointerpos")})
		]
	}
}
)
