/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

// dali utilities. These are separate from the platform files, but use
// structures defined in them.

define.class(function(require, exports, self){

	this.atConstructor = function() {
	};

	
	/**
	 * @method getDaliPropertySize
	 * Return the number of elements required for a dali property.
	 * From Nick (via slack).
	 * @param {Object} dali dali object (from daliwrapper)
	 * @param {Number} format property constant
	 * @return {Number} Number of elements
	 */
	this.getDaliPropertySize = function(dali, format) {
		switch( format ) {
		case  dali.PROPERTY_VECTOR2:
			return 2;
		case dali.PROPERTY_VECTOR3:
			return 3;
		case dali.PROPERTY_VECTOR4:
			return 4;
		case dali.PROPERTY_MATRIX3:
			return 9;
		case dali.PROPERTY_MATRIX4:
			return 16;
		default: 
			return 1;
		}	
	}
	
	/**
	 * @method getDaliPropertyType
	 * Return the dali property name for a type, given its size
	 * @param {Object} dali dali object (from daliwrapper)
	 * @param {Number} bytes Number of bytes used by the data
	 * @return {Number} dali property type
	 */
	this.getDaliPropertyType = function(dali, bytes) {
		var type = dali.PROPERTY_FLOAT; // default

		switch (bytes) {
		case 4:
			type = dali.PROPERTY_FLOAT;
			break;
		case 8:
			type = dali.PROPERTY_VECTOR2;
			break;
		case 12:
			type = dali.PROPERTY_VECTOR3;
			break;
		case 16:
			type = dali.PROPERTY_VECTOR4;
			break;
		case 64:
			type = dali.PROPERTY_MATRIX;
			break;
		default:
			console.log('UNKNOWN PROPERTY SIZE', bytes);
			break;
		};

		return type;
	}


	/**
	 * @method daliBuffer
	 * Build a Dali property buffer, given a value, and type.
	 * value can be an array or a single value, but the value is a float.
	 * @param {Object} dali dali object (from daliwrapper)
	 * @param {Object} vals Value to use. Either a single value or an
	 * array can be specified.
	 * @param {Object} Format hash, suitable for dali.PropertyBuffer.
	 * The hash looks like {name : type}.
	 * @param {Number} type The dali property type.
	 * @return {Object} dali buffer.
	 */
	this.daliBuffer = function(dali, vals, format, type) {
		// Accept either an array or a single value
		var data = vals.length ? vals : [vals];

		var dataArray = new Float32Array(data.length);
		dataArray.set(data);

		var numberItems = data.length / this.getDaliPropertySize(dali, type);

		var buffer = new dali.PropertyBuffer(format, numberItems);
		buffer.setData(dataArray);

		return buffer;
	}


	/**
	 * @method getValue
	 * Retrieve an object from the Dreem shader object by parsing the
	 * name of the element. If the name is not a top-level value in the
	 * object, the name is split by '_DOT_', and looked up incrementally.
	 * @param {Object} dreem_shader Compiled data structure (either
	 * vtx_state or pix_state).
	 * @param (String} name The name of the object to return. If the name
	 * is not found, it is split using '_DOT_' to incrementally locate the
	 * object in the structure.
	 * @return {Object} Value, or undefined if the name was not found.
	 */
	this.getValue = function(dreem_shader, name) {
		var obj = dreem_shader;

		if (obj[name] !== undefined) {
			// Object exists at top-level
			obj = obj[name];
		}
		else {
			// Split the name and look up incrementally
			var els = name.split('_DOT_');

			for (var i in els) {
				if (obj === undefined)
					return obj;
				obj = obj[els[i]];
			}

			// Detect, and return array data, if found. Array data is
			// found in struct.slots.
			if (obj && obj.struct && obj.struct.slots) {
				var array = [];
				for (var i=0; i<obj.struct.slots; i++) 
					array.push(obj[i]);
				
				return array;
			}
		}

		return obj;
	}



	/**
	 * @method daliUniform
	 * Iterate over uniforms in a vtx_state or pix_state structure.
	 * Extract their data and set the value on the meshActor using
	 * dali's registerAnimatableProperty().
	 * @param {Object} dali dali object (from daliwrapper)
	 * @param {Object} meshActor The current dali.Actor() object.
	 * @param {Object} dreem_shader Compiled data structure (either
	 * vtx_state or pix_state).
	 * @param {Object} dreem_uniforms The uniforms data structure (either
	 * vtx_state.uniforms or pix_state.uniforms).
	 */
	this.daliUniform = function(dali, meshActor, dreem_shader, dreem_uniforms) {
		// Iterate over each uniform
		var keys = Object.keys(dreem_uniforms);
		for (var i in keys) {
			// The shader program uses a '_' at the beginning of the name
			var name = keys[i];
			var storedname = '_' + name;

			var obj = dreem_uniforms[name];
			var type = this.getDaliPropertyType(dali, obj.bytes);
			
			// Get the uniform value, and manipulate the values as needed
			// before passing them to dali.
			var val = this.getValue(dreem_shader, name);

			// Adjust the values
			switch (type) {
			case dali.PROPERTY_MATRIX:
				// Convert to MATRIX3 because of a dali issue.
				type = dali.PROPERTY_MATRIX3;
				val.splice(11, 5);
				val.splice(7, 1);
				val.splice(3, 1);
				break;
			default:
				break;
			};

			// Set the property
			if (val) {
				console.log('register property', storedname, val);
				meshActor.registerAnimatableProperty(storedname, val);
			}
		}
	}


	/**
	 * @method daliShader
	 * Build dali Actor using compiled Dreem structure, and add it to the
	 * stage.
	 * @param {Object} dali dali object (from daliwrapper)
	 * @param {Object} dreem_shader Compiled data structure
	 */
	this.daliShader = function(dali, dreem_shader){
		// vertex/fragment shader programs are already built
		var shadercode = dreem_shader.vtx_state.code;
		var fragcode = dreem_shader.pix_state.code_color;

		//TEMP Patch the shadercode to use mat3 instead of mat4
		//     (There is a problem with the current dali release)
		shadercode = shadercode.replace(/mat4/g, 'mat3');
		shadercode = shadercode.replace('(vec4(pos, 0.0, 1.0) * view_DOT_totalmatrix) * view_DOT_viewmatrix', 'vec4((vec3(pos, 0.0) * view_DOT_totalmatrix) * view_DOT_viewmatrix, 1)');

		
		var shaderOptions = {
            vertexShader : shadercode,
            fragmentShader: fragcode // fragShader // fragcode
        };
		
		var shader = new dali.Shader(shaderOptions);
		var material = new dali.Material( shader );
		var geometry = new dali.Geometry();

		// Create attributes (using vtx_state)
		var dreem_attributes = dreem_shader.vtx_state.attributes;

		var keys = Object.keys(dreem_attributes);
		for (var i in keys) {
			// The shader program uses a '_' at the beginning of the name
			var name = keys[i];
			var storedname = '_' + name;

			// Convert byte count to a dali property type
			var obj = dreem_attributes[name];
			var type = this.getDaliPropertyType(dali, obj.bytes);

			// dali format is a hash of {name: type}
			var format = {};
			format[storedname] = type;

			// Construct a buffer for the dali data
			var arr = dreem_shader[name];
			var data = [100]; // default

			if (arr && arr.array) {
				data = [];
				for (var i in arr.array) 
					data.push(arr.array[i]);
			}

			var buffer = this.daliBuffer(dali, data, format, type);

			// Add the data to a vertex buffer (or triangles)
			geometry.addVertexBuffer(buffer);
			geometry.setGeometryType(dali.GEOMETRY_TRIANGLES);
		}


		// A renderer bings a geometry and a material
		var renderer = new dali.Renderer(geometry, material);
		renderer.depthIndex = 0;

		// Create mesh actor
		var meshActor = new dali.Actor();
		meshActor.addRenderer(renderer);
		//TODO
		meshActor.size = [300, 300, 0];
		meshActor.parentOrigin = dali.TOP_LEFT;
		meshActor.anchorPoint = dali.TOP_LEFT;

		// Set uniform values (from both shaders)
		var dreem_uniforms = dreem_shader.vtx_state.uniforms;
		this.daliUniform(dali, meshActor, dreem_shader, dreem_uniforms);

		var frag_uniforms = dreem_shader.pix_state.uniforms;;
		this.daliUniform(dali, meshActor, dreem_shader, frag_uniforms);
		
		// Add the actor to the stage
		dali.stage.add(meshActor);
	}


});
