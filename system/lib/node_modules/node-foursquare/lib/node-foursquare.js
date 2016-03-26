/**
 * A NodeJS module for interfacing with Foursquare.
 * @module node-foursquare
 * @version 0.2
 * @author Clint Andrew Hall
 * @description A NodeJS module for interacting with Foursquare.
 * @param {Object} config A valid configuration.
 */
var qs = require('querystring'),
  util = require('util'),
  defaultConfig = require('./config-default'),
  winston = require('winston');

function mergeDefaults(o1, o2) {
  for(var p in o2) {
    try {
      if(typeof o2[p] == 'object') {
        o1[p] = mergeDefaults(o1[p], o2[p]);
      } else if(typeof o1[p] == 'undefined') {
        o1[p] = o2[p];
      }
    } catch(e) {
      o1[p] = o2[p];
    }
  }

  return o1;
}

module.exports = function(config) {

  function configure(config) {
    config = config || {};
    mergeDefaults(config, defaultConfig);

    winston.addColors(config.winston.colors);

    var logger = new (winston.Logger)();
    logger.setLevels(config.winston.levels);

    if(!config.secrets || !config.secrets.clientId || !config.secrets.clientSecret || !config.secrets.redirectUrl) {
      logger.error(
        'Client configuration not supplied; add config.secrets information, (clientId, clientSecret, redirectUrl).'
      );
      throw new Error('Configuration Error: Client information not supplied.');
    }

    if(!config.foursquare.accessTokenUrl || !config.foursquare.apiUrl) {
      logger.error(
        'Foursquare configuration not supplied; add config.foursquare information, (accessTokenUrl, apiUrl)'
      );
      throw new TypeError('Configuration Error: Foursquare information not supplied.');
    }

    if(!config.foursquare.version) {
      config.foursquare.version = '20140806';
      logger.warn(
        'Foursquare API version not defined in configuration; defaulting to latest: ' + config.foursquare.version
      );
    }

    if(!config.foursquare.mode) {
      config.foursquare.mode = 'foursquare';
      logger.warn(
        'Foursquare API mode not defined in configuration; defaulting to: ' + config.foursquare.mode
      );
    }

    return config;
  }

  config = configure(config);

  var core = require('./core')(config);

  /**
   * Exchange a user authorization code for an access token.
   * @memberof module:node-foursquare
   * @param {Object} params A collection of parameters for the Access Token request.
   * @param {String} params.code The code provided by Foursquare as the result of the user redirect.
   * @param {String} [params.grant_type='authorization_code'] The type of authorization to request.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @see https://developer.foursquare.com/docs/oauth.html
   */
  function getAccessToken(params, callback) {
    params = params || {};
    params.grant_type = params.grant_type || 'authorization_code';
    params.client_id = config.secrets.clientId;
    params.client_secret = config.secrets.clientSecret;
    params.redirect_uri = config.secrets.redirectUrl;

    core.retrieve(config.foursquare.accessTokenUrl + '?' + qs.stringify(params),
      function(error, status, result) {
        if(error) {
          callback(error);
        }
        else {
          try {
            var resultObj = JSON.parse(result);
            if(resultObj.error) {
              callback({message: resultObj.error});
            }
            else if(!resultObj.access_token) {
              callback({message: 'access_token not present, got ' + result});
            }
            else {
              callback(null, resultObj.access_token);
            }
          }
          catch(e) {
            callback(e);
          }
        }
      });
  }

  /**
   * Build and return an appropriate Authorization URL where the user can grant permission to the application.
   * @memberof module:node-foursquare
   */
  function getAuthClientRedirectUrl() {
    return config.foursquare.authenticateUrl + '?client_id=' +
      config.secrets.clientId + '&response_type=code&redirect_uri=' +
      config.secrets.redirectUrl;
  }

  return {
    'Users' : require('./users')(config),
    'Venues' : require('./venues')(config),
    'Checkins' : require('./checkins')(config),
    'Tips' : require('./tips')(config),
    'Lists' : require('./lists')(config),
    'Photos' : require('./photos')(config),
    'Settings' : require('./settings')(config),
    'Specials' : require('./specials')(config),
    'Updates' : require('./updates')(config),
    'Events' : require('./events')(config),
    'getAccessToken' : getAccessToken,
    'getAuthClientRedirectUrl' : getAuthClientRedirectUrl
  }
};
