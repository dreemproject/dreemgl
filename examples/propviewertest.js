//Pure JS based composition
define.class('$server/composition', function($ui$, cadgrid, splitcontainer, screen, view, label, button, $widgets$, propviewer, colorpicker){	
	this.render = function(){ return [
		screen({clearcolor:vec4('blue'),flexwrap:"nowrap", flexdirection:"row",bg:0}
			,cadgrid({flexdirection:"column", bgcolor: "#303030",minorsize:5,majorsize:25,  majorline:"#383838", minorline:"#323232" }
				,splitcontainer({ flex: 1, direction:"horizontal"}
				
					,splitcontainer({flex: 1, bg:0, direction:"vertical"}
						,view({flexdirection:"column", flex:1, bgcolor:"#383838", margin:20, padding:4}	
							,view({flexdirection:"column", flex:1, bg:0, margin:0}			
								,label({margin:4,name:"thelabel", fontsize:14,bg:0, text:"this is a label with some example props"})
								,propviewer({target:"thelabel", flex:1, overflow:"scroll"})
							)
						)
						,view({flexdirection:"column", flex:1, bgcolor:"#383838", margin:20, padding:4}	
							,view({flexdirection:"column",flex:1, bg:0, margin:0}			
								,button({name:"thebutton", text:"this is a button with some example props"})
								,propviewer({target:"thebutton", flex:1, overflow:"scroll"})
							)
						)
					)
					,splitcontainer({flexdirection:"row", flex: 1, bg:0, direction:"vertical"}
						,view({flexdirection:"column", flex:1, bgcolor:"#383838", margin:20, padding:4}	
							,view({flexdirection:"column", flex:1, bg:0, margin:0}			
								,cadgrid({majorline:"#383838", minorline:"#323232",bgcolor:"black", margin:4,name:"thecadgrid",height:10, fontsize:14,text:"this is a label with some example props"})
								,propviewer({target:"thecadgrid",
									flex:1, overflow:"scroll"
								})
							)
						)
						,view({flexdirection:"column", flex:1, bgcolor:"#383838", margin:20, padding:4}	
							,view({flexdirection:"column",flex:1, bg:0, margin:0}			
								,colorpicker({name:"thepicker", text:"this is a button with some example props"})
								,propviewer({target:"thepicker", flex:1, overflow:"scroll"})
							)
						)
					)
				)
			)
		)
	]}
})