/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Mouse class

define.class('$system/base/mouse', function (require, exports){

	this.ratio = 0
	
	this.activedown = 0;
		
	this.clickspeed = 350

	this._cursor = 'arrow'
	this._tooltip = 'Application'

	Object.defineProperty(this, 'cursor', {
		get:function(){
			return this._cursor
		},
		set:function(value){
			this._cursor = value
			if(value === 'arrow') value = 'default'
			this.device.keyboard.textarea.style.cursor = 
			document.body.style.cursor = value
		}
	})

	this.atConstructor = function(device){
		this.device = device
		//this.x = 0
		//this.y = 0
		if(this.ratio == 0) this.ratio = window.devicePixelRatio

		document.ontouchmove = function(e){
			e.preventDefault()
		}
		// allright we need to figure out how we send back the mouse events to the worker
		// are we going to send a vec2? or something else
		document.addEventListener('click', function(e){
			this.click = 1
		}.bind(this))

		document.addEventListener('blur', function(e){
			this.blurred = 1
		}.bind(this))

		document.addEventListener('dblclick', function(e){
			this.dblclick = 1
		}.bind(this))

		document.addEventListener('wheel', function(e){
			if(e.ctrlKey || e.metaKey){
				this.zoom = e.wheelDelta / 120
			}
			else{
				if(e.deltaX !== 0) this.wheelx = e.deltaX
				if(e.deltaY !== 0) this.wheely = e.deltaY
			}
			e.preventDefault()
		}.bind(this))

		var click_count = 0

		this.resetClicker = function(){
			click_count = 0
		}
		
		this.mousedown = function(e){
			this.device.keyboard.mouseMove(e.pageX, e.pageY)
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

			if(device.keyboard) device.keyboard.checkSpecialKeys(e)

			if(e.button === 0 ) this.cancapture = 1, this.left = 1, this.leftdown = 1
			if(e.button === 1 ) this.cancapture = 3, this.middle = 1
			if(e.button === 2 ) this.cancapture = 2, this.right = 1, this.rightdown = 1

			this.down = {
				x:e.pageX,
				y:e.pageY,
				button: e.button === 0?1:e.button === 1?3:2,
				shift: e.shiftKey,
				alt: e.altKey,
				ctrl: e.ctrlKey,
				meta: e.metaKey
			}

			e.preventDefault()
			overlay.style.display = 'block'
		}

		window.addEventListener('mousedown', this.mousedown.bind(this))

		this.mouseup = function(e){
			this.device.keyboard.mouseMove(e.pageX, e.pageY)
			this.activedown--;
			if (this.activedown == 0){
				//document.body.releaseCapture();
			}

			if(device.keyboard) device.keyboard.checkSpecialKeys(e)

			this.x = e.pageX// / this.ratio//* window.devicePixelRatio
			this.y = e.pageY// / this.ratio //* window.devicePixelRatio
			this.cancapture = 0
			if(e.button === 0) this.left = 0, this.leftup = 1
			if(e.button === 1) this.middle = 0
			if(e.button === 2) this.right = 0, this.rightup = 1

			this.up = {
				x:e.pageX,
				y:e.pageY,
				button: e.button === 0?1:e.button === 1?3:2,
				shift: e.shiftKey,
				alt: e.altKey,
				ctrl: e.ctrlKey,
				meta: e.metaKey
			}

			e.preventDefault()
			overlay.style.display = 'none'
		}

		window.addEventListener('mouseup', this.mouseup.bind(this))
		
		this.mousemove = function(e){
			this._pagex = e.pageX
			this._pagey = e.pageY
			// lets move our textarea only if right mouse is down
			if(e.buttons){
				this.device.keyboard.mouseMove(e.pageX, e.pageY)
			}
			//last_click = undefined
			//if(layer) hit = layer.hitTest2D(e.pageX * ratio, e.pageY * ratio)
			this.x = e.pageX// / this.ratio//* window.devicePixelRatio
			this.y = e.pageY// / this.ratio//* window.devicePixelRatio
			this.move = {
				x: e.pageX,
				y: e.pageY,
				button: e.button === 0? 1:e.button === 1? 3:2,
				shift: e.shiftKey,
				alt: e.altKey,
				ctrl: e.ctrlKey,
				meta: e.metaKey
			}
			e.preventDefault()
		}

		window.addEventListener('mousemove', this.mousemove.bind(this))

		var overlay = this.overlay
		if(!overlay){
			overlay = this.overlay = document.createElement(this.tag || 'div')
			document.body.appendChild(this.overlay)
			overlay.style.display = 'none'
			overlay.style.position = 'absolute'
			overlay.style.zIndex = 10000000
			overlay.style.width = '100%'
			overlay.style.height = '100%'

			overlay.addEventListener('mousedown', this.mousedown.bind(this))
			overlay.addEventListener('mouseup', this.mouseup.bind(this))
			overlay.addEventListener('mousemove', this.mousemove.bind(this))
		}


	}
})
