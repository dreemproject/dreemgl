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
		ease:vec4(0),
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

	this.animate = function(){
		if(props.duration <0.001) return 1.
		var anim = clamp((system.time - props.animstarttime) / props.duration,0.,1.)
		return anim// sin(anim*PI-.5*PI)*.5+.5
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