/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$system/base/compositionclient', function(require, baseclass){

	var Device = require('$system/platform/$platform/device$platform')
	var BusClient = require('$system/rpc/busclient')
	var NodeWebSocket = require('$system/server/nodewebsocket')

	// Override from compositionclient. Returns the screen name from the url.
	// compositionclient assumes a browser (ie. the location object exists)
	this.screenForClient = function() {
		// console.log('screenForClient', this.query);
		return this.query;
	};

	this.atConstructor = function(previous, parent, baseurl){
		console.log('compositiondali', previous, parent, baseurl);

		// baseurl can contain a screen name. Remove query parameters and
		// store as this.query
		this.baseurl = baseurl;
		var pos = this.baseurl.indexOf('?');
		if (pos >= 0) {
			this.query = this.baseurl.substring(pos+1);
			this.baseurl = this.baseurl.substring(0, pos);
		}

		//TODO
		//previous = null
		//parent = null

		if(previous){
			this.reload = (previous.reload || 0) + 1
			this.device = new Device(previous.device) //previous.device
//			this.device = previous.device// new Device(previous.device) //previous.device
			this.device.reload = this.reload
			console.log("Reload " + this.reload)
		}
		else{
			// lets spawn up a device
			this.device = new Device()
		}

		//baseclass.atConstructor.call(this, previous, parent)
		baseclass.atConstructor.call(this)
		this.screen._size = this.device.size

	    //Render the display
	    this.doRender();
	}

	this.createBus = function(){
		// Only create the bus if baseurl defined (ie. running from remote server)
		if (this.baseurl) {
			console.log('createBus', this.baseurl);
			this.bus = new BusClient(this.baseurl, NodeWebSocket)
		}
		else {
			// Stub out rpc when running locally
			console.log('compositiondali.createBus is NOT implemented when running locally');
			this.bus = {
				send: function() {}
			};
		}
	}


	this.doRender = function(previous, parent){
		baseclass.doRender.call(this, previous, parent)

/*  webgl
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
*/
	}

})
