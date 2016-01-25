define.class('$server/service', function(require, $system$server$, nodehttp) {

    // internal, Base API URL
    this.apiurl = "http://www.omdbapi.com/?s=";

    this.attributes = {
        // The string to search for in the OMDB database
        keyword: "",
        // List of movie objects returned from server
        results: []
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
