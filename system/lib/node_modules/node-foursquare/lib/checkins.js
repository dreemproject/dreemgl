/**
 * A module for retrieving information about Checkins from Foursquare.
 * @param {Object} config A valid configuration.
 * @module node-foursquare/Checkins
 */
module.exports = function(config) {
  var core = require('./core')(config),
      path = require('path'),
      logger = core.getLogger('checkins');

  /**
   * Retrieve a Foursquare Check-in.
   * @memberof module:node-foursquare/Checkins
   * @param {String} checkinId The id of the check-in.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/checkins/checkins
   */
  function getCheckin(checkinId, params, accessToken, callback) {
    logger.enter('getCheckin');

    if(!checkinId) {
      logger.error('getCheckin: checkinId is required.');
      callback(new Error('Checkins.getCheckin: checkinId is required.'));
      return;
    }

    core.callApi(path.join('/checkins', checkinId), accessToken, params || {}, callback);
  }

  /**
   * Add a Foursquare Check-in.
   * @memberof module:node-foursquare/Checkins
   * @param {String} venueId The id of the venue to check-in to.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/checkins/add
   */
  function addCheckin(venueId, params, accessToken, callback) {
    logger.enter('addCheckin');

    if(!venueId) {
      logger.error('addCheckin: venueId is required.');
      callback(new Error('Checkins.addCheckin: venueId is required.'));
      return;
    }

    params = params || {};
    params.venueId = venueId;

    core.postApi('/checkins/add', accessToken, params, callback);
  }

  /**
   * Retrieve the 'likes' for a Foursquare Check-in.
   * @memberof module:node-foursquare/Checkins
   * @param {String} checkinId The id of the check-in.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/checkins/checkins/likes
   */
  function getLikes(checkinId, accessToken, callback) {
    logger.enter('getLikes');

    if(!checkinId) {
      logger.error('getCheckin: checkinId is required.');
      callback(new Error('Checkins.getCheckin: checkinId is required.'));
      return;
    }

    core.callApi(path.join('/checkins', checkinId, 'likes'), accessToken, {}, callback);
  }

  /**
   * Retreive recent checkins.
   * @memberof module:node-foursquare/Checkins
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String|Number} [params.lat] The latitude of the location around which to search.
   * @param {String|Number} [params.lng] The longitude of the location around which to search.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/checkins/recent
   */
  function getRecentCheckins(params, accessToken, callback) {
    logger.enter('getRecentCheckins');
    core.callApi('/checkins/recent', accessToken, params || {}, callback);
  }

  /**
   * Comment on a checkin-in
   * @memberof module:node-foursquare/Checkins
   * @param {String} checkinId The id of the check-in.
   * @param {String} text The text of the comment, up to 200 characters.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/checkins/addcomment
   */
  function addCommentToCheckin(checkinId, text, params, accessToken, callback) {
    logger.enter('addCommentToCheckin');

    if(!checkinId) {
      logger.error('addCommentToCheckin: checkinId is required.');
      callback(new Error('Checkins.addCommentToCheckin: checkinId is required.'));
      return;
    }

    params = params || {};
    params.text = text;

    core.postApi(path.join('/checkins', checkinId, 'addcomment'), accessToken, params, callback);
  }

  /**
   * Remove a comment from a checkin, if the acting user is the author or the owner of the checkin.
   * @memberof module:node-foursquare/Checkins
   * @param {String} checkinId The id of the check-in.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} commentId The id of the comment to remove.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/checkins/deletecomment
   */
  function deleteCommentFromCheckin(checkinId, commentId, params, accessToken, callback) {
    logger.enter('deleteCommentFromCheckin');

    if(!checkinId) {
      logger.error('deleteCommentFromCheckin: checkinId is required.');
      callback(new Error('Checkins.deleteCommentFromCheckin: checkinId is required.'));
      return;
    }

    if (!commentId) {
      logger.error('deleteCommentFromCheckin: commentId is required.');
      callback(new Error('Checkins.deleteCommentFromCheckin: commentId is required.'));
      return;
    }

    params = params || {};
    params.commentId = commentId;

    core.postApi(path.join('/checkins', checkinId, 'deletecomment'), accessToken, params, callback);
  }

  return {
    'addCommentToCheckin': addCommentToCheckin,
    'deleteCommentFromCheckin': deleteCommentFromCheckin,
    'addCheckin' : addCheckin,
    'getCheckin' : getCheckin,
    'getLikes' : getLikes,
    'getRecentCheckins' : getRecentCheckins
  }
};
