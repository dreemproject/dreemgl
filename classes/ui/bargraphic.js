/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/
// Sprite class

define.class('$ui/view', function(require, view){
// The bargraphic class is used by the audioplayer widget to visualize the audio output. It takes a Uint8Array and produces a bar graph.

	this.attributes = {
		// data is a Uint8Array of data to visualize
		data: Config({type:Array, value:[]}),
	}

	// Clear the graph
	this.clear = function() {
		this.data = [];
	}


	this.hardrect = {
		// Use a custom shader to display colored bars to match the data. The size
		// of the bars are adjusted to match the width of the view.
		mesh: define.struct({
			pos:vec2,
			col:vec4
		}).array(),

		position: function(){
			uv = mesh.pos.xy
			pos = vec2(mesh.pos.x * view.layout.width, mesh.pos.y * view.layout.height)
			var res = vec4(pos, 0, 1) * view.totalmatrix * view.viewmatrix
			res.w -= 0.004
			return res;
		},

		// Create the bars for each non-zero data element
		update: function() {
			var mesh = this.mesh = this.mesh.struct.array();

			var w = 0;
			var thickness = 1 / this.view.data.length;
			var color = this.view.fgcolor;
			for (var i=0; i<this.view.data.length; i++) {
				var x0 = w;
				var x1 = w + thickness;
				w += thickness;
				
				var height = float(this.view.data[i]);
				if (height > 0) {
					mesh.pushQuad(
						x0,1, color[0],color[1],color[2],1,
						x1,1, color[0],color[1],color[2],1,
						x0,1-height, color[0],color[1],color[2],1,
						x1,1-height, color[0],color[1],color[2],1
					)
				}
			}
		},

		color: function(){
      return mesh.col;
		}

	}


})
