
var path = require('path'),
    util = require('util');

/**
 * A module for retrieving information about Updates and Notifications from Foursquare.
 * @param {Object} config A valid configuration.
 * @module node-foursquare/Updates
 */
module.exports = function(config) {
  var core = require('./core')(config),
    logger = core.getLogger('updates');

  /**
   * Retrieve an Update.
   * @memberof module:node-foursquare/Updates
   * @param {String} updateId The id of a Update.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/updates/updates.html
   */
  function getUpdate(updateId, accessToken, callback) {
    logger.enter('getUpdate');

    if(!updateId) {
      logger.error('getUpdate: updateId is required.');
      callback(new Error('Updates.getUpdate: updateId is required.'));
      return;
    }

    logger.debug('getUpdate:updateId: ' + updateId);
    core.callApi(path.join('/updates', updateId), accessToken, null, callback);
  }
  /**
   * Retrieve notifications for the current user.
   * @memberof module:node-foursquare/Updates
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/updates/notifications.html
   */
  function getNotifications(params, accessToken, callback) {
    logger.enter('getNotifications');
    logger.debug('getNotifications:params: ' + util.inspect(params));
    core.callApi('/updates/notifications', accessToken, params || {}, callback);
  }

  return {
    'getUpdate' : getUpdate,
    'getNotifications' : getNotifications
  }
};