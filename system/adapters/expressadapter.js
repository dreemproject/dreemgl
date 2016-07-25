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

//----

exports.initStatic = function(express, app) {
	for (var use in define.paths) {
		app.use('/' + use, express.static(define.expandVariables(define.paths[use])));
	}
}

var Server = exports.server = require('$system/server/staticserver')

Server.compservers = {}

exports.requestHandler = function (req, res) {
	var compname = "$" + req.path.substr(1)

	var compositionserver = Server.compservers[compname]
	if (!compositionserver) {
		Server.compservers[compname] = compositionserver = new Server(compname)
	}

	compositionserver.request(req, res)
}
