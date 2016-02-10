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
					view({height:288, width:555, bgcolor:vec4(0.9318798184394836,0.31568998098373413,0.7469818592071533,1), position:'absolute', x:131.00048828125, y:384.00030517578125, borderradius:vec4(0,0,30,0)}),
					icon({fgcolor:'cornflower', icon:'gear', fontsize:80, position:'absolute', opaque:true, x:155.00009155273438, y:66.00020599365234, width:68.57142925262451, height:129.6}),
					label({fontsize:54, bgcolor:'transparent', opaque:true, fgcolor:'white', text:'0_o', position:'absolute', x:943.9993896484375, y:244.999755859375, width:87.697265625, height:87.4800033569336}),
					view({height:310, width:273, bgcolor:'purple', position:'absolute', x:1430.0009765625, y:222.00057983398438, borderradius:vec4(2,1,1,30), opacity:0.91}),
					view({height:356, width:362, bgcolor:'purple', position:'absolute', x:511.000732421875, y:201.00047302246094})
				),
				toolkit({
					position:'absolute', 
					x:1086, 
					y:28.000831604003906, 
					width:393, 
					height:788, 
					visible:true, 
					animateborder:false, 
					rulers:true
				}
				)
			)
		]
	}
}
)