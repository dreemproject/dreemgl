/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$base/composition', function(require, $base$, screen, view){

	var myview = define.class(view, function(){

		this.Rect = function(){
			this.margin = [0,0,1,0],
			this.fgcolor = vec4('orange')
		}

		

		// create a little stamp based button with hover anim
		define.class(this, 'button', '$base/stamp', function(){
			define.class(this, 'label', '$shaders/fontmonoshader', function(){
				this.margin = [5,5,5,5]
				this.fontsize = 15
				this.fgcolor = [1,1,1,1]
			})
			
			define.class(this, 'icon', '$shaders/iconshader')

			this.rect = function(){
				this.fgcolor = [0.25,0.25,0.25,1]
			}

			this.onpointerhover = function(event){
				this.fgcolorRect = Animate({1:[0,1,0,1]})
				//this.wRect = Animate({0.5:40})
				//this.hRect = Animate({0.5:40})
			}

			this.fgcolor = [0.5,1,0.5,1]

			this.margin = 1
			this.padding = [0,0,0,0]
			this.draw = function(){
				var c = this.canvas
				//c.margins = this.padding
				c.layerRect()
				c.beginAlign(c.LEFT, this.margin, this.padding)
				c.drawLabel(this.text)
				c.drawIcon('android')
				c.endAlign(c.INSIDE)
				c.drawRect()
			}

			this.canvasverbs = {
				draw: function(text, x, y, w, h){
					if(w === undefined && x !== undefined) w = x, x = undefined
					if(h ===undefined && y !== undefined) h = y, y = undefined
					this.GETSTAMP()
					stamp.draw()
				}
			}
		})

		this.draw = function(){
			var c = this.canvas 
			
			//c.drawRect(10+800*abs(sin(this.time)),10+800*abs(sin(this.time)))

			c.beginAlign(c.LEFT|c.WRAP)
			c.fontsize = 5

			var dt = performance.now()
			//console.log(this.layoutchanged)
			if(c.startCache('button',this.layoutchanged)){
				for(var i = 0; i < 1000; i++){
					//c.color=[random(),random(),random(),1.]
					//c.drawButton('hi',50,30)
					
					//c.drawRect(70,50)
					//c.drawRect(70,50)
					//c.beginAlign(c.LEFT,[10,10,10,10])
					c.drawButton('Btn'+i,30,50)
					//c.drawInner('CEN')
					//c.drawMore(10,10)
					//c.endAlign(c.INSIDE)
					//c.drawRect()
					//c.drawRect(50,40)
					
				}
				c.stopCache()
			}
			//c.endAlign()
			/*
			// this allows reuse of commandbuffers
			if(c.startCache('button', true)){

				c.startAlign('leftfloor',20)
				c.margin = [1,0,0,0.5]

				//c.drawRect(random()*300, random()*300, 10, 10)
				c.color = [1,1,1,0.5]
				//for(var j = 0; j < 5;j++){
				//for(var j = 0; j < 150;j++){

				//var dt = performance.now()
				for(var i = 0; i < 10000;i++){
					c.drawRect(4,10+10*sin(i))
				}
				//console.log(performance.now()-dt)
			//}
					//c.drawRect(i*6,j*6, 5, 5)
				//	}
				//}
				c.stopCache()
			}*/
		}

	})

	this.render = function(){ return [
		screen({name:'default', bgcolor:'orange',rect:{color:function(){return 'blue'}},clearcolor:vec4('purple')},
			myview({flex:1, bgcolor:'orange'})
		)
	]}
})
