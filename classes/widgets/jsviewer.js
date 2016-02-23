/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class('$ui/textbox', function(require){

	var JSFormatter = require('$system/parse/jsformatter')
	var Parser = require('$system/parse/onejsparser')

	this.attributes = {
		// The code to display
		source: Config({type:String, value:""}),
		sourceset: null,
		// wrap the text
		wrap: Config({type:Boolean, value:false}),
		init_anim: Config({value:1.0, duration:1, motion:'outexpo'}),
		line_anim: Config({value:1.0, duration:0.25, motion:'outexpo'}),
	}
	this.tab_size = 1
	this.line_start = 0
	this.line_end = 0

	// lets go and move this fucker
	this.textpositionfn = function(pos, tag) {
		var p = pos
		var indent = floor((tag.y * -1.)/65536.) * tab_size
		var line = floor(tag.w/65536.)
		if(line >= line_start && line <= line_end){
			p.x  +=  2*indent*((line-line_start))*line_anim
		}
		p.x += - min(indent, init_anim*100.)
		return p
	}

	this.bgcolor = vec4(12/255, 33/255, 65/255, 1)

	this.readonly = true

	this.fontsize = 12
	this.subpixel = false

	var font = this.font = require('$resources/fonts/ubuntu_monospace_ascii_baked.glf')

	for(var key in JSFormatter.types){
		this[key] = String(JSFormatter.types[key])
	}

	this.init = function(){
		this.init_anim = .0
	}

	this.textstyle = function(style, pos, tag){

		var type = int(tag.z / 65536.)
		var sub = int(mod(tag.z / 256., 256.))
		var part = int(mod(tag.z, 256.))
		var unicode = int(tag.x)
		if(unicode == 10 || unicode == 32 || unicode == 9) discard
		if(tag.z <= 0.){
			var col = -tag.z

			style.fgcolor = vec4(
				floor(col/65536.)/255.,
				floor(mod(col/256.,256.))/255.,
				floor(mod(col,256.))/255.,
				1.
			)
		}
		else if(sub == _Paren || sub == _Brace || sub == _Bracket){
			if(sub == _Paren){
				style.fgcolor = "#cfffff"
			}
			else if(sub == _Bracket){
				style.fgcolor = "#ffcfff"
			}
			else{
				style.fgcolor = "#ffffcf"
			}
			if(type == _Function){
				style.fgcolor = "white"
			}
		}
		else if(sub == _Operator){
			style.fgcolor = "#ff9d00"
		}
		else if(type == _Id){
			style.fgcolor = "white"
			if(sub == _Color){
				style.fgcolor = "pink"
			}
		}
		else if(type == _Value){
			if(sub == _String){
				style.fgcolor = "#00cf7f"//#ff7fe1"//"#0f0"
			}
			else if(sub == _Boolean){
				if(part>0){
					style.fgcolor = "#0f0"
				}
				else{
					style.fgcolor = '#f00'
				}
			}
			else{
				style.fgcolor = "aero"
			}
		}
		else if(type == _Comment){
			style.fgcolor = "#777"
		}
		else if(type == _This){
			style.fgcolor = "#ff7fe1"
		}else if(type == _Function){
			style.fgcolor = "#ffdd00"
		}else if(type == _Property ){
			if(sub == _Object){
				style.fgcolor = '#afafaf'
			}
			else{
				style.fgcolor = 'white'//'#9fa3ff'*1.2
			}
		}else{
			style.fgcolor = "#ff9d00"
		}

		return style
		//if(type>7)mesh.outline = true
	}


	// extend the font shader
	this.typeface = function(){
		this.font = font

		for(var key in JSFormatter.types){
			this[key] = String(JSFormatter.types[key])
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
					if(p.x > s && p.x < 1.5 * s && mod(p.y, 1.5*s) > s) return '#443'
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

		this.update = function(){
			var view = this.view
			var textbuf = this.mesh = this.newText()

			textbuf.font = view.font
			var cycle = Date.now()
			var ast = view.sourceset? view.sourceset.ast: Parser.parse(view.source)

			textbuf.fontsize = view.fontsize
			textbuf.add_y = textbuf.line_height
			textbuf.align = 'left'
			textbuf.start_y = textbuf.line_height
			textbuf.boldness = 0.6
			view.tab_size = textbuf.font.glyphs[9].advance * textbuf.fontsize

			textbuf.clear()
			var node_id = 0
			if(view.wrap){
				var maxwidth = view.layout.width
				JSFormatter.walk(ast, textbuf, function(text, padding, l1, l2, l3, node){
					if(text === '\n'){
						this.last_is_newline = true
						return
					}
					if(text === '\t' && this.last_is_newline){
						text = '\n'
					}
					this.last_is_newline = false
					var start = text.charCodeAt(0)
					var combo
					if(l1 <= 0) combo = l1
					else combo = 65536 * (l1||0) + 256 * (l2||0) + (l3||0)
					if(start !== 32 && start !== 10 && start !== 9) node_id ++
					var indent = textbuf.font.glyphs[9].advance * textbuf.fontsize * (this.actual_indent+1)
					textbuf.addWithinWidth(text, maxwidth, indent, ((padding||0)+ this.actual_indent*65536)*-1, combo, node_id+65536*this.actual_line)
				})
			}
			else{
				// if we process a newline, we should wait for the next tab
				JSFormatter.walk(ast, textbuf, function(text, padding, l1, l2, l3, node){
					if(text === '\n'){
						this.last_is_newline = true
						return
					}
					if(text === '\t' && this.last_is_newline){
						text = '\n'
					}
					this.last_is_newline = false
					// ok if we are adding a \t, lets add it to the previous newline as a mode 4.
					var start = text.charCodeAt(0)
					//console.log(this.actual_line)
					if(start !== 32 && start !== 10 && start !== 9) node_id ++
					var combo
					if(l1 <= 0) combo = l1
					else combo = 65536 * (l1||0) + 256 * (l2||0) + (l3||0)
					textbuf.add(text, ((padding||0) + this.actual_indent*65536)*-1, combo, node_id+65536*this.actual_line)
				})
			}
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
