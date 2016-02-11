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
					view({height:288, width:555, bgcolor:vec4(0.9318798184394836,0.31568998098373413,0.7469818592071533,1), position:'absolute', x:215.00051879882812, y:436.000244140625, borderradius:vec4(0,0,30,0)}),
					view({height:310, width:273, bgcolor:'purple', position:'absolute', x:216.00106811523438, y:110.00057983398438, borderradius:vec4(2,1,1,30), opacity:0.91}),
					view({height:356, width:362, bgcolor:'purple', position:'absolute', x:595.000732421875, y:49.00054931640625},label({fontsize:54, bgcolor:'transparent', opaque:true, fgcolor:'white', text:'0_o', position:'absolute', x:121.99871826171875, y:57.99919128417969, width:87.697265625, height:87.4800033569336})),
					icon({fgcolor:'cornflower', icon:'gear', fontsize:80, position:'absolute', opaque:true, x:894.000244140625, y:470.00018310546875, width:68.57142925262451, height:129.6})
				),
				toolkit({
					position:'absolute', 
					x:1068, 
					y:42.00083541870117, 
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