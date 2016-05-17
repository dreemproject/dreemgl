// create a little stamp based button with hover anim
define.class('$base/stamp', function(){

	define.class(this, 'Image', '$shaders/imageshader', function(){
		this.canvasverbs = {
				draw:function(image, x, y, w, h, tx, ty, tw, th, margin){
					// lets do an aspect ratio safe width/height scale
					if(isNaN(tx)) tx = 0
					if(isNaN(ty)) ty = 0
					if(isNaN(tw)) tw = 1
					if(isNaN(th)) th = 1

					var doalign = isNaN(x) || isNaN(y)
				
					this.RECTARGS()
					this.GETBUFFER()
					this.shaderNAME.texture = image//this.Texture.fromImage(image)
					this.ARGSTO(this)
					if(doalign) this.runAlign(buffer,1, margin)
					this.CANVASTOBUFFER()
				}
			}
	})

	this.draw = function(imageset, index){
		var c = this.canvas
		//c.bgcolor = 'red'
		//c.drawRect(0,0,100,100)
		// lets get the dims
		var dim = imageset.dims[index]
		//c.myprop = index/10
		c.drawImage(imageset.tgt, this.x, this.y, this.w, this.h, dim.x, dim.y, dim.w, dim.h)
	}

	this.tgtwidth = 4096
	this.tgtheight = 4096
	this.scalex = 0.5
	this.scaley = 0.5
	this.makeSet = function(c, set, tgt){
		// auto size target
		var imageset = {dims:[]}
		
		imageset.tgt = c.pushTarget(tgt)
		c.setOrthoViewMatrix()
		c.clear()

		var x = 0, y = 0, maxy = 0
		for(var i = 0;i < set.length; i++){
			var img = set[i]
			//console.log(img.width, img.height)
			if(x + img.width > this.tgtwidth) x = 0, y += maxy, maxy = 0
			if(y + img.height > maxy) maxy = y + img.height
			var wt = this.scalex * img.width
			var ht = this.scaley * img.height
			c.drawImage(img, x, y, wt, ht)
			imageset.dims.push({
				x: x/this.tgtwidth,
				y: y/this.tgtheight,
				w: wt/this.tgtwidth,
				h: ht/this.tgtheight
			})
			x += wt
		}

		c.popTarget()

		//c.bgcolor = 'red'
		//c.drawRect(0, 0, 400, 400)

		return imageset
	}

	this.canvasverbs = {
		draw: function(setarray, index, x, y, w, h){
			// ok where do we store the imageset?
			var tgt = this.getTarget("imagesNAME",this.RGBA, this.classNAME.tgtwidth, this.classNAME.tgtheight )
			if(!this.imagesetNAME){
				this.imagesetNAME = this.classNAME.makeSet(this, setarray, tgt)
				//console.log(this.imagesetNAME)
			}

			this.DOSTAMP(this.imagesetNAME, index)
			return stamp
		}
	}
})
