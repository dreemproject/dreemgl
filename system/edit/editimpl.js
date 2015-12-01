define.mixin(function(require){

	var CursorSet = require('./cursorset')
	var Cursor = require('./cursor')
	var parse = new (require('$system/parse/onejsparser'))()

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
			cursors: this.cursors.toArray()
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
			cursors: this.cursors.toArray()
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
		for(var i = stack1.length - 1;i>=0;i--){
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
		this.cursors.fromArray(last_cursor)
	}

	// alright we serialize all ze cursors and concat and send over.
	this.selectionToClipboard = function(){
		// alright. so. we need to sort the cursors.
		var str = this.cursors.serializeSelection()
		this.keyboard.clipboard = str
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
		this.cursors = new CursorSet(this, this.textbuf)
		this.undo_stack = []
		this.redo_stack = []
		this.undo_group = 0	
		this.cursors.update()
		//this.cursors.moveDown(0, 0)
	}

	this.keypaste = function(v){
		this.undo_group++
		this.cursors.insert(v)
		//change = Change.clipboard
	}

	this.keypress = function(v){
		this.undo_group++
		this.cursors.insert(v.value)
		//change = Change.keyPress		
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
		this.keyboard.textarea.focus()
		var name = 'key' + v.name[0].toUpperCase() + v.name.slice(1)
		this.undo_group++

		if(this.keyboard.leftmeta || this.keyboard.rightmeta) name += 'Cmd'
		if(this.keyboard.ctrl) name += 'Ctrl'
		if(this.keyboard.alt) name += 'Alt'
		if(this.keyboard.shift) name += 'Shift'

		if(this[name]) this[name](v)
		else if(this.keyboard.alt){
			name = v.name
			if(this.keyboard.shift) name = '_' + name
			var trans = utfmap[name]
			if(typeof trans == 'number'){ // we have to do a 2 step unicode
				console.log('2 step unicode not implemented')
			}
			else if(trans !== undefined){
				this.cursors.insert(trans)
				change = Change.keyPress
			}
		}
	}

	this.mouseleftup = function(){
		this.cursors.fusing = true
		this.cursors.update()
		// we are done. serialize to clipboard
		this.selectionToClipboard()	
		this.onmousemove = function(){}
	}

	this.mouseleftdown = function(start){
		//console.log(mouse.clicker)
		if(this.keyboard.alt){
			var clone
			if(this.keyboard.leftmeta || this.keyboard.rightmeta) clone = this.cursors.list
			else clone = []

			this.cursors.rectSelect(start[0], start[1], start[0], start[1], clone)
			this.cursors.fusing = false

			this.onmousemove = function(pos){
				this.cursors.rectSelect(start[0], start[1], pos[0], pos[1], clone)
			}			
		}
		else if(this.keyboard.leftmeta || this.keyboard.rightmeta){
			var cursor = this.cursors.addCursor()
			// in that case what we need to 
			this.cursors.fusing = false
			cursor.moveTo(start[0], start[1])
			// lets make it select the word 

			if(this.mouse.clicker == 2) cursor.selectWord()
			else if(this.mouse.clicker == 3){
				cursor.selectLine()
				this.mouse.resetClicker()
			}

			this.cursors.update()

			this.onmousemove = function(pos){
				// move
				cursor.moveTo(pos[0], pos[1], true)
				this.cursors.update()
			}
		}
		// normal selection
		else{
			// in that case what we need to 
			this.cursors.fusing = true
		
			this.cursors.moveTo(start[0], start[1])

			if(this.mouse.clicker == 2) this.cursors.selectWord()
			else if(this.mouse.clicker == 3){
				this.cursors.selectLine()
				this.mouse.resetClicker()
			}

			this.mousemove = function(pos){
				this.cursors.moveTo(pos[0], pos[1], true)
			}
		}
	}

	// alright so. undo. 
	this.keyZCtrl =
	this.keyZCmd = function(){
		this.undoRedo(this.undo_stack, this.redo_stack)
		//change = Change.undoRedo
		//doCursor()
	}

	this.keyYCtrl =
	this.keyYCmd = function(){
		this.undoRedo(this.redo_stack, this.undo_stack)
		//change = Change.undoRedo
		//doCursor()
	}

	this.keyACtrl = 
	this.keyACmd = function(){
		// select all
		this.cursors.selectAll()
		this.selectionToClipboard()
	}

	this.keyXCtrl = 
	this.keyXCmd = function(){
		// cut the crap
		this.cursors.delete()
	}

	this.keyBackspace = function(){
		this.cursors.backspace()
		//change = Change.delete
		this.doCursor()
	}

	this.doCursor = function(){
		//cursor = 1
		this.selectionToClipboard()
	}
	
	// move selection up one line
	this.keyDownarrowAlt = function(){

	}

	// move selection down one line
	this.keyUparrowAlt = function(){

	}

	this.keyTab = function(){
		this.screen.focusNext(this)
	}

	this.keyTabShift = function(){
		this.screen.focusPrev(this)
	}

	this.keyDelete = function(){
		this.cursors.delete()
		this.doCursor()
	}

	this.keyDeleteCtrl =
	this.keyDeleteAlt = function(){
		this.cursors.deleteWord()
		this.doCursor()
	}

	this.keyBackspaceCtrl = 
	this.keyBackspaceAlt = function(){
		this.cursors.backspaceWord()
		this.doCursor()
	}

	this.keyBackspaceCmd = function(){
		this.cursors.backspaceLine()
		this.doCursor()
	}

	this.keyDeleteCmd = function(){
		this.cursors.deleteLine()
		this.doCursor()
	}

	this.keyLeftArrowAltShift = 
	this.keyLeftArrowCtrlShift = 
	this.keyLeftArrowCtrl = 
	this.keyLeftarrowAlt = function(){
		this.cursors.moveLeftWord(this.keyboard.shift)
		this.doCursor()
	}
	
	this.keyRightArrowAltShift = 
	this.keyRightArrowCtrlShift = 
	this.keyRightArrowCtrl = 
	this.keyRightarrowAlt = function(){
		this.cursors.moveRightWord(this.keyboard.shift)
		this.doCursor()
	}

	this.keyLeftarrowCmdShift = 
	this.keyLeftarrowCmd = function(){
		this.cursors.moveLeftLine(this.keyboard.shift)
		this.doCursor()
	}

	this.keyRightarrowCmdShift = 
	this.keyRightarrowCmd = function(){
		this.cursors.moveRightLine(this.keyboard.shift)
		this.doCursor()
	}
 
	this.keyHome = 
	this.keyUparrowCmdShift = 
	this.keyUparrowCmd = function(){
		this.cursors.moveTop(this.keyboard.shift)
		this.doCursor()
	}

	this.keyEnd = 
	this.keyDownarrowCmdShift = 
	this.keyDownarrowCmd = function(){
		this.cursors.moveBottom(this.keyboard.shift)
		this.doCursor()
	}

	this.keyLeftarrowShift = 
	this.keyLeftarrow = function(){ 
		this.cursors.moveLeft(this.keyboard.shift)
		this.doCursor()
	}

	this.keyRightarrowShift = 
	this.keyRightarrow = function(){
		this.cursors.moveRight(this.keyboard.shift)
		this.doCursor()
	}

	this.keyUparrowShift = 
	this.keyUparrow = function(){
		this.cursors.moveUp(this.keyboard.shift)
		this.doCursor()
	}

	this.keyDownarrowShift = 
	this.keyDownarrow = function(){
		this.cursors.moveDown(this.keyboard.shift)
		this.doCursor()
	}
})