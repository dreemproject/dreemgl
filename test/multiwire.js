define.class("$server/composition",function($server$,service,$ui$,screen,$flow$displays$,debug,outputs){
  
  this.render=function(){
    return [
      outputs({name:"a",flowdata:{x:26,y:37,screen:true}}),
      outputs({name:"b",flowdata:{x:17,y:481,screen:true}}),
      debug({name:'default',clearcolor:'#484230',flowdata:{x:484,y:159,screen:true},array:wire("[this.rpc.a.number,this.rpc.a.vec2,this.rpc.b.vec4,this.rpc.a.int,this.rpc.b.object]"),object:wire("{\"a.array\":this.rpc.a.array,\"b.array\":this.rpc.b.array}")}),
      debug({name:"debug0",flowdata:{x:496,y:500,screen:true},array:wire("[this.rpc.b.object,this.rpc.a.object,this.rpc.b.array]"),object:wire("this.rpc.b.object"),float:wire("this.rpc.b.number"),number:wire("this.rpc.b.int")})
    ]
  }
  
})