define.class("$ui/screen", function ($ui$, icon, slider, button, checkbox, label, screen, view, cadgrid,
									 $widgets$, colorpicker) {

	function componentToHex(c) {
		c = Math.floor(c);
		var hex = c.toString(16);
		return hex.length === 1 ? "0" + hex : hex;
	}

	function rgbToHex(r, g, b) {
		return "#" + componentToHex(r * 255) + componentToHex(g * 255) + componentToHex(b * 255);
	}

	function hexToRgb(hex) {
		hex += '';
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? vec4(
			parseInt(result[1], 16) / 255,
			parseInt(result[2], 16) / 255,
			parseInt(result[3], 16) / 255,
			1
		) : null;
	}


	this.render = function() {
		return [
			view({
				name:"main",
				flexdirection: "row",
				alignitems: "center",
				things: Config({type:Array, value:wire('this.rpc.iot.things')}),
				render: function() {
					// console.log("Things:", this.things)

					var lights = [];

					for (var i = 0; i < this.things.length; i++) {
						(function(i) {
							var thing = this.things[i];
							var id = thing.id;
							var type = thing.facets[thing.facets.length - 1];

							// don't show these...
							delete thing.state['@timestamp']

							lights.push(
								label({
									text: thing.name + ' ' + type + ' ' + JSON.stringify(thing.state)
								})
							)

							if ('on' in thing.state) {
								lights.push(
									button({
										text:"on",
										click:function() {
											this.rpc.iot.update(id, 'on', true);
										}.bind(this)
									})
								)

								lights.push(
									button({
										text:"off",
										click:function() {
											this.rpc.iot.update(id, 'on', false);
										}.bind(this)
									})
								)
							}

							if ('color' in thing.state) {
								lights.push(
									colorpicker({
										value: vec4(hexToRgb(thing.state.color)),
										valuechange:function(color) {
											var hex = rgbToHex(color[0], color[1], color[2]);
											this.rpc.iot.update(id, 'color', hex);
										}.bind(this)
									})
								)
							}
						}.bind(this))(i);
					}

					lights.push(
						button({
							text:"all on",
							click:function() {
								this.rpc.iot.updateAll('on', true)
							}.bind(this)
						})
					);

					lights.push(
						button({
							text:"all off",
							click:function() {
								this.rpc.iot.updateAll('on', false)
							}.bind(this)
						})
					);

					return lights;
				}
			})
		]
	}

});
