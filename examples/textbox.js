//Pure JS based composition
define.class(function($server$, composition, role, $containers$, screen, view, $controls$, textbox, label){
	this.render = function(){ return [
		role(
			screen({clearcolor:'#484230', flexdirection:'row'},
				textbox({value:"HELLO", bgcolor:'red'}),
				label({fgcolor:'red', text:'HELLLLOOO'})
			)
		)
	]}
	
})