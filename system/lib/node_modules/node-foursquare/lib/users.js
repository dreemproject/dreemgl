var util = require('util');

/**
 * A module for retrieving information about Users from Foursquare.
 * @param {Object} config A valid configuration.
 * @module node-foursquare/Users
 */
module.exports = function(config) {
  var core = require('./core')(config),
    logger = core.getLogger('users');

  /**
   * Find Foursquare Users.
   * @memberof module:node-foursquare/Users
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/users/search
   */
  function search(params, accessToken, callback) {
    logger.enter('search');
    logger.debug('search:params: ' + util.inspect(params));
    core.callApi('/users/search', accessToken, params || {}, callback);
  }

  /**
   * Retrieve Friend Requests for the user identified by the supplied accessToken.
   * @memberof module:node-foursquare/Users
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/users/requests
   */
  function getRequests(accessToken, callback) {
    logger.enter('getRequests');
    core.callApi('/users/requests', accessToken, {}, callback);
  }

  /**
   * Retrieve a Foursquare User.
   * @memberof module:node-foursquare/Users
   * @param {String} userId The id of the User to retreive.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/users/users
   */
  function getUser(userId, accessToken, callback) {
    logger.enter('getUser');

    if(!userId) {
      logger.error('getUser: userId is required.');
      callback(new Error('Users.getUser: userId is required.'));
      return;
    }

    logger.debug('getUser:userId: ' + userId);
    core.callApi('/users/' + userId, accessToken, null, callback);
  }

  /**
   * Retreive a named aspect for a User from the Foursquare API.
   * @memberof module:node-foursquare/Users
   * @param {String} aspect The aspect to retrieve. Refer to Foursquare documentation for details on currently
   * supported aspects.
   * @param {String} [userId='self'] The id of the User to retreive.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/index_docs
   */
  function getUserAspect(aspect, userId, params, accessToken, callback) {
    logger.enter('getUser');

    if(!aspect) {
      logger.error('getUserAspect: aspect is required.');
      callback(new Error('Users.getUserAspect: aspect is required.'));
      return;
    }
    logger.debug('getUserAspect:aspect,userId: ' + aspect + ',' + userId);
    logger.debug('getUserAspect:params: ' + util.inspect(params));

    core.callApi('/users/' + (userId || 'self') + '/' + aspect, accessToken, params, callback);
  }

  /**
   * Retrieve Check-ins for a Foursquare User.
   * @memberof module:node-foursquare/Users
   * @param {String} [userId='self'] The id of the user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/users/checkins
   */
  function getCheckins(userId, params, accessToken, callback) {
    logger.enter('getCheckins');
    logger.debug('getCheckins:params: ' + util.inspect(params));
    getUserAspect('checkins', userId, params, accessToken, callback);
  }

  /**
   * Retrieve Friends for a Foursquare User.
   * @memberof module:node-foursquare/Users
   * @param {String} [userId='self'] The id of the user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/users/friends
   */
  function getFriends(userId, params, accessToken, callback) {
    logger.enter('getFriends');
    logger.debug('getFriends:params: ' + util.inspect(params));
    getUserAspect('friends', userId, params, accessToken, callback);
  }


  /**
   * Retrieve Friends for a Foursquare User.
   * @memberof module:node-foursquare/Users
   * @param {String} [userId='self'] The id of the user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/users/friends
   */
  function getMayorships(userId, params, accessToken, callback) {
    logger.enter('getMayorships');
    logger.debug('getMayorships:userId: ' + userId);
    logger.debug('getMayorships:params: ' + util.inspect(params));
    getUserAspect('mayorships', userId, params, accessToken, callback);
  }


  /**
   * Retrieve Lists for a Foursquare User.
   * @memberof module:node-foursquare/Users
   * @param {String} [userId='self'] The id of the user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/users/lists
   */
  function getLists(userId, params, accessToken, callback) {
    logger.enter('getLists');
    logger.debug('getLists:userId: ' + userId);
    logger.debug('getLists:params: ' + util.inspect(params));
    getUserAspect('lists', userId, params, accessToken, callback);
  }


  /**
   * Retrieve Photos for a Foursquare User.
   * @memberof module:node-foursquare/Users
   * @param {String} [userId='self'] The id of the user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/users/lists
   */
  function getPhotos(userId, params, accessToken, callback) {
    logger.enter('getPhotos');
    logger.debug('getPhotos:userId: ' + userId);
    logger.debug('getPhotos:params: ' + util.inspect(params));
    getUserAspect('photos', userId, params, accessToken, callback);
  }

  /**
   * Retrieve Tips for a Foursquare User.
   * @memberof module:node-foursquare/Users
   * @param {String} [userId='self'] The id of the user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String|Number} [params.lat] The latitude of the location around which to search.
   * @param {String|Number} [params.lng] The longitude of the location around which to search.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/users/tips
   */
  function getTips(userId, params, accessToken, callback) {
    logger.enter('getTips');
    logger.debug('getTips:userId: ' + userId);
    logger.debug('getTips:params: ' + util.inspect(params));
    getUserAspect('tips', userId, params, accessToken, callback);
  }

  /**
   * Retrieve Venues visited by a Foursquare User.
   * @memberof module:node-foursquare/Users
   * @param {String} [userId='self'] The id of the user.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/users/venuehistory
   */
  function getVenueHistory(userId, params, accessToken, callback) {
    logger.enter('getVenueHistory');
    logger.debug('getVenueHistory:userId: ' + userId);
    logger.debug('getVenueHistory:params: ' + util.inspect(params));
    getUserAspect('venuehistory', userId, params, accessToken, callback);
  }

  return {
    'getCheckins' : getCheckins,
    'getFriends' : getFriends,
    'getLists' : getLists,
    'getMayorships' : getMayorships,
    'getPhotos' : getPhotos,
    'getRequests' : getRequests,
    'getTips' : getTips,
    'getUser' : getUser,
    'getUserAspect' : getUserAspect,
    'getVenueHistory' : getVenueHistory,
    'search' : search
  }
};
