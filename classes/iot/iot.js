define.class("$server/service", function (require) {
	// The iot class makes it very easy to connect to a wide variety of devices including
	// SmartThings, Philips Hue and many more.
	//
	// IMPORTANT: see /examples/components/iot/README.md for setup instructions.
	this.name = "iot"

	this.__thingmodel = {}

	this.attributes = {
		// A list of things connected to the hub, automatically updated as new devices are discovered and their state changes.
		// Each thing consists of an object containing an id, name, and a state object representing its current state's value type, unit and if it's readonly or not where available.
		things: Config({type: Array, value: [], flow:"out"}),
		// If true, we are connected
		connected: Config({type: Boolean, value: false, persist: true, flow:"out"})
	}

	// Updates a specific thing's state to a new value
	this.update = function(thingid, state, value) {
		for (var i = 0; i < this.__things.length; i++) {
			var thing = this.__things[i];
			// console.log('thing', thing)
			var meta = thing.state('meta');
			var id = meta['iot:thing-id'];
			if (id === thingid) {
				// found the thing, set its state
				thing.set(':' + state, value);
				return;
				// console.log('found id', thingid, state, value)
			}
		}
		// we should have returned above
		if (! thing) {
			console.warn('missing thing', thingid);
		}
	}

	// Updates all things to a new value
	this.updateAll = function(state, value) {
		// set on all things
		this.__things.set(':' + state, value);
	}

	this.__updateModel = function(thing) {
		var id = thing.thing_id();
		var meta = thing.state("meta");
		var model = thing.state("model");
		var states = thing.state("istate")
		var facets = meta['iot:facet'];
		if (facets && facets.map) {
			facets = facets.map(function(facet) {
				return facet.split(':')[1]
			})
		}

		// ignore timestamps
		delete states['@timestamp'];

		var attributemeta = model['iot:attribute']
		// console.log('thing metadata', id, meta, facets)
		// console.log('thing model', attributemeta);

		// rewrite state to include metadata about type, readonly
		for (var i = 0; i < attributemeta.length; i++) {
			var attrmodel = attributemeta[i];
			var key  = attrmodel['schema:name'];
			var units = attrmodel['iot:unit'];
			if (units) {
				units = units.split(':')[1];
			}
			states[key] = {
				value: states[key],
				type: attrmodel['iot:type'].split('.')[1],
				readonly: ! attrmodel['iot:write'],
				units: units
			}
		}

		var newdata = {
			state: states,
			id: meta['iot:thing-id'],
			name: meta['schema:name'],
			reachable: meta['iot:reachable'],
			manufacturer: meta['schema:manufacturer'],
			model: meta['schema:model'] || meta['iot:model-id'],
			facets: facets
		};

		// copy over fields
		if (JSON.stringify(this.__thingmodel[id]) === newdata) return;
		this.__thingmodel[id] = newdata

		var keys = Object.keys(this.__thingmodel).sort();
		var things = [];
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			things[i] = this.__thingmodel[key];
		}

		this.things = things;
		// console.log("updated state\n", JSON.stringify(things));
	}

	this.init = function() {
		// allow connection logic to be overridden
		this.__things = this.connect(require("iotdb"));
		// console.log('THINGS: ', this.__things);

		// listen for new things
		this.__things.on("thing", function(thing) {
			//console.log('new THING: ', thing)
			this.__updateModel(thing);
			// register for changes to each thing
			thing.on("istate", function(thing_inner) {
				// console.log('new state on THING: ', thing)
				// update to reflect changes
				this.__updateModel(thing_inner);
			}.bind(this));
		}.bind(this));
	}

	// Override to change what gets connected. Currently attempts to connect all devices.
	this.connect = function(iotdb) {
		if (this.connected) return;
		return iotdb.connect('HueLight', {poll: 1}).connect();
		this.connected = true;
	}
});
