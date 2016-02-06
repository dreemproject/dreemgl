define.class("$server/composition",function(require, $ui$, icon, label, view, screen, splitcontainer, cadgrid, $widgets$, toolkit) {
	
	this.render = function() {
		return [
			screen(
				splitcontainer(
					cadgrid({
							name:"grid", 
							flex:3, 
							overflow:"scroll", 
							bgcolor:"#4e4e4e", 
							gridsize:10, 
							majorevery:5, 
							majorline:"#575757", 
							minorline:"#484848", 
							alignitems:'center', 
							alignself:'stretch', 
							flexdirection:'column', 
							justifycontent:'center'
						},
						view({height:60, width:60, bgcolor:vec4(0.49642544984817505,0.8411269783973694,0.5100318193435669,1), justifycontent:'flex-end'}),
						view({height:60, width:60, bgcolor:'purple'})
					),
					toolkit({inspect:"grid"})
				)
			)
		]
	}
}
)