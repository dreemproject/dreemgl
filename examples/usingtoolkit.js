define.class("$server/composition",function(require,$ui$,icon,button,checkbox,label,view,screen,cadgrid,$widgets$,toolkit){
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
            majorline:vec4(0.34117648005485535,0.34117648005485535,0.34117648005485535,1),
            minorline:vec4(0.17135260999202728,0.17135260999202728,0.17135260999202728,1),
            alignitems:'center',
            alignself:'stretch',
            flexdirection:'column',
            justifycontent:'center',
            toolmove:false,
            toolrect:false
          },
          label({name:"reminder",tooltarget:false,oninit:function(){
            this.opacity=this.find("toolkit").visible?0:1.0
          },fontsize:44,pickalpha:-1,bgcolor:'transparent',fgcolor:'pink',text:"CTRL-SHIFT-T to pop up the toolkit!",position:"absolute",x:71,y:55.99999237060547}),
          view({height:416,width:325,bgcolor:vec4(0.7796770334243774,0.22304300963878632,0.35580340027809143,1),position:"absolute",x:58,y:84.0001220703125,margin:vec4(0,0,0,0)}),
          view({height:150,width:200,pickalpha:-1,bgcolor:vec4(0.9298506379127502,1,0.017038807272911072,1),position:"absolute",x:446.0001220703125,y:133.0001220703125},icon({fgcolor:'#e22',bgcolor:'transparent',pickalpha:-1,icon:"heart",fontsize:80,position:"absolute",x:52.31962966918945,y:30.38092041015625,rotate:vec3(0,0,0.6499998569488525)})),
          view({height:150,width:415,pickalpha:-1,bgcolor:vec4(0,0.8784517049789429,1,1),position:"absolute",x:276.0001220703125,y:599.0000610351562}),
          label({fontsize:44,pickalpha:-1,bgcolor:'transparent',fgcolor:'#999',text:"Click me to edit!",position:"absolute",x:77.99999237060547,y:522.9999389648438})
        ),
        toolkit({
          name:"toolkit",
          position:"absolute",
          onvisible:function(ev,v,o){
            var rem=o.find("reminder")
            if(rem){
              rem.opacity=v?0:1.0
            }
          },
          x:576,
          y:55,
          width:300,
          height:672,
          visible:true
        })
      )
    ]
  }
});