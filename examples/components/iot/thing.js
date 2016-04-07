define.class("$ui/view", function ($ui$, view, label) {

	this.attributes = {
		config:Config({type:Object})
	}

	this.render = function() {
		var name = this.config.name;
		var states = [];
		var type = this.config.facets[this.config.facets.length - 1];
		states.push(label({text: 'type: ' + type}))
		for (var key in this.config.state) {
			if (key === '@timestamp') continue;
			var val = JSON.stringify(this.config.state[key]);
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
