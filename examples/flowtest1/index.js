define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$dataset$, rovi, $flow$remotes$, xypad, $flow$display$, labtext) {
	this.render = function() {
		return [
			rovi({
				name:'myservice', 
				flowdata:{x:586, y:365}, 
				query:wire("this.rpc.xy1.mousepos")
			}),
			xypad({
				name:'xy1', 
				flowdata:{x:213, y:160}
			}),
			labtext({name:'lab', flowdata:{x:1193, y:136}, number2:wire("this.rpc.myservice.data"), number:wire("this.rpc.xy1.mousepos"), text:wire("this.rpc.xy1.mousepos")})
		]
	}
	
}
)