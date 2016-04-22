var util = require('util'),
    path = require('path');

/**
 * A module for retrieving information about Specials from Foursquare.
 * @param {Object} config A valid configuration.
 * @module node-foursquare/Specials
 */
module.exports = function(config){
  var core = require('./core')(config),
    logger = core.getLogger('specials');

  /**
   * Search for Foursquare specials.
   * @memberof module:node-foursquare/Specials
   * @param {String|Number} lat The latitude of the location around which to explore.
   * @param {String|Number} lng The longitude of the location around which to explore.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/specials/search
   */
  function search(lat, lng, params, accessToken, callback) {
    logger.enter('search');
    params = params || {};

    if(!lat || !lng) {
      logger.error('Lat and Lng are both required parameters.');
      callback(new Error('Specials.search: lat and lng are both required.'));
      return;
    }
    logger.debug('search:lat: ' + lat);
    logger.debug('search:lng: ' + lng);
    logger.debug('search:params: ' + util.inspect(params));
    params.ll = lat + ',' + lng;

    core.callApi('/specials/search', accessToken, params, callback);
  }

  /**
   * Retrieve a Foursquare specials.
   * @memberof module:node-foursquare/Specials
   * @param {String} specialId The id of the special to retrieve.
   * @param {String} venueId The id of the venue at which the special is running.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/specials/specials
   */
  function getSpecial(specialId, venueId, params, accessToken, callback) {
    logger.enter('getSpecial');
    params = params || {};

    if (!specialId) {
      logger.error('getSpecial: specialId is required.');
      callback(new Error('Specials.getSpecial: specialId is required.'));
      return;
    }

    if (!venueId) {
      logger.error('getSpecial: venueId is required.');
      callback(new Error('Specials.getSpecial: venueId is required.'));
      return;
    }

    logger.debug('getSpecial:specialId: ' + specialId);
    logger.debug('getSpecial:venueId: ' + venueId);
    logger.debug('getSpecial:params: ' + util.inspect(params));
    params['venueId'] = venueId;

    core.callApi(path.join('/specials', specialId), accessToken, params, callback);
  }

  /**
   * List Foursquare specials.
   * @memberof module:node-foursquare/Specials
   * @param {String} venueId The id of the venue at which the special is running.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/specials/list
   */
  function getList(venueId, params, accessToken, callback) {
    logger.enter('getList');
    params = params || {};

    if (!venueId) {
      logger.error('getList: venueId is required.');
      callback(new Error('Specials.getList: venueId is required.'));
      return;
    }
    logger.debug('getList:venueId: ' + venueId);
    logger.debug('getList:params: ' + util.inspect(params));

    core.callApi('/specials/list', accessToken, params, callback);
  }

  return {
    'getSpecial' : getSpecial,
    'search' : search
  }
};
