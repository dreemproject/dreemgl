define.class(function(require, $server$, service) {

    // Base API URL
    this.apiurl = "http://www.omdbapi.com/?s=";

    this.attributes = {
        // The string to search for in the OMDB database
        keyword: {type:String},
        // List of movie objects returned from server
        results: {type:Array}
    };

    this.onkeyword = function (event) {
        var keyword = event.value;
        var request = require('request');
        if (keyword && request) {
            request(this.apiurl + keyword.replace(/[^a-z0-9_-]/ig, '+'), (function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var res = JSON.parse(body);
                    this.results = res["Search"];
                }
            }).bind(this))
        } else if (!request) {
            console.log('WARNING: please cd to "./compositions/guide/" and run "npm install"')
        }
    };

});