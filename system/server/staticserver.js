/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

// parse a color string into a [r,g,b] 0-1 float array

define.class(function(require){

	var fs = require('fs')
	var path = require('path')

	this.atConstructor = function(
		compname, //String: name of the composition
		options){ //TeemServer: teem server object

		if (!options) {
			options = {}
		}

		this.compname = compname

		this.rootdir = path.normalize(__dirname + "/../..")

		//xxx root server is now gone, deal with options

		// lets give it a session
		this.session = (Math.random() * 1000000).toString()

		var BusServer = require(options.busclass || '$system/rpc/firebusserver')
		this.busserver = new BusServer(compname.replace(/[\.\/$]/g, "_"))

		this.components = {}

		this.paths = ""
		this.pathset = '{'

		for(var key in define.paths){
			if (this.paths) {
				this.paths += ',\n\t\t'
				this.pathset += ','
			}
			this.paths += '$'+key+':"$root/'+key+'"'
			this.pathset += '"'+key+'":1'
		}
		this.pathset += '}'

		if (typeof(options.init) === "function") {
			options.init.call(this)
		}

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
		console.log("Reloading composition " + this.filename)
		require.clearCache()
		var Composition = require(define.expandVariables(this.filename)) //xxx load from external source, not just file system?
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


		return '<html lang="en">\n'+ //xxx make template
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
			'  </style>'+
			'<script src="https://www.gstatic.com/firebasejs/3.2.0/firebase.js"></script>' +
			'  <script type="text/javascript">\n'+
			'    window.define = {\n'+
			'	   $autoreloadConnect:false,\n'+
			'	   $busclass:"$system/rpc/firebusclient",\n'+
//			'	   $rendertimeout:100,\n'+
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
		var header = {
			"Cache-control": "max-age=0",
			"Content-Type": "text/html"
		}
		//var screen = this.screens[app]

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
