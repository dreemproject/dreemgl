define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$services$, map, omdb, webrequest, $flow$controllers$, xypad, knob, gamepad, keyboard, dpad, $flow$displays$, labtext, inputs, outputs) {
	this.render = function() {
		return [
			map({name:"map0", flowdata:{x:623, y:335}, location:wire("this.rpc.outputs0.location"), zoomLevel:wire("this.rpc.knob0.value")}),
			outputs({name:"outputs0", flowdata:{x:19, y:46}}),
			omdb({name:"omdb0", flowdata:{x:348, y:16}, keyword:wire("this.rpc.outputs0.string")}),
			inputs({name:"inputs0", flowdata:{x:712, y:10}, string:wire("this.rpc.webrequest0.response")}),
			webrequest({name:"webrequest0", flowdata:{x:366, y:186}, url:wire("this.rpc.outputs0.url")}),
			knob({name:"knob0", flowdata:{x:24, y:342}})
		]
	}
	
}
)