/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


/**
 * @class DaliDreemgl
 * Layer between DreemGL and Dali. Although Dali has a complete api, this
 * class is used to encapsulate the api to simplify how it is embedded into
 * the dreemgl dali platform.
 *
 * Each instance of DaliDreemgl contains a dali.Actor, dali.Geometry, and
 * dali.Shader, and related objeects.
 * 
 */

/**
 * @property meshActor
 * dali.Actor object
 */

define.class(function(require, exports){

	/**
	 * @method constructor
	 * Create an dali Actor
	 * @param {Object} dali dali object (from daliwrapper)
	 */
	this.atConstructor = function(dali) {
		this.dali = dali;

		// Create an empty Actor
		this.meshActor = new dali.Actor();
		
		//TODO
		this.meshActor.size = [300, 300, 0];

		this.meshActor.parentOrigin = dali.TOP_LEFT;
		this.meshActor.anchorPoint = dali.TOP_LEFT;
	};

	
	/**
	 * @method cleanup
     * Cleanup dali resources.
	 */
	this.cleanup = function(){
		if (this.meshActor) {
			this.dali.stage.remove(this.meshActor);
			this.meshActor = undefined;
		}

		// Remove other dali objects
		var cleanup = ['renderer', 'geometry', 'material', 'shader', 'dali'];
		for (var i in cleanup) {
			var obj = this[cleanup[i]];
			if (obj) {
				console.log('cleanup', cleanup[i]);
				obj = undefined;
			}
		}
	}

	/**
	 * @method compileShader
     * Convert the dreemgl compiled data structure into a dali shader,
	 * renderer, and geometry.
	 * @param {Object} dreem_shader Compiled data structure
	 */
	this.compileShader = function(dreem_shader){
		var dali = this.dali;

		// vertex/fragment shader programs are already built
		var shadercode = dreem_shader.vtx_state.code;
		var fragcode = dreem_shader.pix_state.code_color;

		var shaderOptions = {
            vertexShader : shadercode,
            fragmentShader: fragcode
        };
		
		//console.log('***SHADER');
		//console.log(shadercode);
		//console.log('***FRAG');
		//console.log(fragcode);
		// TEXTURES
		//console.log('***TEXTURE', dreem_shader.vtx_state.textures);


		// Create the shader, material, and geometery
		this.shader = new dali.Shader(shaderOptions);
		this.material = new dali.Material(this.shader);

		this.geometry = new dali.Geometry();
		this.geometry.setGeometryType(dali.GEOMETRY_TRIANGLES);

		// Add vertex information to dali
		this.addGeometry(dreem_shader);

		// A renderer binds a geometry and a material
		this.renderer = new dali.Renderer(this.geometry, this.material);
		this.renderer.depthIndex = 0;

		// Add the renderer to the actor
		this.meshActor.addRenderer(this.renderer);

		// Set uniform values (from both shaders)
		this.addUniforms(dreem_shader);
		
		// Add the actor to the stage
		dali.stage.add(this.meshActor);
	}


	/**
	 * @method addGeometry
	 * Add geometries (vertex buffers) to a dali Actor.
	 * @param {Object} dreem_shader Compiled data structure
	 */
	this.addGeometry = function(dreem_shader) {
		var dali = this.dali;

		// Create attributes (using vtx_state)
		var dreem_attributes = dreem_shader.vtx_state.attributes;

		// Create geometries from these attributes.
		// Keep track of the dali index returned by daliaddVertexBuffer
		this.vertex_buffers = {};

		var keys = Object.keys(dreem_attributes);
		for (var i in keys) {
			// The shader program uses a '_' at the beginning of the name
			var name = keys[i];
			var storedname = '_' + name;

			if (this.vertex_buffers[storedname]) {
				//TODO The geometry already exists. Do I ignore it, or
				//TODO delete and recreate it?
				console.log('addGeometry: vertex buffer already exists: ', storedname);
			}

			// Convert byte count to a dali property type
			var obj = dreem_attributes[name];
			var type = this.getDaliPropertyType(obj.bytes);

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

			var buffer = this.daliBuffer(data, format, type);

			// Add the data to a vertex buffer (of triangles)
			//TODO Detect error adding vertex
			var index = this.geometry.addVertexBuffer(buffer);
			this.geometry.setGeometryType(dali.GEOMETRY_TRIANGLES);
			
			// Store the index so it can be removed later
			this.vertex_buffers[storedname] = index;
		}
	}


	/**
	 * @method addUniforms
	 * Add uniform values to a dali Actor. These exist in either the
	 * vtx_state or pix_state structures.
	 * @param {Object} dreem_shader Compiled data structure
	 */
	this.addUniforms = function(dreem_shader) {
		// Set uniform values (from both shaders)
		var dreem_uniforms = dreem_shader.vtx_state.uniforms;
		this.daliUniform(dreem_shader, dreem_uniforms);

		var frag_uniforms = dreem_shader.pix_state.uniforms;;
		this.daliUniform(dreem_shader, frag_uniforms);
	}


	/* @method daliUniform
	 * Iterate over uniforms in a vtx_state or pix_state structure.
	 * Extract their data and set the value on the meshActor using
	 * dali's registerAnimatableProperty().
	 * @param {Object} dreem_shader Compiled data structure (either
	 * vtx_state or pix_state).
	 * @param {Object} dreem_uniforms The uniforms data structure (either
	 * vtx_state.uniforms or pix_state.uniforms).
	 */
	this.daliUniform = function(dreem_shader, dreem_uniforms) {
		var dali = this.dali;

		// Iterate over each uniform
		var keys = Object.keys(dreem_uniforms);
		for (var i in keys) {
			// The shader program uses a '_' at the beginning of the name
			var name = keys[i];
			var storedname = '_' + name;

			var obj = dreem_uniforms[name];
			var type = this.getDaliPropertyType(obj.bytes);
			
			// Get the uniform value, and manipulate the values as needed
			// before passing them to dali.
			var val = this.getValue(dreem_shader, name);

			// Adjust the values, depending upon any dreemgl/dali mismatch
			switch (type) {
			default:
				break;
			};

			// Set the property
			if (val) {
				//console.log('register property', storedname, val);
				try {
					this.meshActor.registerAnimatableProperty(storedname, val);
				}
				catch(e) {
					console.log('ERROR registering property', storedname);
				}
			}
		}
	}


	/**
	 * @method getValue
	 * Retrieve an object from the Dreem shader object by parsing the
	 * name of the element. If the name is not a top-level value in the
	 * object, the name is split by '_DOT_', and looked up incrementally.
	 * @param {Object} dreem_shader Compiled data structure (either
	 * vtx_state or pix_state).
	 * @param {String} name The name of the object to return. If the name
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
		}

        return this.getArrayValue(obj);
	}


	/**
	 * @method getArrayValue
	 * Given the name of a uniform object, retrieve the array of values.
	 * @param {Object} obj Compiled object
	 * @param {String} name The name of the object to return. If the name
	 * is not found, it is split using '_DOT_' to incrementally locate the
	 * object in the structure.
	 * @return {Object} single value or array, or undefined if name not found.
	 */
	this.getArrayValue = function(obj) {
		// Detect, and return array data, if found. Array data is
		// found in struct.slots.
		if (obj && obj.struct && obj.struct.slots) {
			if (obj.struct.slots == 0)
				return obj[i];
			var array = [];
			for (var i=0; i<obj.struct.slots; i++) 
				array.push(obj[i]);
				
			return array;
		}

		return obj;
	}


	/**
	 * @method getDaliPropertySize
	 * Return the number of elements required for a dali property.
	 * From Nick (via slack).
	 * @param {Number} format property constant
	 * @return {Number} Number of elements
	 */
	this.getDaliPropertySize = function(format) {
		var dali = this.dali;
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
	 * @param {Number} bytes Number of bytes used by the data
	 * @return {Number} dali property type
	 */
	this.getDaliPropertyType = function(bytes) {
		var dali = this.dali;
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
			console.trace('UNKNOWN PROPERTY SIZE', bytes);
			break;
		};

		return type;
	}


	/**
	 * @method daliBuffer
	 * Build a Dali property buffer, given a value, and type.
	 * value can be an array or a single value, but the value is a float.
	 * @param {Object} vals Value to use. Either a single value or an
	 * array can be specified.
	 * @param {Object} Format hash, suitable for dali.PropertyBuffer.
	 * The hash looks like {name : type}.
	 * @param {Number} type The dali property type.
	 * @return {Object} dali buffer.
	 */
	this.daliBuffer = function(vals, format, type) {
		var dali = this.dali;

		// Accept either an array or a single value
		var data = vals.length ? vals : [vals];

		var dataArray = new Float32Array(data.length);
		dataArray.set(data);

		var numberItems = data.length / this.getDaliPropertySize(dali, type);

		var buffer = new dali.PropertyBuffer(format, numberItems);
		buffer.setData(dataArray);

		return buffer;
	}


});
