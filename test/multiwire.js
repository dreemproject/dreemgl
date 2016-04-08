define.class("$server/composition",function($server$,service,$ui$,screen,$flow$displays$,debug,outputs){
  
  this.render=function(){
    return [
      outputs({name:"a",flowdata:{x:26,y:37,screen:true}}),
      outputs({name:"b",flowdata:{x:17,y:589,screen:true}}),
      debug({name:'default',clearcolor:'#484230',flowdata:{x:939,y:244,screen:true},array:wire("[this.rpc.a.number,this.rpc.b.number]"),object:wire("{\"a.int\":this.rpc.a.int,\"b.number\":this.rpc.b.number}"),string:wire("this.rpc.b.string")})
    ]
  }
  
})