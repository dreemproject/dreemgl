/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// parse a color string into a [r,g,b] 0-1 float array

define.class(function(require){

	var path = require('path')
	var fs = require('fs')

	var ExternalApps = require('./externalapps')
	var FileWatcher = require('./filewatcher')

	var BusServer = require('$system/rpc/busserver')
	var HTMLParser = require('$system/parse/htmlparser')
	var ScriptError = require('$system/parse/scripterror')
	var legacy_support = 0

	this.atConstructor = function(
		args, //Object: Process arguments
		compname, //String: name of the composition
		rootserver){ //TeemServer: teem server object

		this.rootserver = rootserver
	 	this.args = args
		this.compname = compname

		this.busserver = new BusServer()

		this.slow_watcher = new FileWatcher(200)

		this.fast_watcher = new FileWatcher(10)
		// lets give it a session
		this.session = Math.random() * 1000000

		this.fast_watcher.atChange = 
		this.slow_watcher.atChange = function(){
			// lets reload this app
			this.reload()
		}.bind(this)

		this.components = {}

		this.paths = ""
		for(var key in define.paths){
			if(this.paths) this.paths += ',\n\t\t'
			this.paths += '$'+key+':"$root/'+key+'"'
		}

		this.fast_list = ['$examples']
		// lets compile and run the dreem composition
		define.atRequire = function(filename){
			for(var i = 0; i < this.fast_list.length; i++){
				var fast = this.fast_list[i]
				if(filename.indexOf( define.expandVariables(fast) ) === 0){
					return this.fast_watcher.watch(filename)
				}
			}
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
		console.log("Reloading composition "+this.filename)
		require.clearCache()
		var Composition = require(define.expandVariables(this.filename))
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

	this.loadHTML = function(title, boot, paths){
		return '<html lang="en">\n'+
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
			'    body {background-color:darkgray;margin:0;padding:0;height:100%;overflow:hidden;}\n'+
			'  </style>'+
			'  <script type="text/javascript">\n'+
			'    window.define = {\n'+
			'	   $platform:"webgl",\n'+
			'     '+paths+',\n'+
			'      main:["$system/base/math", "' + boot + '"],\n'+
			'      atMain:function(require, modules){\n'+
			'        define.endLoader()\n'+
			'		 define.global(require(modules[0]))\n'+
			'		 var Composition = require(modules[1])\n'+
			'        define.rootComposition = new Composition(define.rootComposition)\n'+
			'      },\n'+
			'	   atEnd:function(){\n'+
			'         define.startLoader()\n'+
			'      }\n'+
			'    }\n'+
			'  </script>\n'+
			'  <script type="text/javascript" src="/system/base/define.js"></script>\n'+
			' </head>\n'+
			' <body class="unselectable">\n'+
			' </body>\n'+
			'</html>\n'
	}

	this.request = function(req, res){
		var base = req.url.split('?')[0]
		var app = base.split('/')[2] || 'browser'
		// ok lets serve our Composition device 

		if(req.method == 'POST'){
			// lets do an RPC call
			var buf = ''
			req.on('data', function(data){buf += data.toString()})
			req.on('end', function(){
				try{
					var json = JSON.parse(buf)
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
					return
				}
			}.bind(this))
			return
		}

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

		var html = this.loadHTML(this.title, this.filename, this.paths)
		res.writeHead(200, header)
		res.write(html)
		res.end()
	}
})