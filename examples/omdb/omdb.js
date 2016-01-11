define.class("$examples/request/get", function() {

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