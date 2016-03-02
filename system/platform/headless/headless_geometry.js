/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/


/**
 * @class HeadlessGeometry
 * Simulate a geometry
 * Modeled from DALi platform.
 */

define.class(function(require, exports){
	// internal, HeadlessApi is a static object to access the headless api
	HeadlessApi = require('./headless_api')

	// Assign a unique id to each headlessgeometry object
	var HeadlessGeometry = exports
	HeadlessGeometry.GlobalId = 0

	/**
	 * @method constructor
	 * Create a headless.Geometry object, using triangles
	 * You can access the headless.Geometry object as this.headlessgeometry
	 * @param {number} drawtype Line drawing type. headless uses the same values
	 *								 as webgl. The default is HeadlessApi.Geometry.TRIANGLES.
	 */
	this.atConstructor = function(drawtype) {
		this.object_type = 'HeadlessGeometry'

		var headless = HeadlessApi.headless;

		// Keep track of all vertex_buffers added. This acts as a cache
		// Values = [format_hash, data_hash, vertex_index, vertex_buffer, buffer_id];
		this.vertex_buffers = {};

		this.id = ++HeadlessGeometry.GlobalId;

		drawtype = drawtype || HeadlessApi.Geometry.TRIANGLES;
		this.geometryType = drawtype;
	}


	/**
	 * @method addGeometry
	 * Add geometries (vertex buffers) given a dreem shader object
	 * @param {Object} dreem_shader Compiled data structure. (see shaderheadless.js)
	 */
	this.addGeometry = function(dreem_shader) {
		//console.trace('addGeometry');
		var headless = HeadlessApi.headless;

		// Make sure the correct object was passed. dreem_shader holds the
		// dreemgl compiled structures.
		if (!dreem_shader.vtx_state) {
			console.log('WARNING. Incorrect object passed to addGeometry', dreem_shader.object_type);
			return;
		}

		var dreem_attributes = dreem_shader.vtx_state.attributes;

		// If there are no keys, it means an object with no parameters
		var keys = Object.keys(dreem_attributes);
		for (var i in keys) {
			// The shader program uses a '_' at the beginning of the name
			var name = keys[i];
			var storedname = '_' + name;

			// I found that dreemgl keys with nested information (ie. has _DOT_)
			// do not require vertex.
			if (name.indexOf('_DOT_') > 0) {
				//console.log('HeadlessGeometry.addGeometry Skipping texture', name);
				continue;
			}


			// For each attribute, convert the data into an array
			var obj = dreem_attributes[name];
			var type = HeadlessApi.getHeadlessPropertyType(obj.bytes);
			var nslots = HeadlessApi.getHeadlessPropertySize(type);

			// headless format is a hash of {name: type}
			var format = {};
			format[storedname] = type;

			var data = [];
			var arr = dreem_shader[name];
			if (arr && arr.array) {
				// Do not take all the (allocated) array. Take only length
				var entries = nslots * arr.length;
				for (var i=0; i<entries; i++) {
					var val = parseFloat(arr.array[i]);
					data.push(val);
				}
			}

			// Add or update a vertex buffer
			//console.log('updating', format, nslots);
			this.updateVertexBuffer(storedname, data, format, nslots);
		}
	}


	/**
	 * @method addAttributeGeometryAlt
	 * Add other attribute geometries to a headless Actor. This version was used
	 * during testing to make sure Headless could handle the packed layout outlined
	 * in the docs.
	 *
	 * This version can be removed if no problems are found.
	 *
	 * @param {Object} shader_headless Compiled data structure
	 * @param {Object} attrlocs Compiled data structure
	 */
	this.addAttributeGeometryAlt = function(shader_headless, attrlocs) {
		var headless = HeadlessApi.headless;

		if (Object.keys(attrlocs) == 0)
			return;

		// Write each value separately, in order to test the headless API.
		// The original version (see below) writes a composite
		// headless.PropertyBuffer.

		var name;
				var nslots = 0;
		for(var key in attrlocs) {
			var format = {};
			var attrloc = attrlocs[key]
			name = attrloc.name

			var storedname = '_' + key;
			var type = 'FLOAT';

			// Skip invalid entries
			if (typeof attrloc.slots === 'undefined')
				continue;

			switch (attrloc.slots) {
			case 1:
				type = 'FLOAT';
				break;
			case 2:
				type = 'VEC2';
				break;
			case 3:
				type = 'VEC3';
				break;
			case 4:
				type = 'VEC4';
				break;
			default:
				console.log('addAttributeGeometry. Unknown type', attrloc.slots);
				break;
			}


			format[storedname] = type;

			if (attrloc.slots == 0)
				continue;

			// Extract the data from the array
			var arr = shader_headless[name];
			//console.trace('**** addAttributeGeometry', name, arr.array.length);

			var data = [];
			if (arr && arr.array) {
				// Find the offset and length of the data to extract
				var record_offset = arr.slots;
				var data_offset = attrloc.offset / 4; // attrloc.offset is bytes

				var offset = 0;
				for (var i=0; i<arr.length; i++) {
					var off = offset + data_offset;
					for (var j=0; j<attrloc.slots; j++) {
						var val = parseFloat(arr.array[off++]);
						data.push(val);
					}

					offset += record_offset;
				}

				if (data.length > 0) {
					this.updateVertexBuffer(key, data, format, attrloc.slots);
				}
			}
		}
	}


	/**
	 * @method addAttributeGeometry
	 * Add other attribute geometries to a headless Actor.
	 * @param {Object} shader_headless Compiled data structure
	 * @param {Object} attrlocs Compiled data structure
	 */
	this.addAttributeGeometry = function(shader_headless, attrlocs) {
		var headless = HeadlessApi.headless;

		if (Object.keys(attrlocs) == 0)
			return;

		//TODO Support multiple names in the keys, like webgl
		var format = {};

		var name;
				var nslots = 0;
		for(var key in attrlocs) {
			var attrloc = attrlocs[key]
			name = attrloc.name

			var storedname = '_' + key;
			var type = 'FLOAT';

			// Skip invalid entries
			if (typeof attrloc.slots === 'undefined')
				continue;

			switch (attrloc.slots) {
			case 1:
				type = 'FLOAT';
				break;
			case 2:
				type = 'VEC2';
				break;
			case 3:
				type = 'VEC3';
				break;
			case 4:
				type = 'VEC4';
				break;
			default:
				console.log('addAttributeGeometry. Unknown type', attrloc.slots);
				break;
			}


			format[storedname] = type;
			nslots += attrloc.slots;
		}

		if (!name || (Object.keys(format).length == 0)) return;

		//console.log('***************addAttributeGeometry******************');
		//console.log(attrlocs);
		//console.log('*****************************************************');

		var arr = shader_headless[name];

		var data = [];

		if (arr && arr.array) {
			// Do not take all the (allocated) array. Take only length elements.
			// There can be gaps in the stored array, so only the first nslots
			// are used.
			var offset = 0;
			for (var i=0; i<arr.length; i++) {
				for (var j=0; j<nslots; j++) {
					var val = parseFloat(arr.array[offset++]);
					data.push(val);
				}
				offset += (arr.slots - nslots);
			}
		}

		// Add or update a vertex buffer
		if (data.length > 0)
			this.updateVertexBuffer('attribgeom', data, format, nslots);
	}


	/**
	 * @method updateVertexBuffer
	 * Add, or update a vertex buffer.
	 * @param {string} name Cached name
	 * @param {Object} data Object containing data to write
	 * @param {Object} format Hash of format information to write.
	 * @param {Number} nitems Number of items per record
	 */
	this.updateVertexBuffer = function(name, data, format, nitems) {
		var format_hash = HeadlessApi.getHash(format);
		var data_hash = HeadlessApi.getHash(data);

		// index, buffer, and bufferindex are either built or come from cache
		var index;
		var buffer;
		var bufferindex;

		var cache = this.vertex_buffers[name];
		if (cache) {
			var oformathash = cache[0];
			var odatahash = cache[1];
			if (format_hash == oformathash) {
				if (data_hash == odatahash) {
					// No change to the value
					return;
				}

				// Reuse the vertex buffer
				index = cache[2];
				buffer = cache[3];
				bufferindex = cache[4];
			}
			else {
				index = cache[2];
				console.log('addGeometry: vertex buffer already exists: ', name, index, '. Removing');

				//TODO headlesswrite
				//this.headlessgeometry.removeVertexBuffer(index);
				delete this.vertex_buffers[name];
			}
		}

		// Generate the buffer
		if (!buffer) {
			var ret = HeadlessApi.headlessBuffer(data, format, data.length / nitems);
			var buffer = ret[0];
			bufferindex = ret[1];
			//index = this.headlessgeometry.addVertexBuffer(buffer);
			index = 0;

			// Store the index so it can be removed later
			this.vertex_buffers[name] = [format_hash, data_hash, index, buffer, bufferindex];
		}
		else {
			// Update an existing buffer using setData
			HeadlessApi.writeHeadlessBuffer(buffer, bufferindex, data)
		}
	}


	/**
	 * @method addVertices
	 * Add vertex attributes array to a headless Geometry. Format is very close
	 * to gl.vertexAttribPointer. Assumes float data
	 * @param {Object} array Buffer array
	 * @param {Number} index Index of attribute in the buffer
	 * @param {Number} size Number of components per attribute (1,2,3,4)
	 * @param {Number} stride Offset (bytes) between consecutive attributes
	 * @param {Number} offset Offset (bytes) to first attribute
	 * @param {Number} index Index of attribute in the buffer
	 * @return {Object} Index of vertex buffer
	 */
	this.addVertices = function(name, array, slots, stride, offset) {
		console.log('addVertices IS NOT IMPLEMENTED');
	}


	this.name = function() {
		return 'headlessgeometry' + this.id;
	}

	this.currentstate = function(verbose) {

		var states = [];

		if (!HeadlessApi.isShown(this.name())) {
			// Sort the vertex_buffers 
			var vertex_data = []
			var keys = Object.keys(this.vertex_buffers).sort();

			for (var i in keys) {
				// Decompose the stored vertex_buffer data
				var obj = this.vertex_buffers[keys[i]];
				var buffer = obj[3]
				var type = buffer.format;
				
				var data = buffer.data;
				var values = []
				for (var j in data) {
					// No more than 4 decimal places
					values.push(parseFloat(data[j].toFixed(4)));
				}

				var vertex = [type, values];
				vertex_data.push(vertex);
			}

			var state = [
				{name: this.name()}
				,{type: this.geometryType}
				,{vertex_buffers: vertex_data}
			]

			states = [state];
			HeadlessApi.shownObject(this.name());
		}

		return states;
	}

	this.inspect = function(depth) {
		//HACK
		this.currentstate();
		var obj = {headlessGeometry: this.id};
		var util = require('util')
		return util.inspect(obj, {depth: null});
	}

});
