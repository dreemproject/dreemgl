/**
 * Browser-specific Utils object, used for compiling the Flickr API
 * client-side library. This acts as replacement for the regular
 * src/utils.js, which heavily relies on being run in Node.js context.
 */
module.exports = {
  formQueryString: function(queryArguments) {
    var args = [],
        append = function(key) {
          args.push(key + "=" + encodeURIComponent(queryArguments[key]));
        };
    Object.keys(queryArguments).sort().forEach(append);
    return args.join("&");
  },
  checkRequirements: function(method_name, required, callOptions, callback) {
    required = required || [];
    for(var r=0, last=required.length, arg; r<last; r++) {
      arg = required[r];
      if(arg.name === "api_key") continue;
      if(!callOptions.hasOwnProperty(arg.name)) {
        return callback(new Error("missing required argument '"+arg.name+"' in call to "+method_name));
      }
    }
  },
  generateAPIFunction: function(method) {
    return function(callOptions, callback) {
      if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
      var queryArguments = Utils.generateQueryArguments(method.name, this.flickrOptions, callOptions);
      Utils.queryFlickr(queryArguments, this.flickrOptions, method.security, callback);
    };
  },
  generateAPIDevFunction: function(method) {
    return function(callOptions, callback) {
      if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
      Utils.checkRequirements(method.name, method.required, callOptions, callback);
      var queryArguments = Utils.generateQueryArguments(method.name, this.flickrOptions, callOptions);
      Utils.queryFlickr(queryArguments, this.flickrOptions, method.security, callback, method.errors);
    };
  },
  generateQueryArguments: function(method_name, flickrOptions, callOptions) {
    // set up authorized method access
    var queryArguments = {
      method: method_name,
      format: "json",
    };
    if(flickrOptions.api_key) {
      queryArguments.api_key = flickrOptions.api_key;
    }
    // set up bindings for method-specific args
    Object.keys(callOptions).forEach(function(key) {
      queryArguments[key] = callOptions[key];
    });
    return queryArguments;
  },
  queryFlickr: function(queryArguments, flickrOptions, security, processResult) {
    if(flickrOptions.endpoint) {
      return this.queryProxyEndpoint(queryArguments, flickrOptions, processResult);
    }
    return this.queryFlickrAPI(queryArguments, flickrOptions, security, processResult);
  },
  /**
   * If you want to upload, you're going to have to do it server side.
   */
  upload: function(uploadOptions, flickrOptions, processResult) {
    return processResult(new Error("Uploading directly from the browser is not supported"));
  },
  /**
   * When contacting Flickr "regularly", permission levels greater than 0 (public access)
   * cannot be securely dealt with. read-only, write, and delete all require oauth
   * authentication keys, and these should never, ever, be stored at the client.
   */
  queryFlickrAPI: function(queryArguments, flickrOptions, security, processResult) {
    var url = "https://api.flickr.com/services/rest/",
        queryString = this.formQueryString(queryArguments),
        flickrURL = url + "?" + queryString;
    // Do we need special permissions? (read private, 1, write, 2, or delete, 3)?
    // if so, those are currently not supported. Send an error-notification.
    if(security.requiredperms > 0) {
      return processResult(new Error("signed calls (write/delete) currently not supported"));
    }
    this.handleURLRequest("GET", flickrURL, processResult);
  },
  /**
   * When we're contacting a Flickr API proxy, we can rely on the fact that it will
   * take care of oauth authentication for us, and so we do not need to do any kind
   * of security permissions check for the requested methods.
   */
  queryProxyEndpoint: function(queryArguments, flickrOptions, processResult) {
    var queryString = this.formQueryString(queryArguments),
        url = flickrOptions.endpoint + "?" + queryString;
    this.handleURLRequest("POST", url, processResult, queryArguments);
  },
  /**
   * Perform an asynchronous URL request.
   */
  handleURLRequest: function(verb, url, processResult, postdata) {
    var xhr = new XMLHttpRequest();
    xhr.open(verb, url, true);
    if(postdata) {
      xhr.setRequestHeader("Content-Type", "application/json");
    }
    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4) {
        if(xhr.status == 200) {
          var error = false,
              body = xhr.responseText;
          // we get a response, but there's no response body. That's a problem.
          if(!body) {
            error = "HTTP Error " + response.statusCode + " (" + statusCodes[response.statusCode] + ")";
            return processResult(error);
          }
          // we get a response, and there were no errors
          if(!error) {
            try {
              body = body.trim().replace(/^jsonFlickrApi\(/,'').replace(/\}\)$/,'}');
              body = JSON.parse(body);
              if(body.stat !== "ok") {
                // There was a request error, and the JSON .stat property
                // will tell us what that error was.
                return processResult(body.message);
              }
            } catch (e) {
              // general JSON error
              return processResult("could not parse body as JSON");
            }
          }
          // Some kind of other error occurred. Simply call the process
          // handler blindly with both the error and error body.
          processResult(error, body);
        }
        else { processResult("HTTP status not 200 (received "+xhr.status+")"); }
      }
    };
    xhr.send(postdata ? JSON.stringify(postdata) : null);
  }
};
