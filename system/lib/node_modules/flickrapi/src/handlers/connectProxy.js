/**
 * proxy for Flickr API calls for those using express/connect
 */
module.exports = {
  proxy: function(API) {
    var proxyMethods = {};

    /**
     * bind all methods for proxying
     */
    (function bindProxyMethod(obj, name) {
      Object.keys(obj).forEach(function(key) {
        if(typeof obj[key] === "object") {
          bindProxyMethod(obj[key], name + "." + key);
        }
        else if(typeof obj[key] === "function") {
          proxyMethods[name+"."+key] = obj[key];
        }
      });
    }(API, "flickr"));

    /**
     * middleware handler for API calls
     */
    function proxyAPICall(req, res) {
      var method = req.body.method;
      var apiFunction = proxyMethods[method];
      //console.log("API call: "+method);
      if(apiFunction) {
        apiFunction(req.body, function(err, result) {
          res.json(err || result);
        });
      } else {
        res.json({ status: 404, message: "No such API method."});
      }
    }

    /**
     * The proxy call that sets up the route handler
     * for the app that uses express/connect.
     */
    API.proxy = function(app, route, authenticator) {
      authenticator =  authenticator || function(_,__,next) { next(); };
      app.post(route, authenticator, proxyAPICall);
    };
  }
};
