module.exports = (function() {
  "use strict";

  var request = require("request"),
      Utils = require("../utils"),
      RequestAuthorization = require("./auth");

  /**
   * First part of oauth: request a token
   */
  var RequestTokenFunction = function(options, requestCompleted) {
    options = Utils.setAuthVals(options);

    var queryArguments = {
          oauth_callback:         options.callback,
          oauth_consumer_key:     options.api_key,
          oauth_nonce:            options.oauth_nonce,
          oauth_timestamp:        options.oauth_timestamp,
          oauth_signature_method: "HMAC-SHA1",
          oauth_version:          "1.0"
        };

    var queryString = Utils.formQueryString(queryArguments);
    var data = Utils.formBaseString("GET", this.url, queryString);
    var signature = Utils.sign(data, options.secret);

    var flickrURL = this.url + "?" + queryString + "&oauth_signature=" + signature;
    request.get(flickrURL, function(error, response, body) {
      if(error) {
        console.log(error);
      }

      // show response
      response = Utils.parseRestResponse(body);
      if(!response) {
        requestCompleted("no response received");
      }

      console.log(response);

      if(response.oauth_problem) {
        // Occasionally, this will fail.
        // Rerunning it then succeeds just fine.
        return;
      }
      Object.keys(response).forEach(function(key) {
        options[key] = response[key];
      });
      new RequestAuthorization(options, requestCompleted);
    });
  };

  RequestTokenFunction.prototype = {
    url: "https://www.flickr.com/services/oauth/request_token",
    formBaseString: function(queryString) {
      return ["GET", encodeURIComponent(this.url), encodeURIComponent(queryString)].join("&");
    }
  };

  return RequestTokenFunction;
}());
