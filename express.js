/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

var express = require('express');
var app = express();

var ExpressAdapter = require('./system/adapters/expressadapter')

// These options will be used when building composition servers, primarily used to configure the firebase bus
define.$compositionOptions = {
	whitelist: ['http://0.0.0.0:3000', 'http://127.0.0.1:3000', 'http://localhost:3000'],
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

// Needed by the firebase server-side bus
define.$firebusConfig = {
	databaseURL: "https://dreembase.firebaseio.com/",
	serviceAccount: __dirname + "/firebase.json"
}

// Configure serving the static JS
ExpressAdapter.initStatic(express, app)

// Configure all requests to be handled by the ExpressAdapter.requestHandler
app.get('/*', ExpressAdapter.requestHandler);
app.post('/*', ExpressAdapter.requestHandler);

app.listen(3000, function() {
	console.log("Started express server on port 3000")
});
