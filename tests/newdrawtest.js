/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$base/composition', function(require, $base$, screen, view){

	var myview = define.class(view, function(){

		this.draw = function(){
			var c = this.canvas 
			c.color = [0,1,1,1]
			//c.drawRect()
			
			// this allows reuse of commandbuffers
			if(c.startCache('button', true)){

				c.startAlign('leftfloor',10)
				c.margin = [1,0,0,0.5]

				//c.drawRect(random()*300, random()*300, 10, 10)
				c.color = [1,1,1,0.5]
				//for(var j = 0; j < 5;j++){
				//for(var j = 0; j < 150;j++){

				//var dt = performance.now()
				for(var i = 0; i < 10000;i++)
					c.drawRect(4,10+10*sin(i))
				//console.log(performance.now()-dt)
			//}
					//c.drawRect(i*6,j*6, 5, 5)
				//	}
				//}
				c.stopCache()
			}
		}

		// create a little draw based button with hover anim
		define.class(this, 'button', '$base/stamp', function(){

			this.onpointerhover = function(event){
				this.colorRect = Animate({1:[0,1,1,1]})
				this.wRect = Animate({0.5:40})
				this.hRect = Animate({0.5:40})
			}

			this.color = [0.5,0.5,0.5,1]
	
			this.draw = function(){
				this.canvas.drawRect()
			}

			this.canvasverbs = {
				draw: function(label, x, y, w, h){
					if(w === undefined && x !== undefined) w = x, x = undefined
					if(h ===undefined && y !== undefined) h = y, y = undefined
					this.drawINLINE()					
				}
			}
		})
	})

	this.render = function(){ return [
		screen({name:'default', bgcolor:'orange',rect:{color:function(){return 'blue'}},clearcolor:vec4('purple')},
			myview({flex:1, bgcolor:'orange'})
		)
	]}
})
