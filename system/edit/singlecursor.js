define.class(function(require){

	var parse = new (require('$system/parse/onejsparser'))()

	this.atConstructor = function(cursorset, editor, textbuf){
		this.cursorset = cursorset
		this.editor = editor
		this.textbuf = textbuf
		this.start = 0
		this.end = 0
		this.max = 0
	}

	Object.defineProperty(this, 'lo', {
		get:function(){ 
			return this.end > this.start? this.start: this.end 
		},
		set: function(v){
			if(this.end > this.start) this.start = v
			else this.end = v
		}
	})

	Object.defineProperty(this, 'hi', {
		get: function(){ 
			return this.end > this.start? this.end: this.start 
		},
		set: function(v){
			if(this.end > this.start) this.end = v
			else this.start = v
		}
	})

	Object.defineProperty(this, 'span', {
		get:function(){
			return abs(this.end - this.start)
		}
	})

	this.moveLeft = function(only_end){
		this.end = this.end - 1
		if(this.end < 0) this.end = 0
		if(!only_end) this.start = this.end
		// 
		this.max = this.textbuf.cursorRect(this.end).x
	}

	this.moveRight = function(only_end){
		this.end = this.end + 1
		if(this.end > this.textbuf.char_count) this.end = this.textbuf.char_count
		if(!only_end) this.start = this.end
		this.max = this.textbuf.cursorRect(this.end).x
	}

	this.moveUp = function(only_end, lines){
		if(!lines) lines = 1
		var rect = this.textbuf.cursorRect(this.end)
		//console.log(max, rect.y + .5*rect.h - lines * cursorset.text_layer.line_height)
		//cursorset.text_layer.debugChunks()
		this.end = this.textbuf.offsetFromPos(this.max, rect.y + .5*rect.h - lines * this.textbuf.line_height)
		if(this.end < 0) this.end = 0
		if(!only_end) this.start = this.end
	}

	this.moveDown = function(only_end, lines){
		if(!lines) lines = 1
		var rect = this.textbuf.cursorRect(this.end)
		this.end = this.textbuf.offsetFromPos(this.max, rect.y + .5*rect.h + lines * this.textbuf.line_height)
		if(this.end < 0) this.end = this.textbuf.char_count
		if(!only_end) this.start = this.end
	}

	this.moveTo = function(x, y, only_end){
		var off = this.textbuf.offsetFromPos(x, y)
		
		if(off<0){
			if(off === -4 || off === -3) off = this.textbuf.lengthQuad()
			else off = 0
		}
		var change = this.end != off 
		this.end = off
		if(!only_end) change = this.start != this.end || change, this.start = this.end
		var r = this.textbuf.cursorRect(off)
		this.max = r.x
	}

	this.moveLeftWord = function(only_end){
		var pos = editor.scanLeftWord(this.end)
		if(pos == this.end) this.end --
		else this.end = pos
		if(!only_end) this.start = this.end
		this.max = this.textbuf.cursorRect(this.end).x
	}

	this.moveRightWord = function(only_end){
		var pos = editor.scanRightWord(this.end)
		if(pos == this.end) this.end ++
		else this.end = pos
		if(!only_end) this.start = this.end
		this.max = this.textbuf.cursorRect(this.end).x
	}

	this.moveLeftLine = function(only_end){
		// if we are a tab we scan to the right.
		this.end = this.editor.scanLeftLine(this.end)
		if(!only_end) this.start = this.end
		this.max = this.textbuf.cursorRect(this.end).x
	}

	this.moveRightLine = function(only_end){
		this.end = this.editor.scanRightLine(this.end)
		if(!only_end) this.start = this.end
		this.max = this.textbuf.cursorRect(this.end).x
	}

	this.moveTop = function(only_end){
		this.end = 0
		if(!only_end) this.start = this.end
		this.max = this.textbuf.cursorRect(this.end).x
	}

	this.moveBottom = function(only_end){
		this.end = this.textbuf.char_count
		if(!only_end) this.start = this.end
		this.max = this.textbuf.cursorRect(this.end).x
	}

	// we need to make a whole bunch of these things.
	this.deleteRange = function(from, to){
		this.editor.addUndoInsert(from, to)
		this.textbuf.removeText(from, to)
		
		this.cursorset.delta -= to - from
		this.start = this.end = from

		this.editor.forkRedo()
		this.max = this.textbuf.cursorRect(this.end).x
	}

	this.deleteWord = function(){
		var my = this.editor.scanRightWord(hi)
		if(my == this.lo) return this.delete()
		this.deleteRange(this.lo, my)
	}

	this.deleteLine = function(){
		this.deleteRange(this.lo, this.editor.scanRightLine(hi))
	}

	this.backspaceLine = function(){
		this.deleteRange(this.editor.scanLeftLine(this.lo), this.hi)
	}

	this.backspaceWord = function(){
		var my = this.editor.scanLeftWord(this.lo)
		if(my == this.hi) return this.backspace()
		this.deleteRange(my, this.hi)
	}

	this.selectWord = function(){
		this.start = this.editor.scanLeftWord(this.lo)
		this.end = this.editor.scanRightWord(this.hi)
		this.max = this.textbuf.cursorRect(this.end).x
	}
	
	this.selectLine = function(){
		this.start = this.editor.scanLeftLine(this.lo)
		this.end = this.editor.scanRightLine(this.hi) + 1
		this.max = this.textbuf.cursorRect(this.end).x
	}

	this.selectAll = function(){
		this.start = 0
		this.end = this.textbuf.char_count
		this.max =  this.textbuf.cursorRect(this.end).x
	}

	this.delete = function(){
		if(this.start != this.end) return this.deleteRange(this.lo, this.hi)
		// otherwise we have to delete the character upnext
		this.editor.addUndoInsert(this.end, this.end + 1)
		this.textbuf.removeText(this.end, this.end + 1)
		this.cursorset.delta -= 1
		this.editor.forkRedo()
		this.max = this.textbuf.cursorRect(this.end).x
	}

	this.backspace = function(){
		if(this.start != this.end) return this.deleteRange(this.lo, this.hi)

		this.start += this.cursorset.delta
		this.end += this.cursorset.delta

		if(this.editor.stripNextOnBackspace){
			if(this.editor.stripNextOnBackspace(this.lo - 1)){
				hi++
			}

			var t
			if(parse.isNonNewlineWhiteSpace(this.textbuf.charCodeAt(this.lo - 1))){
				while(t = parse.isNonNewlineWhiteSpace(this.textbuf.charCodeAt(this.lo - 1))){
					this.lo = this.lo - 1
					if(t == 2) break
				}
			}
		}
		
		if(this.lo == 0) return
		this.editor.addUndoInsert(this.lo -1, this.hi)
		this.textbuf.removeText(this.lo - 1, this.hi)
		this.cursorset.delta -= this.span
		this.editor.forkRedo()
		this.start = this.end = this.lo - 1
		this.max = this.textbuf.cursorRect(this.end).x			
	}

	this.insert = function(text){
		var cdelta = 0
		if(this.editor.processInsert){
			var pi = this.editor.processInsert(lo, hi, text)
			text = pi[0]
			cdelta = pi[1]
		}
		this.start += this.cursorset.delta
		this.end += this.cursorset.delta
		if(this.start != this.end){
			this.editor.addUndoInsert(this.lo, this.hi)
			this.textbuf.removeText(this.lo, this.hi)
			this.cursorset.delta -= this.span
		}
		if(text.length){
			var len =  this.textbuf.insertText(this.lo, text)
			this.cursorset.delta += len
			this.editor.addUndoDelete(this.lo, this.lo + len)
		}	
		this.editor.forkRedo()
		this.start = this.end = this.lo + text.length + cdelta
		this.max = this.textbuf.cursorRect(this.end).x
	}

	this.isSelection = function(){
		return this.start !== this.end
	}

	this.isCursor = function(){
		return this.start === this.end
	}
})