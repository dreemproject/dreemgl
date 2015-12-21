//Pure JS based composition
define.class('$server/composition', function($ui$, screen, view, label){
	this.render = function(){ return [
		screen({clearcolor:vec4('blue')},
			view({flex:1, bgcolor:'blue'},
				view({bgcolor:'red', flex:1, borderradius:40, borderwidth:30, bordercolor:'orange'})
			)
		)
	]}
})