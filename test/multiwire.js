define.class("$server/composition",function($server$,service,$ui$,screen,$flow$displays$,debug,outputs,$flow$services$,debugd){
  
  this.render=function(){
    return [
      debugd({name:"ports",flowdata:{x:392,y:428},number:wire("this.rpc.a.number"),object:wire("{\"a.boolean\":this.rpc.a.boolean,\"a.object\":this.rpc.a.object,\"debug0.outstring\":this.rpc.debug0.outstring}"),string:wire("this.rpc.debug0.outstring"),array:wire("this.rpc.debugd0.outarray")}),
      outputs({name:"a",flowdata:{x:15,y:221,screen:true}}),
      debug({name:'debug0',clearcolor:'#484230',flowdata:{x:385,y:58,screen:true},number:wire("this.rpc.a.number"),object:wire("{\"a.float\":this.rpc.a.float,\"a.int\":this.rpc.a.int,\"a.string\":this.rpc.a.string}"),string:wire("this.rpc.a.string"),array:wire("[this.rpc.ports.outstring]")}),
      debug({name:"debug1",flowdata:{x:942,y:160,screen:true},array:wire("[this.rpc.debug0.outnumber,this.rpc.ports.outnumber]"),object:wire("{\"debug0.outobject\":this.rpc.debug0.outobject,\"ports.outobject\":this.rpc.ports.outobject}"),string:wire("this.rpc.ports.outarray")}),
      debugd({name:"debugd0",flowdata:{x:48,y:630},array:wire("[this.rpc.debug0.outarray,this.rpc.a.boolean]"),string:wire("this.rpc.a.string")}),
      debug({name:"sort",flowdata:{x:901,y:495,screen:true},array:wire("[this.rpc.debug0.outstring,this.rpc.debug1.outstring,this.rpc.ports.outstring,this.rpc.a.string,this.rpc.debugd0.outstring].sort().reverse()")})
    ]
  }
  
})