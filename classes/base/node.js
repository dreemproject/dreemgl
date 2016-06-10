/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require){
	// Node class provides attributes for events and values, propertybinding and constructor semantics

	var RpcProxy = require('$system/rpc/rpcproxy')

	var WiredWalker = require('$system/parse/wiredwalker')
	var OneJSParser =  require('$system/parse/onejsparser')
	var wiredwalker = new WiredWalker()

	// parser and walker for wired attributes
	var onejsparser = new OneJSParser()
	onejsparser.parser_cache = {}

	this._atConstructor = function(){
		// this.parent = undefined
		this.children =
		this.constructor_children = []
		this.initFromConstructorArgs(arguments)
	}

	// internal, called by the constructor
	this.initFromConstructorArgs = function(args){
		// console.log(args)
		for(var i = 0; i < args.length; i++){
			var arg = args[i]
			if(Array.isArray(arg)){
				this.initFromConstructorArgs(arg)
			}
			else if(typeof arg === 'object' && Object.getPrototypeOf(arg) === Object.prototype){
				this.attributes = arg
				continue
			}
			else if(arg !== undefined && typeof arg === 'object') {
				arg.__constructorIndex = i
				this.constructor_children.push(arg)
			}
		}
	}

	this.emit_block_set = undefined
	
	this.emit = function(key, ievent){

		var on_key = 'on' + key
		var listen_key = '_listen_' + key

		// lets do a fastpass
		var event = ievent || {}

		if(!this[on_key] && !this[listen_key]) return

		var lock_key = '_lock_' + key
		if(this[lock_key] || this.emit_block_set && this.emit_block_set.indexOf(key) !== -1) return
		this[lock_key] = true

		try{
			if(!this.__lookupSetter__(key)){
				var fn = this[key]
				if(typeof fn === 'function'){
					fn.call(this, event)
				}
				return
			}

			var proto = this

			// called after the onclicks, in reverse order (parent on up)
			var finals
			while(on_key in proto || listen_key in proto){
				if(proto.hasOwnProperty(on_key)){
					proto[on_key].call(this, event, event.value, this)
					if(event.stop) return
					if(event.final) finals = finals || [], finals.push(event.final)
				}
				if(proto.hasOwnProperty(listen_key)){
					var listeners = proto[listen_key]
					for(var j = listeners.length - 1; j >= 0; j--){
						listeners[j].call(this, event, event.value, this)
						if(event.stop) return
						if(event.final) finals = finals || [], finals.push(event.final)
					}
				}
				proto = Object.getPrototypeOf(proto)
			}
			if(finals) for(var i = finals.length - 1; i >=0; i--){
				finals[i].call(this, event, event.value, this)
				if(event.stop) return
			}
		}
		finally{
			this[lock_key] = false
		}
	}

	// internal, emits an event recursively on all children
	this.emitRecursive = function(key, event, block){
		if(block && block.indexOf(child)!== -1) return
		this.emit(key, event)
		for(var a in this.children){
			var child = this.children[a]
			child.emitRecursive(key, event)
		}
	}
	
	// internal, return a function that can be assigned as a listener to any value, and then re-emit on this as attribute key
	this.emitForward = function(key){
		return function(value){
			this.emit(key, value)
		}.bind(this)
	}

	// add a listener to an attribute
	this.addListener = function(key, cb){
		if(!this.__lookupSetter__(key)){
			this.defineAttribute(key, this[key])
		}
		var listen_key = '_listen_' + key
		var array
		if(!this.hasOwnProperty(listen_key)) array = this[listen_key] = []
		else array = this[listen_key]
		if(array.indexOf(cb) === -1){
			array.push(cb)
		}
	}

	// internal, create an rpc proxy
	this.createRpcProxy = function(parent){
		return RpcProxy.createFromObject(this, parent)
	}

	// the RPCProxy class reads these booleans to skip RPC interface creation for this prototype level
	this.rpcproxy = false

	// pass an object such as {myattribute: Config({type:float, value:0}) to define attribute
	Object.defineProperty(this, 'attributes', {
		get: function(){
			throw new Error("attribute can only be assigned to")
		},
		set: function(arg){
			for(var key in arg){
				this.defineAttribute(key, arg[key])
			}
		}
	})

	// internal, define an attribute, use the attributes =  api
	this.defineAttribute = function(key, config){

		// lets create an attribute
		var is_config =  config instanceof Config
		var is_attribute = key in this
		// use normal value assign

		var islistener = false
		if(key[0] === 'o' && key[1] === 'n'){
			if(this.__lookupSetter__(key.slice(2))) islistener = true
		}

		if(is_attribute && !is_config || islistener || typeof config === 'function' && !config.is_wired){
			this[key] = config
			return
		}

		// autoprocess the config
		if(is_config){
			config = config.config
		}
		else{ // its a value
			config = {value: config}
		}
		// figure out the type
		if(!is_attribute && !config.type){
			var value = config.value

			if(typeof value === 'object'){
				if(value && typeof value.struct === 'function') config.type = value.struct
				else if(Array.isArray(value)) config.type = Array
				else config.type = Object
			}
			else if(typeof value === 'number'){
				config.type = float
			}
			else if(typeof value === 'boolean'){
				config.type = boolean
			}
			else if(typeof value === 'function'){
				if(!value.is_wired){
					config.type = Function
				}
				else{ // an undefined wire is automatically a number
					config.value = 0
					config.type = Number
				}
			}
			else if(typeof value === 'string'){
				config.type = String
			}
		}

		if(!this.hasOwnProperty('_attributes')){
			this._attributes = this._attributes?Object.create(this._attributes):{}
		}
		if(is_attribute){ // extend the config
			//if('type' in config) throw new Error('Cannot redefine type of attribute '+key)
			var newconfig = Object.create(this._attributes[key])
			for(var prop in config){
				newconfig[prop] = config[prop]
			}
			this._attributes[key] = newconfig
			if('value' in config) this[key] = config.value
			if('listeners' in config){
				var listeners = config.listeners
				for(var i = 0; i < listeners.length; i++){
					// this.addListener(key, listeners[i])
				}
			}
			return
		}

		var value_key = '_' + key
		var on_key = 'on' + key
		var listen_key = '_listen_' + key
		var animinit_key = '_animinit_' + key

		//var config_key = '_config_' + key
		var get_key = '_get_' + key
		var set_key = '_set_' + key
		var flag_key = '_flag_' + key

		this[flag_key] = 0

		if(!config.group) config.group  = this.constructor.name
		if(config.animinit) this[animinit_key] = 0
		var init_value = key in this? this[key]:config.value

		if(init_value !== undefined){
			var type = config.type
			if(typeof init_value === 'function'){
				if(init_value.is_wired) this.setWiredAttribute(key, init_value)
				else if(type !== Function){
					//this.addListener(on_key, init_value)
					this[on_key] = init_value
				}
				else this[value_key] = init_value
			}
			else{
				if(type && type !== Object && type !== Array && type !== Function){
					this[value_key] = type(init_value)
				}
				else{
					this[value_key] = init_value
				}
			}
		}
		this._attributes[key] = config

		if(config.listeners) this[listen_key] = config.listeners

		// block attribute emission on objects with an environment thats (stub it)
		var setter = function(value){
			var mark

			var config = this._attributes[key]

			if(this[set_key] !== undefined) value = this[set_key](value)
			if(typeof value === 'function'){
				if(value.is_wired) return this.setWiredAttribute(key, value)
				//if(config.type !== Function){
					//this.addListener(on_key, value)
				//	this[on_key] = value
				//	return
				//}
			}
			if(typeof value === 'object'){
				if(value instanceof Mark){
					mark = value.mark
					value = value.value
				}
				else if(value instanceof Config){
					this.defineAttribute(key, value)
					return
				}
				else if(value instanceof Animate){
					return this.startAnimation(key, undefined, value.track)
				}
			}
			if(typeof value === 'object' && value !== null && value.atAttributeAssign){
				value.atAttributeAssign(this, key)
			}

			var type = config.type
			if(type){
				if(type !== Object && type !== Array && type !== Function) value = type(value)
			}

			if((!mark && (!config.animinit || this[animinit_key]++)) && config.motion && this.startAnimation(key, value)){
				// store the end value
				return
			}
			var old = this[value_key]
			this[value_key] = value

			if(this.atAttributeSet !== undefined) this.atAttributeSet(key, value)

			// call setflags on setter
			var flags = this[flag_key]
			var flag_pos = 1
			while(flags){
				if(flags&flag_pos){
					var flagfn = this['atFlag'+(flags&flag_pos)]
					if(flagfn) flagfn.call(this, key, event)
					flags -= flag_pos
				}
				flag_pos = flag_pos << 1
			}

			this.emit(key, {setter:true, owner:this, key:key, old:old, value:value, mark:mark})
		}

		setter.isAttribute = true
		Object.defineProperty(this, key, {
			configurable:true,
			enumerable:true,
			get: function(){
				if(this.atAttributeGet_SetFlag){
					this[flag_key] |= this.atAttributeGet_SetFlag
				}
				return this[value_key]
			},
			set: setter
		})
	}

	// internal, always define an init and destroy
	this.attributes = {
		parent: Config({type: Object}),
		children: Config({type: Array, init: true}),
		// the init event, not called when the object is constructed but specifically when it is being initialized by the render
		init: Config({type: Event}),
		// destroy event, called on all the objects that get dropped by the renderer on a re-render
		destroy: Config({type: Event}),
		// node cursor
		cursor: Config({type: Enum('', 'arrow', 'none', 'wait', 'text', 'pointer', 'zoom-in', 'zoom-out',
			'grab', 'grabbing', 'ns-resize', 'ew-resize', 'nwse-resize', 'nesw-resize', 'w-resize',
			'e-resize', 'n-resize', 's-resize', 'nw-resize', 'ne-resize', 'sw-resize', 'se-resize', 'help',
			'crosshair', 'move', 'col-resize', 'row-resize', 'vertical-text', 'context-menu', 'no-drop',
			'not-allowed', 'alias', 'cell', 'copy'
		), value: ''})
	}

	this.getCursor = function(){
		var node = this
		while(node){
			if(node._cursor !== ''){
				return node._cursor
			}
			node = node.parent
		}
	}

	this.emitFlags = function(flag, keys){
		for(var i = 0; i < keys.length; i++ ){
			this['_flag_'+keys[i]] |= flag
		}
	}

	// internal, check if property is an attribute
	this.isAttribute = function(key){
		var setter = this.__lookupSetter__(key)
		if(setter !== undefined && setter.isAttribute) return true
		else return false
	}

	// internal, used by find and findChild
	this._findChild = function(name, ignore){
		if(this === ignore) return
		if(this.name === name){
			return this
		}
		if(this.children) {
			for(var i = 0; i < this.children.length; i ++){
				var child = this.children[i]
				if(child === ignore) continue
				var ret = child._findChild(name, ignore)
				if(ret !== undefined){
					return ret
				}
			}
		}
	}

	// Finds a child node by name.
	this.findChild = function(name){
		if(!this.find_cache) this.find_cache = {}
		var child = this.find_cache[name]
		if(child && !child.destroyed) return child
		child = this.find_cache[name] = this._findChild(name)
		return child
	}

	// Finds a parent node by name.
	this.find = function(name){
		var child = this.findChild(name)
		var node = this
		while(child === undefined && node.parent){
			child = node.parent._findChild(name, node)
			node = node.parent
		}
		this.find_cache[name] = child
		return child
	}


	// TODO: implement
	this.setFocus = function () {}

	var platform = typeof window !== 'undefined' ? window : global

	this.setInterval = function(fn, mstime){
		if(!this._intervals) this._intervals = []
		var id = platform.setInterval(function(){
			this._intervals.splice(this._intervals.indexOf(id), 1)
			fn.call(this)
		}.bind(this), mstime)
		this._intervals.push(id)
		return id
	}

	this.clearInterval = function(id){
		var idx = this._intervals.indexOf(id)
		if(idx !== -1){
			this._intervals.splice(idx, 1)
			platform.clearInterval(id)
		}
	}

	this.setTimeout = function(fn, mstime){
		if(!this._timeouts) this._timeouts = []
		var id = platform.setTimeout(function(){
			this._timeouts.splice(this._timeouts.indexOf(id), 1)
			fn.call(this)
		}.bind(this), mstime)
		this._timeouts.push(id)
		return id
	}

	this.clearTimeout = function(id){
		var idx = this._timeouts.indexOf(id)
		if(idx !== -1){
			this._timeouts.splice(idx, 1)
			platform.clearInterval(id)
		}
	}

})
