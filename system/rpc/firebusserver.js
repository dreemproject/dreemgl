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

	this.atConstructor = function(){
		this.clients = {}

		this.db = firebase.database();

		this.db.ref().once("value", function(s){
			console.log("loks like", s.val())
		})

		var q = this.q = this.db.ref("serverQ");
		q.on('child_added', function(msg) {
			var message = msg.val()
			msg.ref.remove()
			console.log("incoming message:", message)
			var clientid = message.client;
			var data = JSON.parse(message.payload)
			var client = this.clients[clientid];
			this.atMessage(data, client)
		}.bind(this))

		var connections = this.connections = this.db.ref("clients");
		connections.on('child_added', function(snapshot) {
			var clientid = snapshot.key
			var connection = snapshot.val()
//			snapshot.ref.remove()

			console.log("got connection", clientid, connection)

			var clientQ = this.db.ref("clientQ" + clientid)
			clientQ.sendJSON = clientQ.push
			clientQ.readyState = 1

			this.clients[clientid] = clientQ;
			this.atConnect(clientQ)

			// var messages = this.messages = this.db.ref().child("serverQ");
			// messages.on('child_added', function(ss) {
			// 	var message = ss.val()
			// 	var cid = ss.ref.parent.key;
			// 	console.log('cid', cid)
			// 	var clientQ = this.db.ref("clientQ/" + cid)
			// 	clientQ.sendJSON = clientQ.push
			// 	ss.ref.remove()
            //
			// 	console.log("got qmessage FROM>", "FOR>", cid, message)
            //
			// 	this.atMessage(message, clientQ)
			// }.bind(this));
            //
			// var clientQ = this.db.ref().child("clientQ/" + clientid)

		}.bind(this));

	}

	// called when a new message arrives
	this.atMessage = function(message, socket){
		console.log("at message fbserver", message, socket)
	}

	// called when a client disconnects
	this.atClose = function(socket){
		console.log("at close fbserver", socket)
	}

	// Called when a new socket appears on the bus
	this.atConnect = function(message, socket){
		console.log("at connect fbserver", message, socket)
	}

	this.broadcast = function(message, ignore){
		for(var i = 0;i<this.clients.length;i++){
			var socket = this.clients[i]
			if (socket.sendJSON) {
				if (!ignore || socket.key !== ignore.key) {
					console.log("broadcast fbserver", socket.key, message)
					socket.sendJSON(message)
				}
			}
		}
	}

	this.closeAll = function(){
		console.log("close all fbserver XXXXX")
		for(var i = 0; i < this.clients.length; i++){
			var socket = this.clients[i];
		}
		this.clients = []
	}
})


//
// // Initialize the app with a service account, granting admin privileges
// firebase.initializeApp({
// 	databaseURL: "https://dreembase.firebaseio.com/",
// 	serviceAccount: __dirname + "/firebase.json"
// });
//
// var db = firebase.database();
// var ref = db.ref("messages");
//
// ref.on('value', function(snapshot) {
// 	console.log("is, ", snapshot.val());
// })
//
// //ref.set({foo:"bar"});
// ref.once("value", function(snapshot) {
// 	console.log(">>>", snapshot.val());
// });
//
// var screenData = {
// 	name: "default"
// };
//
// setInterval(function () {
// 	ref.push({data:"connect"})
// 	ref.push({data:"connect"})
// 	ref.push({data:"connect"})
// 	ref.push({data:"connect"})
// }, 2000)
