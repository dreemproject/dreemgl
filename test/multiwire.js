define.class("$server/composition",function($server$,service,$ui$,screen,$flow$displays$,debug,outputs){
  
  this.render=function(){
    return [
      outputs({name:"a",flowdata:{x:10,y:10,screen:true}}),
      outputs({name:"b",flowdata:{x:13,y:313,screen:true}}),
      debug({name:'default',clearcolor:'#484230',flowdata:{x:564,y:163,screen:true},array:wire("[this.rpc.a.array,this.rpc.b.array]")})
    ]
  }
  
})