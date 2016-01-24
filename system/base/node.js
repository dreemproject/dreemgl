/* Copyright 2015-2016 Teem. Licensed under the Apache License, Version 2.0 (the "License"); Dreem is a collaboration between Teem & Samsung Electronics, sponsored by Samsung.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, constructor){
	// Node class provides attributes for events and values, propertybinding and constructor semantics

	var Node = constructor

	var OneJSParser =  require('$system/parse/onejsparser')
	var WiredWalker = require('$system/parse/wiredwalker')
	var RpcProxy = require('$system/rpc/rpcproxy')

	// parser and walker for wired attributes
	var onejsparser = new OneJSParser()
	onejsparser.parser_cache = {}
	var wiredwalker = new WiredWalker()

	// the RPCProxy class reads these booleans to skip RPC interface creation for this prototype level
	this.rpcproxy = false

	// internal, called by the constructor
	this._atConstructor = function(){
		// store the args for future reference
		//var args = this.constructor_args = Array.prototype.slice.call(arguments)
		this.children =
		this.constructor_children = []
		this.initFromConstructorArgs(arguments)
	}

	this.setInterval = function(fn, mstime){
		if(!this.interval_ids) this.interval_ids = []
		var id = window.setInterval(function(){
			this.interval_ids.splice(this.interval_ids.indexOf(id), 1)
			fn.call(this)
		}.bind(this), mstime)
		this.interval_ids.push(id)
		return id
	}

	this.clearInterval = function(id){
		var idx = this.interval_ids.indexOf(id)
		if(idx !== -1){
			this.interval_ids.splice(idx, 1)
		 	window.clearInterval(id)
		}
	}

	this.setTimeout = function(fn, mstime){
		if(!this.timeout_ids) this.timeout_ids = []
		var id = window.setTimeout(function(){
			this.timeout_ids.splice(this.timeout_ids.indexOf(id), 1)
			fn.call(this)
		}.bind(this), mstime)
		this.timeout_ids.push(id)
		return id
	}

	this.clearTimeout = function(id){
		var idx = this.timeout_ids.indexof(id)
		if(idx !== -1){
			this.timeout_ids.splice(idx, 1)
		 	window.clearInterval(id)
		}
	}

	// internal, called by the constructor
	this.initFromConstructorArgs = function(args){
		var off = 0
		for(var i = 0; i < args.length; i++){
			var arg = args[i]
			if(typeof arg === 'object' && Object.getPrototypeOf(arg) === Object.prototype){
				this.attributes = arg
				//this.initFromConstructorProps(arg)
				continue
			}
			if(typeof arg === 'function'){
				var prop = {}; prop[arg.name] = arg
				this.attributes = prop
				//this.initFromConstructorProps(prop)
				continue
			}
			if(typeof arg === 'string' && i === 0){
				off = 1
				this.name = arg
				continue
			}

			if(Array.isArray(arg)){
				this.initFromConstructorArgs(arg)
			}
			else if(arg !== undefined && typeof arg === 'object'){
				this.constructor_children.push(arg)
				var name = arg.name
				//if(name !== undefined && !(name in this)) this[name] = arg
			}
		}
	}
/*
	// internal, called by the constructor
	this.initFromConstructorProps = function(obj){

		for(var key in obj){
			var prop = obj[key]
			var tgt = this
			var type = 0

			if(!this.constructor_props) this.constructor_props = {}
			this.constructor_props[key] = prop

			var idx = key.indexOf('.')
			if(idx !== -1){
				tgt = this[key.slice(0,idx)]
				key = key.slice(idx + 1)
			}

			tgt[key] = prop
		}
	}*/


	// Mixes in another class or object, just pass in any number of object or class references. They are copied on key by key
	this.mixin = function(){
		for(var i = 0; i < arguments.length; i++){
			var obj = arguments[i]
			if(typeof obj == 'function') obj = obj.prototype
			for(var key in obj){
				// copy over getters and setters
				if(obj.__lookupGetter__(key) || obj.__lookupSetter__(key)){
					// ignore it
				}
				else{
					// other
					this[key] = obj[key]
				}
			}
		}
	}

	// internal, used by find
	this.findChild = function(name, ignore, nocache){
		if(!nocache){
			if(!this.find_cache) this.find_cache = {}
			var child = this.find_cache[name]
			if(child && !child.destroyed) return child
		}

		// ok so first we go down all children
		if(this === ignore) return
		if(this.name === name){
			if(!nocache) this.find_cache[name] = this
			return this
		}
		if(this.children) for(var i = 0; i < this.children.length; i ++){
			var child = this.children[i]
			if(child === ignore) continue
			var ret = child.findChild(name, undefined, true)
			if(ret !== undefined){
				if(!nocache) this.find_cache[name] = ret
				return ret
			}
		}
	}

	// find node by name, they look up the .name property or the name of the constructor (class name) by default
	this.find = function(name, ignore){
		child = this.findChild(name)
		var node = this
		while(child === undefined && node.parent){
			child = node.parent.findChild(name, node, true)
			node = node.parent
		}
		this.find_cache[name] = child
		return child
	}

	// internal, hide a property, pass in any set of strings
	this.hideProperty = function(){
		for(var i = 0; i<arguments.length; i++){
			var arg = arguments[i]
			if(Array.isArray(arg)){
				for(var j = 0; j<arg.length; j++){
					Object.defineProperty(this, arg[j],{enumerable:false, configurable:true, writeable:true})
				}
			}
			else{
				Object.defineProperty(this, arg,{enumerable:false, configurable:true, writeable:true})
			}
		}
	}

	// internal, check if property is an attribute
	this.isAttribute = function(key){
		var setter = this.__lookupSetter__(key)
		if(setter !== undefined && setter.isAttribute) return true
		else return false
	}

	// internal, returns the attribute config object (the one passed into this.attributes={attr:{config}}
	this.getAttributeConfig = function(key){
		return this._attributes[key]
	}

	// internal, check if an attribute has wires connected
	this.hasWires = function(key){
		var wiredfn_key = '_wiredfn_' + key
		return wiredfn_key in this
	}

	// internal, returns the wired-call for an attribute
	this.wiredCall = function(key){
		var wiredcl_key = '_wiredcl_' + key
		return this[wiredcl_key]
	}

	// internal, emits an event recursively on all children
	this.emitRecursive = function(key, event, block){

		if(block && block.indexOf(child)!== -1) return
		this.emit(key, event);
		for(var a in this.children){
			var child = this.children[a]
			child.emitRecursive(key, event)
		}
	}

	// emit an event for an attribute key. the order
	this.emit = function(key, event){
		var on_key = 'on' + key
		var listen_key = '_listen_' + key
		var lock_key = '_lock_' + key

		if(this[lock_key]) return

		this[lock_key] = true
		try{
			var proto = this
			var stack

			while(on_key in proto){
				if(proto.hasOwnProperty(on_key)) (stack || (stack = [])).push(proto[on_key])
				proto = Object.getPrototypeOf(proto)
			}

			if(stack !== undefined) for(var j = stack.length - 1; j >=0; j--){
				stack[j].call(this, event)
			}

			var proto = this
			while(listen_key in proto){
				if(proto.hasOwnProperty(listen_key)){
					var listeners = proto[listen_key]
					for(var j = 0; j < listeners.length; j++){
						listeners[j].call(this, event)
					}
				}
				proto = Object.getPrototypeOf(proto)
			}
		}
		finally{
			this[lock_key] = false
		}
	}

	// add a listener to an attribute
	this.addListener = function(key, cb){
		// if something isnt an attribute, make it one
		if(!this.__lookupSetter__(key)){
			this.defineAttribute(key, this[key], true)
		}

		var listen_key = '_listen_' + key
		var array
		if(!this.hasOwnProperty(listen_key)) array = this[listen_key] = []
		else array = this[listen_key]
		if(array.indexOf(cb) === -1){
			array.push(cb)
		}
	}

	// remove a listener from an attribute, uses the actual function reference to find it
	// if you dont pass in a function reference it removes all listeners
	this.removeListener = function(key, cb){
		var listen_key = '_listen_' + key
		if(!this.hasOwnProperty(listen_key)) return
		var cbs = this[listen_key]
		if(cbs){
			if(cb){
				var idx = cbs.indexOf(cb)
				if(idx !== -1) cbs.splice(idx,1)
			}
			else{
				cbs.length = 0
			}
		}
	}

	// internal, check if an attribute has a listener with a .name property set to fnname
	this.hasListenerProp = function(key, prop, value){
		var listen_key = '_listen_' + key
		if(!this.hasOwnProperty(listen_key)) return false
		var listeners = this[listen_key]
		if(!listeners) return false
		for(var i = 0; i < listeners.length; i++){
			if(listeners[i][prop] === value) return true
		}
		return false
	}

	// internal, returns true if attribute has any listeners
	this.hasListeners = function(key){
		var listen_key = '_listen_' + key
		var on_key = 'on' + key
		if(on_key in this || listen_key in this && this[listen_key].length) return true
		return false
	}

	// internal, remove all listeners from a node
	this.removeAllListeners = function(){
		var keys = Object.keys(this)
		for(var i = 0; i < keys.length; i++){
			var key = keys[i]
			if(key.indexOf('_listen_') === 0){
				this[key] = undefined
			}
		}
	}

	// internal, set the wired function for an attribute
	this.setWiredAttribute = function(key, value){
		if(!this.hasOwnProperty('_wiredfns')) this._wiredfns = this._wiredfns?Object.create(this._wiredfns):{}
		this._wiredfns[key] = value
		this['_wiredfn_'+key] = value
	}

	// internal, mark an attribute as persistent accross live reload / renders
	this.definePersist = function(arg){
		if (!this.hasOwnProperty("_persists")){

			if (this._persists){
				this._persists = Object.create(this._persists)
			}
			else{
				this._persists = {}
			}
		}
		this._persists[arg] = 1
	}

	Object.defineProperty(this, 'style', {
		get:function(){
			return this._style
		},
		set:function(v){
			if(!this.hasOwnProperty('_style')) this._style = Object.create(this._style)
			if(typeof v === 'object'){
				for(var key in v){
					var value = v[key]
					if(typeof value === 'object'){
						var base = this._style[key]
						if(!base) this._style[key] = value
						else{
							var obj = this._style[key] = Object.create(base)
							for(var subkey in value){
								obj[subkey] = value[subkey]
							}
						}
					}
					else{
						this._style[key] = v[key]
					}
				}
			}
			else if(typeof v === 'function'){
				v.call(this._style)
			}
		}
	})

	var Style = define.class(function(){

		this.composeStyle = function(){
			// lets find the highest matching level
			for(var i = arguments.length - 1; i >= 0; i--){
				var match = arguments[i]
				if(!match) continue
				var style = this[match]
				if(style){
					if(i === 0) return style
					if(style._composed) return style
					style = {}
					// lets compose a style from the match stack
					for(var j = 0; j <= i; j++){
						var level = this[arguments[j]]
						if(level){
							for(var key in level) style[key] = level[key]
						}
					}
					Object.defineProperty(style, '_composed', {value:1})
					Object.defineProperty(style, '_match', {value:match})

					// lets store it back
					this[match] = style
					return style
				}
			}
		}

		this.lookup = function(name, props){
			// lets return a matching style
			return this.composeStyle(
				'$',
				'$_' + props.class,
				name,
				name + '_' + props.class,
				name + '_' + props.name
			)
		}
	})

	this._style = new Style()

	this.atStyleConstructor = function(original, props, where){
		// lets see if we have it in _styles
		var name = original.name

		var propobj = props && Object.getPrototypeOf(props) === Object.prototype? props: {}

		// we need to flush this cache on livereload
		//var cacheid = name + '_' + propobj.class + '_' + propobj.name
		//var cache = this._style._cache || (this._style._cache = {})

		//var found = cache[cacheid]
		//if(found) return found

		var style = this._style.lookup(name, propobj)

		// find the base class
		var base = original
		if(this.constructor.outer) base = this.constructor.outer.atStyleConstructor(original, propobj, 'outer')
		else if(this !== this.composition && this !== this.screen && this.screen){
			base = this.screen.atStyleConstructor(original, propobj, 'screen')
		}
		else if(this.composition !== this && this.composition) base = this.composition.atStyleConstructor(original, propobj, 'composition')

		// 'quick' out
		var found = style && style._base && style._base[name] === base && style._class && style._class[name]
		if(found){
			return /*cache[cacheid] =*/ found
		}

		if(!style) return /*cache[cacheid] =*/  base

		if(!style._class){
			Object.defineProperty(style, '_class', {value:{}, configurable:true})
			Object.defineProperty(style, '_base', {value:{}, configurable:true})
		}

		// (re)define the class
		if(style._base[name] !== base || !style._class[name]){
			var clsname = base.name + '_' +(where?where+'_':'')+ (style._match||'star')
			var cls = style._class[name] = base.extend(style, original.outer, clsname)
		 	style._base[name] = base
		 	return /*cache[cacheid] =*/ cls
		}

		return /*cache[cacheid] =*/ original
	}

	// pass an object such as {attrname:{type:vec2, value:0}, attrname:vec2(0,1)} to define attributes on an object
	Object.defineProperty(this, 'attributes', {
		get:function(){
			throw new Error("attribute can only be assigned to")
		},
		set:function(arg){
			for(var key in arg){
				this.defineAttribute(key, arg[key])
			}
		}
	})
