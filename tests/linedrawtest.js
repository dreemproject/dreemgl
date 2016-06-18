/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$base/composition', function(require, $base$, screen, view){

	var myview = define.class('$base/view', function(){
		define.class(this,'Line', '$shaders/line', function(){
			
		})
	})

	this.render = function(){ return [
		screen({name: 'default'}, [
			view({
				w:float('100%'),
				h:float('100%'),
				draw:function(){
					var c = this.canvas
					for(var i = 0; i < 10; i++){

					}
				}
			})
		])
	]}
})
