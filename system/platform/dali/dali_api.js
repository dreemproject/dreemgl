/* Copyright 2015-2016 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
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


	// Set emitcode to true to emit dali code to the console. These lines
	// are preceeded with DALICODE to make it easier to extract into a file.
	DaliApi.emitcode = false;

	// Create all actors on a layer to ignore depth test.
	// (From Nick: When using this mode any ordering would be with respect to
	// depthIndex property of Renderers.)
	DaliApi.rootlayer = undefined;

	// The current layer to use when adding actors. Set by setLayer(). If
	// currentlayer is never set, the root layer (DaliApi.rootlayer) is used.
	// Actors are added in order so the normal order of execution is:
	//   - Create a DaliLayer object,
    //   - Call DaliApi.setLayer to make this layer the current layer
	//   - Add actors using DaliApi.addActor. This will use the current layer
	//     if none was specified.
	//   - Repeat the above process. You can reset the current layer by
	//     passing null to DaliApi.setLayer
	DaliApi.currentlayer = undefined;

	/**
	 * @method setLayer
	 * Static method to specify the layer to use when actors are added to the
	 * stage. Simple applications will never call this method because the
	 * default layer is sufficient.
	 * @param {object} layer DaliLayer object to use. If missing, the built-in
	 *                       root layer is used.
	 */
	DaliApi.setLayer = function(layer) {
		if (!layer)
			layer = DaliApi.rootlayer;

		DaliApi.currentlayer = layer;
	}

	/**
	 * @method addActor
	 * Static method to add an actor to the stage.
	 * In our usage, it will add the actor to the current layer. The second
	 * parameter is optional and specifies the DaliLayer object to use.
	 * @param {object} actor DaliActor object
	 * @param {object} layer DaliLayer object to use. If missing, the current
	 *                 layer is used.
	 */
	DaliApi.addActor = function(actor, layer) {
		if (!layer)
			layer = DaliApi.currentlayer;

		layer.add(actor);
	}


	/**
	 * @method initialize
	 * Static method to initialize and create the dali stage. This method is
	 * called when dali starts running.
	 * @param {number} width Width of stage
	 * @param {number} height Height of stage
	 * @param {string} name Name of stage
	 * @param {string} dalilib Path to dali lib (optional). If the path is
	 *                 missing, a fixed path is used.
	 */
	DaliApi.initialize = function(width, height, name, dalilib) {
		DaliLayer = require('./dali_layer')

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

		// include the Dali/nodejs interface.
		if (!dalilib)
			dalilib = '/home/dali/teem/src/dreemgl/Release/dali';


		if (DaliApi.emitcode) {
			console.log('DALICODE: var window= {x:0, y:0, width:' + width + ', height:' + height + ', transparent: false, name: \'' + name + '\'};');

			console.log('DALICODE: var viewMode={\'stereoscopic-mode\':\'mono\', \'stereo-base\': 65};');

			console.log('DALICODE: var options= {\'window\': window, \'view-mode\': viewMode}');
			console.log('DALICODE: var dali = require(\'' + dalilib + '\')(options);');
		}

		try {
            // Load the library and make available as DaliApi.dali
			DaliApi.dali = define.require(dalilib)(options);

			// Create a top-level 2D layer to the stage. 
			var dali = DaliApi.dali;
			DaliApi.rootlayer = DaliApi.currentlayer = new DaliLayer(null, width, height);
			dali.stage.add(DaliApi.rootlayer.dalilayer);

			if (DaliApi.emitcode) {
				console.log('DALICODE: dali.stage.add(' + DaliApi.rootlayer.name() + ');');
			}

		}
		catch (e) {
			console.error('Failed to load dalilib', dalilib);
			console.log(e.stack);
		}
    }


	/**
	 * @method createDaliObjects
	 * Static method to create dali objects on the specified object. Most
	 * objects, such as actor and geometry are attached to a view using
	 * createDaliActor(). Currently, only the shader object is attached to
	 * object.
	 * @param {object} obj Object to attach dali objects to. This should
	 *                     already contain an element dalishader. In webgl
	 *                     the object is an object created by gl.createProgram.
	 *                     In dali, a custom object is created in shaderdali.js
	 *                     to hold the compiled state of the shader. This object
	 *                     also holds an instance of DaliShader.
	 * @param {object} shader Instance with runtime values (ex. hardrect)
	 */
	DaliApi.createDaliObjects = function(obj, shader) {
		if (!obj.dalishader) {
			console.log('WARNING. createDaliObjects cannot find DaliShader', Object.keys(obj));
		}

		obj.dreem_obj = shader;
	}


	/**
	 * @method createDaliActor
	 * Static method to create dali.Actor object on the specified object,
	 * using dali geometries located in another object. A Material and Renderer
	 * are also created on the object.
	 * @param {object} obj Object to attach dali actor to. This is a view
	 *                 object.
	 * @param {object} shader Shader object containing compiled shader
	 *                 information (from createDaliObjects).
	 */
	DaliApi.createDaliActor = function(obj, shader) {
		DaliGeometry = require('./dali_geometry')
		DaliMaterial = require('./dali_material')
		DaliRenderer = require('./dali_renderer')
		DaliActor = require('./dali_actor')

		// TODO: Re-use the geometry, unless we have a texture
		obj.daligeometry = new DaliGeometry(obj.drawtype);
		obj.daligeometry.addGeometry(shader.dreem_obj);

		//console.log('Calling DaliMaterial with shader = ', shader.object_type);
		obj.dalimaterial = new DaliMaterial(shader.dalishader)
		obj.dalirenderer = new DaliRenderer(obj.daligeometry, obj.dalimaterial);


		obj.daliactor = new DaliActor(obj);
		obj.daliactor.addRenderer(obj.dalirenderer);
	}


	/**
	 * @method setBackgroundColor
	 * Static method to set the background color of the stage
	 * @param {object} color 4 element array of [r,g,b,a]
	 */
	DaliApi.setBackgroundColor = function(color) {
		//TODO This is frequently set, although it often does not change. Cache?
		DaliApi.dali.stage.setBackgroundColor(color);

		if (DaliApi.emitcode) {
			console.log('DALICODE: dali.stage.setBackgroundColor(' + JSON.stringify(color) + ');');
		}

	}


	/**
	 * @method daliBuffer
	 * Static. Build a Dali property buffer, given a value, and type.
	 * value can be an array or a single value, but the value is a float.
	 * A cache is maintained to reuse proper buffers. The cache key is a
	 * hash value of the dali.PropertyBuffer (see DaliApi.getHash).
	 * @param {Object} vals Value to use. Either a single value or an
	 * array can be specified.
	 * @param {Object} Format hash, suitable for dali.PropertyBuffer.
	 * The hash looks like {name : type}. See dali docs for dali.PropertyBuffer.
	 * @param {Number} nrecs The number of records, in the buffer.
	 * @return {Object} [dali.PropertyBuffer, id]. This is the same value stored
	 * in the cache DaliApi.BufferCache.
	 */
	DaliApi.BufferId = 0
	DaliApi.BufferCache = {}; // key: hash  value: [Dali.PropertyBuffer, id]
	DaliApi.daliBuffer = function(vals, format, nrecs) {
		//console.log('daliBuffer format', format, 'nrecs', nrecs, 'vals', vals.length);
		var dali = DaliApi.dali;

		// Accept either an array or a single value
		var data = vals.length ? vals : [vals];

		// console.trace('daliBuffer with', nrecs, 'items', 'length = ', data.length);

		// Reuse an existing propertybuffer
		var hash = DaliApi.getHash(vals);
		if (DaliApi.BufferCache[hash]) {
			return DaliApi.BufferCache[hash];
		}

		// Create the dali.PropertyBuffer
		var buffer = new dali.PropertyBuffer(format, nrecs);

		DaliApi.BufferId += 1;

		if (DaliApi.emitcode) {
			console.log('DALICODE: var buffer' + DaliApi.BufferId + ' = new dali.PropertyBuffer(' + JSON.stringify(format) + ', ' + nrecs + ')');			
		}

		// Write data to the buffer
		//console.log('numberItems', nrecs, data.length);
		DaliApi.writeDaliBuffer(buffer, DaliApi.BufferId, data);

		var ret = [buffer, DaliApi.BufferId];
		DaliApi.BufferCache[hash] = ret;
		return ret;
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
	 * Given the name of a uniform object, retrieve the array of values from 
	 * the dreemgl compiled structure. In webgl this extraction happens inline.
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
	 * Static. Return the number of elements required for a dali property, 
	 * given the dali constant.
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
	 * converted to json, and an xor-like hash is used. These values are used
	 * as keys in caches.
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
