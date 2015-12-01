/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Mouse class

define.class('$system/base/touch', function (require, exports){

	this.ratio = 0
	this.activedown = 0;
		
	this.clickspeed = 350

	this.setTouches = function(touches){
		var arr = []
		arr[0] = vec2(this.x = touches[0].pageX, this.y = touches[0].pageY)
		for(var i = 1; i < 5;i++){
			if(i >= touches.length) break;
			arr[i] = vec2(this['x'+i] = touches[1].pageX, this['y'+i] = touches[1].pageY)
		}
		return arr
	}

	this.atConstructor = function(){
		if(this.ratio == 0) this.ratio = window.devicePixelRatio

		document.ontouchmove = function(e){
			e.preventDefault()
		}.bind(this)

		window.addEventListener('touchstart', function(e){
			var arr = this.setTouches(e.touches)
			this.emit('start', arr)
		}.bind(this))

		window.addEventListener('touchend', function(e){
			this.emit('end')
		}.bind(this))

		window.addEventListener('touchcancel', function(e){
			this.emit('cancel')
		}.bind(this))

		window.addEventListener('touchleave', function(e){
			this.emit('leave')
		}.bind(this))

		window.addEventListener('touchmove', function(e){
			var arr = this.setTouches(e.touches)
			this.emit('move', arr)
		}.bind(this))
	}
})
