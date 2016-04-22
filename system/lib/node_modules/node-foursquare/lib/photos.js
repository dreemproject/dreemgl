var path = require('path'),
    util = require('util');

/**
 * A module for retrieving information about Photos from Foursquare.
 * @param {Object} config A valid configuration.
 * @module node-foursquare/Photos
 */
module.exports = function(config) {
  var core = require('./core')(config),
    logger = core.getLogger('photos');

  /**
   * Retrieve a photo from Foursquare.
   * @memberof module:node-foursquare/Photos
   * @param {String} photoId The id of the Photo to retrieve.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/photos/photos.html
   */
  function getPhoto(photoId, accessToken, callback) {
    logger.enter('getPhoto');

    if(!photoId) {
      logger.error('getPhoto: photoId is required.');
      callback(new Error('Photos.getPhoto: photoId is required.'));
      return;
    }

    logger.debug('search:photoId: ' + photoId);
    core.callApi(path.join('/photos', photoId), accessToken, null, callback);
  }

  return {
    'getPhoto' : getPhoto
  }
};
