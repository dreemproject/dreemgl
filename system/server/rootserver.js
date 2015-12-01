/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Teem server

define.class(function(require){

	var http = require('http')
	var os = require('os')
	var path = require('path')
	var fs = require('fs')
	var url = require('url')
	var zlib = require('zlib')

	var FileWatcher = require('./filewatcher')
	var ExternalApps = require('./externalapps')
	var NodeWebSocket = require('./nodewebsocket')
	var mimeFromFile = require('./mimefromfile')
	var CompositionServer = require('./compositionserver')

	var BusServer = require('$system/rpc/busserver')

	// Doccumentation
	this.atConstructor = function(args){
		this.compositions = {}

		this.args = args
		var port = this.args['-port'] || process.env.PORT || 2000
		var iface = this.args['-iface'] || process.env.IP || '0.0.0.0'

		this.cache_gzip = define.makeCacheDir('gzip')

		this.server = http.createServer(this.request.bind(this))
		this.server.listen(port, iface)
		this.server.on('upgrade', this.upgrade.bind(this))

		if(iface == '0.0.0.0'){
			var ifaces = os.networkInterfaces()
			var txt = ''
			Object.keys(ifaces).forEach(function(ifname){
				var alias = 0;
				ifaces[ifname].forEach(function(iface){
					if ('IPv4' !== iface.family) return
					var addr = 'http://' + iface.address + ':' + port + '/'
					if(!this.address) this.address = addr
					txt += ' ~~on ~c~'+addr
				}.bind(this))
			}.bind(this))
			console.color('Server running' + txt + '~~ Ready to go!\n')
		}
		else {
			this.address = 'http://' + iface + ':' + port + '/' 
			console.color('Server running on ~c~' + this.address + "~~\n")
		}
		// use the browser spawner
		var browser = this.args['-browser']
		if(browser && (!this.args['-delay'] || this.args['-count'] ==0 )){
			ExternalApps.browser(this.address + (browser===true?'':browser), this.args['-devtools'])
		}

		this.watcher = new FileWatcher()
		this.watcher.atChange = function(file){
			// ok lets get the original path
			for(var key in define.paths){
				var match = define.expandVariables(define['$'+key])
				if(file.indexOf(match) === 0){
					file = '/'+key+file.slice(match.length).replace(/\\/g, "/")
					break
				}
			}
			//file = file.slice(define.expandVariables(define.$root).length).replace(/\\/g, "/")
			// ok lets rip off our 
			this.broadcast({
				type:'filechange',
				file: file
			})
		}.bind(this)

		this.busserver = new BusServer()

		process.on('SIGHUP', function(){
			if(this.args['-close']) this.broadcast({type:'close'})
			if(this.args['-delay']) this.broadcast({type:'delay'})
		}.bind(this))

		if(this.args['-web']) this.getComposition(this.args['-web'])
	}

	this.COMP_DIR = 'compositions'

	this.broadcast = function(msg){
		this.busserver.broadcast(msg)
		for(var k in this.compositions){
			this.compositions[k].busserver.broadcast(msg)
		}
	}

	this.default_composition = null

	this.getComposition = function(file){
		
		// lets find the composition either in define.COMPOSITIONS
		if(!this.compositions[file]) this.compositions[file] = new CompositionServer(this.args, file, this)
		return this.compositions[file]
	}

	this.upgrade = function(req, sock, head){
		// lets connect the sockets to the app
		var sock = new NodeWebSocket(req, sock, head)
		sock.url = req.url
		var mypath = req.url.slice(1)
		if(mypath) this.getComposition('$' + mypath).busserver.addWebSocket(sock)
		else this.busserver.addWebSocket(sock) 
	}

	// maps an input path into our files
	this.mapPath = function(input){
		var reqparts = input.split(/\//)
		// lets do the filename lookup
		var mypath = define.paths[reqparts[1]]
		if(!mypath) return false

		// combine it
		var file = path.join(define.expandVariables(mypath), reqparts.slice(2).join('/'))
		return file
	}

	this.searchPath = function(basedir, match){
		// lets recur our path
		var dir = fs.readdirSync(define.expandVariables(basedir))
		for(var i = 0; i < dir.length; i++){
			var subitem = basedir + '/' + dir[i]
			if(subitem.toLowerCase().indexOf(match) !== -1) return subitem
			var stat = fs.statSync(define.expandVariables(subitem))
			if(stat.isDirectory()){
				var file = this.searchPath(subitem, match)
				if(file) return file
			}
		}
	}

	this.request = function(req, res){
		// lets delegate to
		var host = req.headers.host
		var requrl = req.url

		// otherwise handle as static file
		if(requrl.indexOf('/proxy?') == 0){
			// lets connect a http request and forward it back!
			var tgt_url = url.parse(decodeURIComponent(requrl.slice(7)))
			var proxy_req = http.request({
				hostname: tgt_url.hostname,
				path: tgt_url.path + tgt_url.search,
				headers: {
					accept: req.headers.accept,
					'user-agent': req.headers['user-agent'],
					'accept-encoding': req.headers['accept-encoding'],
					'accept-language': req.headers['accept-language']
				}
			}, function(proxy_res){
				res.writeHead(proxy_res.statusCode, proxy_res.headers)
				proxy_res.pipe(res)
			})

			proxy_req.end()
			return
		}
		
		if(requrl =='/favicon.ico'){
			res.writeHead(200)
			res.end()
			return
		}

		var reqquery = requrl.split('?')

		// ok if we are a /single fetch 
		var file = this.mapPath(reqquery[0])

		if(file === false){ // file is a search
			// what are we looking for
			// a directory named x or file or anything
			// we will just 302 to it
			for(var key in define.paths){
				var mypath = define.paths[key]
				var fwdfile = this.searchPath(mypath, reqquery[0].slice(1))
				if(fwdfile){
					var urlpath = '/'+ key + '/' +define.fileBase(fwdfile.slice(mypath.length))
					res.writeHead(307, {location:urlpath})
					res.end()
					return
				}
			}
			res.writeHead(404)
			res.end("File not found: "+reqquery[0])
			return
		}

		var fileext = define.fileExt(file)
		if(!fileext){
			var composition = this.getComposition('$'+reqquery[0].slice(1))
			if(composition) return composition.request(req, res)
		}

		fs.stat(file, function(err, stat){
			if(err || !stat.isFile()){
				// see if we can find the index.js, otherwise skip it
				file = file.slice(0, file.lastIndexOf('.')) + '/index.js'
				fs.stat(file, function(err, stat){
					if(err || !stat.isFile()){
						res.writeHead(404)
						res.end()
						console.color('~br~Error~y~ ' + file + '~~ File not found, returning 403\n')
						return
					}
					processFile(stat)
				})
			}
			else processFile(stat)
		})

		var processFile = function(stat){
			var header = {
				"Connection":"Close",
				"Cache-control":"max-age=0",
				"Content-Type": mimeFromFile(file),
				"etag": stat.mtime.getTime() + '_' + stat.size,
				"mtime": stat.mtime.getTime()
			}
			this.watcher.watch(file)
			if( req.headers['if-none-match'] == header.etag){
				res.writeHead(304,header)
				res.end()
				return 
			}
			// lets add a gzip cache
			var type = header["Content-Type"]
			if(type !== 'image/jpeg' && type !== 'image/png'){
				// see if we accept gzip
				if(req.headers['accept-encoding'] && req.headers['accept-encoding'].toLowerCase().indexOf('gzip') !== -1){
					//header["Content-Type"]+="; utf8"
					header["Content-encoding"] = "gzip"
					header["Transfer-Encoding"] = "gzip"
					var gzip_file = path.join(this.cache_gzip, requrl.replace(/\//g,'_')+header.etag)
					fs.stat(gzip_file, function(err, stat){
						if(err){ // make it
							fs.readFile(file, function(err, data){
								zlib.gzip(data, function(err, compr){
									//header["Content-length"] = compr.length
									//console.log(compr.length)
									res.writeHead(200, header)
									res.write(compr)
									res.end()
									fs.writeFile(gzip_file, compr, function(err){

									})
								})
							})
						}
						else{
							var stream = fs.createReadStream(gzip_file)
							res.writeHead(200, header)
							stream.pipe(res)
						}
					})
				}
				else{
					var stream = fs.createReadStream(file)
					res.writeHead(200, header)
					stream.pipe(res)					
				}
			}
			else{
				var stream = fs.createReadStream(file)
				res.writeHead(200, header)
				stream.pipe(res)
			}
			// ok so we get a filechange right?
			
		}.bind(this)
	}
})