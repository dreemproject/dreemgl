define.class("$server/composition",function(require,$ui$,icon,button,checkbox,label,view,screen,cadgrid,$widgets$,toolkit){

		this.render=function(){

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
						view({height:327,width:252,bgcolor:vec4(0.32335585355758667,0.5324464440345764,0.6069661378860474,1),position:"absolute",x:293.3897705078125,y:223.87277221679688,rotate:vec3(0,0,0.5)},icon({fgcolor:vec4(0.929411768913269,0.9089215993881226,0.3921568691730499,1),opaque:true,icon:"heart",fontsize:140,position:"absolute",x:56.93695831298828,y:33.16679382324219,boldness:0.95})),
						view({height:416,width:325,bgcolor:vec4(0.7796770334243774,0.22304300963878632,0.35580340027809143,1),position:"absolute",x:17.00006103515625,y:159.00015258789062,margin:vec4(0,0,0,0)},view({height:143,width:138,bgcolor:vec4(0,0.501960813999176,0.05704490840435028,1),position:"absolute",x:92,y:174.00001525878906,borderradius:vec4(10,30,60,80),rotate:vec3(0,0,0.7999997735023499)},icon({fgcolor:vec4(0.929411768913269,0.7185189723968506,0.3921568691730499,1),opaque:true,icon:"flask",fontsize:80,position:"absolute",x:33,y:6,rotate:vec3(0,0,-0.11000006645917892)})),icon({fgcolor:vec4(0.885095477104187,0.8980835676193237,0.9214090704917908,1),opaque:true,icon:"ge",fontsize:80,position:"absolute",x:122.9998779296875,y:41.00006103515625})),
						label({fontsize:44,pickalpha:-1,bgcolor:'transparent',fgcolor:'pink',text:"CTRL-SHIFT-T to pop up the toolkit!",position:"absolute",x:71,y:55.99999237060547})
					),
					toolkit({
						position:"absolute",
						visible:true,
						x:550,
						y:20,
						width:300,
						height:700
					})
				)
			]
		}
	}
)
