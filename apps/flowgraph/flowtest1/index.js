define.class("$server/composition",function($server$,service,$ui$,screen,view,$flow$services$,map,webrequest,$flow$controllers$,xypad,knob,keyboard,dpad,$flow$displays$,labtext){
  this.render=function(){
    return [
      xypad({name:"xypad0",flowdata:{x:77,y:430,screen:true}}),
      labtext({name:"labtext0",flowdata:{x:347,y:224,screen:true},string:wire("this.rpc.dpad0.value"),vec2:wire("this.rpc.xypad0.pointerpos")}),
      dpad({name:"dpad0",flowdata:{x:21,y:23,screen:true}})
    ]
  }
})