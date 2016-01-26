/* Copyright 2015-2016 Teem. Licensed under the Apache License, Version 2.0 (the "License"); Dreem is a collaboration between Teem & Samsung Electronics, sponsored by Samsung. 
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


/**
 * @class DaliLayer
 * A DaliLayer is like a DaliActor that contains a group of actors. It is not
 * derived from DaliActor.
 *
 * Each instance of DaliLayer contains a dali.Layer object.
 */

/**
 * @property dalilayer
 * dali.Layer object
 */

define.class(function(require, exports){
	// internal, DaliApi is a static object to access the dali api
	DaliApi = require('./dali_api')

	// Assign a unique id to each daliactor object
	var DaliLayer = exports
	DaliLayer.GlobalId = 0

	/**
	 * @method constructor
	 * Create a dali.Layer object with default parameters
	 * You can access the dali.Layer object as this.dalilayer
	 * @param {Object} parent The layer object to add this layer to. If this
	 * is not defined, the layer is added to the top-level layer. If null,
	 * the layer is not added. The null case is used to initialize the
	 * root layer.
	 * @param {Number} width The width of the layer, in pixels.
	 * @param {Number} height The height of the layer, in pixels.
	 */
	this.atConstructor = function(parent, width, height) {
		this.object_type = 'DaliLayer'

		var dali = DaliApi.dali;

		this.id = ++DaliLayer.GlobalId;
		this.dalilayer = new dali.Layer();

		this.onstage = false;

		this.dalilayer.behavior = "Dali::Layer::LAYER_2D";
		if (width && height)
			this.dalilayer.size = [width, height, 0];

		this.dalilayer.parentOrigin = dali.TOP_LEFT;
		this.dalilayer.anchorPoint = dali.TOP_LEFT;

		if (DaliApi.emitcode) {
			console.log('DALICODE: var ' + this.name() + ' = new dali.Layer();');
			console.log('DALICODE: ' + this.name() + '.behavior = "Dali::Layer::LAYER_2D"');
			if (width && height)
				console.log('DALICODE: ' + this.name() + '.size = [' + width + ', ' + height + ', 0];');
			console.log('DALICODE: ' + this.name() + '.parentOrigin = dali.TOP_LEFT;');
			console.log('DALICODE: ' + this.name() + '.anchorPoint = dali.TOP_LEFT;');
		}


		// Add to another layer unless parent is null (root layer)
		if (typeof parent === 'undefined')
			parent = DaliApi.currentlayer;
		if (parent) {
			DaliApi.rootlayer.add(this);
			//parent.add(this);
		}
	}


	/**
	 * @method add
	 * Add an actor to this layer.
	 * @param {object} actor DaliActor or DaliLayer object
	 */
	this.add = function(actor) {
		if (actor.dalilayer) {
			// Adding a layer to an existing layer
			this.dalilayer.add(actor.dalilayer)
		}
		else {
			// Adding an actor to a layer
			this.dalilayer.add(actor.daliactor)
		}


		if (DaliApi.emitcode) {
			console.log('DALICODE: ' + this.name() + '.add(' + actor.name() + ');');
		}
	}


	this.name = function() {
		return 'dalilayer' + this.id;
	}

	this.inspect = function(depth) {
		var obj = {dalilayer:this.id};
		var util = require('util')
		return util.inspect(obj, {depth: null});
	}

});
