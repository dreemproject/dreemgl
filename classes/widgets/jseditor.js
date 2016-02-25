/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class('./jsviewer', function(require, baseclass, $ui$, textbox, label){

	this.readonly = false

	var enumchange = this.enumchange

	this.init = function(){
	}

	this.format_options = {
		force_newlines_array:false,
		force_newlines_object:false
	}
	// process inserts with matching parens
	this.processInsert = function(lo, hi, text){
		var cdelta = 0
		if(this.error_state) return [text, 0]
		if(this.textbuf.charCodeAt(lo) === 9){
			cdelta += 1
		}
		if(text == '"'){
			if(this.textbuf.charCodeAt(lo) == 34) text = '', cdelta += 1
			else text +='"', cdelta -= 1
		}
		else if(text == "'"){
			if(this.textbuf.charCodeAt(lo) == 39) text = '', cdelta += 1
			else text +="'", cdelta -= 1
		}
		else if(text == ')'){
			if(this.textbuf.charCodeAt(lo) == 41) text = '', cdelta += 1
		}
		else if(text == ']'){
			if(this.textbuf.charCodeAt(lo) == 93) text = '', cdelta += 1
		}
		else if(text == '}'){
			// do a forward scan
			if(this.textbuf.charCodeAt(lo) === 10 && this.textbuf.charCodeAt(lo+1) === 9 && this.textbuf.charCodeAt(lo+2) == 125){
				text = '', cdelta = 0
			}
			else if(this.textbuf.charCodeAt(lo) == 125) text = '', cdelta += 1

		}
		else if(text == '('){
			cdelta -= 1
			text += ')'
		}
		else if(text == '['){
			cdelta -= 1
			text += ']'
		}
		else if(text == '{'){
			if(lo != hi){
				// do something special
			}
			cdelta -= 1
			text += '}'
		}
		else if(text == '\n'){ // autoindent code
			var i = hi
			var state = 0
			var indent = 0
			var split = 0
			while(this.textbuf.charCodeAt(i) !== 9 && i >= 0){
				i--
			}
			while(this.textbuf.charCodeAt(i) === 9){
				i--
				indent++
			}
			text += Array(indent + 1).join('\t')
		}
		return [text, cdelta]
	}

	// some patching up
	this.stripNextOnBackspace = function(pos){
		return false
		//ch = this.textbuf.charCodeAt(pos)
		//if(ch == 91 && this.textbuf.charCodeAt(pos+1) == 93) return true
		//if(ch == 123 && this.textbuf.charCodeAt(pos+1) == 125) return true
		//if(ch == 40 && this.textbuf.charCodeAt(pos+1) == 41) return true
		//return false
	}

	this.update_force = function(){
		this.change_timeout = undefined
		baseclass.cursorsChanged.call(this)
		this.redraw()
	}

	// the change event
	this.change_id = 0
	this.change_timeout = 0

	this.textChanged = function(){
		baseclass.textChanged.call(this, true)
		this.worker.postMessage({change_id:++this.change_id, format_options:this.format_options, source:this._value})
		if(this.change_timeout) return
		this.change_timeout = this.setTimeout(this.update_force, 30)
	}

	this.cursorsChanged = function(){
		if(!this.change_timeout){
			baseclass.cursorsChanged.call(this)

			if(this.format_dirty){
				this.change = "cursor"
				this.worker.postMessage({change_id:++this.change_id, format_options:this.format_options, source:this._value})
			}
		}
		//this.change_timeout = this.setTimeout(this.update_force, 30)
	}

	// we can skip tabs
	this.atMoveLeft = function(pos){
		if(this.textbuf.charCodeAt(pos) === 10) return pos - 1
		return pos
	}

	this.atMoveRight = function(pos){
		if(this.textbuf.charCodeAt(pos) === 9) return pos + 1
		return pos
	}

	// alright lets make a worker that parses and reserializes
	var worker = define.class('$system/rpc/worker', function(require){

		var Parser = require('$system/parse/onejsparser')
		var JSFormatter = require('$system/parse/jsformatter')

		this.onmessage = function(msg){
			// lets start a parse!
			try{
				var ast = Parser.parse(msg.source)
			}
			catch(e){
				this.postMessage({error:e.message, pos:e.pos})
				return
			}
			// ok now we need to reserialize from ast

			var buf = {
				out:vec4.array(msg.source.length + 100),
				charCodeAt: function(i){return this.out.array[i*4]},
				char_count:0,
				walk_id:0
			};

			// lets reserialize output
			var out = buf.out
			JSFormatter.walk(ast, buf, msg.format_options, function(text, padding, l1, l2, l3, node){
				if(text === '\n'){
					this.last_is_newline = true
					return
				}
				if(text === '\t' && this.last_is_newline){
					text = '\n'
				}
				this.last_is_newline = false

				out.ensureSize(out.length + text.length)
				var o = out.length
				var first = text.charCodeAt(0)
				if(first !== 32 && first !== 9 && first !== 10) buf.walk_id++
				for(var i = 0; i < text.length; i++){
					var v = o * 4 + i * 4
					out.array[v] = text.charCodeAt(i)
					out.array[v + 1] = ((padding||0) + this.actual_indent*65536)*-1
					if(l1 < 0) out.array[v + 2] = l1
					else out.array[v + 2] = 65536 * (l1||0) + 256 * (l2||0) + (l3||0)
					out.array[v + 3] = buf.walk_id + 65536*this.actual_line
				}
				out.length += text.length
				buf.char_count += text.length;
			})

			this.postMessage({length:buf.out.length, change_id: msg.change_id, array:buf.out.array}, [buf.out.array.buffer])
		}
	})

	this.oninit = function(prev){

		this.worker = prev && prev.worker || worker()
		// if we get source back yay
		this.worker.onmessage = function(msg){
			var mesh = this.shaders.typeface.mesh
			if(this.change_timeout){
				this.clearTimeout(this.change_timeout)
				this.update_force()
			}
			//return
			var err = this.find('error')
			if(msg.error){
				var rect = mesh.cursorRect(msg.pos)
				err.x = rect.x
				err.y = rect.y + rect.h + 4
				err.text = '^'+msg.error
				err.visible = true

				this.error_state = true
				return
			}
			else{
				this.error_state = false
				if(err._visible) err.visible = false
			}

			if(msg.change_id !== this.change_id) return // toss it, its too late.
			var dt = Date.now()
			var start = 0
			var data_new = msg.array
			var data_old = mesh.array
			var len_new = msg.length
			var len_old = mesh.length / 6
			for(;start < len_new && start < len_old; start++){
				var off_old = start * 10 * 6
				var off_new = start * 4

				if(data_new[off_new] !== data_old[off_old + 6]) break
				if(data_new[off_new+1] !== data_old[off_old + 7]) break
				//if(data_new[off_new+2] !== data_old[off_old + 8]) break
				//if(data_new[off_new+3] !== data_old[off_old + 9]) break
				// copy data over
				data_old[off_old + 7] = data_old[off_old + 17] = data_old[off_old + 27] =
				data_old[off_old + 37] = data_old[off_old + 47] = data_old[off_old + 57] = data_new[off_new+1]
				data_old[off_old + 8] = data_old[off_old + 18] = data_old[off_old + 28] =
				data_old[off_old + 38] = data_old[off_old + 48] = data_old[off_old + 58] = data_new[off_new+2]
				data_old[off_old + 9] = data_old[off_old + 19] = data_old[off_old + 29] =
				data_old[off_old + 39] = data_old[off_old + 49] = data_old[off_old + 59] = data_new[off_new+3]
			}
			var end_old = len_old - 1, end_new = len_new - 1
			for(;end_old > start && end_new > start; end_old--, end_new--){
				var off_old = end_old * 10 * 6
				var off_new = end_new * 4
				//console.log(start, end_old, data_new[off_new], data_old[off_old+6],data_new[off_new] !== data_old[off_old + 6])

				if(data_new[off_new] !== data_old[off_old + 6]) break
				if(data_new[off_new+1] !== data_old[off_old + 7]) break
				//if(data_new[off_new+2] !== data_old[off_old + 8]) break
				//if(data_new[off_new+3] !== data_old[off_old + 9]) break
				data_old[off_old + 7] = data_old[off_old + 17] = data_old[off_old + 27] =
				data_old[off_old + 37] = data_old[off_old + 47] = data_old[off_old + 57] = data_new[off_new+1]
				data_old[off_old + 8] = data_old[off_old + 18] = data_old[off_old + 28] =
				data_old[off_old + 38] = data_old[off_old + 48] = data_old[off_old + 58] = data_new[off_new+2]
				data_old[off_old + 9] = data_old[off_old + 19] = data_old[off_old + 29] =
				data_old[off_old + 39] = data_old[off_old + 49] = data_old[off_old + 59] = data_new[off_new+3]
			}
			//mesh.clean = false
			var cursor_now = this.cursorset.list[0].start

			var new_range = end_new - start
			var old_range = end_old - start

			if(old_range < new_range && this.change === 'delete') return this.format_dirty = true
			if(old_range > new_range && this.change === 'keypress') return this.format_dirty = true

			// do the cursor move magic
			var deleted_whitespace = true
			if(this.change === 'delete'){
				var undo_data = this.undo_stack[this.undo_stack.length - 1].data
				if(undo_data) for(var i = 0; i < undo_data.length; i++){
					var char = undo_data.array[i*4]
					if(char !== 32 && char !== 9 && char !== 10) deleted_whitespace = false
				}
			}

			// dont autoreformat immediately when deleting characters, only with whitespace
			if(new_range < old_range && this.change === 'delete' && start < cursor_now && !deleted_whitespace) return  this.format_dirty = true

			if(this.change === 'undoredo')return this.format_dirty = true
			// if we insert a newline or do a delete use the marker

			if(new_range !== old_range){
				if(this.change === 'keypress' && this.change_keypress === '\n'|| this.change === 'delete' && deleted_whitespace){
					// use the tag
					var nextto = mesh.tagAt(cursor_now,3)

					for(var t = start; t < len_new; t++){
						if(nextto == data_new[t*4+3]){
							cursor_now = t//this.cursorset.list[0].moveToOffset(t)
							break
						}
					}
				}
				else if(this.change === 'delete'){
					//console.log("BE HERE")
					//this.cursorset.list[0].moveToOffset(cursor_now - 1)
				}
				else if(this.change === 'keypress'){
					// stick to the character
					var char_at = data_new[cursor_now*4]
					//if(char_at === 9){ // we are typing in a tab
					//	this.cursorset.list[0].moveToOffset(end_new+1)
					//}
					//else
					if(char_at !== 44){
						var nextto = mesh.tagAt(cursor_now - 1,0)
						var fd = 0
						for(var t = cursor_now - 1; t < len_new; t++){
							if(nextto == data_new[t*4+0]){
								fd = 1
							}
							else if(fd){	// move the cursor
								cursor_now = t//this.cursorset.list[0].moveToOffset(t)
								break
							}
						}
					}
				}
				this.cursorset.update()
				// create the undo entry
				if(new_range){
					this.undo_group--
					this.addUndoInsert(start, end_old+1)
					this.addUndoDelete(start, end_new+1)
					this.undo_group++
				}
			}
			else{
				this.cursorset.update()
			}

			// this replaces the textbuffer
			mesh.setLength(start)
			var buf = {struct:1, start:start, array:data_new, length:len_new}
			mesh.add(buf)

			// lets figure out the linenumbers between start and end_new
			if(new_range > old_range){
				var min = Infinity, max = -Infinity
				for(var i = start; i < end_new; i++){
					var line = Math.floor(data_new[i*4+3]/65536)
					if(line<min)min = line
					if(line>max)max = line
				}
			}
			this.line_start = min
			this.line_end = max
			this._line_anim = 1.0
			this.line_anim = 0.
			this.cursorset.list[0].moveToOffset(cursor_now)
			//var rect = mesh.cursorRect(start)
			//err.x = rect.x
			//err.y = rect.y + rect.h + 4
			//err.text = 'WOOPWOOP'
			//err.visible = true
			//console.log(mesh.tagAt(start, 0))
			//console.log(mesh.tagAt(start, 1), data_new[start*4+1])

			this.format_dirty = false
			mesh.clean = false
			this.redraw()

		}.bind(this)
	}

	this.render = function(){
		return label({position:'absolute',name:'error',bgcolor:'red',fgcolor:'white',borderradius:1, visible:false})
	}

	// Basic usage
	var jseditor = this.constructor

	this.constructor.examples = {
		Usage: function(){
			return [jseditor({bgcolor:"#000040", padding:vec4(14), source: "console.log(\"Hello world!\");"})]
		}
	}
})
