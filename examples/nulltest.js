//Pure JS based composition
define.class('$server/composition', function($ui$, screen, view){

	this.render = function(){ return [
		screen({clearcolor:'#484230'},
		       view({
			   size: vec2(100,100),
			   bgcolor: vec4('green'),
			})
		)
	]}
	
	
	
})
