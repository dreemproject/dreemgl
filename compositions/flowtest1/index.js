define.class("$server/composition",function($server$, service, $ui$, screen, view, $flow$services$, map, omdb, webrequest, $flow$controllers$, xypad, knob, gamepad, keyboard, dpad, $flow$displays$, labtext, inputs, outputs, album, $flow$devices$, estimote) {
	this.render = function() {
		return [
			map({name:"map0", flowdata:{x:385, y:13}, location:wire("this.rpc.outputs0.location"), zoomLevel:wire("this.rpc.knob0.value")}),
			outputs({name:"outputs0", flowdata:{x:19, y:14}}),
			omdb({name:"omdb0", flowdata:{x:353, y:410}, keyword:wire("this.rpc.outputs0.string")}),
			inputs({name:"inputs0", flowdata:{x:708, y:229}, string:wire("this.rpc.webrequest0.response"), number:wire("this.rpc.outputs0.number"), float:wire("this.rpc.outputs0.float"), int:wire("this.rpc.outputs0.int"), vec2:wire("this.rpc.outputs0.vec2"), vec3:wire("this.rpc.outputs0.vec3"), vec4:wire("this.rpc.outputs0.vec4"), array:wire("this.rpc.outputs0.array"), object:wire("this.rpc.outputs0.object")}),
			webrequest({name:"webrequest0", flowdata:{x:338, y:148}, url:wire("this.rpc.outputs0.url")}),
			knob({name:"knob0", flowdata:{x:32, y:464}}),
			album({name:"album0", flowdata:{x:696, y:33}, images:wire("this.rpc.omdb0.results"), selection:wire("this.rpc.dpad0.value")}),
			dpad({name:"dpad0", flowdata:{x:303, y:291}})
		]
	}
	
}
)