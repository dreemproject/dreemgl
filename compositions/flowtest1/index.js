define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$dataset$, rovi, $flow$remotes$, xypad, $flow$display$, labtext) {
	this.render = function() {
		return [
			rovi({
				name:'myservice', 
				flowdata:{x:332, y:39}, 
				query:wire("this.rpc.xy1.mousepos")
			}),
			xypad({
				name:'xy1', 
				flowdata:{x:27, y:255}
			}),
			labtext({name:'lab', flowdata:{x:408, y:169}, number:wire("this.rpc.xy1.mousepos")}),
			labtext({name:"labtext0", flowdata:{x:390, y:420}, text:wire("this.rpc.xy1.mousepos")})
		]
	}
	
}
)