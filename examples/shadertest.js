//Pure JS based composition
define.class('$server/composition', function test(require, $ui$, view, screen){
	this.render = function(){ return [
		screen({clearcolor:vec4('black'), overflow:'scroll'}
		)
	]}
})