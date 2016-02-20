define.class("$server/composition",function(require, $ui$, checkbox, checkbox, icon, button, label, view, screen, cadgrid, $widgets$, toolkit) {
	
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
					view({height:416, width:325, bgcolor:vec4(0.7796770334243774,0.22304300963878632,0.35580340027809143,1), position:"absolute", margin:vec4(0,0,0,0), x:106.00006103515625, y:69.00015258789062},view({height:143, width:138, bgcolor:vec4(0,0.501960813999176,0.05704490840435028,1), position:"absolute", x:92, y:174.00001525878906, borderradius:vec4(10,30,60,80)},icon({fgcolor:vec4(0.929411768913269,0.7185189723968506,0.3921568691730499,1), opaque:true, icon:"flask", fontsize:80, position:"absolute", x:33, y:-16})),icon({fgcolor:vec4(0.885095477104187,0.8980835676193237,0.9214090704917908,1), opaque:true, icon:"ge", fontsize:80, position:"absolute", x:114.17538452148438, y:28.051132202148438})),
					label({fontsize:144, pickalpha:-1, bgcolor:"transparent", fgcolor:vec4(0.2965516149997711,0.6960710287094116,0.7355074286460876,1), text:"Howdy!", position:"absolute", x:348.99993896484375, y:361.0001220703125, width:504.4921875, height:233.27999877929688, opacity:0.6}),
					view({height:181, width:779, pickalpha:-1, bgcolor:vec4(0,0.2716766893863678,0.501960813999176,1), position:"absolute", x:208.0000457763672, y:593.9999389648438, alignitems:"center", justifycontent:"center"},icon({fgcolor:"cornflower", pickalpha:-1, icon:"flask", fontsize:80, position:"relative", x:0, y:0}),icon({fgcolor:"cornflower", pickalpha:-1, icon:"gear", fontsize:80, position:"relative", x:0, y:0})),
					view({height:25, width:648, bgcolor:vec4(0.860729455947876,0.864276111125946,0.19516445696353912,1), position:"absolute", x:347, y:544.0006103515625}),
					checkbox({tooldragroot:true, toolresize:false, fontsize:24, bgcolor:"transparent", buttoncolor1:"transparent", buttoncolor2:"transparent", hovercolor1:"transparent", hovercolor2:"transparent", pressedcolor1:"transparent", pressedcolor2:"transparent", pickalpha:-1, fgcolor:"pink", position:"absolute", x:871, y:293.00006103515625}),
					view({height:305, width:252, bgcolor:vec4(0.32335585355758667,0.5324464440345764,0.6069661378860474,1), position:"absolute", x:575.137939453125, y:52.87499237060547, rotate:vec3(0,0,0.5)},icon({fgcolor:vec4(0.929411768913269,0.9089215993881226,0.3921568691730499,1), opaque:true, icon:"heart", fontsize:140, position:"absolute", x:56.93695831298828, y:33.16679382324219, boldness:0.95}))
				),
				toolkit({
					position:"absolute", 
					visible:true, 
					rulers:true, 
					x:1121, 
					y:21.000064849853516, 
					width:400, 
					height:776, 
					dropmode:"absolute", 
					mode:"design", 
					reticlesize:9, 
					hoverlines:false
				}
				)
			)
		]
	}
}
)