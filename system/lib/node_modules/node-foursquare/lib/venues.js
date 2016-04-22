var path = require('path'),
    util = require('util');
  
/**
 * A module for retrieving information about Venues from Foursquare.
 * @param {Object} config A valid configuration.
 * @module node-foursquare/Venues
 */
module.exports = function(config) {
  var core = require('./core')(config),
    logger = core.getLogger('venues');

  /**
   * Retrieve a list of Venue Categories.
   * @memberof module:node-foursquare/Venues
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/categories
   */
  function getCategories(params, accessToken, callback) {
    logger.enter('getCategories');
    logger.debug('getCategories:params: ' + util.inspect(params));
    core.callApi('/venues/categories', accessToken, params || {}, callback);
  }

  /**
   * Explore Foursquare Venues.
   * @memberof module:node-foursquare/Venues
   * @param {String|Number} lat The latitude of the location around which to explore.
   * @param {String|Number} lng The longitude of the location around which to explore.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/explore
   */
  function explore(lat, lng, near, params, accessToken, callback) {
    logger.enter('explore');
    params = params || {};

    if(!lat || !lng) {
      if(!near) {
        logger.error('Lat and Lng or near are required parameters.');
        callback(new Error('Venues.explore: lat and lng or near are both required.'));
        return;
      } else {
        params.near = near;
      }
    } else {
      params.ll = lat + ',' + lng;
    }
    logger.debug('explore:params: ' + util.inspect(params));

    core.callApi('/venues/explore', accessToken, params, callback);
  }

  /**
   * Search Foursquare Venues.
   * @memberof module:node-foursquare/Venues
   * @param {String|Number} lat The latitude of the location around which to search.
   * @param {String|Number} lng The longitude of the location around which to search.
   * @param {String} near The string representation of a location in 'Anytown, CA' format.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/search
   */
  function search(lat, lng, near, params, accessToken, callback) {
    logger.enter('search');
    params = params || {};

    if(!lat || !lng) {
      if(!near) {
        if (!params.ne || !params.sw) {
            logger.error('Either lat and lng, near, or ne/sw are required as parameters.');
            callback(new Error('Venues.explore: near or ne/sw must be specified if lat and lng are not set.'));
            return;
        }
      } else {
        params.near = near;
      }
    } else {
      params.ll = lat + ',' + lng;
    }

    logger.debug('search:lat: ' + lat);
    logger.debug('search:lng: ' + lng);
    logger.debug('search:near: ' + near);
    logger.debug('search:params: ' + util.inspect(params));
    core.callApi('/venues/search', accessToken, params, callback);
  }

  /**
   * Return Foursquare Venues near location with the most people currently checked in.
   * @memberof module:node-foursquare/Venues
   * @param {String|Number} lat The latitude of the location around which to search.
   * @param {String|Number} lng The longitude of the location around which to search.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/trending
   */
  function getTrending(lat, lng, params, accessToken, callback) {
    logger.enter('trending');
    params = params || {};

    if(!lat || !lng) {
      logger.error('Lat and Lng are both required parameters.');
      callback(new Error('Venues.explore: lat and lng are both required.'));
      return;
    }

    logger.debug('search:lat: ' + lat);
    logger.debug('search:lng: ' + lng);
    logger.debug('getTrending:params: ' + util.inspect(params));
    params.ll = lat + ',' + lng;
    core.callApi('/venues/trending', accessToken, params, callback);
  }

  /**
   * Retrieve a Foursquare Venue.
   * @memberof module:node-foursquare/Venues
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/venues
   */
  function getVenue(venueId, accessToken, callback) {
    logger.enter('getVenue');

    if (!venueId) {
      logger.error('getVenue: venueId is required.');
      callback(new Error('Venues.getVenue: venueId is required.'));
      return;
    }

    logger.debug('getVenue:venueId: ' + venueId);
    core.callApi(path.join('/venues', venueId), accessToken, null, callback);
  }

  /**
   * Retrieve a specific aspect from the Venues endpoint.
   * @memberof module:node-foursquare/Venues
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {String} aspect The aspect to retrieve. Refer to Foursquare documentation for details on currently
   * supported aspects.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/index_docs
   */
  function getVenueAspect(venueId, aspect, params, accessToken, callback) {
    logger.enter('getVenueAspect');

    if (!venueId) {
      logger.error('getVenueAspect: venueId is required.');
      callback(new Error('Venues.getVenueAspect: venueId is required.'));
      return;
    }

    if (!aspect) {
      logger.error('getVenueAspect: aspect is required.');
      callback(new Error('Venues.getVenueAspect: aspect is required.'));
      return;
    }

    logger.debug('getVenueAspect:venueId: ' + venueId);
    logger.debug('getVenueAspect:aspect: ' + aspect);
    logger.debug('getVenueAspect:params: ' + util.inspect(params));
    core.callApi(path.join('/venues', venueId, aspect), accessToken, params || {}, callback);
  }

  /**
   * Retrieve Check-ins for Users who are at a Venue 'now'.
   * @memberof module:node-foursquare/Venues
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/herenow
   */
  function getHereNow(venueId, params, accessToken, callback) {
    logger.enter('getHereNow');

    if (!venueId) {
      logger.error('getHereNow: venueId is required.');
      callback(new Error('Venues.getHereNow: venueId is required.'));
      return;
    }

    logger.debug('getHereNow:venueId: ' + venueId);
    logger.debug('getHereNow:params: ' + util.inspect(params));
    core.callApi(path.join('/venues', venueId, 'herenow'), accessToken, params || {}, callback);
  }

  /**
   * Retrieve Tips for a Foursquare Venue.
   * @memberof module:node-foursquare/Venues
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/tips
   */
  function getTips(venueId, params, accessToken, callback) {
    logger.enter('getTips');

    if (!venueId) {
      logger.error('getTips: venueId is required.');
      callback(new Error('Venues.getTips: venueId is required.'));
      return;
    }

    logger.debug('getTips:venueId: ' + venueId);
    logger.debug('getTips:params: ' + util.inspect(params));
    getVenueAspect(venueId, 'tips', params, accessToken, callback)
  }

  /**
   * Retrieve Lists where a Foursquare Venue is listed.
   * @memberof module:node-foursquare/Venues
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/listed
   */
  function getListed(venueId, params, accessToken, callback) {
    logger.enter('getLists');

    if (!venueId) {
      logger.error('getLists: venueId is required.');
      callback(new Error('Venues.getLists: venueId is required.'));
      return;
    }

    logger.debug('getLists:venueId: ' + venueId);
    logger.debug('getLists:params: ' + util.inspect(params));
    getVenueAspect(venueId, 'listed', params, accessToken, callback)
  }

  /**
   * Retrieve Stats for a Foursquare Venue.
   * @memberof module:node-foursquare/Venues
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/stats
   */
  function getStats(venueId, params, accessToken, callback) {
    logger.enter('getStats');

    if (!venueId) {
      logger.error('getStats: venueId is required.');
      callback(new Error('Venues.getStats: venueId is required.'));
      return;
    }

    logger.debug('getStats:venueId: ' + venueId);
    logger.debug('getStats:params: ' + util.inspect(params));
    getVenueAspect(venueId, 'stats', params, accessToken, callback)
  }

  /**
   * Retrieve Photos for a Foursquare Venue.
   * @memberof module:node-foursquare/Venues
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {String} [group='venue'] The type of photos to retrieve. Refer to Foursquare documentation for details
   * on currently supported groups.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user. NOTE: This may or may
   * not be required for certain types of photos associated to the venue. Refer to the Foursquare documentation for
   * details.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/photos
   */
  function getPhotos(venueId, group, params, accessToken, callback) {
    logger.enter('getPhotos');

    if (!venueId) {
      logger.error('getPhotos: venueId is required.');
      callback(new Error('Venues.getPhotos: venueId is required.'));
      return;
    }

    logger.debug('getPhotos:venueId: ' + venueId);
    logger.debug('getPhotos:group: ' + group);
    logger.debug('getPhotos:params: ' + util.inspect(params));
    params = params || {};
    params.group = group || 'venue';
    getVenueAspect(venueId, 'photos', params, accessToken, callback)
  }

  /**
   * Retrieve Links for a Foursquare Venue.
   * @memberof module:node-foursquare/Venues
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/links
   */
  function getLinks(venueId, accessToken, callback) {
    logger.enter('getLinks');

    if (!venueId) {
      logger.error('getLinks: venueId is required.');
      callback(new Error('Venues.getLinks: venueId is required.'));
      return;
    }

    logger.debug('getLinks:venueId: ' + venueId);
    getVenueAspect(venueId, 'links', {}, accessToken, callback)
  }

  /**
   * Retrieve Events for a Foursquare Venue.
   * @memberof module:node-foursquare/Venues
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/events
   */
  function getEvents(venueId, accessToken, callback) {
    logger.enter('getEvents');

    if (!venueId) {
      logger.error('getEvents: venueId is required.');
      callback(new Error('Venues.getEvents: venueId is required.'));
      return;
    }

    logger.debug('getEvents:venueId: ' + venueId);
    getVenueAspect(venueId, 'events', {}, accessToken, callback)
  }

  /**
   * Retrieve Likes for a Foursquare Venue.
   * @memberof module:node-foursquare/Venues
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/likes
   */
  function getLikes(venueId, accessToken, callback) {
    logger.enter('getLikes');

    if (!venueId) {
      logger.error('getLikes: venueId is required.');
      callback(new Error('Venues.getLikes: venueId is required.'));
      return;
    }

    logger.debug('getLikes:venueId: ' + venueId);
    getVenueAspect(venueId, 'likes', {}, accessToken, callback)
  }

  /**
   * Retrieve Hours for a Foursquare Venue.
   * @memberof module:node-foursquare/Venues
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/hours
   */
  function getHours(venueId, accessToken, callback) {
    logger.enter('getHours');

    if (!venueId) {
      logger.error('getHours: venueId is required.');
      callback(new Error('Venues.getHours: venueId is required.'));
      return;
    }

    logger.debug('getHours:venueId: ' + venueId);
    getVenueAspect(venueId, 'hours', {}, accessToken, callback)
  }

  /**
   * Retrieve a list of venues similar to the specified venue.
   * @memberof module:node-foursquare/Venues
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/similar
   */
  function getSimilar(venueId, accessToken, callback) {
    logger.enter('getSimilar');

    if (!venueId) {
      logger.error('getSimilar: venueId is required.');
      callback(new Error('Venues.getSimilar: venueId is required.'));
      return;
    }

    logger.debug('getSimilar:venueId: ' + venueId);
    getVenueAspect(venueId, 'similar', {}, accessToken, callback)
  }

  /**
   * Retrieve the menu for a Foursquare Venue.
   * @memberof module:node-foursquare/Venues
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/menu
   */
  function getMenu(venueId, accessToken, callback) {
    logger.enter('getMenu');

    if (!venueId) {
      logger.error('getMenu: venueId is required.');
      callback(new Error('Venues.getMenu: venueId is required.'));
      return;
    }

    logger.debug('getMenu:venueId: ' + venueId);
    getVenueAspect(venueId, 'menu', {}, accessToken, callback)
  }

  /**
   * Retrieve the menu for a Foursquare Venue.
   * @memberof module:node-foursquare/Venues
   * @param {String|Array} venueIds The id of a Foursquare Venue or an array of Venue IDs.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/timeseries
   */
  function getTimeseries(venueIds, params, accessToken, callback) {
    logger.enter('getTimeseries');

    if (!venueIds) {
      logger.error('getTimeseries: venueIds is required.');
      callback(new Error('Venues.getTimeseries: venueIds is required.'));
      return;
    }
    logger.debug('getTimeseries:venueIds: ' + venueIds);
    venueIds = [].concat(venueIds);
    venueIds = venueIds.join(',');
    getVenueAspect(venueIds, 'timeseries', params, accessToken, callback)
  }

  /**
   * Retrieve a list of venues a user manages.
   * @memberof module:node-foursquare/Venues
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/managed
   */
  function getManaged(accessToken, callback) {
    logger.enter('getManaged');
    core.callApi('/venues/managed', accessToken, {}, callback);
  }

  /**
   * Search Foursquare Venues for autocomplete.
   * @memberof module:node-foursquare/Venues
   * @param {String|Number} lat The latitude of the location around which to search.
   * @param {String|Number} lng The longitude of the location around which to search.
   * @param {String} query Query parameter to search against
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/venues/suggestcompletion
   */
  function getSuggestcompletion(lat, lng, query, params, accessToken, callback) {
    logger.enter('suggestComplete');
    params = params || {};

    logger.debug('explore:params: ' + util.inspect(params));

    if(!lat || !lng) {
      logger.error('Lat and Lng are both required parameters.');
      callback(new Error('Venues.explore: lat and lng are both required.'));
      return;
    }
    params.ll = lat + ',' + lng;

    if(!query) {
      logger.error('Query is a required parameter.');
      callback(new Error('Venues.getSuggestcompletion: query is a required parameter.'));
      return;
    }
    params.query = query;

    logger.debug('getSuggestcompletion:lat: ' + lat);
    logger.debug('getSuggestcompletion:lng: ' + lng);
    logger.debug('getSuggestcompletion:query: ' + query);
    core.callApi('/venues/suggestcompletion', accessToken, params, callback);
  }

  return {
    'explore' : explore,
    'getCategories' : getCategories,
    'getEvents' : getEvents,
    'getHereNow' : getHereNow,
    'getHours' : getHours,
    'getLikes' : getLikes,
    'getLinks' : getLinks,
    'getListed' : getListed,
    'getManaged' : getManaged,
    'getMenu' : getMenu,
    'getPhotos' : getPhotos,
    'getSimilar' : getSimilar,
    'getStats' : getStats,
    'getSuggestcompletion': getSuggestcompletion,
    'getTimeseries' : getTimeseries,
    'getTips' : getTips,
    'getTrending' : getTrending,
    'getVenue' : getVenue,
    'getVenueAspect' : getVenueAspect,
    'search' : search
  }
};
