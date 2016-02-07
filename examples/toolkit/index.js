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
						gridsize:8, 
						majorevery:5, 
						majorline:vec4(0.34117648005485535,0.34117648005485535,0.34117648005485535,1), 
						minorline:vec4(0.2823529541492462,0.2823529541492462,0.2823529541492462,1), 
						alignitems:'center', 
						alignself:'stretch', 
						flexdirection:'column', 
						justifycontent:'center', 
						x:0, 
						y:0
					},
					view({height:309, width:343, bgcolor:vec4(0,0.501960813999176,0.03174766153097153,1), position:'absolute', x:337.0000305175781, y:232.9998016357422}),
					view({height:60, width:60, bgcolor:vec4(0.5342326164245605,0.6136919856071472,0.8747740983963013,1), position:'absolute', x:981, y:129.99996948242188, bordercolor:vec4(0,0,0,0)}),
					view({height:325, width:75, bgcolor:vec4(0.17111018300056458,0.17234812676906586,0.8197981119155884,1), position:'absolute', x:235.00006103515625, y:127}),
					label({bgcolor:'transparent', fgcolor:'lightgreen', text:'Howdy!', position:'absolute', x:404.00006103515625, y:27, fontsize:102.5, boldness:0})
				),
				toolkit()
			)
		]
	}
}
)