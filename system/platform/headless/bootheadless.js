/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

// Copied from compositionserver.js for headless. This assumes that the
// node server is running on the same machine where headless is running.

define.class(function(require){
	//internal


	// composition_client references WebSocket
	//WebSocket = require('$system/base/nodewebsocket')

	//var Render = require('$system/platform/render')

	var path = require('path')
	var fs = require('fs')

	var ExternalApps = require('$system/server/externalapps')
	var FileWatcher = require('$system/server/filewatcher')

	var BusServer = require('$system/rpc/busserver')
	var HTMLParser = require('$system/parse/htmlparser')
	var ScriptError = require('$system/parse/scripterror')
	var legacy_support = 0

	this.atConstructor = function(
		args, //Object: Process arguments
		compname, //String: name of the composition
		rootserver){ //TeemServer: teem server object

		// Headless stage settings (from command-line), or defaults
		this.width = parseInt(args['-width']) || 1920;
		this.height = parseInt(args['-height']) || 1080;
		this.name = args['-name'] || 'dreemgl';
		this.verbose = ('-verbose' in args);

		if ('-dumpstate' in args) {
			var ds = args['-dumpstate'];
			this.dumpstate = (ds.length > 0) ? args['-dumpstate'] : 'stdout';
		}



		// The duration (msec) of the test. 0 = render once and stop
		this.duration = parseInt(args['-duration']) || 0;

		if (this.verbose)
			console.log('Loading environment', define.$environment);

		this.args = args
		this.compname = compname
		this.rootserver = rootserver

		this.busserver = new BusServer()
		//this.busserver = null;

		// lets give it a session
		this.session = Math.random() * 1000000

		this.slow_watcher = new FileWatcher()

		this.slow_watcher.atChange = function(){
			// lets reload this app
			this.reload()
		}.bind(this)


			//this.readSystemClasses('$classes', this.system_classes = {})
			//define.system_classes = this.system_classes;

		this.components = {}

		this.paths = ""
		for(var key in define.paths){
			if(this.paths) this.paths += ',\n\t\t'
			this.paths += '$'+key+':"$root/'+key+'"'
		}

		// lets compile and run the dreem composition
		define.atRequire = function(filename){
			this.slow_watcher.watch(filename)
		}.bind(this)
		//
		this.reload()
	}

	// Called when any of the dependent files change for this composition
	this.atChange = function(){
	}

	// Destroys all objects maintained by the composition
	this.destroy = function(){
		if(this.mycomposition && this.mycomposition.destroy) this.mycomposition.destroy()
		this.mycomposition = undefined
	}

	this.loadComposition = function(){
		if (this.verbose)
			console.log("Reloading composition "+this.filename)
		require.clearCache()

		this.HeadlessApi = require('./headless_api');
		this.HeadlessApi.initialize({width: this.width, height: this.height, name: this.name, duration: this.duration, verbose: this.verbose, dumpstate: this.dumpstate});

		var Composition = require(define.expandVariables(this.filename))
		this.composition = new Composition(this.busserver, this.session)
	}

	this.reload = function(){
		this.destroy()

		// lets fill
		require.clearCache()

		// lets see if our composition is a dir or a jsfile
		var dir = '$root/'
		var jsname = dir + this.compname+'.js'
		try{
			if(fs.existsSync(define.expandVariables(jsname))){
				this.filename = jsname
				return this.loadComposition()
			}
			else{
				var jsname = dir + this.compname + '/index.js'
				if(fs.existsSync(define.expandVariables(jsname))){
					this.filename = jsname
					return this.loadComposition()
				}
			}
		}
		finally{
			//console.log(e.stack)
		}

		this.screenname = this.compname;

		// Reaching here indicates the path does not exist
		console.log('bootheadless.reload: Unable to load', jsname);
}

	this.loadHTML = function(title, boot){
			return '';
	}

	this.loadTemplate = function(title, boot){
			console.warn('warning: bootheadless.loadTemplate not written');
			return '';
	}

})
