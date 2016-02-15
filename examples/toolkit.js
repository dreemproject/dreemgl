define.class("$server/composition",function(require, $ui$, icon, button, checkbox, label, view, screen, cadgrid, $widgets$, toolkit) {
	
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
					view({height:399, width:452, bgcolor:vec4(0,0.501960813999176,0.29542306065559387,1), position:"absolute", x:59.99993896484375, y:38.000030517578125}),
					view({height:382, width:362, bgcolor:"purple", position:"absolute", x:694, y:142.00003051757812},label({fontsize:74, opaque:true, fgcolor:vec4(0.1089630052447319,0.5584797263145447,0.7466379404067993,1), text:"0_o", position:"absolute", x:59.00006103515625, y:90})),
					icon({fgcolor:vec4(0.4585062861442566,0.4850725829601288,0.6486908197402954,1), opaque:true, icon:"ge", fontsize:80, position:"absolute", x:576, y:134})
				),
				toolkit({
					position:"absolute", 
					x:1114, 
					y:19, 
					width:431, 
					height:700, 
					visible:true
				}
				)
			)
		]
	}
}
)