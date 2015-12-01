/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// this class

define.class('$base/composition_client', function(require, baseclass){

	var Device = require('$system/draw/$platform/device$platform')
	var BusClient = require('$system/rpc/busclient')
	var NodeWebSocket = require('$system/server/nodewebsocket')

	this.atConstructor = function(previous, parent, baseurl){
		this.baseurl = baseurl
		if(previous){
			this.reload = (previous.reload || 0) + 1
			this.device = new Device(previous.device) //previous.device
			console.log("Reload " + this.reload)
		}
		else{
			// lets spawn up a webGL device
			this.device = new Device()
		}

		baseclass.prototype.atConstructor.call(this)
	}

	this.createBus = function(){
		this.bus = new BusClient(this.baseurl, NodeWebSocket)
	}

})
