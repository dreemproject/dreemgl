/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $controls$, label){

	var CodeFormatter = require('$system/font/codeformatter')	
	var Parser = require('$system/parse/onejsparser')

	this.attributes = {
		// The code to display
		source: {type:String, value:""},
		// wrap the text
		wrap: {type:Boolean, value:false}
	}

	this.bgcolor = vec4(12/255,33/255,65/255,1)
	this.bg = 1
	this.fontsize = 14
	this.subpixel = true

	// extend the font shader
	this.font = function(){
		for(var key in CodeFormatter.types){
			this[key] = String(CodeFormatter.types[key])
		}

		this.paint = function(p, edge, pixelsize){
			//var edge = min(length(dpx))
			//dump = edge
			var unicode = int(mesh.tag.x)
			var selected = mesh.tag.w

			if(unicode == 10){
				return vec4(0)
			}

			if(unicode == 32){
				if(selected < 0.){
					var w = .3
					var h = .13
					var field = shape.box(p, .5 - .5 * w, .5 - .5 * h, w, h)
					return vec4("#AF8F7E".rgb, smoothstep(.75 * edge, -.75 * edge, field))
				}
				return vec4(0)
			}

			if(unicode == 9){ // the screen aligned tab dots
				//return 'darkblue'
				// make a nice tab line
				//var out = vec4(0)
				//dump = edge
				//if(pixelsize < 0.5){//edge > 0.1){ // pixel drawing
					//if(mod(gl_FragCoord.x, 24*6.) < 1.) return '#445'
					var s = pixelsize * 130.
					if(p.x > s && p.x < 3 * s && mod(p.y, 3.*s) > s) return '#443'
					//if(p.x > dpdx.x && p.x <= 3*dpdx.x && mod(p.y, 2.*dpdy.y) > dpdy.y) return '#445'
				//}
				//else { // switch to vector drawing
				//	var w = 1
				//	var h = 1
				//	var field = shape.box(mod(p, vec2(24*6, 3.)), .5 * w, 0, w, h)
				//	var col = vec4("#667".rgb, smoothstep(edge, -edge, field))
				//	if(col.a > 0.01) return col
				//}

				if(selected < 0.){
					//if(edge > 0.02){
					//	if(p.x > 3. * dpdx.x && p.y >= .5 - .5 * dpdy.y && p.y <= .5 + .5 * dpdy.y)
					//		return vec4("#AF8F7E".rgb,1.)
					//	return vec4(0)
					//}
					var sz = .01
					var field = shape.line(p, 0., .5-sz, 1., .5-sz, 2.*sz)
					return vec4("#AF8F7E".rgb, smoothstep(edge,-edge,field))
				}
				return vec4(0)
			}
			return vec4(-1.)
		}

		this.style = function(pos){

			var group = mesh.tag.y
			var type = int(mesh.tag.z / 65536.)
			var sub = int(mod(mesh.tag.z / 256., 256.))
			var part = int(mod(mesh.tag.z, 256.))
			var unicode = int(mesh.tag.x)
			
			if(unicode == 10 || unicode == 32 || unicode == 9) discard
			if(sub == _Paren || sub == _Brace || sub == _Bracket){
				if(sub == _Paren){
					view.fgcolor = "white"
				}
				else if(sub == _Bracket){
					view.fgcolor = "#ccc"
				}
				else{
					view.fgcolor = "white"
				}
			}
			else if(sub == _Operator){
				view.fgcolor = "#ff9d00"
			}
			else if(type == _Id){
				view.fgcolor = "white"
				if(sub == _Color){
					view.fgcolor = "pink"
				}
			}
			else if(type == _Value){
				if(sub == _String)
					view.fgcolor = "#0f0"
				else
					view.fgcolor = "aero"
			}
			else if(type == _Comment){
				view.fgcolor = "#777"
			}
			else if(type == _This){
				view.fgcolor = "#ff7fe1"
			}else{
				view.fgcolor = "#ff9d00"
			}
			//if(type>7)mesh.outline = true
		}

		this.update = function(){
			var view = this.view
			var maxwidth = view.layout.width
			var textbuf = this.mesh = this.newText()
			var ast = Parser.parse(view.source)

			textbuf.fontsize = view.fontsize
			textbuf.add_y = textbuf.line_height
			textbuf.align = 'left'
			textbuf.start_y = textbuf.line_height
			textbuf.boldness = 0.6

			textbuf.clear()

			if(view.wrap){
				CodeFormatter.walk(ast, textbuf, function(text, group, l1, l2, l3, m3){
					var indent = textbuf.typeface.glyphs[9].advance * textbuf.fontsize * (this.indent)
					textbuf.addWithinWidth(text, maxwidth, indent, group, 65536 * (l1||0) + 256 * (l2||0) + (l3||0), m3)
				})
			}
			else{
				CodeFormatter.walk(ast, textbuf, function(text, group, l1, l2, l3, m3){
					textbuf.add(text, group, 65536 * (l1||0) + 256 * (l2||0) + (l3||0), m3)
				})
			}
		}
	}

	// Basic usage
	var codeviewer = this.constructor

	this.constructor.examples = {
		Usage: function(){
			return [codeviewer({bgcolor:"#000040", padding:vec4(14), source: "console.log(\"Hello world!\");"})]
		}
	}
})