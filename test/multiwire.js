define.class("$server/composition",function($server$,service,$ui$,screen,$flow$displays$,debug,outputs){
  
  this.render=function(){
    return [
      outputs({name:"a",flowdata:{x:104,y:41,screen:true}}),
      outputs({name:"b",flowdata:{x:138,y:469,screen:true}}),
      debug({name:'default',clearcolor:'#484230',flowdata:{x:879,y:165,screen:true},array:wire("[this.rpc.a.string,this.rpc.a.vec4,this.rpc.a.vec2,this.rpc.b.vec3,this.rpc.b.object,this.rpc.a.float,this.rpc.a.boolean,this.rpc.b.number,this.rpc.b.int,this.rpc.b.array]")})
    ]
  }
  
})