/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$services$, map, webrequest, $flow$controllers$, xypad, knob, keyboard, dpad, $flow$displays$, labtext) {
	this.render = function() {
		return [
			xypad({name:"xypad0", flowdata:{x:23, y:316}}),
			labtext({name:"labtext0", flowdata:{x:290, y:164}, vec2:wire("this.rpc.xypad0.pointerpos"), string:wire("this.rpc.dpad0.value")}),
			dpad({name:"dpad0", flowdata:{x:71, y:59}})
		]
	}
}
)
