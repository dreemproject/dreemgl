define.class('$server/composition', function ($ui$, view, label, screen, splitcontainer, noisegrid, button, $$, mapcontrols, map, urlfetch, acceleroremote, $3d$, ballrotate){
	this.render = function(){
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
					,splitcontainer({bgcolor: "green"},
						mapcontrols({bgcolor:NaN, flex:0.2,flexwrap:"nowrap"}),
						view({bgcolor:NaN, flex:0.8},
							noisegrid({padding: 0, flex:1}
								,map({name: "themap"})
							)
						)
					)
				)
			)
			,screen({name:"acceleroremote"},acceleroremote({target:"index"}))
			,screen({name:"mobile"}
				,map({name: "mobilemap"})
				,view({bgcolor:NaN},
					button({icon:"home", justifycontent:"center", aligncontent:"center", flex:1,fontsize: 20, padding:20}),ballrotate({flex:1, padding:20,name:"ballrotate1", target:"mapinside"}))
				,label({bgcolor:NaN,bold:true, text:"DreemGL Mapping: Mobile", position:"absolute", x:10, y:10})
			)
		];
	}
})
