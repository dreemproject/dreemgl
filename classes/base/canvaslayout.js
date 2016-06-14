/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, exports){
	
	var defarray = [0,0,0,0]

	float.LEFTTOP = float.TOPLEFT = function float_TOPLEFT(t, canvas){
	}

	float.LEFT =
	float.LEFTCENTER = float.CENTERLEFT = function float_CENTERLEFT(t, canvas){
		if(!isNaN(t.height)) canvas.displaceProp(t.rangeStart, 'y', (t.height - (t.maxy - t.starty)) / 2)
	}

	float.LEFTBOTTOM = float.BOTTOMLEFT = function float_BOTTOMLEFT(t, canvas){
		if(!isNaN(t.height)) canvas.displaceProp(t.rangeStart, 'y', t.height - (t.maxy - t.starty))
	}

	float.TOP = 
	float.CENTERTOP = float.TOPCENTER = function float_TOPCENTER(t, canvas){
		if(!isNaN(t.width)) canvas.displaceProp(t.rangeStart, 'x', (t.width - (t.maxx - t.startx)) / 2)
	}

	float.CENTER = function float_CENTER(t, canvas){
		if(!isNaN(t.width)) canvas.displaceProp(t.rangeStart, 'x', (t.width - (t.maxx - t.startx)) / 2)
		if(!isNaN(t.height)) canvas.displaceProp(t.rangeStart, 'y', (t.height - (t.maxy - t.starty)) / 2)
	}
	
	float.BOTTOM =
	float.CENTERBOTTOM = float.BOTTOMCENTER = function float_CENTERBOTTOM(t, canvas){
		if(!isNaN(t.width)) canvas.displaceProp(t.rangeStart, 'x', (t.width - (t.maxx - t.startx)) / 2)
		if(!isNaN(t.height)) canvas.displaceProp(t.rangeStart, 'y', t.height - (t.maxy - t.starty))
	}

	float.TOPRIGHT = float.RIGHTTOP = function float_TOPRIGHT(t, canvas){
		if(!isNaN(t.width)) canvas.displaceProp(t.rangeStart, 'x', t.width - (t.maxx - t.startx))
	}

	float.RIGHT =
	float.RIGHTCENTER =  float.CENTERRIGHT = function float_CENTERRIGHT(t, canvas){
		if(!isNaN(t.width)) canvas.displaceProp(t.rangeStart, 'x', t.width - (t.maxx - t.startx))
		if(!isNaN(t.height)) canvas.displaceProp(t.rangeStart, 'y', (t.height - (t.maxy - t.starty)) / 2)
	}

	float.RIGHTBOTTOM = float.BOTTOMRIGHT = function float_BOTTOMRIGHT(t, canvas){
		if(!isNaN(t.width)) canvas.displaceProp(t.rangeStart, 'x', t.width - (t.maxx - t.startx))
		if(!isNaN(t.height)) canvas.displaceProp(t.rangeStart, 'y', t.height - (t.maxy - t.starty))
	}

	function float_LRTBWRAP(){}
	float_LRTBWRAP.prototype = {
		begin:function(t, canvas){
			//var ot = t.outer
			t.startx = t.walkx = t.initx + t.padding[3] + t.margin[3]
			t.starty = t.walky = t.inity + t.padding[0] + t.margin[0]
		},
		walk:function(t, canvas, oldturtle){
			if(!isNaN(t.width) && t.walkx + t._w + t._margin[3] + t._margin[1] > t.startx + t.width){
				var dx = t.startx - t.walkx 
				var dy = t.maxh
				t.walkx = t.startx
				t.walky += t.maxh
				t.maxh = 0
				// move the body of the wrapped thing
				if(oldturtle){
					canvas.displaceProp(oldturtle.rangeStart, 'x', dx)
					canvas.displaceProp(oldturtle.rangeStart, 'y', dy)
				}
			}

			// walk it
			t._x = t.walkx + t._margin[3]
			t._y = t.walky + t._margin[0]

			// this part is the stack left WRAP
			t.walkx += t._w + t._margin[3] + t._margin[1]

			var tx = t.walkx
			if(tx > t.maxx) t.maxx = tx

			var h = t._h + t._margin[0] + t._margin[2]
			if(h > t.maxh) t.maxh = h

			var ty = t.walky + h
			if(ty > t.maxy) t.maxy = ty 
		},
		newline:function(){
			t.walkx = t.startx
			t.walky += t.maxh
			t.maxh = 0
		}
	}
	float.LRTBWRAP = new float_LRTBWRAP()
	
	function float_LRTBNOWRAP(){}

	float_LRTBNOWRAP.prototype = {
		begin:function(t, canvas){
			var ot = t.outer
			t.startx = t.walkx = t.initx + t.padding[3] + t.margin[3]
			t.starty = t.walky = t.inity + t.padding[0] + t.margin[0]
		},
		walk:function(t, canvas, oldturtle){
			// walk no wrap
			t._x = t.walkx + t._margin[3]
			t._y = t.walky + t._margin[0]

			// this part is the stack left WRAP
			t.walkx += t._w + t._margin[3] + t._margin[1]

			var tx = t.walkx
			if(tx > t.maxx) t.maxx = tx

			var h = t._h + t._margin[0] + t._margin[2]
			if(h > t.maxh) t.maxh = h

			var ty = t.walky + h
			if(ty > t.maxy) t.maxy = ty
		},
		newline:function(t, canvas){
			t.walkx = t.startx
			t.walky += t.maxh
			t.maxh = 0
		}
	}

	float.LRTBNOWRAP = new float_LRTBNOWRAP()

	float.left = function float_left(left){
		return function(t, canvas){
			return t.startx + t._margin[3] + left
		}
	}

	float.top = function float_top(top){
		return function(t, canvas){
			return t.starty + t._margin[0] + top
		}
	}

	float.right = function float_right(right){
		return function(t, canvas){
			if(isNaN(t.width)) t.startx + t._margin[3] + right
			return t.startx + t.width - t._w - t._margin[1] - right
		}
	}

	float.bottom = function float_bottom(bottom){
		return function(t, canvas){
			if(isNaN(t.height)) return t.starty + t._margin[0] + bottom
			else return t.starty + t.height - t._h - t.margin[2] - bottom
		}
	}

	float.width = function float_width(str){

		var delta = 0, id
		if((id = str.indexOf('+')) > 0 || (id = str.indexOf('-')) > 0){
			delta = parseFloat(str.slice(id))
			str = str.slice(0,id)
		}

		var factor = parseFloat(str)/100

		return function(t, canvas){
			var ret = ((t.width) * factor)- t._margin[1] - t._margin[3] + delta
			return ret
		}
	}

	float.height = function float_height(str){

		var delta = 0, id
		if((id = str.indexOf('+')) > 0 || (id = str.indexOf('-')) > 0){
			delta = parseFloat(str.slice(id))
			str = str.slice(0,id)
		}

		var factor = parseFloat(str)/100

		return function(t, canvas){
			return ((t.height) * factor)- t._margin[0] - t._margin[2] + delta
		}
	}

	this.beginTurtle = function(){
		// allocate alignment object
		var ot = this.turtleStack[this.turtleStack.len] = this.turtle
		var t = this.turtle = this.turtleStack[++this.turtleStack.len] || {}
		t.outer = ot

		// store our local values from the outer turtle
		t.align = ot._align || float.LEFTTOP
		t.walk = ot._walk || float.LRTBWRAP
		t._margin = t.margin = ot._margin
		t._padding = t.padding = ot._padding

		var _x = ot._x
		if(typeof _x === "function"){
			t.initx = _x(t, this)
		}
		else t.initx = _x

		var _y = ot._y
		if(typeof _y === "function"){
			t.inity = _y(t, this)
		}		
		else t.inity = _y

		if(isNaN(t.initx)) t.initx = ot.walkx
		if(isNaN(t.inity)) t.inity = ot.walky

		var _w = ot._w
		if(_w === undefined){
			t.width = NaN
		}
		else if(typeof _w === 'function'){
			t.width = _w(ot, this) - t.padding[1] - t.padding[3] 
		}
		else{
			t.width = _w - t.padding[1] - t.padding[3] 
		}

		var _h = ot._h
		if(_h === undefined){
			t.height = NaN
		}
		else if(typeof _h === 'function'){
			t.height = _h(ot, this) - t.padding[0] - t.padding[2] 
		}
		else{
			t.height = _h - t.padding[0] - t.padding[2]
		}

		// bounding rect (including abs pos)
		//t.boundminx = Infinity
		//t.boundminy = Infinity
		//t.boundmaxx = -Infinity
		//t.boundmaxy = -Infinity

		// alignment rect (excluding abs pos)
		t.minx = Infinity
		t.miny = Infinity
		t.maxx = -Infinity
		t.maxy = -Infinity
		t.maxh = 0

		t.walk.begin(t, this)

		t.rangeStart = this.rangeList && this.rangeList.length || 0
	}

	this.walkTurtle = function(oldturtle){
		// local state x /y / w/ h/ margin/padding
		var t = this.turtle

		var _w = t._w
		if(typeof _w === "function"){
			t._w = _w(t, this)
		}
		var _h = t._h
		if(typeof _h === "function"){
			t._h = _h(t, this)
		}
		var _x = t._y
		if(typeof _x === "function"){
			t._x = _x(t, this)
		}
		var _y = t._y
		if(typeof _y === "function"){
			t._y = _y(t, this)
		}

		// its not absolutely positioned
		if(isNaN(t._x)|| isNaN(t._y)){
			// walk the turtle
			t.walk.walk(t, this, oldturtle)
		}
	}

	this.endTurtle = function(){
		// moves stuff as needed from the
		var t = this.turtle
		var ot = t.outer

		var padw = t.padding[3] + t.padding[1]
		var padh = t.padding[0] + t.padding[2]

		if(isNaN(t.width)){
			ot._w = (t.maxx - t.startx) + padw
		}
		else{
			ot._w = t.width + padw 
		}

		if(isNaN(t.height)){
			ot._h = (t.maxy - t.starty) + padh
		}
		else ot._h = t.height + padh

		// lets end the turtle walking
		if(t.walk.end) t.walk.end(t, this)

		// call alignment function
		t.align(t, this)

		this.turtle = this.turtleStack[--this.turtleStack.len]
	}

	this.displaceProp = function(start, key, displace){
		
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

	this.newline = function(){
		var t = this.turtle
		t.walk.newline(t, this)
	}
})
