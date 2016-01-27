define.class('$blending/blend', function($blending$, mixer, blurv, blurh){

	this.hblend = define.class('$blending/blend', function(){
		// so we have one output, the size we can specify
		this.size = vec2(0.5, 0.5) // take on the size of the framebuffer
		// we can have multiple input that are named
		this.blendfn = function(){
			var v1 = input.sample(pos.xy)
		}
	})

	this.vblend = define.class('$blending/blend', function(){
		// so we have one output, the size we can specify
		this.size = vec2(0.5, 0.5) // take on the size of the framebuffer
		// we can have multiple input that are named
		this.blendfn = function(){
			var v1 = input.sample(pos.xy)
		}
	})

	this.blending = function(){
		return this.hblend({
			input:this.vblend({
			})
		})
	}
})