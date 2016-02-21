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
						majorline:vec4(0.06671861559152603,0.26168233156204224,0.34268006682395935,1),
						minorline:vec4(0.1546473354101181,0.1543203890323639,0.12822513282299042,1),
						alignitems:'center',
						alignself:'stretch',
						flexdirection:'column',
						justifycontent:'center',
						anchor:vec3(0,0,0),
						toolmove:false,
						toolrect:false
					},
					view({height:391, width:313, bgcolor:vec4(0.7796770334243774,0.22304300963878632,0.35580340027809143,1), position:"absolute", margin:vec4(0,0,0,0), x:157.00006103515625, y:36.000152587890625, rotate:vec3(0,0,-0.05000119283795357)},view({height:143, width:138, bgcolor:vec4(0,0.501960813999176,0.05704490840435028,1), position:"absolute", x:87.00006103515625, y:165.00006103515625, borderradius:vec4(10,30,60,80), rotate:vec3(0,0,7.059999942779541)},icon({fgcolor:vec4(0.929411768913269,0.7185189723968506,0.3921568691730499,1), opaque:true, icon:"flask", fontsize:80, position:"absolute", x:33, y:-16})),icon({fgcolor:vec4(0.885095477104187,0.8980835676193237,0.9214090704917908,1), opaque:true, icon:"ge", fontsize:80, position:"absolute", x:116.17550659179688, y:3.051116943359375})),
					view({height:337, width:287, bgcolor:vec4(0.32335585355758667,0.5324464440345764,0.6069661378860474,1), position:"absolute", x:602.137939453125, y:56.87499237060547, rotate:vec3(0,0,0.3699999749660492)},icon({fgcolor:vec4(0.929411768913269,0.9089215993881226,0.3921568691730499,1), opaque:true, icon:"heart", fontsize:140, position:"absolute", x:56.93695831298828, y:33.16679382324219, boldness:0.95})),
					view({height:199, width:768, pickalpha:-1, bgcolor:vec4(0,0.2716766893863678,0.501960813999176,1), position:"absolute", x:95.00006103515625, y:560.069091796875, alignitems:"center", justifycontent:"center", rotate:vec3(0,0,-0.20000015199184418)},icon({fgcolor:"cornflower", pickalpha:-1, icon:"flask", fontsize:80, position:"relative", x:11, y:21}),icon({fgcolor:"cornflower", pickalpha:-1, icon:"gear", fontsize:80, position:"relative", x:0, y:0}),checkbox({tooldragroot:true, toolresize:false, fontsize:24, bgcolor:"transparent", buttoncolor1:"transparent", buttoncolor2:"transparent", hovercolor1:"transparent", hovercolor2:"transparent", pressedcolor1:"transparent", pressedcolor2:"transparent", pickalpha:-1, fgcolor:"pink", position:"absolute", x:545.9999389648438, y:69.00015258789062})),
					label({fontsize:144, pickalpha:-1, bgcolor:"transparent", fgcolor:vec4(0.2965516149997711,0.6960710287094116,0.7355074286460876,1), text:"Change teh text!", position:"absolute", x:413.453369140625, y:274.54986572265625, opacity:0.6, width:1167.75, height:233.28000000000003}),
					view({height:42, width:1221, bgcolor:vec4(0.5372024178504944,0.5082737803459167,0.30220746994018555,1), position:"absolute", x:219.03475952148438, y:470.6853942871094, rotate:vec3(0,0,0.060000788420438766), opacity:0.7})
				),
				toolkit({
					position:"absolute",
					visible:true,
					rulers:true,
					x:1118,
					y:41.00010299682617,
					width:376,
					height:803,
					dropmode:"absolute",
					mode:"design",
					reticlesize:9,
					hoverlines:false,
					guides:true,
					handles:true
				}
				)
			)
		]
	}
}
)
