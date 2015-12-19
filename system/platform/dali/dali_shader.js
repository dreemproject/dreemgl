/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


/**
 * @class DaliShader
 * Layer between DreemGL and Dali. Although Dali has a complete api, this
 * class is used to encapsulate the api to simplify how it is embedded into
 * the dreemgl dali platform.
 *
 * Each instance of DaliShader contains a dali.Shader object, and is extended
 * with information about the uniforms and attributes used by the shader.
 */

/**
 * @property dalishader
 * dali.Shader object
 */

define.class(function(require, exports){
	// DaliApi is a static object to access the dali api
	DaliApi = require('./dali_api')

	// Assign an id to each dalishader object
	var DaliShader = exports
	DaliShader.GlobalId = 0

	/**
	 * @method constructor
	 * Create a dali.Shader object
	 * You can access the dali.Shader object as this.dalishader
	 * @param {string} vertexShader VertexShader code
	 * @param {string} fragmentShader FragmentShader code
	 */
	this.atConstructor = function(vertexShader, fragmentShader) {
		this.object_type = 'DaliShader'
		var shaderOptions = {
            vertexShader : vertexShader,
            fragmentShader: fragmentShader
        };
		
		var dali = DaliApi.dali;
		this.id = ++DaliShader.GlobalId;
		this.dalishader = new dali.Shader(shaderOptions);
		this.vertexshader = vertexShader;
		this.fragmentShader = fragmentShader;

		if (DaliApi.emitcode) {
			var vs = vertexShader.replace(/\n/g, "\\n");
			var fs = fragmentShader.replace(/\n/g, "\\n");
			console.log('DALICODE: var vertexShader' + this.id + ' = "' + vs + '"');
			console.log('DALICODE: var fragmentShader' + this.id + ' = "' + fs + '"');
			console.log('DALICODE: var shaderOptions' + this.id + ' = {vertexShader : vertexShader' + this.id + ', fragmentShader: fragmentShader' + this.id + ' };');
			console.log('DALICODE: var ' + this.name() + ' = new dali.Shader(shaderOptions' + this.id + ');');
		}

	}

	this.name = function() {
		return 'dalishader' + this.id;
	}

	this.inspect = function(depth) {
		var obj = {daliShader:this.id, vertex:this.vertexshader.length, fragment:this.fragmentShader.length};
		var util = require('util')
		return util.inspect(obj, {depth: null});
	}

});
