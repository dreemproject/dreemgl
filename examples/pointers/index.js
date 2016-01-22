define.class('$server/composition', function(demo, require, $ui$, screen, view) {

	this.render = function() {
		return [
			screen({name:'index'},
				demo({})
			)
		];
	};

});
