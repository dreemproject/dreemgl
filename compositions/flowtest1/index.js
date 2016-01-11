define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$services$, map, omdb, webrequest, $flow$controllers$, xypad, knob, keyboard, dpad, $flow$displays$, labtext, inputs, outputs, album, $flow$devices$, estimote) {
	this.render = function() {
		return [
			xypad({name:"xypad0", flowdata:{x:36, y:59}}),
			labtext({name:"labtext0", flowdata:{x:487, y:230}, string:wire("this.rpc.xypad0.mousepos")})
		]
	}
	
}
)