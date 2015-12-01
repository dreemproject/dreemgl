/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// this class

define.class('$system/base/compositionclient', function(require, baseclass){

	var Device = require('$system/platform/$platform/device$platform')
	var WebRTC = require('$system/rpc/webrtc')
	var BusClient = require('$system/rpc/busclient')

	this.atConstructor = function(previous, parent){

		if(previous){
			this.reload = (previous.reload || 0) + 1
			this.device = previous.device// new Device(previous.device) //previous.device
			this.device.reload = this.reload
			console.log("Reload " + this.reload)
		}
		else{
			// lets spawn up a webGL device
			this.device = new Device()
		}

		baseclass.prototype.atConstructor.call(this, previous, parent)
	}

	this.createBus = function(){
		this.bus = new BusClient((location.href.indexOf('https') === 0?'wss://':'ws://')+location.host+location.pathname)
	}


	this.doRender = function(previous, parent){
		baseclass.prototype.doRender.call(this, previous, parent)

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