define.class("$server/composition",function(require, $ui$, checkbox, button, icon, label, view, screen, cadgrid, $widgets$, toolkit) {
	
	this.render = function() {
		return [
			screen(
				{flexdirection:"row"},
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
					view({height:361, width:851, bgcolor:vec4(0.9318798184394836,0.31568998098373413,0.7469818592071533,1), position:'absolute', x:97.00027465820312, y:80.000244140625, borderradius:vec4(0,0,30,0)},label({fontsize:54, bgcolor:'transparent', fgcolor:'white', text:'0_o', position:'absolute', x:50.00054931640625, y:43.99986267089844}),label({fontsize:44, opaque:true, fgcolor:'lightgreen', text:'Howdy!', position:'absolute', x:448, y:106})),
					view({height:200, width:419, bgcolor:vec4(0.12939296662807465,0.4936515688896179,0.6595012545585632,1), position:'absolute', x:651.5213623046875, y:274.14263916015625, rotate:vec3(0,0,10), borderradius:vec4(40,2,30,10), opacity:0.7}),
					label({fontsize:190, bgcolor:'transparent', fgcolor:vec4(0.9903326034545898,0.8860607147216797,0,1), text:'Howdy!', position:'absolute', x:462.013671875, y:183.9596710205078, rotate:vec3(0,0,-0.55)}),
					icon({fgcolor:vec4(0.3921568691730499,0.929411768913269,0.42688411474227905,1), icon:'anchor', position:'absolute', x:349.0001525878906, y:368.0000305175781, fontsize:180}),
					icon({fgcolor:'cornflower', icon:'gear', fontsize:80, position:'absolute', x:323.0000305175781, y:637.000244140625}),
					icon({fgcolor:vec4(0.7616903185844421,0.37841081619262695,0,1), icon:'gear', fontsize:80, position:'absolute', x:675.0001220703125, y:530.0001220703125}),
					button({fontsize:24, fgcolor:'red', text:'Press Me!', position:'absolute', x:976, y:62.999977111816406}),
					view({height:300, width:271, bgcolor:'purple', position:'absolute', x:256.00006103515625, y:228.00015258789062, borderradius:vec4(2,1,1,30)}),
					checkbox({fontsize:24, fgcolor:'pink', position:'absolute', x:33.0000114440918, y:146})
				),
				toolkit({
					position:'absolute', 
					x:1187, 
					y:52.00072479248047, 
					width:436, 
					height:702, 
					visible:true
				}
				)
			)
		]
	}
}
)