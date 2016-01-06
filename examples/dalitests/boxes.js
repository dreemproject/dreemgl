define.class(function($server$, composition, $ui$, screen, view){
  this.render = function(){ return [
      screen({name:'default', clearcolor:'#484230'},
             view({
               flexflow: 'row wrap'
               ,flexdirection:'row'
               ,flex:1
               ,bgcolor: vec4('transparent')
             },
                  
                  // red box inside green box
                  view({size: vec2(200,200), bgcolor: '#808080'},
                       view({
                         pos: vec2(0,0)
                         ,position: 'absolute'
                         ,size: vec2(100,100)
                         ,bgcolor: vec4('green')
                       })
                       
                       ,view({
                         pos: vec2(0,0)
                         ,position: 'absolute'
                         ,size: vec2(50,50)
                         ,bgcolor: vec4('red')
                       })
                      )
                  
                  // green box, red box
                  ,view({size: vec2(200,200), bgcolor: '#909090'},
                        view({
                          size: vec2(100,100)
                          ,bgcolor: vec4('green')
                        })
                        
                        ,view({
                          size: vec2(50,50)
                          ,bgcolor: vec4('red')
                        })
                       )
                  
                  // red box, green box
                  ,view({size: vec2(200,200), bgcolor: '#a0a0a0a0'},
                        view({
                          size: vec2(50,50)
                          ,bgcolor: vec4('red')
                        })
                        
                        ,view({
                          size: vec2(100,100)
                          ,bgcolor: vec4('green')
                        })
                       )
                  
                  // green box above red box
                  ,view({flexdirection: 'column', size: vec2(200,200), bgcolor: '#b0b0b0'},
                        view({
                          size: vec2(100,100)
                          ,bgcolor: vec4('green')
                        })
                        
                        ,view({
                          size: vec2(50,50)
                          ,bgcolor: vec4('red')
                        })
                       )
                  
                  // red box above green box
                  ,view({flexdirection: 'column', size: vec2(200,200), bgcolor: '#c0c0c0c0'},
                        view({
                          size: vec2(50,50)
                          ,bgcolor: vec4('red')
                        })
                        
                        ,view({
                          size: vec2(100,100)
                          ,bgcolor: vec4('green')
                        })
                       )
                  
                  // green box, box box diagonal
                  ,view({size: vec2(200,200), bgcolor: '#d0d0d0'},
                       view({
                         pos: vec2(0,0)
                         ,position: 'absolute'
                         ,size: vec2(100,100)
                         ,bgcolor: vec4('green')
                       })
                       
                       ,view({
                         pos: vec2(100,100)
                         ,position: 'absolute'
                         ,size: vec2(50,50)
                         ,bgcolor: vec4('red')
                       })
                      )
		        

                 )
            )
      
  ]}
  
  
  
})
