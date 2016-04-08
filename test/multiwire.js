define.class("$server/composition",function($server$,service,$ui$,screen,$flow$displays$,debug,outputs){
  
  this.render=function(){
    return [
      outputs({name:"a",flowdata:{x:10,y:10,screen:true}}),
      outputs({name:"b",flowdata:{x:13,y:313,screen:true}}),
      debug({name:'default',clearcolor:'#484230',flowdata:{x:564,y:163,screen:true},array:wire("[this.rpc.a.vec2,this.rpc.b.string,this.rpc.a.float,this.rpc.a.int,this.rpc.a.string, this.rpc.a.boolean]")})
    ]
  }
  
})