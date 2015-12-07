//Pure JS based composition
define.class(function($server$, composition, role, $ui$, screen, view, label){
	this.render = function(){ return [
		role(
			screen({clearcolor:vec4('blue')},
				view({flex:1, bgcolor:'blue'},
					view({bgcolor:'red', flex:1, borderradius:40, borderwidth:30, bordercolor:'orange'})
				)
			)
		)
	]}
})