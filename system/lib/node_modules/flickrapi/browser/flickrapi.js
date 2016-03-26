(function() {
 var Utils = {};
Utils.formQueryString = function (queryArguments) {
    var args = [],
        append = function(key) {
          args.push(key + "=" + encodeURIComponent(queryArguments[key]));
        };
    Object.keys(queryArguments).sort().forEach(append);
    return args.join("&");
  };
Utils.checkRequirements = function (method_name, required, callOptions, callback) {
    required = required || [];
    for(var r=0, last=required.length, arg; r<last; r++) {
      arg = required[r];
      if(arg.name === "api_key") continue;
      if(!callOptions.hasOwnProperty(arg.name)) {
        return callback(new Error("missing required argument '"+arg.name+"' in call to "+method_name));
      }
    }
  };
Utils.generateAPIFunction = function (method) {
    return function(callOptions, callback) {
      if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
      var queryArguments = Utils.generateQueryArguments(method.name, this.flickrOptions, callOptions);
      Utils.queryFlickr(queryArguments, this.flickrOptions, method.security, callback);
    };
  };
Utils.generateAPIDevFunction = function (method) {
    return function(callOptions, callback) {
      if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
      Utils.checkRequirements(method.name, method.required, callOptions, callback);
      var queryArguments = Utils.generateQueryArguments(method.name, this.flickrOptions, callOptions);
      Utils.queryFlickr(queryArguments, this.flickrOptions, method.security, callback, method.errors);
    };
  };
Utils.generateQueryArguments = function (method_name, flickrOptions, callOptions) {
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
  };
Utils.queryFlickr = function (queryArguments, flickrOptions, security, processResult) {
    if(flickrOptions.endpoint) {
      return this.queryProxyEndpoint(queryArguments, flickrOptions, processResult);
    }
    return this.queryFlickrAPI(queryArguments, flickrOptions, security, processResult);
  };
Utils.upload = function (uploadOptions, flickrOptions, processResult) {
    return processResult(new Error("Uploading directly from the browser is not supported"));
  };
Utils.queryFlickrAPI = function (queryArguments, flickrOptions, security, processResult) {
    var url = "https://api.flickr.com/services/rest/",
        queryString = this.formQueryString(queryArguments),
        flickrURL = url + "?" + queryString;
    // Do we need special permissions? (read private, 1, write, 2, or delete, 3)?
    // if so, those are currently not supported. Send an error-notification.
    if(security.requiredperms > 0) {
      return processResult(new Error("signed calls (write/delete) currently not supported"));
    }
    this.handleURLRequest("GET", flickrURL, processResult);
  };
Utils.queryProxyEndpoint = function (queryArguments, flickrOptions, processResult) {
    var queryString = this.formQueryString(queryArguments),
        url = flickrOptions.endpoint + "?" + queryString;
    this.handleURLRequest("POST", url, processResult, queryArguments);
  };
Utils.handleURLRequest = function (verb, url, processResult, postdata) {
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
  };
 Utils.errors = {
    "96": {
        "code": 96,
        "message": "Invalid signature",
        "_content": "The passed signature was invalid."
    },
    "97": {
        "code": 97,
        "message": "Missing signature",
        "_content": "The call required signing but no signature was sent."
    },
    "98": {
        "code": 98,
        "message": "Login failed / Invalid auth token",
        "_content": "The login details or auth token passed were invalid."
    },
    "99": {
        "code": 99,
        "message": "User not logged in / Insufficient permissions",
        "_content": "The method requires user authentication but the user was not logged in, or the authenticated method call did not have the required permissions."
    },
    "100": {
        "code": 100,
        "message": "Invalid API Key",
        "_content": "The API key passed was not valid or has expired."
    },
    "105": {
        "code": 105,
        "message": "Service currently unavailable",
        "_content": "The requested service is temporarily unavailable."
    },
    "106": {
        "code": 106,
        "message": "Write operation failed",
        "_content": "The requested operation failed due to a temporary issue."
    },
    "108": {
        "code": "108",
        "message": "Invalid frob",
        "_content": "The specified frob does not exist or has already been used."
    },
    "111": {
        "code": 111,
        "message": "Format \"xxx\" not found",
        "_content": "The requested response format was not found."
    },
    "112": {
        "code": 112,
        "message": "Method \"xxx\" not found",
        "_content": "The requested method was not found."
    },
    "114": {
        "code": 114,
        "message": "Invalid SOAP envelope",
        "_content": "The SOAP envelope send in the request could not be parsed."
    },
    "115": {
        "code": 115,
        "message": "Invalid XML-RPC Method Call",
        "_content": "The XML-RPC request document could not be parsed."
    },
    "116": {
        "code": 116,
        "message": "Bad URL found",
        "_content": "One or more arguments contained a URL that has been used for abuse on Flickr."
    }
};
 var Flickr = function (flickrOptions) {
  this.bindOptions(flickrOptions);
};
 Flickr.prototype = {};
 Flickr.methods = {
 "flickr.activity.userComments": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.activity.userComments"
 },
 "flickr.activity.userPhotos": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.activity.userPhotos"
 },
 "flickr.auth.checkToken": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.auth.checkToken"
 },
 "flickr.auth.getFrob": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.auth.getFrob"
 },
 "flickr.auth.getFullToken": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.auth.getFullToken"
 },
 "flickr.auth.getToken": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.auth.getToken"
 },
 "flickr.auth.oauth.checkToken": {
  "security": {
   "needslogin": 0,
   "needssigning": 1,
   "requiredperms": 0
  },
  "name": "flickr.auth.oauth.checkToken"
 },
 "flickr.auth.oauth.getAccessToken": {
  "security": {
   "needslogin": 0,
   "needssigning": 1,
   "requiredperms": 0
  },
  "name": "flickr.auth.oauth.getAccessToken"
 },
 "flickr.blogs.getList": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.blogs.getList"
 },
 "flickr.blogs.getServices": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.blogs.getServices"
 },
 "flickr.blogs.postPhoto": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.blogs.postPhoto"
 },
 "flickr.cameras.getBrandModels": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.cameras.getBrandModels"
 },
 "flickr.cameras.getBrands": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.cameras.getBrands"
 },
 "flickr.collections.getInfo": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.collections.getInfo"
 },
 "flickr.collections.getTree": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.collections.getTree"
 },
 "flickr.commons.getInstitutions": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.commons.getInstitutions"
 },
 "flickr.contacts.getList": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.contacts.getList"
 },
 "flickr.contacts.getListRecentlyUploaded": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.contacts.getListRecentlyUploaded"
 },
 "flickr.contacts.getPublicList": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.contacts.getPublicList"
 },
 "flickr.contacts.getTaggingSuggestions": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.contacts.getTaggingSuggestions"
 },
 "flickr.favorites.add": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.favorites.add"
 },
 "flickr.favorites.getContext": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.favorites.getContext"
 },
 "flickr.favorites.getList": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.favorites.getList"
 },
 "flickr.favorites.getPublicList": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.favorites.getPublicList"
 },
 "flickr.favorites.remove": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.favorites.remove"
 },
 "flickr.galleries.addPhoto": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.galleries.addPhoto"
 },
 "flickr.galleries.create": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.galleries.create"
 },
 "flickr.galleries.editMeta": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.galleries.editMeta"
 },
 "flickr.galleries.editPhoto": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.galleries.editPhoto"
 },
 "flickr.galleries.editPhotos": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.galleries.editPhotos"
 },
 "flickr.galleries.getInfo": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.galleries.getInfo"
 },
 "flickr.galleries.getList": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.galleries.getList"
 },
 "flickr.galleries.getListForPhoto": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.galleries.getListForPhoto"
 },
 "flickr.galleries.getPhotos": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.galleries.getPhotos"
 },
 "flickr.groups.browse": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.groups.browse"
 },
 "flickr.groups.discuss.replies.add": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.groups.discuss.replies.add"
 },
 "flickr.groups.discuss.replies.delete": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 3
  },
  "name": "flickr.groups.discuss.replies.delete"
 },
 "flickr.groups.discuss.replies.edit": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.groups.discuss.replies.edit"
 },
 "flickr.groups.discuss.replies.getInfo": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.groups.discuss.replies.getInfo"
 },
 "flickr.groups.discuss.replies.getList": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.groups.discuss.replies.getList"
 },
 "flickr.groups.discuss.topics.add": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.groups.discuss.topics.add"
 },
 "flickr.groups.discuss.topics.getInfo": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.groups.discuss.topics.getInfo"
 },
 "flickr.groups.discuss.topics.getList": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.groups.discuss.topics.getList"
 },
 "flickr.groups.getInfo": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.groups.getInfo"
 },
 "flickr.groups.join": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.groups.join"
 },
 "flickr.groups.joinRequest": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.groups.joinRequest"
 },
 "flickr.groups.leave": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 3
  },
  "name": "flickr.groups.leave"
 },
 "flickr.groups.members.getList": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.groups.members.getList"
 },
 "flickr.groups.pools.add": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.groups.pools.add"
 },
 "flickr.groups.pools.getContext": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.groups.pools.getContext"
 },
 "flickr.groups.pools.getGroups": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.groups.pools.getGroups"
 },
 "flickr.groups.pools.getPhotos": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.groups.pools.getPhotos"
 },
 "flickr.groups.pools.remove": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.groups.pools.remove"
 },
 "flickr.groups.search": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.groups.search"
 },
 "flickr.interestingness.getList": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.interestingness.getList"
 },
 "flickr.machinetags.getNamespaces": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.machinetags.getNamespaces"
 },
 "flickr.machinetags.getPairs": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.machinetags.getPairs"
 },
 "flickr.machinetags.getPredicates": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.machinetags.getPredicates"
 },
 "flickr.machinetags.getRecentValues": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.machinetags.getRecentValues"
 },
 "flickr.machinetags.getValues": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.machinetags.getValues"
 },
 "flickr.panda.getList": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.panda.getList"
 },
 "flickr.panda.getPhotos": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.panda.getPhotos"
 },
 "flickr.people.findByEmail": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.people.findByEmail"
 },
 "flickr.people.findByUsername": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.people.findByUsername"
 },
 "flickr.people.getGroups": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.people.getGroups"
 },
 "flickr.people.getInfo": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.people.getInfo"
 },
 "flickr.people.getLimits": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.people.getLimits"
 },
 "flickr.people.getPhotos": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.people.getPhotos"
 },
 "flickr.people.getPhotosOf": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.people.getPhotosOf"
 },
 "flickr.people.getPublicGroups": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.people.getPublicGroups"
 },
 "flickr.people.getPublicPhotos": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.people.getPublicPhotos"
 },
 "flickr.people.getUploadStatus": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.people.getUploadStatus"
 },
 "flickr.photos.addTags": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.addTags"
 },
 "flickr.photos.comments.addComment": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.comments.addComment"
 },
 "flickr.photos.comments.deleteComment": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.comments.deleteComment"
 },
 "flickr.photos.comments.editComment": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.comments.editComment"
 },
 "flickr.photos.comments.getList": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.comments.getList"
 },
 "flickr.photos.comments.getRecentForContacts": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.comments.getRecentForContacts"
 },
 "flickr.photos.delete": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 3
  },
  "name": "flickr.photos.delete"
 },
 "flickr.photos.geo.batchCorrectLocation": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.geo.batchCorrectLocation"
 },
 "flickr.photos.geo.correctLocation": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.geo.correctLocation"
 },
 "flickr.photos.geo.getLocation": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.geo.getLocation"
 },
 "flickr.photos.geo.getPerms": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.geo.getPerms"
 },
 "flickr.photos.geo.photosForLocation": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.geo.photosForLocation"
 },
 "flickr.photos.geo.removeLocation": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.geo.removeLocation"
 },
 "flickr.photos.geo.setContext": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.geo.setContext"
 },
 "flickr.photos.geo.setLocation": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.geo.setLocation"
 },
 "flickr.photos.geo.setPerms": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.geo.setPerms"
 },
 "flickr.photos.getAllContexts": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.getAllContexts"
 },
 "flickr.photos.getContactsPhotos": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.getContactsPhotos"
 },
 "flickr.photos.getContactsPublicPhotos": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.getContactsPublicPhotos"
 },
 "flickr.photos.getContext": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.getContext"
 },
 "flickr.photos.getCounts": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.getCounts"
 },
 "flickr.photos.getExif": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.getExif"
 },
 "flickr.photos.getFavorites": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.getFavorites"
 },
 "flickr.photos.getInfo": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.getInfo"
 },
 "flickr.photos.getNotInSet": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.getNotInSet"
 },
 "flickr.photos.getPerms": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.getPerms"
 },
 "flickr.photos.getRecent": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.getRecent"
 },
 "flickr.photos.getSizes": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.getSizes"
 },
 "flickr.photos.getUntagged": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.getUntagged"
 },
 "flickr.photos.getWithGeoData": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.getWithGeoData"
 },
 "flickr.photos.getWithoutGeoData": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.getWithoutGeoData"
 },
 "flickr.photos.licenses.getInfo": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.licenses.getInfo"
 },
 "flickr.photos.licenses.setLicense": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.licenses.setLicense"
 },
 "flickr.photos.notes.add": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.notes.add"
 },
 "flickr.photos.notes.delete": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.notes.delete"
 },
 "flickr.photos.notes.edit": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.notes.edit"
 },
 "flickr.photos.people.add": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.people.add"
 },
 "flickr.photos.people.delete": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.people.delete"
 },
 "flickr.photos.people.deleteCoords": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.people.deleteCoords"
 },
 "flickr.photos.people.editCoords": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.people.editCoords"
 },
 "flickr.photos.people.getList": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.people.getList"
 },
 "flickr.photos.recentlyUpdated": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.recentlyUpdated"
 },
 "flickr.photos.removeTag": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.removeTag"
 },
 "flickr.photos.search": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.search"
 },
 "flickr.photos.setContentType": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.setContentType"
 },
 "flickr.photos.setDates": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.setDates"
 },
 "flickr.photos.setMeta": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.setMeta"
 },
 "flickr.photos.setPerms": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.setPerms"
 },
 "flickr.photos.setSafetyLevel": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.setSafetyLevel"
 },
 "flickr.photos.setTags": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.setTags"
 },
 "flickr.photos.suggestions.approveSuggestion": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.suggestions.approveSuggestion"
 },
 "flickr.photos.suggestions.getList": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.suggestions.getList"
 },
 "flickr.photos.suggestions.rejectSuggestion": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.suggestions.rejectSuggestion"
 },
 "flickr.photos.suggestions.removeSuggestion": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.suggestions.removeSuggestion"
 },
 "flickr.photos.suggestions.suggestLocation": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.suggestions.suggestLocation"
 },
 "flickr.photos.transform.rotate": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.transform.rotate"
 },
 "flickr.photos.upload.checkTickets": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.upload.checkTickets"
 },
 "flickr.photosets.addPhoto": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.addPhoto"
 },
 "flickr.photosets.comments.addComment": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.comments.addComment"
 },
 "flickr.photosets.comments.deleteComment": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.comments.deleteComment"
 },
 "flickr.photosets.comments.editComment": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.comments.editComment"
 },
 "flickr.photosets.comments.getList": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photosets.comments.getList"
 },
 "flickr.photosets.create": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.create"
 },
 "flickr.photosets.delete": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.delete"
 },
 "flickr.photosets.editMeta": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.editMeta"
 },
 "flickr.photosets.editPhotos": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.editPhotos"
 },
 "flickr.photosets.getContext": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photosets.getContext"
 },
 "flickr.photosets.getInfo": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photosets.getInfo"
 },
 "flickr.photosets.getList": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photosets.getList"
 },
 "flickr.photosets.getPhotos": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photosets.getPhotos"
 },
 "flickr.photosets.orderSets": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.orderSets"
 },
 "flickr.photosets.removePhoto": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.removePhoto"
 },
 "flickr.photosets.removePhotos": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.removePhotos"
 },
 "flickr.photosets.reorderPhotos": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.reorderPhotos"
 },
 "flickr.photosets.setPrimaryPhoto": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.setPrimaryPhoto"
 },
 "flickr.places.find": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.find"
 },
 "flickr.places.findByLatLon": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.findByLatLon"
 },
 "flickr.places.getChildrenWithPhotosPublic": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.getChildrenWithPhotosPublic"
 },
 "flickr.places.getInfo": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.getInfo"
 },
 "flickr.places.getInfoByUrl": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.getInfoByUrl"
 },
 "flickr.places.getPlaceTypes": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.getPlaceTypes"
 },
 "flickr.places.getShapeHistory": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.getShapeHistory"
 },
 "flickr.places.getTopPlacesList": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.getTopPlacesList"
 },
 "flickr.places.placesForBoundingBox": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.placesForBoundingBox"
 },
 "flickr.places.placesForContacts": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.places.placesForContacts"
 },
 "flickr.places.placesForTags": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.placesForTags"
 },
 "flickr.places.placesForUser": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.places.placesForUser"
 },
 "flickr.places.resolvePlaceId": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.resolvePlaceId"
 },
 "flickr.places.resolvePlaceURL": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.resolvePlaceURL"
 },
 "flickr.places.tagsForPlace": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.tagsForPlace"
 },
 "flickr.prefs.getContentType": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.prefs.getContentType"
 },
 "flickr.prefs.getGeoPerms": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.prefs.getGeoPerms"
 },
 "flickr.prefs.getHidden": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.prefs.getHidden"
 },
 "flickr.prefs.getPrivacy": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.prefs.getPrivacy"
 },
 "flickr.prefs.getSafetyLevel": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.prefs.getSafetyLevel"
 },
 "flickr.push.getSubscriptions": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.push.getSubscriptions"
 },
 "flickr.push.getTopics": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.push.getTopics"
 },
 "flickr.push.subscribe": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.push.subscribe"
 },
 "flickr.push.unsubscribe": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.push.unsubscribe"
 },
 "flickr.reflection.getMethodInfo": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.reflection.getMethodInfo"
 },
 "flickr.reflection.getMethods": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.reflection.getMethods"
 },
 "flickr.stats.getCollectionDomains": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getCollectionDomains"
 },
 "flickr.stats.getCollectionReferrers": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getCollectionReferrers"
 },
 "flickr.stats.getCollectionStats": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getCollectionStats"
 },
 "flickr.stats.getCSVFiles": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getCSVFiles"
 },
 "flickr.stats.getPhotoDomains": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotoDomains"
 },
 "flickr.stats.getPhotoReferrers": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotoReferrers"
 },
 "flickr.stats.getPhotosetDomains": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotosetDomains"
 },
 "flickr.stats.getPhotosetReferrers": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotosetReferrers"
 },
 "flickr.stats.getPhotosetStats": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotosetStats"
 },
 "flickr.stats.getPhotoStats": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotoStats"
 },
 "flickr.stats.getPhotostreamDomains": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotostreamDomains"
 },
 "flickr.stats.getPhotostreamReferrers": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotostreamReferrers"
 },
 "flickr.stats.getPhotostreamStats": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotostreamStats"
 },
 "flickr.stats.getPopularPhotos": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPopularPhotos"
 },
 "flickr.stats.getTotalViews": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getTotalViews"
 },
 "flickr.tags.getClusterPhotos": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.tags.getClusterPhotos"
 },
 "flickr.tags.getClusters": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.tags.getClusters"
 },
 "flickr.tags.getHotList": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.tags.getHotList"
 },
 "flickr.tags.getListPhoto": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.tags.getListPhoto"
 },
 "flickr.tags.getListUser": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.tags.getListUser"
 },
 "flickr.tags.getListUserPopular": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.tags.getListUserPopular"
 },
 "flickr.tags.getListUserRaw": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.tags.getListUserRaw"
 },
 "flickr.tags.getMostFrequentlyUsed": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.tags.getMostFrequentlyUsed"
 },
 "flickr.tags.getRelated": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.tags.getRelated"
 },
 "flickr.test.echo": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.test.echo"
 },
 "flickr.test.login": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.test.login"
 },
 "flickr.test.null": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.test.null"
 },
 "flickr.urls.getGroup": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.urls.getGroup"
 },
 "flickr.urls.getUserPhotos": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.urls.getUserPhotos"
 },
 "flickr.urls.getUserProfile": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.urls.getUserProfile"
 },
 "flickr.urls.lookupGallery": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.urls.lookupGallery"
 },
 "flickr.urls.lookupGroup": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.urls.lookupGroup"
 },
 "flickr.urls.lookupUser": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.urls.lookupUser"
 }
};

(function () {
  Object.keys(Flickr.methods).forEach(function(method) {
    var level = method.split(".").slice(1);
    var e = Flickr.prototype, key;
    while(level.length > 1) {
      key = level.splice(0,1)[0];
      if(!e[key]) { e[key] = {}; }
      e = e[key];
    }
    e[level] = Utils.generateAPIFunction(Flickr.methods[method]);
  });
}());

 Flickr.prototype.bindOptions = function (flickrOptions) {
  this.flickrOptions = flickrOptions;
  (function bindOptions(obj, props) {
    Object.keys(props).forEach(function(key) {
      if (key === "flickrOptions") return;
      if (typeof obj[key] === "object") {
        bindOptions(obj[key], props[key]);
        obj[key].flickrOptions = flickrOptions;
      }
    });
  }(this, Flickr.prototype));
};

 window.Flickr = Flickr;
}());
