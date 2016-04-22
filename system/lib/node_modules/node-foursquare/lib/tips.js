var path = require('path'),
    util = require('util');

/**
 * A module for retrieving information about Tips from Foursquare.
 * @param {Object} config A valid configuration.
 * @module node-foursquare/Tips
 */
module.exports = function(config) {
  var core = require('./core')(config),
    logger = core.getLogger('tips');

  /**
   * Retrieve a Tip.
   * @memberof module:node-foursquare/Tips
   * @param {String} tipId The id of a Tip.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/tips/tips
   */
  function getTip(tipId, accessToken, callback) {
    logger.enter('getTip');

    if(!tipId) {
      logger.error('getTip: tipId is required.');
      callback(new Error('Tips.getTip: tipId is required.'));
      return;
    }

    logger.debug('getTip:tipId: ' + tipId);
    core.callApi(path.join('/tips', tipId), accessToken, null, callback);
  }
  /**
   * Retrieve the likes for a Tip.
   * @memberof module:node-foursquare/Tips
   * @param {String} tipId The id of a Tip.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/tips/likes
   */
  function getLikes(tipId, accessToken, callback) {
    logger.enter('getLikes');

    if(!tipId) {
      logger.error('getLikes: tipId is required.');
      callback(new Error('Tips.getLikes: tipId is required.'));
      return;
    }

    logger.debug('getLikes:tipId: ' + tipId);
    core.callApi(path.join('/tips', tipId, 'likes'), accessToken, null, callback);
  }

  /**
   * Retrieve an array of users who have done a Tip.
   * @memberof module:node-foursquare/Tips
   * @param {String} tipId The id of a Tip.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/tips/done
   */
  function getDone(tipId, params, accessToken, callback) {
    logger.enter('getDone');
    params = params || {};

    if(!tipId) {
      logger.error('getDone: tipId is required.');
      callback(new Error('Tips.getDone: tipId is required.'));
      return;
    }

    logger.debug('getDone:tipId: ' + tipId);
    core.callApi(path.join('/tips', tipId, 'done'), accessToken, params, callback);
  }

  /**
   * Retrieve an array of lists where a Tip appears.
   * @memberof module:node-foursquare/Tips
   * @param {String} tipId The id of a Tip.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/tips/listed
   */
  function getListed(tipId, params, accessToken, callback) {
    logger.enter('getLists');
    params = params || {};

    if(!tipId) {
      logger.error('getLists: tipId is required.');
      callback(new Error('Tips.getLists: tipId is required.'));
      return;
    }

    logger.debug('getLists:tipId: ' + tipId);
    core.callApi(path.join('/tips', tipId, 'listed'), accessToken, params, callback);
  }

  return {
    'getDone' : getDone,
    'getLikes' : getLikes,
    'getListed' : getListed,
    'getTip' : getTip
  }
};
