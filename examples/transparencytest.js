//Pure JS based composition
define.class(function($server$, composition, role, $ui$, screen, view, label){
	this.render = function(){ return [
		role(
			screen({clearcolor:vec4('blue')},
				view({flex:1, bgcolor:'blue'},
					view({bgcolor:'white',  viewport:'2d', flex:1},
						label({text:'HELLO', fgcolor:'red'})
					)
				)
			)
		)
	]}
})