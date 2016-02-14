/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others. 
	 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
	 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$system/base/compositionclient', function(require, baseclass){

	var Device = require('$system/platform/$platform/device$platform')
	var WebRTC = require('$system/rpc/webrtc')
	var BusClient = require('$system/rpc/busclient')

	HeadlessApi = require('./headless_api')


	this.atConstructor = function(previous, parent){
		//TODO
		previous = null
		parent = null

		if(previous){
			this.reload = (previous.reload || 0) + 1
			this.device = previous.device// new Device(previous.device) //previous.device
			this.device.reload = this.reload
			console.log("Reload " + this.reload)
		}
		else{
			// lets spawn up a device
			this.device = new Device()
		}

		baseclass.atConstructor.call(this, previous, parent)

			//Render the display
			this.doRender();
	}

	this.createBus = function(){
		if (HeadlessApi.verbose)
			console.log('compositionheadless.createBus is NOT implemented');
		this.bus = {
			send: function() {}
		};
	}


	this.doRender = function(previous, parent){
		baseclass.doRender.call(this, previous, parent)
	}

})
