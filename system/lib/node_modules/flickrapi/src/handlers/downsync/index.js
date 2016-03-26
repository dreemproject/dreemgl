/**
 * Synchronise your Flickr photo collection, with metadata,
 * to your harddisk. This handler covers:
 *
 *   - photos
 *     - tags
 *     - comments
 *     - notes
 *   - sets
 *   - collections
 *
 * Data is stored as image files on disk, with the metadata
 * stored as .json files on disk.
 *
 * TODO: comments and notes
 */
module.exports = function(location, removeDeleted) {
  "use strict";

  location = location || "./data";
  removeDeleted = removeDeleted || false;

  var fs = require("fs"),
      aggregatePhotos = require("./photos");

  // directory structure
  var data = require("../ia")(location);

  // process calls
  var photos = require("./photos");
  var sets = require("./sets");
  var collections = require("./collections");

  // Kick off the down-syncing process
  return function(err, flickr) {
    if(err) { return console.log(err); }

    flickr.options.locals = data;

    var completed = function() {
      console.log("Finished downsyncing.");
      var handler = flickr.options.afterDownsync;
      if (handler) { handler(); }
      else { process.exit(0); }
    };

    console.log();
    collections(flickr, function() {
      sets(flickr, function() {
        photos(flickr, completed);
      });
    });
  };
};
