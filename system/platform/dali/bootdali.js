/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

// Copied from compositionserver.js for dali. This assumes that the
// node server is running on the same machine where dali is running.

define.class(function(require){

console.trace('Loading daliserver', define.$environment);

	// Dali/nodejs interface (nodejs package at top-level of dreemgl repository)
    Dali = require('../../Release/dali');

	// composition_client references WebSocket
	WebSocket = require('$server/nodewebsocket')

	var Render = require('$base/render')

	var path = require('path')
	var fs = require('fs')

	var ExternalApps = require('$server/externalapps')
	var BusServer = require('$rpc/busserver')
	var FileWatcher = require('$server/filewatcher')
	var HTMLParser = require('$parse/htmlparser')
	var ScriptError = require('$parse/scripterror')
	var legacy_support = 0

	this.atConstructor = function(
		args, //Object: Process arguments
		name, //String: name of the composition
		teemserver){ //TeemServer: teem server object

		this.teemserver = teemserver
		this.args = args
		this.name = name

		this.busserver = null;

		this.watcher = new FileWatcher()

	    this.readSystemClasses('$classes', this.system_classes = {})
	    define.system_classes = this.system_classes;

	        //var Device = require('$draw/dali/devicedali')
	        //this.device = new Device();
	    //console.log('**************device', this.device);

		// lets give it a session
		this.session = Math.random() * 1000000

		this.watcher.atChange = function(){
			// lets reload this app
			this.reload()
		}.bind(this)

		this.components = {}
		// lets compile and run the dreem composition
		define.atRequire = function(filename){
			// ignore build output
			if(filename.indexOf(define.expandVariables('$build')) == 0){
				return
			}
			// lets output to the main watcher
			// process.stderr.write('\x0F!'+filename+'\n', function(){})
			this.watcher.watch(filename)
		}.bind(this)
		//
		this.reload()
	}

	// Called when any of the dependent files change for this composition
	this.atChange = function(){
	}

	// Destroys all objects maintained by the composition
	this.destroy = function(){
		if(this.myteem && this.myteem.destroy) this.myteem.destroy()
		this.myteem = undefined
	}

	this.readSystemClasses = function(basedir, out){
		var dir = fs.readdirSync(define.expandVariables(basedir))
		for(var i = 0; i < dir.length; i++){
			var subitem = basedir + '/' + dir[i]
			var stat = fs.statSync(define.expandVariables(subitem))
			if(stat.isDirectory()){
				this.readSystemClasses(subitem, out)
			}
			else{
				var clsname = dir[i].replace(/\.js$/, '')
				if(clsname in out){
					console.log("WARNING DUPLICATE CLASS: " + subitem + " ORIGINAL:" + out[clsname])
				}
				out[clsname] = subitem
			}
		}
	}

	this.reload = function(){
		console.color("~bg~Reloading~~ composition\n")
		this.destroy()

		this.readSystemClasses('$classes', this.system_classes = {})

		// lets fill 
		require.clearCache()

		// ok, we will need to compute the local classes thing
		define.system_classes = this.system_classes
		define.$drawmode = 'dali'

		// lets figure out if we are a direct .js file or a 
		// directory with an index.js 
		var scan = [
			{
				mapped:'$compositions/' + this.name + '/index.js',
				real:'$compositions/' + this.name + '/index.js'
			},
			{
				mapped:'/_external_/' + this.name + '/index.js',
				real:'$external/' + this.name + '/index.js'
			},
			{
				mapped:'$compositions/' + this.name + '.js',
				real:'$compositions/' + this.name + '.js'
			},
			{
				mapped:'/_external_/' + this.name + '.js',
				real:'$external/' + this.name + '.js'
			},
		]

		for(var i = 0; i < scan.length;i++){
			if(fs.existsSync(define.expandVariables(scan[i].real))){
				this.index_mapped = scan[i].mapped
				this.index_real = scan[i].real
				break
			}
		}

		// lets load up the teem nodejs part
		try{
  		    this.screenname = this.name;

			// define global location, but can be undefined.
		    //TODO Where do I get the screen name from; an arg?
			location = undefined;

			console.log('require', this.index_real);
		    var Composition = require(this.index_real)
		    //this.composition = new Composition(this.busserver, this.session)
		    this.composition = new Composition()

		    var CompositionClient = require(define.$base + '/composition_dali')
		    this.compositionclient = new CompositionClient(this.composition);
		}
		catch(e){
		    console.trace("CAUGHT ERROR IN DALISERVER", e);
		    console.log(e.stack)
		}
	}

	this.loadHTML = function(title, boot){
	    return '';
	}

	this.loadTemplate = function(title, boot){
	    console.warn('warning: daliserver.loadTemplate not written');
	    return '';
	}

})