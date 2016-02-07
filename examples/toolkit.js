define.class("$server/composition",function(require, $ui$, icon, label, view, screen, cadgrid, $widgets$, toolkit) {
	
	this.render = function(bla) {
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
					view({height:357,width:443, bgcolor:vec4(0,0.501960813999176,0.03174766153097153,1), position:'absolute', x:78.74984741210938, y:90.99996185302734},view({height:177, width:195, bgcolor:vec4(0.9339837431907654,0.8454103469848633,0.06254260987043381,1), position:'absolute', x:77.75013732910156, y:57.999969482421875, borderwidth:vec4(1,0,0,0)}),label({fontsize:70, bgcolor:'transparent', fgcolor:'lightgreen', text:'Howdy!', position:'absolute', x:77.99983215332031, y:363.0000305175781, width:NaN, height:NaN})),
					view({height:150, width:187, bgcolor:vec4(0.8890466094017029,0.514293909072876,0.6321912407875061,1), position:'absolute', x:772, y:451.99993896484375, borderradius:vec4(11,7,2,16)}),
					label({fontsize:24, bgcolor:'transparent', fgcolor:'lightgreen', text:'Howdy!', position:'absolute', x:457, y:486}),
					view({height:250, width:305, bgcolor:vec4(0,0.501960813999176,0.4905743896961212,1), position:'absolute', x:658.0000610351562, y:49},icon({fgcolor:vec4(0.9129186868667603,0.9196687936782837,0.9317914843559265,1), icon:'flask', position:'absolute', x:82.9998779296875, y:37.99999237060547, fontsize:80}))
				),
				toolkit()
			)
		]
	}
}
)