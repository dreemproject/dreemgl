/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others. 
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class('$ui/label', function(require){

	this.attributes = {
		cursorcol: 1,
		cursorrow: 0,
		cursorchar:0,
		tracks:[]
	}

	this.bgcolor = vec4("#dad6c9")
	this.readonly = false
	this.fontsize = 12
	this.subpixel = true

	var font = this.font = require('$resources/fonts/ubuntu_monospace_ascii.glf')

	this.oninit = function(){
		// store the line positions from the textgenerator
		//this.linepositions = []
		// lets build our track datastructure
		this.tracks = []
		for(var col = 0; col < 8; col++){
			var track = []
			this.tracks.push(track)
			for(var row = 0; row < 512; row++){
				track.push(col)
			}
		}
	}

	this.textstyle = function(style, tag){
		//if(type>7)mesh.outline = true
		if (tag.y == this.cursorrow) {
			style.fgcolor ='white'
		}else
		if(mod(tag.y,4.)<1.){
			style.fgcolor = '#9f9373'
		}
		else{
			style.fgcolor = '#303030'
		}
	}

	// extend the font shader
	this.typeface = function(){
		this.font = font

		this.paint = function(p, edge, pixelsize){
			return vec4(-1.)
		}

		// lets generate a memory track into a trackview
		this.update = function(){

			var view = this.view
			view.linepositions = []
			var textbuf = this.mesh = this.newText()

			textbuf.font = view.font

			textbuf.fontsize = view.fontsize
			textbuf.add_y = textbuf.line_height
			textbuf.align = 'left'
			textbuf.start_y = textbuf.line_height
			textbuf.boldness = 0.2

			textbuf.clear()

			var tracklen = view.tracks.length
			var rowlen = view.tracks[0].length
			var dt = Date.now()
			for(var row = 0; row < rowlen; row++){
				for(var col = 0; col < tracklen; col++){

					var num = view.tracks[col][row]
					textbuf.add(("0000"+num).slice(-4), row, col,0)
					
					textbuf.add_x += view.fontsize*2
				}
				textbuf.add("\n", row, 8, 0)
			}
			console.log(Date.now()-dt)
			view.total_rows = row
		}
	}

	this.tabstop = 0

	// background lines
	define.class(this, 'bgline', this.Shader, function(){
		this.update = function(){

		}
	})

	define.class(this, 'cursorbar_row', this.Shader, function(){
		this.updateorder = 8
		this.draworder = 2
		this.mesh = vec2.array()

		this.atConstructor = function(){
		}

		this.color = function(){
			return '#252936'
		}

		this.position = function(){
			return mesh.xy * view.totalmatrix * view.viewmatrix
		}

		this.update = function(){
			var view = this.view
			this.mesh = vec2.array()
			this.mesh.length = 0
			var textbuf = view.shaders.typeface.mesh
			// ok lets find the geometry position of the current cursor
			// lets get the current line and find it
			var off = textbuf.offsetFromTag(0, view.cursorrow, 0)
			if(off !== -1){
				var rect = textbuf.cursorRect(off)
				this.mesh.pushQuad(
					0,rect.y,
					view.layout.width, rect.y,
					0,rect.y+rect.h,
					view.layout.width, rect.y + rect.h
				)
			}
		}
	})
	this.cursorbar_row = true

	define.class(this, 'cursorbar_col', this.Shader, function(){
		this.updateorder = 8
		this.draworder = 4
		this.mesh = vec2.array()

		this.atConstructor = function(){
		}

		this.color = function(){
			return 'ocean'*2.
		}

		this.position = function(){
			return mesh.xy * view.totalmatrix * view.viewmatrix
		}

		this.update = function(){
			var view = this.view
			this.mesh = vec2.array()
			this.mesh.length = 0
			var textbuf = view.shaders.typeface.mesh
			// ok lets find the geometry position of the current cursor
			// lets get the current line and find it
			var off = textbuf.offsetFromTag(0, view.cursorrow, 0)
			off = textbuf.offsetFromTag(1, view.cursorcol, off)
			off += view.cursorchar

			// store the final offset for editing
			this.cursor_final_offset = off
			if(off !== -1){
				var rect = textbuf.cursorRect(off)
				this.mesh.pushQuad(
					rect.x,rect.y,
					rect.x+rect.w, rect.y,
					rect.x,rect.y+rect.h,
					rect.x+rect.w, rect.y + rect.h
				)
			}
		}
	})
	this.cursorbar_col = true

	this.keydown = function(e){
		if(e.name.indexOf('num') === 0){
			var numpressed = parseInt(e.name.charAt(3))
			// lets plug it into our track!
			//var num = this.tracks[this.cursorcol][this.cursorrow]
			num = numpressed * Math.pow(10, 3-this.cursorchar)
			this.tracks[this.cursorcol][this.cursorrow] = num
			this.tracks = this.tracks
		}
		else this.defaultKeyboardHandler(e)
		//console.log(e)
	}

	this.keydownDownarrow = function(){
		if(this.cursorrow < this.total_rows-1)
			this.cursorrow ++
	}

	this.keydownUparrow = function(){
		if(this.cursorrow > 0)
			this.cursorrow --
	}

	this.keydownRightarrow = function(){
		if(++this.cursorchar>=4){
			this.cursorchar = 0
			this.cursorcol ++
		}
	}

	this.keydownLeftarrow = function(){
		if(--this.cursorchar<0){
			this.cursorchar = 3
			this.cursorcol --
		}
	}

	// Basic usage
	var jsviewer = this.constructor

	this.constructor.examples = {
		Usage: function(){
			return [jsviewer({bgcolor:"#000040", padding:vec4(14), source: "console.log(\"Hello world!\");"})]
		}
	}
})