define.class('$ui/view', function () {

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
	this.borderwidth = 3;
	this.bordercolor = vec4(0, 0, 0, 0.2);
	this.bgcolor = vec4(0.5, 1, 0.5, 0.5);

});
