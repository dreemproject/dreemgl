// create a little stamp based button with hover anim
define.class('$base/stamp', function(){

	define.class(this, 'Label', '$shaders/fontshader', function(){
		this.fgcolor = [1,1,1,1]
	})
	
	define.class(this, 'Icon', '$shaders/iconshader', function(){
		this.fgcolor = [1,1,1,1]
	})

	define.class(this, 'Background', '$shaders/rectshader', function(){
		this.fgcolor = [0.25,0.25,0.25,1]
		this.aligncontent = float.LEFT
	})

	this.fontsize = 15
	this.margin = 1
	this.padding = 20

	this.Rect = function(){
		this.fgcolor = 'red'
	}

	this.onpointerhover = function(event){
		this.fgcolorBackground = Animate({1:[0,1,0,1]})
		//this.xLabel += 10
	}

	this.draw = function(){
		var c = this.canvas
		c.fontsize = this.fontsize
		c.beginBackground(this)
		if(this.text){
			c.drawLabel(this.text)
			if(this.icon) c.align.x += 5
		}
		if(this.icon) c.drawIcon(this.icon)
		c.endBackground()
	}

	this.canvasverbs = {
		draw: function(text, icon, x, y, w, h){
			this.DOSTAMP()
		}
	}
})
