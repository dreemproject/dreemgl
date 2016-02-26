/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/scrollbar', function () {

	this.position = 'absolute'
	this.vertical = false
	this.visible = true

	this.attributes = {
		zoom: Config({value: wire('this.parent.zoom')}),
		value: Config({value: wire('this.parent.scroll')})
	}

	this.value = function(event){
		if (event.mark) return
		this.parent.scroll = this._value
	}

	this.layout = function(){
		this.layout.left = 0
		this.layout.height = 10
		this.layout.width =  this.parent.layout.width
		this.layout.top = this.parent.layout.height - this.layout.height
	}

	this.atAnimate = function () {
		this.updateScrollbar()
	}

	// internal: show/hide and resize scrollbar
	this.updateScrollbar = function(){
		this._total = this.parent.getDuration() / this.zoom / this.parent.TIME_SCALE
		this._page = 1
		if (this._total > this._page - 0.1){
			var offset = clamp(this._value, 0, this._total - this._page)
			if (offset !== this._value) {
				this._value = offset
			}
			this.visible = true
		}
	}

})
