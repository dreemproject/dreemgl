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


