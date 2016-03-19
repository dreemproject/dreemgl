/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$system/platform/webgl/workerwebgl', function(require, exports){
 	var rpchub = require('$system/rpc/rpchub')
 	var NodeWebsocket = require('$system/server/nodewebsocket')

 	var child_process = require('child_process')
 	var crypto = require('crypto')
 	var fs = require('fs')

	this._startWorkers = function(head, tail, count){

		if(!count) count = 1
		var source = head + '\n\n\n;// Worker includes \nglobal.define = {packaged:true,$platform:"nodegl"};(' + define.inner.toString() + ')();\n'
		source += '(' + define.getModule('$system/base/math.js').factory.toString() + ')();\n'
		var paths = ''
		for(var key in define.paths){
			paths += 'define.$'+key + ' = "'+define['$'+key]+'";\n'
		}
		//console.log(paths)
		source += paths
		source += tail

		var shasum = crypto.createHash('sha1').update(source).digest('hex');

		var path = define.mapToCacheDir('/'+shasum)

		fs.writeFileSync(path, source)

		// lets startup a worker process
		var workers = []
		for(var i = 0; i < count; i ++){

			var subarg = [path]
			var stdio = [process.stdin, process.stdout, process.stderr, 'pipe']
			var child = child_process.spawn(process.execPath, subarg, {
				stdio: stdio
			})

			var sock = new NodeWebsocket(child.stdio[3])
			sock.makeJSONSocket()

			child.on('close', function(code){
			}.bind(this))

			sock.child_process = child

			workers.push(sock)
		}
		return workers
	}

	this._atConstructor = function(cores){
		if(cores === undefined) cores = 1
		else if(cores < 1){
			if(define.cputhreads === 2) cores = 1
			else cores = define.cputhreads - 2
		}
		//var sockets = require('$system/server/nodewebsocket').module.factory
		//console.log(sockets)
		var deps = this._collectDeps(this.constructor.module.factory, [define.expandVariables('$system/server/nodewebsocket'),define.expandVariables("$system/base/worker")])
		var head = 'var _myworker = ' + this.constructor.body.toString() + ';\n'
		var tail = ''

		tail += 'define.packagedClass("/myworker.js",["$system/base/worker",_myworker]);\n'
		//tail += '_worker.postMessage = function(msg,transfer){self.postMessage({message:msg,workerid:_worker.workerid},transfer)};\n'
		for(var key in deps){
			tail += deps[key]
		}
	//	tail += 'var _worker = define.require(\'/myworker\')();\n'
		tail += ';(' + worker_boot.toString() + ')();\n'
		// start all workers
		this._workers = this._startWorkers(head, tail, 1)

		this._transformThisToRPC()

		function worker_boot(){
			var net = require('net')
			var worker = define.require('/myworker')()
			var NodeWebsocket = define.require("$system/server/nodewebsocket")
			var io = new net.Socket({fd:3})
			var sock = worker._socket = new NodeWebsocket(io)
			sock.makeJSONSocket()

			worker.postMessage = function(msg){
				sock.sendJSON({message:msg})
			}

			sock.atJSONMessage = function(msg){
				if(msg.initid){
					worker.workerid = msg.workerid
					return
				}
				if(msg.message){
					worker.onmessage(msg.message)
					return
				}

				var ret = worker[msg.name].apply(worker, msg.args);
				if(ret && ret.then) ret.then(function(value){
					sock.sendJSON({value:value, uid:msg.uid, workerid:msg.workerid})
				})
				else sock.sendJSON({value:ret, uid:msg.uid, workerid:msg.workerid})
			}
		}
		
		for(var i = 0; i < this._workers.length; i++){
			// incoming messages
			this._workers[i].postMessage = function(msg){
				this.sendJSON(msg)
			}

			this._workers[i].atJSONMessage = function(data){
				if(data.message){
					return this.onmessage(data.message)
				}
				var workerid = data.workerid
				
				this._workers[workerid].stack --
				this._resolveReturn(data)
			}.bind(this)
		}

		this.postMessage = function(msg, transfer, tgtid){
			// post to a worker
			var workerid = tgtid || 0
			this._workers[workerid].postMessage({message:msg})
		}	
	}
})
