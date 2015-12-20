//Pure JS based composition
define.class(function test(require, $server$, composition, role, $ui$, label, screen, view, $widgets$, jsviewer){
	this.render = function(){ return [
		role(
			screen({clearcolor:vec4('black'), overflow:'scroll'},
				label({
					text:'hello',
					fgcolor:'black',
					font:require('$resources/fonts/ubuntu_monospace_ascii.glf'),
				})
			)
		)
	]}
})