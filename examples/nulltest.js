//Pure JS based composition
define.class(function($server$, composition, role, $containers$, screen, view){

	this.render = function(){ return [
		role(
			screen({clearcolor:'#484230'},
			       view({
				   size: vec2(100,100),
				   bgcolor: vec4('green'),
				})
			)
		)
	]}
	
	
	
})
