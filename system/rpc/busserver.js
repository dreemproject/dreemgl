/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// BusServer class, a package of websockets you can broadcast on (server side)

define.class(function(require, exports){

	this.atConstructor = function(){
		this.sockets = []
	}

	// adds a WebSocket to the BusServer
	this.addWebSocket = function(sock){
		this.sockets.push(sock)

		sock.atEnd = function(){
			this.sockets.splice(this.sockets.indexOf(sock), 1)
			sock.onEnd = undefined
		}.bind(this)

		sock.atMessage = function(message){
			this.atMessage(JSON.parse(message), sock)
		}.bind(this)

		this.atConnect(sock)
	}

	// called when a new message arrives
	this.atMessage = function(message, socket){
	} 

	// Called when a new socket appears on the bus
	this.atConnect = function(message, socket){
	}

    // Send a message to all connected sockets
	this.broadcast = function(message, ignore){
		message = JSON.stringify(message)
		for(var i = 0;i<this.sockets.length;i++){
			var socket = this.sockets[i]
			if(socket !== ignore) socket.send(message)
		}
	}

	// close all sockets
	this.closeAll = function(){
		for(var i = 0; i < this.sockets.length; i++){
			this.sockets[i].close()
		}
		this.sockets = []
	}
})