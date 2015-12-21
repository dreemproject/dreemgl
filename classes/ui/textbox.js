/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, $ui$, label){	

	this.mixin(require('$system/textbox/textboximpl'))

	this.attributes = {
		// the color of the cursor
		cursorcolor: Config({type:vec4, value: vec4(NaN), meta:"color"}),
		// color of the marker
		markerfocus: Config({type:vec4, value: vec4("ocean"), meta:"color"}),
		markerunfocus: Config({type:vec4, value: vec4("gray"), meta:"color"}),
		value: Config({type:String, value:""}),
		readonly:false
	}

	this.markercolor = this.markerunfocus
	
	define.class(this, 'cursors', require('$system/typeface/cursorshader.js'), function(){
		this.updateorder = 5
		this.draworder = 6
		this.atConstructor = function(){
			this.mesh = this.vertexstruct.array()
		}
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

	this.tabstop = 0
	
	define.class(this, 'markers', require('$system/typeface/markershader.js'), function(){
		this.updateorder = 6
		this.draworder = 4
		this.atConstructor = function(){
			this.mesh = this.vertexstruct.array()
		}
		this.update = function(){
			var view = this.view
			this.mesh.length = 0

			if(view.cursorset.fusing) view.cursorset.fuse()
			for(var list = view.cursorset.list, i = 0; i < list.length; i++){
				var cursor = list[i]
				
				var start = cursor.start, end = cursor.end
				if(start !== end){
					var markers = this.vertexstruct.getMarkersFromText(view.textbuf, start, end, 0)

					// lets add all markers
					for(var i = 0; i < markers.length;i++){
						this.mesh.addMarker(markers[i-1], markers[i], markers[i+1], view.textbuf.fontsize, 0)
					}
				}
			}
		}
	})
	this.measure_with_cursor = true
	
	this.focus = function(){
		if(this._focus){
			this.cursorsshader.visible = this.readonly?false:true
			this.markercolor = this.markerfocus
		}
		else{
			this.cursorsshader.visible = this.readonly?false:true
			this.markercolor = this.markerunfocus
		}
		this.redraw()
	}

	Object.defineProperty(this, 'textbuf', {
		get:function(){
			return this.typefaceshader.mesh
		}
	})

	this.textChanged = function(){
		this.relayout()
	}
	
	this.value = function(){
		this.text = this.value
		this.relayout();
		this.redraw();
	}

	this.cursorsChanged = function(){
		this.cursorsshader.reupdate()
		this.markersshader.reupdate()
	}

	this.init = function(){
		this.cursorsshader.visible = false
		if(isNaN(this._cursorcolor[0])) this._cursorcolor = this.fgcolor
		this.initEditImpl()
		this.text = this.value
	}
})