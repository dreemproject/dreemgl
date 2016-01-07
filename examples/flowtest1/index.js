define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$dataset$, rovi, $flow$remotes$, xypad, $flow$display$, labtext) {
	this.render = function() {
		return [
			rovi({
				name:'myservice', 
				flowdata:{x:397, y:562}, 
				query:wire("this.rpc.xy1.mousepos")
			}),
			xypad({
				name:'xy1', 
				flowdata:{x:85, y:200}
			}),
			labtext({name:'lab', flowdata:{x:788, y:266}, number2:wire("this.rpc.myservice.data"), number:wire("this.rpc.xy1.mousepos")})
		]
	}
	
}
)