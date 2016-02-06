define.class("$server/composition",function(require, $ui$, screen, splitcontainer, cadgrid, $widgets$, toolkit) {

	this.render = function() {
		return [
			screen(
				splitcontainer(
					cadgrid({
							name:"grid",
							flex:3,
							overflow:"scroll",
							bgcolor:"#4e4e4e",
							gridsize:5,
							majorevery:5,
							majorline:"#575757",
							minorline:"#484848"
						}
					),
					toolkit({inspect:"grid"})
				)
			)
		]
	}
}
)
