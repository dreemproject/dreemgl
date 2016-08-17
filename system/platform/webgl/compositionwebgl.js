/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/
// this class

define.class('$system/base/compositionclient', function(require, baseclass){

	var Device = require('$system/platform/$platform/device$platform')
	var BusClients = {
		'$system/rpc/busclient':require('$system/rpc/busclient'),
		'$system/rpc/dummybusclient':require('$system/rpc/dummybusclient'),
		'$system/rpc/firebusclient':require('$system/rpc/firebusclient')
	}

	this.atConstructor = function(previous, parent, precached, canvas){
		window.composition = this
		if(previous){
			this.reload = (previous.reload || 0) + 1
			this.device = previous.device// new Device(previous.device) //previous.device
			this.device.reload = this.reload
			console.log("Reload " + this.reload)
		}
		else{
			// lets spawn up a webGL device
			this.device = new Device(undefined, canvas)
		}

		baseclass.atConstructor.call(this, previous, parent, precached)
		this.screen._size = this.device.size
	}

	this.createBus = function(){
		this.bus = new BusClients[define.$busclass || '$system/rpc/busclient']((location.href.indexOf('https') === 0?'wss://':'ws://')+location.host+location.pathname)
		if (this.bus.connect) {
			this.bus.connect()
		}
	}

	this.doRender = function(previous, parent){
		baseclass.doRender.call(this, previous, parent)

		this.screen.addListener('locationhash', function(event){
			var obj = event.value
			var str = ''
			for(var key in obj){
				var value = obj[key]
				if(str.length) str += '&'
				if(value === true) str += key
				else str += key + '=' + value
			}
			location.hash = '#' + str
		})

		this.decodeLocationHash = function(){
			// lets split it on & into a=b pairs,
			var obj = {}
			var parts = location.hash.slice(1).split(/\&/)
			for(var i = 0; i < parts.length; i++){
				var part = parts[i]
				var kv = part.split(/=/)
				if(kv.length === 1) obj[kv[0]] = true
				else{
					obj[kv[0]] = kv[1]
				}
			}
			this.screen.locationhash = obj
		}

		window.onhashchange = function(){
			this.decodeLocationHash()
		}.bind(this)

		this.decodeLocationHash()
	}

})
