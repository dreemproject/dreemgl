/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$base/composition', function(require, $base$, screen, view){

	var myview = define.class(view, function(){

		// create a little stamp based button with hover anim
		define.class(this, 'Test', '$base/stamp', function(){

			define.class(this, 'SubStamp', '$base/stamp', function(){

				define.class(this, 'Background', '$shaders/rectshader', function(){
					this.fgcolor = [0.25, 0, 0.5, 1]
					this.aligncontent = float.TOPLEFT
					this.padding = 3
					this.margin = 0
					this.w = 80
				})

				this.onpointerhover = function(event){
					this.fgcolorBackground = Animate({1:[0,1,0,1]})
				}

				this.draw = function(){
					var c = this.canvas
					c.beginBackground(this)
					c.drawRect(float, float, 20,20)
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
				this.margin = 5//[17,5,5,5]
				this.fontsize = 12
				this.fgcolor = [1,1,1,1]
			})

			define.class(this, 'Icon', '$shaders/iconshader', function(){
				this.fgcolor = 'white'
				this.fontsize = 20
				//this.y = float.top(0)
				//this.x = float.right(0)
				this.margin = [0, 0, 0, 10]
			})

			define.class(this, 'Icon2', '$shaders/iconshader', function(){
				///this.align = 'center'
				this.fgcolor = 'white'
				this.fontsize = 20
				this.margin = [0, 5, 0, 5]
			})

			define.class(this, 'Background', '$shaders/rectshader', function(){
				this.fgcolor = [0.25, 0.25, 0.25, 1]
				this.aligncontent = float.LEFT
				//this.margin = [1,0,0,1]
				this.margin = 1
				this.h = float.height("10%")
				this.padding = 10//[10,0,10,0]
				//this.w = float//float.width("50%")
			})

			this.onpointerhover = function(event){
				this.fgcolorBackground = Animate({1:[0,1,0,1]})
			}

			this.fgcolor = [0.5, 1, 0.5, 1]

			this.draw = function(){
				var c = this.canvas
				c.beginBackground(this)
				c.drawLabel(this.text)
				c.drawSubStamp()
				c.drawIcon(this.icon)
				c.endBackground()
			}

			this.canvasverbs = {
				draw: function(text, icon, x, y, w, h){
					this.DOSTAMP()
				}
			}
		})

		define.class(this, 'Button', '$stamps/buttonstamp', function(){
			this.padding = 5
		})

		this.draw = function(){
			var c = this.canvas
			//c.drawRect(0,0,500,500)//10+800*abs(sin(this.time)),10+800*abs(sin(this.time)))
			//c.drawRect(0, 0, c.width, c.height)
			c.fontsize = 5
			c.beginAlign(float.TOPLEFT)
			if(c.startCache('button', this.layoutchanged)){
				var icons = Object.keys(this.Test.prototype.Icon.prototype.table)
				//var dt = performance.now()
				for(var i = 1; i < 200; i++){
					//c.drawRect(0, 0, 100, 100)
					//c.drawRect(float,float,8+8*random(),8+8*random())//,50,50)
					//c.drawRect(float.auto,float.auto,float.width("10%"),float.height("20%"))//,50,50)
					c.drawButton(icons[i],icons[i])
					//c.drawButton(icons[i],icons[i])//icons[floor(Math.random()*icons.length)])
					//c.drawTest('Btn'+i,icons[i+2])
					//c.drawRect(float,float,100,100)
					//c.drawRect()
					//c.drawRect()
					//console.log(c.align.y, c.align.x)
					//c.newline()
					//console.log("MARK")
					//c.drawButton('Btn'+i,icons[i+2])
					//console.log(c.align.x, c.align.y)
					//c.drawRect(auto,auto,fill,50)
					//c.drawRect(auto,auto,20,20)//,50,50)
					//c.drawRect(auto,auto,20,20)//,50,50)
					//c.drawRect()
					//c.draw
					//c.newline()
					//c.drawButton(i,icons[i+1],auto,auto)
				}
				c.stopCache()
			}
			//console.log(performance.now()-dt)
			c.endAlign()
			//this.redraw()
		}
	})

	this.render = function(){ return [
		screen({
			name: 'default',
			bgcolor: 'orange'
		}, [
			myview({
				flex: 1,
				bgcolor: 'orange',
				Button: {
					Background: {
						color2: function(){
							return 'purple'
						}
					}
				}
			})
		])
	]}
})
