define.class("$server/composition",function(require, $ui$, checkbox, icon, button, drawer, label, view, screen, cadgrid, $widgets$, toolkit) {

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
					drawer(
						{
							flex:0,
							width:200,
							height:60,
							min:-0.65,
							max:0.6
						},
						view({flex:1, bgcolor:"gray", alignitems:"center", justifycontent:"center"},
							label({text:"Drawer"})),
						view({bgcolor:"yellow", flex:1, alignitems:"center", justifycontent:"flex-end"},
							label({text:"Right Tray", fgcolor:"purple", fontsize:24, marginright:10})),
						view({bgcolor:"purple", flex:1, alignitems:"center"},
							label({text:"Left Tray", fgcolor:"yellow", fontsize:24, marginleft:10}))
					)
				),
				toolkit({visible:false, position:"absolute", x:781, y:90.99999237060547, width:400, height:800})
			)
		]
	}
}
)
