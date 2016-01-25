define.class('$server/composition', function (require,  $server$, fileio,$ui$, view, label, screen, speakergrid, splitcontainer,noisegrid,button, $$, map, urlfetch, acceleroremote){
	this.render = function(){
		return [
			urlfetch({name:"urlfetch"}),
			screen({name:"acceleroremote"},acceleroremote({target:"index"})),
			screen({name:"index"}, 
				view({flex: 1, bgcolor: "#5b5b5b"}
					,splitcontainer({bgcolor: "green"}					
						,view({bg:0, flex:0.2, overflow:"scroll" },	
							noisegrid({}
								,label({text:"Dreem Mapping",margin: 10,bold:true,fontsize:20, bg:0})
								,button({text:"Amsterdam",click:function(){this.find("themap").gotoCity(this.text,15);}, margin:2})
								,button({text:"Seoul",click:function(){this.find("themap").gotoCity(this.text,15);}, margin:2})
								,button({text:"San Francisco",click:function(){this.find("themap").gotoCity(this.text,15);}, margin:2})
							)
						)

						,view({bg:0, flex:0.8}, 
							noisegrid({ padding: 10, flex:1}
								,map({
										name: "themap"
								})
							)
						)
					)
				)
			)
		];
	}
})