/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/
// BusClient class, always available auto reconnecting socket

define.class(function(require, exports){

	this.atConstructor = function(url, websocketclass){
		this.websocketclass = websocketclass || WebSocket
		this.url = url || ''
		this.backoff = 1
		this.reconnect()
	}

	this.use_xhr_fallback_for_binary = true
	this.socket_use_blob_send = true

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

		if (define.$disableserver === true) {
			return
		}

		this.socket = new this.websocketclass(this.url)

		this.socket.binaryType = 'arraybuffer'

		this.socket.onopen = function(){
			this.backoff = 1
			for(var i = 0;i<this.queue.length;i++){
				this.socket.send(this.queue[i])
			}
			this.queue = undefined
		}.bind(this)

		this.socket.onerror = function(event){
			this.backoff = 500
		}.bind(this)

		this.socket.onclose = function(){
			this.backoff *= 2
			if(this.backoff > 1000) this.backoff = 1000
			setTimeout(function(){
				this.reconnect()
			}.bind(this),this.backoff)
		}.bind(this)

		if(this.use_xhr_fallback_for_binary){
			var binary_xhr = []

			this.socket.onmessage = function(event){

				// if its huuuge and value has escaped json, dont parse it
				var data = event.data
				if(data.charAt(0) === '$'){
					binary_xhr.push(new define.Promise(function(resolve, reject){
						// lets XHR download it
						var xhr = new XMLHttpRequest()
						xhr.open('GET', '/binrpc?'+data.slice(1), true);
						xhr.responseType = 'arraybuffer'
						xhr.onload = function(e) {
							resolve(xhr)
						}
						xhr.upload.onprogress = function(e){
						}
						xhr.send()
					}))
					return
				}
				var bin_xhr = binary_xhr
				binary_xhr = []

				var msg = JSON.parse(data)
				if(bin_xhr.length){
					define.Promise.all(bin_xhr).then(function(results){
						var out = []
						for(var i = 0; i < results.length; i++){
							out[i] = results[i].response
						}
						msg = define.structFromJSON(msg, out)
						this.atMessage(msg, this)
					}.bind(this))
				}
				else{
					// lets retrieve the missing binary blobs via XHR
					msg = define.structFromJSON(msg)
					this.atMessage(msg, this)
				}
			}.bind(this)

			function rndhex4(){ return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) }

			this.send = function(msg){
				var binary = []
				var newmsg = define.makeJSONSafe(msg, binary)
				var allbin = []

				for(var i = 0; i < binary.length; i++){
					var data = binary[i].data
					var blobmsg = new Blob([data.buffer], {type: 'application/octet-binary'})

					var rpcrandom = rndhex4()+rndhex4()+rndhex4()+rndhex4()+rndhex4()+rndhex4()+rndhex4()+rndhex4()
					allbin.push(new define.Promise(function(resolve, reject){
						var xhr = new XMLHttpRequest()
						xhr.open('POST', '/binrpc?'+rpcrandom, true);
						xhr.onload = function(e) {
							resolve()
						}
						//xhr.upload.onprogress = function(e){
						//}
						xhr.send(blobmsg)
					}))
					if(this.queue) this.queue.push('$'+rpcrandom)
					else this.socket.send('$'+rpcrandom)
				}

				var jsonmsg = JSON.stringify(newmsg)

				if(this.queue) this.queue.push(jsonmsg)
				else {
					define.Promise.all(allbin).then(function(){
						this.socket.send(jsonmsg)
					}.bind(this))
				}
			}

		}
		else{
			var binary_buf = []
			this.socket.onmessage = function(event){
				// if its huuuge and value has escaped json, dont parse it
				var data = event.data
				if(data instanceof ArrayBuffer){
					binary_buf.push(event.data)
					return
				}
				// lets retrieve the missing binary blobs via XHR
				var msg = define.structFromJSON(JSON.parse(data), binary_buf)
				this.atMessage(msg, this)
			}.bind(this)

			this.send = function(msg){
				var binary = []
				var newmsg = define.makeJSONSafe(msg, binary)

				for(var i = 0; i < binary.length; i++){
					var data = binary[i].data
					var datamsg =
						this.socket_use_blob_send?
							new Blob([data.buffer], {type: 'application/octet-binary'}):
							data.buffer

					//var binmsg = binary[i+1]
					if(this.queue) this.queue.push(datamsg)
					else this.socket.send(datamsg)
				}

				var jsonmsg = JSON.stringify(newmsg)
				if(this.queue) this.queue.push(jsonmsg)
				else this.socket.send(jsonmsg)
			}
		}
	}

	// Called when a message is received
	this.atMessage = function(message){}
})
