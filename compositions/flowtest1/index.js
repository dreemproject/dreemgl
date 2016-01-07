define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$dataset$, rovi, $flow$remotes$, xypad, $flow$display$, labtext) {
	this.render = function() {
		return [
			rovi({
				name:'myservice', 
				flowdata:{x:157, y:80}, 
				query:wire("this.rpc.xy1.mousepos")
			}),
			xypad({
				name:'xy1', 
				flowdata:{x:26, y:264}
			}),
			labtext({name:'lab', flowdata:{x:426, y:122}, number:wire("this.rpc.xy1.mousepos"), number2:wire("this.rpc.xy1.mousepos")}),
			rovi({name:"rovi0", flowdata:{x:95, y:452}, query:wire("this.rpc.xy1.mousepos")}),
			labtext({name:"labtext0", flowdata:{x:456, y:316}, text:wire("this.rpc.rovi0.data")})
		]
	}
	
}
)