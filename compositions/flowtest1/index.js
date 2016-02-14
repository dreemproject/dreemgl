define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$services$, map, webrequest, $flow$controllers$, xypad, knob, keyboard, dpad, $flow$displays$, labtext) {
	this.render = function() {
		return [
			xypad({name:"xypad0", flowdata:{x:289, y:291}}),
			labtext({name:"labtext0", flowdata:{x:705, y:142}, vec2:wire("this.rpc.xypad0.pointerpos"), string:wire("this.rpc.dpad0.value")}),
			dpad({name:"dpad0", flowdata:{x:77, y:90}})
		]
	}
}
)