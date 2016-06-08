/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$base/composition', function(require, $base$, screen, view){

	var myview = define.class(view, function(){

		define.class(this, 'Button', '$stamps/buttonstamp', function(){
		})


		this.states = {
			on:{
				x:10,
				Button:{
					text:'ON!',
					Background:{
						color:'red'
					}
				}
			},
			off:{
				x:0,
				color:'red',
				Button:{
					//text:'OFF!'
				}
			}
		}

		this.draw = function(){
			var c = this.canvas
			//c.geometryRect({})
			//c.uniformsRect({})
			//c.flushRect()

			c.drawButton({color:[1,1,0,1],x:10, y:10, w:100, h:100})
			console.log(c)	
			//c.drawRect({bgcolor:'blue'})
		}
	})


	this.render = function(){ return [
		screen({
			name: 'default',
			clearcolor: 'purple'
		}, [
			myview({
				flex: 1,
			})
		])
	]}
})
