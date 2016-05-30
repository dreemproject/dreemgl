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
				return mix(vec4(0,0,0,0),this.fgcolor,length(mesh.xy*2-1.))
			}
		}


		this.Rect = function(){
			this.w = float.width("fill")
			this.h = float.height("10%")
			this.margin = .5
		}

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
				var dt = performance.now()
				for(var i = 0; i < 10000; i++){
					//c.drawRect(float,float,8+8*random(),8+8*random())//,50,50)
					//c.drawRect(auto,auto,20,20)//,50,50)
					//c.drawButton(icons[i],icons[i])
					c.drawButton('Hi','')
					//c.drawTest('Btn'+i,icons[i+2])
					//c.drawRect()
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
		}
	})

	this.render = function(){ return [
		screen({name:'default', bgcolor:'orange',rect:{color:function(){return 'blue'}},clearcolor:vec4('purple')},
			myview({flex:1, bgcolor:'orange'})
		)
	]}
})
