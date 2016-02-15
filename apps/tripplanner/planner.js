define.class(function(require, $server$, service){

	this.attributes = {
		// Current map bounds vec4(minlat, maxlat, minlng, maxlng)
		viewBounds: Config({type: vec4, value: vec4(-Infinity, Infinity, -Infinity, Infinity)}),

		// All results available
		results: Config({type: Array, value: []}),
		// Results filtered by view bounds
		resultsInView: Config({type: Array, value: []}),
		// Results filtered by view and user choices
		chosenResultsInView: Config({type: Array, value: []}),

		// List of users and their votes
		users: Config({type: Array, value: []}),

		// Final list of locations representing the agenda
		agenda: Config({type: Array, value: []})
	}

	var User = function(name, img, color) {
		this.name = name
		this.img = img
		this.color = color
		this.choices = {
			items: [], // List of item votes (+1, -1, -Infinity)
			categories: [], // List of category votes (+1, -1, -Infinity)
			priceRange: vec2(0, Infinity)
		}
	}

	this.atConstructor = function () {
		this.users.push(new User('Angela', 'images/angela.jpg', 'red'))
		this.users.push(new User('Pol', 'images/pol.jpg', 'green'))
		this.users.push(new User('David', 'images/david.jpg', 'blue'))
		this.users.push(new User('Ben', 'images/ben.jpg', 'cyan'))
	}

	var fs = require('fs')

	this.loadResults = function(url) {
		this.results = JSON.parse(fs.readFileSync(define.expandVariables(define.classPath(this) + url), 'utf8'))
		this.rpc.default.updateresults(this.results) // default view gets all results to show in the map
	}

	this.onresults = function () {
		this.filterByView()
	}

	this.onviewBounds = function () {
		this.filterByView()
	}

	this.filterByView = function () {
		var filtered = []
		for (var i = 0; i < this.results.length; i++) {
			if (this.results[i].latitude > this.viewBounds[0] &&
				this.results[i].latitude < this.viewBounds[1] &&
				this.results[i].longitude > this.viewBounds[2] &&
				this.results[i].longitude < this.viewBounds[3]) {
					filtered.push(this.results[i])
				}
		}
		this.resultsInView = filtered
		this.rpc.phone.updateresultsinview(this.resultsInView)
	}

	this.onresultsInView = function () {
		this.filterByChoices()
	}

	this.filterByChoices = function () {
		var filtered = []
		// TODO: Implement choices filter
		for (var i = 0; i < this.resultsInView.length; i++) {
			filtered.push(this.resultsInView[i])
		}
		this.chosenResultsInView = filtered
		this.rpc.tablet.updatechosenresultsinview(this.chosenResultsInView)
	}


})
