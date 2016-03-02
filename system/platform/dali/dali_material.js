/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/


/**
 * @class DaliMaterial
 * Layer between DreemGL and Dali. Although Dali has a complete api, this
 * class is used to encapsulate the api to simplify how it is embedded into
 * the dreemgl dali platform.
 *
 * Each instance of DaliMaterial contains a dali.Material object, which is a
 * combination of a dali.Shader object and textures.
 */

/**
 * @property dalimaterial
 * dali.Material object
 */

define.class(function(require, exports){
	// internal, DaliApi is a static object to access the dali api
	DaliApi = require('./dali_api')

	// Assign a unique id to each dalimaterial object
	var DaliMaterial = exports
	DaliMaterial.GlobalId = 0

	/**
	 * @method constructor
	 * Create a dali.Material object.
	 * You can access the dali.Material object as this.dalimaterial.
	 * The passed shader object is available as this.dalishader.
	 * @param {object} shader DaliShader object
	 */
	this.atConstructor = function(shader) {
		this.object_type = 'DaliMaterial'
		var dali = DaliApi.dali;

		// Cache the property values (blend-related)
		this.property_cache = {};

		this.id = ++DaliMaterial.GlobalId;
		this.dalishader = shader;
		this.dalimaterial = new dali.Material(this.dalishader.dalishader);

		if (DaliApi.emitcode) {
			console.log('DALICODE: var ' + this.name() + ' = new dali.Material(' + this.dalishader.name() + ');');
		}

	}

	/**
	 * @method addTexture
	 * Forward request to dali.Material object
	 * @param {object} texture Texture object
	 * @param {object} name Uniform name
	 * @param {object} sampler Dali.Sampler object
	 */
	this.addTexture = function(texture, name, sampler) {

		if (DaliApi.emitcode) {
			console.log('DALICODE: var texid = ' + this.name() + '.addTexture(texture' + texture.id + ', \'' + name + '\', sampler' + this.id + ');');
		}

		return this.dalimaterial.addTexture(texture.image, name, sampler);
	}


	/**
	 * @method removeTexture
	 * Forward request to dali.Material object
	 * @param {number} index Index of texture to remove
	 */
	this.removeTexture = function(index) {

		if (DaliApi.emitcode) {
			console.log('DALICODE: ' + this.name() + '.removeTexture(' + index + ');');
		}

		this.dalimaterial.removeTexture(index);
	}


	// Blend Modes moved from material to renderer in some versions of dali

	/**
	 * @method hasBlender
	 * Return true if the material has blending api
	 */
	this.hasBlender = function(mode) {
		return (typeof this.dalimaterial.setBlendEquation === 'function');
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

		this.dalimaterial.setBlendMode(mode);
		this.property_cache['blendmode'] = mode;

		if (DaliApi.emitcode) {
			console.log('DALICODE: ' + this.name() + '.setBlendMode(' + mode + ');');
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

		this.dalimaterial.setBlendEquation(equationRgb, equationAlpha);
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

		this.dalimaterial.setBlendFunc(srcFactorRgb, dstFactorRgb, srcFactorAlpha, dstFactorAlpha);
		this.property_cache['blendfunc'] = hash;

		if (DaliApi.emitcode) {
			console.log('DALICODE: ' + this.name() + '.setBlendFunc(' + srcFactorRgb + ', ' + dstFactorRgb + ', ' + srcFactorAlpha + ', ' + dstFactorAlpha + ');');
		}
	}


	this.name = function() {
		return 'dalimaterial' + this.id;
	}

	this.inspect = function(depth) {
		var obj = {daliMaterial:this.id, obj:[this.dalishader.inspect(depth)]};
		var util = require('util')
		return util.inspect(obj, {depth: null});
	}

});
