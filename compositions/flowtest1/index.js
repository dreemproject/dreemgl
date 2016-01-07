define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$dataset$, rovi, $flow$remotes$, xypad, $flow$display$, labtext) {
	this.render = function() {
		return [
			rovi({
				name:'myservice', 
				flowdata:{x:57, y:420}, 
				query:wire("this.rpc.xy1.mousepos")
			}),
			xypad({
				name:'xy1', 
				flowdata:{x:14, y:33}
			}),
			labtext({name:'lab', flowdata:{x:301, y:227}, number:wire("this.rpc.xy1.mousepos"), text:wire("this.rpc.xy1.mousepos"), number2:wire("this.rpc.myservice.data")}),
			rovi({name:"rovi0", flowdata:{x:-506, y:-166}})
		]
	}
	
}
)