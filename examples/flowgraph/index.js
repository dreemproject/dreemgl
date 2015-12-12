//Pure JS based composition
define.class(function($server$,composition, role,require, $ui$,treeview,  cadgrid, splitcontainer, screen, view, label, button, $widgets$, propviewer, colorpicker, $$, flowgraph){	
	
	
	this.render = function(){ 
		console.log("hmm!!");

		return [
		role(
			screen({bg:0,clearcolor:vec4('black'),flexwrap:"nowrap", flexdirection:"row"}
				,flowgraph()
			)
		)
	]}
})