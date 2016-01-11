//Pure JS based composition
define.class('$server/composition', function(require, $ui$,treeview,  speakergrid, splitcontainer, screen, view, label, button, $widgets$, propviewer, colorpicker, $$, flowgraph, renamedialog, newcompositiondialog, opencompositiondialog, aboutdialog, docviewerdialog, renameblockdialog){	

	this.flexwrap = "nowrap";
	this.overflow = "scroll"
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
					},
					"textbox":{
						padding:4
					}
				}},
				speakergrid({glowcolor:"#505060",  flexwrap:"nowrap", overflow:"scroll" },
					label({margin:10, paddingtop:10, fontsize:30, text:"Rename block", bg:false}),
					renameblockdialog({oldname:"this is my old name" }),
					label({margin:10, paddingtop:10, fontsize:30, text:"Rename composition", bg:false}),
					renamedialog(),
					label({margin:10, fontsize:30, text:"New composition", bg:false}),
					newcompositiondialog(),
					label({margin:10, fontsize:30, text:"Open composition", bg:false}),
					opencompositiondialog(),
					label({margin:10, fontsize:30, text:"About", bg:false}),
					aboutdialog(),
					label({margin:10, fontsize:30, text:"Docviewer", bg:false}),
					docviewerdialog({title:"I am a custom markdown viewer" , body:"Huzzah"})
				)
			)
		]		
	}
})