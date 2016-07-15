/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

require = require('./system/base/define')

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

require('$system/base/math')

Object.defineProperty(define, "$writefile", {
	value: false,
	writable: false
});

Object.defineProperty(define, "$unsafeorigin", {
	value: false,
	writable: false
});

define.$platform = 'nodejs'
for (var key in define.paths) {
	define['$' + key] = define.paths[key]
}

var StaticServer = require('$system/server/staticserver')

var express = require('express');
var app = express();

app.use('/system', express.static('system'));
app.use('/examples', express.static('examples'));
app.use('/apps', express.static('apps'));
app.use('/docs', express.static('docs'));
app.use('/resources', express.static('resources'));
app.use('/test', express.static('test'));
app.use('/ui', express.static('classes/ui'));
app.use('/3d', express.static('classes/3d'));
app.use('/server', express.static('classes/server'));
app.use('/behaviors', express.static('classes/behaviors'));
app.use('/flow', express.static('classes/flow'));
app.use('/testing', express.static('classes/testing'));
app.use('/widgets', express.static('classes/widgets'));
app.use('/iot', express.static('classes/iot'));
app.use('/sensors', express.static('classes/sensors'));

app.get('/', function (req, res) {
	console.log("got request")

	var compname = "$examples/sliders"

	var compositionserver = new StaticServer(compname, {
		bus:{name:"dummybus", broadcast:function() { console.log("broadcasing:", arguments) }}
	})

	compositionserver.request(req, res)
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});
