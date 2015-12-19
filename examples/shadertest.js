//Pure JS based composition
define.class(function test($server$, composition, role, $ui$, screen, view, $widgets$, jsviewer){
	this.render = function(){ return [
		role(
			screen({clearcolor:vec4('black'), overflow:'scroll'},
				jsviewer({
					source: test.toString()
				})
			)
		)
	]}
})