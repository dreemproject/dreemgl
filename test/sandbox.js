define.class("$server/composition",function(require,$ui$,checkbox,icon,button,label,view,screen,cadgrid,$widgets$,toolkit){
























this.render=function(){
























return [
screen(
{
flexdirection:"row"
},
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
view({
height:391,
width:313,
bgcolor:vec4(0.7796770334243774,0.22304300963878632,0.35580340027809143,1),
position:"absolute",
margin:vec4(0,0,0,0),
x:84.00006103515625,
y:400.0001525878906
},
view({
height:143,
width:138,
bgcolor:vec4(0,0.501960813999176,0.05704490840435028,1),
position:"absolute",
x:84.00006103515625,
y:160.00006103515625,
borderradius:vec4(10,30,60,80),
rotate:vec3(0,0,0.8099998831748962)
},
icon({
fgcolor:vec4(0.929411768913269,0.7185189723968506,0.3921568691730499,1),
opaque:true,
icon:"flask",
fontsize:80,
position:"absolute",
x:33,
y:9
})
),
icon({
fgcolor:vec4(0.885095477104187,0.8980835676193237,0.9214090704917908,1),
opaque:true,
icon:"ge",
fontsize:80,
position:"absolute",
x:120.17547607421875,
y:26.051101684570312
})
),
view({
height:273,
width:453,
pickalpha:-1,
bgcolor:vec4(0,0.2716766893863678,0.501960813999176,1),
position:"absolute",
x:410.1640625,
y:590.7561645507812,
alignitems:"center",
justifycontent:"center",
bgimage:"$resources/textures/portrait.jpg",
bgimagemode:"aspect-fill"
},
button({tooldragroot:true,fontsize:24,pickalpha:-1,fgcolor:'red',label:"Press Me!",position:"absolute",x:37.835906982421875,y:58.24383544921875}),
checkbox({
tooldragroot:true,
toolresize:false,
fontsize:24,
bgcolor:'transparent',
buttoncolor1:'transparent',
buttoncolor2:'transparent',
hovercolor1:'transparent',
hovercolor2:'transparent',
pressedcolor1:'transparent',
pressedcolor2:'transparent',
pickalpha:-1,
fgcolor:'pink',
position:"absolute",
x:211.83590698242188,
y:56.243896484375
})
),
view({
height:100,
width:800,
bgcolor:vec4(0.5372024178504944,0.5082737803459167,0.30220746994018555,1),
position:"absolute",
x:323.0347595214844,
y:451.6853942871094,
opacity:0.7
},
icon({
fgcolor:'cornflowerblue',
pickalpha:-1,
icon:"star-o",
fontsize:80,
position:"absolute",
x:395.9653015136719,
y:-1.685333251953125
})
),
view({
height:343,
width:669,
bgcolor:vec4(0.32335585355758667,0.5324464440345764,0.6069661378860474,1),
position:"absolute",
x:208.8311767578125,
y:29.318634033203125,
bgimage:"$resources/textures/landscape.jpg",
bgimagemode:"aspect-fill"
},
icon({
fgcolor:vec4(0.8,0.9,0.3,1),
opaque:true,
icon:"heart",
fontsize:140,
position:"absolute",
x:77.18701171875,
y:44.7864990234375,
boldness:0.95
}),
icon({
fgcolor:'yellow',
pickalpha:-1,
icon:"gear",
fontsize:80,
position:"absolute",
x:419.1688232421875,
y:89.68136596679688
})
),
label({
fontsize:104,
pickalpha:-1,
bgcolor:'transparent',
fgcolor:vec4(0.2965516149997711,0.6960710287094116,0.7355074286460876,1),
text:"Change the text!",
position:"absolute",
x:446.07366943359375,
y:617.5030517578125,
opacity:0.6
})
),
toolkit({
position:"absolute",
visible:true,
rulers:true,
x:1145,
y:21.000144958496094,
width:428,
height:836,
dropmode:"absolute",
mode:"design",
reticlesize:9,
hoverlines:false,
guides:true,
handles:true,
groupreparent:false
})
)
]















































	}















































	}
)