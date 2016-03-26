var path = require('path'),
    util = require('util');

/**
 * A module for retrieving information about Events from Foursquare.
 * @param {Object} config A valid configuration.
 * @module node-foursquare/Events
 */
module.exports = function(config) {
  var core = require('./core')(config),
    logger = core.getLogger('events');

  /**
   * Retrieve an event from Foursquare.
   * @memberof module:node-foursquare/Events
   * @param {String} eventId The id of the Event to retrieve.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/photos/photos.html
   */
  function getEvent(eventId, accessToken, callback) {
    logger.enter('getEvent');

    if(!eventId) {
      logger.error('getEvent: eventId is required.');
      callback(new Error('Events.getEvent: eventId is required.'));
      return;
    }

    logger.debug('getEvent:eventId: ' + eventId);
    core.callApi(path.join('/events', eventId), accessToken, null, callback);
  }

  /**
   * Search for events.
   * @memberof module:node-foursquare/Events
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/events/search.html
   */
  function search(params, accessToken, callback) {
    logger.enter('getTip');
    logger.debug('search:params: ' + util.inspect(params));
    core.callApi('/events/search', accessToken, params || {}, callback);
  }

  /**
   * Retrieve event categories from Foursquare.
   * @memberof module:node-foursquare/Events
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/events/categories.html
   */
  function getCategories(params, accessToken, callback) {
    logger.enter('getCategories');
    logger.debug('getCategories:params: ' + util.inspect(params));
    core.callApi('/events/categories', accessToken, params || {}, callback);
  }


  return {
    'getCategories' : getCategories,
    'getEvent' : getEvent,
    'search' : search
  }
};
