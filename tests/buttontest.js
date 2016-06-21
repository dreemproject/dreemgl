/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$base/composition', function(require, $base$, screen, view){

	var myview = define.class(view, function(){

		define.class(this, 'Button', '$stamps/buttonstamp', function(){
			this.align = float.CENTER
			this.Label = {
				fontsize:15
			}
		})

		define.class(this, 'Text', '$shaders/fontshader', function(){
			this.fontsize = 15
		})

		this.draw = function(){
			this.drawBackground()
			var c = this.canvas
			for(var i = 0; i < 80; i++){
				c.drawButton({
					text:'Button '+i,
					margin: 4
				})
			}
			this.drawScrollbars()
		}
	})

	this.render = function(){ return [
		screen({
			name: 'default',
			clearcolor: 'white'
		}, [
			myview({
				name: 'myview',
				w: float.width('50%'),
				h: float.height('50%'),
				Background: {
					color: vec4('red')
				}
			}
			)
		])
	]}
})
