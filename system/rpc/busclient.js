/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// BusClient class, always available auto reconnecting socket

define.class(function(require, exports){

	this.atConstructor = function(url, websocketclass){
		this.websocketclass = websocketclass || WebSocket
		this.url = url || ''
		this.backoff = 1
		this.reconnect()
	}

	this.disconnect = function(){
		if(this.socket){
			this.socket.onclose = undefined
			this.socket.onerror = undefined
			this.socket.onmessage = undefined
			this.socket.onopen = undefined
			this.socket.close()
			this.socket = undefined
		}
	}

	// Reconnect to server (used internally and automatically)
	this.reconnect = function(){
		this.disconnect()
		if(!this.queue) this.queue = []

		this.socket = new this.websocketclass(this.url)

		this.socket.atConnect =
		this.socket.onopen = function(){
			this.backoff = 1
			for(var i = 0;i<this.queue.length;i++){
				this.socket.send(this.queue[i])
			}
			this.queue = undefined
		}.bind(this)

		this.socket.atError =
		this.socket.onerror = function(event){
			this.backoff = 500
		}.bind(this)

		this.socket.atClose =
		this.socket.onclose = function(){
			this.backoff *= 2
			if(this.backoff > 1000) this.backoff = 1000
			setTimeout(function(){
				this.reconnect()
			}.bind(this),this.backoff)
		}.bind(this)

		this.socket.atMessage = function(imsg){
			if(typeof imsg === 'object') console.log(new Error().stack)
			var msg = JSON.parse(imsg)
			this.atMessage(msg, this)
		}.bind(this)

		this.socket.onmessage = function(event){
			var msg = JSON.parse(event.data)
			this.atMessage(msg, this)
		}.bind(this)
	}

	
	// Send a message to the server
	this.send = function(msg){
		msg = JSON.stringify(msg)
		if(this.queue) this.queue.push(msg)
		else this.socket.send(msg)
	}

	// Causes a console.color on the server
	this.color = function(data){
		this.send({type:'color', value:data})
	}

	// Causes a console.log on the server
	this.log = function(data){
		this.send({type:'log', value:data})
	}

	// Called when a message is received
	this.atMessage = function(message){}
})