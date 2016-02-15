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
					view({height:305, width:252, bgcolor:vec4(0.32335585355758667,0.5324464440345764,0.6069661378860474,1), position:"absolute", x:174.99998474121094, y:226.00001525878906}),
					icon({fgcolor:"cornflower", opaque:true, icon:"ge", fontsize:80, position:"absolute", x:723, y:141.00003051757812}),
					icon({fgcolor:"cornflower", opaque:true, icon:"flask", fontsize:80, position:"absolute", x:752, y:374}),
					icon({fgcolor:"cornflower", opaque:true, icon:"flask", fontsize:80, position:"absolute", x:555.9999694824219, y:298.0000305175781}),
					view({height:310, width:244, bgcolor:"purple", position:"absolute", x:870, y:281}),
					view({height:143, width:138, bgcolor:"purple", position:"absolute", x:451.9999694824219, y:153})
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