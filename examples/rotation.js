define.class('$server/composition', function(require, $ui$, screen, view) {
	this.render = function() {
		return [
			screen({name:'default', clearcolor:'#ffffff '},
				view({
					//viewport:'2d',
						name:'view-0',
						position:'absolute',
						top:100,
						left:100,
						width:100,
						height:100,
						bgcolor:'#c0c0c0 ',
						rotate:vec3(0,0,45.0*DEG)
					},
					view({
						name:'view-0-0',
						position:'absolute',
						top:10,
						left:10,
						width:50,
						height:50,
						bgcolor:'#ff3d3d ',
						rotate:vec3(0,0,60.*DEG)
					},
					view({
						name:'view-0-0',
						position:'absolute',
						top:10,
						left:10,
						width:10,
						height:10,
						bgcolor:'orange '
					}))
				)
			)
		]
	}
})
