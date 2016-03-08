/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/
"use strict"
define.class('$base/node', function(require){
	this.Shader = require('$system/platform/$platform/shader$platform')

	var view = require('$base/view')
	var Canvas = require('$base/canvas')
	// use the drawing canvas from view

	this.Canvas = Canvas.prototype
	this.compileCanvasVerbs = Canvas.compileCanvasVerbs
	this.atInnerClassAssign = view.prototype.atInnerClassAssign

	Object.defineProperty(this, 'canvasverbs',{
		set:function(verbs){
			if(this._canvasverbs) this._canvasverbs = Object.create(this._canvasverbs)
			else this._canvasverbs = {}
			for(var key in verbs) this._canvasverbs[key] = verbs[key]
		}
	})

	// the draw api
	define.class(this, 'rect', '$shaders/rectshader')

	this.attributes = {
		// fires when pointer is pressed down.
		pointerstart:Config({type:Event}),
		// fires when pointer is pressed and moved (dragged).
		pointermove:Config({type:Event}),
		// fires when pointer is released.
		pointerend:Config({type:Event}),
		// fires when pointer is pressed and released quickly.
		pointertap:Config({type:Event}),
		// fires when pointer moved without being pressed.
		pointerhover:Config({type:Event}),
		// fires when pointer enters an element.
		pointerover:Config({type:Event}),
		// fires when pointer leaves an element.
		pointerout:Config({type:Event}),
		// fires when mouse wheel is used.
		pointerwheel:Config({type:Event}),

		// fires when a key goes to up. The event argument is {repeat:int, code:int, name:String}
		keyup: Config({type:Event}),
		// fires when a key goes to down. The event argument is {repeat:int, code:int, name:String}
		keydown: Config({type:Event}),
		// fires when a key gets pressed. The event argument is {repeat:int, value:string, char:int}
		keypress: Config({type:Event}),
		// fires when someone pastes data into the view. The event argument is {text:string}
		keypaste: Config({type:Event}),

	}

	this.redraw = function(){
		this.canvas.view.redraw()
	}

})
