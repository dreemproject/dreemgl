define.class(function($server$, composition, $ui$, screen, view, label, require){
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
					  ,font: require('$resources/fonts/ubuntu_monospace_ascii_baked.glf')
					  ,fgcolor: '#c2c5ca'
					  ,text: '36 Point'
					  ,bg: 0
					  ,bgcolor: 'transparent'
				  })

				  ,label({
					  fontsize: 32.0
					  ,font: require('$resources/fonts/ubuntu_monospace_ascii_baked.glf')
					  ,fgcolor: '#c2c5ca'
					  ,text: '32 Point'
					  ,bg: 0
					  ,bgcolor: 'transparent'
				  })

				  ,label({
					  fontsize: 28.0
					  ,font: require('$resources/fonts/ubuntu_monospace_ascii_baked.glf')
					  ,fgcolor: '#c2c5ca'
					  ,text: '28 Point'
					  ,bg: 0
					  ,bgcolor: 'transparent'
				  })

				  ,label({
					  fontsize: 24.0
					  ,font: require('$resources/fonts/ubuntu_monospace_ascii_baked.glf')
					  ,fgcolor: '#c2c5ca'
					  ,text: '24 Point'
					  ,bg: 0
					  ,bgcolor: 'transparent'
				  })

				  ,label({
					  fontsize: 20.0
					  ,font: require('$resources/fonts/ubuntu_monospace_ascii_baked.glf')
					  ,fgcolor: '#c2c5ca'
					  ,text: '20 Point'
					  ,bg: 0
					  ,bgcolor: 'transparent'
				  })

				  ,label({
					  fontsize: 16.0
					  ,font: require('$resources/fonts/ubuntu_monospace_ascii_baked.glf')
					  ,fgcolor: '#c2c5ca'
					  ,text: '16 Point'
					  ,bg: 0
					  ,bgcolor: 'transparent'
				  })

				  ,label({
					  fontsize: 12.0
					  ,font: require('$resources/fonts/ubuntu_monospace_ascii_baked.glf')
					  ,fgcolor: '#c2c5ca'
					  ,text: '12 Point'
					  ,bg: 0
					  ,bgcolor: 'transparent'
				  })

				  ,label({
					  fontsize: 8.0
					  ,font: require('$resources/fonts/ubuntu_monospace_ascii_baked.glf')
					  ,fgcolor: '#c2c5ca'
					  ,text: '8 Point'
					  ,bg: 0
					  ,bgcolor: 'transparent'
				  })

				  ,label({
					  fontsize: 6.0
					  ,font: require('$resources/fonts/ubuntu_monospace_ascii_baked.glf')
					  ,fgcolor: '#c2c5ca'
					  ,text: '6 Point'
					  ,bg: 0
					  ,bgcolor: 'transparent'
				  })

				 )
			)
		        
  ]}

})
