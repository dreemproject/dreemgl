/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others. 
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Rpc Promise handler object

define.class(function(require, exports){

	var rpcproxy = require('./rpcproxy')

	this.atConstructor = function(host){
		this.host = host
	}

	this.methodRpc = function(name, msg){
		msg.rpcid = name
		return this.host.callRpcMethod(msg)
	}

	this.attributeRpc = function(name, msg){
		msg.rpcid = name
		return this.host.setRpcAttribute(msg, null )
	}

	// lets disconnect all listeners
	this.disconnectAll = function(){
		for(var key in this){
			var obj = this[key]
			if(obj instanceof rpcproxy){
				obj.disconnectAll()
			}
		}
	}

	exports.resolveReturn = this.resolveReturn = function(msg){
		if(!this.promises) return
		var promise = this.promises[msg.uid]
		if(!promise) return console.log('Error resolving RPC promise id ' + msg.uid)
		this.uid_free.push(msg.uid)
		this.promises[msg.uid] = undefined
		if(msg.error){
			promise.reject(msg)
		}
		else{
			promise.resolve(msg)
		}
	}

	exports.allocPromise = this.allocPromise = function(){
		var uid 
		if(this.uid === undefined) this.uid = 0
		if(!this.promises) this.promises = {}
		if(!this.uid_free) this.uid_free = []
		if(this.uid_free.length){
			uid = this.uid_free.pop()
		}
		else uid = this.uid++

		if(this.uid > 500){
			// TODO make a promise timeout cleanup
			console.log('Warning, we have an RPC promise leak')
			for(var i = 0;i<100;i++){
				console.log(this.promises[i].msg)
			}
		}

		var resolve, reject
		var prom = new define.Promise(function(_resolve, _reject){resolve = _resolve, reject = _reject})
		prom.resolve = resolve
		prom.reject = reject
		prom.uid = uid
		this.promises[uid] = prom

		return prom
	}

})