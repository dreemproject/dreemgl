/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

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
	if (define.paths.hasOwnProperty(key)) {
		define['$' + key] = define.paths[key]
	}
}

require('$system/base/math')

module.exports = require
