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

// Initialize the app with a service account, granting admin privileges
define.$firebusConfig = {
	databaseURL: "https://dreembase.firebaseio.com/",
	serviceAccount: __dirname + "/firebase.json"
}

var args = {}
var options = {
	busclass: '$system/rpc/firebusserver',
	scripts: ['https://www.gstatic.com/firebasejs/3.2.0/firebase.js'],
	defines: {
		autoreloadConnect:false,
		busclass:"$system/rpc/firebusclient",
		firebaseApiKey: "AIzaSyDAsFR7KNvqOxBv3go8qWb1y7YRMwaw22U",
		firebaseAuthDomain: "dreembase.firebaseapp.com",
		firebaseDatabaseURL: "https://dreembase.firebaseio.com",
		firebaseStorageBucket: "dreembase.appspot.com"
	}
}

for (var key in define.paths) {
	define['$' + key] = define.paths[key]
}

require('$system/base/math')

exports.initStatic = function(express, app) {
	for (var use in define.paths) {
		app.use('/' + use, express.static(define.expandVariables(define.paths[use])));
	}
}

var CompositionServer = exports.server = require('$system/server/compositionserver')

CompositionServer.compservers = {}

exports.requestHandler = function (req, res) {
	var compname = "$" + req.path.substr(1)

	var compositionserver = CompositionServer.compservers[compname]
	if (!compositionserver) {
		CompositionServer.compservers[compname] = compositionserver = new CompositionServer(args, compname, options)
	}

	compositionserver.request(req, res)
}
