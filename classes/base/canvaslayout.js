/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, exports){

	this.push = function(){
		var len = ++this.matrixStackLen
		var n = this.matrix
		var o = this.matrixStack[len] || (this.matrixStack[len] = mat4())
		o[0] = n[0], o[1] = n[1], o[2] = n[2], o[3] = n[3]
		o[4] = n[4], o[5] = n[5], o[6] = n[6], o[7] = n[7]
		o[8] = n[8], o[9] = n[9], o[10]= n[10], o[11]= n[11]
		o[12]= n[12], o[13]= n[13], o[14]= n[14], o[15]= n[15]
	}

	this.pop = function(){
		if(this.matrixStackLen <= 0) return
		var len = --this.matrixStackLen
		this.matrix = this.matrixStack[len]
	}

	this.translate = function(x, y, z){
		mat4.translateXYZ(this.matrix, x, y, z, this.matrix)
	}

	this.rotate = function(x, y, z, r){
		mat4.rotateXYZ(this.matrix, r, x, y, z, this.matrix)
	}

	this.rotateX = function(r){
		mat4.rotateX(this.matrix, r, this.matrix)
	}

	this.rotateY = function(r){
		mat4.rotateY(this.matrix, r, this.matrix)
	}

	this.rotateZ = function(r){
		mat4.rotateZ(this.matrix, r, this.matrix)
	}

	this.scale = function(x,y,z){
		mat4.scaleXYZ(this.matrix, x, y, z, this.matrix)
	}

	// readpixel
	this.readPixels = function(x, y, w, h, buffer){
		return new define.Promise(function(resolve, reject){
			this.cmds.push('readPixels', {x:x,y:y,w:w,h:h, buffer:buffer, resolve:resolve})
		}.bind(this))
	}


	float.NOWRAP = function(align, canvas, oldalign){
		var a = align
		canvas.x = a.x + a.m3 
		canvas.y = a.y + a.m0 
		a.x += canvas.w + a.m3 + a.m1

		var ax = a.x
		if( ax > a.maxx) a.maxx = ax
		if( ax > a.boundx) a.boundx = ax

		var hs = canvas.h + a.m0 + a.m2

		var hy = a.y + hs
		if( hy> a.maxy) a.maxy = hy
		if( hy > a.boundy) a.boundy = hy
	}

	float.LEFTTOP = float.TOPLEFT = function float_TOPLEFT(align, canvas){
	}

	float.LEFT =
	float.LEFTCENTER = float.CENTERLEFT = function float_CENTERLEFT(align, canvas){
		if(!align.computeh) canvas.displaceAlign(align.trackstart, 'y', (align.h - (align.maxy - align.ystart)) / 2)
	}

	float.LEFTBOTTOM = float.BOTTOMLEFT = function float_BOTTOMLEFT(align, canvas){
		if(!align.computeh) canvas.displaceAlign(align.trackstart, 'y', align.h - (align.maxy - align.ystart))
	}

	float.TOP = 
	float.CENTERTOP = float.TOPCENTER = function float_TOPCENTER(align, canvas){
		if(!align.computew) canvas.displaceAlign(align.trackstart, 'x', (align.w - (align.maxx - align.xstart)) / 2)
	}

	float.CENTER = function float_CENTER(align, canvas){
		if(!align.computew) canvas.displaceAlign(align.trackstart, 'x', (align.w - (align.maxx - align.xstart)) / 2)
		if(!align.computeh) canvas.displaceAlign(align.trackstart, 'y', (align.h - (align.maxy - align.ystart)) / 2)
	}
	
	float.BOTTOM =
	float.CENTERBOTTOM = float.BOTTOMCENTER = function float_CENTERBOTTOM(align, canvas){
		if(!align.computew) canvas.displaceAlign(align.trackstart, 'x', (align.w - (align.maxx - align.xstart)) / 2)
		if(!align.computeh) canvas.displaceAlign(align.trackstart, 'y', align.h - (align.maxy - align.ystart))
	}

	float.TOPRIGHT = float.RIGHTTOP = function float_TOPRIGHT(align, canvas){
		if(!align.computew) canvas.displaceAlign(align.trackstart, 'x', align.w - (align.maxx - align.xstart))
	}

	float.RIGHT =
	float.RIGHTCENTER =  float.CENTERRIGHT = function float_CENTERRIGHT(align, canvas){
		if(!align.computew) canvas.displaceAlign(align.trackstart, 'x', align.w - (align.maxx - align.xstart))
		if(!align.computeh) canvas.displaceAlign(align.trackstart, 'y', (align.h - (align.maxy - align.ystart)) / 2)
	}

	float.RIGHTBOTTOM = float.BOTTOMRIGHT = function float_BOTTOMRIGHT(align, canvas){
		if(!align.computew) canvas.displaceAlign(align.trackstart, 'x', align.w - (align.maxx - align.xstart))
		if(!align.computeh) canvas.displaceAlign(align.trackstart, 'y', align.h - (align.maxy - align.ystart))
	}

	float.left = function float_left(left){
		return function(align){
			return align.xstart + align.m3 + left
		}
	}

	float.top = function float_top(top){
		return function(align){
			return 	align.ystart + align.m0 + top
		}
	}

	float.right = function float_right(right){
		return function(align, canvas){
			if(isNaN(align.w)) return align.xstart + align.m3 + right
			return align.xstart + align.w - canvas.w - right - align.m1//0//this.width - this.w//align.xstart - m3 + cls._right
		}
	}

	float.bottom = function float_bottom(bottom){
		return function(align, canvas){
			if(isNaN(align.h)) return align.ystart + align.m0 + bottom
			else return align.ystart + align.h - canvas.h - align.m2//t - align.ystart + m3 + cls._bottom
		}
	}

	float.width = function float_width(str){
		var delta = 0, id
		if((id = str.indexOf('+')) > 0 || (id = str.indexOf('-')) > 0){
			delta = parseFloat(str.slice(id))
			str = str.slice(0,id)
		}
		var factor = parseFloat(str)/100
		if(isNaN(factor)){
			return function(align){
		
				var w = align.left + align.width - align.x - align.m1 + delta//- align.p3 - align.m3//+ align.p1  ///- align.m3 //- align.p1// - align.m3 //+align.p1
				if(w<=0) w = align.left + align.width - align.m1 + delta
				return w
			}
		}
		else{
			return function(align){
				return ((align.width) * factor)- align.m1 - align.m3 + delta
			}
		}
	}

	float.height = function float_height(str){
		var delta = 0, id
		if((id = str.indexOf('+')) > 0 || (id = str.indexOf('-')) > 0){
			delta = parseFloat(str.slice(id))
			str = str.slice(0,id)
		}
		var factor = parseFloat(str)/100
		if(isNaN(factor)){
			return function(align){
				var h = align.top + align.height - align.maxy - align.m2 + delta//- align.p3 - align.m3//+ align.p1  ///- align.m3 //- align.p1// - align.m3 //+align.p1
				if(h<=0) h = align.top + align.height - align.m2 + delta
				return h
			}
		} 
		else{
			return function(align){
				return ((align.height) * factor) + delta - align.m0 - align.m2
			}
		}
	}

	// start an alignment
	this.beginAlign = function(alignfunction, wrapfunction, margin, padding){
		// store old align
		var oldalign = this.stackAlign[this.stackAlign.len] = this.align
		this.stackAlign.len++

		// fetch new one
		var a = this.align = this.stackAlign[this.stackAlign.len] || {}
	
		if(Array.isArray(padding)){
			 a.p0 = padding[0], a.p1 = padding[1], a.p2 = padding[2], a.p3 = padding[3]
		}
		else if(typeof padding === 'number'){
			 a.p0 = a.p1 = a.p2 = a.p3 = padding
		}
		else{
			a.p0 = a.p1 = a.p2 = a.p3 = 0
		}
		
		if(Array.isArray(margin)){
			a.m0 = margin[0], a.m1 = margin[1], a.m2 = margin[2], a.m3 = margin[3]
		}
		else if(typeof margin === 'number'){
			a.m0 = a.m1 = a.m2 = a.m3 = margin
		}
		else{
			a.m0 = a.m1 = a.m2 = a.m3 = 0
		}

		var xs = !isNaN(this.x)? this.x: oldalign.x
		var ys = !isNaN(this.y)? this.y: oldalign.y

		a.left = oldalign.xstart
		a.top = oldalign.ystart
		a.width = oldalign.w
		a.height = oldalign.h
		a.xstart = a.x = xs + a.p3+ a.m3  //+ a.m1
		a.ystart = a.y = ys + a.p0 + a.m0 //+ a.m2

		if(this.w === undefined || this.w === float){
			a.computew = true
			a.w = a.width - a.p1 - a.p3 
			a.wrapx = a.w + a.xstart
		}
		else if(typeof this.w === 'function'){
			//this.w = 
			var w = this.w(a, this)
			a.computew = false
			a.w = w - a.p1 - a.p3 
			a.wrapx = a.w + a.xstart
		}
		else{
			a.computew = false
			a.w = this.w - a.p1 - a.p3 
			a.wrapx = a.w + a.xstart
		}

		if(this.h === undefined || this.h === float){
			a.computeh = true
			a.h = a.height - a.p1 - a.p3  
		}
		else if(typeof this.h === 'function'){
			a.computeh = false
			var h = this.h(a, this)//this.h = this.h(a, this)
			a.h = h - a.p0 - a.p2
		}
		else{
			a.computeh = false
			a.h = this.h - a.p0 - a.p2
		}

		a.alignfunction = alignfunction || float.TOPLEFT
		a.wrapfunction = wrapfunction || float.WRAP

		a.trackstart = this.trackAlign && this.trackAlign.length || 0
		// bounding rect (includes abs position)
		a.boundx = 0
		a.boundy = 0
		// alignment rect (excludes abs position)
		a.maxx = 0
		a.maxy = 0
		a.inh = this.h
		a.inw = this.w
		a.inx = this.x
		a.iny = this.y
	}

	this.displaceAlign = function(start, key, displace, dbg){
		var track = this.trackAlign
		var current = this.stackAlign.len
		for(var i = start; i < track.length; i += 4){
			var buf = track[i]
			var off = track[i+1]
			var range = track[i+2]
			var level = track[i+3]
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
		
	this.markAbsolute = function(align){
		var start = align.trackstart
		var track = this.trackAlign
		for(var i = start; i < track.length; i += 4){
			track[i+3] = -1
		}
	}

	this.endAlign = function(){
		var a = this.align

		a.alignfunction(a, this)

		var dx = a.maxx - a.xstart
		var dy = a.maxy - a.ystart

		this.w = dx + a.p1 + a.p3
		this.h = dy + a.p0 + a.p2

		var oa = a
		a = this.align = this.stackAlign[--this.stackAlign.len]

		// do a bit of math to size our rect to the computed size
		if(oa.computew){
			this.w = (oa.boundx - oa.xstart + oa.p1 + oa.p3)//- oa.m1)
			//if(isNaN(oa.inx)) this.w -= a.x
			//else this.w -= oa.inx
		}
		else{
			this.w = oa.inw
			if(typeof this.w === 'function'){
				this.w = this.w(oa, this)
			}
		}

		if(oa.computeh){
			this.h = (oa.boundy - oa.ystart + oa.p2 + oa.p0)// - oa.m2)
			//if(isNaN(oa.iny)) this.h -= a.y
			//else this.h -= oa.iny
		}
		else {
			this.h = oa.inh
			if(typeof this.h === 'function'){
				this.h = this.h(oa, this)
			}
		}

		this.x = oa.inx
		this.y = oa.iny

	}

	float.WRAP = function(align, canvas, oldalign){
		var a = align

		var first = Math.abs(a.x - a.xstart) < 0.001
		canvas.x = a.x + a.m3 
		canvas.y = a.y + a.m0 
		a.x += canvas.w + a.m3 + a.m1 

		//console.error(a.x)
		var hs = canvas.h + a.m0 + a.m2

		if(!a.computew && !first && a.x > a.wrapx){

			a.x = a.xstart 
			a.y += a.maxy - a.y 

			var newx = a.xstart + a.m3
			var newy =  a.y + a.m0
			var dx = newx - canvas.x
			var dy = newy - canvas.y			
			a.x += canvas.w + a.m3 + a.m1

			if(oldalign){
				var start = oldalign.trackstart
				canvas.displaceAlign(start, 'x', dx, 1)
				canvas.displaceAlign(start, 'y', dy, 1)
			}
			canvas.x = newx
			canvas.y = newy 
		}

		var ax = a.x
		if( ax > a.maxx) a.maxx = ax 
		if( ax > a.boundx) a.boundx = ax

		var hy = a.y + hs
		if( hy> a.maxy) a.maxy = hy
		if( hy > a.boundy) a.boundy = hy
	}

	this.runAlign = function(buffer, range, margin, oldalign){

		var a = this.align

		// lets store our margin on align
		if(Array.isArray(margin)){
			a.m0 = margin[0], a.m1 = margin[1], a.m2 = margin[2], a.m3 = margin[3]
		}
		else if(typeof margin === 'number'){
			a.m0 = a.m1 = a.m2 = a.m3 = margin
		}
		else{
			a.m0 = a.m1 = a.m2 = a.m3 = 0
		}
		var w = this.w

		if(typeof w === "function"){
			w = w(a, this)
			this.w = w
		}
		var h = this.h
		if(typeof h === "function"){
			h = h(a, this)
			this.h = h
		}

		var abs = false
		var x = this.x
		if(typeof x === 'function'){
			x = x(a, this)
			this.x  =x
			abs = true
		}

		var y = this.y
		if(typeof y === 'function'){
			y = y(a, this)
			this.y =y
			abs = true
		}

		if(abs){
			this.trackAlign.push(buffer, buffer.length, range || 1, this.stackAlign.len - 1)

			// absolutely align a sub thing
			if(oldalign){
				var dx = x - oldalign.xstart + oldalign.p3
				var dy = y - oldalign.ystart + oldalign.p0

				var start = oldalign.trackstart
				this.displaceAlign(start, 'x', dx, 1)
				this.displaceAlign(start, 'y', dy, 1)
			}
			var maxx = x + w + a.m3
			if(maxx > a.boundx) a.boundx = maxx
			var maxy = y + h + a.m0
			if( maxy> a.boundy) a.boundy = maxy
			return
		}

		this.trackAlign.push(buffer, buffer.length, range || 1, this.stackAlign.len)

		a.wrapfunction(a, this, oldalign)
	}

	// break terminates an a cycle and does a newline
	this.newline = function(height){
		var a = this.align
		a.x = a.xstart 
		a.y += a.maxy - a.y
	}
})