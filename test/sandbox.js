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
					view({height:417, width:325, bgcolor:vec4(0.7796770334243774,0.22304300963878632,0.35580340027809143,1), position:"absolute", margin:vec4(0,0,0,0), x:157.00006103515625, y:36.000152587890625, rotate:{____struct:"vec3", data:[0,0,-0.09000109881162643]}},view({height:143, width:138, bgcolor:vec4(0,0.501960813999176,0.05704490840435028,1), position:"absolute", x:92.00006103515625, y:165.00006103515625, borderradius:vec4(10,30,60,80)},icon({fgcolor:vec4(0.929411768913269,0.7185189723968506,0.3921568691730499,1), opaque:true, icon:"flask", fontsize:80, position:"absolute", x:33, y:-16})),icon({fgcolor:vec4(0.885095477104187,0.8980835676193237,0.9214090704917908,1), opaque:true, icon:"ge", fontsize:80, position:"absolute", x:116.17550659179688, y:3.051116943359375})),
					label({fontsize:144, pickalpha:-1, bgcolor:"transparent", fgcolor:vec4(0.2965516149997711,0.6960710287094116,0.7355074286460876,1), text:"Howdy!", position:"absolute", x:975.9999389648438, y:114.0001220703125, width:504.4921875, height:233.27999877929688, opacity:0.6, rotate:{____struct:"vec3", data:[0,0,-0.5700002312660217]}}),
					view({height:328, width:263, bgcolor:vec4(0.32335585355758667,0.5324464440345764,0.6069661378860474,1), position:"absolute", x:602.137939453125, y:56.87499237060547, rotate:vec3(0,0,0.3)},icon({fgcolor:vec4(0.929411768913269,0.9089215993881226,0.3921568691730499,1), opaque:true, icon:"heart", fontsize:140, position:"absolute", x:56.93695831298828, y:33.16679382324219, boldness:0.95})),
					view({height:181, width:778, pickalpha:-1, bgcolor:vec4(0,0.2716766893863678,0.501960813999176,1), position:"absolute", x:277.00006103515625, y:536.069091796875, alignitems:"center", justifycontent:"center", rotate:{____struct:"vec3", data:[-0.07000000774860382,-0.11000032722949982,0.11000044643878937]}},icon({fgcolor:"cornflower", pickalpha:-1, icon:"flask", fontsize:80, position:"relative", x:11, y:21, rotate:{____struct:"vec3", data:[0,0,-0.6599998474121094]}}),icon({fgcolor:"cornflower", pickalpha:-1, icon:"gear", fontsize:80, position:"relative", x:0, y:0}),checkbox({tooldragroot:true, toolresize:false, fontsize:24, bgcolor:"transparent", buttoncolor1:"transparent", buttoncolor2:"transparent", hovercolor1:"transparent", hovercolor2:"transparent", pressedcolor1:"transparent", pressedcolor2:"transparent", pickalpha:-1, fgcolor:"pink", position:"absolute", x:545.9999389648438, y:69.00015258789062})),
					view({height:40, width:648, bgcolor:vec4(0.30220746994018555,0.4497878849506378,0.5372024178504944,1), position:"absolute", x:671.3224487304688, y:226.90655517578125, rotate:vec3(0,0,0.010000525042414665), opacity:0.7})
				),
				toolkit({
					position:"absolute", 
					visible:true, 
					rulers:true, 
					x:1216, 
					y:29.000076293945312, 
					width:376, 
					height:819, 
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