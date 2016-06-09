/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$base/composition', function(require, $base$, screen, view){

	var myview = define.class(view, function(){

		define.class(this, 'Button', '$stamps/buttonstamp', function(){
			//this.x = 10
			//this.x = float.right(10)
			this.align = float.LEFT
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

		this.Rect = {
			w:NaN,h:NaN,margin:[1,1,1,1],
		}

		this.draw = function(time){
			var c = this.canvas
			//c.geometryRect({})
			//c.uniformsRect({})
			//c.flushRect()
			var dt = performance.now()
			//var obj = {Background:{color:[1,0,0,1]}, w:2, h:2}
			for(var i = 0; i < 10; i++){
				//obj.x = 10+sin(i+time)*100
				//obj.y = 10+sin(i*0.13+time)*300
				//c.drawRect({color:[random(),0,random(),1]})
				c.beginRect({
					align:float.RIGHT,
					color:[i*0.33%1,0,i*0.33%1,1],
					padding:[0,0,0,0],
					w:50,
					h:50
				})
				//for(var j = 0; j < 100; j++){
				c.drawRect({margin:[0,0,0,0],color:[1,1,1,1],w:10,h:10})
				//}
				c.endRect()
			}

			//c.beginAlign(float.CENTER, float.NOWRAP)
			//c.drawRect({w:100,h:100})
			//c.drawRect({w:100,h:100})
			//c.endAlign()

			//c.beginRect()

			///c.endRect()
			console.log(performance.now()-dt)
			//return true
				//c.drawRect({bgcolor:'blue'})
		}
	})


	this.render = function(){ return [
		screen({
			name: 'default',
			clearcolor: '#1f1f1f'
		}, [
			myview({
				flex: 1,
			})
		])
	]}
})
