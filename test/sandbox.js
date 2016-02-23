define.class("$server/composition",function(require,$ui$,checkbox,icon,button,label,view,screen,cadgrid,$widgets$,toolkit){

this.render=function(){

return [
screen(
{flexdirection:"row"},
cadgrid({
name:"grid",
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
toolmove:false,
toolrect:false
},
view({height:352,width:395,pickalpha:-1,bgcolor:vec4(0.3115594983100891,0.5057464838027954,0.8137271404266357,1),position:"absolute",x:615,y:146,rotate:vec3(0,0,0.05999906733632088)}),
icon({fgcolor:'cornflowerblue',bgcolor:'transparent',pickalpha:-1,icon:"gear",fontsize:80,position:"absolute",x:258,y:203.99998474121094}),
label({fontsize:44,pickalpha:-1,bgcolor:'transparent',fgcolor:'lightgreen',text:"Testing if this works!",position:"absolute",x:198,y:277,rotate:vec3(0,0,-1.3500010967254639)}),
icon({fgcolor:'yellow',bgcolor:'transparent',pickalpha:-1,icon:"flask",fontsize:80,position:"absolute",x:137,y:110.99998474121094})
),
toolkit({
position:"absolute",
visible:true,
x:1222,
y:34.00001525878906,
width:400,
height:800
})
)
]


	}


	}
)