//Pure JS based composition
define.class('$server/composition', function test(require, $ui$, label, screen, view, $widgets$, jsviewer){
	this.render = function(){ return [
		screen({clearcolor:vec4('black'), overflow:'scroll'},
			label({
				text:'hello',
				fgcolor:'black',
				font:require('$resources/fonts/ubuntu_monospace_ascii.glf'),
			})
		)
	]}
})