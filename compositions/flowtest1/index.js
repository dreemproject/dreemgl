define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$services$, map, omdb, webrequest, $flow$controllers$, xypad, knob, keyboard, dpad, $flow$displays$, labtext, inputs, outputs, album, $flow$devices$, estimote) {
	this.render = function() {
		return [
			xypad({name:"xypad0", flowdata:{x:16, y:229}}),
			labtext({name:"labtext0", flowdata:{x:337, y:206}, string:wire("this.rpc.dpad0.value"), text:wire("this.rpc.xypad0.mousepos"), vec2:wire("this.rpc.xypad0.mousepos")}),
			dpad({name:"dpad0", flowdata:{x:33, y:426}})
		]
	}
}
)