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
						view({tooltarget:false, height:160, width:160, bgcolor:vec4(0,0.013421067036688328,0.501960813999176,1)}),
						icon({fgcolor:'cornflower', icon:'flask'})
					),
					toolkit({inspect:"grid"})
				)
			)
		]
	}
}
)