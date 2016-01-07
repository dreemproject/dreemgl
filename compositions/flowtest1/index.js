define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$dataset$, rovi, $flow$remotes$, xypad, $flow$display$, labtext) {
	this.render = function() {
		return [
			rovi({
				name:'myservice', 
				flowdata:{x:472, y:57}, 
				query:wire("this.rpc.xy1.mousepos")
			}),
			xypad({
				name:'xy1', 
				flowdata:{x:26, y:264}
			}),
			labtext({name:'lab', flowdata:{x:530, y:216}, number:wire("this.rpc.xy1.mousepos"), number2:wire("this.rpc.xy1.mousepos")}),
			rovi({name:"rovi0", flowdata:{x:248, y:505}, query:wire("this.rpc.xy1.mousepos")}),
			labtext({name:"labtext0", flowdata:{x:745, y:443}, text:wire("this.rpc.rovi0.data")})
		]
	}
	
}
)