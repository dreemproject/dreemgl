define.class("$server/composition",function(require, $ui$, button, icon, label, view, screen, cadgrid, $widgets$, toolkit) {
	
	this.render = function() {
		return [
			screen(
				{flexdirection:"row", position:'absolute', x:463, y:-383, width:484, height:472},
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
					view({height:473, width:618, bgcolor:vec4(0.9318798184394836,0.31568998098373413,0.7469818592071533,1), position:'absolute', x:43.00016784667969, y:18.000076293945312},label({fontsize:54, bgcolor:'transparent', fgcolor:'white', text:'0_0', position:'absolute', x:156.00015258789062, y:29.999862670898438, width:NaN, height:NaN})),
					view({height:257, width:451, bgcolor:vec4(0.12939296662807465,0.4936515688896179,0.6595012545585632,1), position:'absolute', x:377.924560546875, y:55.101898193359375, rotate:vec3(0,0,10)}),
					label({fontsize:190, bgcolor:'transparent', fgcolor:vec4(0.9903326034545898,0.8860607147216797,0,1), text:'Howdy!', position:'absolute', x:117.06063842773438, y:106.86102294921875, rotate:vec3(0,0,-0.55)}),
					icon({fgcolor:vec4(0.3921568691730499,0.929411768913269,0.42688411474227905,1), icon:'anchor', position:'absolute', x:726.0000610351562, y:165, fontsize:180}),
					icon({fgcolor:vec4(0.929411768913269,0.9167269468307495,0.3921568691730499,1), icon:'gear', position:'absolute', x:639.0001220703125, y:34.000091552734375, fontsize:480, opaque:false}),
					icon({fgcolor:'cornflower', icon:'glass', position:'absolute', x:962, y:40.99998474121094, fontsize:180})
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