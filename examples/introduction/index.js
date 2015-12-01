define.class(function(require,
	$server$, composition,  screens, 
	$containers$, screen, view, 
	$controls$, button, label, 
	$behaviors$, draggable, 
	$3d$, teapot, ballrotate, 
	$widgets$, docviewer, codeviewer, slideviewer){
	// Live coding presentation docs!
	this.attributes = {
		test:"ELLO!"
	}
	
	this.render = function render(){ 
		return [
			screens(
				screen({
					name:'desktop',
					init:function(){
						this.rpc.screens.remote.pager = function(event){
							this.children[0].page += event.value
						}.bind(this)
					}},
					slideviewer({
						slide:{
							padding:15,
							borderradius:20
						},
						flex:1,
						viewport:'2D',
						overflow:'scroll',
						slideheight:800,
						bgcolor:'black',
						bg:0,
						attributes:{scroll:{persist:true}}
						},
						view({
							bgcolor:"transparent", 
							flex:1,
							slidetitle:'DreemGL introduction'
							},
							ballrotate({name:"ballrotate1", position:"absolute",width:100, height:100, target:"teapot1"})
							,view({
								flex:1,
								name:"teapot1", 
								clearcolor: 'rgba(255,255,255,0)',
								viewport: '3D',
								bg:0,
								camera: vec3(0,0,8)
							},
							teapot({
								detail:10,
								pos:[0,0,-0.5], 
								rotate:[-.6*PI,PI,0], 
								radius:0.8, 
								size:vec3(0.5)
							}),
							0),
						0),
						
						view({
							slidetitle:'This thing'
							,flex:1
							,flexdirection:"column"
							}
							,codeviewer({
								viewport:'2D',
								overflow:'scroll',
								flex:1,
								margin:vec4(10),
								source:render.toString(), 
								padding:vec4(4), 
								fontsize: 14,
								bgcolor:"#000030", 
								multiline: true
							}),
						0),
						view({
							slidetitle:'High level overview',
							flex:1 , bgcolor:"transparent"
							},
							view({
								left:100, 
								top:100,
								width:800, 
								height:450, 
								bgimage: require('./graph.png')
							})
						),
						view({
							bgcolor:"transparent", 
							flex:1,
							slidetitle:'Using shaders to style'
							},
							view({
								flex:1,
								clearcolor: 'rgba(255,255,255,0)',
								viewport: '3D',
								attributes:{count:16},
								bg:0,
								camera: vec3(0,0,18),
								render: function(){
									var ret = []
									for(var i = 0; i < this.count; i ++) ret.push(
										teapot({
											detail:6,
											position:'absolute',
											attributes:{
												value:{type:float, value:0, duration:0.5, motion:ease.bounce}
											},
											mouseover:function(){
												this.value = 1
											},
											mouseout:function(){
												this.value = 0
											},
											bg:{
												i:i,
												patterns: require('./shaderpatterns').prototype,
												color:function(){
													return vec4( patterns.wave(mesh.uv, i*.1 + 
														view.value * 10., i*.1 + view.value * 10.) * 
														pal.pal1(i*.1).xyz, 1.)
												//	return vec4( patterns.stripe(mesh.uv, 10., i*.1 + view.value * 10.) * pal.pal1(i*0.1).xyz, 1.) 
												}
											},
											rotate:[-.6*PI,PI,0], 
											pos:[floor(i/4)*6-10,(i%4)*6-10,-10]
										})
									)
									return ret
								}
							}),
						0),
						view({
							flex:1,
							slidetitle:'Rendering vs drawing',
							},
							view({flexdirection:'row', flex:1},
								codeviewer({
									flex:1,
									alignself:'stretch',
									margin:vec4(10),
									wrap:true,
									source:function(){
										// Rendering returns scenegraph structures
										this.render = function(){
											return view({}, view({}))
										}

										// subclass the default background shader
										this.bg = {
											value:0,
											color:function(){
												return mix('red', 'orange', abs(sin(uv.y*10.+value)))
											}
										}
									}.toString(), 
									padding:vec4(4), 
									fontsize: 14, 
									bgcolor:"#000030", 
									multiline: true
								}),
								view({
									flex:1,
									padding:4,
									margin:10, 
									cornerradius:0,
									bg:{
										value:1,
										color:function(){
											return mix('red', 'yellow', abs(sin(mesh.y*10.+value)))
										}
									}
								}),
							0),
						0),
						view({
							flex:1,
							visible:false,
							slidetitle:'Compositions'
							}
							,codeviewer({
								viewport:'2D',
								overflow:'scroll',
								flex:1,
								margin:vec4(10),
								source:require('../rpcremote').module.factory.body.toString(), 
								padding:vec4(4), 
								fontsize: 14, 
								bgcolor:"#000030",
								multiline: true
							})
						),

						view({
							flex:1,
							slidetitle:'Live documentation'
							},
							docviewer({flex:1, class:this.constructor}),
						0),
					0),
				0),
				screen({
						attributes:{pager:0},
						name:'remote',
					}
					,view({flex:1, bgcolor:'black'}
						,button({
							text:'Left',
							flex:1,
							size: vec2(200, 200),
							bgcolor: vec4('yellow'),
							//is: draggable(),
							click: function(){
								this.screen.pager = -1
							}
						})
						,button({
							text:'Right',
							flex:1,
							size: vec2(200, 200),
							bgcolor: vec4('red'),
							//is: draggable(),
							click: function(){
								this.screen.pager = 1
							}
						})
					)
				)
			)
		]
	}
})