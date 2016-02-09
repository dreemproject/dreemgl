define.class("$server/composition",function(require, $ui$, checkbox, button, icon, label, view, screen, cadgrid, $widgets$, toolkit) {
	
	this.render = function() {
		return [
			screen(
				{flexdirection:"row", position:'absolute', x:4, y:0, width:484, height:472},
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
					view({height:473, width:618, bgcolor:vec4(0.9318798184394836,0.31568998098373413,0.7469818592071533,1), position:'absolute', x:658.0001220703125, y:120.00018310546875},label({fontsize:54, bgcolor:'transparent', fgcolor:'white', text:'0_o', position:'absolute', x:402.000244140625, y:96.99986267089844, width:NaN, height:NaN}),label({fontsize:44, opaque:true, fgcolor:'lightgreen', text:'Howdy!', position:'absolute', x:237.9998779296875, y:203.9999237060547})),
					view({height:257, width:451, bgcolor:vec4(0.12939296662807465,0.4936515688896179,0.6595012545585632,1), position:'absolute', x:141.96026611328125, y:225.61598205566406, rotate:vec3(0,0,10)}),
					label({fontsize:190, bgcolor:'transparent', fgcolor:vec4(0.9903326034545898,0.8860607147216797,0,1), text:'Howdy!', position:'absolute', x:98.04252624511719, y:127.43547058105469, rotate:vec3(0,0,-0.55)}),
					icon({fgcolor:vec4(0.3921568691730499,0.929411768913269,0.42688411474227905,1), icon:'anchor', position:'absolute', x:485, y:422.0000305175781, fontsize:180}),
					icon({fgcolor:'cornflower', icon:'flask', fontsize:80, position:'absolute', x:822, y:133.00003051757812}),
					icon({fgcolor:vec4(0.7616903185844421,0.37841081619262695,0,1), icon:'gear', fontsize:80, position:'absolute', x:466, y:72.00003051757812, bgcolor:vec4(NaN,NaN,NaN,1)}),
					checkbox({fontsize:24, fgcolor:'pink', position:'absolute', x:256, y:125.00000762939453})
				),
				toolkit({
					position:'absolute', 
					x:1253, 
					y:14.000370025634766, 
					width:378, 
					height:709, 
					visible:true, 
					animateborder:false
				}
				)
			)
		]
	}
}
)