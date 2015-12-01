/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// RunMonitor class executes ourselves as a subprocess, receives the dependency file names
// from the child process and manages restart/killing when files change

define.class(function(require){

	var FileWatcher = require('./filewatcher')
	var ExternalApps = require('./externalapps')
	var child_process = require('child_process')

	this.atConstructor = function(args){

		this.args = args
		this.restart_count = 0

		this.watcher = new FileWatcher()
		this.only_when_down = {}

		this.watcher.atChange = function(file){
			//if(args['-nodreem'] && file.indexOf('dreem.js') != -1) return
			
			// lets restart this.child
			if(this.child){
				if(this.only_when_down[file]) return
				console.color('~g~Got filechange: ~y~'+file+'~~ killing and restarting server\n')
				this.child.kill('SIGHUP')
				setTimeout(function(){
					if(this.child) this.child.kill('SIGTERM')
				}.bind(this), 50)
			}
			else{
				console.color('~g~Got filechange: ~y~'+file+'~~ starting server\n')
				this.start()
			}
		}.bind(this)
		this.start()
	}

	// When in infinite restart loop, wait atleast this long (ms)
	this.restart_delay = 1000

	this.start = function(){
		var subarg = process.argv.slice(1)
		subarg.push('-nomoni')
		subarg.push('-count')
		subarg.push(this.restart_count++)
		subarg.unshift('--harmony')

		var stdio = [process.stdin, process.stdout,'pipe']
		this.was_exception = false
		this.watcher.watch(subarg[1])

		this.child = child_process.spawn(process.execPath, subarg, {
			stdio: stdio
		})

		this.child.stderr.on('data', function(buf){
			// we haz exception, wait for filechange
			var data = buf.toString()
			if(data.indexOf('\x0F')!= -1){
				var files = data.split('\x0F')
				for(var i = 0;i<files.length;i++){
					var file = files[i].replace(/\n/,'')
					if(file){
						if(file.charAt(0) == '!'){
							file = file.slice(1)
							this.only_when_down[file] = 1
						}
						this.watcher.watch(file)
					}
				}
				return
			}

			this.was_exception = data.indexOf('\0xE')!= -1? false: true
			var m = data.match(/(\/[^\:]+)\:(\d+)\n/)
			var ln = data.split(/\n/)
			if(m){ // open error in code editor
				if(this.args['-notify']) ExternalApps.notify(ln[1]+'\n'+ln[2],ln[3])
				if(this.args['-edit']) ExternalApps.editor(m[1],m[2])
			}
			process.stdout.write(data)
		}.bind(this))

		this.child.on('close', function(code){
			// lets have a start per second
			this.child = undefined
			if(this.was_exception && !this.args['-restart']) return console.log("Exception detected, not restarting")
			if(Date.now() - this.last >= this.restart_delay){
				this.start()
			}
			else{
				setTimeout(function(){
					this.start()
				}.bind(this), this.restart_delay)
			}
		}.bind(this))
	}
})