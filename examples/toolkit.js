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
					view({height:473, width:618, bgcolor:vec4(0.608367383480072,0.9318798184394836,0.31568998098373413,1), position:'absolute', x:39, y:120.00009155273438}),
					view({height:257, width:451, bgcolor:vec4(0.26616209745407104,0.7584172487258911,0.5933423042297363,1), position:'absolute', x:667.0001220703125, y:284.0000305175781}),
					label({fontsize:190, bgcolor:'transparent', fgcolor:vec4(0.9903326034545898,0.8860607147216797,0,1), text:'Howdy!', position:'absolute', x:185.77291870117188, y:250.35304260253906, rotate:vec3(0,0,-0.55)}),
					icon({fgcolor:vec4(0.8438690900802612,0.4203698933124542,0.7602147459983826,1), icon:'gear', position:'absolute', x:754.0001220703125, y:47.99999237060547, fontsize:80}),
					icon({fgcolor:vec4(0.3921568691730499,0.929411768913269,0.42688411474227905,1), icon:'anchor', position:'absolute', x:930.0001220703125, y:37.999969482421875, fontsize:180})
				),
				toolkit({flexdirection:"column"})
			)
		]
	}
}
)