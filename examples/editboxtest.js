//Pure JS based composition
define.class(function($server$, composition, role, $ui$, speakergrid, screen, view, label, numberbox, textbox, button, $widgets$, propviewer, colorpicker, radiogroup){	
	this.render = function(){ return [
		role(
			screen({clearcolor:vec4('blue'),flexwrap:"nowrap", flexdirection:"row",bg:
					{
						color:function(){								
							var col1 = vec3(0.1,0.1,0.1);
							var col2= vec3(0.2,0.25,0.5);
							return vec4(mix(col1, col2, 1-uv.y  + noise.noise2d(uv.xy*403.6)*0.02),1.0)
						}
					}
				}
				,speakergrid({flexdirection:"column", bgcolor: "#303030",minorsize:5,majorsize:25,  majorline:"#505040", minorline:"#404040" }
					,view({flexdirection:"column", flex: 1, bgcolor:vec4(1,1,1,0.83),margin:40, borderradius:30}
						,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:20, padding:4, bg:0}	
							,numberbox({fontsize: 10, value:10})
						)
						,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:20, padding:4, bg:0}	
							,numberbox({fontsize: 20, value:10})
						)
						,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:20, padding:4, bg:0}	
							,radiogroup({fontsize: 40,bg:0,  values:["undefined" , "a","b","c", undefined]})
						)
					)
					,view({flexdirection:"column", flex: 1, margin:40, borderradius:30}
						,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:20, padding:4, bg:0}	
							,numberbox({fontsize: 30, value:10})
						)
						,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:20, padding:4, bg:0}	
							,radiogroup({fontsize: 40,bg:0,  values:["undefined" , "a","b","c", undefined]})
						)
						,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:20, padding:4, bg:0}	
							,numberbox({fontsize: 40, value:10})
						)
					)
				)
			)
		)
	]}
})