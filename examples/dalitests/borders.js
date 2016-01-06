define.class(function($server$, composition, $ui$, screen, view){
  this.render = function(){ return [
      screen({name:'default', clearcolor:'#484230'},
             view({
               flexflow: 'row wrap'
               ,flexdirection:'row'
               ,flex:1
             },
                  
                  // red box inside green box
                  view({size: vec2(200,200), bgcolor: '#808080'
                        ,bgcolor: vec4('transparent')
                        ,borderradius:10
                        ,borderwidth:10
                        ,bordercolor:'#505050'}
                      )
                  
                  // green box, red box
                  ,view({size: vec2(200,200), bgcolor: '#909090'
                        ,bgcolor: vec4('transparent')
                        ,borderradius:10
                        ,borderwidth:10
                         ,bordercolor:'#505050'}
                       )
                  
                  // red box, green box
                  ,view({size: vec2(200,200), bgcolor: '#a0a0a0a0'
                        ,bgcolor: vec4('transparent')
                        ,borderradius:10
                        ,borderwidth:10
                         ,bordercolor:'#505050'}
                       )
                  
                  // green box above red box
                  ,view({flexdirection: 'column', size: vec2(200,200), bgcolor: '#b0b0b0'
                        ,bgcolor: vec4('transparent')
                        ,borderradius:10
                        ,borderwidth:10
                         ,bordercolor:'#505050'}
                       )
                  
                  // red box above green box
                  ,view({flexdirection: 'column', size: vec2(200,200), bgcolor: '#c0c0c0c0'
                        ,bgcolor: vec4('transparent')
                        ,borderradius:10
                        ,borderwidth:10
                         ,bordercolor:'#505050'}
                       )
                  
                  // green box, box box diagonal
                  ,view({size: vec2(200,200), bgcolor: '#d0d0d0'
                        ,bgcolor: vec4('transparent')
                        ,borderradius:10
                        ,borderwidth:10
                         ,bordercolor:'#505050'}
                      )
		        

                 )
            )
      
  ]}
  
  
  
})
