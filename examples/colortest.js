//Pure JS based composition
define.class(function($server$, composition, screens, $containers$, screen, view, splitcontainer, $controls$, label, button, $widgets$, colorpicker){
	this.render = function(){ return [
		screens(
			screen({clearcolor:'#484230', flexdirection:'row'},
				splitcontainer({ vertical: false, flexdirection: "row", bgcolor: "black", flex:1},
					view({
						flex:1,
						flexdirection:"column",
						alignitems:'stretch',
						bgcolor:'blue',
						bg:{
							color:function(){
								
								var col1 = vec3(0.1,0.1,0.1);
								var col2= vec3(0.2,0.25,0.5);
								return vec4(mix(col1, col2, 1-uv.y  + noise.noise2d(uv.xy*403.6)*0.02),1.0)
							}
						}},
						view({bg:0, padding:4},
						colorpicker({margin:4, flex:1, value:vec4("#342563"), bgcolor:vec4(0,0,0,0.4)}),
						colorpicker({margin:4, flex:1, value:vec4("#D0F612"), bgcolor:vec4(0,0,0,0.4)}),
						colorpicker({margin:4, flex:1, value:vec4("#102030"),bgcolor:vec4(0,0,0,0.4)})
						)
						,view({flexdirection:"row", bgcolor:"transparent",padding:7 },
							button({
								text:"Set Vec4", 
								click:function(){
									var cp = this.find("colorpicker");	
									cp.color = vec4("blue");
									console.log(cp.color);									
								}
							}),
							
							button({
								text:"Set HSL", 
								click:function(){
									var cp = this.find("colorpicker");	
									cp.color = vec4.fromHSL(Math.random(),Math.random(),Math.random());
								//	cp.basehue = Math.random();
									console.log(cp.color);
								}
							})
						)
					)
								

				)
			)
		)
	]}
	
})