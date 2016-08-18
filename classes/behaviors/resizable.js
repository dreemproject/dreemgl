/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(){
	this.pointerstart = function(ev, v, o){
		var start = this.globalToLocal(v);

		var growx = (start.x < this.width / 2);
		var growy = (start.y < this.height / 2);

		this._original = {
			gx:growx,
			gy:growy,
			x:this.x,
			y:this.y,
			w:this.width,
			h:this.height
		};
	}

	this.pointermove = function(ev, v, o){

		if (!this._original) {
			var start = this.globalToLocal(v);

			var growx = (start.x < this.width / 2);
			var growy = (start.y < this.height / 2);

			this._original = {
				gx:growx,
				gy:growy,
				x:this.x,
				y:this.y,
				w:this.width,
				h:this.height
			};
		}

		var dx = ev.delta.x;
		var dy = ev.delta.y;

		if (this._original.gx) {
			this.x = this._original.x + dx;
			this.width = this._original.w - dx;
		} else {
			this.width = this._original.w + dx;
		}

		if (this._original.gy) {
			this.y = this._original.y + dy;
			this.height = this._original.h - dy;
		} else {
			this.height = this._original.h + dy;
		}

	}
})
