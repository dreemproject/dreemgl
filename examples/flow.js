define.class("$server/composition",function($server$,service,$ui$,screen,$flow$displays$,debug,outputs,$flow$services$,debugd){

  this.render=function(){
    return [
      debugd({name:"server",flowdata:{x:393,y:22},array:wire("[this.rpc.testvalues.number,this.rpc.testvalues.boolean,this.rpc.testvalues.float,this.rpc.browser.outstring]"),number:wire("this.rpc.testvalues.number"),object:wire("{\"testvalues.string\":this.rpc.testvalues.string,\"testvalues.int\":this.rpc.testvalues.int,\"server.outarray\":this.rpc.server.outarray}")}),
      outputs({name:"testvalues",flowdata:{x:29,y:203,screen:true}}),
      debug({name:"browser",clearcolor:'#484230',flowdata:{x:423,y:322,screen:true},array:wire("this.rpc.server.outarray"),object:wire("this.rpc.server.outobject"),
		  vec2:wire("this.rpc.testvalues.vec2"),vec3:wire("this.rpc.testvalues.vec4"),string:wire("this.rpc.testvalues.object"),number:wire("this.rpc.testvalues.number"),vec4:wire("this.rpc.testvalues.vec2"),int:wire("this.rpc.testvalues.vec3"),float:wire("this.rpc.testvalues.string"),boolean:wire("this.rpc.testvalues.array")})
    ]
  }

})
