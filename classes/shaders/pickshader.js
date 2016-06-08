define.class('$base/shader', function(require){
	// baseclass shader with a pick entry point for UI picking

	var Canvas = require('$base/canvas').prototype

	this.noise = require('./shaderlib/noiselib')
	this.pal = require('./shaderlib/palettelib')
	this.shape = require('./shaderlib/shapelib')
	this.math = require('./shaderlib/mathlib')
	this.demo = require('./shaderlib/demolib')
	this.material = require('./shaderlib/materiallib')
	this.colorlib = require('./shaderlib/colorlib')

	this.Texture = require('$base/texture')

	this.props = {
		x:0,
		y:0,
		z:0,
		w:100,
		h:100,
		margin:[0,0,0,0],
		padding:[0,0,0,0],
		aligncontent: float.LEFTTOP,
		alignwrap: float.WRAP
	}

	this.view = {
		totalmatrix:mat4(),
		pickview:0.
	}

	this.system = {
		time:0.,
		viewmatrix:mat4(),
	}

	var mystruct = define.struct({
		a:vec2,
		b:vec2
	})

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
		var total = view.pickview + this.pickdraw
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
})