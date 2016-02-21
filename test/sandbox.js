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
					view({height:391, width:313, bgcolor:vec4(0.7796770334243774,0.22304300963878632,0.35580340027809143,1), position:"absolute", margin:vec4(0,0,0,0), x:157.00006103515625, y:36.000152587890625, rotate:vec3(0,0,-0.05000119283795357)},view({height:143, width:138, bgcolor:vec4(0,0.501960813999176,0.05704490840435028,1), position:"absolute", x:92.00006103515625, y:165.00006103515625, borderradius:vec4(10,30,60,80)},icon({fgcolor:vec4(0.929411768913269,0.7185189723968506,0.3921568691730499,1), opaque:true, icon:"flask", fontsize:80, position:"absolute", x:33, y:-16})),icon({fgcolor:vec4(0.885095477104187,0.8980835676193237,0.9214090704917908,1), opaque:true, icon:"ge", fontsize:80, position:"absolute", x:116.17550659179688, y:3.051116943359375})),
					view({height:337, width:287, bgcolor:vec4(0.32335585355758667,0.5324464440345764,0.6069661378860474,1), position:"absolute", x:602.137939453125, y:56.87499237060547, rotate:vec3(0,0,-0.5600000023841858)},icon({fgcolor:vec4(0.929411768913269,0.9089215993881226,0.3921568691730499,1), opaque:true, icon:"heart", fontsize:140, position:"absolute", x:56.93695831298828, y:33.16679382324219, boldness:0.95})),
					view({height:199, width:768, pickalpha:-1, bgcolor:vec4(0,0.2716766893863678,0.501960813999176,1), position:"absolute", x:90.00006103515625, y:447.069091796875, alignitems:"center", justifycontent:"center"},icon({fgcolor:"cornflower", pickalpha:-1, icon:"flask", fontsize:80, position:"relative", x:11, y:21}),icon({fgcolor:"cornflower", pickalpha:-1, icon:"gear", fontsize:80, position:"relative", x:0, y:0}),checkbox({tooldragroot:true, toolresize:false, fontsize:24, bgcolor:"transparent", buttoncolor1:"transparent", buttoncolor2:"transparent", hovercolor1:"transparent", hovercolor2:"transparent", pressedcolor1:"transparent", pressedcolor2:"transparent", pickalpha:-1, fgcolor:"pink", position:"absolute", x:545.9999389648438, y:69.00015258789062})),
					view({height:42, width:648, bgcolor:vec4(0.30220746994018555,0.4497878849506378,0.5372024178504944,1), position:"absolute", x:739.3224487304688, y:195.90655517578125, rotate:vec3(0,0,-0.8499995470046997), opacity:0.7}),
					label({fontsize:144, pickalpha:-1, bgcolor:"transparent", fgcolor:vec4(0.2965516149997711,0.6960710287094116,0.7355074286460876,1), text:"Change teh text!", position:"absolute", x:167.453369140625, y:575.5498657226562, opacity:0.6})
				),
				toolkit({
					position:"absolute", 
					visible:true, 
					rulers:true, 
					x:1300, 
					y:25.000091552734375, 
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