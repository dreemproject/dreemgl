/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/


/**
 * @class HeadlessMaterial
 * Simulate a materital (an array of textures with blending)
 */

define.class(function(require, exports){
	// internal, HeadlessApi is a static object to access the headless api
	HeadlessApi = require('./headless_api')

	// Assign a unique id to each headlessmaterial object
	var HeadlessMaterial = exports
	HeadlessMaterial.GlobalId = 0

	/**
	 * @method constructor
	 * Create a headless.Material object.
	 * You can access the headless.Material object as this.headlessmaterial.
	 * The passed shader object is available as this.headlessshader.
	 * @param {object} shader HeadlessShader object
	 */
	this.atConstructor = function(shader) {
		this.object_type = 'HeadlessMaterial'

		// Current values
		this.props = {};
		this.textures = [];

		// Cache the property values (blend-related)
		this.property_cache = {};

		this.id = ++HeadlessMaterial.GlobalId;
		this.headlessshader = shader;
	}

	/**
	 * @method addTexture
	 * Forward request to headless.Material object
	 * @param {object} texture Texture object
	 * @param {object} name Uniform name
	 * @param {object} sampler Headless.Sampler object
	 */
	this.addTexture = function(texture, name, sampler) {
		var tex = {texture: texture.image, name: name, sampler: sampler};
		this.textures.push(tex);
		return this.textures.length-1;
	}


	/**
	 * @method removeTexture
	 * Forward request to headless.Material object
	 * @param {number} index Index of texture to remove
	 */
	this.removeTexture = function(index) {
		this.textures[index] = null;
	}

	/**
	 * @method setBlendMode
	 * Forward request to headless.Material object. headless enumerations match webgl.
	 * @param {number} mode Set the blending mode
	 */
	this.setBlendMode = function(mode) {
		var val = this.property_cache['blendmode'];
		if (val && val == mode)
			return;

		this.props['blendmode'] = mode;
		this.property_cache['blendmode'] = mode;
	}


	/**
	 * @method setBlendEquation
	 * Forward request to headless.Material object
	 * @param {number} equationRgb Equation for combining rgb components
	 * @param {number} equationAlpha Equation for combining alpha component
	 */
	this.setBlendEquation = function(equationRgb, equationAlpha) {
		var hash = HeadlessApi.getHash([equationRgb, equationAlpha]);

		var val = this.property_cache['blendequation'];
		if (val && val == hash)
			return;

		this.props['blendequation'] = {equationRgb: equationRgb, equationAlpha: equationAlpha};
		this.property_cache['blendequation'] = hash;
	}


	/**
	 * @method setBlendFunc
	 * Forward request to headless.Material object
	 * @param {number} srcFactorRgb Source blending rgb
	 * @param {number} dstFactorRgb Destination blending rgb
	 * @param {number} srcFactorAlpha Source blending alpha
	 * @param {number} dstFactorAlpha Destination blending alpha
	 */
	this.setBlendFunc = function(srcFactorRgb, dstFactorRgb, srcFactorAlpha, dstFactorAlpha) {
		var hash = HeadlessApi.getHash([srcFactorRgb, dstFactorRgb, srcFactorAlpha, dstFactorAlpha]);

		var val = this.property_cache['blendfunc'];
		if (val && val == hash)
			return;

		this.props['blendfunc'] = {srcFactorRgb: srcFactorRgb, datFactorRgb: dstFactorRgb, srcFactorAlpha: srcFactorAlpha, dstFactorAlpha: dstFactorAlpha};
		this.property_cache['blendfunc'] = hash;
	}


	this.name = function() {
		return 'headlessmaterial' + this.id;
	}

	this.currentstate = function(verbose) {
		var states = [];
		
		if (!HeadlessApi.isShown(this.name())) {
			states = this.headlessshader.currentstate(verbose);

			var state = [
				{name: this.name()}
				,{shader: this.headlessshader.name()}
			]

			// Add textures
			var textures = [];
			for (var i in this.textures) {
				var tex = this.textures[i];
				var texture = [
					{name: tex.name}
					,{texture: tex.texture}
					,{sampler: tex.sampler}
				];
				textures.push(texture);
			}
			if (textures.length)
				state.push({textures: textures});
			
			states.push(state);
			HeadlessApi.shownObject(this.name());
		}

		return states;
	}


	this.inspect = function(depth) {
		//HACK
		this.currentstate();
		var obj = {headlessMaterial:this.id, obj:[this.headlessshader.inspect(depth)]};
		var util = require('util')
		return util.inspect(obj, {depth: null});
	}

});
