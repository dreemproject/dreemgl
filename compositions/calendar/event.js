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

	this.onmousemove = function (event) {
		this.drag = vec2(event.local.x, event.local.y);
		if (event.local.y < 6) {
			this.cursor = 'ns-resize';
			if (this.dragging) {
				this.top = this.topstart + this.drag.y - this.dragstart.y;
			}
		} else if (this.height - event.local.y < 6) {
			this.cursor = 'ns-resize';
		} else {
			this.cursor = 'pointer';
		}
	}
	this.onmouseleftdown = function (event) {
		this.dragging = true;
		this.topstart = this.top;
		this.heightstart = this.height;
		this.dragstart = vec2(event.local.x, event.local.y);
	}
	this.onmouseleftup = function () {
		this.dragging = false;
	}

	this.position = 'absolute';
	this.height = 200;
	this.left = 64;
	this.right = 32;
	this.borderradius = 6;
	this.borderwidth = 1;
	this.bordercolor = vec4(0, 0, 0, 0.25);
	this.bgcolor = vec4(0.5, 1, 0.5, 1);

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
