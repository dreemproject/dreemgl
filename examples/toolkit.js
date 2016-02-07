define.class("$server/composition",function(require, $ui$, icon, label, view, screen, cadgrid, $widgets$, toolkit) {
	
	this.render = function() {
		return [
			screen(
				{flexdirection:"row", position:'absolute', x:1483.0421142578125, y:0, width:NaN, height:NaN},
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
						anchor:vec3(0,0,0), 
						toolmove:false
					},
					view({height:357, width:443, bgcolor:vec4(0,0.501960813999176,0.03174766153097153,1), position:'absolute', x:78.74984741210938, y:90.99996185302734},view({height:177, width:195, bgcolor:vec4(0.9339837431907654,0.8454103469848633,0.06254260987043381,1), position:'absolute', x:157.7501678466797, y:33.999969482421875, borderwidth:vec4(1,0,0,0)}),label({fontsize:70, bgcolor:'transparent', fgcolor:'lightgreen', text:'Howdy!', position:'absolute', x:108.99983215332031, y:216.00003051757812, width:NaN, height:NaN})),
					view({height:348, width:431, bgcolor:vec4(0.4404359459877014,0.7965562343597412,0.8361037373542786,1), position:'absolute', x:695.0000610351562, y:53.999969482421875},view({height:60, width:60, bgcolor:vec4(0,0.17658153176307678,0.501960813999176,1), position:'absolute', x:314.0001220703125, y:46.99998474121094}),view({height:132, width:148, bgcolor:vec4(1,0.7453832626342773,0.8892711400985718,1), position:'absolute', x:41.99993896484375, y:83.99998474121094, pos:vec3(31,130,0), size:vec3(149,132,NaN), dropshadowradius:20}),icon({fgcolor:vec4(0.970705509185791,0.9806346297264099,0.9984665513038635,1), icon:'flask', position:'absolute', x:276.99993896484375, y:184.99998474121094, fontsize:58})),
					view({height:150, width:187, bgcolor:'purple', position:'absolute', x:580, y:452}),
					label({fontsize:24, bgcolor:'transparent', fgcolor:'lightgreen', text:'Howdy!', position:'absolute', x:457, y:486})
				),
				toolkit()
			)
		]
	}
}
)