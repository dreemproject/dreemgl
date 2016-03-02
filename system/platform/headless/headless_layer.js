/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/


/**
 * @class HeadlessLayer
 * Simulate a layer (an array of actors or layouts)
 * Modeled from DALi platform.
 */

define.class(function(require, exports){
	// internal, HeadlessApi is a static object to access the headless api
	HeadlessApi = require('./headless_api')

	// Assign a unique id to each headlessactor object
	var HeadlessLayer = exports
	HeadlessLayer.GlobalId = 0

	/**
	 * @method constructor
	 * Create a layout object with default parameters
	 * @param {Object} parent The layer object to add this layer to. If this
	 * is not defined, the layer is added to the top-level layer. If null,
	 * the layer is not added. The null case is used to initialize the
	 * root layer.
	 * @param {Number} width The width of the layer, in pixels.
	 * @param {Number} height The height of the layer, in pixels.
	 */
	this.atConstructor = function(parent, width, height) {
		this.object_type = 'HeadlessLayer'

		var headless = HeadlessApi.headless;

		this.id = ++HeadlessLayer.GlobalId;
		this.onstage = false;
		if (width && height)
			this.size = [width, height, 0];

		// The list of objects (actors or layers) belonging to this layer.
		this.actors = [];

		// Add to another layer unless parent is null (root layer)
		if (typeof parent === 'undefined')
			parent = HeadlessApi.currentlayer;
		if (parent) {
			HeadlessApi.rootlayer.add(this);
		}
	}


	/**
	 * @method add
	 * Add an actor to this layer.
	 * @param {object} actor HeadlessActor or HeadlessLayer object
	 */
	this.add = function(actor) {
		this.actors.push(actor);
	}


	this.name = function() {
		return 'headlesslayer' + this.id;
	}

	this.currentstate = function(verbose) {
		var states = [];
		var actors = []
		for (var i in this.actors) {
			actors.push(this.actors[i].name());
			states = states.concat(this.actors[i].currentstate(verbose));
		}
		
		if (!HeadlessApi.isShown(this.name())) {
			var state = [
				{name: this.name()}
				,{actors: actors}
			]
			
			HeadlessApi.shownObject(this.name());
			states.push(state);
		}

		return states;
	}

	this.inspect = function(depth) {
		var obj = {headlesslayer:this.id, actors:this.actors};
		var util = require('util')
		return util.inspect(obj, {depth: null});
	}

});
