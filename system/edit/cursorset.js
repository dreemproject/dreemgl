define.class(function(require){
	var Cursor = require('./singlecursor')

	// forward the cursor api
	function makeForward(key, fn){
		this[key] = function(){
			this.delta = 0
			for(var i = 0; i < this.list.length; i++){
				var cursor = this.list[i]
				cursor[key].apply(cursor, arguments)
			}
			this.update()
		}
	}
	
	for(var key in Cursor.prototype) if(typeof Cursor.prototype[key] == 'function'){
		makeForward.call(this, key, Cursor.prototype[key])
	}

	this.atConstructor = function(editor, textbuf){
		this.editor = editor
		this.textbuf = textbuf
		this.list = [this.newCursor()]
		this.fusing = true
	}

	this.serializeSelection = function(){
		var str = ''
		for(var i = 0; i < this.list.length; i++){
			var cursor = this.list[i]
			str += this.textbuf.serializeText(cursor.lo, cursor.hi)
		}
		return str
	}

	this.newCursor = function(){
		return new Cursor(this, this.editor, this.textbuf)
	}

	this.toArray = function(inp){
		var out = []
		for(var i = 0; i < this.list.length; i++){
			var cursor = this.list[i]
			out.push(cursor.start, cursor.end)
		}
		return out
	}

	this.fromArray = function(inp){
		this.list = []
		for(var i = 0; i < inp.length; i += 2){
			var cur = this.newCursor()
			this.list.push(cur)
			cur.start = inp[i]
			cur.end = inp[i+1]
		} 
		this.update()
	}

	this.fuse = function(){

		this.list.sort(function(a,b){ return (a.start<a.end?a.start:a.end) < (b.start<b.end?b.start:b.end)? -1: 1})
		// lets do single pass
		for(var i = 0; i < this.list.length - 1;){
			var cur = this.list[i]
			var nxt = this.list[i + 1]
			// lets figure out the different overlap cases
			if(cur.hi >= nxt.lo){
				if(cur.hi <= nxt.hi){ // we fuse it [cur<]nxt>
					if(nxt.end < nxt.start){
						cur.end = cur.lo
						cur.start = nxt.hi
					}
					else{
						cur.start = cur.lo
						cur.end = nxt.hi
					}
				}
				// remove the nxt
				this.list.splice(i+1, 1)
			}
			else i++
		}
		// lets communicate the position of our first cursor
		
	}
	
	this.markDelta = function(){
		for(var i = 0; i < this.list.length; i++){
			var cursor = this.list[i]
			cursor.mark_start = this.textbuf.charCodeAt(cursor.start - 1)
			cursor.mark_end = this.textbuf.charCodeAt(cursor.end - 1)
		}
	}

	this.markSeek = function(pos, delta, mark){
		pos += delta
		var count = this.textbuf.char_count
		if(pos < 0) pos = 0
		if(pos >= count) pos = count - 1
		// ignore markers that are volatile
		if(mark != 32 && mark != 9 && mark != 10 && mark != 59){
			pos++
			var start = pos
			var max = abs(delta)
			while(pos > 0 && this.textbuf.charCodeAt(pos - 1) != mark){
				if(start - pos > max)break
				pos--
			}
		}
		return pos
	}

	this.moveDelta = function(beyond, delta){
		for(var i = 0; i < this.list.length; i++){
			var cursor = this.list[i]

			if(cursor.start>=beyond)
				cursor.start = this.markSeek(cursor.start, delta, cursor.mark_start)
			if(cursor.end>=beyond){
				cursor.end = this.markSeek(cursor.end, delta, cursor.mark_end)
			//	cursor.max = text_layer.cursorRect(cursor.end).x
			}
		}
		this.update()
	}

	this.update = function(){
		if(this.updating) return
		this.updating = 1
		if(this.editor.setDirty) this.editor.setDirty(true)
	}

	this.updateCursors = function(){
		if(!this.updating) return
		this.updating = 0
		
		// lets remove all cursors
		this.editor.clearMarkers()
		this.editor.clearCursors()
		// fuse the cursor list
		if(this.fusing) this.fuse()
		// draw it into geometry buffers 
		for(var i = 0; i < this.list.length; i++){
			var cursor = this.list[i]
			if(cursor.start != cursor.end){
				this.editor.addMarkers(cursor.start, cursor.end)
			}
			this.editor.addCursor(cursor.end)
		}
	}

	this.rectSelect = function(x1, y1, x2, y2, clone){
		if(y2 < y1){
			var t = y1
			y1 = y2
			y2 = t
		}
		var new_list = Array.prototype.slice.apply(clone)
		var height = this.textbuf.line_height
		var y = y1
		while(1){
			var cur = this.newCursor()
			new_list.push(cur)
			cur.start = this.textbuf.offsetFromPos(x1,y)
			cur.end = this.textbuf.offsetFromPos(x2,y)
			//console.log(cur.end, x2)
			if(y >= y2) break
			y += height
			if(y > y2) y = y2
		}
		list = new_list
		this.update()
	}

	this.addCursor = function(){
		var cursor = this.newCursor(this)
		cursor.start = cursor.end = 0//this.list.length
		this.list.push(cursor)
		return cursor
	}
})