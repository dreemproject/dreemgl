/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/scrollbar', function () {
	// internal

	//TODO(aki): implement with view scrollbar and overflow instead.

	this.position = 'absolute'
	this.vertical = false
	this.visible = true

	this.attributes = {
		zoom: wire('this.parent.zoom'),
		scroll: wire('this.parent.scroll')
	}

	this.value = function(event){
		if (event.mark) return
		this.parent.scroll = vec2(this._value, 0)
	}

	this.layout = function(){
		this._layout.left = 0
		this._layout.height = 10
		this._layout.width = this.parent._layout.width
		this._layout.top = this.parent._layout.height - 10
	}

	this.scroll = function () {
		this.value = this.scroll[0]
		this.updateScrollbar()
	}

	// TODO(aki): hack to stopPropagation of multimove
	this.pointermultimove = function () {}

	// internal: show/hide and resize scrollbar
	this.updateScrollbar = function(){
		this._total = this.parent.getDuration() / this.zoom / this.parent.TIME_SCALE
		this._page = 1
		if (this._total > this._page - 0.2){
			var offset = clamp(this._value, 0, this._total - this._page)
			if (offset !== this._value) {
				this._value = offset
			}
			this.visible = true
		} else {
			// TODO: hide when full range
		}
	}

})
