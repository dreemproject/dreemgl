/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others. 
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class('./jsviewer', function(require, baseclass, $ui$, textbox, label){

	this.readonly = false
	
	var enumchange = this.enumchange

	this.init = function(){
	}

	// process inserts with matching parens
	this.processInsert = function(lo, hi, text){
		var cdelta = 0
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
			if(this.textbuf.charCodeAt(lo) == 125) text = '', cdelta += 1
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
		ch = this.textbuf.charCodeAt(pos)
		if(ch == 91 && this.textbuf.charCodeAt(pos+1) == 93) return true
		if(ch == 123 && this.textbuf.charCodeAt(pos+1) == 125) return true
		if(ch == 40 && this.textbuf.charCodeAt(pos+1) == 41) return true
		return false
	}
	
	// the change event
	this.change_id = 0
	this.textChanged = function(){
		baseclass.textChanged.call(this)
		this.worker.postMessage({change_id:++this.change_id, source:this._value})
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
			JSFormatter.walk(ast, buf, function(str, group, l1, l2, l3, node){
				out.ensureSize(out.length + str.length)
				var o = out.length
				var first = str.charCodeAt(0)
				if(first !== 32 && first !== 9 && first !== 10) buf.walk_id++
				for(var i = 0; i < str.length; i++){
					var v = o * 4 + i * 4
					out.array[v] = str.charCodeAt(i)
					out.array[v + 1] = group
					out.array[v + 2] = 65536 * (l1||0) + 256 * (l2||0) + (l3||0)
					out.array[v + 3] = buf.walk_id
				}
				out.length += str.length
				buf.char_count += str.length;
			})

			this.postMessage({length:buf.out.length, change_id: msg.change_id, array:buf.out.array}, [buf.out.array.buffer])
		}
	})

	this.oninit = function(prev){
		this.worker = prev && prev.worker || worker()
		// if we get source back yay
		this.worker.onmessage = function(msg){
			var mesh = this.shaders.typeface.mesh

			var err = this.find('error') 
			if(msg.error){
				rect = mesh.cursorRect(msg.pos)
				err.x = rect.x
				err.y = rect.y + rect.h + 4
				err.text = '^'+msg.error
				err.visible = true
				return
			}
			else{
				err.visible = false
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
				if(data_new[off_new] !== data_old[off_old + 6]) break
			}
			
			var new_range = end_new - start
			var old_range = end_old - start 

			if(old_range < new_range && this.change === 'delete') return
			if(old_range > new_range && this.change === 'keypress') return

			// do the cursor move magic
			var deleted_whitespace = true
			if(this.change === 'delete'){
				var undo_data = this.undo_stack[this.undo_stack.length - 1].data
				for(var i = 0; i < undo_data.length; i++){
					var char = undo_data.array[i*4]
					if(char !== 32 && char !== 9 && char !== 10) deleted_whitespace = false
				}
			}
			var cursor_now = this.cursorset.list[0].start

			// if we insert a newline or do a delete use the marker
			if(new_range !== old_range){
				if(this.change === 'keypress' && this.change_keypress === '\n'|| this.change === 'delete' && deleted_whitespace){
					// use the tag
					var nextto = mesh.tagAt(cursor_now,3) 

					for(var t = start; t < len_new; t++){
						if(nextto == data_new[t*4+3]){
							this.cursorset.list[0].moveToOffset(t)
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
								this.cursorset.list[0].moveToOffset(t)
								break
							}
						}
					}
				}
				this.cursorset.update()
				// create the undo entry
				if(new_range){
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

			mesh.clean = false
			this.redraw()

		}.bind(this)
	}

	this.render = function(){
		return label({position:'absolute',name:'error',bgcolor:'darkred',fgcolor:'white',borderradius:1, visible:false})
	}
/*
	this.parseStep = function(){
		var dt = Date.now()
		// lets serialize thi
		this.step_serialized = layer.serializeText()
		// okay.. so we parse it, we get an error. now what.
		var dump = step_serialized.replace(/[\s\r\n]/g,function(f){
			return '\\'+f.charCodeAt(0)
		})
		step_ast = parseLive(step_serialized)
		//console.log(AST.toDump(step_ast))
		//console.log('----parseStep! '+(Date.now()-dt))
		step_timeout = thisTimeout(astgenStep,0)
	}

	this.astgenStep = function(){
		var dt = Date.now()
		code_formatter.setSize(step_serialized.length)
		code_formatter.clear()
		code_formatter.ast = step_ast
		//console.log(code_formatter.serializeText())
		//console.log('astgenStep! '+(Date.now()-dt))
		step_timeout = thisTimeout(diffStep,0)
	}

	this.diffStep = function(){
		var dt = Date.now()
		// lets diff our code_formatter.output
		// against our textbuffer, whilst updating colors
		// and then we remove/insert the delta.
		// ok lets first try to do it wholesale
		var range = layer.diffTags(code_formatter.output)
		if(range){ // remove a range, and insert a range
			var delta = 0
			// if what we do is essentially undo the last action, dont do it
			var last = undo_stack[undo_stack.length-1]
			
			// lets check if we inserted a space, and now its being removed
			function next(){
				// first we remove
				var rem_delta =  0
				if(range.my_start<=range.my_end){
					rem_delta += range.my_end + 1 - range.my_start
				}
				var add_delta = 0
				if(range.other_start <= range.other_end){
					add_delta += range.other_end + 1 - range.other_start
				}
				var delta = add_delta - rem_delta
				// if we are input driven, we only accept positive add
				if(was_cursor || delta == 0 || !was_delete && delta > 0){
					undo_group++
					cursors.markDelta()
					if(rem_delta){
						addUndoInsert(range.my_start, range.my_end+1)
						layer.removeText(range.my_start, range.my_end+1)
						// lets fetch what we are removing
					}
					if(add_delta){
						var inslice = code_formatter.output.slice(range.other_start, range.other_end+1)

						// lets see what we are inserting
						layer.insertText(range.my_start, inslice)
						addUndoDelete(range.my_start, range.my_start + inslice.length)
					}
					cursors.moveDelta(range.my_start, add_delta - rem_delta)
				}
				else if(!was_cursor){
					delay_update = next
				}
			}
			next()
		}
		//console.log(range)
		//console.log('diffStep! '+(Date.now()-dt))
		step_timeout  = thisTimeout(applyStep,0)
	}
	*/
	// Basic usage
	var jseditor = this.constructor

	this.constructor.examples = {
		Usage: function(){
			return [jseditor({bgcolor:"#000040", padding:vec4(14), source: "console.log(\"Hello world!\");"})]
		}
	}
})