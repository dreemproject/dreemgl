define.class("$server/service", function (require) {

	this.name = "iot";

	this.__thingmodel = {}

	this.attributes = {
		things: {}
	}

	this.update = function(thingid, state, value) {
		for (var i = 0; i < this.__things.length; i++) {
			var thing = this.__things[i];
			// console.log('thing', thing)
			var meta = thing.state('meta');
			var id = meta['iot:thing-id'];
			if (id === thingid) {
				// found the thing, set its state
				thing.set(':' + state, value);
				// console.log('found id', thingid, state, value)
			}
		}
		if (! thing) console.warn('missing thing', thingid);
	}

	this.updateAll = function(state, value) {
		// set on all things
		this.__things.set(':' + state, value);
	}

	this.__updateModel = function(thing) {
		var id = thing.thing_id();
		var meta = thing.state("meta");
		var states = thing.state("istate")
		var facets = meta['iot:facet'];
		if (facets && facets.map) {
			facets = facets.map(function(facet) {
				return facet.split(':')[1]
			})
		}
		// console.log('thing metadata', id, meta, facets)

		// copy over fields
		this.__thingmodel[id] = {
			state: states,
			id: meta['iot:thing-id'],
			name: meta['schema:name'],
			reachable: meta['iot:reachable'],
			manufacturer: meta['schema:manufacturer'],
			model: meta['schema:model'] || meta['iot:model-id'],
			facets: facets
		};

		var keys = Object.keys(this.__thingmodel).sort();
		var things = [];
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			things[i] = this.__thingmodel[key];
		}

		// shouldn't this be enough to update the attribute in the browser over RPC?
		this.things = things;
		// console.log("updated state\n", JSON.stringify(things));
	}

	this.init = function() {
		var iotdb = require("iotdb");

		this.__things = iotdb.connect('HueLight', {poll: 1}).connect();
		// console.log('THINGS: ', this.__things);

		// listen for new things
		this.__things.on("thing", function(thing) {
			// console.log('new THING: ', thing)
			this.__updateModel(thing);
			// register for changes to each thing
			thing.on("istate", function(thing_inner) {
				// console.log('new state on THING: ', thing)
				// update to reflect changes
				this.__updateModel(thing_inner);
			}.bind(this));
		}.bind(this));
	}

});
