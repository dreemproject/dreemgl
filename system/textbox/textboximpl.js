/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.mixin(function(require){

	var CursorSet = require('./cursorset')
	var Cursor = require('./singlecursor')
	var parse = new (require('$system/parse/onejsparser'))()

	// change sources
	var enumchange = this.enumchange = {
		keypress:1,
		delete:2,
		clipboard:3,
		undoredo:4
	}

	this.change = 0

	this.doCursor = function(){
		var cursor0 = this.cursorset.list[0]
		if(this.cursorset.list.length === 1 && cursor0.start === cursor0.end){
			this.screen.keyboard.clipboard = ''
		}
		var coord = this.textbuf.charCoords(max(cursor0.start - 1,0))
		var v2 = vec2.mul_mat4(vec2(coord.x - 0.5*coord.w, coord.y - 0.5 *coord.h), this.totalmatrix)
		this.screen.keyboard.pointerMove(vec2(floor(v2[0]), floor(v2[1])))
	}

	this.addUndoInsert = function(start, end, stack){
		if(!stack) stack = this.undo_stack
		// merge undo groups if it merges
		var last = stack[stack.length - 1]
		if(last && last.type == 'insert' &&
			last.start == end){
			var group = last.group
			last.group = this.undo_group
			for(var i = stack.length - 2;i>=0;i--){
				if(stack[i].group == group) stack[i].group =  this.undo_group
			}
		}
		stack.push({
			group:  this.undo_group,
			type: 'insert',
			start: start,
			data: this.textbuf.serializeTags(start, end),
			cursors: this.cursorset.toArray()
		})
	}

	this.addUndoDelete = function(start, end, stack){
		if(!stack) stack = this.undo_stack
		// merge undo objects if it merges
		var last = stack[stack.length - 1]
		if(last && last.type == 'delete' &&
			last.end == start){
			last.end += end - start
			return
		}
		stack.push({
			group: this.undo_group,
			type: 'delete',
			start: start,
			end: end,
			cursors: this.cursorset.toArray()
		})
	}

	this.forkRedo = function(){
		if(this.undo_stack.length){
			this.undo_stack[this.undo_stack.length - 1].redo = this.redo_stack
		}
		this.redo_stack = []
	}

	this.undoRedo = function(stack1, stack2){
		// aight. lets process em undos
		if(!stack1.length) return
		var last_group = stack1[stack1.length - 1].group
		for(var i = stack1.length - 1; i >= 0; i--){
			var item = stack1[i]
			var last_cursor
			if(item.group != last_group) break
			// lets do what it says
			if(item.type == 'insert'){
				this.addUndoDelete(item.start, item.start + item.data.length, stack2)
				this.textbuf.insertText(item.start, item.data)
				last_cursor = item.cursors
			}
			else{
				this.addUndoInsert(item.start, item.end, stack2)
				this.textbuf.removeText(item.start, item.end)
				last_cursor = item.cursors
			}
		}
		stack1.splice(i+1)
		this.cursorset.fromArray(last_cursor)
	}

	// alright we serialize all ze cursors and concat and send over.
	this.selectionToClipboard = function(){
		// alright. so. we need to sort the cursors.
		var str = this.cursorset.serializeSelection()
		this.screen.keyboard.clipboard = str
	}

	this.scanLeftWord = function(pos){
		while(pos > 0 && parse.isNonNewlineWhiteSpace(this.textbuf.charCodeAt(pos - 1))){
			pos --
		}
		while(pos > 0 && parse.isIdentifierChar(this.textbuf.charCodeAt(pos - 1))){
			pos --
		}
		return pos
	}

	this.scanRightWord = function(pos){
		while(pos < this.textbuf.char_count && parse.isNonNewlineWhiteSpace(this.textbuf.charCodeAt(pos))){
			pos ++
		}
		while(pos < this.textbuf.char_count && parse.isIdentifierChar(this.textbuf.charCodeAt(pos))){
			pos ++
		}
		return pos
	}

	this.scanLeftLine = function(pos){
		if(this.textbuf.charCodeAt(pos) == 9){
			while(pos < this.textbuf.char_count && this.textbuf.charCodeAt(pos) == 9){
				pos ++
			}
		}
		else{ // if we are a newline
			if(this.textbuf.charCodeAt(pos - 1) == 9){
				while(pos > 0 && this.textbuf.charCodeAt(pos - 1) != 10){
					pos --
				}
			}
			else{
				while(pos > 0 && this.textbuf.charCodeAt(pos - 1) > 10){
					pos --
				}
			}
		}
		return pos
	}

	this.scanRightLine = function(pos){
		while(pos < this.textbuf.char_count && this.textbuf.charCodeAt(pos) != 10){
			pos ++
		}
		return pos
	}

	// called after child constructors
	this.initEditImpl = function(){
		this.cursorset = new CursorSet(this)
		this.undo_stack = []
		this.redo_stack = []
		this.undo_group = 0
		this.cursorset.update()
		//this.cursorset.moveDown(0, 0)
	}

	this.keypaste = function(event){
		this.undo_group++
		this.cursorset.insert(event.text)
		this.doCursor()
		this.change = enumchange.clipboard
	}

	this.keypress = function(event){
		this.undo_group++
		this.cursorset.insert(event.value)
		this.doCursor()
		this.change = enumchange.keypress
	}

	var utfmap = {
		accent:1, _accent:'`',
		num1:'¡', _num1:'⁄',
		num2:'™', _num2:'€',
		num3:'£', _num3:'‹',
		num4:'¢',_num4:'›',
		num5:'∞',_num5:'ﬁ',
		num6:'§',_num6:'ﬂ',
		num7:'¶',_num7:'‡',
		num8:'•',_num8:'°',
		num9:'ª',_num9:'·',
		num0:'º',_num0:'‚',
		equals:'≠',_equalt:'±',
		q:'œ',_q:'Œ',
		w:'∑',_w:'„',
		e:2, _e:'´',
		r:'®', _r:'‰',
		t:'†',_t:'ˇ', y:'¥',
		u:3, _u:'¨',
		i:4, _i:'ˆ',
		o:'ø', _o:'Ø',
		p:'π', _p:'∏',
		openbracket:'“', _openbracket:'”',
		closebracket:'‘', _closebracket:'’',
		backslash:'«', _backslash:'»',
		a:'å',_a:'Å',
		s:'ß',_s:'Í',
		d:'∂',_d:'Î',
		f:'ƒ',_f:'Ï',
		g:'©',_g:'˝',
		h:'˙',_h:'Ó',
		j:'∆',_j:'Ô',
		k:'˚',_k:'',
		l:'¬',_l:'Ò',
		semicolon:'…', _semicolon:'Ú',
		singlequote:'æ', _singlequote:'Æ',
		z:'Ω', _z:'¸',
		x:'≈', _x:'˛',
		c:'ç', _c:'Ç',
		v:'√', _v:'◊',
		b:'∫', _b:'ı',
		n:5, _n:'˜',
		m:'µ', _m:'Â',
		comma:'≤', _comma:'¯',
		period:'≥', _period:'˘',
		slash:'÷', _slash:'¿'
	}

	this.keydown = function(v){
		var keyboard = this.screen.keyboard
		keyboard.textarea.focus()
		var name = 'key' + v.name[0].toUpperCase() + v.name.slice(1)
		this.undo_group++

		if(keyboard.meta) name += 'Cmd'
		if(keyboard.ctrl) name += 'Ctrl'
		if(keyboard.alt) name += 'Alt'
		if(keyboard.shift) name += 'Shift'

		if(this[name]) this[name](v)
		else if(keyboard.alt){
			name = v.name
			if(keyboard.shift) name = '_' + name
			var trans = utfmap[name]
			if(typeof trans == 'number'){ // we have to do a 2 step unicode
				console.log('2 step unicode not implemented')
			}
			else if(trans !== undefined){
				if(this.readonly) return
				this.cursorset.insert(trans)
				this.change = enumchange.keypress
			}
		}
	}


	this.onpointerstart = function (event) {
		var pos = this.globalToLocal(event.position)

		// var clone = []
		// var cursor

		this.cursorset.fusing = false
		// TODO(aki): fix alt and meta selection
		if (event.alt){
			// if (pointer.leftmeta || pointer.rightmeta) clone = this.cursorset.list
			this.cursorset.rectSelect(pos[0], pos[1], pos[0], pos[1], clone)
		} else if (event.meta){
			cursor = this.cursorset.addCursor()
			// in that case what we need to
			cursor.moveTo(pos[0], pos[1])
			// lets make it select the word
			if (event.clicker == 2) cursor.selectWord()
			if (event.clicker == 3) cursor.selectLine()
			this.cursorset.update()
		} else {
			this.cursorset.fusing = true
			this.cursorset.moveTo(pos[0], pos[1])
			// TODO(aki): implement clicker in pointer
			if (event.clicker == 2) this.cursorset.selectWord()
			if (event.clicker == 3) this.cursorset.selectLine()
		}
		this.doCursor()
	}

	this.onpointermove = function (event) {
		var pos = this.globalToLocal(event.position)
		var min = this.globalToLocal(event.min)
		var max = this.globalToLocal(event.max)

		if (event.alt){
			// console.log(min[0], min[1], max[0], max[1])
			// this.cursorset.rectSelect(min[0], min[1], max[0], max[1], clone)
		} else if (event.meta){
			// cursor.moveTo(pos[0], pos[1], true)
			// this.cursorset.update()
		} else {
			this.cursorset.moveTo(pos[0], pos[1], true)
		}
		this.doCursor()
	}

	this.onpointerend = function (event) {
		this.cursorset.fusing = true
		this.cursorset.update()
		// we are done. serialize to clipboard
		this.doCursor()
		this.selectionToClipboard()
	}

	// alright so. undo.
	this.keyZCtrl =
	this.keyZCmd = function(){
		if(this.readonly) return
		this.undoRedo(this.undo_stack, this.redo_stack)
		this.change = enumchange.undoredo
		//doCursor()
	}

	this.keyYCtrl =
	this.keyYCmd = function(){
		if(this.readonly) return
		this.undoRedo(this.redo_stack, this.undo_stack)
		this.change = enumchange.undoredo
		//change = Change.undoRedo
		//doCursor()
	}

	this.keyACtrl =
	this.keyACmd = function(){
		// select all
		this.cursorset.selectAll()
		this.selectionToClipboard()
	}

	this.keyXCtrl =
	this.keyXCmd = function(){
		if(this.readonly) return
		// cut the crap
		this.change = enumchange.delete
		this.cursorset.delete()
	}

	this.keyBackspace = function(){
		if(this.readonly) return
		this.cursorset.backspace()
		this.change = enumchange.delete
		this.selectionToClipboard()
		this.doCursor()
	}

	// move selection up one line
	this.keyDownarrowAlt = function(){

	}

	// move selection down one line
	this.keyUparrowAlt = function(){
	}

	this.keyDelete = function(){
		if(this.readonly) return
		this.change = enumchange.delete
		this.cursorset.delete()
		this.selectionToClipboard()
		this.doCursor()
	}

	this.keyDeleteCtrl =
	this.keyDeleteAlt = function(){
		if(this.readonly) return
		this.cursorset.deleteWord()
		this.selectionToClipboard()
		this.doCursor()
	}

	this.keyBackspaceCtrl =
	this.keyBackspaceAlt = function(){
		if(this.readonly) return
		this.cursorset.backspaceWord()
		this.selectionToClipboard()
		this.doCursor()
	}

	this.keyBackspaceCmd = function(){
		if(this.readonly) return
		this.cursorset.backspaceLine()
		this.selectionToClipboard()
		this.doCursor()
	}

	this.keyDeleteCmd = function(){
		if(this.readonly) return
		this.cursorset.deleteLine()
		this.selectionToClipboard()
		this.doCursor()
	}

	this.keyLeftArrowAltShift =
	this.keyLeftArrowCtrlShift =
	this.keyLeftArrowCtrl =
	this.keyLeftarrowAlt = function(){
		this.cursorset.moveLeftWord(this.screen.keyboard.shift)
		this.selectionToClipboard()
		this.doCursor()
	}

	this.keyRightArrowAltShift =
	this.keyRightArrowCtrlShift =
	this.keyRightArrowCtrl =
	this.keyRightarrowAlt = function(){
		this.cursorset.moveRightWord(this.screen.keyboard.shift)
		this.selectionToClipboard()
		this.doCursor()
	}

	this.keyLeftarrowCmdShift =
	this.keyLeftarrowCmd = function(){
		this.cursorset.moveLeftLine(this.screen.keyboard.shift)
		this.selectionToClipboard()
		this.doCursor()
	}

	this.keyRightarrowCmdShift =
	this.keyRightarrowCmd = function(){
		this.cursorset.moveRightLine(this.screen.keyboard.shift)
		this.selectionToClipboard()
		this.doCursor()
	}

	this.keyHome =
	this.keyUparrowCmdShift =
	this.keyUparrowCmd = function(){
		this.cursorset.moveTop(this.screen.keyboard.shift)
		this.selectionToClipboard()
		this.doCursor()
	}

	this.keyEnd =
	this.keyDownarrowCmdShift =
	this.keyDownarrowCmd = function(){
		this.cursorset.moveBottom(this.screen.keyboard.shift)
		this.selectionToClipboard()
		this.doCursor()
	}

	this.keyLeftarrowShift =
	this.keyLeftarrow = function(){
		this.cursorset.moveLeft(this.screen.keyboard.shift)
		this.selectionToClipboard()
		this.doCursor()
	}

	this.keyRightarrowShift =
	this.keyRightarrow = function(){
		this.cursorset.moveRight(this.screen.keyboard.shift)
		this.selectionToClipboard()
		this.doCursor()
	}

	this.keyUparrowShift =
	this.keyUparrow = function(){
		this.cursorset.moveUp(this.screen.keyboard.shift)
		this.selectionToClipboard()
		this.doCursor()
	}

	this.keyDownarrowShift =
	this.keyDownarrow = function(){
		this.cursorset.moveDown(this.screen.keyboard.shift)
		this.selectionToClipboard()
		this.doCursor()
	}
})
