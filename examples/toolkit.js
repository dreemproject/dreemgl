define.class("$server/composition",function(require, $ui$, checkbox, button, icon, label, view, screen, cadgrid, $widgets$, toolkit) {
	
	this.render = function() {
		return [
			screen(
				{flexdirection:"row"},
				cadgrid({
						name:"grid", 
						flex:3, 
						overflow:"scroll", 
						bgcolor:vec4(0.3882105052471161,0.17095264792442322,0.3309330940246582,1), 
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
					view({height:278, width:430, bgcolor:vec4(0.7704077959060669,0.7716017365455627,0.768651008605957,1), position:'absolute', x:198.00064086914062, y:101.00056457519531},label({fontsize:54, bgcolor:'transparent', opaque:true, fgcolor:vec4(0.709774374961853,0.6159481406211853,0.8231146335601807,1), text:'0_o', position:'absolute', x:121.99871826171875, y:57.99919128417969, width:87.697265625, height:87.4800033569336})),
					view({height:310, width:273, bgcolor:'purple', position:'absolute', x:398.0011291503906, y:331.0006103515625, borderradius:vec4(2,1,1,30), opacity:0.91})
				),
				toolkit({
					position:'absolute', 
					x:120, 
					y:73.00083923339844, 
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