/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others. 
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
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
	// internal, DaliApi is a static object to access the dali api
	DaliApi = require('./dali_api')

	// Assign a unique id to each dalirenderer object
	var DaliRenderer = exports
	DaliRenderer.GlobalId = 0

	// The depth index does not auto-increment. Child layers should have a
	// larger value than parent so child actors are rendered after parent.
	// An alternate solution suggested by Nick, is to add an actor as a child
	// to another actor (no depthindex changes are needed).
	DaliRenderer.DepthIndex = 5

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

		// Cache the property values (blend-related)
		this.property_cache = {};

		this.id = ++DaliRenderer.GlobalId;
		this.daligeometry = geometry;
		this.dalimaterial = material;
		this.dalirenderer = new dali.Renderer(this.daligeometry.daligeometry, this.dalimaterial.dalimaterial);

		DaliRenderer.DepthIndex += 5;
		this.dalirenderer.depthIndex = DaliRenderer.DepthIndex;

		if (DaliApi.emitcode) {
			console.log('DALICODE: ' + this.name() + ' = new dali.Renderer(' + this.daligeometry.name() + ', ' + this.dalimaterial.name() + ');');
			console.log('DALICODE: ' + this.name() + '.depthIndex = ' + DaliRenderer.DepthIndex + ';');
		}

	}


	// Blend Modes moved from material to renderer in some versions of dali

	/**
	 * @method hasBlender
	 * Return true if the material has blending api
	 */
	this.hasBlender = function(mode) {
		return (typeof this.dalirenderer.setBlendEquation === 'function');
	}

	/**
	 * @method setBlendMode
	 * Forward request to dali.Material object. dali enumerations match webgl.
	 * @param {number} mode Set the blending mode
	 */
	this.setBlendMode = function(mode) {
		var val = this.property_cache['blendmode'];
		if (val && val == mode)
			return;

		this.dalirenderer.blendingMode = mode;
		this.property_cache['blendmode'] = mode;

		if (DaliApi.emitcode) {
			console.log('DALICODE: ' + this.name() + '.blendingMode = ' + mode + ';');
		}
	}


	/**
	 * @method setBlendEquation
	 * Forward request to dali.Material object
	 * @param {number} equationRgb Equation for combining rgb components
	 * @param {number} equationAlpha Equation for combining alpha component
	 */
	this.setBlendEquation = function(equationRgb, equationAlpha) {
		var hash = DaliApi.getHash([equationRgb, equationAlpha]);

		var val = this.property_cache['blendequation'];
		if (val && val == hash)
			return;

		this.dalirenderer.setBlendEquation(equationRgb, equationAlpha);
		this.property_cache['blendequation'] = hash;

		if (DaliApi.emitcode) {
			console.log('DALICODE: ' + this.name() + '.setBlendEquation(' + equationRgb + ', ' + equationAlpha + ');');
		}
	}


	/**
	 * @method setBlendFunc
	 * Forward request to dali.Material object
	 * @param {number} srcFactorRgb Source blending rgb
	 * @param {number} dstFactorRgb Destination blending rgb
	 * @param {number} srcFactorAlpha Source blending alpha
	 * @param {number} dstFactorAlpha Destination blending alpha
	 */
	this.setBlendFunc = function(srcFactorRgb, dstFactorRgb, srcFactorAlpha, dstFactorAlpha) {
		var hash = DaliApi.getHash([srcFactorRgb, dstFactorRgb, srcFactorAlpha, dstFactorAlpha]);

		var val = this.property_cache['blendfunc'];
		if (val && val == hash)
			return;

		this.dalirenderer.setBlendFunc(srcFactorRgb, dstFactorRgb, srcFactorAlpha, dstFactorAlpha);
		this.property_cache['blendfunc'] = hash;

		if (DaliApi.emitcode) {
			console.log('DALICODE: ' + this.name() + '.setBlendFunc(' + srcFactorRgb + ', ' + dstFactorRgb + ', ' + srcFactorAlpha + ', ' + dstFactorAlpha + ');');
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
