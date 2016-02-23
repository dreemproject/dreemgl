define.class("$server/composition",function(require, $ui$, tabbar, screen, label, view, cadgrid, $widgets$, toolkit) {

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
						alignitems:'stretch',
						alignself:'stretch',
						flexdirection:'column',
						justifycontent:'flex-end'
					},
					view(
						{
							flex:1,
							name:"main",
							bgcolor:NaN,
							alignitems:"center",
							justifycontent:"center"
						},
						label({name:"page", text:"", bgcolor:NaN})
					),
					tabbar({
						activetabcolor:"#333",
						activetextcolor:"#2aa",
						tabs:[
							{
								name:"SMS",
								icon:"comment",
								boldness:0.3,
								fontsize:33
							},
							{
								name:"inbox",
								icon:"envelope",
								boldness:0.3,
								fontsize:33
							},
							{
								name:"contacts",
								icon:"at",
								fontsize:33,
								boldness:0.15
							},
							{
								name:"search",
								icon:"search",
								fontsize:33
							},
							{
								name:"more",
								icon:"ellipsis-h",
								fontsize:33,
								boldness:0
							}
						],
						onactivetab:function(ev,tab,bar) {
							var name = bar.tabs[tab].name
							var main = this.screen.find("main");
							var label = main.find("page");
							label.text = "Select '" + name + "' tab";
						}
					})
				)
			)
		]
	}
}
)
