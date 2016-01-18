/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


/**
 * @class DaliRenderer
 * Layer between DreemGL and Dali. Although Dali has a complete api, this
 * class is used to encapsulate the api to simplify how it is embedded into
 * the dreemgl dali platform.
 *
 * Each instance of DaliRenderer contains a dali.Renderer object, which 
 * combines a DaliGeometry object and a DaliMaterial object
 */

/**
 * @property dalirenderer
 * dali.Renderer object
 */

define.class(function(require, exports){
	// DaliApi is a static object to access the dali api
	DaliApi = require('./dali_api')

	// Assign an id to each dalirenderer object
	var DaliRenderer = exports
	DaliRenderer.GlobalId = 0

	/**
	 * @method constructor
	 * Create a dali.Renderer object by specifying a geometry and material
	 * @param {object} geometry DaliShader object
	 * @param {object} material DaliMaterial object
	 * You can access the dali.Renderer object as this.dalirenderer
	 */
	this.atConstructor = function(geometry, material) {
		this.object_type = 'DaliRenderer'

		var dali = DaliApi.dali;

		this.id = ++DaliRenderer.GlobalId;
		this.daligeometry = geometry;
		this.dalimaterial = material;
		this.dalirenderer = new dali.Renderer(this.daligeometry.daligeometry, this.dalimaterial.dalimaterial);

		//this.dalirenderer.depthIndex = 0;

		if (DaliApi.emitcode) {
			console.log('DALICODE: ' + this.name() + ' = new dali.Renderer(' + this.daligeometry.name() + ', ' + this.dalimaterial.name() + ');');
			//console.log('DALICODE: ' + this.name() + '.depthIndex = 0;');
		}		

	}

	this.name = function() {
		return 'dalirenderer' + this.id;
	}

	this.inspect = function(depth) {
		var obj = {daliRenderer:this.id, obj:[this.daligeometry.inspect(depth), this.dalimaterial.inspect(depth)]};
		var util = require('util')
		return util.inspect(obj, {depth: null});
	}

});
