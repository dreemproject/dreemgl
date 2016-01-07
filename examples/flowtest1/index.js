define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$dataset$, rovi, $flow$remotes$, xypad, $flow$display$, labtext) {
	this.render = function() {
		return [
			rovi({
				name:'myservice', 
				flowdata:{x:229, y:673}, 
				query:wire("this.rpc.xy1.mousepos")
			}),
			xypad({
				name:'xy1', 
				flowdata:{x:134, y:144}
			}),
			labtext({name:'lab', flowdata:{x:767, y:581}, number2:wire("this.rpc.myservice.data"), text:wire("this.rpc.myservice.data"), number:wire("this.rpc.xy1.mousepos")})
		]
	}
	
}
)