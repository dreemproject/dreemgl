//Pure JS based composition
define.class(function($server$, composition, screens, $containers$, screen, view, $controls$, textbox){
	this.render = function(){ return [
		screens(
			screen({clearcolor:'#484230', flexdirection:'row'},
				textbox({value:"HELLO", bgcolor:'red'})
			)
		)
	]}
	
})