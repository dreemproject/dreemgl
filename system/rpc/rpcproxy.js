/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Rpc single proxy

define.class('$system/base/node', function(require, exports){
	var RpcProxy = exports
	
	RpcProxy.defineProp = function(obj, key, value){
		var store = '__' + key
		Object.defineProperty(obj, key, {
			get:function(){
				return this[store]
			},
			set:function(v){
				// maybe error here?
				throw new Error('Please dont set key ' + key + ' on an rpc object, its readonly')
			}
		})
	}

	RpcProxy.defineMethod = function(obj, key){
		obj[key] = function(){
			var args = []
			var msg = {type:'method', method:key, args:args}

			for(var i = 0; i < arguments.length; i++){
				var arg = arguments[i]
				
				if(typeof arg == 'function' || typeof arg == 'object' && !define.isSafeJSON(arg)){
					throw new Error('RPC call ' + key + ' can only support JSON safe objects')
				}

				args.push(arg)
			}
			return this.parent.methodRpc(this.name, msg)
		}
	}


	RpcProxy.verifyRpc = function(rpcdef, component, prop, kind){
		// lets rip off the array index
		var def = rpcdef[component]
		if(!def){
			console.log('Illegal RPC ' + kind + ' on ' + component)
			return false
		}
		var prop = def[prop]
		if(!prop || prop.kind !== kind){
			console.log('Illegal RPC ' + kind + ' on '+component+'.'+prop)
			return false
		}
		return true
	}

	RpcProxy.createFromObject = function(object, parent){
		var proxy = new RpcProxy()
		proxy.parent = parent
		proxy.name = object.name || object.constructor.name

		var proto = object
		while(proto && proto.isAttribute){
			if(proto.hasOwnProperty('rpcproxy') && proto.rpcproxy === false) break

			var keys = Object.keys(proto)
			for(var i = 0; i < keys.length; i++){
				var key = keys[i]

				if(key in proxy || key.charAt(0) === '_') continue
				if(proto.isAttribute(key)){ // we iz attribute
					// we have to ignore property binds
					var props = proto.getAttributeConfig(key)
					var value = object['_' + key]
					if(!props) props = {}
					if(typeof value === 'function' && value.is_wired || 
						typeof value === 'string' && value.charAt(0) == '$' && value.charAt(1) === '{' && value.charAt(value.length - 1) === '}'){
						props.value = undefined
					}
					else props.value = value
					proxy.defineAttribute(key, props)
				}
				else{
					var prop = proto[key]

					if(typeof prop == 'function' && key.indexOf('on')!==0){
						RpcProxy.defineMethod(proxy, key)
					}
					else if(Array.isArray(prop)){
						// its an array!
					}
				}
			}

			proto = Object.getPrototypeOf(proto)
		}

		object.atAttributeSet = function(key, value){
			// lets call set attribute
			if(!(key in proxy)) return
			var msg = {type:'attribute', attribute:key, value:value}
			proxy.parent.attributeRpc(proxy.name, msg)
		}

		proxy.atAttributeSet = function(key, value){
			if(!(key in proxy)) return
			var msg = {type:'attribute', attribute:key, value:value}
			this.parent.attributeRpc(this.name, msg)
		}

		return proxy
	}

	var RpcChildSet = define.class(function RpcChildSet(){
		this.methodRpc = function(rpcid, message){
			return this.parent.methodRpc(this.name + '.' + rpcid, message)
		}

		this.attributeRpc = function(rpcid, message, recur){
			return this.parent.attributeRpc(this.name + '.' + rpcid, message, recur)
		}
	})

	// we create a set of RPC forwards for the child nodes
	RpcProxy.createChildSet = function(object, parent){
		var childset = new RpcChildSet()
		childset.parent = parent
		childset.name = object.name || object.constructor.name

		for(var i = 0; i < object.constructor_children.length; i++){
			var child = object.constructor_children[i]
			childset[child.name || child.constructor.name] = child.createRpcProxy(childset)
		}
		return childset
	}
})