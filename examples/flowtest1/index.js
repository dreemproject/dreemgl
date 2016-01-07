define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$dataset$, rovi, $flow$remotes$, xypad, $flow$display$, labtext) {
	this.render = function() {
		return [
			rovi({
				name:'myservice', 
				flowdata:{x:120, y:130}
			}),
			xypad({
				name:'xy1', 
				flowdata:{x:30, y:20}
			}),
			labtext({name:'lab', flowdata:{x:20, y:20}, number:wire("this.rpc.xy1.mousepos"), text:wire("this.rpc.myservice.data")})
		]
	}
	
}
)