/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

// Pointer emits events that unify mouse and touch interactions.

define.class('$system/base/node', function(){

	var TAPSPEED = 150
	var TAPDIST = 5

	this.atConstructor = function(){}

	// Internal: Pointer list with helper methods.
	var PointerList = function () {
		Array.call( this )
	}
	PointerList.prototype = Object.create( Array.prototype )
	PointerList.prototype.constructor = PointerList

	// Internal: Finds first unused id in sorted pointer list
	PointerList.prototype.getAvailableId = function () {
		var id = 0
		for (var i = 0; i < this.length; i++) {
			if (this[i].id === id) id += 1
		}
		return id
	}

	// Internal: Finds closest pointer ID in the list to a specified pointer
	PointerList.prototype.getClosest = function (pointer) {
		var closest, dist, closestdist = Infinity
		for (var i = 0; i < this.length; i++) {
			dist = vec2.distance(pointer.position, this[i].position)
			if (dist < closestdist) {
				closest = this[i]
				closestdist = dist
			}
		}
		return closest !== undefined ? closest : undefined
	}

	// Internal: Returns a pointer with specified ID
	PointerList.prototype.getById = function (id) {
		for (var i = 0; i < this.length; i++) {
			if (this[i].id === id) {
				return this[i]
			}
		}
	}

	// Internal: Removes specified pointer from the list
	PointerList.prototype.removePointer = function (pointer) {
		for (var i = this.length; i--;) {
			if (this[i].id === pointer.id) {
				this.splice(i, 1)
				return
			}
		}
	}

	// Internal: Adds pointer to the list or replaces it if ID match is found
	PointerList.prototype.setPointer = function (pointer) {
		for (var i = this.length; i--;) {
			if (this[i].id === pointer.id) {
				this.splice(i, 1, pointer)
				return
			}
		}
		this.push(pointer)
		this.sort(function(a, b) {
			if (a.id < b.id) return -1
			if (a.id > b.id) return 1
			return 0
		})
	}

	/* Internal: Iterates over all views associated with the pointer list and
	*  and calls specified callback with the view and filtered pointers as arguments
	*/
	PointerList.prototype.forEachView = function (callback) {
		views = []
		for (var i = 0; i < this.length; i++) {
			if (this[i].view && views.indexOf(this[i].view) == -1) {
				views.push(this[i].view)
			}
		}
		for (var i = 0; i < views.length; i++) {
			var pointers = []
			for (var j = 0; j < this.length; j++) {
				if (this[j].view === views[i] && pointers.indexOf(this[j]) == -1) {
					pointers.push(this[j])
				}
			}
			callback(views[i], pointers)
		}
	}

	// Internal: Returns pointer object.
	// It calculats deltas, min and max is reference pointer is provided.
	var Pointer = function(pointer, id, view, refpointer) {
		this.id = id
		this.view = view
		this.position = pointer.position
		this.movement = pointer.movement
		this.button = pointer.button
		this.shift = pointer.shift
		this.alt = pointer.alt
		this.ctrl = pointer.ctrl
		this.meta = pointer.meta
		this.touch = pointer.touch
		this.t = Date.now()
		if (refpointer) {
			this.delta = vec2(this.position[0] - refpointer.position[0], this.position[1] - refpointer.position[1])
			this.min = vec2(min(this.position[0], refpointer.position[0]), min(this.position[1], refpointer.position[1]))
			this.max = vec2(max(this.position[0], refpointer.position[0]), max(this.position[1], refpointer.position[1]))
			this.dt = this.t - refpointer.t
		}
		if (pointer.wheel !== undefined) this.wheel = pointer.wheel
	}

	this.attributes = {
		// List of pointers that are catured.
		first:Config({type: Array, value: new PointerList()}),

		// List of pointers at the moment of capture.
		start:Config({type: Array, value: new PointerList()}),
		// List of captured pointers while moving.
		move:Config({type: Array, value: new PointerList()}),
		// List of pointers released from capture.
		end:Config({type: Array, value: new PointerList()}),
		// List of pointers that satisfy tap criteria at the moment of release.
		tap:Config({type: Array, value: new PointerList()}),
		// List of uncaptured pointers in movinf state (should apply only to mouse).
		hover:Config({type: Array, value: new PointerList()}),
		// List of pointers that entered a view.
		over:Config({type: Array, value: new PointerList()}),
		// List of pointers that exited a view.
		out:Config({type: Array, value: new PointerList()}),
		// List of pointers that emitted wheel event (should apply only to mouse).
		wheel:Config({type: Array, value: new PointerList()})
	}

	// Internal: emits `start` event.
	this.setstart = function(pointerlist) {
		this._start.length = 0
		for (var i = 0; i < pointerlist.length; i++) {
			this.device.pickScreen(pointerlist[i].position, function(view){
				var id = this._first.getAvailableId()
				var pointer = new Pointer(pointerlist[i], id, view)
				this._start.setPointer(pointer)
				this._first.setPointer(pointer)
				this._move.setPointer(pointer)
			}.bind(this), true)
		}

		this._start.forEachView(function(view, pointers) {
			this.emit('start', {view: view, pointers: pointers})
		}.bind(this))
	}

	// Internal: emits `move` event.
	this.setmove = function(pointerlist) {
		for (var i = 0; i < pointerlist.length; i++) {
			var previous = this._move.getClosest(pointerlist[i])
			var first = this._first.getById(previous.id)
			var pointer = new Pointer(pointerlist[i], previous.id, first.view, first)
			this._move.setPointer(pointer)
		}
		this._move.forEachView(function(view, pointers) {
			this.emit('move', {view: view, pointers: pointers})
		}.bind(this))
	}

	// Internal: emits `end` event.
	// Emits `tap` event if conditions are met.
	this.setend = function(pointerlist) {
		this._end.length = 0
		this._tap.length = 0
		for (var i = 0; i < pointerlist.length; i++) {
			this.device.pickScreen(pointerlist[i].position, function(view){
				var previous = this._move.getClosest(pointerlist[i])
				var first = this._first.getById(previous.id)
				var pointer = new Pointer(pointerlist[i], previous.id, first.view, first)
				pointer.isover = pointer.view === view
				this._end.setPointer(pointer)
				this._first.removePointer(first)
				this._move.removePointer(pointer)
				if (pointer.dt < TAPSPEED && vec2.len(pointer.delta) < TAPDIST){
					this._tap.setPointer(pointer)
				}
			}.bind(this), true)
		}
		this._end.forEachView(function(view, pointers) {
			this.emit('end', {view: view, pointers: pointers})
		}.bind(this))
		this._tap.forEachView(function(view, pointers) {
			this.emit('tap', {view: view, pointers: pointers})
		}.bind(this))
	}

	// Internal: emits `hover` event.
	this.sethover = function(pointerlist) {
		this._over.length = 0
		this._out.length = 0
		this.device.pickScreen(pointerlist[0].position, function(view){
			var previous = this._hover.getById(0)
			var pointer = new Pointer(pointerlist[0], 0, view)
			this._hover.setPointer(pointer)

			// TODO(aki): entering child view triggers out event. Consider adding pointer-events: 'none'
			if (!previous || previous.view !== pointer.view) {
				if (pointer.view) {
					this._over.setPointer(pointer)
				}
				if (previous) {
					this._out.setPointer(previous)
				}
			}

			this._hover.forEachView(function(view, pointers) {
				this.emit('hover', {view: view, pointers: pointers})
			}.bind(this))
			this._over.forEachView(function(view, pointers) {
				this.emit('over', {view: view, pointers: pointers})
			}.bind(this))
			this._out.forEachView(function(view, pointers) {
				this.emit('out', {view: view, pointers: pointers})
			}.bind(this))
		}.bind(this))
	}


	// TODO(aki): implement over/out on touch start/end
	// Internal: emits `over` event.
	this.setover = function() {}

	// TODO(aki): implement over/out on touch start/end
	// Internal: emits `out` event.
	this.setout = function() {}

	// Internal: emits `wheel` event.
	this.setwheel = function(pointerlist) {
		this._wheel.length = 0
		this.device.pickScreen(pointerlist[0].position, function(view){
			var pointer = new Pointer(pointerlist[0], 0, view)
			this._wheel.setPointer(pointer)
		}.bind(this), true)
		this._wheel.forEachView(function(view, pointers) {
			this.emit('wheel', {view: view, pointers: pointers})
		}.bind(this))
	}

})