/*
	// define listeners {attrname:function(){}}
	Object.defineProperty(this, 'listeners', {
		get:function(){
			throw new Error("listeners can only be assigned to")
		},
		set:function(arg){
			for(var key in arg){
				this.addEventListener(key, arg[key])
			}
		}
	})

	// define setters {attrname:function(){}}
	Object.defineProperty(this, 'setters', {
		get:function(){
			throw new Error("setter can only be assigned to")
		},
		set:function(arg){
			for(var key in arg){
				this['_set_'+key] = arg[key]
			}
		}
	})


	// define getters {attrname:function(){}}
	Object.defineProperty(this, 'getters', {
		get:function(){
			throw new Error("getter can only be assigned to")
		},
		set:function(arg){
			for(var key in arg){
				this['_get_'+key] = arg[key]
			}
		}
	})

	// start animation by assigning keyframes to an attribute {attrname:{1:'red', 2:'green', 3:'blue'}}
	Object.defineProperty(this, 'animate', {
		get:function(){ return this.animateAttribute },
		set:function(arg){
			this.animateAttribute(arg)
		}
	})*/

	// internal, animate an attribute with an animation object see animate
	this.animateAttribute = function(arg){
		// count
		var arr = []
		for(var key in arg){
			var value = arg[key]
			if(typeof value === 'object'){
				var resolve, reject
				var promise = new Promise(function(res, rej){ resolve = res, reject = rej })
				promise.resolve = resolve
				promise.reject = reject
				arr.push(promise)
				this.startAnimation(key, undefined, value, promise)
			}
			else{
				if(typeof value === 'string'){
					value = value.toLowerCase()
					if(value === 'stop'){
						this.stopAnimation(key)
					}
					else if(value === 'play'){
						this.playAnimation(key)
					}
					else if(value === 'pause'){
						this.pauseAnimation(key)
					}
				}
				resolve()
			}
		}
		if(arr.length <= 1) return arr[0]
		return Promise.all(arr)
	}

	// internal, define an attribute, use the attributes =  api
	this.defineAttribute = function(key, config, always_define){
		// lets create an attribute
		var is_config =  config instanceof Config
		var is_attribute = !always_define && key in this
		// use normal value assign
		if(!always_define && (is_attribute && !is_config || key[0] === 'o' && key[1] === 'n' || typeof config === 'function')){//|| !is_attribute && typeof config === 'function' && !config.is_wired){
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
			else if(typeof value === 'function' && !value.is_wired){
				config.type = Function
			}
			else if(typeof value === 'string'){
				config.type = String
			}
		}
		if(config.persist){
			if(config.alias) throw new Error('Cannot define a persist property '+key+' with alias, use the alias attribute '+config.alias)
			this.definePersist(key)
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
					this.addListener(key, listeners[i])
				}
			}

			return
		}

		var value_key = '_' + key
		var on_key = 'on' + key
		var listen_key = '_listen_' + key
		var wiredfn_key = '_wiredfn_' + key
		var animinit_key = '_animinit_' + key
		//var config_key = '_config_' + key
		var get_key = '_get_' + key
		var set_key = '_set_' + key

		if(!config.group) config.group  = this.constructor.name
		if(config.animinit) this[animinit_key] = 0
		var init_value = key in this? this[key]:config.value

		if(init_value !== undefined){
			var type = config.type
			if(typeof init_value === 'function'){
				if(init_value.is_wired) this.setWiredAttribute(key, init_value)
				else if(type !== Function) this[on_key] = init_value
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

		var setter
		// define attribute gettersetters

		// block attribute emission on objects with an environment thats (stub it)
		if(config.alias){
			var alias_key = '_' + config.alias

			setter = function(value){
				var mark

				var config = this._attributes[key]

				if(this[set_key] !== undefined) value = this[set_key](value)
				if(typeof value === 'function'){
					if(value.is_wired) return this.setWiredAttribute(key, value)
					if(config.type !== Function){
						this[on_key] = value
						return
					}
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
						return this.startAnimation(key, value)
					}
				}
				if(typeof value === 'object' && value !== null && value.atAttributeAssign){
					value.atAttributeAssign(this, key)
				}

				if(!mark && config.motion){
					// lets copy our value in our property
					this[value_key] = this[alias_key][config.index]
					this.startAnimation(key, value)
					return
				}

				var store
				if(!this.hasOwnProperty(alias_key)){
					store = this[alias_key]
					store = this[alias_key] = store.struct(store)
				}
				else{
					store = this[alias_key]
				}
				var old = this[value_key]
				this[value_key] = store[config.index] = value

				// emit alias
				this.emit(config.alias, {setter:true, via:key, key:config.alias, owner:this, value:this[alias_key], mark:mark})

				if(this.atAttributeSet !== undefined) this.atAttributeSet(key, value)
				if(on_key in this || listen_key in this) this.emit(key,  {setter:true, key:key, owner:this, old:old, value:value, mark:mark})
			}

			this.addListener(config.alias, function(event){
				var old = this[value_key]
				var val = this[value_key] = event.value[config.index]
				if(on_key in this || listen_key in this)  this.emit(key, {setter:true, key:key, owner:this, value:val, old:old, mark:event.mark})
			})
			// initialize value
			this[value_key] = this[alias_key][config.index]
		}
		else {
			setter = function(value){
				var mark

				var config = this._attributes[key]

				if(this[set_key] !== undefined) value = this[set_key](value)
				if(typeof value === 'function'){
					if(value.is_wired) return this.setWiredAttribute(key, value)
					if(config.type !== Function){
						this[on_key] = value
						return
					}
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
				if(on_key in this || listen_key in this)  this.emit(key, {setter:true, owner:this, key:key, old:old, value:value, mark:mark})
			}
		}

		setter.isAttribute = true
		Object.defineProperty(this, key, {
			configurable:true,
			enumerable:true,
			get: function(){
				if(this.atAttributeGet !== undefined) this.atAttributeGet(key)
				var getter = this[get_key]
				if(getter !== undefined) return getter()
				// lets check if we need to map our stored type
				// if we are in motion, we should return the end value
				return this[value_key]
			},
			set: setter
		})
	}

	// internal, connect a wired attribute up to its listeners
	this.connectWiredAttribute = function(key, initarray){
		var wiredfn_key = '_wiredfn_' + key
		var wiredcl_key = '_wiredcl_' + key
		var wiredfn = this[wiredfn_key]
		var ast = onejsparser.parse(wiredfn.toString())
		var state = wiredwalker.newState()

		wiredwalker.expand(ast, null, state)

		var bindcall = function(){
			var deps = bindcall.deps
			if(deps && !bindcall.initialized){
				bindcall.initialized = true
				for(var i = 0; i < deps.length; i++) deps[i]()
			}
			this[key] = this[wiredfn_key].call(this, this[wiredcl_key].find, this.rpc)
		}.bind(this)

		this[wiredcl_key] = bindcall
		bindcall.find = {}

		for(var j = 0; j < state.references.length; j++){
			var ref = state.references[j]
			var obj = {'this':this,'find':bindcall.find,'rpc':this.rpc}
			for(var k = 0; k < ref.length; k++){

				var part = ref[k]
				if(k === ref.length - 1){
					// lets add a listener
					if(!obj || !obj.isAttribute || !obj.isAttribute(part)){
						console.error("Attribute does not exist: "+ref.join('.') + " (at " + part + ") in wiring " + this[wiredfn_key].toString())
						continue
					}

					obj.addListener(part, bindcall)

					if(obj.hasWires(part) && !obj.wiredCall(part)){
						obj.connectWiredAttribute(part)
						if(!bindcall.deps) bindcall.deps = []
						bindcall.deps.push(obj.wiredCall(part))
					}
				}
				else{
					var newobj = obj[part]
					if(!newobj){
						if(obj === bindcall.find){ // lets make an alias on this, scan the parent chain
							obj = this.find(part)
							if(obj) bindcall.find[part] = obj
							/*
							while(obj){
								if(part in obj){
									if(part in this) console.log("Aliasing error with "+part)
									//console.log("ALIASING" + part, this)
									obj = this[part] = obj[part]
									break
								}
								obj = obj.parent
							}*/
						}
					}
					else obj = newobj
					if(!obj) console.log('Cannot find part ' + part + ' in ' + ref.join('.') + ' in propertybind', this)
				}
			}
		}
		if(initarray) initarray.push(bindcall)
	}

	// internal, return a function that can be assigned as a listener to any value, and then re-emit on this as attribute key
	this.emitForward = function(key){
		return function(value){
			this.emit(key, value)
		}.bind(this)
	}

	// internal, connect all wires using the initarray returned by connectWiredAttribute
	this.connectWires = function(initarray, depth){

		var immediate = false
		if(!initarray) initarray = [], immediate = true

		if(this._wiredfns){
			for(var key in this._wiredfns){
				this.connectWiredAttribute(key, initarray)
			}
		}
		// lets initialize bindings on all nested classes
		var nested = this.constructor.nested
		if(nested) for(var name in nested){
			var nest = this[name.toLowerCase()]
			if(nest.connectWires){
				nest.connectWires(initarray, depth)
			}
		}
		if(immediate === true){
			for(var i = 0; i < initarray.length; i++){
				initarray[i]()
			}
		}
	}

	// internal, does nothing sofar
	this.disconnectWires = function(){
	}

	// internal, used by the attribute setter to start a 'motion' which is an auto-animated attribute
	this.startMotion = function(key, value){
		if(!this.screen) return false
		return this.screen.startMotion(this, key, value)
	}

	// internal, create an rpc proxy
	this.createRpcProxy = function(parent){
		return RpcProxy.createFromObject(this, parent)
	}

	// mixin setter API to easily assign mixins using an is: syntax in the constructors
	Object.defineProperty(this, 'is', {
		set:function(value){
			// lets copy on value.
			if(Array.isArray(value)){
				for(var i = 0; i<value.length; i++) this.is = value[i]
				return
			}
			if(typeof value === 'function') value = value.prototype
			if(typeof value === 'object'){
				for(var key in value){
					this[key] = value[key]
				}
			}
		}
	})

	this.hideProperty(Object.keys(this))

	// always define an init and deinit
	this.attributes = {
		// the init event, not called when the object is constructed but specifically when it is being initialized by the render
		init:Config({type:Event}),
		// destroy event, called on all the objects that get dropped by the renderer on a re-render
		destroy:Config({type:Event})
	}

})
