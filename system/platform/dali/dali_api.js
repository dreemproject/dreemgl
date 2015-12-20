/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


/**
 * @class DaliApi
 * Top-level, static, class to manage the dali stage.
 */

define.class(function(exports){
	var DaliApi = exports

	/**
	 * @property dali
	 * static dali object to access dali api.
	 */
	Object.defineProperty(DaliApi, 'dali', {
		get: function() {
			if (!this.value) {
				console.trace('DaliApi: Dali has not been initialized');
			}
			return this.value;
		}
		,set: function(v) {
			if (this.value) {
				console.log('DaliApi: Dali has already been initialized');
			}
			this.value = v;
		}
	});


	// Set emitcode to true to emit dali code
	DaliApi.emitcode = true;

	/**
	 * @method initialize
	 * Static method to initialize and create the dali stage
	 * @param {number} width Width of stage
	 * @param {number} height Height of stage
	 * @param {string} name Name of stage
	 * @param {string} dalilib Path to dali lib (optional)
	 */
	DaliApi.initialize = function(width, height, name, dalilib) {
		var window= {
			x:0,
			y:0,
			width:width,
			height: height,
			transparent: false,
			name: name
		};

		var viewMode={
			'stereoscopic-mode':'mono',
			'stereo-base': 65
		};

		var options= {
			'window': window,
			'view-mode': viewMode,
		}

		// include the Dali/nodejs interface
		if (!dalilib)
			dalilib = '/home/dali/teem/src/dreemgl/Release/dali';

		if (DaliApi.emitcode) {
			console.log('DALICODE: var window= {x:0, y:0, width:' + width + ', height:' + height + ', transparent: false, name: \'' + name + '\'};');

			console.log('DALICODE: var viewMode={\'stereoscopic-mode\':\'mono\', \'stereo-base\': 65};');

			console.log('DALICODE: var options= {\'window\': window, \'view-mode\': viewMode}');
			console.log('DALICODE: var dali = require(\'' + dalilib + '\')(options);');
		}

		try {
			DaliApi.dali = define.require(dalilib)(options);
		}
		catch (e) {
			console.error('Failed to load dalilib', dalilib);
			console.log(e.stack);
		}
    }

	/**
	 * @method createDaliObjects
	 * Static method to create dali objects on the specified object
	 * @param {object} obj Object to attach dali objects to. This should
	 *                     already contain an element dalishader
	 * @param {object} shader Instance with runtime values (ex. hardrect)
	 */
	DaliApi.createDaliObjects = function(obj, shader) {
		console.log('createDaliObjects on', obj.object_type);

		//if (shader.view) 
		//	console.log('*** ** * bgcolor', shader.view.bgcolor);
		//if (shader.view && !shader.view.bgcolor) {
		//	shader.view.bgcolor = "vec4('transparent')"
		//}

		if (!obj.dalishader) {
			console.log('WARNING. createDaliObjects cannot find DaliShader', Object.keys(obj));
		}

		obj.dreem_obj = shader;

		// Create a daligeometry object, and this will be reused as much as
		// possible.
		if (typeof obj.daligeometry === 'undefined') {
			DaliGeometry = require('./dali_geometry')

			//obj.daligeometry = new DaliGeometry();
			//obj.daligeometry.addGeometry(shader);
		}

/*
			if (shader && shader.attrlocs) {
				console.log('==== DaliApi. addAttributeGeometry');
				obj.daligeometry.addAttributeGeometry(obj, shader.attrlocs);
			}
			else {
				console.log('==== DaliApi. addGeometry');
				obj.daligeometry.addGeometry(shader);
			}

//console.log('Calling DaliMaterial with shader = ', shader.object_type);
//			obj.dalimaterial = new DaliMaterial(obj.dalishader)
//			obj.dalirenderer = new DaliRenderer(obj.daligeometry, obj.dalimaterial);
			//remove
			//obj.daliactor = new DaliActor(obj);
			//obj.daliactor.addRenderer(obj.dalirenderer);
		}
*/
	}


	/**
	 * @method createDaliActor
	 * Static method to create dali.Actor object on the specified object,
	 * using dali geometries located in another object. A Material and Renderer
	 * are also created on the object.
	 * @param {object} obj Object to attach dali actor to
	 * @param {object} shader Object used for createDaliObjects 
	 */
	DaliApi.createDaliActor = function(obj, shader) {
		DaliGeometry = require('./dali_geometry')
		DaliMaterial = require('./dali_material')
		DaliRenderer = require('./dali_renderer')
		DaliActor = require('./dali_actor')

		console.log('*** ** * createDaliActor', obj.object_type, shader.object_type);
//		if (shader.view && !shader.view.bgcolor) {
//			shader.view.bgcolor = "vec4('transparent')"
//		}

		// Re-use the geometry, unless we have a texture
		

		obj.daligeometry = new DaliGeometry();
		obj.daligeometry.addGeometry(shader.dreem_obj);
		//obj.daligeometry.addGeometry(shader);

		//console.log('Calling DaliMaterial with shader = ', shader.object_type);
		obj.dalimaterial = new DaliMaterial(shader.dalishader)
		obj.dalirenderer = new DaliRenderer(obj.daligeometry, obj.dalimaterial);
//		obj.dalirenderer = new DaliRenderer(shader.daligeometry, obj.dalimaterial);


		obj.daliactor = new DaliActor(obj);
		obj.daliactor.addRenderer(obj.dalirenderer);

		//console.trace('***** daliactor created on', obj.object_type, obj.daliactor);
	}


	/**
	 * @method setBackgroundColor
	 * Static method to set the background color of the stage
	 * @param {object} color 4 element array of [r,g,b,a]
	 */
	DaliApi.setBackgroundColor = function(color) {
		//TODO Is it faster if I cache the last value
		DaliApi.dali.stage.setBackgroundColor(color);

		if (DaliApi.emitcode) {
			console.log('DALICODE: dali.stage.setBackgroundColor(' + JSON.stringify(color) + ');');
		}

	}

	/**
	 * @method createShader
	 * Static method to create a dali.Shader object.
	 * @param {string} vertexShader VertexShader code
	 * @param {string} fragmentShader FragmentShader code
	 * @returns {object} Instance of dali.Shader
	 */
/*
	DaliApi.createShader = function(vertexShader, fragmentShader) {
		var shaderOptions = {
            vertexShader : vertexShader,
            fragmentShader: fragmentShader
        };
		
		var dali = DaliApi.dali;
		var shader = new dali.Shader(shaderOptions);

		return shader;
	}
*/

	/**
	 * @method createMaterial
	 * Static method to create a dali.Material object. Textures are added
	 * later.
	 * @param {object} shader dali.Shader object
	 * @returns {object} Instance of dali.Material
	 */
/*
	DaliApi.createMaterial = function(shader) {
		var material = new dali.Material(shader);
		return material;
	}
*/

	/**
	 * @method daliBuffer
	 * Static. Build a Dali property buffer, given a value, and type.
	 * value can be an array or a single value, but the value is a float.
	 * @param {Object} vals Value to use. Either a single value or an
	 * array can be specified.
	 * @param {Object} Format hash, suitable for dali.PropertyBuffer.
	 * The hash looks like {name : type}.
	 * @param {Number} type The dali property type.
	 * @return {Object} dali buffer.
	 */
	DaliApi.BufferId = 0
	DaliApi.daliBuffer = function(vals, format, type) {
		var dali = DaliApi.dali;

		// Accept either an array or a single value
		var data = vals.length ? vals : [vals];

		var numberItems = data.length / DaliApi.getDaliPropertySize(dali, type);
		// console.trace('daliBuffer with', numberItems, 'items', 'length = ', data.length);

		// Create the dali.PropertyBuffer
		var buffer = new dali.PropertyBuffer(format, numberItems);

		DaliApi.BufferId += 1;

		if (DaliApi.emitcode) {
			console.log('DALICODE: var buffer' + DaliApi.BufferId + ' = new dali.PropertyBuffer(' + JSON.stringify(format) + ', ' + numberItems + ')');			
		}

		// Write data to the buffer
		//console.log('numberItems', numberItems, data.length);
		DaliApi.writeDaliBuffer(buffer, DaliApi.BufferId, data);

		return buffer;
	}


	/**
	 * @method writeDaliBuffer
	 * Static. Write data to an existing dali.PropertyBuffer
	 * @param {Object} buffer dali.PropertyBuffer to write to.
	 * @param {Number} bufferid buffer index
	 * @param {Object} data An array of values to use.
	 * array can be specified.
	 */
	DaliApi.writeDaliBuffer = function(buffer, bufferid, data) {
		var dali = DaliApi.dali;

		var dataArray = new Float32Array(data.length);
		dataArray.set(data);
		buffer.setData(dataArray);

		if (DaliApi.emitcode) {
			console.log('DALICODE: var data' + bufferid + ' = ' + JSON.stringify(data));
			console.log('DALICODE: var dataArray' + bufferid + ' = new Float32Array(data' + bufferid + '.length);');
			console.log('DALICODE: dataArray' + bufferid + '.set(data' + bufferid + ');');
			console.log('DALICODE: buffer' + bufferid + '.setData(dataArray' + bufferid + ')');
		}

		return buffer;
	}


	/**
	 * @method getArrayValue
	 * Given the name of a uniform object, retrieve the array of values.
	 * NaN and null values are converted to 0 (dali will error on these)
	 * @param {Object} obj Compiled object
	 * @return {Object} single value or array, or undefined if name not found.
	 */
	DaliApi.getArrayValue = function(obj) {
		// Detect, and return array data, if found. Array data is
		// found in struct.slots.
		if (obj && obj.struct && obj.struct.slots) {
			if (obj.struct.slots == 0) {
				return '';
			}
			var array = [];
			for (var i=0; i<obj.struct.slots; i++) {
				var val = obj[i];
				if (isNaN(val) || val === null)
					val = 0;

				array.push(val);
			}
				
			return array;
		}

		// Dali doesn't like NaN values
		var val = obj;
		if (isNaN(val) || val === null)
			val = 0;

		return val;
	}


	/**
	 * @method getDaliPropertySize
	 * Static. Return the number of elements required for a dali property.
	 * From Nick (via slack).
	 * @param {Number} format property constant
	 * @return {Number} Number of elements
	 */
	DaliApi.getDaliPropertySize = function(format) {
		var dali = DaliApi.dali;

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
	 * Static. Return the dali property name for a type, given its size
	 * @param {Number} bytes Number of bytes used by the data
	 * @return {Number} dali property type
	 */
	DaliApi.getDaliPropertyType = function(bytes) {
		var dali = DaliApi.dali;
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
	 * @method getHash
	 * Static. Compute the hash of the specified data. The data is first
	 * converted to json, and an xor-like hash is used.
	 * @param {Object} data Object to compute the hash
	 * @return {Number} Hash value
	 */
	DaliApi.getHash = function(data) {
		var str = JSON.stringify(data);
 
		// Algorithm from: https://github.com/darkskyapp/string-hash/blob/master/index.js
		var hash = 5381, i = str.length;

		while(i)
			hash = (hash * 33) ^ str.charCodeAt(--i)
		return hash >>> 0;
	}

});
