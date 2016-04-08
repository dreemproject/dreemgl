define.class("$server/composition",function($server$,service,$ui$,screen,$flow$displays$,debug,outputs){

  this.render=function(){
    return [
      outputs({name:"a",flowdata:{x:10,y:10}}),
      outputs({name:"b",flowdata:{x:13,y:313}}),
      debug({name:'default',clearcolor:'#484230',flowdata:{x:387,y:206,screen:true}})
    ]
  }

})
