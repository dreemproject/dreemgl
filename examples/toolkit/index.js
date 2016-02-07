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
						gridsize:1, 
						majorevery:5, 
						majorline:vec4(0.34117648005485535,0.34117648005485535,0.34117648005485535,1), 
						minorline:vec4(0.2823529541492462,0.2823529541492462,0.2823529541492462,1), 
						alignitems:'center', 
						alignself:'stretch', 
						flexdirection:'column', 
						justifycontent:'center', 
						x:0, 
						y:1
					},
					view({height:309, width:343, bgcolor:vec4(0,0.501960813999176,0.03174766153097153,1), position:'absolute', x:78.00003051757812, y:94.99983215332031}),
					view({height:287, width:278, bgcolor:vec4(0,0.501960813999176,0.3736295700073242,1), position:'absolute', x:750.0001220703125, y:50}),
					icon({fgcolor:vec4(0.929411768913269,0.42884936928749084,0.3921568691730499,1), icon:'flask', position:'absolute', x:932, y:434, fontsize:18}),
					view({height:196, width:147, bgcolor:vec4(0.8917636871337891,0.8946470022201538,0.03755294904112816,1), position:'absolute', x:1061, y:300}),
					view({height:354, width:275, bgcolor:vec4(0.9113264083862305,0.14734770357608795,0.9113264083862305,1), position:'absolute', x:452.0001220703125, y:214.99993896484375}),
					view({height:60, width:60, bgcolor:vec4(0.5342326164245605,0.6136919856071472,0.8747740983963013,1), position:'absolute', x:619, y:102.99996948242188, bordercolor:vec4(0,0,0,0)})
				),
				toolkit()
			)
		]
	}
}
)