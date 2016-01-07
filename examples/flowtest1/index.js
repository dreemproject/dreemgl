define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$dataset$, rovi, $flow$remotes$, xypad, $flow$display$, labtext) {
	this.render = function() {
		return [
			rovi({
				name:'myservice', 
				flowdata:{x:132, y:29}
			}),
			xypad({
				name:'xy1', 
				flowdata:{x:78, y:385}
			}),
			labtext({name:'lab', flowdata:{x:371, y:175}, number2:wire("this.rpc.xy1.mousepos")})
		]
	}
	
}
)