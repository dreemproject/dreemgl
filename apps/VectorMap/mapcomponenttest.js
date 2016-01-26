define.class('$server/composition', function (require,  $server$, fileio,$ui$, view, label, screen, speakergrid, splitcontainer,noisegrid,button, $$, map, urlfetch, acceleroremote){
	this.render = function(){
		return [
			urlfetch({name:"urlfetch"}),
			screen({name:"index"
					,acceleromove: function(x,y,z){console.log("moving:" , x,y,z);}
					,acceleropan: function(x,y,z){console.log("panning:", x,y,z);}
				}
				,view({flex: 1, bgcolor: "#5b5b5b"}
					,splitcontainer({bgcolor: "green"}					
						,view({bg:0, flex:0.2, overflow:"scroll" },	
							noisegrid({padding:20}
								,label({text:"Dreem Mapping",margin: 10,bold:true,fontsize:20, bg:0})
								,button({text:"Amsterdam",click:function(){this.find("themap").gotoCity(this.text,16);}, margin:20})
								,button({text:"Seoul",click:function(){this.find("themap").gotoCity(this.text,16);}, margin:20})
								,button({text:"San Francisco",click:function(){this.find("themap").gotoCity(this.text,16);}, margin:20})
							)
						)

						,view({bg:0, flex:0.8}, 
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
			
		];
	}
})