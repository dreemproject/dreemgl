define.class('$server/composition', function(timeline, $ui$, screen) {
	this.render = function() {
		return [screen({name:'index'}, timeline())]
	}
})
