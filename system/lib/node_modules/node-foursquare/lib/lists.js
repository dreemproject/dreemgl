
var path = require('path'),
    util = require('util');

/**
 * A module for retrieving information about Photos from Foursquare.
 * @param {Object} config A valid configuration.
 * @module node-foursquare/Photos
 */
module.exports = function(config) {
  var core = require('./core')(config),
    logger = core.getLogger('events');

  /**
   * Retrieve a list from Foursquare.
   * @memberof module:node-foursquare/Lists
   * @param {String} listId The id of the List to retrieve; accepts IDs such as 'self/tips' or 'USER_ID/todos'.
   * @param {String} [accessToken] The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/lists/lists.html
   */
  function getList(listId, accessToken, callback) {
    logger.enter('getList');

    if(!listId) {
      logger.error('getList: listId is required.');
      callback(new Error('Lists.getList: listId is required.'));
      return;
    }

    logger.debug('getList:listId: ' + listId);
    core.callApi(path.join('/lists', listId), accessToken, null, callback);
  }

  /**
   * Retrieve followers of a List from Foursquare.
   * @memberof module:node-foursquare/Lists
   * @param {String} listId The id of the List; accepts IDs such as 'self/tips' or 'USER_ID/todos'.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/lists/followers.html
   */
  function getFollowers(listId, accessToken, callback) {
    logger.enter('getFollowers');

    if(!listId) {
      logger.error('getFollowers: listId is required.');
      callback(new Error('Lists.getFollowers: listId is required.'));
      return;
    }

    logger.debug('getList:listId: ' + listId);
    core.callApi(path.join('/lists', listId, 'followers'), accessToken, null, callback);
  }

  /**
   * Retrieve venues suggested for a List from Foursquare.
   * @memberof module:node-foursquare/Lists
   * @param {String} listId The id of the List; accepts IDs such as 'self/tips' or 'USER_ID/todos'.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/lists/followers.html
   */
  function getSuggestedVenues(listId, accessToken, callback) {
    logger.enter('getSuggestedVenues');

    if(!listId) {
      logger.error('getSuggestedVenues: listId is required.');
      callback(new Error('Lists.getSuggestedVenues: listId is required.'));
      return;
    }

    logger.debug('getList:listId: ' + listId);
    core.callApi(path.join('/lists', listId, 'suggestvenues'), accessToken, null, callback);
  }

  /**
   * Retrieve venues suggested for an item in a List from Foursquare.
   * @memberof module:node-foursquare/Lists
   * @param {String} listId The id of the List; accepts IDs such as 'self/tips' or 'USER_ID/todos'.
   * @param {String} itemId The id of an item in the List.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/lists/followers.html
   */
  function getSuggestedPhotos(listId, itemId, accessToken, callback) {
    logger.enter('getSuggestedPhotos');

    if(!listId) {
      logger.error('getSuggestedPhotos: listId is required.');
      callback(new Error('Lists.getSuggestedPhotos: listId is required.'));
      return;
    }

    if(!itemId) {
      logger.error('getSuggestedPhotos: itemId is required.');
      callback(new Error('Lists.getSuggestedPhotos: itemId is required.'));
      return;
    }

    logger.debug('getList:listId: ' + listId);
    logger.debug('getList:itemId: ' + itemId);
    core.callApi(path.join('/lists', listId, 'suggestphoto'), accessToken, { 'itemId' : itemId }, callback);
  }

  /**
   * Retrieve tips suggested for an item in a List from Foursquare.
   * @memberof module:node-foursquare/Lists
   * @param {String} listId The id of the List; accepts IDs such as 'self/tips' or 'USER_ID/todos'.
   * @param {String} itemId The id of an item in the List.
   * @param {String} accessToken The access token provided by Foursquare for the current user.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/lists/followers.html
   */
  function getSuggestedTips(listId, itemId, accessToken, callback) {
    logger.enter('getSuggestedTips');

    if(!listId) {
      logger.error('getSuggestedTips: listId is required.');
      callback(new Error('Lists.getSuggestedTips: listId is required.'));
      return;
    }

    if(!itemId) {
      logger.error('getSuggestedTips: itemId is required.');
      callback(new Error('Lists.getSuggestedTips: itemId is required.'));
      return;
    }

    logger.debug('getList:listId: ' + listId);
    logger.debug('getList:itemId: ' + itemId);
    core.callApi(path.join('/lists', listId, 'suggesttip'), accessToken, { 'itemId' : itemId }, callback);
  }

  return {
    'getList' : getList,
    'getFollowers' : getFollowers,
    'getSuggestedPhotos' : getSuggestedPhotos,
    'getSuggestedTips' : getSuggestedTips,
    'getSuggestedVenues' : getSuggestedVenues
  }
};
