define.class('$server/composition', function (require,  $server$, fileio,$ui$, numberbox,view, label, screen, speakergrid, splitcontainer,noisegrid,button, $$, map, urlfetch, acceleroremote,$3d$, ballrotate){

	this.places= [
	{text:"Texel 11", place: "texel", zoomlevel: 11},
	{text:"Amsterdam-17", place: "amsterdam", zoomlevel: 17},
	{text:"Amsterdam-16", place: "amsterdam", zoomlevel: 16},
	{text:"Amsterdam-15", place: "amsterdam", zoomlevel: 15},
	{text:"Amsterdam-14", place: "amsterdam", zoomlevel: 14},
	{text:"Amsterdam-13", place: "amsterdam", zoomlevel: 13},
	{text:"Amsterdam-12", place: "amsterdam", zoomlevel: 12},
	{text:"Amsterdam-11", place: "amsterdam", zoomlevel: 11},
	{text:"Amsterdam-10", place: "amsterdam", zoomlevel: 10},
	{text:"Seoul", place: "seoul", zoomlevel: 16},
	{text:"SF", place: "sanfrancisco", zoomlevel: 16},
	{text:"SF-10", place: "sanfrancisco", zoomlevel: 10},
	{text:"NY - Manhattan", place: "manhattan", zoomlevel: 16},
	{text:"NY - Manhattan 14", place: "manhattan", zoomlevel: 14},
	{text:"NY - Manhattan 12", place: "manhattan", zoomlevel: 12},
	{text:"NY - Manhattan 11", place: "manhattan", zoomlevel: 11},
	{text:"NY - Manhattan 10", place: "manhattan", zoomlevel: 10},
	{text:"SF - Golden Gate Park", place: "sanfrancisco_goldengatepark", zoomlevel: 17},
		{text:"SZ - Huaqiang Bei", place: "shenzhen_hqb", zoomlevel: 16},
		{text:"HongKong", place: "hongkong", zoomlevel: 10},
		{text:"Sydney", place: "sydney", zoomlevel: 10},
		{text:"London", place: "london", zoomlevel: 13},
		{text:"London 15", place: "london", zoomlevel: 15}
	]
	this.render = function(){

		
		
		
		var Buttons = [];
		for(var i = 0;i<this.places.length;i++){
			var p = this.places[i];
			Buttons.push(button({place:p.place, zoomlevel:p.zoomlevel, text:p.text,click:function(){this.find("themap").gotoCity(this.place,this.zoomlevel, 1);
			this.find("zoomlevelbox").value = this.zoomlevel;}, margin:4}))

		}
		return [
			urlfetch({name:"urlfetch"}),
			screen({name:"index"
				,style:{$:{fontsize:12}}

					,acceleromove: function(x,y,z){
						//console.log("moving:" , x,y,z);
						var d = 1000/5.0;
						this.find("mapinside").camera = Animate({0.5:vec3(x*d, y*d, z*d)});
					}
					,acceleropan: function(x,y,z){console.log("panning:", x,y,z);}
				}
				,view({flex: 1, bgcolor: "#5b5b5b"}
					,splitcontainer({bgcolor: "green"}
						,view({bgcolor:NaN, flex:0.2,flexwrap:"nowrap"},
							noisegrid({padding:20, flexwrap:"nowrap", overflow:"scroll"}
							//,label({outline:true, fontsize: 130, outline_thickness: 10, text:"outline test", bg:0})
								,label({text:"Dreem Mapping",margin: 10,bold:true,fontsize:20, bgcolor:NaN})

								,view({bgcolor:NaN}
									,label({text:"zoom level",padding:4,bold:false,fontsize:13, bgcolor:NaN})			
									,numberbox({value:9, onvalue:function(val){this.find("themap").zoomTo(val.value, 1);}.bind(this), text:"numberbox", name:"zoomlevelbox", minvalue:0, stepvalue:1, maxvalue:18})
								)
,noisegrid({bordercolor: "gray", flex:undefined, borderradius:10, margin:20,borderwidth:2, bgcolor:"black",  flexdirection:"column" , padding:5 }
								,label({text:"Rotation control",margin: 10,fontsize:12,  bgcolor:NaN})
								,ballrotate({name:"ballrotate1", height:100, target:"mapinside"})

								)
								,button({ text:"DumpDebug",click:function(){this.find("themap").dumpdebug();}, margin:4})
								,Buttons
								
							)
						)

						,view({bgcolor:NaN, flex:0.8},
							noisegrid({ padding: 0, flex:1}
								,map({
									name: "themap"
								})

							)
						)
					)
				)
			)
			,screen({name:"acceleroremote"},acceleroremote({target:"index"}))
			,screen({name:"mobile"}
				,map({
									name: "mobilemap"
								})
								
								,view({bgcolor:NaN},
									button({icon:"home", justifycontent:"center", aligncontent:"center", flex:1,fontsize: 20, padding:20}),ballrotate({flex:1, padding:20,name:"ballrotate1", target:"mapinside"}))
								,label({bgcolor:NaN,bold:true, text:"DreemGL Mapping: Mobile", position:"absolute", x:10, y:10})

			)
		];
	}
})
