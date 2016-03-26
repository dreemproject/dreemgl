var path = require('path');

/**
 * A module for retrieving information about Settings from Foursquare.
 * @module node-foursquare/Settings
 * @param {Object} config A valid configuration.
 */
module.exports = function(config) {
  var core = require('./core')(config),
    logger = core.getLogger('settings');

  /**
   * Retreive Foursquare settings for the current user.
   * @memberof module:node-foursquare/Settings
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/settings/all.html
   */
  function getSettings(accessToken, callback) {
    logger.enter('getSettings');
    core.callApi('/settings/all', accessToken, null, callback);
  }

  /**
   * Retreive a specific Foursquare setting for the current user.
   * @memberof module:node-foursquare/Settings
   * @param {String} name The name of the setting to retrieve
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/settings/all.html
   */
  function getSetting(name, accessToken, callback) {
    logger.enter('getSetting');

    if (!name) {
      logger.error('getSetting: name is required.');
      callback(new Error('Settings.getSetting: name is required.'));
      return;
    }

    logger.debug('getSetting:name: ' + name);
    core.callApi(path.join('/settings/', name), accessToken, null, callback);
  }

  return {
    'getSetting' : getSetting,
    'getSettings' : getSettings
  }
};