//Pure JS based composition
define.class('$server/composition', function test(require, $ui$, view, screen){
	this.render = function(){ return [
		screen({
			init:function(){
				console.log(this)
			},
			clearcolor: vec4('red'),
			bg: true,
			layout: function(){
				console.log('leeout')
			},
			bgcolor: 'red', 
			overflow: 'scroll',
			mouseleftdown: function(){
				console.log('here')
			}
		})
	]}
})