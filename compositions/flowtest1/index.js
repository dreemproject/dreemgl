define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$dataset$, rovi, $flow$remotes$, xypad, $flow$display$, labtext) {
	this.render = function() {
		return [
			rovi({
				name:'myservice', 
				flowdata:{x:379, y:33}, 
				query:wire("this.rpc.xy1.mousepos")
			}),
			xypad({
				name:'xy1', 
				flowdata:{x:71, y:101}
			}),
			labtext({name:'lab', flowdata:{x:519, y:203}, number:wire("this.rpc.xy1.mousepos"), number2:wire("this.rpc.xy1.mousepos")}),
			rovi({name:"rovi0", flowdata:{x:98, y:401}, query:wire("this.rpc.xy1.mousepos")}),
			labtext({name:"labtext0", flowdata:{x:460, y:392}, text:wire("this.rpc.rovi0.data")})
		]
	}
	
}
)