/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


/**
 * @class DaliGeometry
 * Layer between DreemGL and Dali. Although Dali has a complete api, this
 * class is used to encapsulate the api to simplify how it is embedded into
 * the dreemgl dali platform.
 *
 * Each instance of DaliGeometry contains a dali.Geometry object, which contains
 * vertex data for displaying a mesh actor.
 */

/**
 * @property daligeometry
 * dali.Geometry object
 */

define.class(function(require, exports){
	// DaliApi is a static object to access the dali api
	DaliApi = require('./dali_api')

	// Assign an id to each daligeometry object
	var DaliGeometry = exports
	DaliGeometry.GlobalId = 0

	/**
	 * @method constructor
	 * Create a dali.Geometry object, using triangles
	 * You can access the dali.Geometry object as this.daligeometry
	 */
	this.atConstructor = function() {
		this.object_type = 'DaliGeometry'

		var dali = DaliApi.dali;

		// Keep track of all vertex_buffers added.
		// Values = [format_hash, data_hash, vertex_index, vertex_buffer, buffer_id];
		this.vertex_buffers = {};

		this.id = ++DaliGeometry.GlobalId;
		this.daligeometry = new dali.Geometry();

		this.daligeometry.setGeometryType(dali.GEOMETRY_TRIANGLES);

		if (DaliApi.emitcode) {
			console.log('DALICODE: var ' + this.name() + ' = new dali.Geometry();');
			console.log('DALICODE: ' + this.name() + '.setGeometryType(dali.GEOMETRY_TRIANGLES);');
		}		
	}

	/**
	 * @method addGeometry
	 * Add geometries (vertex buffers) given a dreem shader object
	 * @param {Object} dreem_shader Compiled data structure. (see shaderdali.js)
	 */
	this.addGeometry = function(dreem_shader) {
		//console.trace('addGeometry');
		var dali = DaliApi.dali;

		//TODO
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

			// I found that keys with nested information (ie. has _DOT_)
			// do not require vertex.
			if (name.indexOf('_DOT_') > 0) {
				console.log('DaliGeometry.addGeometry Skipping texture', name);
				continue;
			}


			// For each attribute, convert the data into an array
			var obj = dreem_attributes[name];
			var type = DaliApi.getDaliPropertyType(obj.bytes);

			// dali format is a hash of {name: type}
			var format = {};
			format[storedname] = type;

			var data = [];
			var arr = dreem_shader[name];
			if (arr && arr.array) {
				data = [];
				for (var i in arr.array) 
					data.push(arr.array[i]);
			}

			// Add or update a vertex buffer
			this.updateVertexBuffer(storedname, data, format, type);
		}
	}


	/**
	 * @method addAttributeGeometry
	 * Add other attribute geometries to a dali Actor.
	 * @param {Object} shader_dali Compiled data structure
	 * @param {Object} attrlocs Compiled data structure
	 */
	this.addAttributeGeometry = function(shader_dali, attrlocs) {
		var dali = DaliApi.dali;

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
			var type = dali.PROPERTY_FLOAT;

			// Skip invalid entries
			if (typeof attrloc.slots === 'undefined')
				continue;

			switch (attrloc.slots) {
			case 1:
				type = dali.PROPERTY_FLOAT;
				break;
			case 2:
				type = dali.PROPERTY_VECTOR2;
				break;
			case 3:
				type = dali.PROPERTY_VECTOR3;
				break;
			case 4:
				type = dali.PROPERTY_VECTOR4;
				break;
			default:
				console.log('addAttributeGeometry. Unknown type', attrloc.slots);
				//TODO This happens, do I ignore it?
				//return;
				break;
			}

			format[storedname] = type;
			nslots += attrloc.slots;
		}

		if (!name || (Object.keys(format).length == 0)) return;

		//console.log('***********************addAttributeGeometry*************************');
		//console.log(attrlocs);
		//console.log('************************************************************');

		var arr = shader_dali[name];
		//console.trace('**** addAttributeGeometry', name, arr.array.length);
		
		var data = []; // default

		if (arr && arr.array) {
			data = [];
			for (var i in arr.array) 
				data.push(arr.array[i]);
		}

		// Add or update a vertex buffer
		this.updateVertexBuffer('attribgeom', data, format, nslots);
	}


	/**
	 * @method updateVertexBuffer
	 * Add, or update a vertex buffer.
	 * @param {string} name Cached name
	 * @param {Object} data Object containing data to write
	 * @param {Object} format Hash of format information to write.
	 * @param {Number} type data type (from DaliApi.getDaliPropertyType)
	 */
	this.updateVertexBuffer = function(name, data, format, type) {
		var format_hash = DaliApi.getHash(format);
		var data_hash = DaliApi.getHash(data);

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

				//TODO daliwrite
				this.daligeometry.removeVertexBuffer(index);
				delete this.vertex_buffers[name];
			}
		}
		
		// Generate the buffer
		if (!buffer) {
			buffer = DaliApi.daliBuffer(data, format, type);
			bufferindex = DaliApi.BufferId;
			index = this.daligeometry.addVertexBuffer(buffer);

			if (DaliApi.emitcode) {
				console.log('DALICODE: ' + this.name() + '.addVertexBuffer(buffer' + bufferindex + ')');
			}		

			// Store the index so it can be removed later
			this.vertex_buffers[name] = [format_hash, data_hash, index, buffer, bufferindex];
		}
		else {
			// Update an existing buffer using setData
			DaliApi.writeDaliBuffer(buffer, bufferindex, data)
		}


	}


	/**
	 * @method addVertices
	 * Add vertex attributes array to a dali Geometry. Format is very close
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
		var dali = DaliApi.dali;

		//console.log('*** --- *** --- addVertices name=', name, 'slots=',slots, 'stride=',stride, 'offset=',offset);

		var storedname = '_' + name;

		
		type = dali.PROPERTY_FLOAT;

		// Convert byte count to a dali property type
        //TODO
        var type = dali.PROPERTY_VECTOR2;		

		// dali format is a hash of {name: type}
		var format = {};
		format[storedname] = type;

		// Construct a buffer for the dali data
		var data = [];
/*
		var arr = array;
		if (arr && arr.array) {
			for (var i in arr.array) 
				data.push(arr.array[i]);
		}
*/

/*
		if (array) {
			for (var i in array) 
				data.push(array[i]);
		}
*/


		var offr = offset / 4;
		var perrecord = stride / 4;
		var nrecords = array.length / perrecord;
		var ptr = 0;
		var off = 0;
		for (var i=0; i<nrecords; i++) {
			ptr = off + offr;
			for (var j=0; j<slots; j++) {
				data.push(array[ptr]);
				ptr += 1;
			}
			off += perrecord;
		}

		//console.log('perrecord',perrecord, 'nrecords', nrecords, 'data.length', data.length);

		//console.log('daliBuffer', data.length, format, type);
		var buffer = DaliApi.daliBuffer(data, format, type);

		// Add the data to a vertex buffer (of triangles)
		//TODO Detect error adding vertex
		var index = this.daligeometry.addVertexBuffer(buffer);

		if (DaliApi.emitcode) {
			console.log('DALICODE: ' + this.name() + '.addVertexBuffer(buffer)');
		}		

		return index;
	}


	this.name = function() {
		return 'daligeometry' + this.id;
	}

	this.inspect = function(depth) {
		var obj = {daliGeometry: this.id};
		var util = require('util')
		return util.inspect(obj, {depth: null});
	}

});
