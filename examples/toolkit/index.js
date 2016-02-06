define.class("$server/composition",function(require, $ui$, icon, label, view, screen, cadgrid, $widgets$, toolkit) {
	
	this.render = function() {
		return [
			screen(
				{flexdirection:"row"},
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
						justifycontent:'center'
					},
					view({height:309, width:343, bgcolor:vec4(0,0.501960813999176,0.03174766153097153,1), position:'absolute', x:78.00003051757812, y:94.99983215332031}),
					view({height:287, width:278, bgcolor:vec4(0,0.501960813999176,0.3736295700073242,1), position:'absolute', x:750.0001220703125, y:50}),
					icon({fgcolor:'cornflower', icon:'flask', position:'absolute', x:788.0000305175781, y:394}),
					view({height:196, width:147, bgcolor:'purple', position:'absolute', x:1061, y:300}),
					view({height:354, width:275, bgcolor:vec4(0.9113264083862305,0.14734770357608795,0.9113264083862305,1), position:'absolute', x:452.00006103515625, y:214.99993896484375}),
					view({height:60, width:60, bgcolor:'purple', position:'absolute', x:839, y:408})
				),
				toolkit({inspect:"grid"})
				
			)
		]
	}
}
)