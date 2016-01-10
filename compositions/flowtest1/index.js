define.class("$server/composition",function($server$, service, $ui$, screen, view, $examples$request$, get, $flow$services$, rovi, map, omdb, weather, webrequest, $flow$controllers$, xypad, knob, gamepad, keyboard, dpad, $flow$displays$, labtext, inputs, outputs) {
	this.render = function() {
		return [
			// get({name:'omdb'}),
			xypad({
				name:'xy1', 
				flowdata:{x:192, y:14}
			}),
			map({name:"map0", flowdata:{x:813, y:341}}),
			outputs({name:"outputs0", flowdata:{x:80, y:139}}),
			omdb({name:"omdb0", flowdata:{x:600, y:9}, keyword:wire("this.rpc.outputs0.string")}),
			inputs({name:"inputs0", flowdata:{x:827, y:30}, array:wire("this.rpc.omdb0.results")}),
			inputs({name:"inputs0", flowdata:{x:870, y:36}, vec2:wire("this.rpc.outputs0.vec2"), int:wire("this.rpc.outputs0.int"), float:wire("this.rpc.outputs0.float"), number:wire("this.rpc.outputs0.number"), vec3:wire("this.rpc.outputs0.vec3"), vec4:wire("this.rpc.outputs0.vec4"), array:wire("this.rpc.outputs0.array"), string:wire("this.rpc.outputs0.string"), object:wire("this.rpc.outputs0.object")})
		]
	}
	
}
)