/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

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
				this.splice(i, 1, new Pointer(pointer, pointer.id, pointer.view))
				return
			}
		}
		this.push(new Pointer(pointer, pointer.id, pointer.view))
		this.sort(function(a, b) {
			if (a.id < b.id) return -1
			if (a.id > b.id) return 1
			return 0
		})
	}

	// Internal: Iterates over all views associated with the pointer list and
	// calls specified callback with the view and filtered pointers as arguments
	PointerList.prototype.forEachView = function (callback) {
		var views = []
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
	var Pointer = function(pointer, id, view) {
		// TODO(aki): add start value
		this.id = id
		this.view = view
		this.value = pointer.value
		this.position = pointer.position
		this.button = pointer.button
		this.shift = pointer.shift
		this.alt = pointer.alt
		this.ctrl = pointer.ctrl
		this.meta = pointer.meta
		this.touch = pointer.touch
		this.delta = pointer.delta || vec2()
		this.min = pointer.min || vec2()
		this.max = pointer.max || vec2()
		this.dt = pointer.dt || 0
		this.movement = pointer.movement || vec2()
		this.isover = pointer.isover
		this.pick = pointer.pick
		this.clicker = pointer.clicker
		this.t = Date.now()
		if (pointer.wheel !== undefined) this.wheel = pointer.wheel
	}

	Pointer.prototype.addDelta = function(refpointer) {
		this.delta = vec2(this.position[0] - refpointer.position[0], this.position[1] - refpointer.position[1])
		this.min = vec2(min(this.position[0], refpointer.position[0]), min(this.position[1], refpointer.position[1]))
		this.max = vec2(max(this.position[0], refpointer.position[0]), max(this.position[1], refpointer.position[1]))
		this.dt = this.t - refpointer.t
	}

	Pointer.prototype.addMovement = function(refpointer) {
		this.movement = vec2(this.position[0] - refpointer.position[0], this.position[1] - refpointer.position[1])
	}

	// Adds click count to pointer
	Pointer.prototype.setClicker = function(list) {
		this.clicker = 0
		for (var i = 0; i < list.length; i++) {
			if (this.t - list[i].t < TAPSPEED * (i + 1)) this.clicker += 1
		}
	}


	// TODO(aki): initialize per instance
	this.attributes = {
		// List of pointers that are captured.
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
		wheel:Config({type: Array, value: new PointerList()}),
		// list of previous taps
		clickerstash:Config({type: Array, value: []})
	}

	this.emitPointerList = function(pointerlist, eventname) {
		pointerlist.forEachView(function(view, pointers) {
			pointers.forEach(function(pointer) {
				// delete pointer.view
				this.emit(eventname, {view: view, pointer: pointer})
			}.bind(this))
			this.emit(eventname, {view: view, pointers: pointers})
		}.bind(this))
	}

	// Internal: emits `start` event.
	// TODO(aki): down with button 2 seems to trigger end and tap. Investigate.
	this.setstart = function(pointerlist) {

		// scan for handoff hooks on in flight pointers
		for (var i = 0; i < this._start.length; i++) {
			var start = this._start[i]

			if (start.atHandOver){
				var id = start.atHandOver(pointerlist)
				if (id >= 0){
					// we got a handoff of a particular pointer
					pointerlist[id].handovered = start.view
				}
			}
		}

		this._start.length = 0

		var pick = function(view){
			var id = this._first.getAvailableId()
			var pointer = new Pointer(pointerlist[i], id, view)
			// Add pointer to clicker stash for counting
			this._clickerstash.unshift(pointer)
			this._clickerstash.length = min(this._clickerstash.length, 5)
			pointer.setClicker(this._clickerstash)
			// set pointer lists
			this._start.setPointer(pointer)
			this._first.setPointer(pointer)
			this._move.setPointer(pointer)
		}.bind(this)

		for (var i = 0; i < pointerlist.length; i++) {
			// if a pointer is handoffed use that view instead
			if (pointerlist[i].handovered) pick(pointerlist[i].handovered)
			else this.device.pickScreen(pointerlist[i].position, pick, true)
		}
		this.emitPointerList(this._start, 'start')
	}

	// Internal: emits `move` event.
	this.setmove = function(pointerlist) {
		this._wheel.length = 0
		for (var i = 0; i < pointerlist.length; i++) {
			var previous = this._move.getClosest(pointerlist[i])
			var start = this._start.getById(previous.id)
			var first = this._first.getById(previous.id)

			var pointer = new Pointer(pointerlist[i], previous.id, first.view)
			pointer.addDelta(first)
			pointer.addMovement(previous || first)

			// emit event hooks
			if (start){
				if (start.pickview){
					this.device.pickScreen(pointerlist[i].position, function(view){
						pointer.pick = view
					}.bind(this), true)
				}
				if (start.atMove) start.atMove(pointerlist[i], pointerlist[i].value, start)
			}
			this._move.setPointer(pointer)
			// TODO(aki): check list length per view
			if (pointer.touch && pointerlist.length === 1) {
				if (abs(pointer.movement[0]) > abs(pointer.movement[1])) {
					pointer.wheel = vec2(-pointer.movement[0], 0)
				} else {
					pointer.wheel = vec2(0, -pointer.movement[1])
				}
				this._wheel.setPointer(pointer)
			}
		}
		this.emitPointerList(this._move, 'move')
		if (this._wheel.length) {
			this.emitPointerList(this._wheel, 'wheel')
		}
	}

	// Internal: emits `end` event.
	// Emits `tap` event if conditions are met.
	this.setend = function(pointerlist) {
		this._end.length = 0
		this._tap.length = 0
		for (var i = 0; i < pointerlist.length; i++) {

			// emit event hooks
			var start = this._start.getById(this._move.getClosest(pointerlist[i]).id)
			if (start){
				if (start.atEnd) start.atEnd(pointerlist[i], pointerlist[i].value, start)
			}

			this.device.pickScreen(pointerlist[i].position, function(view){
				var previous = this._move.getClosest(pointerlist[i])
				var first = this._first.getById(previous.id)

				var pointer = new Pointer(pointerlist[i], previous.id, first.view)
				pointer.addDelta(first)
				pointer.setClicker(this._clickerstash)
				pointer.isover = pointer.view === view
				this._first.removePointer(first)
				this._end.setPointer(pointer)
				this._move.removePointer(pointer)
				if (pointer.dt < TAPSPEED && vec2.len(pointer.delta) < TAPDIST){
					this._tap.setPointer(pointer)
				}
			}.bind(this), true)

		}

		this.emitPointerList(this._end, 'end')
		this.emitPointerList(this._tap, 'tap')
	}

	// Internal: emits `hover` event.
	this.sethover = function(pointerlist) {
		this._over.length = 0
		this._out.length = 0
		this.device.pickScreen(pointerlist[0].position, function(view){
			var previous = this._hover.getById(0)
			if (previous) previous = new Pointer(previous, 0, previous.view)
			var pointer = new Pointer(pointerlist[0], 0, view)
			this._hover.setPointer(pointer)
			// TODO(aki): entering child view triggers out event. Consider adding pointer-events: 'none'
			if (!previous || previous.view !== pointer.view) {
				if (pointer.view) {
					this._over.setPointer(pointer)
				}
				if (previous) {
					if (previous) console.log(previous.view)
					this._out.setPointer(previous)
				}
			}
			// TODO(aki): fix hover, over, out and drag API
			this.emitPointerList(this._hover, 'hover')
			this.emitPointerList(this._over, 'over')
			this.emitPointerList(this._out, 'out')
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
		var dist = Infinity
		// Hack to prevent screen picking when mouse is not moving
		if (this._wheel[0]) {
			dist = vec2.distance(pointerlist[0].position, this._wheel[0].position)
		}
		if (dist > 0) {
			this.device.pickScreen(pointerlist[0].position, function(view){
				var pointer = new Pointer(pointerlist[0], 0, view)
				pointer.value = pointer.wheel
				this._wheel.setPointer(pointer)
			}.bind(this), true)
		} else {
			var pointer = new Pointer(pointerlist[0], 0, this._wheel[0].view)
			pointer.value = pointer.wheel
			this._wheel.setPointer(pointer)
		}
		this.emitPointerList(this._wheel, 'wheel')
	}

})
