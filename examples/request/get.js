define.class('$server/service', function(require, $system$server$, nodehttp) {

    this.name = "get";
    this.attributes = {
        url: Config({type:String}),
        response: Config({type:String}),
        error: Config({type:String})
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


