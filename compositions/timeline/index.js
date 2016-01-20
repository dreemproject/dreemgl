define.class('$server/composition', function(require, day, $ui$, screen, view) {

	this.render = function() {
		return [
			screen({name:'index'},
				day({date: new Date(), format: '24'})
			)
		];
	};

});
