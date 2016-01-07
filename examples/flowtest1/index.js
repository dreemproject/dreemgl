define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$dataset$, rovi, $flow$remotes$, xypad, $flow$display$, labtext) {
	this.render = function() {
		return [
			rovi({
				name:'myservice', 
				flowdata:{x:353, y:63}, 
				query:wire("this.rpc.xy1.mousepos")
			}),
			xypad({
				name:'xy1', 
				flowdata:{x:80, y:353}
			}),
			labtext({name:'lab', flowdata:{x:483, y:329}, number2:wire("this.rpc.myservice.data"), number:wire("this.rpc.xy1.mousepos"), text:wire("this.rpc.xy1.mousepos")})
		]
	}
	
}
)