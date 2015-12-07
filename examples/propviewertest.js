//Pure JS based composition
define.class(function($server$, composition, role, $ui$, screen, view, label, button, $widgets$, propviewer){	
	this.render = function(){ return [
		role(
			screen({clearcolor:vec4('blue'),flexwrap:"nowrap", flexdirection:"column",bg:{
							color:function(){								
								var col1 = vec3(0.1,0.1,0.1);
								var col2= vec3(0.2,0.25,0.5);
								return vec4(mix(col1, col2, 1-uv.y  + noise.noise2d(uv.xy*403.6)*0.02),1.0)
							}
						}
					}
						
						
						
						
						,
				label({name:"thelabel",bg:0, text:"this is a label with some example props"}),
				propviewer({target:"thelabel"}),
				button({name:"thebutton", text:"this is a button with some example props"}),
				propviewer({target:"thebutton"})
				
				
			)
		)
	]}
})