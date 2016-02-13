define.class("$server/composition",function(require, $ui$, slider, screen, label, view, icon, cadgrid) {

		this.render = function() {
			return [
				screen(
					cadgrid({
							name:"grid",
							flex:3,
							bgcolor:"#4e4e4e",
							gridsize:8,
							majorevery:5,
							majorline:vec4(0.34117648005485535,0.34117648005485535,0.34117648005485535,1),
							minorline:vec4(0.2823529541492462,0.2823529541492462,0.2823529541492462,1),
							alignitems:'center',
							alignself:'stretch',
							flexdirection:'column',
							justifycontent:'center'
						},
						label({
							name:"current",
							width:200,
							height:30,
							bgcolor:NaN,
							marginbottom:30,
							text:"The current value is: 0"
						}),
						slider({
							width:400,
							minhandlethreshold:26,
							height:5,
							value:0.0,
							bgcolor:"pink",
							fgcolor:"white",
							onvalue:function(ev,v,o) {
								var current = this.screen.find("current");
								if (current) {
									current.text = "The current value is: " + v
								}
								this.height = 5 + 30 * v
							}})
					)
				)
			]
		}
	}
)
