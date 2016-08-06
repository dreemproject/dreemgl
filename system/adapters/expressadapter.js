// Launch the platform setup
require = require(__dirname + '/../../dreemgl')

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
		CompositionServer.compservers[compname] = compositionserver = new CompositionServer(define.$args, compname, define.$compositionOptions)
	}

	compositionserver.request(req, res)
}
