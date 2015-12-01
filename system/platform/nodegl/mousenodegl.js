/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Mouse class

define.class('$system/base/mouse', function(){
	this.atConstructor = function(device){
		var document = device.document

		this.x = 0
		this.y = 0

		document.on('click', function(e){
			this.click = 1
		}.bind(this))

		document.on('blur', function(e){
			this.blurred =1;
		}.bind(this))

		document.on('dblclick', function(e){
			this.dblclick = 1
		}.bind(this))

		document.on('mousewheel', function(e){
			if(device.keyboard.ctrl || device.keyboard.leftmeta || device.keyboard.rightmeta){
				this.zoom = e.wheelDelta / 120
				//console.log(e.wheelDelta)
			}
			else{
				if(e.deltaX !== 0) this.wheelx = e.wheelDeltaX
				if(e.deltaY !== 0) this.wheely = e.wheelDeltaY
			}
			e.preventDefault()
		}.bind(this))

		var click_count = 0

		this.resetClicker = function(){
			click_count = 0
		}
		
		this.mousedown = function(e){
			var now = Date.now()
			if (this.activedown == 0){
				//document.body.setCapture();
			}
			this.activedown++;
			if(this.last_click !== undefined && now - this.last_click < this.clickspeed){
				click_count ++
			}
			else click_count = 1
			this.last_click = now

			this.clicker = click_count

			this.x = e.pageX// / this.ratio//* window.devicePixelRatio
			this.y = e.pageY// / this.ratio//* window.devicePixelRatio

			if(e.button === 0 ) this.cancapture = 1, this.left = 1, this.leftdown = 1
			if(e.button === 1 ) this.cancapture = 3, this.middle = 1
			if(e.button === 2 ) this.cancapture = 2, this.right = 1, this.rightdown = 1
			this.isdown = 1
			e.preventDefault()
		}

		document.on('mousedown', this.mousedown.bind(this))

		this.mouseup = function(e){
			this.activedown--;
			if (this.activedown == 0){
				//document.body.releaseCapture();
			}
			this.x = e.pageX// / this.ratio//* window.devicePixelRatio
			this.y = e.pageY// / this.ratio //* window.devicePixelRatio
			this.cancapture = 0
			if(e.button === 0) this.left = 0, this.leftup = 1
			if(e.button === 1) this.middle = 0
			if(e.button === 2) this.right = 0, this.rightup = 1
			this.isdown = 0
			e.preventDefault()
		}

		document.on('mouseup', this.mouseup.bind(this))

		this.mousemove = function(e){
			//last_click = undefined
			//if(layer) hit = layer.hitTest2D(e.pageX * ratio, e.pageY * ratio)
			this.x = e.pageX// / this.ratio//* window.devicePixelRatio
			this.y = e.pageY// / this.ratio//* window.devicePixelRatio
			this.move = 1
			e.preventDefault()
		}

		document.on('mousemove', this.mousemove.bind(this))
	}
})
