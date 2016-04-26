// create a little stamp based button with hover anim
define.class('$base/stamp', function(){

	// a stamp really needs a canvas struct thing to add to all its subshaders.

	this.attributes = {
		click: Config({type:Event})
	}

	this.canvasprops = {
		click:float,
		hover:float,
		selected:float
	}

	define.class(this, 'Label', '$shaders/fontshader', function(){
		this.fgcolor = [1,1,1,1]
		this.style = function(style){
			return style
		}
	})
	
	define.class(this, 'Icon', '$shaders/iconshader', function(){
		this.fgcolor = [1,1,1,1]
	})

	define.class(this, 'Image', '$shaders/imageshader', function(){
	})

	define.class(this, 'Background', '$shaders/rectshader', function(){
		this.bgcolor = 'gray'
		this.aligncontent = float.CENTER
	})

	this.fontsize = 15
	this.margin = 0

	this.normalcolor = 'gray'
	this.hovercolor = 'lightgray'
	this.downcolor = '#4f4f4f'

	this.onpointerhover = function(event){
		this.hover = 1.0
		this.bgcolorBackground = Animate({1:vec4('red')})
	}

	this.onpointerout = function(event){
		this.hover = 0.
		this.bgcolorBackground = Animate({1:this.normalcolor})
	}

	this.onpointerstart = function(){
		this.bgcolorBackground = Animate({0.1:this.downcolor})
	}

	this.onpointerend = function(){
		this.bgcolorBackground = Animate({0.5:this.normalcolor})
		// lets fire click
		if(this.onclick) this.onclick()
	}

	this.draw = function(){
		var c = this.canvas
		//console.log(c.scope.bgcolorBackground)
		c.fontsize = this.fontsize
		c.beginBackground(this)
		if(this.text){
			c.drawLabel(this.text)
			if(this.icon) c.align.x += 5
		}
		// lets check what kind of icon we have, if its an image we need to draw an image
		if(typeof this.icon === 'string'){
			c.drawIcon(this.icon)
		}
		else{
			c.drawImage(this.icon)
		}
		c.endBackground()
	}

	this.canvasverbs = {
		draw: function(text, icon, x, y, w, h){
			this.DOSTAMP()
			return stamp
		}
	}
})
