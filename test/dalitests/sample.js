/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/


// test/dalitests/sample.js
define.class(function($server$, composition, $ui$, screen, view, label, require){

	define.class(this, 'sampler', "$ui/view", function(require, $ui$, view){
		this.attributes = {
			image : require('./assets/1.png')
		}

		this.bgcolorfn = function(mesh) {
			var uv = mesh.xy;
			var bg = vec4(uv.x, uv.y, 1, 1);
			var fg = image.sample(uv.xy);
			fg = vec4(
				fg.r * fg.a + bg.r * (1.0 - fg.a),
				fg.g * fg.a + bg.g * (1.0 - fg.a),
				fg.b * fg.a + bg.b * (1.0 - fg.a),
				1);
			return fg;
		}

	});

	this.render = function(){

		var views = [
				screen({name:'default', clearcolor:'#484230'}
							 ,this.sampler({width: 100, height: 100})
							)
			];

		return views
	}
})
