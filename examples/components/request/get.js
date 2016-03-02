/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/service', function(require, $system$server$, nodehttp) {

    this.name = "get";
    this.attributes = {

        // The URL to fetch
        url: Config({type:String, flow:'in'}),

        // If the URL is retreived successfully, it's body will be stored here
        response: Config({type:String, flow:'out'}),

        // This value will be set if an error occours when retreiving the URL
        error: Config({type:String, flow:'out'})
    };

    //this will only exist on the service side
    var libexists = require('url');
    if (libexists) {
        this.onurl = function(event) {
            var self = this;
            var url = event.value;
            if (url) {
                nodehttp.get(url).then(function(resp) {
                    self.error = null;
                    self.response = resp;
                }, function(err) {
                    self.response = null;
                    self.error = err;
                });
            } else {
                self.response = null;
                self.error = null;
            }
        }
    }

});


