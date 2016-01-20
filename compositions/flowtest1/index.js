define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$services$, map, omdb, webrequest, $flow$controllers$, xypad, knob, keyboard, dpad, $flow$displays$, labtext, inputs, outputs, album, $flow$devices$, estimote) {
	this.render = function() {
		return [
			xypad({name:"xypad0", flowdata:{x:22, y:63}}),
			labtext({name:"labtext0", flowdata:{x:396, y:254}, string:wire("this.rpc.dpad0.value"), text:wire("this.rpc.xypad0.mousepos"), vec2:wire("this.rpc.xypad0.mousepos")}),
			dpad({name:"dpad0", flowdata:{x:33, y:426}})
		]
	}
}
)