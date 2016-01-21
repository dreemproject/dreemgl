define.class('$server/composition', function(require, day, $ui$, screen, view) {

	var now = new Date();
	var eventsDummyData = [
		{
			name: 'Breakfast',
			location: 'Barkeley',
			start: new Date(now.getYear(),now.getMonth(),now.getDate(),7,0,0),
			end: new Date(now.getYear(),now.getMonth(),now.getDate(),9,30,0),
		},
		{
			name: 'Lunch',
			location: 'Oakland',
			start: new Date(now.getYear(),now.getMonth(),now.getDate(),14,0,0),
			end: new Date(now.getYear(),now.getMonth(),now.getDate(),15,0,0),
		},
		{
			name: 'Dinner',
			location: 'Sausalito',
			start: new Date(now.getYear(),now.getMonth(),now.getDate(),19,0,0),
			end: new Date(now.getYear(),now.getMonth(),now.getDate(),20,30,0),
		}
	];

	this.render = function() {
		return [
			screen({name:'index'},
				day({date: now.toLocaleDateString(), format: '12', events: eventsDummyData})
			)
		];
	};

});
