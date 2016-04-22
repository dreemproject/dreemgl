/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

//Pure JS based composition
define.class(function($server$, composition, $ui$, screen, view, label, require){
// internal

	// internal
	// pre-load the images
	this.images = [require('./assets/0.png'), require('./assets/1.png'), require('./assets/2.png'), require('./assets/3.png'), require('./assets/4.png'), require('./assets/5.png'), require('./assets/6.png'), require('./assets/7.png'), require('./assets/8.png'), require('./assets/9.png')];

	this.render = function(){
		var dynviews = [];
		for (var digit=0; digit<10; digit++) {
			for (var w=100; w<=200; w+= 25) {
				var v1 = view({
					size: vec2(w, w)
					,bgimage: this.images[digit]
					,bgimagemode: 'stretch'
				})
				dynviews.push(v1);
			}
		}

		var views = [
				screen({name:'default', clearcolor:'#484230'}
					   ,dynviews)
			];

		return views
	}
})
