define.class("$server/composition",function(require, $ui$, icon, label, view, screen, cadgrid, $widgets$, toolkit) {

	this.render = function() {
		return [
			screen(
				{flexdirection:"row"},
				cadgrid({
					name:"grid",
					flex:3,
					overflow:"scroll",
					bgcolor:"#4e4e4e",
					gridsize:8,
					majorevery:5,
					majorline:vec4(0.34117648005485535,0.34117648005485535,0.34117648005485535,1),
					minorline:vec4(0.2823529541492462,0.2823529541492462,0.2823529541492462,1),
					alignitems:'center',
					alignself:'stretch',
					flexdirection:'column',
					justifycontent:'center',
					anchor:vec3(0,0,0),
					toolmove:false
				}
				),
				toolkit()
			)
		]
	}
}
)
