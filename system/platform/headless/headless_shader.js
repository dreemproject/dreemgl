/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others. 
	 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
	 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


/**
 * @class HeadlessShader
 * Simulate a shader
 * Modeled from DALi platform.
 */

define.class(function(require, exports){
	// internal, HeadlessApi is a static object to access the headless api
	HeadlessApi = require('./headless_api')

	// Assign a unique id to each headlessshader object
	var HeadlessShader = exports
	HeadlessShader.GlobalId = 0

	/**
	 * @method constructor
	 * Create a headless.Shader object
	 * You can access the headless.Shader object as this.headlessshader
	 * @param {string} vertexShader VertexShader code
	 * @param {string} fragmentShader FragmentShader code
	 */
	this.atConstructor = function(vertexShader, fragmentShader) {
		this.object_type = 'HeadlessShader'

		// Simplify the shader by removing comments and empty lines
		var vs = this.trimShader(vertexShader);
		var fs = this.trimShader(fragmentShader);

		var shaderOptions = {
			vertexShader : vs,
			fragmentShader: fs
		};

		var headless = HeadlessApi.headless;
		this.id = ++HeadlessShader.GlobalId;
		this.vertexshader = vertexShader;
		this.fragmentshader = fragmentShader;
	}

		// Internal method to remove comments and empty lines from a shader. This
		// is to prevent issues when the headlesscode is replayed.
		this.trimShader = function(code) {
		var str = code;

			// Remove blank lines
			str = str.replace(/\n\n/g, "\\n");

			// Remove comments
			//var str = code.replace(//*.+?*/|//.*(?=[nr])/g, '');
			str = str.replace(/\/\/.*\n/g, '');

			// Remove trailing new line
			if (str[str.length-1] == "\n")
				str = str.substring(0, str.length-1);

			// Remove new lines
			str = str.replace(/\n/g, "\\n");

			// Create a multi-line string
			str = str.replace(/\\n/g, "\\\n");

			return str;
		}


	this.name = function() {
		return 'headlessshader' + this.id;
	}

	this.currentstate = function(verbose) {
		var states = [];
		if (!HeadlessApi.isShown(this.name())) {
			var state = [
				{name: this.name()},
				,{vertexshader: verbose ? this.vertexshader : HeadlessApi.getHash(this.vertexshader)}
				,{fragmentShader: verbose ? this.fragmentshader : HeadlessApi.getHash(this.fragmentshader)}
			]

			states = [state];
			HeadlessApi.shownObject(this.name());
		}

		return states;
	}

	this.inspect = function(depth) {
		var obj = {headlessShader:this.id, vertex:this.vertexshader.length, fragment:this.fragmentshader.length};

		var util = require('util')
		return util.inspect(obj, {depth: null});
	}

});
