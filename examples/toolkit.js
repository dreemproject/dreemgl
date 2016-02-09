define.class("$server/composition",function(require, $ui$, button, icon, label, view, screen, cadgrid, $widgets$, toolkit) {
	
	this.render = function() {
		return [
			screen(
				{flexdirection:"row", position:'absolute', x:0, y:0, width:484, height:472},
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
						toolmove:false, 
						toolrect:false, 
						opaque:false
					},
					view({height:473, width:618, bgcolor:vec4(0.9318798184394836,0.31568998098373413,0.7469818592071533,1), position:'absolute', x:151.00010681152344, y:113.0001220703125},label({fontsize:54, bgcolor:'transparent', fgcolor:'white', text:'0_0', position:'absolute', x:156.00015258789062, y:29.999862670898438, width:NaN, height:NaN}),label({fontsize:44, opaque:true, fgcolor:'lightgreen', text:'Howdy!', position:'absolute', x:237.99986267089844, y:203.9999237060547})),
					view({height:257, width:451, bgcolor:vec4(0.12939296662807465,0.4936515688896179,0.6595012545585632,1), position:'absolute', x:538.1458129882812, y:222.90567016601562, rotate:vec3(0,0,10)}),
					label({fontsize:190, bgcolor:'transparent', fgcolor:vec4(0.9903326034545898,0.8860607147216797,0,1), text:'Howdy!', position:'absolute', x:167.30331420898438, y:308.59063720703125, rotate:vec3(0,0,-0.55)}),
					icon({fgcolor:vec4(0.3921568691730499,0.929411768913269,0.42688411474227905,1), icon:'anchor', position:'absolute', x:957.0000610351562, y:188, fontsize:180})
				),
				toolkit({
					flexdirection:"column"
				}
				)
			)
		]
	}
}
)