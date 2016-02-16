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
					view({height:305, width:252, bgcolor:vec4(0.32335585355758667,0.5324464440345764,0.6069661378860474,1), position:"absolute", x:105.7789306640625, y:60.872772216796875, rotate:vec3(0,0,0.5)},icon({fgcolor:vec4(0.929411768913269,0.9089215993881226,0.3921568691730499,1), opaque:true, icon:"heart", fontsize:140, position:"absolute", x:50.93695831298828, y:16.166793823242188, boldness:0.95})),
					view({height:416, width:325, bgcolor:vec4(0.7796770334243774,0.22304300963878632,0.35580340027809143,1), position:"absolute", x:673.0000610351562, y:28.000152587890625},icon({fgcolor:vec4(0.885095477104187,0.8980835676193237,0.9214090704917908,1), opaque:true, icon:"ge", fontsize:80, position:"absolute", x:124.9998779296875, y:80})),
					view({height:14, width:648, bgcolor:vec4(0.860729455947876,0.864276111125946,0.19516445696353912,1), position:"absolute", x:265, y:557.0005493164062}),
					view({height:143, width:138, bgcolor:vec4(0,0.501960813999176,0.05704490840435028,1), position:"absolute", x:485, y:196.00015258789062, borderradius:vec4(10,30,60,80)},icon({fgcolor:vec4(0.929411768913269,0.7185189723968506,0.3921568691730499,1), opaque:true, icon:"flask", fontsize:80, position:"absolute", x:33, y:-16})),
					label({fontsize:144, pickalpha:-1, bgcolor:"transparent", fgcolor:vec4(0.2965516149997711,0.6960710287094116,0.7355074286460876,1), text:"Howdy!", position:"absolute", x:333.99993896484375, y:387.0001220703125, width:504.4921875, height:233.28000000000003, opacity:0.6})
				),
				toolkit({
					position:"absolute", 
					x:1119, 
					y:28.000057220458984, 
					width:491, 
					height:752, 
					visible:true, 
					rulers:true
				}
				)
			)
		]
	}
}
)