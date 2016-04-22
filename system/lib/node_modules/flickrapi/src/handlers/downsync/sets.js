var fs = require("fs"),
    getCollectionMetadata = require("./collections"),
    progress = require("progress"),
    progressBar,
    sets = [];

/**
 * Sets
 */
function processPhotosets(flickr, set_idx, total, next_function) {
  "use strict";

  if(set_idx >= total) {
    console.log("done fetching set metadata.\n");
    if (next_function) {
      next_function();
    }
    return;
  }

  var set = sets[set_idx],
      id = set.id,
      filename = flickr.options.locals.dirstructure.ia.photosets + "/" + id + ".json",
      next = (function(flickr, set_idx, total) {
        var next_id = set_idx +1;
        return function() {
          setTimeout(function() {
            processPhotosets(flickr, next_id, total, next_function);
          }, 1);
        };
      }(flickr, set_idx, total));

  // record progress
  progressBar.tick();

  // TODO: download photos if new set, or known set with updates
  flickr.photosets.getPhotos({
    photoset_id: set.id,
    page: 1,
    per_page: 500
  }, function(error, result) {
    if (error) {
      return console.log(error);
    }
    set.photos = result.photoset.photo.map(function(photo) {
      if(photo.isprimary === "1") {
        set.primary = photo.id;
      }
      return photo.id;
    });

    fs.writeFile(filename, JSON.prettyprint(set), next);
  });
}

function getSetMetadata(flickr, next_function) {
  flickr.photosets.getList({
    user_id: flickr.options.user_id,
    page: 1,
    per_page: 500
  }, function(error, result) {
    if (error) {
      return console.log(error);
    }
    sets = result.photosets.photoset;
    console.log("Downloading set metadata from Flickr.");
    progressBar = new progress('  [:bar] :current/:total', { total: sets.length });
    processPhotosets(flickr, 0, sets.length, next_function);
  });
}

module.exports = getSetMetadata;
