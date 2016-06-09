/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, exports){
	
	var defarray = [0,0,0,0]

	float.LEFTTOP = function(){

	}

	float.RIGHT = function(){
		
	}

	float.WRAP = function(){

	}

	this.beginTurtle = function(){
		// allocate alignment object
		var ot = this.turtleStack[this.turtleStack.len] = this.turtle
		var t = this.turtle = this.turtleStack[++this.turtleStack.len] || {}
		t.old = ot

		var xs
		if(typeof ot.x === "function"){
			xs = ot.x(t, this)
		}
		else xs = ot.x

		var ys 
		if(typeof ot.y === "function"){
			ys = ot.y(t, this)
		}		
		else ys = ot.y

		if(isNaN(xs)) xs = ot.walkx
		if(isNaN(ys)) ys = ot.walky

		t.startx = t.walkx = xs + ot.padding[3] + ot.margin[3]
		t.starty = t.walky = ys + ot.padding[0] + ot.margin[0]

		if(ot.w === undefined || ot.w === float){
			t.width = NaN
		}
		else if(typeof ot.w === 'function'){
			t.width = ot.w(t, this) - ot.padding[1] - ot.padding[3] 
		}
		else{
			t.width = ot.w - ot.padding[1] - ot.padding[3] 
		}

		if(ot.h === undefined || ot.h === float){
			t.height = NaN
		}
		else if(typeof ot.h === 'function'){
			t.height = ot.h(t, this) - ot.padding[0] - ot.padding[2] 
		}
		else{
			t.height = ot.h - ot.padding[0] - ot.padding[2]
		}

		// bounding rect (including abs pos)
		t.boundx = 0
		t.boundy = 0
		// alignment rect (excluding abs pos)
		t.maxx = 0
		t.maxy = 0

		t.rangeStart = this.rangeStack && this.rangeStack.length || 0
	}

	this.walkTurtle = function(buffer, range){
		// local state x /y / w/ h/ margin/padding
		var t = this.turtle
		var ot = t.old

		if(typeof t.w === "function"){
			t.w = t.w(t, this)
		}
		if(typeof t.h === "function"){
			t.h = t.h(t, this)
		}
		if(typeof t.x === "function"){
			t.x = t.x(t, this)
		}
		if(typeof t.y === "function"){
			t.y = t.y(t, this)
		}

		this.rangeList.push(buffer, buffer.length, range||1, this.turtleStack.len)

		if(isNaN(t.x)|| isNaN(t.y)){
			t.x = t.walkx + t.margin[3]
			t.y = t.walky + t.margin[0]
			
			t.walkx += t.w + t.margin[3] + t.margin[1]

			var tx = t.walkx
			if(tx > t.maxx) t.maxx = tx

			var h = t.h + t.margin[0] + t.margin[2]
			var ty = t.walky + h
			if(ty > t.maxy) t.maxy = ty
		}
	}

	this.endTurtle = function(){
		// moves stuff as needed from the
		var t = this.turtle
		var ot = t.old

		var padh = ot.padding[0] + ot.padding[2]
		var padw = ot.padding[3] + ot.padding[1]

		if(isNaN(t.width)){
			ot.w = (t.maxx - t.startx) + padw
		}
		else{
			ot.w = t.width + padw 
		}

		if(isNaN(t.height)){
			ot.h = (t.maxy - t.starty) + padh
		}
		else ot.h = t.height + padh

		// call alignment function
		ot.align(ot, this)

		this.turtle = this.turtleStack[--this.turtleStack.len]
	}

	this.displacePropBuffer = function(start, key, displace){
		var ranges = this.rangeList
		var current = this.turtleStack.len
		for(var i = start; i < ranges.length; i += 4){
			var buf = ranges[i]
			var off = ranges[i+1]
			var range = ranges[i+2]
			var level = ranges[i+3]
			if(current > level) continue
			var slots = buf.struct.slots
			var rel = buf.struct.offsets[key]
			var array = buf.array
			for(var j = off; j < off+range; j++){
				var offset = j * slots + rel
				array[offset] += displace
			}
		}
	}

	this.markAbsolute = function(turtle){
		var start = turtle.rangeStart
		var ranges = this.rangeList
		for(var i = start; i < ranges.length; i += 4){
			track[i+3] = -1
		}
	}


})
