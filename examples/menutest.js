//Pure JS based composition
define.class('$server/composition', function($ui$, screen, view, menubar, button,label, speakergrid){
	
	
	this.justifycontent = "center" ;
	this.alignitems = "center" 
	
	this.render = function(){ return [
		screen({clearcolor:vec4('black'), title:"Small menu bar test frame"},
			view({flex:1, bg:'false'},
				speakergrid({ }
				,view({bgcolor:vec4(0,0.1,0.2,0.8) , flexdirection:"column"},view({bg:false},menubar({position:"relative",margin:0,flex:1}))))
			)
		)
	]}
})