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
					view({height:344, width:829, bgcolor:vec4(0.9318798184394836,0.31568998098373413,0.7469818592071533,1), position:'absolute', x:316.0000915527344, y:123.00013732910156},label({fontsize:54, bgcolor:'transparent', fgcolor:'white', text:'0_o', position:'absolute', x:402.000244140625, y:96.99986267089844, width:NaN, height:NaN}),label({fontsize:44, opaque:true, fgcolor:'lightgreen', text:'Howdy!', position:'absolute', x:237.9998779296875, y:203.9999237060547})),
					view({height:200, width:419, bgcolor:vec4(0.12939296662807465,0.4936515688896179,0.6595012545585632,1), position:'absolute', x:13.449462890625, y:261.4250946044922, rotate:vec3(0,0,10)}),
					label({fontsize:190, bgcolor:'transparent', fgcolor:vec4(0.9903326034545898,0.8860607147216797,0,1), text:'Howdy!', position:'absolute', x:353.9295654296875, y:111.42225646972656, rotate:vec3(0,0,-0.55)}),
					icon({fgcolor:vec4(0.3921568691730499,0.929411768913269,0.42688411474227905,1), icon:'anchor', position:'absolute', x:198.00015258789062, y:9.000015258789062, fontsize:180}),
					icon({fgcolor:'cornflower', icon:'flask', fontsize:80, position:'absolute', x:774.0000610351562, y:444}),
					icon({fgcolor:vec4(0.7616903185844421,0.37841081619262695,0,1), icon:'gear', fontsize:80, position:'absolute', x:567, y:448.00006103515625, bgcolor:vec4(NaN,NaN,NaN,1)}),
					checkbox({fontsize:24, fgcolor:'pink', position:'absolute', x:141.99993896484375, y:236, width:NaN, height:NaN}),
					button({fontsize:24, fgcolor:'red', text:'Press Me!', position:'absolute', x:305, y:401.99993896484375})
				),
				toolkit({
					position:'absolute', 
					x:1187, 
					y:11.000389099121094, 
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