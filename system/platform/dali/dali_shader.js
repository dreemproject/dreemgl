/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others. 
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
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
	// internal, DaliApi is a static object to access the dali api
	DaliApi = require('./dali_api')

	// Assign a unique id to each dalishader object
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

		// Simplify the shader by removing comments and empty lines
        var vs = this.trimShader(vertexShader);
        var fs = this.trimShader(fragmentShader);

		var shaderOptions = {
            vertexShader : vs,
            fragmentShader: fs
        };

		var dali = DaliApi.dali;
		this.id = ++DaliShader.GlobalId;
		this.dalishader = new dali.Shader(shaderOptions);
		this.vertexshader = vertexShader;
		this.fragmentShader = fragmentShader;

		if (DaliApi.emitcode) {
			// Each line needs a separate DALICODE statement
			vs = vs.replace(/\n/g, "\nDALICODE: ");
			fs = fs.replace(/\n/g, "\nDALICODE: ");

			console.log('DALICODE: var vertexShader' + this.id + ' = "' + vs + '"');
			console.log('DALICODE: var fragmentShader' + this.id + ' = "' + fs + '"');
			console.log('DALICODE: var shaderOptions' + this.id + ' = {vertexShader : vertexShader' + this.id + ', fragmentShader: fragmentShader' + this.id + ' };');
			console.log('DALICODE: var ' + this.name() + ' = new dali.Shader(shaderOptions' + this.id + ');');
		}

	}

    // Internal method to remove comments and empty lines from a shader. This
    // is to prevent issues when the dalicode is replayed.
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
		return 'dalishader' + this.id;
	}

	this.inspect = function(depth) {
		var obj = {daliShader:this.id, vertex:this.vertexshader.length, fragment:this.fragmentShader.length};
		var util = require('util')
		return util.inspect(obj, {depth: null});
	}

});
