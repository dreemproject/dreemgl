// Proccess args
var args = {}
var argv = process.argv
for(var lastkey = '', arg, i = 0; i<argv.length; i++){
	arg = argv[i]
	if(arg.charAt(0) == '-') lastkey = arg, args[lastkey] = true
	else {
		if(lastkey in args && args[lastkey] !== true){
			if(!Array.isArray(args[lastkey])) args[lastkey] = [args[lastkey]]
			args[lastkey].push(arg)
		}
		else args[lastkey] = arg
	}
}

// Launch the platform setup
require = require(__dirname + '/../base/define')

define.$platform = 'nodejs'

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

for (var key in define.paths) {
	define['$' + key] = define.paths[key]
}

require('$system/base/math')

// Serves all the static files in that DreemGL will likely ask for (from define.paths)
exports.initStatic = function(express, app) {
	for (var use in define.paths) {
		app.use('/' + use, express.static(define.expandVariables(define.paths[use])));
	}
}

var CompositionServer = exports.server = require('$system/server/compositionserver')
CompositionServer.compservers = {}

// Request handler Express will use to serve DreemGL
exports.requestHandler = function (req, res) {
	var compname = "$" + req.path.substr(1)

	var compositionserver = CompositionServer.compservers[compname]
	if (!compositionserver) {
		CompositionServer.compservers[compname] = compositionserver = new CompositionServer(args, compname, define.$compositionOptions)
	}

	compositionserver.request(req, res)
}
