define.class("$server/composition",function(require, $ui$, icon, label, view, screen, splitcontainer, cadgrid, $widgets$, toolkit) {
	
	this.render = function() {
		return [
			screen(
				splitcontainer(
					cadgrid({
							name:"grid", 
							flex:3, 
							overflow:"scroll", 
							bgcolor:"#4e4e4e", 
							gridsize:10, 
							majorevery:5, 
							majorline:"#575757", 
							minorline:"#484848", 
							alignitems:'center', 
							alignself:'stretch', 
							flexdirection:'column', 
							justifycontent:'center', 
							x:159.99998474121094, 
							y:240
						},
						view({height:309, width:343, bgcolor:vec4(1,1,1,1), position:'absolute', x:452, y:267.9999694824219, dropshadowopacity:0.43, dropshadowradius:20.01, dropshadowoffset:vec2(23,3), dropshadowhardness:0.69, dropshadowcolor:vec4(0,0,0,1)}),
						view({height:195, width:247, bgcolor:vec4(0,0.501960813999176,0.3736295700073242,1), position:'absolute', x:113.00015258789062, y:311}),
						icon({fgcolor:'cornflower', icon:'flask', position:'absolute', x:762, y:150.99996948242188}),
						view({height:196, width:147, bgcolor:'purple', position:'absolute', x:1061, y:300}),
						view({height:354, width:275, bgcolor:vec4(0.9113264083862305,0.14734770357608795,0.9113264083862305,1), position:'absolute', x:137.00013732910156, y:596.9998779296875}),
						view({height:60, width:60, bgcolor:'purple', position:'absolute', x:373.00006103515625, y:146})
					),
					toolkit({inspect:"grid"})
				)
			)
		]
	}
}
)