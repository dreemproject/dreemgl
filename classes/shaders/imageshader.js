define.class('$shaders/rectshader', function(){

	this.texture = this.Texture.fromType()

	// lets support subranges in images
	this.canvasprops = {
		tx: float,
		ty: float,
		tw: float, 
		th: float
	}

	this.color = function(){
		return texture.sample(vec2(
			mesh.x * canvasprops.tw + canvasprops.tx,
			mesh.y * canvasprops.th + canvasprops.ty
		))
	}

	this.canvasverbs = {
		draw:function(image, x, y, w, h, tx, ty, tw, th, margin){
			// lets do an aspect ratio safe width/height scale
			if(isNaN(tx)) tx = 0
			if(isNaN(ty)) ty = 0
			if(isNaN(tw)) tw = 1
			if(isNaN(th)) th = 1

			var doalign = isNaN(x) || isNaN(y)
		
			this.RECTARGS()
			//console.log(this.)
			// flush the shader call
			this.bufferNAME = null
			this.GETBUFFER()
			this.shaderNAME.texture = image//this.Texture.fromImage(image)
			this.ARGSTO(this)
			if(doalign) this.runAlign(buffer,1, margin)
			this.CANVASTOBUFFER()
		}
	}
})