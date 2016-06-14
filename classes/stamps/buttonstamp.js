// create a little stamp based button with hover anim
define.class('$base/stamp', function(){

	define.class(this, 'Background', '$shaders/rectshader', function(){
		this.color = 'red'
		this.duration = 1.
	})

	define.class(this, 'Label', '$shaders/fontshader', function(){
		this.duration = 1.
	})

	this.align = float.CENTER
	this.padding = 1
	this.margin = 1
	this.props = {
		text:'BUTTON',
		fontsize:15
	}

	this.states = {
		default:{
			Background:{
				color: 'gray'
			}
		},
		hover:{
			duration:0.1,
			motion:float.linear,
			Background:{
				color: 'orange',
				padding: 20
			}
		},
		down:{
			Background:{
				color: 'red'
			}
		}
	}

	this.onpointerhover = function(event){
		this.state = this.states.hover
	}

	this.onpointerout = function(event){
		//this.setState(this.states.default)
	}

	this.onpointerstart = function(){
		this.statemap = {w:50,h:50}
		//this.w = 100
		this.canvas.view.redraw()
		//this.setState(this.states.down)
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
		/*
		c.beginBackground(this)

		if(this.text){
			c.drawLabel({text:'WHO'+this.text})
			if(state.icon) c.align.x += 5
		}

		// lets check what kind of icon we have, if its an image we need to draw an image
		if(typeof state.icon === 'string'){
			c.drawIcon()
		}
		else if(state.icon){
			c.drawImage()
		}
		c.endBackground()*/
	}

	this.canvasverbs = {
		draw: function(overload){
			this.STAMPPROPS()
			this.DRAWSTAMP()
		}
	}
})
