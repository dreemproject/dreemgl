define.class('$server/composition', function (require, $ui$, screen, view, label, $$, planner){
	this.render = function(){
		return [
			planner({name: "planner"}),
			// Default screen receives Results to diplay on map
			// Default screen receives agenda to diplay on timeline
			screen({
				name: "default",
				init: function () {
					this.rpc.planner.loadResults('data/food.json')
				},
				updateresults: function (results) {
					console.log('Results updated on default:', results)
					// TODO: show results in the map
				},
				updateagenda: function (agenda) {
					console.log('Agenda updated on default:', agenda)
					// TODO: show agenda in the timeline
				}
			},[
				// TODO: map and timeline go here
			]),
			// Tablet screen receives Results to diplay on map
			// Tablet screen receives ChosenResultsInView to perform commit to agenda
			// Tablet screen sets the agenda
			// Tablet screen sets view bounds
			screen({
				name: "tablet",
				updateresults: function (results) {
					console.log('Results updated on tablet:', results)
					// TODO: show results in the map
				},
				updatechosenresultsinview: function (results) {
					console.log('ChosenResultsInView updated on tablet:', results)
					// TODO: show results in the map
				}
			}, [
				// TODO: map, timeline and ChosenResultsInView list go here
			]),
			// Phone screen recieves ResultsInView and performs voting on those items.
			screen({
				name: "phone",
				updateresultsinview: function (results) {
					console.log('ResultsInView updated on phone:', results)
					// TODO: show filtered results in a list
				}
			})
		];
	}
})
