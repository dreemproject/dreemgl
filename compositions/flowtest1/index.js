define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$dataset$, rovi, $flow$remotes$, xypad, $flow$display$, labtext) {
	this.render = function() {
		return [
			rovi({
				name:'myservice', 
				flowdata:{x:525, y:309}, 
				query:wire("this.rpc.xy1.mousepos")
			}),
			xypad({
				name:'xy1', 
				flowdata:{x:28, y:116}
			}),
			labtext({name:'lab', flowdata:{x:731, y:125}, number:wire("this.rpc.xy1.mousepos"), number2:wire("this.rpc.xy1.mousepos")}),
			rovi({name:"rovi0", flowdata:{x:251, y:436}, query:wire("this.rpc.xy1.mousepos")}),
			labtext({name:"labtext0", flowdata:{x:635, y:454}, text:wire("this.rpc.rovi0.data")})
		]
	}
	
}
)