define.class('$ui/view', function ($ui$, label) {

	this.attributes = {
		data: Config({type: Object,  value: {}}),
	};

	this.ondata = function () {
		var start = this.data.start.getHours() + this.data.start.getMinutes() / 60;
		var end = this.data.end.getHours() + this.data.end.getMinutes() / 60;
		var len = end - start;
		this.height = 50 * len;
		this.top = 50 * start;
	}

	this.position = 'absolute';
	this.height = 200;
	this.left = 64;
	this.right = 32;
	this.borderradius = 12;
	this.borderwidth = 1;
	this.bordercolor = vec4(0, 0, 0, 0.25);
	this.bgcolor = vec4(0.5, 1, 0.5, 0.5);

	this.render = function () {
		return [
			label({
				name:"label",
				text: this.data.name,
				fgcolor:vec3(0.2,0.2,0.2),
				fontsize:16,
				fontweight:'bold',
				bgcolor:vec4(0,0,0,0),
				padding: vec4(12, 2, 12, 2),
			})
		]
	}

});
