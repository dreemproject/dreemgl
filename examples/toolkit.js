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
					view({height:544, width:609, bgcolor:'purple', position:'absolute', x:43.000762939453125, y:98.00070190429688, borderradius:vec4(2,1,1,30)},view({height:240, width:249, bgcolor:vec4(0,0.24104894697666168,0.501960813999176,1), position:'absolute', x:264.0000915527344, y:100.99996948242188}),)
				),
				toolkit({
					position:'absolute', 
					x:1162, 
					y:38.00086975097656, 
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