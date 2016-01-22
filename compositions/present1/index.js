define.class("$server/composition",function(module, $server$, service, $ui$, screen, view, $flow$services$, map, omdb, webrequest, $flow$controllers$, xypad, knob, keyboard, dpad, $flow$displays$, shaderviz, labtext, inputs, outputs, album, $flow$devices$, estimote) {
	
	define.classPath(this)

	this.render = function() {
		return [
			xypad({name:"xypad0", flowdata:{x:41, y:354}}),
			shaderviz({name:"shaderviz", flowdata:{x:445, y:109}, shaderpos:wire("this.rpc.xypad0.mousepos")})
		]
	}
}
)