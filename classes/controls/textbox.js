/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, $controls$, label){	

	this.mixin(require('$system/edit/editimpl'))

	this.attributes = {
		// the color of the cursor
		cursorcolor: vec4("white"),
		// color of the marker
		markercolor: vec4("ocean")
	}
	
	define.class(this, 'cursors', require('$system/font/cursorshader.js'), function(){
		this.updateorder = 5
		this.update = function(){
			var view = this.view
			this.mesh.length = 0
			if(view.cursors.fusing) view.cursors.fuse()
			for(var list = view.cursorset.list, i = 0; i < list.length; i++){
				var cursor = list[i]
				this.mesh.addCursor(view.textbuf, cursor.end)
			}
		}
	})
	this.cursors = 6

	define.class(this, 'markers', require('$system/font/markershader.js'), function(){
		this.updateorder = 6
		this.update = function(){
			var view = this.view
			this.mesh.length = 0

			if(view.cursorset.fusing) view.cursorset.fuse()
			for(var list = view.cursorset.list, i = 0; i < list.length; i++){
				var cursor = list[i]
				
				var start = cursor.start, end = cursor.end
				var markers = this.markergeom.getMarkersFromText(view.textbuf, start, end, 0)
				// lets add all markers
				for(var i = 0; i < markers.length;i++){
					this.mesh.addMarker(markers[i-1], markers[i], markers[i+1], view.textbuf.fontsize, 0)
				}

			}
		}
	})
	this.markers = 3


	Object.defineProperty(this, 'textbuf', {
		get:function(){
			return this.fontshader.mesh
		}
	})

	this.textChanged = function(){
		this.relayout()
	}

	this.cursorsChanged = function(){
		this.cursorsshader.reupdate()
		this.markersshader.reupdate()
	}

	this.init = function(){
		this.initEditImpl()
		this.value = this.text
	}
})