define.class('$server/composition', function(require, timeline, $ui$, screen, view) {
	this.render = function() {
		return [
			screen({name:'index'},
				timeline()
			)
		]
	}
})
