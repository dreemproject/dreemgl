/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require){
// Teem server

	var http = require('http')
	var os = require('os')
	var path = require('path')
	var fs = require('fs')
	var url = require('url')
	var zlib = require('zlib')

//	var FileWatcher = require('/system/server/filewatcher')
	var ExternalApps = require('/system/server/externalapps')
	var NodeWebSocket = require('/system/server/nodewebsocket')
	var mimeFromFile = require('/system/server/mimefromfile')
	var CompositionServer = require('/system/server/compositionserver')
	var XMLConverter = require('/system/server/xmlconverter')

	var BusServer = require('$system/rpc/busserver')

	// Doccumentation
	this.atConstructor = function(args){
		this.compositions = {}
		this.binrpc_incoming = {}
		this.binrpc_outgoing = {}

		this.args = args
		var port = this.args['-port'] || process.env.PORT || 2000
		var iface = this.args['-iface'] || process.env.IP || '127.0.0.1'

//		this.cache_gzip = define.makeCacheDir('gzip')

		// this.server = http.createServer(this.request.bind(this))
		// this.server.listen(port, iface)
		// this.server.on('upgrade', this.upgrade.bind(this))
		// this.addresses = []
		// if(iface == '0.0.0.0'){
		// 	var ifaces = os.networkInterfaces()
		// 	var txt = ''
		// 	Object.keys(ifaces).forEach(function(ifname){
		// 		var alias = 0;
		// 		ifaces[ifname].forEach(function(iface){
		// 			if ('IPv4' !== iface.family) return
		// 			var addr = 'http://' + iface.address + ':' + port + '/'
		// 			if(!this.address) this.address = addr
		// 			this.addresses.push('http://' + iface.address + ':' + port)
		// 			if(iface.address == '127.0.0.1'){
		// 				this.addresses.push('http://localhost:'+port)
		// 			}
		// 			txt += ' ~~on ~c~'+addr
		// 		}.bind(this))
		// 	}.bind(this))
		// 	console.color('Server running' + txt + '~~ Ready to go!\n')
		// }
		// else {
		// 	this.address = 'http://' + iface + ':' + port + '/'
		// 	this.addresses.push('http://' + iface + ':' + port)
		// 	if(iface == '127.0.0.1'){
		// 		this.addresses.push('http://localhost:'+port)
		// 	}
        //
		// 	console.color('Server running on ~c~' + this.address + "~~\n")
		// }
		// if(iface === '127.0.0.1'){
		// 	Object.defineProperty(define, "$localbound", {
		// 	    value: true,
		// 	    writable: false
		// 	});
		// }
		// else{
		// 	Object.defineProperty(define, "$localbound", {
		// 	    value: false,
		// 	    writable: false
		// 	});
		// }
		// // use the browser spawner
		// var browser = this.args['-browser']
		// if(browser && (!this.args['-delay'] || this.args['-count'] ==0 )){
		// 	ExternalApps.browser(this.address + (browser===true?'':browser), this.args['-devtools'])
		// }

		// this.watcher = new FileWatcher()
		// this.watcher.atChange = function(ifile){
		// 	if (!ifile){
		// 		return;
		// 	}
		// 	// ok lets get the original path
		// 	var file = ifile.replace(/\\/g,"/")
		// 	for(var key in define.paths){
		// 		var match = define.expandVariables(define['$'+key])
		// 		if(file.indexOf(match) === 0){
		// 			var sliced = file.slice(match.length)
		// 			if (sliced[0] !== '/') {
		// 				sliced = '/' + sliced
		// 			}
		// 			file = '/'+key+sliced
		// 			break
		// 		}
		// 	}
		// 	//file = file.slice(define.expandVariables(define.$root).length).replace(/\\/g, "/")
		// 	// ok lets rip off our
		// 	this.broadcast({
		// 		type:'filechange',
		// 		file: file
		// 	})
		// }.bind(this)

		this.busserver = new BusServer()

		process.on('SIGHUP', function(){
			if(this.args['-close']) this.broadcast({type:'close'})
			if(this.args['-delay']) this.broadcast({type:'delay'})
		}.bind(this))

//		if(this.args['-web']) this.getComposition(this.args['-web'])
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

		if(!define.$unsafeorigin && this.addresses.indexOf(req.headers.origin) === -1){
			console.log("WRONG ORIGIN SOCKET CONNECTION RECEIVED"+ req.headers.origin+ ' -> '+this.address)
			return false
		}
		// lets connect the sockets to the app
		var sock = new NodeWebSocket(req, sock, head)
		sock.url = req.url
		var mypath = req.url.slice(1)
		var busserver
		if(mypath) busserver = this.getComposition('$' + decodeURIComponent(mypath)).busserver
		else busserver = this.busserver
		busserver.addWebSocket(sock, req, this.binrpc_outgoing, this.binrpc_incoming)
	}

	// maps an input path into our files
	this.mapPath = function(input){
		var reqparts = input.split(/\//)
		// lets do the filename lookup
		console.log("D>PA", define.paths, reqparts)
		var mypath = define.paths ? define.paths[reqparts[1]] : false
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

		if(requrl.indexOf('/binrpc?') === 0){
			var where = decodeURIComponent(requrl.slice(8))
			if(req.method == 'POST'){
				// alright lets store this somewhere
				var buf = new Uint8Array(req.headers['content-length'])
				var off = 0

				req.on('data', function(data){
					for(var i = 0; i < data.length; i ++, off++){
						buf[off] = data[i]
					}
				})
				req.on('end', function(){
					this.binrpc_incoming[where] = buf
					res.writeHead(200)
					res.end()
				}.bind(this))
			}
			else{
				if(!this.binrpc_outgoing[where]){
					res.writeHead(404)
					res.end()
					return
				}
				var out = this.binrpc_outgoing[where]
				if(out.remoteAddress !== req.connection.remoteAddress){
					res.writeHead(404)
					res.end()
					return
				}
				var buf = new Buffer(out.data)
				res.writeHead(200, {'content-length':buf.length, 'content-type': 'application/octet-binary'})
				res.write(buf)
				this.binrpc_outgoing[where] = undefined
				res.end()
			}
			return
		}
		// otherwise handle as static file
		if(requrl.indexOf('/proxy?') === 0){
			// lets connect a http request and forward it back!
			var tgt_url = url.parse(decodeURIComponent(requrl.slice(7)))
			var tgtpath = tgt_url.path;
			if (tgt_url.search) {
				tgtpath = tgtpath +tgt_url.search
			}
			var proxy_req = http.request({
				hostname: tgt_url.hostname,
				path: tgtpath,
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

		// block use of relative paths in the entire url.
		if(decodeURIComponent(requrl).indexOf('..') !== -1){
			res.writeHead(404)
			res.end()
			return
		}

		if (requrl.indexOf("/api/run/wt-freemason-gmail_com-0/webtask") === 0) {
			requrl = "/examples/sliders.js"
			define.paths = {
				'system':'$root/system',
				'resources':'$root/resources',
				'3d':'$root/classes/3d',
				'behaviors':'$root/classes/behaviors',
				'server':'$root/classes/server',
				'ui':'$root/classes/ui',
				'flow':'$root/classes/flow',
				'testing':'$root/classes/testing',
				'widgets':'$root/classes/widgets',
				'sensors':'$root/classes/sensors',
				'iot':'$root/classes/iot',
				'examples':'$root/examples',
				'apps':'$root/apps',
				'docs':'$root/docs',
				'test':'$root/test'
			}
		}
		var reqquery = requrl.split('?')

		console.log("HERE NOW:::", reqquery, define.paths)

		// ok if we are a /single fetch
		var file = decodeURIComponent(this.mapPath(reqquery[0]))

		console.log("getting fole", file)

		var urlext = define.fileExt(reqquery[0])
		// write .dre to .dre.js files
		if (urlext === 'dre') {
			var dreurl = reqquery[0];
			var filepath = define.expandVariables('$root' + dreurl)
			var dre = fs.readFileSync(filepath);
			var js = XMLConverter(dre)
			// TODO: warn for overwrites to changed file, e.g. check hash of file versus old version
			fs.writeFileSync(filepath + '.js', js);
			this.watcher.watch(file)
		}

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

		if(!fileext || fileext === 'dre'){
			var composition = this.getComposition('$'+decodeURIComponent(reqquery[0].slice(1)))
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
						console.color('~br~Error~y~ ' + file + '~~ File not found, returning 404\n')
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
			// this.watcher.watch(file)
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
					// var gzip_file = path.join(this.cache_gzip, requrl.replace(/\//g,'_')+header.etag)
					// fs.stat(gzip_file, function(err, stat){
					// 	if(err){ // make it
					// 		fs.readFile(file, function(err, data){
					// 			zlib.gzip(data, function(err, compr){
					// 				//header["Content-length"] = compr.length
					// 				//console.log(compr.length)
					// 				res.writeHead(200, header)
					// 				res.write(compr)
					// 				res.end()
					// 				fs.writeFile(gzip_file, compr, function(err){
                    //
					// 				})
					// 			})
					// 		})
					// 	}
					// 	else{
					// 		var stream = fs.createReadStream(gzip_file)
					// 		res.writeHead(200, header)
					// 		stream.pipe(res)
					// 	}
					// })
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
