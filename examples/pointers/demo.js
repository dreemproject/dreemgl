define.class('$ui/view', function (require, $ui$, screen, view, label) {

	this.flex = 1;
	this.bgcolor = 'gray';

	this.attributes = {
		start: Config({type: Array,  value: []}),
		move: Config({type: Array,  value: []}),
		end: Config({type: Array,  value: []}),
		hover: Config({type: Array,  value: []}),
		tap: Config({type: Array,  value: []})
	}

	this.oninit = function () {
		this.onpointerstart = function(event) {
			this.start = event.value;
		}.bind(this);

		this.onpointermove = function(event) {
			this.move = event.value;
		}.bind(this);

		this.onpointerend = function(event) {
			this.end = event.value;
		}.bind(this);

		this.onpointerhover = function(event) {
			this.hover = event.value;
		}.bind(this);

		this.onpointertap = function(event) {
			this.tap = event.value;
		}.bind(this);
	}

	this.renderLabels = function (type, color) {
		var markers = [];
		for (var i = 0;i < this[type].length; i++) {
			markers.push(label({
				text: i,
				icon: 'play',
				position: 'absolute',
				bgcolor: 'transparent',
				left: this[type][i].x,
				top: this[type][i].y,
				fgcolor: color,
				bordercolor: color,
				borderradius: 0,
				borderwidth: vec4(1,0,1,0),
				padding: vec4(10,0,0,0)
			}, label({
				text: type,
				fgcolor: color,
				bgcolor: 'transparent',
				fontsize: 12,
				position: 'relative',
				top: -22,
				left: -12
			})));
		}
		return markers;
	}

	this.render = function() {
		return [
			this.renderLabels('hover', 'white'),
			this.renderLabels('start', 'red'),
			this.renderLabels('move', 'green'),
			this.renderLabels('end', 'blue'),
			this.renderLabels('tap', 'cyan')
		];
	};

});
