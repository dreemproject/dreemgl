define.class("$server/composition",function(require, $ui$, checkbox, button, icon, label, view, screen, cadgrid, $widgets$, toolkit) {
	
	this.render = function() {
		return [
			screen(
				{flexdirection:"row"},
				cadgrid({
						name:"grid", 
						flex:3, 
						overflow:"scroll", 
						bgcolor:vec4(0.08853328227996826,0.11556218564510345,0.16508188843727112,1), 
						gridsize:8, 
						majorevery:5, 
						majorline:vec4(0.34117648005485535,0.34117648005485535,0.34117648005485535,1), 
						minorline:vec4(0.17135260999202728,0.17135260999202728,0.17135260999202728,1), 
						alignitems:'center', 
						alignself:'stretch', 
						flexdirection:'column', 
						justifycontent:'center', 
						anchor:vec3(0,0,0), 
						toolmove:false, 
						toolrect:false
					},
					view({height:302, width:297, bgcolor:vec4(0.13262520730495453,0.2034073919057846,0.028474919497966766,1), position:'absolute', x:45.000701904296875, y:120.00064086914062},label({fontsize:54, bgcolor:'transparent', opaque:true, fgcolor:vec4(0.709774374961853,0.6159481406211853,0.8231146335601807,1), text:'0_o', position:'absolute', x:96.99905395507812, y:112.99983215332031, width:87.697265625, height:87.4800033569336})),
					view({height:310, width:273, bgcolor:'purple', position:'absolute', x:706.0010986328125, y:118.00064086914062, borderradius:vec4(2,1,1,30), opacity:0.91})
				),
				toolkit({
					position:'absolute', 
					x:1183, 
					y:29.00084686279297, 
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