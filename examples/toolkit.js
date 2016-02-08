define.class("$server/composition",function(require, $ui$, icon, label, view, screen, cadgrid, $widgets$, toolkit) {
	
	this.render = function() {
		return [
			screen(
				{flexdirection:"row", position:'absolute', x:308.00006103515625, y:118.00001525878906, width:484, height:472},
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
						toolrect:false
					},
					view({height:473, width:618, bgcolor:vec4(0.9318798184394836,0.31568998098373413,0.7469818592071533,1), position:'absolute', x:55.0001220703125, y:62.00007629394531},label({fontsize:54, bgcolor:'transparent', fgcolor:'white', text:'0_0', position:'absolute', x:156.00015258789062, y:29.999862670898438, width:NaN, height:NaN})),
					view({height:257, width:451, bgcolor:vec4(0.12939296662807465,0.4936515688896179,0.6595012545585632,1), position:'absolute', x:701.1667404174805, y:539.9884033203125, rotate:vec3(0,0,10)}),
					label({fontsize:190, bgcolor:'transparent', fgcolor:vec4(0.9903326034545898,0.8860607147216797,0,1), text:'Howdy!', position:'absolute', x:117.06063842773438, y:106.86102294921875, rotate:vec3(0,0,-0.55)}),
					icon({fgcolor:vec4(0.4203698933124542,0.759999692440033,0.8438690900802612,1), icon:'gear', position:'absolute', x:545.000244140625, y:44.99999237060547, fontsize:80}),
					icon({fgcolor:vec4(0.3921568691730499,0.929411768913269,0.42688411474227905,1), icon:'anchor', position:'absolute', x:212.0001220703125, y:593, fontsize:180}),
					view({height:117, width:134, bgcolor:vec4(1,0.8303571343421936,0.47680214047431946,1), position:'absolute', x:1006, y:217.00001525878906, borderradius:vec4(10,10,0,10), borderwidth:vec4(0,0,10,0), bordercolor:vec4(0.2679905891418457,0.3232444226741791,0.42181396484375,1)}),
					view({height:60, width:60, bgcolor:'purple', position:'absolute', x:872.0000610351562, y:276})
				),
				toolkit({flexdirection:"column"})
			)
		]
	}
}
)