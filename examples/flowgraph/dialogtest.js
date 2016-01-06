//Pure JS based composition
define.class('$server/composition', function(require, $ui$,treeview,  speakergrid, splitcontainer, screen, view, label, button, $widgets$, propviewer, colorpicker, $$, flowgraph, renamedialog, newcompositiondialog, opencompositiondialog){	

	
	this.render = function(){		
		return [
			screen({
				bg:0,
				clearcolor:vec4('blue'),
				flexwrap:"nowrap", 
				flexdirection:"row",
				style:{
					$:{
						fontsize:12
					}
				}},
				speakergrid({bgcolor:"blue", clearcolor:"blue"},
					label({margin:10, fontsize:30, text:"Rename composition", bg:false}),
					renamedialog(),
					label({margin:10, fontsize:30, text:"New composition", bg:false}),
					newcompositiondialog(),
					label({margin:10, fontsize:30, text:"Open composition", bg:false}),
					opencompositiondialog()
				)
			)
		]		
	}
})