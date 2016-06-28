define.class('$base/shader', function(require){
	// baseclass shader with a pick entry point for UI picking

	var Canvas = require('$base/canvas').prototype

	this.noiselib = require('./shaderlib/noiselib')
	this.pallib = require('./shaderlib/palettelib')
	this.shapelib = require('./shaderlib/shapelib')
	this.mathlib = require('./shaderlib/mathlib')
	this.demolib = require('./shaderlib/demolib')
	this.materiallib = require('./shaderlib/materiallib')
	this.colorlib = require('./shaderlib/colorlib')

	this.Texture = require('$base/texture')

	this.props = {
		x:NaN,
		y:NaN,
		w:NaN,
		h:NaN,
		z:0,
		margin:[0,0,0,0],
		padding:[0,0,0,0],
		align: float.LEFTTOP,
		wrap: float.WRAP,
		visible:1.0,
		ease:vec4(0,0,1.,1.),
		duration:0.,
		delay:0.,
		animstarttime:0
	}

	this.staticprops = {
		visible:true,
		ease:true,
		duration:true,
		delay:true,
		animstarttime:true
	}

	this.putprops = {
		animstarttime:true
	}

	this.stamp = {
		pickdraw:0.
	}

	this.view = {
		totalmatrix:mat4(),
		pickview:0.
	}

	this.system = {
		time:0.,
		viewmatrix:mat4(),
	}


	var abs = Math.abs
	this.animBezier = function(c0, c1, c2, c3, t){
		// linear out
		if(abs(c0-c1) < 0.001 && abs(c2-c3) < 0.001) return t

		var epsilon = 1.0/200.0 * t
		var cx = 3.0 * c0
		var bx = 3.0 * (c2 - c0) - cx
		var ax = 1.0 - cx - bx
		var cy = 3.0 * c1
		var by = 3.0 * (c3 - c1) - cy
		var ay = 1.0 - cy - by

		var t2 = t
	
		for(var i = 0; i < 6; i++){
			var x2 = ((ax * t2 + bx) * t2 + cx) * t2 - t
			if(abs(x2) < epsilon) return ((ay * t2 + by) * t2 + cy) * t2
			var d2 = (3.0 * ax * t2 + 2.0 * bx) * t2 + cx
			if(abs(d2) < 1e-6) break// return ((ay * t2 + by) * t2 + cy) * t2
			t2 = t2 - x2 / d2
		}

		//return 0.1
		var t0 = 0.
		var t1 = 1.0
		t2 = t

		if(t2< 0.) return 0.
		if(t2 > 1.) return ((ay + by) + cy) 
		
		var l = 0
		for(var i = 0; i < 8; i++){
			var x2 = ((ax * t2 + bx) * t2 + cx) * t2
			if(abs(x2 - t) < epsilon) return ((ay * t2 + by) * t2 + cy) * t2
			if(t > x2) t0 = t2
			else t1 = t2
			t2 = (t1 - t0) *.5 + t0
		}

		return ((ay * t2 + by) * t2 + cy) * t2
	}


	this.animate = function(){
		if(props.duration <0.001) return 1.
		var intime = clamp((system.time - props.animstarttime) / props.duration,0.,1.)
		return this.animBezier(props.ease.x, props.ease.y, props.ease.z, props.ease.w, intime)
		//return anim// sin(anim*PI-.5*PI)*.5+.5
	}

	// baseic rect
	this.geometry = {
		pos:vec2.array()
	}

	this.geometry.pos.pushQuad(0, 0, 1, 0, 0, 1, 1, 1)

	this.vertex = function(){
		var pos = vec3(geometry.pos.x * 100, geometry.pos.y * 100, 0)
		var res = vec4(pos, 1.) * view.totalmatrix * system.viewmatrix
		return res
	}

	this.pixel = function(){
		return vec4('red')
	}

	this.pickalpha = 0.5

	// the pick entry point
	this.pick = function(){
		var col = this.pixel()
		var total = view.pickview + stamp.pickdraw
		return vec4(floor(total/65536.)/255., mod(floor(total/256.),256.)/255., mod(total,256.)/255., col.a>pickalpha?1.:0.)
	}

	this.pixelentries = ['pixel','pick']

	this.pickdraw = 0.

	this.canvasverbs = {
		uniforms: function(uni){
		},
		geometry: function(geom){
		},
		flush: function(){
		}
	}
	//this.dump = 1
})