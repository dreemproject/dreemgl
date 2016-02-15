define.class('$server/composition', function (require, $ui$, screen, view, label, $$, planner){
	this.render = function(){
		return [
			planner({name: "planner"}),
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
			screen({
				name: "tablet",
				updatechosenresultsinview: function (results) {
					console.log('ChosenResultsInView updated on tablet:', results)
					// TODO: show results in the map
				}
			}, [
				// TODO: map, timeline and ChosenResultsInView list go here
			]),
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
