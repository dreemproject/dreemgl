/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$base/composition', function(require, $base$, screen, view){

	var myview = define.class(view, function(){
		this.Rect = function(){
			//this.margin = [10,10,0,10],
			this.fgcolor = vec4('blue')
			this.color = function(){
				return mix('red',this.fgcolor,length(mesh.xy*2-1.))
			}
		}

		// create a little stamp based button with hover anim
		define.class(this, 'Button', '$base/stamp', function(){

			define.class(this, 'SubStamp', '$base/stamp', function(){

				define.class(this, 'Background', '$shaders/rectshader', function(){
					this.fgcolor = [0.25,0,0.5,1]
					//this.content = ""
					this.align = 'left|top'
					this.padding = 3
					this.margin = 2
					//this.left = 0
					//this.top = 0
					this.w = 100
				})
			
				this.onpointerhover = function(event){
					this.fgcolorBackground = Animate({1:[0,1,0,1]})
				}

				this.draw = function(){
					var c = this.canvas
					c.beginBackground(this)
					c.drawRect(auto, auto, 20,20)
					c.endBackground()
				}

				this.canvasverbs = {
					draw: function(x, y, w, h){
						this.GETSTAMP()
						this.ARGSTO(stamp)
						stamp.draw()
					}
				}
			})

			define.class(this, 'Label', '$shaders/fontshader', function(){
				//this.align = 'center'
				this.margin = [7,5,5,5]
				this.fontsize = 12
				this.fgcolor = [1,1,1,1]

			})
			
			define.class(this, 'Icon', '$shaders/iconshader', function(){
				this.fgcolor = 'white'
				this.fontsize = 20
				//this.right = 0
				//this.top = 3
				this.margin = [0,5,0,5]
			})
			define.class(this, 'Icon2', '$shaders/iconshader', function(){
				///this.align = 'center'
				this.fgcolor = 'white'
				this.fontsize = 20
				this.margin = [0,5,0,5]
			})
			define.class(this, 'Background', '$shaders/rectshader', function(){
				this.fgcolor = [0.25,0.25,0.25,1]
				//this.content = ""
				this.align = 'left|top'
				this.padding = 0
				//this.margin = 10
				//this.w = 300
			})

			this.onpointerhover = function(event){
				this.fgcolorBackground = Animate({1:[0,1,0,1]})
			}

			this.fgcolor = [0.5,1,0.5,1]

			this.draw = function(){
				var c = this.canvas
				c.beginBackground(this)
				c.drawLabel(this.text)
				//c.drawSubStamp()
				c.drawIcon(this.icon)
				c.endBackground()
			}

			this.canvasverbs = {
				draw: function(text, icon, x, y, w, h){
					this.GETSTAMP()
					this.ARGSTO(stamp)
					stamp.draw()
				}
			}
		})

		this.Rect = function(){
			this.align = 'right|top'
			this.w = fill
			this.h = 20
		}

		this.draw = function(){
			var c = this.canvas 
			//c.drawRect(0,0,500,500)//10+800*abs(sin(this.time)),10+800*abs(sin(this.time)))
			//c.drawRect(0, 0, c.width, c.height)
			c.fontsize = 5
			c.beginAlign(c.LEFT|c.TOP)
			if(c.startCache('button',this.layoutchanged)){
				var icons = Object.keys(this.Button.prototype.Icon.prototype.table)
				var dt = performance.now()
				for(var i = 0; i < 1000; i++){
					c.drawButton('Btn'+i,icons[i+2])
					//c.drawRect()//,50,50)
					//c.draw
					//c.newline()
					//c.drawButton(i,icons[i+1],auto,auto)
				}
				c.stopCache()
			}
			c.endAlign()
			//c.endAlign()
			console.log(performance.now()-dt)
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
