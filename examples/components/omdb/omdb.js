/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class("$examples/components/request/get", function() {

    this.attributes = {
        // Base API URL
        apiurl:"http://www.omdbapi.com/?s=",
        // The string to search for in the OMDB database
        keyword: Config({type: String, flow:"in"}),
        // List of movie objects returned from server
        results: Config({type:Array, value:[], flow:"out"}),
        url: Config({type:String})
    };

    this.onkeyword = function (event) {
        var kw = event.value;
        if (kw) {
            this.url = this.apiurl + kw.replace(/[^a-z0-9_-]/ig, '+');
        } else {
            this.url = null;
        }
    };

    this.onresponse = function (event) {
        var body = event.value;
        if (body) {
            var res = JSON.parse(body);
            if (res && res.Search) {
                this.results = res.Search;
            } else {
                this.results = []
            }
        }
    }


});
