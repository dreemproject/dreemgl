define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$services$, map, omdb, webrequest, $flow$controllers$, xypad, knob, keyboard, dpad, $flow$displays$, labtext, inputs, outputs, album, $flow$devices$, estimote) {
	this.render = function() {
		return [
			xypad({name:"xypad0", flowdata:{x:51, y:261}}),
			labtext({name:"labtext0", flowdata:{x:467, y:87}, string:wire("this.rpc.dpad0.value"), text:wire("this.rpc.xypad0.mousepos")}),
			dpad({name:"dpad0", flowdata:{x:56, y:-6}})
		]
	}
}
)