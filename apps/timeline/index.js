define.class('$server/composition', function(timeline, $server$, service, $ui$, screen, view) {
	this.render = function() {
		return [
			screen({name:'default'}, [
				view({
					flexdirection: 'column',
				}, [
					timeline({name:'timeline'})
				])
			])
		]
	}
})
