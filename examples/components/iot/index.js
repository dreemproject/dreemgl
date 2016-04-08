define.class("$server/composition",function($iot$, hub, $$, controller){

  this.render=function(){
    return [
      hub({name:"iot",flowdata:{x:46,y:57}}),
			controller({name:"desktop",things:wire('this.rpc.iot.things'),flowdata:{x:522,y:116}})
    ]
  }
})
