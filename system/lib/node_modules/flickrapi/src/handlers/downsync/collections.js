var fs = require("fs"),
    download = require("./download").downloadIcons,
    progress = require("progress"),
    progressBar,
    collections = [];

/**
 * Collections
 */
function processCollections(flickr, collection_idx, total, next_function) {
  "use strict";

  if(collection_idx >= total) {
    console.log("done fetching collection metadata.\n");
    if (next_function) { next_function(); }
    return;
  }

  var collection = collections[collection_idx],
      id = collection.id,
      filename =flickr.options.locals.dirstructure.ia.collections + "/" + id + ".json",
      next = function() {
        setTimeout(function() {
          processCollections(flickr, collection_idx+1, total, next_function);
        }, 1);
      };

  progressBar.tick();
  download(flickr, collection, function() {
    fs.writeFile(filename, JSON.prettyprint(collection), next);
  });
}

function getCollectionMetadata(flickr, next_function) {
  flickr.collections.getTree({
    user_id: flickr.options.user_id,
    page: 1,
    per_page: 500
  }, function(error, result) {
    collections = result.collections.collection || [];
    console.log("Downloading collection metadata from Flickr.");
    progressBar = new progress('  [:bar] :current/:total', { total: collections.length });
    processCollections(flickr, 0, collections.length, next_function);
  });
}

module.exports = getCollectionMetadata;
