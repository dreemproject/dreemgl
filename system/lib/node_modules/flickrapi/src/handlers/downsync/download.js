/**
 * Download all the interesting formats for this photo
 */
module.exports = (function() {
  "use strict";

  var fs = require('fs'),
      https = require('https'),
      locations = {
        "o" : "original",
        "t" : "thumbnail",
        "m" : "small",
        "z" : "medium",
        "c" : "medium800",
        "b" : "large",
        "s" : "square/small",
        "q" : "square/medium"
      },
      retries = {};

  /**
   * Check whether or not the JPG ends in 0xFFD9.
   */
  function validateJPG(file, cb) {
    var data = fs.readFileSync(file),
        len = data.length,
        last = data.slice(len-2,len),
        ends = (last[0] === 0xFF && last[1] === 0xD9);
    cb(ends ? false : "jpg file "+file+" is incomplete.");
  }

  /**
   * Check whether the png file has an IEND block.
   */
  function validatePNG(file, cb) {
    var data = fs.readFileSync(file),
        ends = data.toString().indexOf("IEND") > -1;
    cb(ends ? false : "png file "+file+" is incomplete.");
  }

  /**
   * Validate a downloaded jpg/png file
   */
  function validateFile(dest, cb) {
    if(dest.indexOf(".jpg") > -1) {
      validateJPG(dest, cb);
    }
    else if(dest.indexOf(".png") > -1) {
      validatePNG(dest, cb);
    }
    // no idea how to validate. So just claim it's fine.
    else { cb(false); }
  }

  /**
   * Retrieve image resources from the web
   */
  function getFromURL(url, dest, key, photo, cb) {
    if(key && !photo && !cb) { cb = key; key = undefined; }

    if(!retries[dest]) {
      retries[dest] = 0;
    } else if (retries[dest] > 5) {
      var err = "Maximum number of retries reached for " + dest;
      console.error(err);
      return cb ? cb(err) : false;
    }

    var file = fs.createWriteStream(dest),
        handleRequest = function(response) {
          response.pipe(file);
          file.on('finish', function() {
            file.close();
            // validate the image
            validateFile(dest, function(err) {
              if(err) {
                console.error(err);
                retries[dest]++;
                return getFromURL(url, dest, key, photo, cb);
              }
              if(key) {
                photo.sizes.push(key);
              }
              if (cb) {
                cb();
              }
            });
          });
        },
        errorHandler = function(err) {
          console.error(err);
          if (cb) {
            cb(err);
          }
        };
    https.get(url, handleRequest).on('error', errorHandler);
  }

  return {
    downloadIcons: function(flickr, collection, completed) {
      var root = flickr.options.locals.dirstructure.root.replace("/.",''),
          imdir = flickr.options.locals.dirstructure.images,
          icondir = imdir.icon,
          remotesmall = collection.iconsmall,
          remotelarge = collection.iconlarge,
          small = icondir.small + "/" + remotesmall.substring(remotesmall.lastIndexOf("/") + 1),
          large = icondir.large + "/" + remotelarge.substring(remotelarge.lastIndexOf("/") + 1);

      collection.iconlarge = large.replace(root, '');
      collection.iconsmall = small.replace(root, '');

      var getLarge = function(cb) {
        if(!fs.existsSync(large)) {
          getFromURL(remotelarge, large, cb);
        } else { cb(); }
      };

      var getSmall = function(cb) {
        var gl = function() { getLarge(cb); };
        if(!fs.existsSync(small)) {
          getFromURL(remotesmall, small, gl);
        } else { gl(); }
      };

      getSmall(completed);
    },
    downloadPhoto: function(flickr, photo, completed) {
      var id = photo.id,
          farm = photo.farm,
          server = photo.server,
          secret = photo.secret,
          osecret = photo.originalsecret,
          format = photo.originalformat,
          photoURL = "https://farm" + farm + ".staticflickr.com/" + server + "/" + id + "_" + secret + "_",
          url,
          dest,
          keys = photo.sizes,
          imdir = flickr.options.locals.dirstructure.images,
          imageRoot = imdir.root,
          // track how many images are left to download
          trackRecord = keys.length,
          track = function() {
            trackRecord--;
            // if there are no images left to download, we can hand control back.
            if(trackRecord === 0) { completed(); }
          };

      keys.forEach(function(key) {
        url = photoURL + key + "." + (key==="o"? format: "jpg");
        if(key==="o") {
          url = url.replace("_"+secret+"_", "_"+osecret+"_");
        }
        dest = imageRoot + "/" + locations[key] + "/" + id + "." + (key==="o"? format: "jpg");
        if(!fs.existsSync(dest)) {
          getFromURL(url, dest, key, photo, track);
        } else { track(); }
      });
    }
  };
}());
