define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$dataset$, rovi, $flow$remotes$, xypad, $flow$display$, labtext) {
	this.render = function() {
		return [
			rovi({
				name:'myservice', 
				flowdata:{x:574, y:420}, 
				query:wire("this.rpc.xy1.mousepos")
			}),
			xypad({
				name:'xy1', 
				flowdata:{x:82, y:93}
			}),
			labtext({name:'lab', flowdata:{x:733, y:75}, number2:wire("this.rpc.myservice.data"), number:wire("this.rpc.xy1.mousepos"), text:wire("this.rpc.xy1.mousepos")}),
			rovi({name:"rovi0", flowdata:{x:135, y:507}, query:wire("this.rpc.xy1.mousepos")}),
			labtext({name:"labtext0", flowdata:{x:665, y:467}, text:wire("this.rpc.rovi0.data")})
		]
	}
	
}
)