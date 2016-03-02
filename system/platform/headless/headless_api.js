/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/


/**
 * @class HeadlessApi
 * Top-level, static, class to manage the headless stage.
 */

define.class(function(exports){
	var HeadlessApi = exports


	/**
	 * @property stage
	 * The list of displayed objects. Layer objects are added to the stage,
   * and actor objects are added to layers.
	 */
	HeadlessApi.stage = [];

	// Size of display
	HeadlessApi.size = {x:0, y:0};

	// Duration of the test. 0 = run once and stop
	HeadlessApi.duration = 0;

	// Resolution of display
	HeadlessApi.dpi = {x:72, y:72};

  // Background color of the stage
  HeadlessApi.bgcolor = null;

  // Verbose mode controls additional output
  HeadlessApi.verbose = false;

  // Geometry types (same values as webgl)
	exports.Geometry = {POINTS:0x0,LINES:0x1,LINE_LOOP:0x2,LINE_STRIP:0x3,TRIANGLES:0x4,TRIANGLE_STRIP:0x5,TRIANGLE_FAN:0x6};


	// Create all actors on a layer to ignore depth test.
	// (From Nick: When using this mode any ordering would be with respect to
	// depthIndex property of Renderers.)
	HeadlessApi.rootlayer = undefined;

	// The current layer to use when adding actors. Set by setLayer(). If
	// currentlayer is never set, the root layer (HeadlessApi.rootlayer) is used.
	// Actors are added in order so the normal order of execution is:
	//   - Create a HeadlessLayer object,
  //   - Call HeadlessApi.setLayer to make this layer the current layer
	//   - Add actors using HeadlessApi.addActor. This will use the current layer
	//     if none was specified.
	//   - Repeat the above process. You can reset the current layer by
	//     passing null to HeadlessApi.setLayer
	HeadlessApi.currentlayer = undefined;

	/**
	 * @method setLayer
	 * Static method to specify the layer to use when actors are added to the
	 * stage. Simple applications will never call this method because the
	 * default layer is sufficient.
	 * @param {object} layer HeadlessLayer object to use. If missing, the built-in
	 *                       root layer is used.
	 */
	HeadlessApi.setLayer = function(layer) {
		if (!layer)
			layer = HeadlessApi.rootlayer;

		HeadlessApi.currentlayer = layer;
	}

	/**
	 * @method addActor
	 * Static method to add an actor to the stage.
	 * In our usage, it will add the actor to the current layer. The second
	 * parameter is optional and specifies the HeadlessLayer object to use.
	 * @param {object} actor HeadlessActor object
	 * @param {object} layer HeadlessLayer object to use. If missing, the current
	 *                 layer is used.
	 */
	HeadlessApi.addActor = function(actor, layer) {
		if (!layer)
			layer = HeadlessApi.currentlayer;

		layer.add(actor);
	}


	/**
	 * @method initialize
	 * Static method to initialize and create the headless stage. This method is
	 * called when headless starts running.
	 * @param {Hash} Settings
   *   width Width of stage
	 *   height Height of stage
	 *   name Name of stage
	 *   duration Duration of test (msec). Default=0 (one iteration)
   *   verbose true to generate additional output
	 */
	HeadlessApi.initialize = function(settings) {
		HeadlessLayer = require('./headless_layer')

		HeadlessApi.size = {x:settings.width, y:settings.height};
		HeadlessApi.duration = settings.duration;
		HeadlessApi.name = settings.name;
		HeadlessApi.verbose = settings.verbose;
		HeadlessApi.dumpstate = settings.dumpstate;
          
		try {
			// Create a top-level layer to the stage. 
			HeadlessApi.rootlayer = HeadlessApi.currentlayer = new HeadlessLayer(null, settings.width, settings.height);
			HeadlessApi.stage.push(HeadlessApi.rootlayer);
		}
		catch (e) {
			console.error('Failed to load headless');
			console.log(e.stack);
		}
  }


	/**
	 * @method terminate
	 * Static method which is called when the composition is finished running.
	 * (see the duration argument on the command line)
	 */
	HeadlessApi.terminate = function() {
		if (HeadlessApi.verbose)
			console.log('Terminate');
		
		// Dump the object state, if enabled, to a file
		if (HeadlessApi.dumpstate && HeadlessApi.dumpstate.length > 0) {
			var state = HeadlessApi.currentstate(true);
			var state_json = JSON.stringify(state, null, 2);

			// Write to the specified file, or stdout
			var file = HeadlessApi.dumpstate.toString();
			if (file === 'stdout') {
				process.stdout.write(state_json);
			}
			else {
				var fs = require('fs');
				fs.writeFileSync(file, state_json);
			}
		}

		process.exit(0);
	}


	/**
	 * @method currentstate
	 * Static method to return the json state of the composition.
	 * Objects are displayed in the order they are referenced.
	 */
	HeadlessApi.currentstate = function(verbose) {
		HeadlessApi.shownobjects = {};

		var states = HeadlessApi.rootlayer.currentstate(verbose);

		return states;
	}


	/**
	 * @method shownObject
	 * Static method to indicate a named object that has been displayed
	 * @param {objname} String Object name
	 */
	HeadlessApi.shownobjects = {};
	HeadlessApi.shownObject = function(objname) {
		HeadlessApi.shownobjects[objname] = 1;
	}


	/**
	 * @method isShown
	 * Static method to test if the named object has been shown.
	 * @param {objname} String Object name
	 */
	HeadlessApi.isShown = function(objname) {
		return (objname in HeadlessApi.shownobjects);
	}



	HeadlessApi.inspect = function() {
		// TODO Dump the object state if enabled
		var output = HeadlessApi.rootlayer.inspect();
		console.log('rootlayer', output);
	}

	/**
	 * @method inspect
	 * Static method to return the json state of the composition.
	 */
	HeadlessApi.inspect = function() {
		// TODO Dump the object state if enabled
		var output = HeadlessApi.rootlayer.inspect();
		console.log('rootlayer', output);
	}


	/**
	 * @method createHeadlessObjects
	 * Static method to create headless objects on the specified object. Most
	 * objects, such as actor and geometry are attached to a view using
	 * createHeadlessActor(). Currently, only the shader object is attached to
	 * object.
	 * @param {object} obj Object to attach headless objects to. This should
	 *                     already contain an element headlessshader. In webgl
	 *                     the object is an object created by gl.createProgram.
	 *                     In headless, a custom object is created in shaderheadless.js
	 *                     to hold the compiled state of the shader. This object
	 *                     also holds an instance of HeadlessShader.
	 * @param {object} shader Instance with runtime values (ex. hardrect)
	 */
	HeadlessApi.createHeadlessObjects = function(obj, shader) {
		if (!obj.headlessshader) {
			console.log('WARNING. createHeadlessObjects cannot find HeadlessShader', Object.keys(obj));
		}

		obj.dreem_obj = shader;
	}


	/**
	 * @method createHeadlessActor
	 * Static method to create headless.Actor object on the specified object,
	 * using headless geometries located in another object. A Material and Renderer
	 * are also created on the object.
	 * @param {object} obj Object to attach headless actor to. This is a view
	 *                 object.
	 * @param {object} shader Shader object containing compiled shader
	 *                 information (from createHeadlessObjects).
	 */
	HeadlessApi.createHeadlessActor = function(obj, shader) {
		HeadlessGeometry = require('./headless_geometry')
		HeadlessMaterial = require('./headless_material')
		HeadlessRenderer = require('./headless_renderer')
		HeadlessActor = require('./headless_actor')

		// TODO: Re-use the geometry, unless we have a texture
		obj.headlessgeometry = new HeadlessGeometry(obj.drawtype);
		obj.headlessgeometry.addGeometry(shader.dreem_obj);

		//console.log('Calling HeadlessMaterial with shader = ', shader.object_type);
		obj.headlessmaterial = new HeadlessMaterial(shader.headlessshader)
		obj.headlessrenderer = new HeadlessRenderer(obj.headlessgeometry, obj.headlessmaterial);


		obj.headlessactor = new HeadlessActor(obj);
		obj.headlessactor.addRenderer(obj.headlessrenderer);
	}


	/**
	 * @method setBackgroundColor
	 * Static method to set the background color of the stage
	 * @param {object} color 4 element array of [r,g,b,a]
	 */
	HeadlessApi.setBackgroundColor = function(color) {
		HeadlessApi.bgcolor = color;
	}


	/**
	 * @method headlessBuffer
	 * Static. Build a Headless property buffer, given a value, and type.
	 * value can be an array or a single value, but the value is a float.
	 * A cache is maintained to reuse proper buffers. The cache key is a
	 * hash value of the headless.PropertyBuffer (see HeadlessApi.getHash).
	 * @param {Object} vals Value to use. Either a single value or an
	 * array can be specified.
	 * @param {Object} Format hash, suitable for headless.PropertyBuffer.
	 * The hash looks like {name : type}. See headless docs for headless.PropertyBuffer.
	 * @param {Number} nrecs The number of records, in the buffer.
	 * @return {Object} [headless.PropertyBuffer, id]. This is the same value stored
	 * in the cache HeadlessApi.BufferCache.
	 */
	HeadlessApi.BufferId = 0
	HeadlessApi.BufferCache = {}; // key: hash  value: [Headless.PropertyBuffer, id]
	HeadlessApi.headlessBuffer = function(vals, format, nrecs) {
		//console.log('headlessBuffer format', format, 'nrecs', nrecs, 'vals', vals.length);
		var headless = HeadlessApi.headless;

		// Accept either an array or a single value
		var data = vals.length ? vals : [vals];

		// console.trace('headlessBuffer with', nrecs, 'items', 'length = ', data.length);

		// Reuse an existing propertybuffer
		var hash = HeadlessApi.getHash(vals);
		if (HeadlessApi.BufferCache[hash]) {
			return HeadlessApi.BufferCache[hash];
		}

		// Create the headless.PropertyBuffer
		var buffer = {format: format, nrecs: nrecs};

		HeadlessApi.BufferId += 1;

		// Write data to the buffer
		//console.log('numberItems', nrecs, data.length);
		HeadlessApi.writeHeadlessBuffer(buffer, HeadlessApi.BufferId, data);

		var ret = [buffer, HeadlessApi.BufferId];
		HeadlessApi.BufferCache[hash] = ret;
		return ret;
	}


	/**
	 * @method writeHeadlessBuffer
	 * Static. Write data to an existing headless.PropertyBuffer
	 * @param {Object} buffer headless.PropertyBuffer to write to.
	 * @param {Number} bufferid buffer index
	 * @param {Object} data An array of values to use.
	 * array can be specified.
	 */
	HeadlessApi.writeHeadlessBuffer = function(buffer, bufferid, data) {
		var headless = HeadlessApi.headless;

		var dataArray = new Float32Array(data.length);
		dataArray.set(data);
		buffer.data = dataArray;

		return buffer;
	}


	/**
	 * @method getArrayValue
	 * Given the name of a uniform object, retrieve the array of values from 
	 * the dreemgl compiled structure. In webgl this extraction happens inline.
	 * NaN and null values are converted to 0 (headless will error on these)
	 * @param {Object} obj Compiled object
	 * @return {Object} single value or array, or undefined if name not found.
	 */
	HeadlessApi.getArrayValue = function(obj) {
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

		// Headless doesn't like NaN values
		var val = obj;
		if (isNaN(val) || val === null)
			val = 0;

		return val;
	}


	/**
	 * @method getHeadlessPropertySize
	 * Static. Return the number of elements required for a headless property, 
	 * given the headless constant.
	 * @param {String} format property constant
	 * @return {Number} Number of elements
	 */
	HeadlessApi.getHeadlessPropertySize = function(format) {
		var headless = HeadlessApi.headless;

		switch( format ) {
		case  'VEC2':
			return 2;
		case 'VEC3':
			return 3;
		case 'VEC4':
			return 4;
		case 'MAT3':
			return 9;
		case 'MAT4':
			return 16;
		default: 
			return 1;
		}	
	}
	
	/**
	 * @method getHeadlessPropertyType
	 * Static. Return the headless property name for a type, given its size
	 * @param {Number} bytes Number of bytes used by the data
	 * @return {Number} headless property type
	 */
	HeadlessApi.getHeadlessPropertyType = function(bytes) {
		var headless = HeadlessApi.headless;
		var type = 'FLOAT';

		switch (bytes) {
		case 4:
			type = 'FLOAT';
			break;
		case 8:
			type = 'VEC2';
			break;
		case 12:
			type = 'VEC3';
			break;
		case 16:
			type = 'VEC4';
			break;
		case 64:
			type = 'MAT4';
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
	HeadlessApi.getHash = function(data) {
		var str = JSON.stringify(data);
 
		// Algorithm from: https://github.com/darkskyapp/string-hash/blob/master/index.js
		var hash = 5381, i = str.length;

		while(i)
			hash = (hash * 33) ^ str.charCodeAt(--i)
		return hash >>> 0;
	}

});
