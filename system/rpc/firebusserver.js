/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/
// BusServer class, a package of websockets you can broadcast on (server side)

define.class(function(require, exports){

	var firebase = require("firebase");

	// Initialize the app with a service account, granting admin privileges
	firebase.initializeApp({
		databaseURL: "https://dreembase.firebaseio.com/",
		serviceAccount: __dirname + "/firebase.json"
	});

	this.atConstructor = function(channel){
		this.clients = {}

		this.db = firebase.database();

		var q = this.q = this.db.ref("serverQ/" + channel);
		q.on('child_added', function(msg) {
			var message = msg.val()
			msg.ref.remove()
			var clientid = message.clientid;
			var data = JSON.parse(message.payload)
			var client = this.clients[clientid];
			this.atMessage(data, client)
		}.bind(this))

		var connections = this.connections = this.db.ref("clients/" + channel);
		connections.on('child_added', function(snapshot) {
			var clientid = snapshot.key
			var connection = snapshot.val()
			snapshot.ref.remove()

			var clientQ = this.db.ref("clientQ" + clientid)
			clientQ.sendJSON = function(payload) {
				this.push({payload:JSON.stringify(payload)})
			}.bind(clientQ)
			clientQ.readyState = 1

			this.clients[clientid] = clientQ;
			this.atConnect(clientQ)
		}.bind(this));

	}

	// called when a new message arrives
	this.atMessage = function(message, socket){
		console.log("atMessage firebuserver not implemented", message, socket)
	}

	// called when a client disconnects
	this.atClose = function(socket){
		console.log("atClose firebuserver not implemented", socket)
	}

	// Called when a new socket appears on the bus
	this.atConnect = function(message, socket){
		console.log("atConnect firebuserver not implemented", message, socket)
	}

	this.broadcast = function(message, ignore){
		for(var i = 0;i<this.clients.length;i++){
			var socket = this.clients[i]
			if (socket.sendJSON) {
				if (!ignore || socket.key !== ignore.key) {
					socket.sendJSON(message)
				}
			}
		}
	}

	this.closeAll = function(){
		for(var i = 0; i < this.clients.length; i++){
			var client = this.clients[i];
			console.log("closeAll firebuserver not implemented", client)
		}
		this.clients = []
	}
})
