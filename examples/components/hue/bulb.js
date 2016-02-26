define.class("$ui/button", function() {

	this.icon = "lightbulb";
	this.flex = 1;
	this.fontsize = 300;
	this.pickalpha = -1;
	this.buttoncolor1 = "transparent";
	this.buttoncolor2 = "transparent";
	this.hovercolor1 = "transparent";
	this.hovercolor2 = "transparent";
	this.pressedcolor1 = "transparent";
	this.pressedcolor2 = "transparent";
	this.borderwidth = 0;
	this.alignself = "center";


	this.attributes = {
		rgb:Config({type:vec3, meta:"color"}),
		alert:Config({type:String}),
		colormode:Config({type:String}),
		effect:Config({type:String}),
		id:Config({type:String}),
		uniqueid:Config({type:String}),
		type:Config({type:String}),
		swversion:Config({type:String}),
		modelid:Config({type:String}),
		manufacturername:Config({type:String}),
		xy:Config({type:vec2}),
		sat:Config({type:int}),
		ct:Config({type:int}),
		hue:Config({type:int}),
		bri:Config({type:int}),
		on:Config({type:Boolean}),
		reachable:Config({type:Boolean})
	};


	this.init = this.onon = this.onbri = this.onrgb = this.reset = function() {
		if (this.rgb && this.bri) {
			if (this.on === true) {
				this.textcolor = vec4(this.rgb[0] / 255.0, this.rgb[1] / 255.0, this.rgb[2] / 255.0, this.bri / 255.0);
				this.textactivecolor = vec4(this.rgb[0] / 255.0, this.rgb[1] / 255.0, this.rgb[2] / 255.0, 1)
			} else {
				this.textcolor = "black";
				this.textactivecolor = vec4(this.rgb[0] / 255.0, this.rgb[1] / 255.0, this.rgb[2] / 255.0, 0.3)
			}
		}
	};

});
