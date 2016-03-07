/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function(require, $ui$, screen, view){

	var myview = define.class(view, function(){

		this.draw = function(){
			var c = this.canvas 
			// this allows reuse of commandbuffers
			if(c.pushCache('button', false)){
				//c.drawRect(random()*300, random()*300, 10, 10)
				for(var i = 0; i < 150;i++){
				for(var j = 0; j < 150;j++){
					c.drawButton("hi!", i*6,j*6, 5, 5)
				}
				}
				c.popCache()
			}
		}

		// create a little draw based button with hover anim
		define.class(this, 'button', '$canvas/draw', function(){

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
					this.drawINLINE()
				}
			}
		})
	})

	this.render = function(){ return [
		screen({name:'default', bgcolor:'orange',rect:{color:function(){return mix('red','red',mesh.y)}},clearcolor:vec4('purple')},
			myview({width:200, height:200, bgcolor:'red'})
		)
	]}
})
