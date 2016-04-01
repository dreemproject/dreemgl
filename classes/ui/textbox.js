/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class("$ui/label", function(require){
// Text input field
// <br/><a href="/examples/text">examples &raquo;</a>

	this.mixin(require('$system/textbox/textboximpl'))

	this.attributes = {
		// the color of the cursor
		cursorcolor: Config({type:vec4, value: vec4(NaN), meta:"color"}),
		// color of the marker
		markerfocus: Config({type:vec4, value: vec4("oceanboatblue"), meta:"color"}),
		markerunfocus: Config({type:vec4, value: vec4("gray"), meta:"color"}),
		value: Config({type:String, value:""}),
		readonly:false,
		focusselect:true,
		multiline:true,
		cursorrect:vec4(),
		cursorscrollindent:30
	}

	this.bgcolor = "transparent";
	this.pickalpha = -1;
	this.markercolor = this.markerunfocus

	this.oncursorrect = function(ev,v,o) {
		if (this._overflow !== "hidden") {
			return
		}

		var px = v[0] - this.scroll[0]
		var past = px - this.width
		if (past > 0) {
			setTimeout(function(){
				o.scroll = vec2(o.scroll[0] + past + o.cursorscrollindent, o.scroll[1])
				o.redraw()
			},0)
		} else if (px < 0) {
			setTimeout(function(){
				o.scroll = vec2(Math.max(0, o.scroll[0] + px - o.cursorscrollindent), o.scroll[1])
				o.redraw()
			},0)
		}


	}

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
				var end = cursor.end
				var texbuf = view.textbuf
				var pos = texbuf.cursorRect(end)
				view.cursorrect = vec4(pos.x, pos.y, pos.w, pos.h)
				this.mesh.addCursor(texbuf, end)
			}
		}
	})
	this.cursors = true
	this.tabstop = 0
	this.linespacing = 1.3
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
	this.markers = true
	this.measure_with_cursor = true

	this.focus = function(){
		if(!this.shaders || !this.shaders.cursors) return
		if(this._focus){
			this.shaders.cursors.visible = this.readonly? false: true
			this.markercolor = this.markerfocus
		}
		else if (this.shaders) {
			this.shaders.cursors.visible = this.readonly? true: false
			this.markercolor = this.markerunfocus
		}
		this.redraw()
	}

	Object.defineProperty(this, 'textbuf', {
		get:function(){
			return this.shaders.typeface.mesh
		}
	})

	this.textChanged = function(noredraw){

		var string = this.textbuf.serializeText(0, this.textbuf.lengthQuad())
		if (!this.multiline && (string.indexOf('\n') >= 0 || string.indexOf('\r') >= 0)) {
			string = string.replace(/(\r\n|\n|\r)/gm,"");
			this.textbuf.removeText(0, this.textbuf.lengthQuad());
			this.textbuf.insertText(0, string);
			this.focus = false;
		}
		this.value = Mark(string)
		// this causes a redraw
		if(!noredraw) this.relayout()
	}

	this.value = function(event){
		if(event.mark) return
		this.text = this.value
		this.relayout()
		this.redraw()
	}

	this.cursorsChanged = function(noreupdate){
		this.shaders.cursors.reupdate()
		this.shaders.markers.reupdate()
	}

	this.init = function(){
		this.shaders.cursors.visible = false
		if(isNaN(this._cursorcolor[0])) this._cursorcolor = this.fgcolor
		this.initEditImpl()
		this.text = this.value
	}

	var textbox = this.constructor;
	// Basic usage of the treeview control.
	this.constructor.examples = {
		Usage:function(){
			return [
				textbox({alignself:'flex-start', value:"Text can be input here", fgcolor:'#333', borderwidth:1, bordercolor:'black', padding:5}),
				textbox({
					borderwidth:1,
					paddingleft:10,
					bordercolor:"white",
					bgimage:"$resources/textures/purplecloud.png",
					bgimagemode:"stretch",
					value:"Text field w/bgimage"
				})
			]
		}
	}

})
