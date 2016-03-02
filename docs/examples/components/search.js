/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/service', function(require, $system$server$, nodehttp) {

    // internal, Base API URL
    this.apiurl = "http://www.omdbapi.com/?s=";

    this.attributes = {
        // The string to search for in the OMDB database
        keyword: Config({value:"", persist:true}),
        // List of movie objects returned from server
        results: Config({value:[], persist:true})
    };

	var libexists = require('url');
	if (libexists) {
		this.onkeyword = function (event) {
			var self = this;
			var keyword = event.value;

			if (keyword) {
				var url = this.apiurl + keyword.replace(/[^a-z0-9_-]/ig, '+');
				if (url) {
					nodehttp.get(url).then(function(resp) {
						var res = JSON.parse(resp);
						self.results = res["Search"];
					}, function(err) {
						console.log('ERROR with OMDB Search:', err);
						self.results = [];
					});
				} else {
					self.results = [];
				}
			}
		};
	}



});
