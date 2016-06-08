// create a little stamp based button with hover anim
define.class('$base/stamp', function(){

	define.class(this, 'Background', '$shaders/rectshader', function(){
		this.aligncontent = float.CENTER
	})

	this.props = {
		text:'DEFAULT',
		fontsize:15
	}

	this.states = {
		default:{
			duration:0.1,
			motion:float.linear,
			Background:{
				color: 'gray'
			}
		},
		hover:{
			duration:0.1,
			motion:float.linear,
			Background:{
				color: 'orange'
			}
		},
		down:{
			Background:{
				color: 'red'
			}
		}
	}

	this.onpointerhover = function(event){
		this.setState(this.states.hover)
	}

	this.onpointerout = function(event){
		this.setState(this.states.default)
	}

	this.onpointerstart = function(){
		this.setState(this.states.down)
	}

	this.onpointerend = function(event){
		this.setState(event.isover?this.states.hover:this.states.default)
	}

	this.draw = function(state){
		var c = this.canvas
		c.drawBackground(this)
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
