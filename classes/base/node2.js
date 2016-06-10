define.class(function(require){

	// var ASTScanner = require('$system/parse/astscanner')
	var WiredWalker = require('$system/parse/wiredwalker')
	var OneJSParser =  require('$system/parse/onejsparser')
	var RpcProxy = require('$system/rpc/rpcproxy')

	var wiredwalker = new WiredWalker()

	// parser and walker for wired attributes
	var onejsparser = new OneJSParser()
	onejsparser.parser_cache = {}

	// internal, create an rpc proxy
	this.createRpcProxy = function(parent){
		return RpcProxy.createFromObject(this, parent)
	}
	// the RPCProxy class reads these booleans to skip RPC interface creation for this prototype level
	this.rpcproxy = false

	// Mixes in another class or object, just pass in any number of object or class references. They are copied on key by key
	this.mixin = function(){
		for(var i = 0; i < arguments.length; i++){
			var obj = arguments[i]
			if(typeof obj === 'function') obj = obj.prototype
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

	// internal, set the wired function for an attribute
	this.setWiredAttribute = function(key, value){
		if(!this.hasOwnProperty('_wiredfns')) this._wiredfns = this._wiredfns?Object.create(this._wiredfns):{}
		this._wiredfns[key] = value
		this['_wiredfn_'+key] = value
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

	// internal, connect all wires using the initarray returned by connectWiredAttribute
	this.connectWires = function(initarray, depth){

		var immediate = false
		if(!initarray) {
			initarray = []
			immediate = true
		}

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

	// internal, used by the attribute setter to start a 'motion' which is an auto-animated attribute
	this.startMotion = function(key, value){
		if(!this.screen) return false
		return this.screen.startMotion(this, key, value)
	}

	// internal, return a function that can be assigned as a listener to any value, and then re-emit on this as attribute key
	this.emitForward = function(key){
		return function(value){
			this.emit(key, value)
		}.bind(this)
	}

	// internal, animate an attribute with an animation object see animate
	this.animateAttributes = function(arg){
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

	this.hideProperty(Object.keys(this))

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

})
