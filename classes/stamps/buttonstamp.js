// create a little stamp based button with hover anim
define.class('$base/stamp', function(){

	define.class(this, 'Background', '$shaders/rectshader', function(){
		this.color = 'red'
		this.duration = 10.
	})

	define.class(this, 'Label', '$shaders/fontshader', function(){
		this.duration = 10.
	})

	this.padding = 5

	this.margin = 1
	this.props = {
		text:'BUTTON',
		fontsize:15
	}

	this.states = {
		default:{
			duration:1,
			Background:{
				color: 'gray'
			}
		},
		mousedown:{
			duration:1,
			w:150,
			h:150,
			margin: vec4(10, 30, 5, 20),
			Background:{
				cornerradius: vec4(20, 5, 5, 5),
				borderwidth: vec4(10, 30, 5, 20),
				color: 'orange',
			}
		},
		down:{
			Background:{
				color: 'red'
			}
		}
	}

	this.onpointerhover = function(event){
		//this.state = this.states.hover
	}

	this.onpointerout = function(event){
		//this.setState(this.states.default)
	}

	this.onpointerstart = function(){
		this.state = this.states.mousedown
		//this.state = {duration:2,w:50,h:50, Background:{cornerradius:vec4(0,20,20,0)}}
		//this.canvas.view.redraw()
	}

	this.onpointerend = function(event){
		//this.setState(event.isover?this.states.hover:this.states.default)
	}

	this.draw = function(){
		var c = this.canvas
		c.beginBackground(this)
		if(this.text){
			c.drawLabel({
				text:this.text
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
