define.class("$server/service", function(require) {

    this.attributes = {
        // Base API URL
        apiurl:"http://www.omdbapi.com/?s=",
        // The string to search for in the OMDB database
        keyword: Config({type: String}),
        // List of movie objects returned from server
        results: Config({type: Array, value: []})
    };

    this.onkeyword = function (event) {

        var http = require('http');

        var req = http.request({
            hostname: "www.omdbapi.com",
            path: "/?s=" + this.keyword
        }, function(res){
            console.log(res);
        });

        req.end();


        var keyword = event.value;
        //var request = require('request');
        //if (keyword && request) {
        //    request(this.apiurl + keyword.replace(/[^a-z0-9_-]/ig, '+'), (function (error, response, body) {
        //        if (!error && response.statusCode == 200) {
        //            var res = JSON.parse(body);
        //            this.results = res["Search"];
        //        }
        //    }).bind(this))
        //} else if (!request) {
        //    console.log('WARNING: if "request" is missing, please cd to "./examples/guide/" and run "npm install"')
        //}
    };

});