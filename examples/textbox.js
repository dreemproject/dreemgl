//Pure JS based composition
define.class(function($server$, composition, role, $ui$, screen, view, textbox, label){



	this.render = function(){ return [
		role(
			screen({clearcolor:'#484230', flexdirection:'row'},
				textbox({value:"HELLO", bgcolor:'red'}),
				label({fgcolor:'red', text:'HELLLLOOO'})
			)
		)
	]}
	
})