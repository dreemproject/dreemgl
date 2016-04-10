define.class("$server/composition",function($server$,service,$ui$,screen,$flow$displays$,debug,outputs,$flow$services$,debugd){
  
  this.render=function(){
    return [
      debugd({name:"ports",flowdata:{x:389,y:287},number:wire("this.rpc.b.number"),array:wire("[this.rpc.b.float,this.rpc.a.string]")}),
      outputs({name:"a",flowdata:{x:64,y:43,screen:true}}),
      outputs({name:"b",flowdata:{x:40,y:535,screen:true}}),
      debug({name:'debug0',clearcolor:'#484230',flowdata:{x:783,y:307,screen:true},number:wire("this.rpc.ports.outnumber"),array:wire("[this.rpc.ports.outint,this.rpc.a.int,this.rpc.b.int]")}),
      debug({name:"debug1",flowdata:{x:771,y:15,screen:true},object:wire("{\"b.string\":this.rpc.b.string,\"a.number\":this.rpc.a.number}"),array:wire("this.rpc.ports.outarray")})
    ]
  }
  
})