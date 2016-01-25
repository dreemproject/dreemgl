define.class('$server/composition', function (require,  $server$, fileio,$ui$, view, label, screen, speakergrid, splitcontainer, $$, map){
	this.render = function(){
		return [
			screen({name:"index"}, 
				view({flex:1, bgcolor: "darkblue" }, 
						view({flexdirection:"column", bgcolor:"green", flex:1}
						
							,view({bg:0},	
								speakergrid({},label({text:"Dreem Mapping",margin: 10,bold:true,fontsize:20, bg:0}))
							)
							
							,view({bg:0}, 
								view({ padding: 10}
									,label({text:"Dreem Mapping",margin: 10,bold:true,fontsize:20, bg:0})
									
									,map({name:"themap"})
									
									
								)
							)
						)
					
				)
			)
		];
	}
	
})

