define.class("$server/composition",function(require, $ui$, button, screen, label, view, icon, cadgrid) {

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
							name:"status",
							marginbottom:20,
							width:200,
							bgcolor:NaN,
							text:"Press the buttons below:"
						}),
						button({
							marginbottom:20,
							click:function(ev,v,o){
							this.screen.find("status").text = "Button clicked!";
						}}),
						button({
							bgcolor:"white",
							icon:"flask",
							mode:"toggle",
							toggle:function(ev,v,o) {
								this.screen.find("status").text = "Button toggled to: " + v;
							},
							selected:{
								fgcolor:'green'
							}
						})
					)
				)
			]
		}
	}
)
