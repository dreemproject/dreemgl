/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others. 
	 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
	 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


/**
 * @class HeadlessRenderer
 * Simulate a renderer (shader + material)
 * Modeled from DALi platform.
 */

define.class(function(require, exports){
	// internal, HeadlessApi is a static object to access the headless api
	HeadlessApi = require('./headless_api')

	// Assign a unique id to each headlessrenderer object
	var HeadlessRenderer = exports
	HeadlessRenderer.GlobalId = 0

	// Like DALi, auto-increment the depthindex. Child layers should have a
	// larger value than parent so child actors are rendered after parent.
	HeadlessRenderer.DepthIndex = 5

	/**
	 * @method constructor
	 * Create a headless.Renderer object by specifying a geometry and material
	 * @param {object} geometry HeadlessGeometry object
	 * @param {object} material HeadlessMaterial object
	 * You can access the headless.Renderer object as this.headlessrenderer
	 */
	this.atConstructor = function(geometry, material) {
		this.object_type = 'HeadlessRenderer'

		var headless = HeadlessApi.headless;

		this.id = ++HeadlessRenderer.GlobalId;
		this.headlessgeometry = geometry;
		this.headlessmaterial = material;
		HeadlessRenderer.DepthIndex += 5;
		this.depthindex = HeadlessRenderer.DepthIndex;
	}

	this.name = function() {
		return 'headlessrenderer' + this.id;
	}

	this.currentstate = function(verbose) {
		var states = [];
		if (!HeadlessApi.isShown(this.name())) {
			states = this.headlessgeometry.currentstate(verbose);
			states.push(this.headlessmaterial.currentstate(verbose));

			var state = [
				{name: this.name()}
				,{geometry: this.headlessgeometry.name()}
				,{material: this.headlessmaterial.name()}
			]
			states.push(state);
			HeadlessApi.shownObject(this.name());
		}

		return states;
	}


	this.inspect = function(depth) {
		//HACK
		this.currentstate();
		var obj = {headlessRenderer:this.id, obj:[this.headlessgeometry.inspect(depth), this.headlessmaterial.inspect(depth)]};
		var util = require('util')
		return util.inspect(obj, {depth: null});
	}

});
