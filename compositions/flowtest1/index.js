define.class("$server/composition",function($server$, service, $ui$, screen, view, $examples$request$, get, $flow$services$, rovi, map, omdb, weather, webrequest, $flow$controllers$, xypad, knob, gamepad, keyboard, dpad, $flow$displays$, labtext, inputs, outputs) {
	this.render = function() {
		return [
			xypad({name:"xypad0", flowdata:{x:36, y:59}}),
			labtext({name:"labtext0", flowdata:{x:487, y:230}, string:wire("this.rpc.xypad0.mousepos")})
		]
	}
	
}
)