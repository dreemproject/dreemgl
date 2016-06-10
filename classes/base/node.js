/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require){
	// Node class provides attributes for events and values, propertybinding and constructor semantics

	// internal, called by the constructor
	this._atConstructor = function(){
		this.children = []
		this.initFromConstructorArgs(arguments)
	}

	// internal, called by the constructor
	this.initFromConstructorArgs = function(args){
		// var off = 0
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
				// off = 1
				this.name = arg
				continue
			}

			if(Array.isArray(arg)){
				this.initFromConstructorArgs(arg)
			}
			else if(arg !== undefined && typeof arg === 'object'){
				arg.__constructorIndex = i
				this.children.push(arg)
				// var name = arg.name
				//if(name !== undefined && !(name in this)) this[name] = arg
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

	// internal, emits an event recursively on all children
	this.emitRecursive = function(key, event, block){
		if(block && block.indexOf(child)!== -1) return
		this.emit(key, event)
		for(var a in this.children){
			var child = this.children[a]
			child.emitRecursive(key, event)
		}
	}

	this.emitFlags = function(flag, keys){
		for(var i = 0; i < keys.length; i++ ){
			this['_flag_'+keys[i]] |= flag
		}
	}

	this.emit_block_set = undefined

	this.emit = function(key, ievent){

		var flag_key = '_flag_' + key
		var on_key = 'on' + key
		var listen_key = '_listen_' + key

		// lets do a fastpass
		var event = ievent || {}

		// flag based listener callbacks
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

	// add a listener to an attribute
	this.addListener = function(key, cb){
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

	// internal, define an attribute, use the attributes =  api
	this.defineAttribute = function(key, config, always_define){
		// lets create an attribute
		var is_config =  config instanceof Config
		var is_attribute = !always_define && key in this
		// use normal value assign

		var islistener = false
		if(key[0] === 'o' && key[1] === 'n'){
			if(this.__lookupSetter__(key.slice(2))) islistener = true
		}

		if(!always_define && (is_attribute && !is_config || islistener || typeof config === 'function' && !config.is_wired)){//|| !is_attribute && typeof config === 'function' && !config.is_wired){
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

		var setter
		// define attribute gettersetters

		// block attribute emission on objects with an environment thats (stub it)
		if(config.alias){
			var alias_key = '_' + config.alias
			var aliasstore_key = '_alias_'+config.alias
			setter = function(value){
				var mark

				var config = this._attributes[key]

				if(this[set_key] !== undefined) value = this[set_key](value)
				if(typeof value === 'function'){
					if(value.is_wired) return this.setWiredAttribute(key, value)
					if(config.type !== Function){
						//this.addListener(on_key, value)
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
				// emit self
				this.emit(key,  {setter:true, key:key, owner:this, old:old, value:value, mark:mark})
			}

			// add a listener to the alias
			var aliasarray = this[aliasstore_key]
			if(!aliasarray) this[aliasstore_key] = aliasarray = []

			aliasarray.push(function(value){
				var old = this[value_key]
				var val = this[value_key] = value[config.index]
				this.emit(key, {setter:true, key:key, owner:this, value:val, old:old})
			})
			// initialize value
			this[value_key] = this[alias_key][config.index]
		}
		else {
			var aliasstore_key = '_alias_'+key
			setter = function(value){
				var mark

				var config = this._attributes[key]

				if(this[set_key] !== undefined) value = this[set_key](value)
				if(typeof value === 'function'){
					if(value.is_wired) return this.setWiredAttribute(key, value)
					if(config.type !== Function){
						//this.addListener(on_key, value)
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

				var aliases = this[aliasstore_key]
				if(aliases){
					for(var i = 0; i<aliases.length;i++){
						aliases[i].call(this, value)
					}
				}

				if(this.atAttributeSet !== undefined) this.atAttributeSet(key, value)
				this.emit(key, {setter:true, owner:this, key:key, old:old, value:value, mark:mark})
			}
		}

		setter.isAttribute = true
		Object.defineProperty(this, key, {
			configurable:true,
			enumerable:true,
			get: function(){
				if(this.atAttributeGetFlag){
					this[flag_key] |= this.atAttributeGetFlag
				}
				return this[value_key]
			},
			set: setter
		})
	}

	// internal, always define an init and destroy
	this.attributes = {
		// the init event, not called when the object is constructed but specifically when it is being initialized by the render
		init:Config({type:Event}),
		// destroy event, called on all the objects that get dropped by the renderer on a re-render
		destroy:Config({type:Event})
	}

	this.setInterval = function(fn, mstime){
		if(!this.interval_ids) this.interval_ids = []

		var platform = typeof window !== 'undefined'?window:global

		var id = platform.setInterval(function(){
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
			var platform = typeof window !== 'undefined'?window:global

		 	platform.clearInterval(id)
		}
	}

	this.setTimeout = function(fn, mstime){
		if(!this.timeout_ids) this.timeout_ids = []
		var platform = typeof window !== 'undefined'?window:global

		var id = platform.setTimeout(function(){
			this.timeout_ids.splice(this.timeout_ids.indexOf(id), 1)
			fn.call(this)
		}.bind(this), mstime)
		this.timeout_ids.push(id)
		return id
	}

	this.clearTimeout = function(id){
		var idx = this.timeout_ids.indexOf(id)
		if(idx !== -1){
			this.timeout_ids.splice(idx, 1)
			var platform = typeof window !== 'undefined'?window:global

		 	platform.clearInterval(id)
		}
	}

})
