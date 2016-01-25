define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$services$, map, omdb, webrequest, $flow$controllers$, xypad, knob, keyboard, dpad, $flow$displays$, labtext, inputs, outputs, album, $flow$devices$, estimote) {
	this.render = function() {
		return [
			xypad({name:"xypad0", flowdata:{x:17, y:281}}),
			labtext({name:"labtext0", flowdata:{x:319, y:126}, vec2:wire("this.rpc.xypad0.mousepos"), string:wire("this.rpc.dpad0.value")}),
			dpad({name:"dpad0", flowdata:{x:32, y:49}})
		]
	}
}
)