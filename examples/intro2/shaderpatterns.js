define.class(function(){

	this.wave = function(pos, x, y){
		return sin(pos.x*x*8) + sin(pos.y*y*8)
	}
	
	this.stripe = function(pos, amount, spacing){
		var stripex = (floor(mod((pos.x )* spacing  + 0.05,1.0) *amount ) / amount) < 0.1?1.0:0.0;
		var stripey = (floor(mod((pos.y  )*spacing + 0.05, 1.0)*amount ) / amount) < 0.1?1.0:0.0;
		var maxstripe = max(stripex, stripey);
		return maxstripe
	}
})
