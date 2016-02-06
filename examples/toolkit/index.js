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
						view({tooltarget:false, height:160, width:160, bgcolor:vec4(0,0.065,0.3,1)}),
						icon({fgcolor:'cornflower', icon:'flask'}),
						icon({fgcolor:'cornflower', icon:'flask'}),
						view({position:'absolute', height:60, width:60, bgcolor:'purple'}),
						view({height:60, width:60, bgcolor:'purple'}),
						label({bgcolor:'transparent', fgcolor:'lightgreen', text:'Howdy!', position:'absolute', x:925, y:175}),
						view({height:60, width:60, bgcolor:'purple', position:'absolute', x:289, y:209}),
						icon({fgcolor:'cornflower', icon:'flask', position:'absolute', x:642, y:79}),
						icon({fgcolor:'cornflower', icon:'flask', position:'absolute', x:548, y:147}),
						view({height:60, width:60, bgcolor:'purple', position:'absolute', x:454, y:118})
					),
					toolkit({inspect:"grid"})
				)
			)
		]
	}
}
)
