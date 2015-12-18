//Pure JS based composition
define.class(function($server$, composition, role, $ui$, knob, speakergrid, screen, view, label, numberbox, textbox, button, $widgets$, propviewer, colorpicker, radiogroup){	
	this.render = function(){ return [
		role(
			screen({clearcolor:vec4('blue'),flexwrap:"nowrap", flexdirection:"row",bg:{
						color:function(){	
							var col1 = vec3(0.1,0.1,0.1);
							var col2 = vec3(0.2,0.25,0.5);
							return vec4(mix(col1, col2, 1-uv.y  + noise.noise2d(uv.xy*403.6)*0.02),1.0)
						}
					}
				}
				,speakergrid({flexdirection:"column", bgcolor: "#3b3b3b",minorsize:5,majorsize:25,  majorline:"#505040", minorline:"#404040" }
					,view({flexdirection:"column", bgcolor:vec4(0,0,0,0.2),margin:10, borderradius:5, alignitems:"flex-start", justifycontent:"flex-start"}
						,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:4, padding:4, bg:0}	
							,numberbox({fontsize: 10, value:10})
						)
						,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:4, padding:4, bg:0}	
							,numberbox({fontsize: 20, value:10})
						)
						,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:4, padding:4, bg:0, alignitems:"flex-start", justifycontent:"flex-start"}	
							,radiogroup({fontsize: 20,  values:["undefined" , "a","b","c", undefined]})
						)
					)
					,view({flexdirection:"column", bgcolor:vec4(0,0,0,0.4), margin:10, borderradius:5}
						,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:10, padding:4, bg:0}	
							,numberbox({title:"Q factor", fontsize: 20, value:10})
						)
						,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:10, padding:4, bg:0}	
							,radiogroup({title:"random", fontsize: 20, values:["undefined" , "thing","stuff","misc"]})
						)
						,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:10, padding:4, bg:0}	
							,numberbox({title:"X factor", fontsize: 20, value:20, stepvalue:0.1})
						)
					)
					,view({flexdirection:"row", flex: 1,bgcolor:vec4(0,0,0,0.6), margin:10, borderradius:5}
						,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:10, padding:4, bg:0}	
							,knob({knobsize: 10, bgcolor:vec4(0,0,0,1)})
						)
						,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:10, padding:4, bg:0}	
							,knob({knobsize: 20, bgcolor:vec4(0,0,0,1)})
						)
						,view({flexdirection:"column", flex:1, bgcolor:"gray", margin:10, padding:4, bg:0}	
							,knob({knobsize: 30, bgcolor:vec4(0,0,0,1)})
						)
					)
				)
			)
		)
	]}
})