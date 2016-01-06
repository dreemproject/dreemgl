define.class(function($server$, composition, $ui$, screen, view, label, cadgrid, require){
  this.render = function(){ return [
      screen({name:'default', clearcolor:'#484230'},
             view({
				 flexflow: 'row wrap'
				 ,flexdirection:'row'
				 ,flex:1
				 ,bgcolor: 'gray'
             }
                  
				  ,label({
					  fontsize: 36.0
					  ,fgcolor: '#c2c5ca'
					  ,text: 'Label'
					  ,bg: 0
					  ,bgcolor: 'transparent'
				  })

				  ,cadgrid({name:"centralconstructiongrid", overflow:"scroll" ,bgcolor: "#3b3b3b",gridsize:5,majorevery:5,  majorline:"#474747", minorline:"#373737"})
				 )
		        
			)
  ]}

})
