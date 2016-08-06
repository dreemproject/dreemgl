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

var require = require(__dirname + '/system/base/define')

if (args['-writefile']) {
	Object.defineProperty(define, "$writefile", { value: true, writable: false });
} else{
	Object.defineProperty(define, "$writefile", { value: false, writable: false });
}

if (args['-unsafeorigin']) {
	Object.defineProperty(define, "$unsafeorigin", { value: true, writable: false });
} else{
	Object.defineProperty(define, "$unsafeorigin", { value: false, writable: false });
}

define.$args = args
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

module.exports = require
