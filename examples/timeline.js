define.class('$server/composition', function($server$, service, $ui$, screen, view, $widgets$timeline$, timeline) {

	this.oninit = function () {
		console.log(this.find('timeline'))
	}

	this.render = function() {
		return [
			screen({name:'default'}, [
				view({flexdirection: 'column'}, [
					timeline({name:'timeline'})
				])
			])
		]
	}
})
