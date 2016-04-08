define.class("$ui/view", function ($ui$, view, label) {

	this.attributes = {
		config:Config({type:Object})
	}

	this.render = function() {
		var name = this.config.name;
		var states = [];
		// get the last, most meaningful facet
		var type = this.config.facets[this.config.facets.length - 1];
		states.push(label({text: 'type: ' + type}))
		for (var key in this.config.state) {
			var state = this.config.state[key];
			// format type
			var val = JSON.stringify(state.value);
			if (state.units) {
				// append units after formatting, e.g. temperature.imperial.fahrenheit -> fahrenheit
				var units = state.units.split('.');
				val += ' ' + units[units.length - 1];
			}
			states.push(label({text: key + ': ' + val}))
		}

		return [
			view({
					name:"things",
					flexdirection: "column",
					justifycontent:"space-around"
				},
				label({text:name}),
				states
			)
		]
	}

});
