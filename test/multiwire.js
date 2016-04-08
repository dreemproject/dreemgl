define.class("$server/composition",function($server$,service,$ui$,screen,$flow$displays$,debug,outputs){
  
  this.render=function(){
    return [
      outputs({name:"a",flowdata:{x:104,y:41,screen:true}}),
      outputs({name:"b",flowdata:{x:138,y:469,screen:true}}),
      debug({name:'default',clearcolor:'#484230',flowdata:{x:645,y:184,screen:true},string:wire("this.rpc.default.array"),array:wire("[this.rpc.b.number,this.rpc.b.float,this.rpc.b.vec2,this.rpc.b.vec4,this.rpc.b.string,this.rpc.a.boolean,this.rpc.a.int,this.rpc.a.vec3,this.rpc.a.array,this.rpc.a.object]")})
    ]
  }
  
})