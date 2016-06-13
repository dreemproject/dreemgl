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
			w:5,h:5,
		}

		define.class(this, 'Text', '$shaders/fontshader', function(){
			this.fontsize = 5
		})


		this.draw = function(time){
			var c = this.canvas
			var dt = performance.now()

			for(var i = 0; i < 1;i++){
				//c.drawRect({color:[random(),random(),random(),1],w:random()*100})
				//c.drawText({text:""+i+random(),})
				//c.drawRect({color:'red'})
				c.drawText({break:'word', text:"HELLO THING"})
			}
			//console.log(performance.now()-dt)

			//return true
			/*
			//var obj = {Background:{color:[1,0,0,1]}, w:2, h:2}
			for(var i = 0; i < 1; i++){
				//obj.x = 10+sin(i+time)*100
				//obj.y = 10+sin(i*0.13+time)*300
				//c.drawRect({color:[random(),0,random(),1]})
				c.beginRect({
					walk:float.LRTBWRAP,
					align:float.CENTER,
					color:'orange',
					padding:30,
					margin:30,
					w:400,// + 50*sin(time),
				})

				for(var j = 0; j < 5; j++){
					c.beginRect({
						margin:1,
						walk:float.LRTBWRAP,
						align:float.LEFTTOP,
						color:'blue',
						padding:0,
						w:100,
						h:100
					})

					//for(var k = 0; k < 3; k++){
					//	c.drawRect({color:'purple',w:3,h:3})
					//}

					c.drawRect({
						color:'yellow', 
						x:float.left(0),
						y:float.top(3),
						w:float.width('50%'), 
						h:float.height('100%-5')
						//h:float.height('50%')
					})
					c.drawRect({
						color:'red', 
						x:float.right(0), 
						y:float.top(3), 
						w:float.width('50%'), 
						h:float.width('100%-5')
					})

					//c.drawRect({color:'yellow', x:float.right(0), y:float.top(-10), w:3, h:3})

					c.endRect()
				}
				//}
				c.endRect()

			}*/
			//this.drawChildren()
			//c.beginAlign(float.CENTER, float.NOWRAP)
			//c.drawRect({w:100,h:100})
			//c.drawRect({w:100,h:100})
			//c.endAlign()

			//c.beginRect()

			///c.endRect()
			//console.log(performance.now()-dt)
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
				align:float.CENTER,
				name: 'myview',
				w:float.width('100%'), 
				h:float.height('100%')
			}
				,view({name:'view1',bgcolor:'red',margin:[0,10,0,10],w:float.width('50%'),h:100})
				,view({name:'view1',bgcolor:'blue',margin:[0,10,0,0],w:float.width('50%'),h:100})
				//view({name:'view2'})
			)
		])
	]}
})
