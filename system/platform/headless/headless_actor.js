/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/


/**
 * @class HeadlessActor
 * Simulate an actor (modeled from DALi platform).
 */

define.class(function(require, exports){
	// internal, HeadlessApi is a static object to access the headless api
	HeadlessApi = require('./headless_api')

	// Assign a unique id to each headlessactor object
	var HeadlessActor = exports
	HeadlessActor.GlobalId = 0

	/**
	 * @method constructor
	 * Create a headless.Actor object with default parameters
	 * You can access the headless.Actor object as this.headlessactor
	 * @param {Object} view The view object the actor belongs to
	 */
	this.atConstructor = function(view) {
		this.object_type = 'HeadlessActor'

		var headless = HeadlessApi.headless;

		// Current values
		this.props = {};

		// Cache the property values (uniforms) to minimize writes.
		this.property_cache = {};

		// Keep a copy of the view in case it is useful.
		this.id = ++HeadlessActor.GlobalId;
		this.view = view;
		this.onstage = false;

		// The width/height of the actor to stored in a view's layout
		var layout = view.view._layout;
		var width = layout.width || 100;
		var height = layout.height || 100;

		this.size = [width, height, 0];
	}

	/**
	 * @method addRenderer
	 * Add a renderer to the actor.
	 * @param {Object} HeadlessRenderer object to add. Adding the first renderer
	 *								 also adds the object to the stage.
	 */
	this.addRenderer = function(renderer) {
		this.headlessrenderer = renderer;

		// Add the actor to the stage
		if (!this.onstage) {
			HeadlessApi.addActor(this);
			this.onstage = true;
		}

	}


	/**
	 * @method setColor
	 * Specify the color of the actor
	 * @param {object} color 4 element array of [r,g,b,a]
	 */
	HeadlessApi.setColor = function(color) {
		this.headlessactor.color = color;
	}


	// Internal, method to format a single value when emitting headless code
	this.formatSingle = function(value) {
		if (typeof value === 'undefined')
			return 0;

		// I've seen NaN values. Headless doesn't accept them
		if (isNaN(value) || value === null) {
			return 0;
		}

		if (typeof value === 'string' || typeof value === 'boolean')
			return value;


		var ivalue = parseInt(value);
		if (value == ivalue)
			return ivalue;

		return value;
	}

	// Internal, method to format a value when emitting headless code
	this.formatValue = function(value) {
		if (!Array.isArray(value))
			return this.formatSingle(value);

		var str = [];
		for (var i in value) {
			str.push(this.formatSingle(value[i]));
		}

		return str.join(', ');
	}

	/**
	 * @method setUniformValue
	 * Sets a uniform value. If a value exists in the cache (and has changed),
	 * the property is set directly. Otherwise, registerAnimatableProperty
	 * is called.
	 * @param {string} Name of uniform to set
	 * @param {Object} Compiled uniform structure
	 */
	this.setUniformValue = function(name, uni) {
		var val = HeadlessApi.getArrayValue(uni);
		var key = '_' + name;

		// Do nothing if the value has not changed
		var hash = HeadlessApi.getHash(val);
		var lasthash = this.property_cache[name];
		if (lasthash && (lasthash == hash))
			return;

		var fval = this.formatValue(val);

		this.props[key] = val;
		this.property_cache[name] = hash;
	}


	this.name = function() {
		return 'headlessactor' + this.id;
	}

	this.currentstate = function(verbose) {
		var states = this.headlessrenderer.currentstate(verbose);

		if (!HeadlessApi.isShown(this.name())) {
			var props = [];
			var keys = Object.keys(this.props).sort();
			for (var i in keys) {
				var key = keys[i];
				var prop = {};

				// Format the values. This might be an array
				var vals = this.props[key];
				var v;
				if (Array.isArray(vals)) {
					v = [];
					for (var i in vals) {
						v.push(parseFloat(vals[i].toFixed(4)));
					}
				}
				else {
					v = parseFloat(vals.toFixed(4));
				}
				

				prop[key] = v;
				props.push(prop);
			}

			var state = [
				{name: this.name()}
				,{renderer: this.headlessrenderer.name()}
				,{onstage: this.onstage}
			];
			if (props.length > 0)
				state.push ({props: props});

			states.push(state);
			HeadlessApi.shownObject(this.name());
		}
		
		return states;
	}

	this.inspect = function(depth) {
		//HACK
		this.currentstate();
		
		var obj = {headlessActor:this.id, obj:[this.headlessrenderer.inspect(depth)]};
		var util = require('util')
		return util.inspect(obj, {depth: null});
	}

});
