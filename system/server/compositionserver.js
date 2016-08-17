/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

// parse a color string into a [r,g,b] 0-1 float array

define.class(function(require){

	var fs = require('fs')

	var FileWatcher = require('./filewatcher')

	this.atConstructor = function(
		args, //Object: Process arguments
		compname, //String: name of the composition
	    options) { //Object: config options

		if (!options) {
			options = {}
		}

		this.options = options
	 	this.args = args
		this.compname = compname

		var BusServer;
		if (this.options.busclass) {
			BusServer = require(this.options.busclass)
		} else {
			BusServer = require('$system/rpc/busserver')
		}

		this.busserver = new BusServer(compname)

		// lets give it a session
		this.session = Math.random() * 1000000

		this.components = {}

		this.paths = ""
		this.pathset = '{'

		for(var key in define.paths){
			if(this.paths) {
				this.paths += ',\n\t\t'
				this.pathset += ','
			}
			this.paths += '$'+key+':"$root/'+key+'"'
			this.pathset += '"'+key+'":1'
		}
		this.pathset += '}'

		// If files are not being served remorely, watch them for changes
		if (this.options.serveremote !== true) {
			this.slow_watcher = new FileWatcher()
			this.slow_watcher.atChange = function(){
				// lets reload this app
				this.reload()
			}.bind(this)
			// lets compile and run the dreem composition
			define.atRequire = function(filename){
				this.slow_watcher.watch(filename)
			}.bind(this)
		}

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
		console.log("Reloading composition "+this.filename)
		require.clearCache()
		var file = define.expandVariables(this.filename)
		var Composition = require(file) //TODO: xxx needs method to load from remote source, not just file system?
		this.composition = new Composition(this.busserver, this.session, this.composition)
	}

	this.reload = function(){
		this.destroy()

		// lets fill
		require.clearCache()

		this.title = define.fileName(this.compname)
		// lets see if our composition is a dir or a jsfile
		var jsname = this.compname+'.js'
		try{
			if(fs.existsSync(define.expandVariables(jsname))){
				this.filename = jsname
				return this.loadComposition()
			}
			else{
				var jsname = this.compname + '/index.js'
				if(fs.existsSync(define.expandVariables(jsname))){
					this.filename = jsname
					return this.loadComposition()
				}
			}
		}
		catch(e){
			console.log(e.stack)
		}
		finally{
		}
	}

	this.loadHTML = function(title, boot, paths, pathset){

		// These rpc attributes we will write directly into the header so that they are available even before the screen connects
		var preloadattrs = {};

		var additionalHeader = "";

		if (this.composition) {

			// preload_rpc_attributes can be `true` to include everything or an array of `rpcobj_rpcattr` identifiers
			var preload = this.composition.preload_rpc_attributes;
			if (preload === true) {
				preloadattrs = this.composition.server_attributes;
			} else if (Array.isArray(preload)) {
				for (var i = 0; i< preload.length;i++) {
					var key = preload[i];
					var attr = this.composition.server_attributes[key];
					if (attr) {
						preloadattrs[key] = attr
					}
				}
			}
			additionalHeader = this.composition.headHTML || "";
		}

		var additionalScripts = ""
		var additionalDefines = ""

		if (this.options) {
			if (this.options.scripts) {
				for (var s = 0; s < this.options.scripts.length;s++) {
					var scriptURL = this.options.scripts[s]
					additionalScripts += '<script src="' + scriptURL + '"></script>\n'
				}
			}

			if (this.options.clientdefines) {
				for (var defkey in this.options.clientdefines) {
					var defval = this.options.clientdefines[defkey]
					if (typeof (defval) === 'string') {
						defval = '"' + defval +'"'
					}

					additionalDefines += '$' + defkey + ':' + defval + ',\n'
				}
			}
		}

		return '<html lang="en">\n'+ //TODO: xxx make this a template loadable from options
			' <head>\n'+
			'  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n'+
			'  <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">\n'+
			'  <meta name="apple-mobile-web-app-capable" content="yes">\n'+
			'  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n'+
			'  <meta name="format-detection" content="telephone=no">\n'+
			'  <title>' + title + '</title>\n'+
			'  <style>\n'+
			'    .unselectable{\n'+
			' 		-webkit-user-select: none;\n'+
  			'		-moz-user-select: none;\n'+
  			'		-user-select: none;\n'+
  			'    }\n'+
			'    body {background-color:white;margin:0;padding:0;height:100%;overflow:hidden;}\n'+
			'  </style>\n'+
			additionalScripts +
			'  <script type="text/javascript">\n'+
			'    window.define = {\n'+
			additionalDefines +
			'	   $platform:"webgl",\n'+
			'      paths:'+pathset+',\n'+
			'     '+paths+',\n'+
			'      main:["$system/base/math", "' + boot + '"],\n'+
			'      atMain:function(require, modules){\n'+
			'        define.endLoader()\n'+
			'		 require(modules[0])\n'+
			'		 var Composition = require(modules[1])\n'+
			'		 var serverattrs = ' + JSON.stringify(preloadattrs) + '\n'+
			'		 var renderTarget;' + '\n'+
			'        define.rootComposition = new Composition(define.rootComposition, undefined, serverattrs, renderTarget)\n'+
			'      },\n'+
			'	   atEnd:function(){\n'+
			'         define.startLoader()\n'+
			'      }\n'+
			'    }\n'+
			'  </script>\n'+
			'  <script type="text/javascript" src="/system/base/define.js"></script>\n'+
			additionalHeader +
			' </head>\n'+
			' <body class="unselectable">\n'+
			' </body>\n'+
			'</html>\n'
	}

	this.request = function(req, res){
		if(req.method == 'POST' && (define.$unsafeorigin || (this.options && this.options.whitelist))){
			// lets do an RPC call

			if(!define.$unsafeorigin && this.options.whitelist.indexOf(req.headers.origin) === -1){
				console.log("WRONG ORIGIN POST API RECEIVED.  " + req.headers.origin + " not in:", this.options.whitelist)
				res.end()
				return false
			}

			var boundary;
			if (req.headers && req.headers['content-type']) {
				var type = req.headers['content-type'];
				if (type) {
					var m = /^multipart\/form-data; boundary=(.*)$/.exec(type)

					if (m) {
						boundary = m[1];
					}
				}
			}

			var buffer;
			req.on('data', function(data){
				if (boundary) {
					if (!buffer) {
						buffer = new Buffer(data)
					} else {
						buffer = Buffer.concat([buffer, data])
					}
				}
			})
			req.on('end', function() {

				if (boundary && buffer && buffer.indexOf) {

					var cursor = buffer.indexOf(boundary) + boundary.length;

					cursor = buffer.indexOf("filename=", cursor) + "filename=".length;
					var q = buffer[cursor];
					var filename = buffer.slice(cursor + 1, buffer.indexOf(q, cursor + 1)).toString();
					cursor = buffer.indexOf("\r\n\r\n", cursor) + "\r\n\r\n".length;

					var filedata = buffer.slice(cursor, buffer.indexOf("\r\n--" + boundary));

					var compfile = this.composition.constructor.module.filename;
					var compdir = compfile.substring(0, compfile.lastIndexOf('/'));

					filename = compdir + "/" + filename.replace(/[^A-Za-z0-9_.-]/g,'');

					if (!define.$writefile){
						console.log("writefile api disabled, use -writefile to turn it on. Writefile api is always limited to localhost origins.")
						res.writeHead(501);
					} else {
						try{
							var fullname = define.expandVariables(filename);
							fs.writeFile(fullname, filedata);
							console.log("[UPLOAD] Wrote", filedata.length, "bytes to", fullname);
							res.writeHead(200);
						}
						catch(e){
							res.writeHead(503);
						}
					}

					res.end();
				} else if (buffer) {
					try{
						var json = JSON.parse(buffer.toString())
						this.composition.postAPI(json, {send:function(msg){
							res.writeHead(200, {"Content-Type":"text/json"})
							res.write(JSON.stringify(msg))
							res.end()
						}})
					}
					catch(e){
						res.writeHead(500, {"Content-Type": "text/html"})
						res.write('FAIL')
						res.end()
					}
				} else {
					res.writeHead(500, {"Content-Type": "text/html"})
					res.write('FAIL')
					res.end()
				}
			}.bind(this))
			return
		}

		var header = {
			"Cache-control": "max-age=0",
			"Content-Type": "text/html"
		}

		// nodejs root
		if(req.headers['client-type'] === 'nodejs'){
			res.writeHead(200, {"Content-type":"text/json"})
			res.write(JSON.stringify({title:this.title, boot:this.filename, paths:define.paths }))
			res.end()
			return
		}

		if (!this.filename) {
			res.writeHead(404, header)
			res.write('<body>Sorry, we could not find an application at that URL. <a href="/docs/api/index.html">Try reading the documentation?</a></body>')
			res.end()
			return
		}
		var html = this.loadHTML(this.title, this.filename, this.paths, this.pathset)
		res.writeHead(200, header)
		res.write(html)
		res.end()
	}
})
