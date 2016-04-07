define.class("$ui/view", function ($ui$, view, label, button, $widgets$, colorpicker) {

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

	this.attributes = {
		config:Config({type:Object}),
		lightname:Config({type:String})
	}

	this.flex = 0;
	this.bgcolor = NaN;
	this.flexdirection = "column";

	this.init = this.onconfig = function() {
		if (this._config) {
			this.lightname = this._config.name
		}
	}

	this.render = function() {
		var controls = []
		var id = this.config.id;

		if ('on' in this._config.state) {
			controls.push(
				view({},
					button({text:"on", click:function() { this.rpc.iot.update(id, 'on', true); }.bind(this) }),
					button({text:"off", click:function() { this.rpc.iot.update(id, 'on', false); }.bind(this) }))
			)
		}

		if ('color' in this._config.state) {
			controls.push(
				colorpicker({
					colorwheel:true,
					colorsliders:false,
					colorbox:false,
					value: vec4(hexToRgb(this._config.state.color)),
					valuechange:function(color) {
						var hex = rgbToHex(color[0], color[1], color[2]);
						this.rpc.iot.update(id, 'color', hex);
					}.bind(this)
				})
			)
		}

		return [
			label({text:this.lightname}),
			controls
		]
	}

});
