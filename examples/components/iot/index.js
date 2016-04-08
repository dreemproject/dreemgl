define.class("$server/composition",function($iot$, iot, $$, controller){

  this.render=function(){
    return [
      iot({name:"iot",flowdata:{x:46,y:57}}),
			controller({name:"desktop",things:wire('this.rpc.iot.things'),flowdata:{x:522,y:116}})
    ]
  }
})
