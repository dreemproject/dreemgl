/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/
// BusClient class, always available auto reconnecting socket

define.class(function(require, exports){

	this.atConstructor = function(url){
		this.url = url || ''
	}

	this.connect = function() {

		firebase.initializeApp({ //xxx
			apiKey: "AIzaSyDAsFR7KNvqOxBv3go8qWb1y7YRMwaw22U",
			authDomain: "dreembase.firebaseapp.com",
			databaseURL: "https://dreembase.firebaseio.com",
			storageBucket: "dreembase.appspot.com"
		});

		var db = this.db = firebase.database();

		this.clients = db.ref("clients");

		this.reconnect()
	}

	this.disconnect = function(){

		if (this.clientid) {
			console.log("disconnect fbcleint", this.clientid)
			this.db.ref().child("clientQ" + this.clientid).remove()
			this.clientid = undefined
		}
	}

	this.sendJSON = this.send = function(msg){
		console.log("sssend fbcleint", msg)

		var packet = {
			client: this.clientid,
			payload: JSON.stringify(msg)
		}

		console.log("sending packet", packet)

		this.out.push(packet)
	}

	// Reconnect to server (used internally and automatically)
	this.reconnect = function(){
		this.disconnect()
		if(!this.queue) this.queue = []

		var clientid = this.clientid = this.clients.push({url:this.url}).key

		console.log("clientID", clientid)

		this.out = this.db.ref().child("serverQ");

		this.messages = this.db.ref("clientQ" + clientid)
		this.readyState = 1

		this.messages.on("child_added", function(snap) {
			var msg = snap.val()
			snap.ref.remove()
			console.log("client got incoming message", msg.key, msg)
			this.atMessage(msg, this)
		}.bind(this))

		console.log("fbcleitn reconnect")

	}

	// Called when a message is received
	this.atMessage = function(message){
		console.log("fbclient atmessage XX", message)
	}
})
