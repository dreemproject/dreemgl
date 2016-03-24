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

	this.view = {totalmatrix:mat4(), pickview:0.}
	this.state = {viewmatrix:mat4()}

	// baseic rect
	this.mesh = vec2.array()
	this.mesh.pushQuad(0,0,1,0,0,1,1,1)

	this.position = function(){
		var pos = vec3(mesh.x * 100, mesh.y * 100, 0)
		var res = vec4(pos, 1) * view.totalmatrix * state.viewmatrix
		return res
	}

	this.color = function(){
		return vec4('red')
	}

	this.pickalpha = 0.5

	// the pick entry point
	this.pick = function(){
		var col = this.color()
		var total = view.pickview + canvas.pickdraw
		return vec4(floor(total/65536.)/255., mod(floor(total/256.),256.)/255., mod(total,256.)/255., col.a>pickalpha?1.:0.)
	}

	this.pixelentries = ['color','pick']

	Object.defineProperty(this, 'aligncontent',{
		set:function(value){
			this._aligncontent = 0
			if(typeof value === 'number') return this._aligncontent = value
			if(value.indexOf('left') !== -1) this._aligncontent |= Canvas.LEFT
			if(value.indexOf('top') !== -1) this._aligncontent |= Canvas.TOP
			if(value.indexOf('right') !== -1) this._aligncontent |= Canvas.RIGHT
			if(value.indexOf('bottom') !== -1) this._aligncontent |= Canvas.BOTTOM
			if(value.indexOf('nowrap') !== -1) this._aligncontent |= Canvas.NOWRAP
		},
		get:function(){
			return this._aligncontent
		}
	})

	this._absolute = 0
	Object.defineProperty(this, 'top',{
		set:function(value){
			if(value === undefined) return this._absolute &= 2|4|8
			this._top = value
			this._absolute |= 1
		},
		get:function(){return this._top}
	})
	Object.defineProperty(this, 'right',{
		set:function(value){
			if(value === undefined) return this._absolute &= 1|4|8
			this._right = value
			this._absolute |= 2
		},
		get:function(){return this._right}
	})
	Object.defineProperty(this, 'bottom',{
		set:function(value){
			if(value === undefined) return this._absolute &= 1|2|8
			this._bottom = value
			this._absolute |= 4
		},
		get:function(){return this._bottom}
	})
	Object.defineProperty(this, 'left',{
		set:function(value){
			if(value === undefined) return this._absolute &= 1|2|4
			this._left = value
			this._absolute |= 88
		},
		get:function(){return this._left}
	})

	this.margin = [0,0,0,0]
	this.padding = [0,0,0,0]

	this.canvas = {
		pickdraw:float,
	}
})