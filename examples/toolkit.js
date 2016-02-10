define.class("$server/composition",function(require, $ui$, checkbox, button, icon, label, view, screen, cadgrid, $widgets$, toolkit) {
	
	this.render = function() {
		return [
			screen(
				{flexdirection:"row", position:'absolute', x:-128.00003051757812, y:1.00006103515625, width:484, height:472},
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
					view({height:344, width:829, bgcolor:vec4(0.9318798184394836,0.31568998098373413,0.7469818592071533,1), position:'absolute', x:167.00018310546875, y:124.00018310546875},label({fontsize:54, bgcolor:'transparent', fgcolor:'white', text:'0_o', position:'absolute', x:402.000244140625, y:96.99986267089844, width:NaN, height:NaN}),label({fontsize:44, opaque:true, fgcolor:'lightgreen', text:'Howdy!', position:'absolute', x:283, y:192, width:NaN, height:NaN})),
					view({height:200, width:419, bgcolor:vec4(0.12939296662807465,0.4936515688896179,0.6595012545585632,1), position:'absolute', x:119.13858032226562, y:167.55235290527344, rotate:vec3(0,0,10)}),
					label({fontsize:190, bgcolor:'transparent', fgcolor:vec4(0.9903326034545898,0.8860607147216797,0,1), text:'Howdy!', position:'absolute', x:437.62493896484375, y:370.13726806640625, rotate:vec3(0,0,-0.55)}),
					icon({fgcolor:vec4(0.3921568691730499,0.929411768913269,0.42688411474227905,1), icon:'anchor', position:'absolute', x:144.0001220703125, y:418, fontsize:180}),
					icon({fgcolor:'cornflower', icon:'gear', fontsize:80, position:'absolute', x:541, y:560.0001831054688}),
					icon({fgcolor:vec4(0.7616903185844421,0.37841081619262695,0,1), icon:'gear', fontsize:80, position:'absolute', x:635.0000610351562, y:565.0001220703125, bgcolor:vec4(NaN,NaN,NaN,1)}),
					button({fontsize:24, fgcolor:'red', text:'Press Me!', position:'absolute', x:326, y:420.99993896484375})
				),
				toolkit({
					position:'absolute', 
					x:1046, 
					y:73.00065612792969, 
					width:468, 
					height:691, 
					visible:true, 
					animateborder:false, 
					groupdrag:true, 
					opacity:0.7, 
					reticlesize:7
				}
				)
			)
		]
	}
}
)