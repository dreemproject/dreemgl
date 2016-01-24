/* Copyright 2015-2016 Teem. Licensed under the Apache License, Version 2.0 (the "License"); Dreem is a collaboration between Teem & Samsung Electronics, sponsored by Samsung. 
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class('./jsviewer', function(require, $ui$, textbox){

	this.readonly = false
	
	var enumchange = this.enumchange

	// process inserts with matching parens
	this.processInsert = function(lo, hi, text){
		var cdelta = 0
		if(text == '"'){
			if(this.textbuf.charCodeAt(lo) == 34) text = '', cdelta = 1
			else text +='"', cdelta=-1
		}
		else if(text == "'"){
			if(this.textbuf.charCodeAt(lo) == 39) text = '', cdelta = 1
			else text +="'", cdelta=-1
		}
		else if(text == ')'){
			if(this.textbuf.charCodeAt(lo) == 41) text = '', cdelta = 1
		}
		else if(text == ']'){
			if(this.textbuf.charCodeAt(lo) == 93) text = '', cdelta = 1
		}
		else if(text == '}'){
			if(this.textbuf.charCodeAt(lo) == 125) text = '', cdelta = 1
		}
		else if(text == '('){
			cdelta = -1
			text += ')'
		}
		else if(text == '['){
			cdelta = -1
			text += ']'
		}
		else if(text == '{'){
			if(lo != hi){
				// do something special
			}
			cdelta = -1
			text += '}'
		}
		else if(text == '\n'){ // autoindent code
			var i = hi
			var state = 0
			var indent = 0
			var split = 0
			while(this.textbuf.charCodeAt(i) == 9){
				i++
				indent--
			}
			if(this.textbuf.charCodeAt(i) == 125 && this.textbuf.charCodeAt(i-1) == 123){
				i++, split = 1
			}
			while(i<this.textbuf.char_count){
				var code = this.textbuf.charCodeAt(i)
				if(state == 0 && code == 123) indent--
				if(state == 1){
					if(code == 9 || code == 125) indent++
					else break
				}
				if(code == 10) state = 1
				i++
			}
			if(indent>0){
				if(split){
					text += Array(indent+2).join('\t') + '\n' + Array(indent+1).join('\t')
					cdelta = -1 - indent
				}
				else{
					text += Array(indent+1).join('\t')
				}
			}
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
	this.textChanged = function(){
		this.was_cursor = false
		if(this.change == enumchange.keypress || this.change == enumchange.delete || this.change == enumchange.clipboard){
			this.was_delete = this.change == enumchange.delete
			this.was_cursor = this.change == enumchange.clipboard // dont delay reformat on paste

			this.delay_update = 0
			if(this.step_timeout) this.clearTimeout(this.step_timeout)
			this.step_timeout = this.setTimeout(this.parseStep,0)
		}
		// if its an undo, 
		if(change == enumchange.undoredo){ // set delay to cursor press
			delay_update = parseStep
		}
	}

	this.oncursor = function(){
		if(this.delay_update){
			this.was_cursor = true
			this.was_delete = false
			this.delay_update()
			this.delay_update = 0
		}
	}

	this.parseStep = function(){
		var dt = Date.now()
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

	// Basic usage
	var jseditor = this.constructor

	this.constructor.examples = {
		Usage: function(){
			return [jseditor({bgcolor:"#000040", padding:vec4(14), source: "console.log(\"Hello world!\");"})]
		}
	}
})