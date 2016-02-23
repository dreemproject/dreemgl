define.class("$server/composition",function(require,$ui$,checkbox,icon,button,label,view,screen,cadgrid,$widgets$,toolkit){
	
	this.render=function(){
	return [
	screen(
	{flexdirection:"row"},
	cadgrid({
	name:"grid",
	flex:3,
	overflow:"scroll",
	bgcolor:vec4(0.08853328227996826,0.11556218564510345,0.16508188843727112,1),
	gridsize:8,
	majorevery:5,
	majorline:vec4(0.06671861559152603,0.26168233156204224,0.34268006682395935,1),
	minorline:vec4(0.1546473354101181,0.1543203890323639,0.12822513282299042,1),
	alignitems:'center',
	alignself:'stretch',
	flexdirection:'column',
	justifycontent:'center',
	anchor:vec3(0,0,0),
	toolmove:false,
	toolrect:false
	},
	label({fontsize:44,pickalpha:-1,bgcolor:'transparent',fgcolor:'lightgreen',text:"Howdy!",position:"absolute",x:176.99998474121094,y:138,x:176.99998474121094,y:138,text:"Testing the new stuff!"}),
	button({tooldragroot:true,fontsize:24,pickalpha:-1,fgcolor:'red',label:"Press Me!",position:"absolute",x:305.9999694824219,y:307.9999694824219}),
	view({height:70,width:80,pickalpha:-1,bgcolor:'purple',position:"absolute",x:628,y:265,position:"absolute",x:628,y:265,width:438,height:386})
	),
	toolkit({
	position:"absolute",
	visible:true,
	position:"absolute",
	x:1222,
	y:34.00001525878906,
	width:400,
	height:800
	}
	)
	)
	]
	}
	}
)