// create a little stamp based button with hover anim
define.class('$base/stamp', function(){

	define.class(this, 'Background', '$shaders/rectshader', function(){
		this.color = '#dfdfdf'
		this.margin = vec4(3)
		this.cornerradius = vec4(5)
		this.borderwidth = vec4(1)
		this.bordercolor = '#a0a0a0'
		this.duration = 0.1
		this.ease = [0.5,0,0.5,1]
		this.shadowalpha = 0
	})

	define.class(this, 'Label', '$shaders/fontshader', function(){
		this.color = '#333'
		this.fontsize = 14
		this.duration = 0.1
		this.ease = [0.5,0,0.5,1]
	})

	this.cursor = 'pointer'

	this.props = {
		text: 'BUTTON',
		padding: 10
	}

	this.states = {
		hover: {
			Background: {
				color: '#d5d5d5',
				shadowradius: 6,
				shadowoffset: [5, 5],
				shadowalpha: 0.3
			},
			Label: {
				color: '#222'
			}
		},
		down:{
			Background:{
				color: '#e5e5e5',
				shadowradius: 2,
				shadowoffset: [1,1]
			}
		}
	}

	this.onpointerhover = function(event){
		this.state = this.states.hover
	}

	this.onpointerout = function(event){
		this.state = this.states.default
	}

	this.onpointerstart = function(){
		this._previousstate = this.state
		this.state = this.states.down
	}

	this.onpointerend = function(event){
		this.state = event.isover ? this._previousstate : this.states.default
	}

	this.draw = function(){
		var c = this.canvas
		c.beginBackground(this)
		if(this.text){
			c.drawLabel({
				text: this.text
			})
		}
		c.endBackground()
	}

	this.canvasverbs = {
		draw: function(overload){
			this.STAMPPROPS()
			this.DRAWSTAMP()
		}
	}
})
