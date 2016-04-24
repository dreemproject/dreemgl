define.class("$server/composition",function($server$,service,$ui$,screen,view,$flow$services$,map,webrequest,$flow$controllers$,xypad,knob,keyboard,dpad,$flow$displays$,labtext){
  this.render=function(){
    return [
      xypad({name:"xypad0",flowdata:{x:22,y:133,screen:true}}),
      labtext({name:"labtext0",flowdata:{x:326,y:24,screen:true},string:wire("this.rpc.dpad0.value"),vec2:wire("this.rpc.xypad0.pointerpos")}),
      dpad({name:"dpad0",flowdata:{x:21,y:23,screen:true}})
    ]
  }
})
