/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require){

	var CompositionServer = require('$system/server/compositionserver')

	// Serves all the static files in that DreemGL will likely ask for (from define.paths)
	this.mountStatic = function(express, app) {
		for (var use in define.paths) {
			app.use('/' + use, express.static(define.expandVariables(define.paths[use])));
		}
	}

	this.compservers = {}

	// Request handler Express will use to serve DreemGL
	this.requestHandler = function (req, res) {
		var compname = "$" + req.path.substr(1)

		var compositionserver = this.compservers[compname]
		if (!compositionserver) {
			this.compservers[compname] = compositionserver = new CompositionServer(define.$args, compname, define.$compositionOptions)
		}

		compositionserver.request(req, res)
	}.bind(this)

})



