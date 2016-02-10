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
						toolrect:false, 
						opaque:false
					},
					view({height:361, width:851, bgcolor:vec4(0.9318798184394836,0.31568998098373413,0.7469818592071533,1), position:'absolute', x:128.000244140625, y:52.000244140625},label({fontsize:54, bgcolor:'transparent', fgcolor:'white', text:'0_o', position:'absolute', x:316.0003662109375, y:62.999847412109375, width:NaN, height:NaN}),label({fontsize:44, opaque:true, fgcolor:'lightgreen', text:'Howdy!', position:'absolute', x:206, y:217, width:NaN, height:NaN})),
					view({height:200, width:419, bgcolor:vec4(0.12939296662807465,0.4936515688896179,0.6595012545585632,1), position:'absolute', x:192.96630859375, y:530.6354370117188, rotate:vec3(0,0,10)}),
					label({fontsize:190, bgcolor:'transparent', fgcolor:vec4(0.9903326034545898,0.8860607147216797,0,1), text:'Howdy!', position:'absolute', x:493.013671875, y:46.78999328613281, rotate:vec3(0,0,-0.55)}),
					icon({fgcolor:vec4(0.3921568691730499,0.929411768913269,0.42688411474227905,1), icon:'anchor', position:'absolute', x:144.0001220703125, y:418, fontsize:180}),
					icon({fgcolor:'cornflower', icon:'gear', fontsize:80, position:'absolute', x:857, y:483.00018310546875}),
					icon({fgcolor:vec4(0.7616903185844421,0.37841081619262695,0,1), icon:'gear', fontsize:80, position:'absolute', x:732.0000610351562, y:456.0001220703125, bgcolor:vec4(NaN,NaN,NaN,1)}),
					button({fontsize:24, fgcolor:'red', text:'Press Me!', position:'absolute', x:255, y:265.99993896484375}),
					view({height:66, width:570, bgcolor:'purple', position:'absolute', x:154.99996948242188, y:713.9998779296875})
				),
				toolkit({
					position:'absolute', 
					x:1165, 
					y:53.00068664550781, 
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