/**
 *  This is a utility object for universal oauth
 *  signing as well as querying Flickr once a query
 *  object has been constructed to set to the Flickr
 *  API endpoint.
 *
 *  Response are in JSON format.
 */
module.exports = (function() {
  "use strict";
  var crypto = require("crypto"),
      fs = require("fs"),
      request = require("request"),
      statusCodes = {
        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        407: "Proxy Authentication Required",
        408: "Request Timeout",
        409: "Conflict",
        410: "Gone",
        411: "Length Required",
        412: "Precondition Failed",
        413: "Request Entity Too Large",
        414: "Request-URI Too Long",
        415: "Unsupported Media Type",
        416: "Requested Range Not Satisfiable",
        417: "Expectation Failed",
        428: "Precondition Required",
        429: "Too Many Requests",
        431: "Request Header Fields Too Large",
        450: "Blocked By Windows Parental Controls",
        499: "Client Closed Request",
        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
        505: "HTTP Version Not Supported",
        506: "Variant Also Negotiates",
        507: "Insufficient Storage",
        508: "Loop Detected",
        509: "Bandwidth Limit Exceeded",
        510: "Not Extended",
        511: "Network Authentication Required"
      };

  /**
   * Pretty-print JSON files, because we will want
   * to inspect them manually, as good humans.
   */
  module.exports = (function() {
    if (!JSON.prettyprint) {
      JSON.prettyprint = function prettyprint(data) {
        return this.stringify(data, undefined, 2);
      };
    }
    return JSON;
  }());

  var callErrors = {};

  return {
    /**
     * shorthand function
     */
    mkdir: function(dir) {
      var trymkdir = function(dir) {
        try {
          fs.mkdirSync(dir);
          //console.log("creating " + dir);
        }
        catch (e) {
          /* we really don't care if it already exists */
        }
      };
      var f = "";
      dir.replace("./",'').split("/").forEach(function(d) {
        f += d + "/";
        trymkdir(f);
      });
      return dir;
    },

    /**
     * extend the known generic Flickr errors
     */
    extendErrors: function(errors, errCap) {
      errors.forEach(function(err) {
        if (+(err.code) >= errCap) {
          callErrors[err.code] = err;
        }
      });
    },

    getCallErrors: function() {
      return callErrors;
    },

    /**
     * Update an options object for use with Flickr oauth
     * so that it has a new timestampe and nonce.
     */
    setAuthVals: function(options) {
      var timestamp = "" + Date.now(),
          md5 = crypto.createHash('md5').update(timestamp).digest("hex"),
          nonce = md5.substring(0,32);
      options.oauth_timestamp = timestamp;
      options.oauth_nonce = nonce;
      return options;
    },

    /**
     * Collapse a number of oauth query arguments into an
     * alphabetically sorted, URI-safe concatenated string.
     */
    formQueryString: function(queryArguments) {
      var args = [],
          append = function(key) {
            args.push(key + "=" + encodeURIComponent(queryArguments[key]));
          };
      Object.keys(queryArguments).sort().forEach(append);
      return args.join("&");
    },

    /**
     * Turn a url + query string into a Flickr API "base string".
     */
    formBaseString: function(verb, url, queryString) {
      return [verb, encodeURIComponent(url), encodeURIComponent(queryString)].join("&");
    },

    /**
     * Parse a Flickr API response.
     */
    parseRestResponse: function(body) {
      if(!body) {
        return false;
      }
      var constituents = body.split("&"),
          response = {},
          keyval;
      constituents.forEach(function(pair) {
        keyval = pair.split("=");
        response[keyval[0]] = decodeURIComponent(keyval[1]);
      });
      return response;
    },

    /**
     * HMAC-SHA1 data signing
     */
    sign: function(data, key, secret) {
      var hmacKey = key + "&" + (secret ? secret : ''),
          hmac = crypto.createHmac("SHA1", hmacKey);
      hmac.update(data);
      var digest = hmac.digest("base64");
      return encodeURIComponent(digest);
    },

    /**
     * Validate an api call
     */
    checkRequirements: function(method_name, required, callOptions, callback) {
      for(var r=0, last=required.length, arg; r<last; r++) {
        arg = required[r];
        if(arg.name === "api_key") continue;
        if(!callOptions.hasOwnProperty(arg.name)) {
          return callback(new Error("missing required argument '"+arg.name+"' in call to "+method_name));
        }
      }
    },

    /**
     * Generate the query arguments for querying flickr
     */
    generateQueryArguments: function(method_name, flickrOptions, callOptions) {
      // set up authorized method access
      var queryArguments = {
        method: method_name,
        api_key: flickrOptions.api_key
      };

      // set up bindings for method-specific args
      if (callOptions) {
        Object.keys(callOptions).forEach(function(key) {
          queryArguments[key] = callOptions[key];
        });
      }

      return queryArguments;
    },

    /**
     * Generate an API function
     */
    generateAPIFunction: function(method_name, flickrOptions, security, required, optional, errors) {
      var Utils = this, fn;

      // Will we need to be authenticated to call this function?
      if(flickrOptions.tokenonly && security.needslogin===1) {
        fn = function(callOptions, callback) {
          if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
          callback("the "+method_name+" function requires authentication, and can only be called through an authenticated Flickr API instance.");
        };
      }

      // code path for compiling the client-side JS library
      else if(typeof process.CLIENT_COMPILE !== "undefined") {
       fn = function(callOptions, callback) {
          if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
          var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
          Utils.queryFlickr(queryArguments, this.flickrOptions, security, callback);
        };
      }

      // server-side code path
      else {
        fn = function(callOptions, callback) {
          if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
          Utils.checkRequirements(method_name, required, callOptions, callback);
          var queryArguments = Utils.generateQueryArguments(method_name, flickrOptions, callOptions);
          Utils.queryFlickr(queryArguments, flickrOptions, security, callback, errors);
        };
      }

      fn.data = {
        required: required,
        optional: optional,
        errors: errors,
        security: security,
        name: method_name,
        url: "https://www.flickr.com/services/api/"+method_name+".html"
      };

      return fn;
    },

    /**
     * Call the Flickr API
     */
    queryFlickr: function(queryArguments, flickrOptions, security, processResult, errors) {
      queryArguments = JSON.parse(JSON.stringify(queryArguments));

      if(arguments.length === 3) {
        processResult = arguments[2];
        security = {};
        errors = {};
      }

      var authed = (security.needssigning === 1) || queryArguments.authenticated || flickrOptions.force_auth;

      // do we need to HMAC-SHA1 sign this URL?
      if (authed) {
        flickrOptions = this.setAuthVals(flickrOptions);
        queryArguments.oauth_nonce = flickrOptions.oauth_nonce;
        queryArguments.oauth_timestamp = flickrOptions.oauth_timestamp;
        queryArguments.oauth_consumer_key = flickrOptions.api_key;
        queryArguments.oauth_token = flickrOptions.access_token;
        queryArguments.oauth_signature_method = "HMAC-SHA1";
      }

      // nope - plain API key will suffice
      else {
        queryArguments.api_key = flickrOptions.api_key;
      }

      // force JSON request
      queryArguments.format = "json";

      var url = "https://api.flickr.com/services/rest/",
          queryString = this.formQueryString(queryArguments),
          data = this.formBaseString("GET", url, queryString),
          signature = authed ? "&oauth_signature=" + this.sign(data, flickrOptions.secret, flickrOptions.access_token_secret) : '',
          flickrURL = url + "?" + queryString + signature;

      request.get(flickrURL, function(error, response, body) {

        if(!response) {
          error = "HTTP Error: no response for url [" + flickrURL + "]";
          if (flickrOptions.retry_queries) {
            return this.queryFlickr(queryArguments, flickrOptions, security, processResult, errors);
          }
          return processResult(error);
        }

        if(!body) {
          error = "HTTP Error " + response.statusCode + " (" + statusCodes[response.statusCode] + ")";
          return processResult(error);
        }

        // we can transform the error into something more
        // indicative if "errors" is an array of known errors
        // for this specific method call.
        if(!error) {
          try {
            body = body.trim().replace(/^jsonFlickrApi\(/,'').replace(/\}\)$/,'}');
            body = JSON.parse(body);
            if(body.stat !== "ok") {
              return processResult(new Error(body.message));
            }
          } catch (e) {
            return processResult("could not parse body as JSON: " + body);
          }
        }

        processResult(false, body);
      }.bind(this));
    },

    /**
     * Call the Flickr API for uploading a photo. Uploading is always authenticated.
     *
     *  photo: The file to upload.
     *
     *  title (optional): The title of the photo.
     *  description (optional): A description of the photo. May contain some limited HTML.
     *  tags (optional): A space-seperated list of tags to apply to the photo.
     *  is_public, is_friend, is_family (optional): Set to 0 for no, 1 for yes. Specifies who can view the photo.
     *  safety_level (optional): Set to 1 for Safe, 2 for Moderate, or 3 for Restricted.
     *  content_type (optional): Set to 1 for Photo, 2 for Screenshot, or 3 for Other.
     *  hidden (optional): Set to 1 to keep the photo in global search results, 2 to hide from public searches.
     *
     */
    upload: function(uploadOptions, flickrOptions, processResult) {
      // upload oauth uses "everything except the photo itself"
      if(!uploadOptions.photos && !uploadOptions.photo) {
        return processResult("upload requires at least one photo is passed for uploading.");
      }
      if(!uploadOptions.photos) {
        uploadOptions.photos = [ uploadOptions.photo ];
      }
      var photos = uploadOptions.photos;
      var uploadids = [];
      delete uploadOptions.photos;
      var self = this;

      (function next(err, result) {
        if(err) { return processResult(err); }
        if(result) { uploadids.push(result); }
        if(photos.length === 0) { return processResult(false, uploadids); }
        self.uploadtoFlickr(photos.splice(0,1)[0], flickrOptions, next);
      }(false, false));

    },

    uploadtoFlickr: function(photoOptions, flickrOptions, callback) {
      var photo = photoOptions.photo;
      delete photoOptions.photo;
      if(typeof photo === "string") { photo = fs.createReadStream(photo); }

      // collapse tags, if used
      if(photoOptions.tags && photoOptions.tags.forEach) {
        photoOptions.tags = photoOptions.tags.map(function(v) {
          return '"' + v.replace(/'/g,'%27') + '"';
        }).join(" ");
      }

      // perform title replacement for quotes
      if(photoOptions.title) {
        photoOptions.title = photoOptions.title.replace(/'/g,'%27').replace(/"/g,'%22')
      }

      flickrOptions = this.setAuthVals(flickrOptions);
      photoOptions.oauth_signature_method = "HMAC-SHA1";
      photoOptions.oauth_consumer_key = flickrOptions.api_key;
      photoOptions.oauth_token = flickrOptions.access_token;
      photoOptions.oauth_nonce = flickrOptions.oauth_nonce;
      photoOptions.oauth_timestamp = flickrOptions.oauth_timestamp;

      // craft the authentication signature
      var url = "https://up.flickr.com/services/upload/";
      var queryString = this.formQueryString(photoOptions);
      var data = this.formBaseString("POST", url, queryString);
      photoOptions.oauth_signature = this.sign(data, flickrOptions.secret, flickrOptions.access_token_secret);

      // now we can put the photo back in
      photoOptions.photo = photo;

      // restore the percentage encoded quotes in tags and titles
      photoOptions.tags = photoOptions.tags.replace(/%27/g,"'");
      photoOptions.title = photoOptions.title.replace(/%27/g,"'").replace(/%22/g,'"');

      // and finally, form the URL we need to POST to
      var signature = "&oauth_signature=" + photoOptions.oauth_signature;
      var flickrURL = url + "?" + queryString + signature;

      var req = request.post(flickrURL, function(error, response, body) {
        // format:json does not actually work, so we need to grab the photo ID from the response XML:
        // <?xml version="1.0" encoding="utf-8" ?>\n<rsp stat="ok">\n<photoid>.........</photoid>\n</rsp>\n
        var data;
        if(!body) {
          error = error || "No body found in response";
        } else if (body.indexOf('rsp stat="ok"')>-1) {
          data = parseInt(body.split("<photoid>")[1].split("</photoid>")[0], 10);
        }
        callback(error, data);
      });
      var form = req.form();
      Object.keys(photoOptions).forEach(function(prop) {
        form.append(prop, photoOptions[prop]);
      });
    }
  };
}());
