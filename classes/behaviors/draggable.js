/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(){

	// internal, alright what does a draggable do?... well
	this.mouseleftdown = function(event){
		var start = event.local
		var startx = this.pos[0];
		var starty = this.pos[1];

		var startposition = this.parent.localMouse();
		// ok we start dragging a rectangle
		// how does that work?
		this.mousemove = function(event){

			p = this.parent.localMouse()
			var dx = p[0] - startposition[0];
			var dy = p[1] - startposition[1];
			this.pos = [startx  + dx, starty + dy]
			//origin[0] += delta[0], origin[1] += delta[1]
		}
	}

	this.mouseleftup = function(){
		this.mousemove = function(){}
	}

	// it waits for leftmousedown
	// then moves itself till leftmouseup
	// and make it do pointer instead

})
