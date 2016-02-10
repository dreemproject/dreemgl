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
					view({height:361, width:464, bgcolor:vec4(0.9318798184394836,0.31568998098373413,0.7469818592071533,1), position:'absolute', x:189.00030517578125, y:135.000244140625, borderradius:vec4(0,0,30,0)}),
					icon({fgcolor:'cornflower', icon:'gear', fontsize:80, position:'absolute', x:985, y:36.000244140625}),
					view({height:379, width:284, bgcolor:'purple', position:'absolute', x:675.9999389648438, y:44}),
					view({height:300, width:271, bgcolor:'purple', position:'absolute', x:386.00079345703125, y:521.0006713867188, borderradius:vec4(2,1,1,30), opacity:0.91},label({fontsize:54, bgcolor:'transparent', opaque:true, fgcolor:'white', text:'0_o', position:'absolute', x:91.99862670898438, y:26.999069213867188})),
					icon({fgcolor:vec4(0.7616903185844421,0.37841081619262695,0,1), icon:'gear', fontsize:80, position:'absolute', x:722.0000610351562, y:33.00005340576172})
					
				),
				toolkit({
					position:'absolute', 
					x:1110, 
					y:46.000823974609375, 
					width:393, 
					height:788, 
					visible:true, 
					animateborder:false
				}
				)
			)
		]
	}
}
)