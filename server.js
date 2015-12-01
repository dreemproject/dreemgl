/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

// Dreem/Dali server
require = require('./system/base/define') // support define.js modules

// load up math core and make it global
define.global(require('$system/base/math'))

if(process.argv.indexOf('-nomoni') != -1){
	define.atRequire = function(filename){
		process.stderr.write('\x0F' + filename + '\n', function(){})
	}
}

var fs = require('fs')
var path = require('path')

// ok now we can require components
var ansicolor = require('$system/debug/ansicolor')
console.color = ansicolor(function(v){
	process.stdout.write(v)
}) 

console.clear = function(){
	process.stdout.write("\033[2J");
}

console.setposition = function(x, y){
	process.stdout.write("\033[" + y.toString() + ";" + x.toString() + "f")
}

// make a nice console.dump function
var dump = require('$system/debug/dump')
console.dump = function(){
	// lets grab where we are called
	console.log(new Error().stack)
	console.color(dump(Array.prototype.slice.apply(arguments), 1000000, dump.colors))
}

function main(){
	var argv = process.argv	
	var args = {}
	for(var lastkey = '', arg, i = 0; i<argv.length; i++){
		arg = argv[i]
		if(arg.charAt(0) == '-') lastkey = arg, args[lastkey] = true
		else {
			if(lastkey in args){
				if(!Array.isArray(args[lastkey])) args[lastkey] = [args[lastkey]]
				args[lastkey].push(arg)
			}
			else args[lastkey] = arg
		}
	}

	if(args['-nomoni'] && args['-trace']){
		var trace = require('$system/debug/trace')
		define.atModule = function(module){
			module.exports = trace(module.exports, module.filename, args['-trace'])
		}
	}

	if(args['-h'] || args['-help'] || args['--h'] || args['--help']){
		console.color('~by~Teem~~ Server ~bm~2.0~~\n')
		console.color('commandline: node server.js <flags>\n')
		console.color('~bc~-port ~br~[port]~~ Server port\n')
		console.color('~bc~-nomoni ~~ Start process without monitor\n')
		console.color('~bc~-iface ~br~[interface]~~ Server interface\n')
		console.color('~bc~-browser~~ Opens webbrowser on default app\n')
		console.color('~bc~-notify~~ Shows errors in system notification\n')
		console.color('~bc~-devtools~~ Automatically opens devtools in the browser\n')
		console.color('~bc~-close~~ Auto closes your tab when reloading the server\n')
		console.color('~bc~-delay~~ Delay reloads your pages when reloading the server\n')
		console.color('~bc~-restart~~ Auto restarts after crash (Handy for client dev, not server dev)\n')
		console.color('~bc~-edit~~ Automatically open an exception in your code editor at the right line\n')
		console.color('~bc~-path~~ [name]:~br~[directory]~~ add a path to the server under name $name\n')
		return process.exit(0)
	}

	// our default pathmap
	define.paths = {
		'system':'$root/system',
		'resources':'$root/resources',
		'examples':'$root/examples',
		'3d':'$root/classes/3d',
		'behaviors':'$root/classes/behaviors',
		'server':'$root/classes/server',
		'containers':'$root/classes/containers',
		'controls':'$root/classes/controls',
		'testing':'$root/classes/testing',
		'widgets':'$root/classes/widgets',
	}
	var paths = Array.isArray(args['-path'])?args['-path']:[args['-path']]

	for(var i = 0; i < paths.length; i++){
		if(!paths[i]) continue
		var parts = paths[i].split(':')
		var mypath =  parts[1].charAt(0) === '/'? parts[1]: define.joinPath(define.$root, parts[1])
		paths[parts[0]] = mypath
	}
	// put them on the define
	for(var key in define.paths){
		define['$'+key] = define.paths[key]
	}

	define.$platform = 'headless'

	if(args['-nodegl']){
		// lets do an async require on our UI
		define.$platform = 'nodegl'
		var NodeGL = require('$system/platform/bootnodegl')
		new NodeGL(args)
	}
	else if(args['-nomoni']){
		if(args['-sync']){
			var GitSync = require('$system/server/gitsync')
			
			new GitSync(args)
		}
		else if(args['-dali']){
            // Place the dali/nodejs package at the root of dreemgl

		    var composition = args['-dali'];
		    if (composition === true)
			composition = 'rendertest'

		    define.$rendermode = 'dali'
		    define.$platform = 'dali'
		    define.$environment = 'dali' // Otherwise it is nodejs

		    // Use a local daliserver as a first pass
		    var DaliServer = require('$system/platform/dali/bootdali')
		    new DaliServer(args, composition);
		}
		else if(args['-test']){
			require('$system/server/test.js')

		}
		else{
			define.$platform = 'nodejs'
			var RootServer = require('$system/server/rootserver')
			new RootServer(args)
		}

	}
	else{
		var RunMonitor = require('$system/server/runmonitor')
		new RunMonitor(args)
	}
}

main()
