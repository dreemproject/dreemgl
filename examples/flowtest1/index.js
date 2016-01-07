define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$dataset$, rovi, $flow$remotes$, xypad, $flow$display$, labtext) {
	this.render = function() {
		return [
			rovi({
				name:'myservice', 
				flowdata:{x:189, y:111}
			}),
			xypad({
				name:'xy1', 
				flowdata:{x:30, y:20}
			}),
<<<<<<< Updated upstream
			labtext({name:'lab', flowdata:{x:20, y:20}, number:wire("this.rpc.myservice.data")})
=======
			labtext({name:'lab', flowdata:{x:95, y:347}})
>>>>>>> Stashed changes
		]
	}
	
}
)