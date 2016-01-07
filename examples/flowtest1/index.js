define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$dataset$, rovi, $flow$remotes$, xypad, $flow$display$, labtext) {
	this.render = function() {
		return [
			rovi({
				name:'myservice', 
				flowdata:{x:234, y:625}
			}),
			xypad({
				name:'xy1', 
				flowdata:{x:767, y:287}
			}),
			labtext({name:'lab', flowdata:{x:351, y:201}, number2:wire("this.rpc.myservice.data")})
		]
	}
	
}
)