define.class("$server/composition",function($server$,service,$ui$,screen,$flow$displays$,debug,outputs){
  
  this.render=function(){
    return [
      outputs({name:"a",flowdata:{x:26,y:37,screen:true}}),
      outputs({name:"b",flowdata:{x:17,y:589,screen:true}}),
      debug({name:'default',clearcolor:'#484230',flowdata:{x:511,y:243,screen:true},object:wire("{"a.int":this.rpc.a.int}")})
    ]
  }
  
})