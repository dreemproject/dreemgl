define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$dataset$, rovi, $flow$remotes$, xypad, $flow$display$, labtext) {
	this.render = function() {
		return [
			rovi({
				name:'myservice', 
				flowdata:{x:688, y:273}, 
				query:wire("this.rpc.xy1.mousepos")
			}),
			xypad({
				name:'xy1', 
				flowdata:{x:313, y:502}
			}),
			labtext({name:'lab', flowdata:{x:1200, y:469}, number2:wire("this.rpc.myservice.data"), number:wire("this.rpc.xy1.mousepos"), text:wire("this.rpc.xy1.mousepos")})
		]
	}
	
}
)