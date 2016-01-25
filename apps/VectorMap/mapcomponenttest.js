define.class('$server/composition', function (require,  $server$, fileio,$ui$, view, label, screen, speakergrid, splitcontainer, $$, map){
	this.render = function(){
		return [
			screen({name:"index"}, 
				view({flex: 1, bgcolor: "darkblue"}
					,splitcontainer({bgcolor: "green"}					
						,view({bg:0, flex:0.2},	
							speakergrid({},label({text:"Dreem Mapping",margin: 10,bold:true,fontsize:20, bg:0}))
						)
						
						,view({bg:0, flex:0.8}, 
							speakergrid({ padding: 10, bg:0, flex:1}
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