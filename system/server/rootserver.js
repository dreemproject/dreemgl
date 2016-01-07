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
	var HTMLParser = require('$system/parse/htmlparser')
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
			file=file.replace(/\\/g,"/")
			for(var key in define.paths){
				var match = define.expandVariables(define['$'+key])
				if(file.indexOf(match) === 0){
					file = '/'+key+file.slice(match.length)
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

		var reqquery = requrl.split('?')

		// ok if we are a /single fetch
		var file = this.mapPath(reqquery[0])
		var urlext = define.fileExt(reqquery[0])

		var xmlToJS = function(filepath) {
			var makeSpace = function(indent) {
				var out = '';
				for (var i = 0; i < indent; i++) {
					out += '  ';
				}
				return out;
			}
			var filterSpecial = function(child) {
				var name = child.tag;
				return name.indexOf('$') !== 0 && name !== 'method';
			}
			var filterMethods = function(child) {
				return child.tag === 'method';
			}
			var toMethod = function(child) {
				if (child.tag === 'method') {
					var body = HTMLParser.reserialize(child.child[0]);
					var fn = new Function(child.attr.args, body);
					return {name: child.attr.name, body: fn};
				}
			}
			var objToString = function(obj) {
				var out = '{';
				var keys = Object.keys(obj);
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					var val = obj[key];

					out += key + ': ';
					if (typeof val === 'function') {
						out += val;
					} else {
						out += '"';
						out += val;
						out += '"';
					}
					if (i < keys.length - 1) out += ', ';
				}
				out += '}';
				return out;
			}
			var tagToFunc = function(child, indent) {
				// console.log('tagToFunc', indent, child, child.tag.indexOf('$'))
				var outputthis = filterSpecial(child);
				var out = '';
				var attr = child.attr;

				// add methods to attributes hash
				var methods = child.child && child.child.filter(filterMethods).map(toMethod);
				if (methods) {
					for (var i = 0; i < methods.length; i++) {
						var method = methods[i];
						attr[method.name] = method.body;
						// console.log('found method:', method)
					}
				}

				var children = child.child && child.child.filter(filterSpecial);
				var hasChildren = children && children.length;
				if (outputthis) {
					out += makeSpace(indent);
					// name
					out += child.tag + '(';
					// attributes
					out += objToString(attr, indent);
					if (hasChildren) out += ',\n'
				}
				if (hasChildren) {
					indent++;
					for (var i = 0; i < children.length; i++) {
						newchild = children[i];
						out += tagToFunc(newchild, indent);
						if (i !== children.length - 1) {
							out += ','
						}
						out += '\n';
					}
					indent--;
				}
				if (outputthis) {
					if (hasChildren) out += makeSpace(indent);
					out += ')';
				}
				return out;
			}
			// transform .dre to .js
			// console.log('parsing .dre file', filepath);
			var parsed = HTMLParser(fs.readFileSync(filepath));
			// console.log('parsed', JSON.stringify(parsed.node));
			var out = 'define.class(function($server$, composition, role, $ui$, screen, view){\n  this.render = function(){ return [\n';
			out += tagToFunc(parsed.node, 1);
			out += '  ];\n};\n});'
			// console.log('result', out)
			// write to .dre.js file and redirect there
			// TODO: warn for overwrites to changed file, e.g. check hash of file versus old version
			return out;
		}
		if (urlext === 'dre') {
			var url = reqquery[0];
			var filepath = define.expandVariables('$root' + url)
			var out = xmlToJS(filepath)
			fs.writeFileSync(filepath + '.js', out);
			res.writeHead(307, {location:url + '.js'})
			res.end()
			return
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