define.class('$shaders/rectshader', function(){

	this.image = this.Texture.fromType()

	this.color = function(){
		return image.sample(mesh.xy)
	}

	this.canvasverbs = {
		draw:function(image, x, y, w, h){
			var doalign = isNaN(x) || isNaN(y)
			this.RECTARGS()
			// this processes the args and builds up a buffer
			this.GETBUFFER()
			this.shaderNAME.image = image
			this.ARGSTOCANVAS()
			if(doalign) this.runAlign(this.classNAME, buffer)
			this.CANVASTOBUFFER()
			// make sure we issue a new drawcommand for the next one
			this.bufferNAME = undefined
		}
	}
})