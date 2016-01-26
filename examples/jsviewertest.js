//Pure JS based composition
define.class(function(require, $server$, composition, $ui$, screen, view, $widgets$, jsviewer){
	this.render = function(){ return [
		screen({name:'default', clearcolor:vec4('black')},
			jsviewer({flex:1, overflow:'scroll', 
				source:require('./flexbox1').module.factory.body.toString()
			})
		)
	]}
})
