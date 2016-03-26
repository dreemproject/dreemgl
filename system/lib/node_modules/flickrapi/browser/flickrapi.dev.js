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
  "optional": [
   {
    "name": "per_page",
    "_content": "Number of items to return per page. If this argument is omitted, it defaults to 10. The maximum allowed value is 50."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.activity.userComments",
  "url": "https://www.flickr.com/services/api/flickr.activity.userComments.html"
 },
 "flickr.activity.userPhotos": {
  "optional": [
   {
    "name": "timeframe",
    "_content": "The timeframe in which to return updates for. This can be specified in days (<code>'2d'</code>) or hours (<code>'4h'</code>). The default behavoir is to return changes since the beginning of the previous user session."
   },
   {
    "name": "per_page",
    "_content": "Number of items to return per page. If this argument is omitted, it defaults to 10. The maximum allowed value is 50."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.activity.userPhotos",
  "url": "https://www.flickr.com/services/api/flickr.activity.userPhotos.html"
 },
 "flickr.auth.checkToken": {
  "required": [
   {
    "name": "auth_token",
    "_content": "The authentication token to check."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.auth.checkToken",
  "url": "https://www.flickr.com/services/api/flickr.auth.checkToken.html"
 },
 "flickr.auth.getFrob": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.auth.getFrob",
  "url": "https://www.flickr.com/services/api/flickr.auth.getFrob.html"
 },
 "flickr.auth.getFullToken": {
  "required": [
   {
    "name": "mini_token",
    "_content": "The mini-token typed in by a user. It should be 9 digits long. It may optionally contain dashes."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Mini-token not found",
    "_content": "The passed mini-token was not valid."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.auth.getFullToken",
  "url": "https://www.flickr.com/services/api/flickr.auth.getFullToken.html"
 },
 "flickr.auth.getToken": {
  "required": [
   {
    "name": "frob",
    "_content": "The frob to check."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.auth.getToken",
  "url": "https://www.flickr.com/services/api/flickr.auth.getToken.html"
 },
 "flickr.auth.oauth.checkToken": {
  "required": [
   {
    "name": "oauth_token",
    "_content": "The OAuth authentication token to check."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 1,
   "requiredperms": 0
  },
  "name": "flickr.auth.oauth.checkToken",
  "url": "https://www.flickr.com/services/api/flickr.auth.oauth.checkToken.html"
 },
 "flickr.auth.oauth.getAccessToken": {
  "security": {
   "needslogin": 0,
   "needssigning": 1,
   "requiredperms": 0
  },
  "name": "flickr.auth.oauth.getAccessToken",
  "url": "https://www.flickr.com/services/api/flickr.auth.oauth.getAccessToken.html"
 },
 "flickr.blogs.getList": {
  "optional": [
   {
    "name": "service",
    "_content": "Optionally only return blogs for a given service id.  You can get a list of from <a href=\"/services/api/flickr.blogs.getServices.html\">flickr.blogs.getServices()</a>."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.blogs.getList",
  "url": "https://www.flickr.com/services/api/flickr.blogs.getList.html"
 },
 "flickr.blogs.getServices": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.blogs.getServices",
  "url": "https://www.flickr.com/services/api/flickr.blogs.getServices.html"
 },
 "flickr.blogs.postPhoto": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to blog"
   },
   {
    "name": "title",
    "_content": "The blog post title"
   },
   {
    "name": "description",
    "_content": "The blog post body"
   }
  ],
  "optional": [
   {
    "name": "blog_id",
    "_content": "The id of the blog to post to."
   },
   {
    "name": "blog_password",
    "_content": "The password for the blog (used when the blog does not have a stored password)."
   },
   {
    "name": "service",
    "_content": "A Flickr supported blogging service.  Instead of passing a blog id you can pass a service id and we'll post to the first blog of that service we find."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Blog not found",
    "_content": "The blog id was not the id of a blog belonging to the calling user"
   },
   {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id was not the id of a public photo"
   },
   {
    "code": "3",
    "message": "Password needed",
    "_content": "A password is not stored for the blog and one was not passed with the request"
   },
   {
    "code": "4",
    "message": "Blog post failed",
    "_content": "The blog posting failed (a blogging API failure of some sort)"
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.blogs.postPhoto",
  "url": "https://www.flickr.com/services/api/flickr.blogs.postPhoto.html"
 },
 "flickr.cameras.getBrandModels": {
  "required": [
   {
    "name": "brand",
    "_content": "The ID of the requested brand (as returned from flickr.cameras.getBrands)."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Brand not found",
    "_content": "Unable to find the given brand ID."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.cameras.getBrandModels",
  "url": "https://www.flickr.com/services/api/flickr.cameras.getBrandModels.html"
 },
 "flickr.cameras.getBrands": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.cameras.getBrands",
  "url": "https://www.flickr.com/services/api/flickr.cameras.getBrands.html"
 },
 "flickr.collections.getInfo": {
  "required": [
   {
    "name": "collection_id",
    "_content": "The ID of the collection to fetch information for."
   }
  ],
  "optional": [
   {
    "name": "secure_image_embeds",
    "_content": "This argument will secure the external image embeds in all the markup and return a secure<Field> back in addition to the <Field>"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Collection not found",
    "_content": "The requested collection could not be found or is not visible to the calling user."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.collections.getInfo",
  "url": "https://www.flickr.com/services/api/flickr.collections.getInfo.html"
 },
 "flickr.collections.getTree": {
  "optional": [
   {
    "name": "collection_id",
    "_content": "The ID of the collection to fetch a tree for, or zero to fetch the root collection. Defaults to zero."
   },
   {
    "name": "user_id",
    "_content": "The ID of the account to fetch the collection tree for. Deafults to the calling user."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "The specified user could not be found."
   },
   {
    "code": "2",
    "message": "Collection not found",
    "_content": "The specified collection does not exist."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.collections.getTree",
  "url": "https://www.flickr.com/services/api/flickr.collections.getTree.html"
 },
 "flickr.commons.getInstitutions": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.commons.getInstitutions",
  "url": "https://www.flickr.com/services/api/flickr.commons.getInstitutions.html"
 },
 "flickr.contacts.getList": {
  "optional": [
   {
    "name": "filter",
    "_content": "An optional filter of the results. The following values are valid:<br />\r\n&nbsp;\r\n<dl>\r\n\t<dt><b><code>friends</code></b></dt>\r\n\t<dl>Only contacts who are friends (and not family)</dl>\r\n\r\n\t<dt><b><code>family</code></b></dt>\r\n\t<dl>Only contacts who are family (and not friends)</dl>\r\n\r\n\t<dt><b><code>both</code></b></dt>\r\n\t<dl>Only contacts who are both friends and family</dl>\r\n\r\n\t<dt><b><code>neither</code></b></dt>\r\n\t<dl>Only contacts who are neither friends nor family</dl>\r\n</dl>"
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   },
   {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 1000. The maximum allowed value is 1000."
   },
   {
    "name": "sort",
    "_content": "The order in which to sort the returned contacts. Defaults to name. The possible values are: name and time."
   },
   {
    "name": "fields",
    "_content": "The fields can have the following args:\r\nrealname, friend, family,path_alias,location,public_photos_count,can_tag"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Invalid sort parameter.",
    "_content": "The possible values are: name and time."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.contacts.getList",
  "url": "https://www.flickr.com/services/api/flickr.contacts.getList.html"
 },
 "flickr.contacts.getListRecentlyUploaded": {
  "optional": [
   {
    "name": "date_lastupload",
    "_content": "Limits the resultset to contacts that have uploaded photos since this date. The date should be in the form of a Unix timestamp.\r\n\r\nThe default offset is (1) hour and the maximum (24) hours. "
   },
   {
    "name": "filter",
    "_content": "Limit the result set to all contacts or only those who are friends or family. Valid options are:\r\n\r\n<ul>\r\n<li><strong>ff</strong> friends and family</li>\r\n<li><strong>all</strong> all your contacts</li>\r\n</ul>\r\nDefault value is \"all\"."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.contacts.getListRecentlyUploaded",
  "url": "https://www.flickr.com/services/api/flickr.contacts.getListRecentlyUploaded.html"
 },
 "flickr.contacts.getPublicList": {
  "required": [
   {
    "name": "user_id",
    "_content": "The NSID of the user to fetch the contact list for."
   }
  ],
  "optional": [
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   },
   {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 1000. The maximum allowed value is 1000."
   },
   {
    "name": "show_more",
    "_content": "Include additional information for each contact, such as realname, is_friend, is_family, path_alias and location."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "The specified user NSID was not a valid user."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.contacts.getPublicList",
  "url": "https://www.flickr.com/services/api/flickr.contacts.getPublicList.html"
 },
 "flickr.contacts.getTaggingSuggestions": {
  "optional": [
   {
    "name": "include_self",
    "_content": "Return calling user in the list of suggestions. Default: true."
   },
   {
    "name": "include_address_book",
    "_content": "Include suggestions from the user's address book. Default: false"
   },
   {
    "name": "per_page",
    "_content": "Number of contacts to return per page. If this argument is omitted, all contacts will be returned."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.contacts.getTaggingSuggestions",
  "url": "https://www.flickr.com/services/api/flickr.contacts.getTaggingSuggestions.html"
 },
 "flickr.favorites.add": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to add to the user's favorites."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id."
   },
   {
    "code": "2",
    "message": "Photo is owned by you",
    "_content": "The photo belongs to the user and so cannot be added to their favorites."
   },
   {
    "code": "3",
    "message": "Photo is already in favorites",
    "_content": "The photo is already in the user's list of favorites."
   },
   {
    "code": "4",
    "message": "User cannot see photo",
    "_content": "The user does not have permission to add the photo to their favorites."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.favorites.add",
  "url": "https://www.flickr.com/services/api/flickr.favorites.add.html"
 },
 "flickr.favorites.getContext": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to fetch the context for."
   },
   {
    "name": "user_id",
    "_content": "The user who counts the photo as a favorite."
   }
  ],
  "optional": [
   {
    "name": "num_prev",
    "_content": ""
   },
   {
    "name": "num_next",
    "_content": ""
   },
   {
    "name": "extras",
    "_content": "A comma-delimited list of extra information to fetch for each returned record. Currently supported fields are: description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_m, url_z, url_l, url_o"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id, or was the id of a photo that the calling user does not have permission to view."
   },
   {
    "code": "2",
    "message": "User not found",
    "_content": "The specified user was not found."
   },
   {
    "code": "3",
    "message": "Photo not a favorite",
    "_content": "The specified photo is not a favorite of the specified user."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.favorites.getContext",
  "url": "https://www.flickr.com/services/api/flickr.favorites.getContext.html"
 },
 "flickr.favorites.getList": {
  "optional": [
   {
    "name": "user_id",
    "_content": "The NSID of the user to fetch the favorites list for. If this argument is omitted, the favorites list for the calling user is returned."
   },
   {
    "name": "jump_to",
    "_content": ""
   },
   {
    "name": "min_fave_date",
    "_content": "Minimum date that a photo was favorited on. The date should be in the form of a unix timestamp."
   },
   {
    "name": "max_fave_date",
    "_content": "Maximum date that a photo was favorited on. The date should be in the form of a unix timestamp."
   },
   {
    "name": "get_user_info",
    "_content": "Include info for the user who's favorites are being returned."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "The specified user NSID was not a valid flickr user."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.favorites.getList",
  "url": "https://www.flickr.com/services/api/flickr.favorites.getList.html"
 },
 "flickr.favorites.getPublicList": {
  "required": [
   {
    "name": "user_id",
    "_content": "The user to fetch the favorites list for."
   }
  ],
  "optional": [
   {
    "name": "jump_to",
    "_content": ""
   },
   {
    "name": "min_fave_date",
    "_content": "Minimum date that a photo was favorited on. The date should be in the form of a unix timestamp."
   },
   {
    "name": "max_fave_date",
    "_content": "Maximum date that a photo was favorited on. The date should be in the form of a unix timestamp."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "The specified user NSID was not a valid flickr user."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.favorites.getPublicList",
  "url": "https://www.flickr.com/services/api/flickr.favorites.getPublicList.html"
 },
 "flickr.favorites.remove": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to remove from the user's favorites."
   }
  ],
  "optional": [
   {
    "name": "user_id",
    "_content": "NSID of the user whose favorites the photo should be removed from. This only works if the calling user owns the photo."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not in favorites",
    "_content": "The photo id passed was not in the user's favorites."
   },
   {
    "code": "2",
    "message": "Cannot remove photo from that user's favorites",
    "_content": "user_id was passed as an argument, but photo_id is not owned by the authenticated user."
   },
   {
    "code": "3",
    "message": "User not found",
    "_content": "Invalid user_id argument."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.favorites.remove",
  "url": "https://www.flickr.com/services/api/flickr.favorites.remove.html"
 },
 "flickr.galleries.addPhoto": {
  "required": [
   {
    "name": "gallery_id",
    "_content": "The ID of the gallery to add a photo to.  Note: this is the compound ID returned in methods like <a href=\"/services/api/flickr.galleries.getList.html\">flickr.galleries.getList</a>, and <a href=\"/services/api/flickr.galleries.getListForPhoto.html\">flickr.galleries.getListForPhoto</a>."
   },
   {
    "name": "photo_id",
    "_content": "The photo ID to add to the gallery"
   }
  ],
  "optional": [
   {
    "name": "comment",
    "_content": "A short comment or story to accompany the photo."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more required parameters was not included with your API call."
   },
   {
    "code": "2",
    "message": "Invalid gallery ID",
    "_content": "That gallery could not be found."
   },
   {
    "code": "3",
    "message": "Invalid photo ID",
    "_content": "The requested photo could not be found."
   },
   {
    "code": "4",
    "message": "Invalid comment",
    "_content": "The comment body could not be validated."
   },
   {
    "code": "5",
    "message": "Failed to add photo",
    "_content": "Unable to add the photo to the gallery."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.galleries.addPhoto",
  "url": "https://www.flickr.com/services/api/flickr.galleries.addPhoto.html"
 },
 "flickr.galleries.create": {
  "required": [
   {
    "name": "title",
    "_content": "The name of the gallery"
   },
   {
    "name": "description",
    "_content": "A short description for the gallery"
   }
  ],
  "optional": [
   {
    "name": "primary_photo_id",
    "_content": "The first photo to add to your gallery"
   },
   {
    "name": "full_result",
    "_content": "Get the result in the same format as galleries.getList"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more of the required parameters was missing from your API call."
   },
   {
    "code": "2",
    "message": "Invalid title or description",
    "_content": "The title or the description could not be validated."
   },
   {
    "code": "3",
    "message": "Failed to add gallery",
    "_content": "There was a problem creating the gallery."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.galleries.create",
  "url": "https://www.flickr.com/services/api/flickr.galleries.create.html"
 },
 "flickr.galleries.editMeta": {
  "required": [
   {
    "name": "gallery_id",
    "_content": "The gallery ID to update."
   },
   {
    "name": "title",
    "_content": "The new title for the gallery."
   }
  ],
  "optional": [
   {
    "name": "description",
    "_content": "The new description for the gallery."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more required parameters was missing from your request."
   },
   {
    "code": "2",
    "message": "Invalid title or description",
    "_content": "The title or description arguments could not be validated."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.galleries.editMeta",
  "url": "https://www.flickr.com/services/api/flickr.galleries.editMeta.html"
 },
 "flickr.galleries.editPhoto": {
  "required": [
   {
    "name": "gallery_id",
    "_content": "The ID of the gallery to add a photo to. Note: this is the compound ID returned in methods like flickr.galleries.getList, and flickr.galleries.getListForPhoto."
   },
   {
    "name": "photo_id",
    "_content": "The photo ID to add to the gallery."
   },
   {
    "name": "comment",
    "_content": "The updated comment the photo."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Invalid gallery ID",
    "_content": "That gallery could not be found."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.galleries.editPhoto",
  "url": "https://www.flickr.com/services/api/flickr.galleries.editPhoto.html"
 },
 "flickr.galleries.editPhotos": {
  "required": [
   {
    "name": "gallery_id",
    "_content": "The id of the gallery to modify. The gallery must belong to the calling user."
   },
   {
    "name": "primary_photo_id",
    "_content": "The id of the photo to use as the 'primary' photo for the gallery. This id must also be passed along in photo_ids list argument."
   },
   {
    "name": "photo_ids",
    "_content": "A comma-delimited list of photo ids to include in the gallery. They will appear in the set in the order sent. This list must contain the primary photo id. This list of photos replaces the existing list."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.galleries.editPhotos",
  "url": "https://www.flickr.com/services/api/flickr.galleries.editPhotos.html"
 },
 "flickr.galleries.getInfo": {
  "required": [
   {
    "name": "gallery_id",
    "_content": "The gallery ID you are requesting information for."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.galleries.getInfo",
  "url": "https://www.flickr.com/services/api/flickr.galleries.getInfo.html"
 },
 "flickr.galleries.getList": {
  "required": [
   {
    "name": "user_id",
    "_content": "The NSID of the user to get a galleries list for. If none is specified, the calling user is assumed."
   }
  ],
  "optional": [
   {
    "name": "per_page",
    "_content": "Number of galleries to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   },
   {
    "name": "primary_photo_extras",
    "_content": "A comma-delimited list of extra information to fetch for the primary photo. Currently supported fields are: license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_m, url_o"
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.galleries.getList",
  "url": "https://www.flickr.com/services/api/flickr.galleries.getList.html"
 },
 "flickr.galleries.getListForPhoto": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The ID of the photo to fetch a list of galleries for."
   }
  ],
  "optional": [
   {
    "name": "per_page",
    "_content": "Number of galleries to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.galleries.getListForPhoto",
  "url": "https://www.flickr.com/services/api/flickr.galleries.getListForPhoto.html"
 },
 "flickr.galleries.getPhotos": {
  "required": [
   {
    "name": "gallery_id",
    "_content": "The ID of the gallery of photos to return"
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.galleries.getPhotos",
  "url": "https://www.flickr.com/services/api/flickr.galleries.getPhotos.html"
 },
 "flickr.groups.browse": {
  "optional": [
   {
    "name": "cat_id",
    "_content": "The category id to fetch a list of groups and sub-categories for. If not specified, it defaults to zero, the root of the category tree."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Category not found",
    "_content": "The value passed for cat_id was not a valid category id."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.groups.browse",
  "url": "https://www.flickr.com/services/api/flickr.groups.browse.html"
 },
 "flickr.groups.discuss.replies.add": {
  "required": [
   {
    "name": "topic_id",
    "_content": "The ID of the topic to post a comment to."
   },
   {
    "name": "message",
    "_content": "The message to post to the topic."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Topic not found",
    "_content": "The topic_id is invalid."
   },
   {
    "code": "2",
    "message": "Cannot post to group",
    "_content": "Either this account is not a member of the group, or discussion in this group is disabled.\r\n"
   },
   {
    "code": "3",
    "message": "Missing required arguments",
    "_content": "The topic_id and message are required."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.groups.discuss.replies.add",
  "url": "https://www.flickr.com/services/api/flickr.groups.discuss.replies.add.html"
 },
 "flickr.groups.discuss.replies.delete": {
  "required": [
   {
    "name": "topic_id",
    "_content": "The ID of the topic the post is in."
   },
   {
    "name": "reply_id",
    "_content": "The ID of the reply to delete."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Topic not found",
    "_content": "The topic_id is invalid."
   },
   {
    "code": "2",
    "message": "Reply not found",
    "_content": "The reply_id is invalid."
   },
   {
    "code": "3",
    "message": "Cannot delete reply",
    "_content": "Replies can only be edited by their owner."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 3
  },
  "name": "flickr.groups.discuss.replies.delete",
  "url": "https://www.flickr.com/services/api/flickr.groups.discuss.replies.delete.html"
 },
 "flickr.groups.discuss.replies.edit": {
  "required": [
   {
    "name": "topic_id",
    "_content": "The ID of the topic the post is in."
   },
   {
    "name": "reply_id",
    "_content": "The ID of the reply post to edit."
   },
   {
    "name": "message",
    "_content": "The message to edit the post with."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Topic not found",
    "_content": "The topic_id is invalid"
   },
   {
    "code": "2",
    "message": "Reply not found",
    "_content": "The reply_id is invalid."
   },
   {
    "code": "3",
    "message": "Missing required arguments",
    "_content": "The topic_id and reply_id are required."
   },
   {
    "code": "4",
    "message": "Cannot edit reply",
    "_content": "Replies can only be edited by their owner."
   },
   {
    "code": "5",
    "message": "Cannot post to group",
    "_content": "Either this account is not a member of the group, or discussion in this group is disabled."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.groups.discuss.replies.edit",
  "url": "https://www.flickr.com/services/api/flickr.groups.discuss.replies.edit.html"
 },
 "flickr.groups.discuss.replies.getInfo": {
  "required": [
   {
    "name": "topic_id",
    "_content": "The ID of the topic the post is in."
   },
   {
    "name": "reply_id",
    "_content": "The ID of the reply to fetch."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Topic not found",
    "_content": "The topic_id is invalid"
   },
   {
    "code": "2",
    "message": "Reply not found",
    "_content": "The reply_id is invalid"
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.groups.discuss.replies.getInfo",
  "url": "https://www.flickr.com/services/api/flickr.groups.discuss.replies.getInfo.html"
 },
 "flickr.groups.discuss.replies.getList": {
  "required": [
   {
    "name": "topic_id",
    "_content": "The ID of the topic to fetch replies for."
   },
   {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
   }
  ],
  "optional": [
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Topic not found",
    "_content": "The topic_id is invalid."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.groups.discuss.replies.getList",
  "url": "https://www.flickr.com/services/api/flickr.groups.discuss.replies.getList.html"
 },
 "flickr.groups.discuss.topics.add": {
  "required": [
   {
    "name": "group_id",
    "_content": "The NSID of the group to add a topic to.\r\n"
   },
   {
    "name": "subject",
    "_content": "The topic subject."
   },
   {
    "name": "message",
    "_content": "The topic message."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Group not found",
    "_content": "The group by that ID does not exist\r\n"
   },
   {
    "code": "2",
    "message": "Cannot post to group",
    "_content": "Either this account is not a member of the group, or discussion in this group is disabled."
   },
   {
    "code": "3",
    "message": "Message is too long",
    "_content": "The post message is too long."
   },
   {
    "code": "4",
    "message": "Missing required arguments",
    "_content": "Subject and message are required."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.groups.discuss.topics.add",
  "url": "https://www.flickr.com/services/api/flickr.groups.discuss.topics.add.html"
 },
 "flickr.groups.discuss.topics.getInfo": {
  "required": [
   {
    "name": "topic_id",
    "_content": "The ID for the topic to edit."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Topic not found",
    "_content": "The topic_id is invalid"
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.groups.discuss.topics.getInfo",
  "url": "https://www.flickr.com/services/api/flickr.groups.discuss.topics.getInfo.html"
 },
 "flickr.groups.discuss.topics.getList": {
  "required": [
   {
    "name": "group_id",
    "_content": "The NSID of the group to fetch information for."
   }
  ],
  "optional": [
   {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Group not found",
    "_content": "The group_id is invalid"
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.groups.discuss.topics.getList",
  "url": "https://www.flickr.com/services/api/flickr.groups.discuss.topics.getList.html"
 },
 "flickr.groups.getInfo": {
  "required": [
   {
    "name": "group_id",
    "_content": "The NSID of the group to fetch information for."
   }
  ],
  "optional": [
   {
    "name": "lang",
    "_content": "The language of the group name and description to fetch.  If the language is not found, the primary language of the group will be returned.\r\n\r\nValid values are the same as <a href=\"/services/feeds/\">in feeds</a>."
   },
   {
    "name": "secure_image_embeds",
    "_content": "This argument will secure the external image embeds in all the markup and return a secure<Field> back in addition to the <Field>"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Group not found",
    "_content": "The group NSID passed did not refer to a group that the calling user can see - either an invalid group is or a group that can't be seen by the calling user."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.groups.getInfo",
  "url": "https://www.flickr.com/services/api/flickr.groups.getInfo.html"
 },
 "flickr.groups.join": {
  "required": [
   {
    "name": "group_id",
    "_content": "The NSID of the Group in question"
   }
  ],
  "optional": [
   {
    "name": "accept_rules",
    "_content": "If the group has rules, they must be displayed to the user prior to joining. Passing a true value for this argument specifies that the application has displayed the group rules to the user, and that the user has agreed to them. (See flickr.groups.getInfo)."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required arguments missing",
    "_content": "The group_id doesn't exist"
   },
   {
    "code": "2",
    "message": "Group does not exist",
    "_content": "The Group does not exist"
   },
   {
    "code": "3",
    "message": "Group not availabie to the account",
    "_content": "The authed account does not have permission to view/join the group."
   },
   {
    "code": "4",
    "message": "Account is already in that group",
    "_content": "The authed account has previously joined this group"
   },
   {
    "code": "5",
    "message": "Membership in group is by invitation only.",
    "_content": "Use flickr.groups.joinRequest to contact the administrations for an invitation."
   },
   {
    "code": "6",
    "message": "User must accept the group rules before joining",
    "_content": "The user must read and accept the rules before joining. Please see the accept_rules argument for this method."
   },
   {
    "code": "10",
    "message": "Account in maximum number of groups",
    "_content": "The account is a member of the maximum number of groups."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.groups.join",
  "url": "https://www.flickr.com/services/api/flickr.groups.join.html"
 },
 "flickr.groups.joinRequest": {
  "required": [
   {
    "name": "group_id",
    "_content": "The NSID of the group to request joining."
   },
   {
    "name": "message",
    "_content": "Message to the administrators."
   },
   {
    "name": "accept_rules",
    "_content": "If the group has rules, they must be displayed to the user prior to joining. Passing a true value for this argument specifies that the application has displayed the group rules to the user, and that the user has agreed to them. (See flickr.groups.getInfo)."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required arguments missing",
    "_content": "The group_id or message argument are missing."
   },
   {
    "code": "2",
    "message": "Group does not exist",
    "_content": "The Group does not exist"
   },
   {
    "code": "3",
    "message": "Group not available to the account",
    "_content": "The authed account does not have permission to view/join the group."
   },
   {
    "code": "4",
    "message": "Account is already in that group",
    "_content": "The authed account has previously joined this group"
   },
   {
    "code": "5",
    "message": "Group is public and open",
    "_content": "The group does not require an invitation to join, please use flickr.groups.join."
   },
   {
    "code": "6",
    "message": "User must accept the group rules before joining",
    "_content": "The user must read and accept the rules before joining. Please see the accept_rules argument for this method."
   },
   {
    "code": "7",
    "message": "User has already requested to join that group",
    "_content": "A request has already been sent and is pending approval."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.groups.joinRequest",
  "url": "https://www.flickr.com/services/api/flickr.groups.joinRequest.html"
 },
 "flickr.groups.leave": {
  "required": [
   {
    "name": "group_id",
    "_content": "The NSID of the Group to leave"
   }
  ],
  "optional": [
   {
    "name": "delete_photos",
    "_content": "Delete all photos by this user from the group"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required arguments missing",
    "_content": "The group_id doesn't exist"
   },
   {
    "code": "2",
    "message": "Group does not exist",
    "_content": "The group by that ID does not exist"
   },
   {
    "code": "3",
    "message": "Account is not in that group",
    "_content": "The user is not a member of the group that was specified"
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 3
  },
  "name": "flickr.groups.leave",
  "url": "https://www.flickr.com/services/api/flickr.groups.leave.html"
 },
 "flickr.groups.members.getList": {
  "required": [
   {
    "name": "group_id",
    "_content": "Return a list of members for this group.  The group must be viewable by the Flickr member on whose behalf the API call is made."
   }
  ],
  "optional": [
   {
    "name": "membertypes",
    "_content": "Comma separated list of member types\r\n<ul>\r\n<li>2: member</li>\r\n<li>3: moderator</li>\r\n<li>4: admin</li>\r\n</ul>\r\nBy default returns all types.  (Returning super rare member type \"1: narwhal\" isn't supported by this API method)"
   },
   {
    "name": "per_page",
    "_content": "Number of members to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Group not found",
    "_content": ""
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.groups.members.getList",
  "url": "https://www.flickr.com/services/api/flickr.groups.members.getList.html"
 },
 "flickr.groups.pools.add": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to add to the group pool. The photo must belong to the calling user."
   },
   {
    "name": "group_id",
    "_content": "The NSID of the group who's pool the photo is to be added to."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a photo owned by the caling user."
   },
   {
    "code": "2",
    "message": "Group not found",
    "_content": "The group id passed was not a valid id for a group the user is a member of."
   },
   {
    "code": "3",
    "message": "Photo already in pool",
    "_content": "The specified photo is already in the pool for the specified group."
   },
   {
    "code": "4",
    "message": "Photo in maximum number of pools",
    "_content": "The photo has already been added to the maximum allowed number of pools."
   },
   {
    "code": "5",
    "message": "Photo limit reached",
    "_content": "The user has already added the maximum amount of allowed photos to the pool."
   },
   {
    "code": "6",
    "message": "Your Photo has been added to the Pending Queue for this Pool",
    "_content": "The pool is moderated, and the photo has been added to the Pending Queue. If it is approved by a group administrator, it will be added to the pool."
   },
   {
    "code": "7",
    "message": "Your Photo has already been added to the Pending Queue for this Pool",
    "_content": "The pool is moderated, and the photo has already been added to the Pending Queue."
   },
   {
    "code": "8",
    "message": "Content not allowed",
    "_content": "The content has been disallowed from the pool by the group admin(s)."
   },
   {
    "code": "10",
    "message": "Maximum number of photos in Group Pool",
    "_content": "A group pool has reached the upper limit for the number of photos allowed."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.groups.pools.add",
  "url": "https://www.flickr.com/services/api/flickr.groups.pools.add.html"
 },
 "flickr.groups.pools.getContext": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to fetch the context for."
   },
   {
    "name": "group_id",
    "_content": "The nsid of the group who's pool to fetch the photo's context for."
   }
  ],
  "optional": [
   {
    "name": "num_prev",
    "_content": ""
   },
   {
    "name": "num_next",
    "_content": ""
   },
   {
    "name": "extras",
    "_content": "A comma-delimited list of extra information to fetch for each returned record. Currently supported fields are: description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_m, url_z, url_l, url_o"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id, or was the id of a photo that the calling user does not have permission to view."
   },
   {
    "code": "2",
    "message": "Photo not in pool",
    "_content": "The specified photo is not in the specified group's pool."
   },
   {
    "code": "3",
    "message": "Group not found",
    "_content": "The specified group nsid was not a valid group or the caller does not have permission to view the group's pool."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.groups.pools.getContext",
  "url": "https://www.flickr.com/services/api/flickr.groups.pools.getContext.html"
 },
 "flickr.groups.pools.getGroups": {
  "optional": [
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   },
   {
    "name": "per_page",
    "_content": "Number of groups to return per page. If this argument is omitted, it defaults to 400. The maximum allowed value is 400."
   },
   {
    "name": "extras",
    "_content": "can take the value icon_urls_deep and return the various buddy icon sizes for the group. It can only be done by blessed APIs"
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.groups.pools.getGroups",
  "url": "https://www.flickr.com/services/api/flickr.groups.pools.getGroups.html"
 },
 "flickr.groups.pools.getPhotos": {
  "required": [
   {
    "name": "group_id",
    "_content": "The id of the group who's pool you which to get the photo list for."
   }
  ],
  "optional": [
   {
    "name": "tags",
    "_content": "A tag to filter the pool with. At the moment only one tag at a time is supported."
   },
   {
    "name": "user_id",
    "_content": "The nsid of a user. Specifiying this parameter will retrieve for you only those photos that the user has contributed to the group pool."
   },
   {
    "name": "safe_search",
    "_content": "Safe search setting:\r\n<ul>\r\n<li>1 for safe.</li>\r\n<li>2 for moderate.</li>\r\n<li>3 for restricted.</li>\r\n</ul>"
   },
   {
    "name": "jump_to",
    "_content": ""
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Group not found",
    "_content": "The group id passed was not a valid group id."
   },
   {
    "code": "2",
    "message": "You don't have permission to view this pool",
    "_content": "The logged in user (if any) does not have permission to view the pool for this group."
   },
   {
    "code": "3",
    "message": "Unknown user",
    "_content": "The user specified by user_id does not exist."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.groups.pools.getPhotos",
  "url": "https://www.flickr.com/services/api/flickr.groups.pools.getPhotos.html"
 },
 "flickr.groups.pools.remove": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to remove from the group pool. The photo must either be owned by the calling user of the calling user must be an administrator of the group."
   },
   {
    "name": "group_id",
    "_content": "The NSID of the group who's pool the photo is to removed from."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Group not found",
    "_content": "The group_id passed did not refer to a valid group."
   },
   {
    "code": "2",
    "message": "Photo not in pool",
    "_content": "The photo_id passed was not a valid id of a photo in the group pool."
   },
   {
    "code": "3",
    "message": "Insufficient permission to remove photo",
    "_content": "The calling user doesn't own the photo and is not an administrator of the group, so may not remove the photo from the pool."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.groups.pools.remove",
  "url": "https://www.flickr.com/services/api/flickr.groups.pools.remove.html"
 },
 "flickr.groups.search": {
  "required": [
   {
    "name": "text",
    "_content": "The text to search for."
   }
  ],
  "optional": [
   {
    "name": "per_page",
    "_content": "Number of groups to return per page. If this argument is ommited, it defaults to 100. The maximum allowed value is 500."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is ommited, it defaults to 1. "
   },
   {
    "name": "user_id",
    "_content": "NSID of the user, if you want to restrict your search by the groups this user is a member of. NOTE : This is experimental, and only search within the currently signed in user's groups is supported. "
   },
   {
    "name": "safe_search",
    "_content": "safe_search =1 means only safe groups\r\nsafe_search =2 means all groups\r\nsafe_search =3 means only 18+ groups\r\nDefault is 1. \r\n"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "No text passed",
    "_content": "The required text argument was ommited."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.groups.search",
  "url": "https://www.flickr.com/services/api/flickr.groups.search.html"
 },
 "flickr.interestingness.getList": {
  "optional": [
   {
    "name": "date",
    "_content": "A specific date, formatted as YYYY-MM-DD, to return interesting photos for."
   },
   {
    "name": "use_panda",
    "_content": "Always ask the pandas for interesting photos. This is a temporary argument to allow developers to update their code."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Not a valid date string.",
    "_content": "The date string passed did not validate. All dates must be formatted : YYYY-MM-DD"
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.interestingness.getList",
  "url": "https://www.flickr.com/services/api/flickr.interestingness.getList.html"
 },
 "flickr.machinetags.getNamespaces": {
  "optional": [
   {
    "name": "predicate",
    "_content": "Limit the list of namespaces returned to those that have the following predicate."
   },
   {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Not a valid predicate.",
    "_content": "Missing or invalid predicate argument."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.machinetags.getNamespaces",
  "url": "https://www.flickr.com/services/api/flickr.machinetags.getNamespaces.html"
 },
 "flickr.machinetags.getPairs": {
  "optional": [
   {
    "name": "namespace",
    "_content": "Limit the list of pairs returned to those that have the following namespace."
   },
   {
    "name": "predicate",
    "_content": "Limit the list of pairs returned to those that have the following predicate."
   },
   {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Not a valid namespace",
    "_content": "Missing or invalid namespace argument."
   },
   {
    "code": "2",
    "message": "Not a valid predicate",
    "_content": "Missing or invalid predicate argument."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.machinetags.getPairs",
  "url": "https://www.flickr.com/services/api/flickr.machinetags.getPairs.html"
 },
 "flickr.machinetags.getPredicates": {
  "optional": [
   {
    "name": "namespace",
    "_content": "Limit the list of predicates returned to those that have the following namespace."
   },
   {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Not a valid namespace",
    "_content": "Missing or invalid namespace argument."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.machinetags.getPredicates",
  "url": "https://www.flickr.com/services/api/flickr.machinetags.getPredicates.html"
 },
 "flickr.machinetags.getRecentValues": {
  "optional": [
   {
    "name": "namespace",
    "_content": "A namespace that all values should be restricted to."
   },
   {
    "name": "predicate",
    "_content": "A predicate that all values should be restricted to."
   },
   {
    "name": "added_since",
    "_content": "Only return machine tags values that have been added since this timestamp, in epoch seconds.  "
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.machinetags.getRecentValues",
  "url": "https://www.flickr.com/services/api/flickr.machinetags.getRecentValues.html"
 },
 "flickr.machinetags.getValues": {
  "required": [
   {
    "name": "namespace",
    "_content": "The namespace that all values should be restricted to."
   },
   {
    "name": "predicate",
    "_content": "The predicate that all values should be restricted to."
   }
  ],
  "optional": [
   {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   },
   {
    "name": "usage",
    "_content": "Minimum usage count."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Not a valid namespace",
    "_content": "Missing or invalid namespace argument."
   },
   {
    "code": "2",
    "message": "Not a valid predicate",
    "_content": "Missing or invalid predicate argument."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.machinetags.getValues",
  "url": "https://www.flickr.com/services/api/flickr.machinetags.getValues.html"
 },
 "flickr.panda.getList": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.panda.getList",
  "url": "https://www.flickr.com/services/api/flickr.panda.getList.html"
 },
 "flickr.panda.getPhotos": {
  "required": [
   {
    "name": "panda_name",
    "_content": "The name of the panda to ask for photos from. There are currently three pandas named:<br /><br />\r\n\r\n<ul>\r\n<li><strong><a href=\"http://flickr.com/photos/ucumari/126073203/\">ling ling</a></strong></li>\r\n<li><strong><a href=\"http://flickr.com/photos/lynnehicks/136407353\">hsing hsing</a></strong></li>\r\n<li><strong><a href=\"http://flickr.com/photos/perfectpandas/1597067182/\">wang wang</a></strong></li>\r\n</ul>\r\n\r\n<br />You can fetch a list of all the current pandas using the <a href=\"/services/api/flickr.panda.getList.html\">flickr.panda.getList</a> API method."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required parameter missing.",
    "_content": "One or more required parameters was not included with your request."
   },
   {
    "code": "2",
    "message": "Unknown panda",
    "_content": "You requested a panda we haven't met yet."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.panda.getPhotos",
  "url": "https://www.flickr.com/services/api/flickr.panda.getPhotos.html"
 },
 "flickr.people.findByEmail": {
  "required": [
   {
    "name": "find_email",
    "_content": "The email address of the user to find  (may be primary or secondary)."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "No user with the supplied email address was found."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.people.findByEmail",
  "url": "https://www.flickr.com/services/api/flickr.people.findByEmail.html"
 },
 "flickr.people.findByUsername": {
  "required": [
   {
    "name": "username",
    "_content": "The username of the user to lookup."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "No user with the supplied username was found."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.people.findByUsername",
  "url": "https://www.flickr.com/services/api/flickr.people.findByUsername.html"
 },
 "flickr.people.getGroups": {
  "required": [
   {
    "name": "user_id",
    "_content": "The NSID of the user to fetch groups for."
   }
  ],
  "optional": [
   {
    "name": "extras",
    "_content": "A comma-delimited list of extra information to fetch for each returned record. Currently supported fields are: <code>privacy</code>, <code>throttle</code>, <code>restrictions</code>"
   },
   {
    "name": "page",
    "_content": "Page number for the groups"
   },
   {
    "name": "per_page",
    "_content": "Number of groups per page"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "The user id passed did not match a Flickr user."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.people.getGroups",
  "url": "https://www.flickr.com/services/api/flickr.people.getGroups.html"
 },
 "flickr.people.getInfo": {
  "required": [
   {
    "name": "user_id",
    "_content": "The NSID of the user to fetch information about."
   },
   {
    "name": "url",
    "_content": "As an alternative to user_id, load a member based on URL, either photos or people URL."
   }
  ],
  "optional": [
   {
    "name": "fb_connected",
    "_content": "If set to 1, it checks if the user is connected to Facebook and returns that information back."
   },
   {
    "name": "storage",
    "_content": "If set to 1, it returns the storage information about the user, like the storage used and storage available."
   },
   {
    "name": "datecreate",
    "_content": "If set to 1, it returns the timestamp of the user's account creation, in MySQL DATETIME format."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "The user id passed did not match a Flickr user."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.people.getInfo",
  "url": "https://www.flickr.com/services/api/flickr.people.getInfo.html"
 },
 "flickr.people.getLimits": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.people.getLimits",
  "url": "https://www.flickr.com/services/api/flickr.people.getLimits.html"
 },
 "flickr.people.getPhotos": {
  "required": [
   {
    "name": "user_id",
    "_content": "The NSID of the user who's photos to return. A value of \"me\" will return the calling user's photos."
   }
  ],
  "optional": [
   {
    "name": "safe_search",
    "_content": "Safe search setting:\r\n\r\n<ul>\r\n<li>1 for safe.</li>\r\n<li>2 for moderate.</li>\r\n<li>3 for restricted.</li>\r\n</ul>\r\n\r\n(Please note: Un-authed calls can only see Safe content.)"
   },
   {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date should be in the form of a unix timestamp."
   },
   {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date should be in the form of a unix timestamp."
   },
   {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date should be in the form of a mysql datetime."
   },
   {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date should be in the form of a mysql datetime."
   },
   {
    "name": "content_type",
    "_content": "Content Type setting:\r\n<ul>\r\n<li>1 for photos only.</li>\r\n<li>2 for screenshots only.</li>\r\n<li>3 for 'other' only.</li>\r\n<li>4 for photos and screenshots.</li>\r\n<li>5 for screenshots and 'other'.</li>\r\n<li>6 for photos and 'other'.</li>\r\n<li>7 for photos, screenshots, and 'other' (all).</li>\r\n</ul>"
   },
   {
    "name": "privacy_filter",
    "_content": "Return photos only matching a certain privacy level. This only applies when making an authenticated call to view photos you own. Valid values are:\r\n<ul>\r\n<li>1 public photos</li>\r\n<li>2 private photos visible to friends</li>\r\n<li>3 private photos visible to family</li>\r\n<li>4 private photos visible to friends & family</li>\r\n<li>5 completely private photos</li>\r\n</ul>"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required arguments missing",
    "_content": ""
   },
   {
    "code": "2",
    "message": "Unknown user",
    "_content": "A user_id was passed which did not match a valid flickr user."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.people.getPhotos",
  "url": "https://www.flickr.com/services/api/flickr.people.getPhotos.html"
 },
 "flickr.people.getPhotosOf": {
  "required": [
   {
    "name": "user_id",
    "_content": "The NSID of the user you want to find photos of. A value of \"me\" will search against photos of the calling user, for authenticated calls."
   }
  ],
  "optional": [
   {
    "name": "owner_id",
    "_content": "An NSID of a Flickr member. This will restrict the list of photos to those taken by that member."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found.",
    "_content": "A user_id was passed which did not match a valid flickr user."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.people.getPhotosOf",
  "url": "https://www.flickr.com/services/api/flickr.people.getPhotosOf.html"
 },
 "flickr.people.getPublicGroups": {
  "required": [
   {
    "name": "user_id",
    "_content": "The NSID of the user to fetch groups for."
   }
  ],
  "optional": [
   {
    "name": "invitation_only",
    "_content": "Include public groups that require <a href=\"http://www.flickr.com/help/groups/#10\">an invitation</a> or administrator approval to join."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "The user id passed did not match a Flickr user."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.people.getPublicGroups",
  "url": "https://www.flickr.com/services/api/flickr.people.getPublicGroups.html"
 },
 "flickr.people.getPublicPhotos": {
  "required": [
   {
    "name": "user_id",
    "_content": "The NSID of the user who's photos to return."
   }
  ],
  "optional": [
   {
    "name": "safe_search",
    "_content": "Safe search setting:\r\n\r\n<ul>\r\n<li>1 for safe.</li>\r\n<li>2 for moderate.</li>\r\n<li>3 for restricted.</li>\r\n</ul>\r\n\r\n(Please note: Un-authed calls can only see Safe content.)"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "The user NSID passed was not a valid user NSID."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.people.getPublicPhotos",
  "url": "https://www.flickr.com/services/api/flickr.people.getPublicPhotos.html"
 },
 "flickr.people.getUploadStatus": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.people.getUploadStatus",
  "url": "https://www.flickr.com/services/api/flickr.people.getUploadStatus.html"
 },
 "flickr.photos.addTags": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to add tags to."
   },
   {
    "name": "tags",
    "_content": "The tags to add to the photo."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a photo that the calling user can add tags to. It could be an invalid id, or the user may not have permission to add tags to it."
   },
   {
    "code": "2",
    "message": "Maximum number of tags reached",
    "_content": "The maximum number of tags for the photo has been reached - no more tags can be added. If the current count is less than the maximum, but adding all of the tags for this request would go over the limit, the whole request is ignored. I.E. when you get this message, none of the requested tags have been added."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.addTags",
  "url": "https://www.flickr.com/services/api/flickr.photos.addTags.html"
 },
 "flickr.photos.comments.addComment": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to add a comment to."
   },
   {
    "name": "comment_text",
    "_content": "Text of the comment"
   }
  ],
  "optional": [
   {
    "name": "secure_image_embeds",
    "_content": "This argument will secure the external image embeds in all the markup and return a secure<Field> back in addition to the <Field>"
   },
   {
    "name": "expand_bbml",
    "_content": "Expand bbml in response"
   },
   {
    "name": "bbml_need_all_photo_sizes",
    "_content": "If the API needs all photo sizes added as attributes to the bbml. Use this with expand_bbml, but dont use it with use_text_for_links. Also when you give this one, you can specify primary_photo_longest_dimension or a default of 240 will be assumed"
   },
   {
    "name": "primary_photo_longest_dimension",
    "_content": "When used with bbml_need_all_photo_sizes, it specifies the maximum dimension of width and height to be used as the <img src /> url"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found.",
    "_content": "The photo id passed was not a valid photo id"
   },
   {
    "code": "8",
    "message": "Blank comment.",
    "_content": "Comment text can not be blank"
   },
   {
    "code": "9",
    "message": "User is posting comments too fast.",
    "_content": "The user has reached the limit for number of comments posted during a specific time period.  Wait a bit and try again."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.comments.addComment",
  "url": "https://www.flickr.com/services/api/flickr.photos.comments.addComment.html"
 },
 "flickr.photos.comments.deleteComment": {
  "required": [
   {
    "name": "comment_id",
    "_content": "The id of the comment to edit."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found.",
    "_content": "The requested comment is against a photo which no longer exists."
   },
   {
    "code": "2",
    "message": "Comment not found.",
    "_content": "The comment id passed was not a valid comment id"
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.comments.deleteComment",
  "url": "https://www.flickr.com/services/api/flickr.photos.comments.deleteComment.html"
 },
 "flickr.photos.comments.editComment": {
  "required": [
   {
    "name": "comment_id",
    "_content": "The id of the comment to edit."
   },
   {
    "name": "comment_text",
    "_content": "Update the comment to this text."
   }
  ],
  "optional": [
   {
    "name": "use_text_for_links",
    "_content": "Use text for links"
   },
   {
    "name": "expand_bbml",
    "_content": "Expand bbml"
   },
   {
    "name": "full_result",
    "_content": "If the caller wants the full result to be returned (as flickr.photos.comments.getComment), then this parameter should be passed in as 1."
   },
   {
    "name": "secure_image_embeds",
    "_content": "This argument will secure the external image embeds in all the markup and return a secure<Field> back in addition to the <Field>"
   },
   {
    "name": "bbml_need_all_photo_sizes",
    "_content": "If the API needs all photo sizes added as attributes to the bbml. Use this with expand_bbml, but dont use it with use_text_for_links. Also when you give this one, you can specify primary_photo_longest_dimension or a default of 240 will be assumed"
   },
   {
    "name": "primary_photo_longest_dimension",
    "_content": "When used with bbml_need_all_photo_sizes, it specifies the maximum dimension of width and height to be used as the <img src /> url"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found.",
    "_content": "The requested comment is against a photo which no longer exists."
   },
   {
    "code": "2",
    "message": "Comment not found.",
    "_content": "The comment id passed was not a valid comment id"
   },
   {
    "code": "8",
    "message": "Blank comment.",
    "_content": "Comment text can not be blank"
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.comments.editComment",
  "url": "https://www.flickr.com/services/api/flickr.photos.comments.editComment.html"
 },
 "flickr.photos.comments.getList": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to fetch comments for."
   }
  ],
  "optional": [
   {
    "name": "min_comment_date",
    "_content": "Minimum date that a a comment was added. The date should be in the form of a unix timestamp."
   },
   {
    "name": "max_comment_date",
    "_content": "Maximum date that a comment was added. The date should be in the form of a unix timestamp."
   },
   {
    "name": "page",
    "_content": ""
   },
   {
    "name": "per_page",
    "_content": ""
   },
   {
    "name": "include_faves",
    "_content": ""
   },
   {
    "name": "sort",
    "_content": "Get the comments sorted. If value is date-posted-desc,  the comments are returned in reverse chronological order. The default is chronological."
   },
   {
    "name": "secure_image_embeds",
    "_content": "This argument will secure the external image embeds in all the markup and return a secure<Field> back in addition to the <Field>"
   },
   {
    "name": "offset",
    "_content": ""
   },
   {
    "name": "limit",
    "_content": ""
   },
   {
    "name": "bbml_need_all_photo_sizes",
    "_content": "If the API needs all photo sizes added as attributes to the bbml. Use this with expand_bbml, but dont use it with use_text_for_links. Also when you give this one, you can specify primary_photo_longest_dimension or a default of 240 will be assumed"
   },
   {
    "name": "primary_photo_longest_dimension",
    "_content": "When used with bbml_need_all_photo_sizes, it specifies the maximum dimension of width and height to be used as the <img src /> url"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.comments.getList",
  "url": "https://www.flickr.com/services/api/flickr.photos.comments.getList.html"
 },
 "flickr.photos.comments.getRecentForContacts": {
  "optional": [
   {
    "name": "date_lastcomment",
    "_content": "Limits the resultset to photos that have been commented on since this date. The date should be in the form of a Unix timestamp.<br /><br />\r\nThe default, and maximum, offset is (1) hour.\r\n\r\n\r\n"
   },
   {
    "name": "contacts_filter",
    "_content": "A comma-separated list of contact NSIDs to limit the scope of the query to."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.comments.getRecentForContacts",
  "url": "https://www.flickr.com/services/api/flickr.photos.comments.getRecentForContacts.html"
 },
 "flickr.photos.delete": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to delete."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was not the id of a photo belonging to the calling user."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 3
  },
  "name": "flickr.photos.delete",
  "url": "https://www.flickr.com/services/api/flickr.photos.delete.html"
 },
 "flickr.photos.geo.batchCorrectLocation": {
  "required": [
   {
    "name": "lat",
    "_content": "The latitude of the photos to be update whose valid range is -90 to 90. Anything more than 6 decimal places will be truncated."
   },
   {
    "name": "lon",
    "_content": "The longitude of the photos to be updated whose valid range is -180 to 180. Anything more than 6 decimal places will be truncated."
   },
   {
    "name": "accuracy",
    "_content": "Recorded accuracy level of the photos to be updated. World level is 1, Country is ~3, Region ~6, City ~11, Street ~16. Current range is 1-16. Defaults to 16 if not specified."
   }
  ],
  "optional": [
   {
    "name": "place_id",
    "_content": "A Flickr Places ID. (While optional, you must pass either a valid Places ID or a WOE ID.)"
   },
   {
    "name": "woe_id",
    "_content": "A Where On Earth (WOE) ID. (While optional, you must pass either a valid Places ID or a WOE ID.)"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required arguments missing",
    "_content": "Some or all of the required arguments were not supplied."
   },
   {
    "code": "2",
    "message": "Not a valid latitude",
    "_content": "The latitude argument failed validation."
   },
   {
    "code": "3",
    "message": "Not a valid longitude",
    "_content": "The longitude argument failed validation."
   },
   {
    "code": "4",
    "message": "Not a valid accuracy",
    "_content": "The accuracy argument failed validation."
   },
   {
    "code": "5",
    "message": "Not a valid Places ID",
    "_content": "An invalid Places (or WOE) ID was passed with the API call."
   },
   {
    "code": "6",
    "message": "No photos geotagged at that location",
    "_content": "There were no geotagged photos found for the authed user at the supplied latitude, longitude and accuracy."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.geo.batchCorrectLocation",
  "url": "https://www.flickr.com/services/api/flickr.photos.geo.batchCorrectLocation.html"
 },
 "flickr.photos.geo.correctLocation": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The ID of the photo whose WOE location is being corrected."
   },
   {
    "name": "foursquare_id",
    "_content": "The venue ID for a Foursquare location. (If not passed in with correction, any existing foursquare venue will be removed)."
   }
  ],
  "optional": [
   {
    "name": "place_id",
    "_content": "A Flickr Places ID. (While optional, you must pass either a valid Places ID or a WOE ID.)"
   },
   {
    "name": "woe_id",
    "_content": "A Where On Earth (WOE) ID. (While optional, you must pass either a valid Places ID or a WOE ID.)"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User has not configured default viewing settings for location data.",
    "_content": "Before users may assign location data to a photo they must define who, by default, may view that information. Users can edit this preference at <a href=\"http://www.flickr.com/account/geo/privacy/\">http://www.flickr.com/account/geo/privacy/</a>"
   },
   {
    "code": "2",
    "message": "Missing place ID",
    "_content": "No place ID was passed to the method"
   },
   {
    "code": "3",
    "message": "Not a valid place ID",
    "_content": "The place ID passed to the method could not be identified"
   },
   {
    "code": "4",
    "message": "Server error correcting location.",
    "_content": "There was an error trying to correct the location."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.geo.correctLocation",
  "url": "https://www.flickr.com/services/api/flickr.photos.geo.correctLocation.html"
 },
 "flickr.photos.geo.getLocation": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo you want to retrieve location data for."
   }
  ],
  "optional": [
   {
    "name": "extras",
    "_content": "Extra flags."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found.",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
   },
   {
    "code": "2",
    "message": "Photo has no location information.",
    "_content": "The photo requested has no location data or is not viewable by the calling user."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.geo.getLocation",
  "url": "https://www.flickr.com/services/api/flickr.photos.geo.getLocation.html"
 },
 "flickr.photos.geo.getPerms": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to get permissions for."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
   },
   {
    "code": "2",
    "message": "Photo has no location information",
    "_content": "The photo requested has no location data or is not viewable by the calling user."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.geo.getPerms",
  "url": "https://www.flickr.com/services/api/flickr.photos.geo.getPerms.html"
 },
 "flickr.photos.geo.photosForLocation": {
  "required": [
   {
    "name": "lat",
    "_content": "The latitude whose valid range is -90 to 90. Anything more than 6 decimal places will be truncated."
   },
   {
    "name": "lon",
    "_content": "The longitude whose valid range is -180 to 180. Anything more than 6 decimal places will be truncated."
   }
  ],
  "optional": [
   {
    "name": "accuracy",
    "_content": "Recorded accuracy level of the location information. World level is 1, Country is ~3, Region ~6, City ~11, Street ~16. Current range is 1-16. Defaults to 16 if not specified."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required arguments missing",
    "_content": "One or more required arguments was missing from the method call."
   },
   {
    "code": "2",
    "message": "Not a valid latitude",
    "_content": "The latitude argument failed validation."
   },
   {
    "code": "3",
    "message": "Not a valid longitude",
    "_content": "The longitude argument failed validation."
   },
   {
    "code": "4",
    "message": "Not a valid accuracy",
    "_content": "The accuracy argument failed validation."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.geo.photosForLocation",
  "url": "https://www.flickr.com/services/api/flickr.photos.geo.photosForLocation.html"
 },
 "flickr.photos.geo.removeLocation": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo you want to remove location data from."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
   },
   {
    "code": "2",
    "message": "Photo has no location information",
    "_content": "The specified photo has not been geotagged - there is nothing to remove."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.geo.removeLocation",
  "url": "https://www.flickr.com/services/api/flickr.photos.geo.removeLocation.html"
 },
 "flickr.photos.geo.setContext": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to set context data for."
   },
   {
    "name": "context",
    "_content": "Context is a numeric value representing the photo's geotagginess beyond latitude and longitude. For example, you may wish to indicate that a photo was taken \"indoors\" or \"outdoors\". <br /><br />\r\nThe current list of context IDs is :<br /><br/>\r\n<ul>\r\n<li><strong>0</strong>, not defined.</li>\r\n<li><strong>1</strong>, indoors.</li>\r\n<li><strong>2</strong>, outdoors.</li>\r\n</ul>"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
   },
   {
    "code": "2",
    "message": "Not a valid context",
    "_content": "The context ID passed to the method is invalid."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.geo.setContext",
  "url": "https://www.flickr.com/services/api/flickr.photos.geo.setContext.html"
 },
 "flickr.photos.geo.setLocation": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to set location data for."
   },
   {
    "name": "lat",
    "_content": "The latitude whose valid range is -90 to 90. Anything more than 6 decimal places will be truncated."
   },
   {
    "name": "lon",
    "_content": "The longitude whose valid range is -180 to 180. Anything more than 6 decimal places will be truncated."
   }
  ],
  "optional": [
   {
    "name": "accuracy",
    "_content": "Recorded accuracy level of the location information. World level is 1, Country is ~3, Region ~6, City ~11, Street ~16. Current range is 1-16. Defaults to 16 if not specified."
   },
   {
    "name": "context",
    "_content": "Context is a numeric value representing the photo's geotagginess beyond latitude and longitude. For example, you may wish to indicate that a photo was taken \"indoors\" or \"outdoors\". <br /><br />\r\nThe current list of context IDs is :<br /><br/>\r\n<ul>\r\n<li><strong>0</strong>, not defined.</li>\r\n<li><strong>1</strong>, indoors.</li>\r\n<li><strong>2</strong>, outdoors.</li>\r\n</ul><br />\r\nThe default context for geotagged photos is 0, or \"not defined\"\r\n"
   },
   {
    "name": "bookmark_id",
    "_content": "Associate a geo bookmark with this photo."
   },
   {
    "name": "is_public",
    "_content": ""
   },
   {
    "name": "is_contact",
    "_content": ""
   },
   {
    "name": "is_friend",
    "_content": ""
   },
   {
    "name": "is_family",
    "_content": ""
   },
   {
    "name": "foursquare_id",
    "_content": "The venue ID for a Foursquare location."
   },
   {
    "name": "woeid",
    "_content": "A Where On Earth (WOE) ID. (If passed in, will override the default venue based on the lat/lon.)"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
   },
   {
    "code": "2",
    "message": "Required arguments missing.",
    "_content": "Some or all of the required arguments were not supplied."
   },
   {
    "code": "3",
    "message": "Not a valid latitude.",
    "_content": "The latitude argument failed validation."
   },
   {
    "code": "4",
    "message": "Not a valid longitude.",
    "_content": "The longitude argument failed validation."
   },
   {
    "code": "5",
    "message": "Not a valid accuracy.",
    "_content": "The accuracy argument failed validation."
   },
   {
    "code": "6",
    "message": "Server error.",
    "_content": "There was an unexpected problem setting location information to the photo."
   },
   {
    "code": "7",
    "message": "User has not configured default viewing settings for location data.",
    "_content": "Before users may assign location data to a photo they must define who, by default, may view that information. Users can edit this preference at <a href=\"http://www.flickr.com/account/geo/privacy/\">http://www.flickr.com/account/geo/privacy/</a>"
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.geo.setLocation",
  "url": "https://www.flickr.com/services/api/flickr.photos.geo.setLocation.html"
 },
 "flickr.photos.geo.setPerms": {
  "required": [
   {
    "name": "is_public",
    "_content": "1 to set viewing permissions for the photo's location data to public, 0 to set it to private."
   },
   {
    "name": "is_contact",
    "_content": "1 to set viewing permissions for the photo's location data to contacts, 0 to set it to private."
   },
   {
    "name": "is_friend",
    "_content": "1 to set viewing permissions for the photo's location data to friends, 0 to set it to private."
   },
   {
    "name": "is_family",
    "_content": "1 to set viewing permissions for the photo's location data to family, 0 to set it to private."
   },
   {
    "name": "photo_id",
    "_content": "The id of the photo to get permissions for."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
   },
   {
    "code": "2",
    "message": "Photo has no location information",
    "_content": "The photo requested has no location data or is not viewable by the calling user."
   },
   {
    "code": "3",
    "message": "Required arguments missing.",
    "_content": "Some or all of the required arguments were not supplied."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.geo.setPerms",
  "url": "https://www.flickr.com/services/api/flickr.photos.geo.setPerms.html"
 },
 "flickr.photos.getAllContexts": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The photo to return information for."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a valid photo."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.getAllContexts",
  "url": "https://www.flickr.com/services/api/flickr.photos.getAllContexts.html"
 },
 "flickr.photos.getContactsPhotos": {
  "optional": [
   {
    "name": "count",
    "_content": "Number of photos to return. Defaults to 10, maximum 50. This is only used if <code>single_photo</code> is not passed."
   },
   {
    "name": "just_friends",
    "_content": "set as 1 to only show photos from friends and family (excluding regular contacts)."
   },
   {
    "name": "single_photo",
    "_content": "Only fetch one photo (the latest) per contact, instead of all photos in chronological order."
   },
   {
    "name": "include_self",
    "_content": "Set to 1 to include photos from the calling user."
   },
   {
    "name": "extras",
    "_content": "A comma-delimited list of extra information to fetch for each returned record. Currently supported fields include: license, date_upload, date_taken, owner_name, icon_server, original_format, last_update. For more information see extras under <a href=\"/services/api/flickr.photos.search.html\">flickr.photos.search</a>."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.getContactsPhotos",
  "url": "https://www.flickr.com/services/api/flickr.photos.getContactsPhotos.html"
 },
 "flickr.photos.getContactsPublicPhotos": {
  "required": [
   {
    "name": "user_id",
    "_content": "The NSID of the user to fetch photos for."
   }
  ],
  "optional": [
   {
    "name": "count",
    "_content": "Number of photos to return. Defaults to 10, maximum 50. This is only used if <code>single_photo</code> is not passed."
   },
   {
    "name": "just_friends",
    "_content": "set as 1 to only show photos from friends and family (excluding regular contacts)."
   },
   {
    "name": "single_photo",
    "_content": "Only fetch one photo (the latest) per contact, instead of all photos in chronological order."
   },
   {
    "name": "include_self",
    "_content": "Set to 1 to include photos from the user specified by user_id."
   },
   {
    "name": "extras",
    "_content": "A comma-delimited list of extra information to fetch for each returned record. Currently supported fields are: license, date_upload, date_taken, owner_name, icon_server, original_format, last_update."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "The user NSID passed was not a valid user NSID."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.getContactsPublicPhotos",
  "url": "https://www.flickr.com/services/api/flickr.photos.getContactsPublicPhotos.html"
 },
 "flickr.photos.getContext": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to fetch the context for."
   }
  ],
  "optional": [
   {
    "name": "num_prev",
    "_content": ""
   },
   {
    "name": "num_next",
    "_content": ""
   },
   {
    "name": "extras",
    "_content": "A comma-delimited list of extra information to fetch for each returned record. Currently supported fields are: <code>description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_m, url_z, url_l, url_o</code>"
   },
   {
    "name": "order_by",
    "_content": "Accepts <code>datetaken</code> or <code>dateposted</code> and returns results in the proper order."
   },
   {
    "name": "view_as",
    "_content": "Can take values public to indicate that the profile has to be viewed as public and returns context only in public setting"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id, or was the id of a photo that the calling user does not have permission to view."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.getContext",
  "url": "https://www.flickr.com/services/api/flickr.photos.getContext.html"
 },
 "flickr.photos.getCounts": {
  "optional": [
   {
    "name": "dates",
    "_content": "A comma delimited list of unix timestamps, denoting the periods to return counts for. They should be specified <b>smallest first</b>."
   },
   {
    "name": "taken_dates",
    "_content": "A comma delimited list of mysql datetimes, denoting the periods to return counts for. They should be specified <b>smallest first</b>."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "No dates specified",
    "_content": "Neither dates nor taken_dates were specified."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.getCounts",
  "url": "https://www.flickr.com/services/api/flickr.photos.getCounts.html"
 },
 "flickr.photos.getExif": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to fetch information for."
   }
  ],
  "optional": [
   {
    "name": "secret",
    "_content": "The secret for the photo. If the correct secret is passed then permissions checking is skipped. This enables the 'sharing' of individual photos by passing around the id and secret."
   },
   {
    "name": "extras",
    "_content": ""
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
   },
   {
    "code": "2",
    "message": "Permission denied",
    "_content": "The owner of the photo does not want to share EXIF data."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.getExif",
  "url": "https://www.flickr.com/services/api/flickr.photos.getExif.html"
 },
 "flickr.photos.getFavorites": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The ID of the photo to fetch the favoriters list for."
   }
  ],
  "optional": [
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   },
   {
    "name": "per_page",
    "_content": "Number of usres to return per page. If this argument is omitted, it defaults to 10. The maximum allowed value is 50."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The specified photo does not exist, or the calling user does not have permission to view it."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.getFavorites",
  "url": "https://www.flickr.com/services/api/flickr.photos.getFavorites.html"
 },
 "flickr.photos.getInfo": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to get information for."
   }
  ],
  "optional": [
   {
    "name": "secret",
    "_content": "The secret for the photo. If the correct secret is passed then permissions checking is skipped. This enables the 'sharing' of individual photos by passing around the id and secret."
   },
   {
    "name": "humandates",
    "_content": ""
   },
   {
    "name": "privacy_filter",
    "_content": ""
   },
   {
    "name": "get_contexts",
    "_content": ""
   },
   {
    "name": "get_geofences",
    "_content": "Return geofence information in the photo's location property"
   },
   {
    "name": "datecreate",
    "_content": "If set to 1, it returns the timestamp of the user's account creation, in MySQL DATETIME format.\r\n"
   },
   {
    "name": "extras",
    "_content": ""
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found.",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.getInfo",
  "url": "https://www.flickr.com/services/api/flickr.photos.getInfo.html"
 },
 "flickr.photos.getNotInSet": {
  "optional": [
   {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date can be in the form of a unix timestamp or mysql datetime."
   },
   {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date can be in the form of a mysql datetime or unix timestamp."
   },
   {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date can be in the form of a mysql datetime or unix timestamp."
   },
   {
    "name": "privacy_filter",
    "_content": "Return photos only matching a certain privacy level. Valid values are:\r\n<ul>\r\n<li>1 public photos</li>\r\n<li>2 private photos visible to friends</li>\r\n<li>3 private photos visible to family</li>\r\n<li>4 private photos visible to friends &amp; family</li>\r\n<li>5 completely private photos</li>\r\n</ul>\r\n"
   },
   {
    "name": "media",
    "_content": "Filter results by media type. Possible values are <code>all</code> (default), <code>photos</code> or <code>videos</code>"
   },
   {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date can be in the form of a unix timestamp or mysql datetime."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.getNotInSet",
  "url": "https://www.flickr.com/services/api/flickr.photos.getNotInSet.html"
 },
 "flickr.photos.getPerms": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to get permissions for."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id of a photo belonging to the calling user."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.getPerms",
  "url": "https://www.flickr.com/services/api/flickr.photos.getPerms.html"
 },
 "flickr.photos.getRecent": {
  "optional": [
   {
    "name": "jump_to",
    "_content": ""
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "bad value for jump_to, must be valid photo id.",
    "_content": ""
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.getRecent",
  "url": "https://www.flickr.com/services/api/flickr.photos.getRecent.html"
 },
 "flickr.photos.getSizes": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to fetch size information for."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id."
   },
   {
    "code": "2",
    "message": "Permission denied",
    "_content": "The calling user does not have permission to view the photo."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.getSizes",
  "url": "https://www.flickr.com/services/api/flickr.photos.getSizes.html"
 },
 "flickr.photos.getUntagged": {
  "optional": [
   {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date can be in the form of a unix timestamp or mysql datetime."
   },
   {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date can be in the form of a unix timestamp or mysql datetime."
   },
   {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date should be in the form of a mysql datetime or unix timestamp."
   },
   {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date can be in the form of a mysql datetime or unix timestamp."
   },
   {
    "name": "privacy_filter",
    "_content": "Return photos only matching a certain privacy level. Valid values are:\r\n<ul>\r\n<li>1 public photos</li>\r\n<li>2 private photos visible to friends</li>\r\n<li>3 private photos visible to family</li>\r\n<li>4 private photos visible to friends &amp; family</li>\r\n<li>5 completely private photos</li>\r\n</ul>\r\n"
   },
   {
    "name": "media",
    "_content": "Filter results by media type. Possible values are <code>all</code> (default), <code>photos</code> or <code>videos</code>"
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.getUntagged",
  "url": "https://www.flickr.com/services/api/flickr.photos.getUntagged.html"
 },
 "flickr.photos.getWithGeoData": {
  "optional": [
   {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date should be in the form of a unix timestamp."
   },
   {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date should be in the form of a unix timestamp."
   },
   {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date should be in the form of a mysql datetime."
   },
   {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date should be in the form of a mysql datetime."
   },
   {
    "name": "privacy_filter",
    "_content": "Return photos only matching a certain privacy level. Valid values are:\r\n<ul>\r\n<li>1 public photos</li>\r\n<li>2 private photos visible to friends</li>\r\n<li>3 private photos visible to family</li>\r\n<li>4 private photos visible to friends & family</li>\r\n<li>5 completely private photos</li>\r\n</ul>\r\n"
   },
   {
    "name": "sort",
    "_content": "The order in which to sort returned photos. Deafults to date-posted-desc. The possible values are: date-posted-asc, date-posted-desc, date-taken-asc, date-taken-desc, interestingness-desc, and interestingness-asc."
   },
   {
    "name": "media",
    "_content": "Filter results by media type. Possible values are <code>all</code> (default), <code>photos</code> or <code>videos</code>"
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.getWithGeoData",
  "url": "https://www.flickr.com/services/api/flickr.photos.getWithGeoData.html"
 },
 "flickr.photos.getWithoutGeoData": {
  "optional": [
   {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date should be in the form of a unix timestamp."
   },
   {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date can be in the form of a mysql datetime or unix timestamp."
   },
   {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date can be in the form of a mysql datetime or unix timestamp."
   },
   {
    "name": "privacy_filter",
    "_content": "Return photos only matching a certain privacy level. Valid values are:\r\n<ul>\r\n<li>1 public photos</li>\r\n<li>2 private photos visible to friends</li>\r\n<li>3 private photos visible to family</li>\r\n<li>4 private photos visible to friends &amp; family</li>\r\n<li>5 completely private photos</li>\r\n</ul>\r\n"
   },
   {
    "name": "sort",
    "_content": "The order in which to sort returned photos. Deafults to date-posted-desc. The possible values are: date-posted-asc, date-posted-desc, date-taken-asc, date-taken-desc, interestingness-desc, and interestingness-asc."
   },
   {
    "name": "media",
    "_content": "Filter results by media type. Possible values are <code>all</code> (default), <code>photos</code> or <code>videos</code>"
   },
   {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date can be in the form of a unix timestamp or mysql datetime."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.getWithoutGeoData",
  "url": "https://www.flickr.com/services/api/flickr.photos.getWithoutGeoData.html"
 },
 "flickr.photos.licenses.getInfo": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.licenses.getInfo",
  "url": "https://www.flickr.com/services/api/flickr.photos.licenses.getInfo.html"
 },
 "flickr.photos.licenses.setLicense": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The photo to update the license for."
   },
   {
    "name": "license_id",
    "_content": "The license to apply, or 0 (zero) to remove the current license. Note : as of this writing the \"no known copyright restrictions\" license (7) is not a valid argument."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The specified id was not the id of a valif photo owner by the calling user."
   },
   {
    "code": "2",
    "message": "License not found",
    "_content": "The license id was not valid."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.licenses.setLicense",
  "url": "https://www.flickr.com/services/api/flickr.photos.licenses.setLicense.html"
 },
 "flickr.photos.notes.add": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to add a note to"
   },
   {
    "name": "note_x",
    "_content": "The left coordinate of the note"
   },
   {
    "name": "note_y",
    "_content": "The top coordinate of the note"
   },
   {
    "name": "note_w",
    "_content": "The width of the note"
   },
   {
    "name": "note_h",
    "_content": "The height of the note"
   },
   {
    "name": "note_text",
    "_content": "The description of the note"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id"
   },
   {
    "code": "2",
    "message": "User cannot add notes",
    "_content": "The calling user does not have permission to add a note to this photo"
   },
   {
    "code": "3",
    "message": "Missing required arguments",
    "_content": "One or more of the required arguments were not supplied."
   },
   {
    "code": "4",
    "message": "Maximum number of notes reached",
    "_content": "The maximum number of notes for the photo has been reached."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.notes.add",
  "url": "https://www.flickr.com/services/api/flickr.photos.notes.add.html"
 },
 "flickr.photos.notes.delete": {
  "required": [
   {
    "name": "note_id",
    "_content": "The id of the note to delete"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Note not found",
    "_content": "The note id passed was not a valid note id"
   },
   {
    "code": "2",
    "message": "User cannot delete note",
    "_content": "The calling user does not have permission to delete the specified note"
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.notes.delete",
  "url": "https://www.flickr.com/services/api/flickr.photos.notes.delete.html"
 },
 "flickr.photos.notes.edit": {
  "required": [
   {
    "name": "note_id",
    "_content": "The id of the note to edit"
   },
   {
    "name": "note_x",
    "_content": "The left coordinate of the note"
   },
   {
    "name": "note_y",
    "_content": "The top coordinate of the note"
   },
   {
    "name": "note_w",
    "_content": "The width of the note"
   },
   {
    "name": "note_h",
    "_content": "The height of the note"
   },
   {
    "name": "note_text",
    "_content": "The description of the note"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Note not found",
    "_content": "The note id passed was not a valid note id"
   },
   {
    "code": "2",
    "message": "User cannot edit note",
    "_content": "The calling user does not have permission to edit the specified note"
   },
   {
    "code": "3",
    "message": "Missing required arguments",
    "_content": "One or more of the required arguments were not supplied."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.notes.edit",
  "url": "https://www.flickr.com/services/api/flickr.photos.notes.edit.html"
 },
 "flickr.photos.people.add": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to add a person to."
   },
   {
    "name": "user_id",
    "_content": "The NSID of the user to add to the photo."
   }
  ],
  "optional": [
   {
    "name": "person_x",
    "_content": "The left-most pixel co-ordinate of the box around the person."
   },
   {
    "name": "person_y",
    "_content": "The top-most pixel co-ordinate of the box around the person."
   },
   {
    "name": "person_w",
    "_content": "The width (in pixels) of the box around the person."
   },
   {
    "name": "person_h",
    "_content": "The height (in pixels) of the box around the person."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Person not found",
    "_content": "The NSID passed was not a valid user id."
   },
   {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id."
   },
   {
    "code": "3",
    "message": "User cannot add this person to photos",
    "_content": "The person being added to the photo does not allow the calling user to add them."
   },
   {
    "code": "4",
    "message": "User cannot add people to that photo",
    "_content": "The owner of the photo doesn't allow the calling user to add people to their photos."
   },
   {
    "code": "5",
    "message": "Person can't be tagged in that photo",
    "_content": "The person being added to the photo does not want to be identified in this photo."
   },
   {
    "code": "6",
    "message": "Some co-ordinate paramters were blank",
    "_content": "Not all of the co-ordinate parameters (person_x, person_y, person_w, person_h) were passed with valid values."
   },
   {
    "code": "7",
    "message": "Can't add that person to a non-public photo",
    "_content": "You can only add yourself to another member's non-public photos."
   },
   {
    "code": "8",
    "message": "Too many people in that photo",
    "_content": "The maximum number of people has already been added to the photo."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.people.add",
  "url": "https://www.flickr.com/services/api/flickr.photos.people.add.html"
 },
 "flickr.photos.people.delete": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to remove a person from."
   },
   {
    "name": "user_id",
    "_content": "The NSID of the person to remove from the photo."
   }
  ],
  "optional": [
   {
    "name": "email",
    "_content": "An email address for an invited user."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Person not found",
    "_content": "The NSID passed was not a valid user id."
   },
   {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id."
   },
   {
    "code": "3",
    "message": "User cannot remove that person",
    "_content": "The calling user did not have permission to remove this person from this photo."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.people.delete",
  "url": "https://www.flickr.com/services/api/flickr.photos.people.delete.html"
 },
 "flickr.photos.people.deleteCoords": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to edit a person in."
   },
   {
    "name": "user_id",
    "_content": "The NSID of the person whose bounding box you want to remove."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Person not found",
    "_content": "The NSID passed was not a valid user id."
   },
   {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id."
   },
   {
    "code": "3",
    "message": "User cannot edit that person in that photo",
    "_content": "The calling user is neither the person depicted in the photo nor the person who added the bounding box."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.people.deleteCoords",
  "url": "https://www.flickr.com/services/api/flickr.photos.people.deleteCoords.html"
 },
 "flickr.photos.people.editCoords": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to edit a person in."
   },
   {
    "name": "user_id",
    "_content": "The NSID of the person to edit in a photo."
   },
   {
    "name": "person_x",
    "_content": "The left-most pixel co-ordinate of the box around the person."
   },
   {
    "name": "person_y",
    "_content": "The top-most pixel co-ordinate of the box around the person."
   },
   {
    "name": "person_w",
    "_content": "The width (in pixels) of the box around the person."
   },
   {
    "name": "person_h",
    "_content": "The height (in pixels) of the box around the person."
   }
  ],
  "optional": [
   {
    "name": "email",
    "_content": "An email address for an 'invited' person in a photo"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Person not found",
    "_content": "The NSID passed was not a valid user id."
   },
   {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id."
   },
   {
    "code": "3",
    "message": "User cannot edit that person in that photo",
    "_content": "The calling user did not originally add this person to the photo, and is not the person in question."
   },
   {
    "code": "4",
    "message": "Some co-ordinate paramters were blank",
    "_content": "Not all of the co-ordinate parameters (person_x, person_y, person_w, person_h) were passed with valid values."
   },
   {
    "code": "5",
    "message": "No co-ordinates given",
    "_content": "None of the co-ordinate parameters were valid."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.people.editCoords",
  "url": "https://www.flickr.com/services/api/flickr.photos.people.editCoords.html"
 },
 "flickr.photos.people.getList": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to get a list of people for."
   }
  ],
  "optional": [
   {
    "name": "extras",
    "_content": "Accepts the following extras: icon_urls, icon_urls_deep, paid_products\r\n\r\nicon_urls, icon_urls_deep: returns the persons buddy icon urls\r\npaid_products: returns if the person is pro or has a add on."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.people.getList",
  "url": "https://www.flickr.com/services/api/flickr.photos.people.getList.html"
 },
 "flickr.photos.recentlyUpdated": {
  "required": [
   {
    "name": "min_date",
    "_content": "A Unix timestamp or any English textual datetime description indicating the date from which modifications should be compared."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required argument missing.",
    "_content": "Some or all of the required arguments were not supplied."
   },
   {
    "code": "2",
    "message": "Not a valid date",
    "_content": "The date argument did not pass validation."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.recentlyUpdated",
  "url": "https://www.flickr.com/services/api/flickr.photos.recentlyUpdated.html"
 },
 "flickr.photos.removeTag": {
  "required": [
   {
    "name": "tag_id",
    "_content": "The tag to remove from the photo. This parameter should contain a tag id, as returned by <a href=\"/services/api/flickr.photos.getInfo.html\">flickr.photos.getInfo</a>."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Tag not found",
    "_content": "The calling user doesn't have permission to delete the specified tag. This could mean it belongs to someone else, or doesn't exist."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.removeTag",
  "url": "https://www.flickr.com/services/api/flickr.photos.removeTag.html"
 },
 "flickr.photos.search": {
  "optional": [
   {
    "name": "user_id",
    "_content": "The NSID of the user who's photo to search. If this parameter isn't passed then everybody's public photos will be searched. A value of \"me\" will search against the calling user's photos for authenticated calls."
   },
   {
    "name": "tags",
    "_content": "A comma-delimited list of tags. Photos with one or more of the tags listed will be returned. You can exclude results that match a term by prepending it with a - character."
   },
   {
    "name": "tag_mode",
    "_content": "Either 'any' for an OR combination of tags, or 'all' for an AND combination. Defaults to 'any' if not specified."
   },
   {
    "name": "text",
    "_content": "A free text search. Photos who's title, description or tags contain the text will be returned. You can exclude results that match a term by prepending it with a - character."
   },
   {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date can be in the form of a unix timestamp or mysql datetime."
   },
   {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date can be in the form of a unix timestamp or mysql datetime."
   },
   {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date can be in the form of a mysql datetime or unix timestamp."
   },
   {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date can be in the form of a mysql datetime or unix timestamp."
   },
   {
    "name": "license",
    "_content": "The license id for photos (for possible values see the flickr.photos.licenses.getInfo method). Multiple licenses may be comma-separated."
   },
   {
    "name": "sort",
    "_content": "The order in which to sort returned photos. Deafults to date-posted-desc (unless you are doing a radial geo query, in which case the default sorting is by ascending distance from the point specified). The possible values are: date-posted-asc, date-posted-desc, date-taken-asc, date-taken-desc, interestingness-desc, interestingness-asc, and relevance."
   },
   {
    "name": "privacy_filter",
    "_content": "Return photos only matching a certain privacy level. This only applies when making an authenticated call to view photos you own. Valid values are:\r\n<ul>\r\n<li>1 public photos</li>\r\n<li>2 private photos visible to friends</li>\r\n<li>3 private photos visible to family</li>\r\n<li>4 private photos visible to friends & family</li>\r\n<li>5 completely private photos</li>\r\n</ul>\r\n"
   },
   {
    "name": "bbox",
    "_content": "A comma-delimited list of 4 values defining the Bounding Box of the area that will be searched.\r\n<br /><br />\r\nThe 4 values represent the bottom-left corner of the box and the top-right corner, minimum_longitude, minimum_latitude, maximum_longitude, maximum_latitude.\r\n<br /><br />\r\nLongitude has a range of -180 to 180 , latitude of -90 to 90. Defaults to -180, -90, 180, 90 if not specified.\r\n<br /><br />\r\nUnlike standard photo queries, geo (or bounding box) queries will only return 250 results per page.\r\n<br /><br />\r\nGeo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against \"parameterless searches\" for queries without a geo component.\r\n<br /><br />\r\nA tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters &#8212; If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future)."
   },
   {
    "name": "accuracy",
    "_content": "Recorded accuracy level of the location information.  Current range is 1-16 : \r\n\r\n<ul>\r\n<li>World level is 1</li>\r\n<li>Country is ~3</li>\r\n<li>Region is ~6</li>\r\n<li>City is ~11</li>\r\n<li>Street is ~16</li>\r\n</ul>\r\n\r\nDefaults to maximum value if not specified."
   },
   {
    "name": "safe_search",
    "_content": "Safe search setting:\r\n\r\n<ul>\r\n<li>1 for safe.</li>\r\n<li>2 for moderate.</li>\r\n<li>3 for restricted.</li>\r\n</ul>\r\n\r\n(Please note: Un-authed calls can only see Safe content.)"
   },
   {
    "name": "content_type",
    "_content": "Content Type setting:\r\n<ul>\r\n<li>1 for photos only.</li>\r\n<li>2 for screenshots only.</li>\r\n<li>3 for 'other' only.</li>\r\n<li>4 for photos and screenshots.</li>\r\n<li>5 for screenshots and 'other'.</li>\r\n<li>6 for photos and 'other'.</li>\r\n<li>7 for photos, screenshots, and 'other' (all).</li>\r\n</ul>"
   },
   {
    "name": "machine_tags",
    "_content": "Aside from passing in a fully formed machine tag, there is a special syntax for searching on specific properties :\r\n\r\n<ul>\r\n  <li>Find photos using the 'dc' namespace :    <code>\"machine_tags\" => \"dc:\"</code></li>\r\n\r\n  <li> Find photos with a title in the 'dc' namespace : <code>\"machine_tags\" => \"dc:title=\"</code></li>\r\n\r\n  <li>Find photos titled \"mr. camera\" in the 'dc' namespace : <code>\"machine_tags\" => \"dc:title=\\\"mr. camera\\\"</code></li>\r\n\r\n  <li>Find photos whose value is \"mr. camera\" : <code>\"machine_tags\" => \"*:*=\\\"mr. camera\\\"\"</code></li>\r\n\r\n  <li>Find photos that have a title, in any namespace : <code>\"machine_tags\" => \"*:title=\"</code></li>\r\n\r\n  <li>Find photos that have a title, in any namespace, whose value is \"mr. camera\" : <code>\"machine_tags\" => \"*:title=\\\"mr. camera\\\"\"</code></li>\r\n\r\n  <li>Find photos, in the 'dc' namespace whose value is \"mr. camera\" : <code>\"machine_tags\" => \"dc:*=\\\"mr. camera\\\"\"</code></li>\r\n\r\n </ul>\r\n\r\nMultiple machine tags may be queried by passing a comma-separated list. The number of machine tags you can pass in a single query depends on the tag mode (AND or OR) that you are querying with. \"AND\" queries are limited to (16) machine tags. \"OR\" queries are limited\r\nto (8)."
   },
   {
    "name": "machine_tag_mode",
    "_content": "Either 'any' for an OR combination of tags, or 'all' for an AND combination. Defaults to 'any' if not specified."
   },
   {
    "name": "group_id",
    "_content": "The id of a group who's pool to search.  If specified, only matching photos posted to the group's pool will be returned."
   },
   {
    "name": "faves",
    "_content": "boolean. Pass faves=1 along with your user_id to search within your favorites"
   },
   {
    "name": "camera",
    "_content": "Limit results by camera.  Camera names must be in the <a href=\"http://www.flickr.com/cameras\">Camera Finder</a> normalized form.  <a href=\"http://flickr.com/services/api/flickr.cameras.getList\">flickr.cameras.getList()</a> returns a list of searchable cameras."
   },
   {
    "name": "jump_to",
    "_content": "Jump, jump!"
   },
   {
    "name": "contacts",
    "_content": "Search your contacts. Either 'all' or 'ff' for just friends and family. (Experimental)"
   },
   {
    "name": "woe_id",
    "_content": "A 32-bit identifier that uniquely represents spatial entities. (not used if bbox argument is present). \r\n<br /><br />\r\nGeo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against \"parameterless searches\" for queries without a geo component.\r\n<br /><br />\r\nA tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters &mdash; If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future)."
   },
   {
    "name": "place_id",
    "_content": "A Flickr place id.  (not used if bbox argument is present).\r\n<br /><br />\r\nGeo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against \"parameterless searches\" for queries without a geo component.\r\n<br /><br />\r\nA tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters &mdash; If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future)."
   },
   {
    "name": "media",
    "_content": "Filter results by media type. Possible values are <code>all</code> (default), <code>photos</code> or <code>videos</code>"
   },
   {
    "name": "has_geo",
    "_content": "Any photo that has been geotagged, or if the value is \"0\" any photo that has <i>not</i> been geotagged.\r\n<br /><br />\r\nGeo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against \"parameterless searches\" for queries without a geo component.\r\n<br /><br />\r\nA tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters &mdash; If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future)."
   },
   {
    "name": "geo_context",
    "_content": "Geo context is a numeric value representing the photo's geotagginess beyond latitude and longitude. For example, you may wish to search for photos that were taken \"indoors\" or \"outdoors\". <br /><br />\r\nThe current list of context IDs is :<br /><br/>\r\n<ul>\r\n<li><strong>0</strong>, not defined.</li>\r\n<li><strong>1</strong>, indoors.</li>\r\n<li><strong>2</strong>, outdoors.</li>\r\n</ul>\r\n<br /><br />\r\nGeo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against \"parameterless searches\" for queries without a geo component.\r\n<br /><br />\r\nA tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters &mdash; If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future)."
   },
   {
    "name": "lat",
    "_content": "A valid latitude, in decimal format, for doing radial geo queries.\r\n<br /><br />\r\nGeo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against \"parameterless searches\" for queries without a geo component.\r\n<br /><br />\r\nA tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters &mdash; If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future)."
   },
   {
    "name": "lon",
    "_content": "A valid longitude, in decimal format, for doing radial geo queries.\r\n<br /><br />\r\nGeo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against \"parameterless searches\" for queries without a geo component.\r\n<br /><br />\r\nA tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters &mdash; If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future)."
   },
   {
    "name": "radius",
    "_content": "A valid radius used for geo queries, greater than zero and less than 20 miles (or 32 kilometers), for use with point-based geo queries. The default value is 5 (km)."
   },
   {
    "name": "radius_units",
    "_content": "The unit of measure when doing radial geo queries. Valid options are \"mi\" (miles) and \"km\" (kilometers). The default is \"km\"."
   },
   {
    "name": "is_commons",
    "_content": "Limit the scope of the search to only photos that are part of the <a href=\"http://flickr.com/commons\">Flickr Commons project</a>. Default is false."
   },
   {
    "name": "in_gallery",
    "_content": "Limit the scope of the search to only photos that are in a <a href=\"http://www.flickr.com/help/galleries/\">gallery</a>?  Default is false, search all photos."
   },
   {
    "name": "person_id",
    "_content": "The id of a user.  Will return photos where the user has been people tagged.  A call signed as the person_id in question will return *all* photos the user in, otherwise returns public photos."
   },
   {
    "name": "is_getty",
    "_content": "Limit the scope of the search to only photos that are for sale on Getty. Default is false."
   },
   {
    "name": "username",
    "_content": "username/character name of the person whose photos you want to search. "
   },
   {
    "name": "exif_min_exposure",
    "_content": ""
   },
   {
    "name": "exif_max_exposure",
    "_content": ""
   },
   {
    "name": "exif_min_aperture",
    "_content": ""
   },
   {
    "name": "exif_max_aperture",
    "_content": ""
   },
   {
    "name": "exif_min_focallen",
    "_content": ""
   },
   {
    "name": "exif_max_focallen",
    "_content": ""
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Too many tags in ALL query",
    "_content": "When performing an 'all tags' search, you may not specify more than 20 tags to join together."
   },
   {
    "code": "2",
    "message": "Unknown user",
    "_content": "A user_id was passed which did not match a valid flickr user."
   },
   {
    "code": "3",
    "message": "Parameterless searches have been disabled",
    "_content": "To perform a search with no parameters (to get the latest public photos, please use flickr.photos.getRecent instead)."
   },
   {
    "code": "4",
    "message": "You don't have permission to view this pool",
    "_content": "The logged in user (if any) does not have permission to view the pool for this group."
   },
   {
    "code": "10",
    "message": "Sorry, the Flickr search API is not currently available.",
    "_content": "The Flickr API search databases are temporarily unavailable."
   },
   {
    "code": "11",
    "message": "No valid machine tags",
    "_content": "The query styntax for the machine_tags argument did not validate."
   },
   {
    "code": "12",
    "message": "Exceeded maximum allowable machine tags",
    "_content": "The maximum number of machine tags in a single query was exceeded."
   },
   {
    "code": "13",
    "message": "jump_to not avaiable for this query",
    "_content": "jump_to only supported for some query types."
   },
   {
    "code": "14",
    "message": "Bad value for jump_to",
    "_content": "jump_to must be valid photo ID."
   },
   {
    "code": "15",
    "message": "Photo not found",
    "_content": ""
   },
   {
    "code": "16",
    "message": "You can only search within your own favorites",
    "_content": ""
   },
   {
    "code": "17",
    "message": "You can only search within your own contacts",
    "_content": "The call tried to use the contacts parameter with no user ID or a user ID other than that of the authenticated user."
   },
   {
    "code": "18",
    "message": "Illogical arguments",
    "_content": "The request contained contradictory arguments."
   },
   {
    "code": "20",
    "message": "Excessive photo offset in search",
    "_content": "The search requested photos beyond an allowable offset. Reduce the page number or number of results per page for this search."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.search",
  "url": "https://www.flickr.com/services/api/flickr.photos.search.html"
 },
 "flickr.photos.setContentType": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to set the adultness of."
   },
   {
    "name": "content_type",
    "_content": "The content type of the photo. Must be one of: 1 for Photo, 2 for Screenshot, and 3 for Other."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id of a photo belonging to the calling user."
   },
   {
    "code": "2",
    "message": "Required arguments missing",
    "_content": "Some or all of the required arguments were not supplied."
   },
   {
    "code": "3",
    "message": "Change not allowed",
    "_content": "Changing the content type of this photo is not allowed."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.setContentType",
  "url": "https://www.flickr.com/services/api/flickr.photos.setContentType.html"
 },
 "flickr.photos.setDates": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to edit dates for."
   }
  ],
  "optional": [
   {
    "name": "date_posted",
    "_content": "The date the photo was uploaded to flickr (see the <a href=\"/services/api/misc.dates.html\">dates documentation</a>)"
   },
   {
    "name": "date_taken",
    "_content": "The date the photo was taken (see the <a href=\"/services/api/misc.dates.html\">dates documentation</a>)"
   },
   {
    "name": "date_taken_granularity",
    "_content": "The granularity of the date the photo was taken (see the <a href=\"/services/api/misc.dates.html\">dates documentation</a>)"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was not the id of a valid photo belonging to the calling user."
   },
   {
    "code": "2",
    "message": "Not enough arguments",
    "_content": "No dates were specified to be changed."
   },
   {
    "code": "3",
    "message": "Invalid granularity",
    "_content": "The value passed for 'granularity' was not a valid flickr date granularity."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.setDates",
  "url": "https://www.flickr.com/services/api/flickr.photos.setDates.html"
 },
 "flickr.photos.setMeta": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to set information for."
   },
   {
    "name": "title",
    "_content": "The title for the photo."
   },
   {
    "name": "description",
    "_content": "The description for the photo."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a photo belonging to the calling user. It might be an invalid id, or the photo might be owned by another user. "
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.setMeta",
  "url": "https://www.flickr.com/services/api/flickr.photos.setMeta.html"
 },
 "flickr.photos.setPerms": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to set permissions for."
   },
   {
    "name": "is_public",
    "_content": "1 to set the photo to public, 0 to set it to private."
   },
   {
    "name": "is_friend",
    "_content": "1 to make the photo visible to friends when private, 0 to not."
   },
   {
    "name": "is_family",
    "_content": "1 to make the photo visible to family when private, 0 to not."
   },
   {
    "name": "perm_comment",
    "_content": "who can add comments to the photo and it's notes. one of:<br />\r\n<code>0</code>: nobody<br />\r\n<code>1</code>: friends &amp; family<br />\r\n<code>2</code>: contacts<br />\r\n<code>3</code>: everybody"
   },
   {
    "name": "perm_addmeta",
    "_content": "who can add notes and tags to the photo. one of:<br />\r\n<code>0</code>: nobody / just the owner<br />\r\n<code>1</code>: friends &amp; family<br />\r\n<code>2</code>: contacts<br />\r\n<code>3</code>: everybody\r\n"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id of a photo belonging to the calling user."
   },
   {
    "code": "2",
    "message": "Required arguments missing",
    "_content": "Some or all of the required arguments were not supplied."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.setPerms",
  "url": "https://www.flickr.com/services/api/flickr.photos.setPerms.html"
 },
 "flickr.photos.setSafetyLevel": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to set the adultness of."
   }
  ],
  "optional": [
   {
    "name": "safety_level",
    "_content": "The safety level of the photo.  Must be one of:\r\n\r\n1 for Safe, 2 for Moderate, and 3 for Restricted."
   },
   {
    "name": "hidden",
    "_content": "Whether or not to additionally hide the photo from public searches.  Must be either 1 for Yes or 0 for No."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id of a photo belonging to the calling user."
   },
   {
    "code": "2",
    "message": "Invalid or missing arguments",
    "_content": "Neither a valid safety level nor a hidden value were passed."
   },
   {
    "code": "3",
    "message": "Change not allowed",
    "_content": "Changing the safety level of this photo is not allowed."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.setSafetyLevel",
  "url": "https://www.flickr.com/services/api/flickr.photos.setSafetyLevel.html"
 },
 "flickr.photos.setTags": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to set tags for.\r\n"
   },
   {
    "name": "tags",
    "_content": "All tags for the photo (as a single space-delimited string)."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a photo belonging to the calling user. It might be an invalid id, or the photo might be owned by another user. "
   },
   {
    "code": "2",
    "message": "Maximum number of tags reached",
    "_content": "The number of tags specified exceeds the limit for the photo. No tags were modified."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.setTags",
  "url": "https://www.flickr.com/services/api/flickr.photos.setTags.html"
 },
 "flickr.photos.suggestions.approveSuggestion": {
  "required": [
   {
    "name": "suggestion_id",
    "_content": "The unique ID for the location suggestion to approve."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.suggestions.approveSuggestion",
  "url": "https://www.flickr.com/services/api/flickr.photos.suggestions.approveSuggestion.html"
 },
 "flickr.photos.suggestions.getList": {
  "optional": [
   {
    "name": "photo_id",
    "_content": "Only show suggestions for a single photo."
   },
   {
    "name": "status_id",
    "_content": "Only show suggestions with a given status.\r\n\r\n<ul>\r\n<li><strong>0</strong>, pending</li>\r\n<li><strong>1</strong>, approved</li>\r\n<li><strong>2</strong>, rejected</li>\r\n</ul>\r\n\r\nThe default is pending (or \"0\")."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.photos.suggestions.getList",
  "url": "https://www.flickr.com/services/api/flickr.photos.suggestions.getList.html"
 },
 "flickr.photos.suggestions.rejectSuggestion": {
  "required": [
   {
    "name": "suggestion_id",
    "_content": "The unique ID of the suggestion to reject."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.suggestions.rejectSuggestion",
  "url": "https://www.flickr.com/services/api/flickr.photos.suggestions.rejectSuggestion.html"
 },
 "flickr.photos.suggestions.removeSuggestion": {
  "required": [
   {
    "name": "suggestion_id",
    "_content": "The unique ID for the location suggestion to approve."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.suggestions.removeSuggestion",
  "url": "https://www.flickr.com/services/api/flickr.photos.suggestions.removeSuggestion.html"
 },
 "flickr.photos.suggestions.suggestLocation": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The photo whose location you are suggesting."
   },
   {
    "name": "lat",
    "_content": "The latitude whose valid range is -90 to 90. Anything more than 6 decimal places will be truncated."
   },
   {
    "name": "lon",
    "_content": "The longitude whose valid range is -180 to 180. Anything more than 6 decimal places will be truncated."
   }
  ],
  "optional": [
   {
    "name": "accuracy",
    "_content": "Recorded accuracy level of the location information. World level is 1, Country is ~3, Region ~6, City ~11, Street ~16. Current range is 1-16. Defaults to 16 if not specified."
   },
   {
    "name": "woe_id",
    "_content": "The WOE ID of the location used to build the location hierarchy for the photo."
   },
   {
    "name": "place_id",
    "_content": "The Flickr Places ID of the location used to build the location hierarchy for the photo."
   },
   {
    "name": "note",
    "_content": "A short note or history to include with the suggestion."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.suggestions.suggestLocation",
  "url": "https://www.flickr.com/services/api/flickr.photos.suggestions.suggestLocation.html"
 },
 "flickr.photos.transform.rotate": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to rotate."
   },
   {
    "name": "degrees",
    "_content": "The amount of degrees by which to rotate the photo (clockwise) from it's current orientation. Valid values are 90, 180 and 270."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was invalid or did not belong to the calling user."
   },
   {
    "code": "2",
    "message": "Invalid rotation",
    "_content": "The rotation degrees were an invalid value."
   },
   {
    "code": "3",
    "message": "Temporary failure",
    "_content": "There was a problem either rotating the image or storing the rotated versions."
   },
   {
    "code": "4",
    "message": "Rotation disabled",
    "_content": "The rotation service is currently disabled."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photos.transform.rotate",
  "url": "https://www.flickr.com/services/api/flickr.photos.transform.rotate.html"
 },
 "flickr.photos.upload.checkTickets": {
  "required": [
   {
    "name": "tickets",
    "_content": "A comma-delimited list of ticket ids"
   }
  ],
  "optional": [
   {
    "name": "batch_id",
    "_content": ""
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photos.upload.checkTickets",
  "url": "https://www.flickr.com/services/api/flickr.photos.upload.checkTickets.html"
 },
 "flickr.photosets.addPhoto": {
  "required": [
   {
    "name": "photoset_id",
    "_content": "The id of the photoset to add a photo to."
   },
   {
    "name": "photo_id",
    "_content": "The id of the photo to add to the set."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not the id of avalid photoset owned by the calling user."
   },
   {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a valid photo owned by the calling user."
   },
   {
    "code": "3",
    "message": "Photo already in set",
    "_content": "The photo is already a member of the photoset."
   },
   {
    "code": "10",
    "message": "Maximum number of photos in set",
    "_content": "A set has reached the upper limit for the number of photos allowed."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.addPhoto",
  "url": "https://www.flickr.com/services/api/flickr.photosets.addPhoto.html"
 },
 "flickr.photosets.comments.addComment": {
  "required": [
   {
    "name": "photoset_id",
    "_content": "The id of the photoset to add a comment to."
   },
   {
    "name": "comment_text",
    "_content": "Text of the comment"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photoset not found",
    "_content": ""
   },
   {
    "code": "8",
    "message": "Blank comment",
    "_content": ""
   },
   {
    "code": "9",
    "message": "User is posting comments too fast.",
    "_content": "The user has reached the limit for number of comments posted during a specific time period. Wait a bit and try again."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.comments.addComment",
  "url": "https://www.flickr.com/services/api/flickr.photosets.comments.addComment.html"
 },
 "flickr.photosets.comments.deleteComment": {
  "required": [
   {
    "name": "comment_id",
    "_content": "The id of the comment to delete from a photoset."
   }
  ],
  "errors": [
   {
    "code": "2",
    "message": "Comment not found.",
    "_content": "The comment id passed was not a valid comment id"
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.comments.deleteComment",
  "url": "https://www.flickr.com/services/api/flickr.photosets.comments.deleteComment.html"
 },
 "flickr.photosets.comments.editComment": {
  "required": [
   {
    "name": "comment_id",
    "_content": "The id of the comment to edit."
   },
   {
    "name": "comment_text",
    "_content": "Update the comment to this text."
   }
  ],
  "errors": [
   {
    "code": "2",
    "message": "Comment not found.",
    "_content": "The comment id passed was not a valid comment id."
   },
   {
    "code": "8",
    "message": "Blank comment.",
    "_content": "Comment text can't be blank."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.comments.editComment",
  "url": "https://www.flickr.com/services/api/flickr.photosets.comments.editComment.html"
 },
 "flickr.photosets.comments.getList": {
  "required": [
   {
    "name": "photoset_id",
    "_content": "The id of the photoset to fetch comments for."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photoset not found.",
    "_content": "The photoset id was invalid."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photosets.comments.getList",
  "url": "https://www.flickr.com/services/api/flickr.photosets.comments.getList.html"
 },
 "flickr.photosets.create": {
  "required": [
   {
    "name": "title",
    "_content": "A title for the photoset."
   },
   {
    "name": "primary_photo_id",
    "_content": "The id of the photo to represent this set. The photo must belong to the calling user."
   }
  ],
  "optional": [
   {
    "name": "description",
    "_content": "A description of the photoset. May contain limited html."
   },
   {
    "name": "full_result",
    "_content": "If this is set, we get the same result as a getList API would give, along with extras: url_sq,url_t,url_s,url_m"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "No title specified",
    "_content": "No title parameter was passed in the request."
   },
   {
    "code": "2",
    "message": "Photo not found",
    "_content": "The primary photo id passed was not a valid photo id or does not belong to the calling user."
   },
   {
    "code": "3",
    "message": "Can't create any more sets",
    "_content": "The user has reached their maximum number of photosets limit."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.create",
  "url": "https://www.flickr.com/services/api/flickr.photosets.create.html"
 },
 "flickr.photosets.delete": {
  "required": [
   {
    "name": "photoset_id",
    "_content": "The id of the photoset to delete. It must be owned by the calling user."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not a valid photoset id or did not belong to the calling user."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.delete",
  "url": "https://www.flickr.com/services/api/flickr.photosets.delete.html"
 },
 "flickr.photosets.editMeta": {
  "required": [
   {
    "name": "photoset_id",
    "_content": "The id of the photoset to modify."
   },
   {
    "name": "title",
    "_content": "The new title for the photoset."
   }
  ],
  "optional": [
   {
    "name": "description",
    "_content": "A description of the photoset. May contain limited html."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not a valid photoset id or did not belong to the calling user."
   },
   {
    "code": "2",
    "message": "No title specified",
    "_content": "No title parameter was passed in the request. "
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.editMeta",
  "url": "https://www.flickr.com/services/api/flickr.photosets.editMeta.html"
 },
 "flickr.photosets.editPhotos": {
  "required": [
   {
    "name": "photoset_id",
    "_content": "The id of the photoset to modify. The photoset must belong to the calling user."
   },
   {
    "name": "primary_photo_id",
    "_content": "The id of the photo to use as the 'primary' photo for the set. This id must also be passed along in photo_ids list argument."
   },
   {
    "name": "photo_ids",
    "_content": "A comma-delimited list of photo ids to include in the set. They will appear in the set in the order sent. This list <b>must</b> contain the primary photo id. All photos must belong to the owner of the set. This list of photos replaces the existing list. Call flickr.photosets.addPhoto to append a photo to a set."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not a valid photoset id or did not belong to the calling user."
   },
   {
    "code": "2",
    "message": "Photo not found",
    "_content": "One or more of the photo ids passed was not a valid photo id or does not belong to the calling user."
   },
   {
    "code": "3",
    "message": "Primary photo not found",
    "_content": "The primary photo id passed was not a valid photo id or does not belong to the calling user."
   },
   {
    "code": "4",
    "message": "Primary photo not in list",
    "_content": "The primary photo id passed did not appear in the photo id list."
   },
   {
    "code": "5",
    "message": "Empty photos list",
    "_content": "No photo ids were passed."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.editPhotos",
  "url": "https://www.flickr.com/services/api/flickr.photosets.editPhotos.html"
 },
 "flickr.photosets.getContext": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to fetch the context for."
   },
   {
    "name": "photoset_id",
    "_content": "The id of the photoset for which to fetch the photo's context."
   }
  ],
  "optional": [
   {
    "name": "num_prev",
    "_content": ""
   },
   {
    "name": "num_next",
    "_content": ""
   },
   {
    "name": "extras",
    "_content": "A comma-delimited list of extra information to fetch for each returned record. Currently supported fields are: description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_m, url_z, url_l, url_o"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id, or was the id of a photo that the calling user does not have permission to view."
   },
   {
    "code": "2",
    "message": "Photo not in set",
    "_content": "The specified photo is not in the specified set."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photosets.getContext",
  "url": "https://www.flickr.com/services/api/flickr.photosets.getContext.html"
 },
 "flickr.photosets.getInfo": {
  "required": [
   {
    "name": "photoset_id",
    "_content": "The ID of the photoset to fetch information for."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id was not valid."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photosets.getInfo",
  "url": "https://www.flickr.com/services/api/flickr.photosets.getInfo.html"
 },
 "flickr.photosets.getList": {
  "optional": [
   {
    "name": "user_id",
    "_content": "The NSID of the user to get a photoset list for. If none is specified, the calling user is assumed."
   },
   {
    "name": "page",
    "_content": "The page of results to get. Currently, if this is not provided, all sets are returned, but this behaviour may change in future."
   },
   {
    "name": "per_page",
    "_content": "The number of sets to get per page. If paging is enabled, the maximum number of sets per page is 500."
   },
   {
    "name": "primary_photo_extras",
    "_content": "A comma-delimited list of extra information to fetch for the primary photo. Currently supported fields are: license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_m, url_o"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "The user NSID passed was not a valid user NSID and the calling user was not logged in.\r\n"
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photosets.getList",
  "url": "https://www.flickr.com/services/api/flickr.photosets.getList.html"
 },
 "flickr.photosets.getPhotos": {
  "required": [
   {
    "name": "photoset_id",
    "_content": "The id of the photoset to return the photos for."
   }
  ],
  "optional": [
   {
    "name": "extras",
    "_content": "A comma-delimited list of extra information to fetch for each returned record. Currently supported fields are: license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_m, url_o"
   },
   {
    "name": "privacy_filter",
    "_content": "Return photos only matching a certain privacy level. This only applies when making an authenticated call to view a photoset you own. Valid values are:\r\n<ul>\r\n<li>1 public photos</li>\r\n<li>2 private photos visible to friends</li>\r\n<li>3 private photos visible to family</li>\r\n<li>4 private photos visible to friends &amp; family</li>\r\n<li>5 completely private photos</li>\r\n</ul>\r\n"
   },
   {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 500. The maximum allowed value is 500."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   },
   {
    "name": "media",
    "_content": "Filter results by media type. Possible values are <code>all</code> (default), <code>photos</code> or <code>videos</code>"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not a valid photoset id."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.photosets.getPhotos",
  "url": "https://www.flickr.com/services/api/flickr.photosets.getPhotos.html"
 },
 "flickr.photosets.orderSets": {
  "required": [
   {
    "name": "photoset_ids",
    "_content": "A comma delimited list of photoset IDs, ordered with the set to show first, first in the list. Any set IDs not given in the list will be set to appear at the end of the list, ordered by their IDs."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Set not found",
    "_content": "One of the photoset ids passed was not the id of a valid photoset belonging to the calling user."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.orderSets",
  "url": "https://www.flickr.com/services/api/flickr.photosets.orderSets.html"
 },
 "flickr.photosets.removePhoto": {
  "required": [
   {
    "name": "photoset_id",
    "_content": "The id of the photoset to remove a photo from."
   },
   {
    "name": "photo_id",
    "_content": "The id of the photo to remove from the set."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not the id of avalid photoset owned by the calling user."
   },
   {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a valid photo belonging to the calling user."
   },
   {
    "code": "3",
    "message": "Photo not in set",
    "_content": "The photo is not a member of the photoset."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.removePhoto",
  "url": "https://www.flickr.com/services/api/flickr.photosets.removePhoto.html"
 },
 "flickr.photosets.removePhotos": {
  "required": [
   {
    "name": "photoset_id",
    "_content": "The id of the photoset to remove photos from."
   },
   {
    "name": "photo_ids",
    "_content": "Comma-delimited list of photo ids to remove from the photoset."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not the id of available photosets owned by the calling user."
   },
   {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a valid photo belonging to the calling user."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.removePhotos",
  "url": "https://www.flickr.com/services/api/flickr.photosets.removePhotos.html"
 },
 "flickr.photosets.reorderPhotos": {
  "required": [
   {
    "name": "photoset_id",
    "_content": "The id of the photoset to reorder. The photoset must belong to the calling user."
   },
   {
    "name": "photo_ids",
    "_content": "Ordered, comma-delimited list of photo ids. Photos that are not in the list will keep their original order"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not a valid photoset id or did not belong to the calling user."
   },
   {
    "code": "2",
    "message": "Photo not found",
    "_content": "One or more of the photo ids passed was not a valid photo id or does not belong to the calling user."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.reorderPhotos",
  "url": "https://www.flickr.com/services/api/flickr.photosets.reorderPhotos.html"
 },
 "flickr.photosets.setPrimaryPhoto": {
  "required": [
   {
    "name": "photoset_id",
    "_content": "The id of the photoset to set primary photo to."
   },
   {
    "name": "photo_id",
    "_content": "The id of the photo to set as primary."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not the id of avalid photoset owned by the calling user."
   },
   {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a valid photo owned by the calling user."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 2
  },
  "name": "flickr.photosets.setPrimaryPhoto",
  "url": "https://www.flickr.com/services/api/flickr.photosets.setPrimaryPhoto.html"
 },
 "flickr.places.find": {
  "required": [
   {
    "name": "query",
    "_content": "The query string to use for place ID lookups"
   }
  ],
  "optional": [
   {
    "name": "bbox",
    "_content": "A bounding box for limiting the area to query."
   },
   {
    "name": "extras",
    "_content": "Secret sauce."
   },
   {
    "name": "safe",
    "_content": "Do we want sexy time words in our venue results?"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more required parameters was not included with the API call."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.find",
  "url": "https://www.flickr.com/services/api/flickr.places.find.html"
 },
 "flickr.places.findByLatLon": {
  "required": [
   {
    "name": "lat",
    "_content": "The latitude whose valid range is -90 to 90. Anything more than 4 decimal places will be truncated."
   },
   {
    "name": "lon",
    "_content": "The longitude whose valid range is -180 to 180. Anything more than 4 decimal places will be truncated."
   }
  ],
  "optional": [
   {
    "name": "accuracy",
    "_content": "Recorded accuracy level of the location information. World level is 1, Country is ~3, Region ~6, City ~11, Street ~16. Current range is 1-16. The default is 16."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required arguments missing",
    "_content": "One or more required parameters was not included with the API request."
   },
   {
    "code": "2",
    "message": "Not a valid latitude",
    "_content": "The latitude argument failed validation."
   },
   {
    "code": "3",
    "message": "Not a valid longitude",
    "_content": "The longitude argument failed validation."
   },
   {
    "code": "4",
    "message": "Not a valid accuracy",
    "_content": "The accuracy argument failed validation."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.findByLatLon",
  "url": "https://www.flickr.com/services/api/flickr.places.findByLatLon.html"
 },
 "flickr.places.getChildrenWithPhotosPublic": {
  "optional": [
   {
    "name": "place_id",
    "_content": "A Flickr Places ID. (While optional, you must pass either a valid Places ID or a WOE ID.)"
   },
   {
    "name": "woe_id",
    "_content": "A Where On Earth (WOE) ID. (While optional, you must pass either a valid Places ID or a WOE ID.)"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more required parameter is missing from the API call."
   },
   {
    "code": "2",
    "message": "Not a valid Places ID",
    "_content": "An invalid Places (or WOE) ID was passed with the API call."
   },
   {
    "code": "3",
    "message": "Place not found",
    "_content": "No place could be found for the Places (or WOE) ID passed to the API call."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.getChildrenWithPhotosPublic",
  "url": "https://www.flickr.com/services/api/flickr.places.getChildrenWithPhotosPublic.html"
 },
 "flickr.places.getInfo": {
  "optional": [
   {
    "name": "place_id",
    "_content": "A Flickr Places ID. <span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
   },
   {
    "name": "woe_id",
    "_content": "A Where On Earth (WOE) ID. <span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more required parameter is missing from the API call."
   },
   {
    "code": "2",
    "message": "Not a valid Places ID",
    "_content": "An invalid Places (or WOE) ID was passed with the API call."
   },
   {
    "code": "3",
    "message": "Place not found",
    "_content": "No place could be found for the Places (or WOE) ID passed to the API call."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.getInfo",
  "url": "https://www.flickr.com/services/api/flickr.places.getInfo.html"
 },
 "flickr.places.getInfoByUrl": {
  "required": [
   {
    "name": "url",
    "_content": "A flickr.com/places URL in the form of /country/region/city. For example: /Canada/Quebec/Montreal"
   }
  ],
  "errors": [
   {
    "code": "2",
    "message": "Place URL required.",
    "_content": "The flickr.com/places URL was not passed with the API method."
   },
   {
    "code": "3",
    "message": "Place not found.",
    "_content": "Unable to find a valid place for the places URL."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.getInfoByUrl",
  "url": "https://www.flickr.com/services/api/flickr.places.getInfoByUrl.html"
 },
 "flickr.places.getPlaceTypes": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.getPlaceTypes",
  "url": "https://www.flickr.com/services/api/flickr.places.getPlaceTypes.html"
 },
 "flickr.places.getShapeHistory": {
  "optional": [
   {
    "name": "place_id",
    "_content": "A Flickr Places ID. <span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
   },
   {
    "name": "woe_id",
    "_content": "A Where On Earth (WOE) ID. <span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more required parameter is missing from the API call."
   },
   {
    "code": "2",
    "message": "Not a valid Places ID",
    "_content": "An invalid Places (or WOE) ID was passed with the API call."
   },
   {
    "code": "3",
    "message": "Place not found",
    "_content": "No place could be found for the Places (or WOE) ID passed to the API call."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.getShapeHistory",
  "url": "https://www.flickr.com/services/api/flickr.places.getShapeHistory.html"
 },
 "flickr.places.getTopPlacesList": {
  "required": [
   {
    "name": "place_type_id",
    "_content": "The numeric ID for a specific place type to cluster photos by. <br /><br />\r\n\r\nValid place type IDs are :\r\n\r\n<ul>\r\n<li><strong>22</strong>: neighbourhood</li>\r\n<li><strong>7</strong>: locality</li>\r\n<li><strong>8</strong>: region</li>\r\n<li><strong>12</strong>: country</li>\r\n<li><strong>29</strong>: continent</li>\r\n</ul>"
   }
  ],
  "optional": [
   {
    "name": "date",
    "_content": "A valid date in YYYY-MM-DD format. The default is yesterday."
   },
   {
    "name": "woe_id",
    "_content": "Limit your query to only those top places belonging to a specific Where on Earth (WOE) identifier."
   },
   {
    "name": "place_id",
    "_content": "Limit your query to only those top places belonging to a specific Flickr Places identifier."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more required parameters with missing from your request."
   },
   {
    "code": "2",
    "message": "Not a valid place type.",
    "_content": "An unknown or unsupported place type ID was passed with your request."
   },
   {
    "code": "3",
    "message": "Not a valid date.",
    "_content": "The date argument passed with your request is invalid."
   },
   {
    "code": "4",
    "message": "Not a valid Place ID",
    "_content": "An invalid Places (or WOE) identifier was included with your request."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.getTopPlacesList",
  "url": "https://www.flickr.com/services/api/flickr.places.getTopPlacesList.html"
 },
 "flickr.places.placesForBoundingBox": {
  "required": [
   {
    "name": "bbox",
    "_content": "A comma-delimited list of 4 values defining the Bounding Box of the area that will be searched. The 4 values represent the bottom-left corner of the box and the top-right corner, minimum_longitude, minimum_latitude, maximum_longitude, maximum_latitude."
   }
  ],
  "optional": [
   {
    "name": "place_type",
    "_content": "The name of place type to using as the starting point to search for places in a bounding box. Valid placetypes are:\r\n\r\n<ul>\r\n<li>neighbourhood</li>\r\n<li>locality</li>\r\n<li>county</li>\r\n<li>region</li>\r\n<li>country</li>\r\n<li>continent</li>\r\n</ul>\r\n<br />\r\n<span style=\"font-style:italic;\">The \"place_type\" argument has been deprecated in favor of the \"place_type_id\" argument. It won't go away but it will not be added to new methods. A complete list of place type IDs is available using the <a href=\"http://www.flickr.com/services/api/flickr.places.getPlaceTypes.html\">flickr.places.getPlaceTypes</a> method. (While optional, you must pass either a valid place type or place type ID.)</span>"
   },
   {
    "name": "place_type_id",
    "_content": "The numeric ID for a specific place type to cluster photos by. <br /><br />\r\n\r\nValid place type IDs are :\r\n\r\n<ul>\r\n<li><strong>22</strong>: neighbourhood</li>\r\n<li><strong>7</strong>: locality</li>\r\n<li><strong>8</strong>: region</li>\r\n<li><strong>12</strong>: country</li>\r\n<li><strong>29</strong>: continent</li>\r\n</ul>\r\n<br /><span style=\"font-style:italic;\">(While optional, you must pass either a valid place type or place type ID.)</span>\r\n"
   },
   {
    "name": "recursive",
    "_content": "Perform a recursive place type search. For example, if you search for neighbourhoods in a given bounding box but there are no results the method will also query for localities and so on until one or more valid places are found.<br /<br /> \r\nRecursive searches do not change the bounding box size restrictions for the initial place type passed to the method."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required parameters missing",
    "_content": "One or more required parameter is missing from the API call."
   },
   {
    "code": "2",
    "message": "Not a valid bbox",
    "_content": "The bbox argument was incomplete or incorrectly formatted"
   },
   {
    "code": "3",
    "message": "Not a valid place type",
    "_content": "An invalid place type was included with your request."
   },
   {
    "code": "4",
    "message": "Bounding box exceeds maximum allowable size for place type",
    "_content": "The bounding box passed along with your request was too large for the request place type."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.placesForBoundingBox",
  "url": "https://www.flickr.com/services/api/flickr.places.placesForBoundingBox.html"
 },
 "flickr.places.placesForContacts": {
  "optional": [
   {
    "name": "place_type",
    "_content": "A specific place type to cluster photos by. <br /><br />\r\n\r\nValid place types are :\r\n\r\n<ul>\r\n<li><strong>neighbourhood</strong> (and neighborhood)</li>\r\n<li><strong>locality</strong></li>\r\n<li><strong>region</strong></li>\r\n<li><strong>country</strong></li>\r\n<li><strong>continent</strong></li>\r\n</ul>\r\n<br />\r\n<span style=\"font-style:italic;\">The \"place_type\" argument has been deprecated in favor of the \"place_type_id\" argument. It won't go away but it will not be added to new methods. A complete list of place type IDs is available using the <a href=\"http://www.flickr.com/services/api/flickr.places.getPlaceTypes.html\">flickr.places.getPlaceTypes</a> method. (While optional, you must pass either a valid place type or place type ID.)</span>"
   },
   {
    "name": "place_type_id",
    "_content": "The numeric ID for a specific place type to cluster photos by. <br /><br />\r\n\r\nValid place type IDs are :\r\n\r\n<ul>\r\n<li><strong>22</strong>: neighbourhood</li>\r\n<li><strong>7</strong>: locality</li>\r\n<li><strong>8</strong>: region</li>\r\n<li><strong>12</strong>: country</li>\r\n<li><strong>29</strong>: continent</li>\r\n</ul>\r\n<br /><span style=\"font-style:italic;\">(While optional, you must pass either a valid place type or place type ID.)</span>"
   },
   {
    "name": "woe_id",
    "_content": "A Where on Earth identifier to use to filter photo clusters. For example all the photos clustered by <strong>locality</strong> in the United States (WOE ID <strong>23424977</strong>).<br /><br />\r\n<span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
   },
   {
    "name": "place_id",
    "_content": "A Flickr Places identifier to use to filter photo clusters. For example all the photos clustered by <strong>locality</strong> in the United States (Place ID <strong>4KO02SibApitvSBieQ</strong>).\r\n<br /><br />\r\n<span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
   },
   {
    "name": "threshold",
    "_content": "The minimum number of photos that a place type must have to be included. If the number of photos is lowered then the parent place type for that place will be used.<br /><br />\r\n\r\nFor example if your contacts only have <strong>3</strong> photos taken in the locality of Montreal</strong> (WOE ID 3534) but your threshold is set to <strong>5</strong> then those photos will be \"rolled up\" and included instead with a place record for the region of Quebec (WOE ID 2344924)."
   },
   {
    "name": "contacts",
    "_content": "Search your contacts. Either 'all' or 'ff' for just friends and family. (Default is all)"
   },
   {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date should be in the form of a unix timestamp."
   },
   {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date should be in the form of a unix timestamp."
   },
   {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date should be in the form of a mysql datetime."
   },
   {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date should be in the form of a mysql datetime."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Places for contacts are not available at this time",
    "_content": "Places for contacts have been disabled or are otherwise not available."
   },
   {
    "code": "2",
    "message": "Required parameter missing",
    "_content": "One or more of the required parameters was not included with your request."
   },
   {
    "code": "3",
    "message": "Not a valid place type.",
    "_content": "An invalid place type was included with your request."
   },
   {
    "code": "4",
    "message": "Not a valid Place ID",
    "_content": "An invalid Places (or WOE) identifier was included with your request."
   },
   {
    "code": "5",
    "message": "Not a valid threshold",
    "_content": "The threshold passed was invalid. "
   },
   {
    "code": "6",
    "message": "Not a valid contacts type",
    "_content": "Contacts must be either \"all\" or \"ff\" (friends and family)."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.places.placesForContacts",
  "url": "https://www.flickr.com/services/api/flickr.places.placesForContacts.html"
 },
 "flickr.places.placesForTags": {
  "required": [
   {
    "name": "place_type_id",
    "_content": "The numeric ID for a specific place type to cluster photos by. <br /><br />\r\n\r\nValid place type IDs are :\r\n\r\n<ul>\r\n<li><strong>22</strong>: neighbourhood</li>\r\n<li><strong>7</strong>: locality</li>\r\n<li><strong>8</strong>: region</li>\r\n<li><strong>12</strong>: country</li>\r\n<li><strong>29</strong>: continent</li>\r\n</ul>"
   }
  ],
  "optional": [
   {
    "name": "woe_id",
    "_content": "A Where on Earth identifier to use to filter photo clusters. For example all the photos clustered by <strong>locality</strong> in the United States (WOE ID <strong>23424977</strong>).\r\n<br /><br />\r\n<span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
   },
   {
    "name": "place_id",
    "_content": "A Flickr Places identifier to use to filter photo clusters. For example all the photos clustered by <strong>locality</strong> in the United States (Place ID <strong>4KO02SibApitvSBieQ</strong>).\r\n<br /><br />\r\n<span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
   },
   {
    "name": "threshold",
    "_content": "The minimum number of photos that a place type must have to be included. If the number of photos is lowered then the parent place type for that place will be used.<br /><br />\r\n\r\nFor example if you only have <strong>3</strong> photos taken in the locality of Montreal</strong> (WOE ID 3534) but your threshold is set to <strong>5</strong> then those photos will be \"rolled up\" and included instead with a place record for the region of Quebec (WOE ID 2344924)."
   },
   {
    "name": "tags",
    "_content": "A comma-delimited list of tags. Photos with one or more of the tags listed will be returned."
   },
   {
    "name": "tag_mode",
    "_content": "Either 'any' for an OR combination of tags, or 'all' for an AND combination. Defaults to 'any' if not specified."
   },
   {
    "name": "machine_tags",
    "_content": "Aside from passing in a fully formed machine tag, there is a special syntax for searching on specific properties :\r\n\r\n<ul>\r\n  <li>Find photos using the 'dc' namespace :    <code>\"machine_tags\" => \"dc:\"</code></li>\r\n\r\n  <li> Find photos with a title in the 'dc' namespace : <code>\"machine_tags\" => \"dc:title=\"</code></li>\r\n\r\n  <li>Find photos titled \"mr. camera\" in the 'dc' namespace : <code>\"machine_tags\" => \"dc:title=\\\"mr. camera\\\"</code></li>\r\n\r\n  <li>Find photos whose value is \"mr. camera\" : <code>\"machine_tags\" => \"*:*=\\\"mr. camera\\\"\"</code></li>\r\n\r\n  <li>Find photos that have a title, in any namespace : <code>\"machine_tags\" => \"*:title=\"</code></li>\r\n\r\n  <li>Find photos that have a title, in any namespace, whose value is \"mr. camera\" : <code>\"machine_tags\" => \"*:title=\\\"mr. camera\\\"\"</code></li>\r\n\r\n  <li>Find photos, in the 'dc' namespace whose value is \"mr. camera\" : <code>\"machine_tags\" => \"dc:*=\\\"mr. camera\\\"\"</code></li>\r\n\r\n </ul>\r\n\r\nMultiple machine tags may be queried by passing a comma-separated list. The number of machine tags you can pass in a single query depends on the tag mode (AND or OR) that you are querying with. \"AND\" queries are limited to (16) machine tags. \"OR\" queries are limited\r\nto (8)."
   },
   {
    "name": "machine_tag_mode",
    "_content": "Either 'any' for an OR combination of tags, or 'all' for an AND combination. Defaults to 'any' if not specified."
   },
   {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date should be in the form of a unix timestamp."
   },
   {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date should be in the form of a unix timestamp."
   },
   {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date should be in the form of a mysql datetime."
   },
   {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date should be in the form of a mysql datetime."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.placesForTags",
  "url": "https://www.flickr.com/services/api/flickr.places.placesForTags.html"
 },
 "flickr.places.placesForUser": {
  "optional": [
   {
    "name": "place_type_id",
    "_content": "The numeric ID for a specific place type to cluster photos by. <br /><br />\r\n\r\nValid place type IDs are :\r\n\r\n<ul>\r\n<li><strong>22</strong>: neighbourhood</li>\r\n<li><strong>7</strong>: locality</li>\r\n<li><strong>8</strong>: region</li>\r\n<li><strong>12</strong>: country</li>\r\n<li><strong>29</strong>: continent</li>\r\n</ul>\r\n<br />\r\n<span style=\"font-style:italic;\">The \"place_type\" argument has been deprecated in favor of the \"place_type_id\" argument. It won't go away but it will not be added to new methods. A complete list of place type IDs is available using the <a href=\"http://www.flickr.com/services/api/flickr.places.getPlaceTypes.html\">flickr.places.getPlaceTypes</a> method. (While optional, you must pass either a valid place type or place type ID.)</span>"
   },
   {
    "name": "place_type",
    "_content": "A specific place type to cluster photos by. <br /><br />\r\n\r\nValid place types are :\r\n\r\n<ul>\r\n<li><strong>neighbourhood</strong> (and neighborhood)</li>\r\n<li><strong>locality</strong></li>\r\n<li><strong>region</strong></li>\r\n<li><strong>country</strong></li>\r\n<li><strong>continent</strong></li>\r\n</ul>\r\n<br /><span style=\"font-style:italic;\">(While optional, you must pass either a valid place type or place type ID.)</span>"
   },
   {
    "name": "woe_id",
    "_content": "A Where on Earth identifier to use to filter photo clusters. For example all the photos clustered by <strong>locality</strong> in the United States (WOE ID <strong>23424977</strong>).<br /><br />\r\n<span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
   },
   {
    "name": "place_id",
    "_content": "A Flickr Places identifier to use to filter photo clusters. For example all the photos clustered by <strong>locality</strong> in the United States (Place ID <strong>4KO02SibApitvSBieQ</strong>).<br /><br />\r\n<span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
   },
   {
    "name": "threshold",
    "_content": "The minimum number of photos that a place type must have to be included. If the number of photos is lowered then the parent place type for that place will be used.<br /><br />\r\n\r\nFor example if you only have <strong>3</strong> photos taken in the locality of Montreal</strong> (WOE ID 3534) but your threshold is set to <strong>5</strong> then those photos will be \"rolled up\" and included instead with a place record for the region of Quebec (WOE ID 2344924)."
   },
   {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date should be in the form of a unix timestamp."
   },
   {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date should be in the form of a unix timestamp."
   },
   {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date should be in the form of a mysql datetime."
   },
   {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date should be in the form of a mysql datetime."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Places for user are not available at this time",
    "_content": "Places for user have been disabled or are otherwise not available."
   },
   {
    "code": "2",
    "message": "Required parameter missing",
    "_content": "One or more of the required parameters was not included with your request."
   },
   {
    "code": "3",
    "message": "Not a valid place type",
    "_content": "An invalid place type was included with your request."
   },
   {
    "code": "4",
    "message": "Not a valid Place ID",
    "_content": "An invalid Places (or WOE) identifier was included with your request."
   },
   {
    "code": "5",
    "message": "Not a valid threshold",
    "_content": "The threshold passed was invalid. "
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.places.placesForUser",
  "url": "https://www.flickr.com/services/api/flickr.places.placesForUser.html"
 },
 "flickr.places.resolvePlaceId": {
  "required": [
   {
    "name": "place_id",
    "_content": "A Flickr Places ID"
   }
  ],
  "errors": [
   {
    "code": "2",
    "message": "Place ID required.",
    "_content": ""
   },
   {
    "code": "3",
    "message": "Place not found.",
    "_content": ""
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.resolvePlaceId",
  "url": "https://www.flickr.com/services/api/flickr.places.resolvePlaceId.html"
 },
 "flickr.places.resolvePlaceURL": {
  "required": [
   {
    "name": "url",
    "_content": "A Flickr Places URL.  \r\n<br /><br />\r\nFlickr Place URLs are of the form /country/region/city"
   }
  ],
  "errors": [
   {
    "code": "2",
    "message": "Place URL required.",
    "_content": ""
   },
   {
    "code": "3",
    "message": "Place not found.",
    "_content": ""
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.resolvePlaceURL",
  "url": "https://www.flickr.com/services/api/flickr.places.resolvePlaceURL.html"
 },
 "flickr.places.tagsForPlace": {
  "optional": [
   {
    "name": "woe_id",
    "_content": "A Where on Earth identifier to use to filter photo clusters.<br /><br />\r\n<span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
   },
   {
    "name": "place_id",
    "_content": "A Flickr Places identifier to use to filter photo clusters.<br /><br />\r\n<span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
   },
   {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date should be in the form of a unix timestamp."
   },
   {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date should be in the form of a unix timestamp."
   },
   {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date should be in the form of a mysql datetime."
   },
   {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date should be in the form of a mysql datetime."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more parameters was not included with the API request"
   },
   {
    "code": "2",
    "message": "Not a valid Places ID",
    "_content": "An invalid Places (or WOE) identifier was included with your request."
   },
   {
    "code": "3",
    "message": "Place not found",
    "_content": "An invalid Places (or WOE) identifier was included with your request."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.places.tagsForPlace",
  "url": "https://www.flickr.com/services/api/flickr.places.tagsForPlace.html"
 },
 "flickr.prefs.getContentType": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.prefs.getContentType",
  "url": "https://www.flickr.com/services/api/flickr.prefs.getContentType.html"
 },
 "flickr.prefs.getGeoPerms": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.prefs.getGeoPerms",
  "url": "https://www.flickr.com/services/api/flickr.prefs.getGeoPerms.html"
 },
 "flickr.prefs.getHidden": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.prefs.getHidden",
  "url": "https://www.flickr.com/services/api/flickr.prefs.getHidden.html"
 },
 "flickr.prefs.getPrivacy": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.prefs.getPrivacy",
  "url": "https://www.flickr.com/services/api/flickr.prefs.getPrivacy.html"
 },
 "flickr.prefs.getSafetyLevel": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.prefs.getSafetyLevel",
  "url": "https://www.flickr.com/services/api/flickr.prefs.getSafetyLevel.html"
 },
 "flickr.push.getSubscriptions": {
  "errors": [
   {
    "code": "5",
    "message": "Service currently available only to pro accounts",
    "_content": "PuSH subscriptions are currently restricted to Pro account holders."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.push.getSubscriptions",
  "url": "https://www.flickr.com/services/api/flickr.push.getSubscriptions.html"
 },
 "flickr.push.getTopics": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.push.getTopics",
  "url": "https://www.flickr.com/services/api/flickr.push.getTopics.html"
 },
 "flickr.push.subscribe": {
  "required": [
   {
    "name": "topic",
    "_content": "The type of subscription. See <a href=\"http://www.flickr.com/services/api/flickr.push.getTopics.htm\">flickr.push.getTopics</a>."
   },
   {
    "name": "callback",
    "_content": "The url for the subscription endpoint. Limited to 255 bytes, and must be unique for this user, i.e. no two subscriptions for a given user may use the same callback url."
   },
   {
    "name": "verify",
    "_content": "The verification mode, either <code>sync</code> or <code>async</code>. See the <a href=\"http://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.3.html#subscribingl\">Google PubSubHubbub spec</a> for details."
   }
  ],
  "optional": [
   {
    "name": "verify_token",
    "_content": "The verification token to be echoed back to the subscriber during the verification callback, as per the <a href=\"http://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.3.html#subscribing\">Google PubSubHubbub spec</a>. Limited to 200 bytes."
   },
   {
    "name": "lease_seconds",
    "_content": "Number of seconds for which the subscription will be valid. Legal values are 60 to 86400 (1 minute to 1 day). If not present, the subscription will be auto-renewing."
   },
   {
    "name": "woe_ids",
    "_content": "A 32-bit integer for a <a href=\"http://developer.yahoo.com/geo/geoplanet/\">Where on Earth ID</a>. Only valid if <code>topic</code> is <code>geo</code>.\r\n<br/><br/>\r\nThe order of precedence for geo subscriptions is : woe ids, place ids, radial i.e. the <code>lat, lon</code> parameters will be ignored if <code>place_ids</code> is present, which will be ignored if <code>woe_ids</code> is present."
   },
   {
    "name": "place_ids",
    "_content": "A comma-separated list of Flickr place IDs. Only valid if <code>topic</code> is <code>geo</code>.\r\n<br/><br/>\r\nThe order of precedence for geo subscriptions is : woe ids, place ids, radial i.e. the <code>lat, lon</code> parameters will be ignored if <code>place_ids</code> is present, which will be ignored if <code>woe_ids</code> is present."
   },
   {
    "name": "lat",
    "_content": "A latitude value, in decimal format. Only valid if <code>topic</code> is <code>geo</code>. Defines the latitude for a radial query centered around (lat, lon).\r\n<br/><br/>\r\nThe order of precedence for geo subscriptions is : woe ids, place ids, radial i.e. the <code>lat, lon</code> parameters will be ignored if <code>place_ids</code> is present, which will be ignored if <code>woe_ids</code> is present."
   },
   {
    "name": "lon",
    "_content": "A longitude value, in decimal format. Only valid if <code>topic</code> is <code>geo</code>. Defines the longitude for a radial query centered around (lat, lon).\r\n<br/><br/>\r\nThe order of precedence for geo subscriptions is : woe ids, place ids, radial i.e. the <code>lat, lon</code> parameters will be ignored if <code>place_ids</code> is present, which will be ignored if <code>woe_ids</code> is present."
   },
   {
    "name": "radius",
    "_content": "A radius value, in the units defined by radius_units. Only valid if <code>topic</code> is <code>geo</code>. Defines the radius of a circle for a radial query centered around (lat, lon). Default is 5 km.\r\n<br/><br/>\r\nThe order of precedence for geo subscriptions is : woe ids, place ids, radial i.e. the <code>lat, lon</code> parameters will be ignored if <code>place_ids</code> is present, which will be ignored if <code>woe_ids</code> is present."
   },
   {
    "name": "radius_units",
    "_content": "Defines the units for the radius parameter. Only valid if <code>topic</code> is <code>geo</code>. Options are <code>mi</code> and <code>km</code>. Default is <code>km</code>.\r\n<br/><br/>\r\nThe order of precedence for geo subscriptions is : woe ids, place ids, radial i.e. the <code>lat, lon</code> parameters will be ignored if <code>place_ids</code> is present, which will be ignored if <code>woe_ids</code> is present."
   },
   {
    "name": "accuracy",
    "_content": "Defines the minimum accuracy required for photos to be included in a subscription. Only valid if <code>topic</code> is <code>geo</code> Legal values are 1-16, default is 1 (i.e. any accuracy level).\r\n<ul>\r\n<li>World level is 1</li>\r\n<li>Country is ~3</li>\r\n<li>Region is ~6</li>\r\n<li>City is ~11</li>\r\n<li>Street is ~16</li>\r\n</ul>"
   },
   {
    "name": "nsids",
    "_content": "A comma-separated list of nsids representing Flickr Commons institutions (see <a href=\"http://www.flickr.com/services/api/flickr.commons.getInstitutions.html\">flickr.commons.getInstitutions</a>). Only valid if <code>topic</code> is <code>commons</code>. If not present this argument defaults to all Flickr Commons institutions."
   },
   {
    "name": "tags",
    "_content": "A comma-separated list of strings to be used for tag subscriptions. Photos with one or more of the tags listed will be included in the subscription. Only valid if the <code>topic</code> is <code>tags</code>."
   },
   {
    "name": "machine_tags",
    "_content": "A comma-separated list of strings to be used for machine tag subscriptions. Photos with one or more of the machine tags listed will be included in the subscription. Currently the format must be <code>namespace:tag_name=value</code> Only valid if the <code>topic</code> is <code>tags</code>."
   },
   {
    "name": "update_type",
    "_content": ""
   },
   {
    "name": "output_format",
    "_content": ""
   },
   {
    "name": "mailto",
    "_content": ""
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One of the required arguments for the method was not provided."
   },
   {
    "code": "2",
    "message": "Invalid parameter value",
    "_content": "One of the arguments was specified with an illegal value."
   },
   {
    "code": "3",
    "message": "Callback URL already in use for a different subscription",
    "_content": "A different subscription already exists that uses the same callback URL."
   },
   {
    "code": "4",
    "message": "Callback failed or invalid response",
    "_content": "The verification callback failed, or failed to return the expected response to confirm the subscription."
   },
   {
    "code": "5",
    "message": "Service currently available only to pro accounts",
    "_content": "PuSH subscriptions are currently restricted to Pro account holders."
   },
   {
    "code": "6",
    "message": "Subscription awaiting verification callback response - try again later",
    "_content": "A subscription with those details exists already, but it is in a pending (non-verified) state. Please wait a bit for the verification callback to complete before attempting to update the subscription."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.push.subscribe",
  "url": "https://www.flickr.com/services/api/flickr.push.subscribe.html"
 },
 "flickr.push.unsubscribe": {
  "required": [
   {
    "name": "topic",
    "_content": "The type of subscription. See <a href=\"http://www.flickr.com/services/api/flickr.push.getTopics.htm\">flickr.push.getTopics</a>."
   },
   {
    "name": "callback",
    "_content": "The url for the subscription endpoint (must be the same url as was used when creating the subscription)."
   },
   {
    "name": "verify",
    "_content": "The verification mode, either 'sync' or 'async'. See the <a href=\"http://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.3.html#subscribingl\">Google PubSubHubbub spec</a> for details."
   }
  ],
  "optional": [
   {
    "name": "verify_token",
    "_content": "The verification token to be echoed back to the subscriber during the verification callback, as per the <a href=\"http://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.3.html#subscribing\">Google PubSubHubbub spec</a>. Limited to 200 bytes."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One of the required arguments for the method was not provided."
   },
   {
    "code": "2",
    "message": "Invalid parameter value",
    "_content": "One of the arguments was specified with an illegal value."
   },
   {
    "code": "4",
    "message": "Callback failed or invalid response",
    "_content": "The verification callback failed, or failed to return the expected response to confirm the un-subscription."
   },
   {
    "code": "6",
    "message": "Subscription awaiting verification callback response - try again later",
    "_content": "A subscription with those details exists already, but it is in a pending (non-verified) state. Please wait a bit for the verification callback to complete before attempting to update the subscription."
   },
   {
    "code": "7",
    "message": "Subscription not found",
    "_content": "No subscription matching the provided details for this user could be found."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.push.unsubscribe",
  "url": "https://www.flickr.com/services/api/flickr.push.unsubscribe.html"
 },
 "flickr.reflection.getMethodInfo": {
  "required": [
   {
    "name": "method_name",
    "_content": "The name of the method to fetch information for."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Method not found",
    "_content": "The requested method was not found."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.reflection.getMethodInfo",
  "url": "https://www.flickr.com/services/api/flickr.reflection.getMethodInfo.html"
 },
 "flickr.reflection.getMethods": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.reflection.getMethods",
  "url": "https://www.flickr.com/services/api/flickr.reflection.getMethods.html"
 },
 "flickr.stats.getCollectionDomains": {
  "required": [
   {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
   }
  ],
  "optional": [
   {
    "name": "collection_id",
    "_content": "The id of the collection to get stats for. If not provided, stats for all collections will be returned."
   },
   {
    "name": "per_page",
    "_content": "Number of domains to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
   },
   {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
   },
   {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
   },
   {
    "code": "4",
    "message": "Collection not found",
    "_content": "The collection id was either invalid or was for a collection not owned by the calling user."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getCollectionDomains",
  "url": "https://www.flickr.com/services/api/flickr.stats.getCollectionDomains.html"
 },
 "flickr.stats.getCollectionReferrers": {
  "required": [
   {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format. \r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
   },
   {
    "name": "domain",
    "_content": "The domain to return referrers for. This should be a hostname (eg: \"flickr.com\") with no protocol or pathname."
   }
  ],
  "optional": [
   {
    "name": "collection_id",
    "_content": "The id of the collection to get stats for. If not provided, stats for all collections will be returned."
   },
   {
    "name": "per_page",
    "_content": "Number of referrers to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
   },
   {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
   },
   {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
   },
   {
    "code": "4",
    "message": "Collection not found",
    "_content": "The collection id was either invalid or was for a collection not owned by the calling user."
   },
   {
    "code": "5",
    "message": "Invalid domain",
    "_content": "The domain provided is not in the expected format."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getCollectionReferrers",
  "url": "https://www.flickr.com/services/api/flickr.stats.getCollectionReferrers.html"
 },
 "flickr.stats.getCollectionStats": {
  "required": [
   {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
   },
   {
    "name": "collection_id",
    "_content": "The id of the collection to get stats for."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
   },
   {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
   },
   {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
   },
   {
    "code": "4",
    "message": "Collection not found",
    "_content": "The collection id was either invalid or was for a collection not owned by the calling user."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getCollectionStats",
  "url": "https://www.flickr.com/services/api/flickr.stats.getCollectionStats.html"
 },
 "flickr.stats.getCSVFiles": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getCSVFiles",
  "url": "https://www.flickr.com/services/api/flickr.stats.getCSVFiles.html"
 },
 "flickr.stats.getPhotoDomains": {
  "required": [
   {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
   }
  ],
  "optional": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to get stats for. If not provided, stats for all photos will be returned."
   },
   {
    "name": "per_page",
    "_content": "Number of domains to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
   },
   {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
   },
   {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
   },
   {
    "code": "4",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not owned by the calling user."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotoDomains",
  "url": "https://www.flickr.com/services/api/flickr.stats.getPhotoDomains.html"
 },
 "flickr.stats.getPhotoReferrers": {
  "required": [
   {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
   },
   {
    "name": "domain",
    "_content": "The domain to return referrers for. This should be a hostname (eg: \"flickr.com\") with no protocol or pathname."
   }
  ],
  "optional": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to get stats for. If not provided, stats for all photos will be returned."
   },
   {
    "name": "per_page",
    "_content": "Number of referrers to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
   },
   {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
   },
   {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
   },
   {
    "code": "4",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not owned by the calling user."
   },
   {
    "code": "5",
    "message": "Invalid domain",
    "_content": "The domain provided is not in the expected format."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotoReferrers",
  "url": "https://www.flickr.com/services/api/flickr.stats.getPhotoReferrers.html"
 },
 "flickr.stats.getPhotosetDomains": {
  "required": [
   {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
   }
  ],
  "optional": [
   {
    "name": "photoset_id",
    "_content": "The id of the photoset to get stats for. If not provided, stats for all sets will be returned."
   },
   {
    "name": "per_page",
    "_content": "Number of domains to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
   },
   {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
   },
   {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
   },
   {
    "code": "4",
    "message": "Photoset not found",
    "_content": "The photoset id was either invalid or was for a set not owned by the calling user."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotosetDomains",
  "url": "https://www.flickr.com/services/api/flickr.stats.getPhotosetDomains.html"
 },
 "flickr.stats.getPhotosetReferrers": {
  "required": [
   {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format. \r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
   },
   {
    "name": "domain",
    "_content": "The domain to return referrers for. This should be a hostname (eg: \"flickr.com\") with no protocol or pathname."
   }
  ],
  "optional": [
   {
    "name": "photoset_id",
    "_content": "The id of the photoset to get stats for. If not provided, stats for all sets will be returned."
   },
   {
    "name": "per_page",
    "_content": "Number of referrers to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
   },
   {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
   },
   {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
   },
   {
    "code": "4",
    "message": "Photoset not found",
    "_content": "The photoset id was either invalid or was for a set not owned by the calling user."
   },
   {
    "code": "5",
    "message": "Invalid domain",
    "_content": "The domain provided is not in the expected format."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotosetReferrers",
  "url": "https://www.flickr.com/services/api/flickr.stats.getPhotosetReferrers.html"
 },
 "flickr.stats.getPhotosetStats": {
  "required": [
   {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
   },
   {
    "name": "photoset_id",
    "_content": "The id of the photoset to get stats for."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
   },
   {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
   },
   {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
   },
   {
    "code": "4",
    "message": "Photoset not found",
    "_content": "The photoset id was either invalid or was for a set not owned by the calling user."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotosetStats",
  "url": "https://www.flickr.com/services/api/flickr.stats.getPhotosetStats.html"
 },
 "flickr.stats.getPhotoStats": {
  "required": [
   {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
   },
   {
    "name": "photo_id",
    "_content": "The id of the photo to get stats for."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
   },
   {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
   },
   {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
   },
   {
    "code": "4",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not owned by the calling user."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotoStats",
  "url": "https://www.flickr.com/services/api/flickr.stats.getPhotoStats.html"
 },
 "flickr.stats.getPhotostreamDomains": {
  "required": [
   {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
   }
  ],
  "optional": [
   {
    "name": "per_page",
    "_content": "Number of domains to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100"
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
   },
   {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
   },
   {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotostreamDomains",
  "url": "https://www.flickr.com/services/api/flickr.stats.getPhotostreamDomains.html"
 },
 "flickr.stats.getPhotostreamReferrers": {
  "required": [
   {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format. \r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
   },
   {
    "name": "domain",
    "_content": "The domain to return referrers for. This should be a hostname (eg: \"flickr.com\") with no protocol or pathname."
   }
  ],
  "optional": [
   {
    "name": "per_page",
    "_content": "Number of referrers to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
   },
   {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
   },
   {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
   },
   {
    "code": "5",
    "message": "Invalid domain",
    "_content": "The domain provided is not in the expected format."
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotostreamReferrers",
  "url": "https://www.flickr.com/services/api/flickr.stats.getPhotostreamReferrers.html"
 },
 "flickr.stats.getPhotostreamStats": {
  "required": [
   {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
   },
   {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
   },
   {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPhotostreamStats",
  "url": "https://www.flickr.com/services/api/flickr.stats.getPhotostreamStats.html"
 },
 "flickr.stats.getPopularPhotos": {
  "optional": [
   {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format. \r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day.\r\n\r\nIf no date is provided, all time view counts will be returned."
   },
   {
    "name": "sort",
    "_content": "The order in which to sort returned photos. Defaults to views. The possible values are views, comments and favorites. \r\n\r\nOther sort options are available through <a href=\"/services/api/flickr.photos.search.html\">flickr.photos.search</a>."
   },
   {
    "name": "per_page",
    "_content": "Number of referrers to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100."
   },
   {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
   },
   {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
   },
   {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
   },
   {
    "code": "5",
    "message": "Invalid sort",
    "_content": "The sort provided is not valid"
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getPopularPhotos",
  "url": "https://www.flickr.com/services/api/flickr.stats.getPopularPhotos.html"
 },
 "flickr.stats.getTotalViews": {
  "optional": [
   {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day.\r\n\r\nIf no date is provided, all time view counts will be returned."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
   },
   {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
   },
   {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
   }
  ],
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.stats.getTotalViews",
  "url": "https://www.flickr.com/services/api/flickr.stats.getTotalViews.html"
 },
 "flickr.tags.getClusterPhotos": {
  "required": [
   {
    "name": "tag",
    "_content": "The tag that this cluster belongs to."
   },
   {
    "name": "cluster_id",
    "_content": "The top three tags for the cluster, separated by dashes (just like the url)."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.tags.getClusterPhotos",
  "url": "https://www.flickr.com/services/api/flickr.tags.getClusterPhotos.html"
 },
 "flickr.tags.getClusters": {
  "required": [
   {
    "name": "tag",
    "_content": "The tag to fetch clusters for."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Tag cluster not found",
    "_content": "The tag was invalid or no cluster exists for that tag."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.tags.getClusters",
  "url": "https://www.flickr.com/services/api/flickr.tags.getClusters.html"
 },
 "flickr.tags.getHotList": {
  "optional": [
   {
    "name": "period",
    "_content": "The period for which to fetch hot tags. Valid values are <code>day</code> and <code>week</code> (defaults to <code>day</code>)."
   },
   {
    "name": "count",
    "_content": "The number of tags to return. Defaults to 20. Maximum allowed value is 200."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Invalid period",
    "_content": "The specified period was not understood."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.tags.getHotList",
  "url": "https://www.flickr.com/services/api/flickr.tags.getHotList.html"
 },
 "flickr.tags.getListPhoto": {
  "required": [
   {
    "name": "photo_id",
    "_content": "The id of the photo to return tags for."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.tags.getListPhoto",
  "url": "https://www.flickr.com/services/api/flickr.tags.getListPhoto.html"
 },
 "flickr.tags.getListUser": {
  "optional": [
   {
    "name": "user_id",
    "_content": "The NSID of the user to fetch the tag list for. If this argument is not specified, the currently logged in user (if any) is assumed."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "The user NSID passed was not a valid user NSID and the calling user was not logged in.\r\n"
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.tags.getListUser",
  "url": "https://www.flickr.com/services/api/flickr.tags.getListUser.html"
 },
 "flickr.tags.getListUserPopular": {
  "optional": [
   {
    "name": "user_id",
    "_content": "The NSID of the user to fetch the tag list for. If this argument is not specified, the currently logged in user (if any) is assumed."
   },
   {
    "name": "count",
    "_content": "Number of popular tags to return. defaults to 10 when this argument is not present."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "The user NSID passed was not a valid user NSID and the calling user was not logged in.\r\n"
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.tags.getListUserPopular",
  "url": "https://www.flickr.com/services/api/flickr.tags.getListUserPopular.html"
 },
 "flickr.tags.getListUserRaw": {
  "optional": [
   {
    "name": "tag",
    "_content": "The tag you want to retrieve all raw versions for."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "The calling user was not logged in."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.tags.getListUserRaw",
  "url": "https://www.flickr.com/services/api/flickr.tags.getListUserRaw.html"
 },
 "flickr.tags.getMostFrequentlyUsed": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.tags.getMostFrequentlyUsed",
  "url": "https://www.flickr.com/services/api/flickr.tags.getMostFrequentlyUsed.html"
 },
 "flickr.tags.getRelated": {
  "required": [
   {
    "name": "tag",
    "_content": "The tag to fetch related tags for."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Tag not found",
    "_content": "The tag argument was missing."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.tags.getRelated",
  "url": "https://www.flickr.com/services/api/flickr.tags.getRelated.html"
 },
 "flickr.test.echo": {
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.test.echo",
  "url": "https://www.flickr.com/services/api/flickr.test.echo.html"
 },
 "flickr.test.login": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.test.login",
  "url": "https://www.flickr.com/services/api/flickr.test.login.html"
 },
 "flickr.test.null": {
  "security": {
   "needslogin": 1,
   "needssigning": 1,
   "requiredperms": 1
  },
  "name": "flickr.test.null",
  "url": "https://www.flickr.com/services/api/flickr.test.null.html"
 },
 "flickr.urls.getGroup": {
  "required": [
   {
    "name": "group_id",
    "_content": "The NSID of the group to fetch the url for."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Group not found",
    "_content": "The NSID specified was not a valid group."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.urls.getGroup",
  "url": "https://www.flickr.com/services/api/flickr.urls.getGroup.html"
 },
 "flickr.urls.getUserPhotos": {
  "optional": [
   {
    "name": "user_id",
    "_content": "The NSID of the user to fetch the url for. If omitted, the calling user is assumed."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "The NSID specified was not a valid user."
   },
   {
    "code": "2",
    "message": "No user specified",
    "_content": "No user_id was passed and the calling user was not logged in."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.urls.getUserPhotos",
  "url": "https://www.flickr.com/services/api/flickr.urls.getUserPhotos.html"
 },
 "flickr.urls.getUserProfile": {
  "optional": [
   {
    "name": "user_id",
    "_content": "The NSID of the user to fetch the url for. If omitted, the calling user is assumed."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "The NSID specified was not a valid user."
   },
   {
    "code": "2",
    "message": "No user specified",
    "_content": "No user_id was passed and the calling user was not logged in."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.urls.getUserProfile",
  "url": "https://www.flickr.com/services/api/flickr.urls.getUserProfile.html"
 },
 "flickr.urls.lookupGallery": {
  "required": [
   {
    "name": "url",
    "_content": "The gallery's URL."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.urls.lookupGallery",
  "url": "https://www.flickr.com/services/api/flickr.urls.lookupGallery.html"
 },
 "flickr.urls.lookupGroup": {
  "required": [
   {
    "name": "url",
    "_content": "The url to the group's page or photo pool."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "Group not found",
    "_content": "The passed URL was not a valid group page or photo pool url."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.urls.lookupGroup",
  "url": "https://www.flickr.com/services/api/flickr.urls.lookupGroup.html"
 },
 "flickr.urls.lookupUser": {
  "required": [
   {
    "name": "url",
    "_content": "The url to the user's profile or photos page."
   }
  ],
  "errors": [
   {
    "code": "1",
    "message": "User not found",
    "_content": "The passed URL was not a valid user profile or photos url."
   }
  ],
  "security": {
   "needslogin": 0,
   "needssigning": 0,
   "requiredperms": 0
  },
  "name": "flickr.urls.lookupUser",
  "url": "https://www.flickr.com/services/api/flickr.urls.lookupUser.html"
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
    e[level] = Utils.generateAPIDevFunction(Flickr.methods[method]);
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
