//Pure JS based composition
define.class(function($server$, composition, screens, $containers$, screen, view){

	this.render = function(){ return [
		screens(
			screen({clearcolor:'#484230'},
			       view({
				   size: vec2(100,100),
				   bgcolor: vec4('green'),
				})
			)
		)
	]}
	
	
	
})
