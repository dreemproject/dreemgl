define.class("$server/composition",function($server$,service,$ui$,screen,$flow$displays$,debug,outputs){
  
  this.render=function(){
    return [
      outputs({name:"a",flowdata:{x:104,y:41,screen:true}}),
      outputs({name:"b",flowdata:{x:138,y:469,screen:true}}),
      debug({name:'default',clearcolor:'#484230',flowdata:{x:584,y:244,screen:true},array:wire("[this.rpc.a.number,this.rpc.a.float,this.rpc.a.vec2,this.rpc.a.vec4,this.rpc.a.string,this.rpc.b.object,this.rpc.b.array,this.rpc.b.vec3,this.rpc.b.int,this.rpc.b.boolean]"),object:wire("{\"a.int\":this.rpc.a.int,\"a.boolean\":this.rpc.a.boolean,\"a.vec3\":this.rpc.a.vec3,\"a.array\":this.rpc.a.array,\"a.object\":this.rpc.a.object,\"b.string\":this.rpc.b.string,\"b.vec4\":this.rpc.b.vec4,\"b.vec2\":this.rpc.b.vec2,\"b.float\":this.rpc.b.float,\"b.number\":this.rpc.b.number}"),number:wire("this.rpc.a.number"),boolean:wire("this.rpc.b.boolean"),float:wire("this.rpc.a.float"),int:wire("this.rpc.b.int"),vec2:wire("this.rpc.a.vec2"),vec3:wire("this.rpc.b.vec3"),vec4:wire("this.rpc.a.vec4"),string:wire("this.rpc.b.string")})
    ]
  }
  
})