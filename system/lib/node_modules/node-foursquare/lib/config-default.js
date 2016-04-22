
var winston = require('winston');

module.exports = {
  'foursquare' : {
    'accessTokenUrl' : 'https://foursquare.com/oauth2/access_token',
    'authenticateUrl' : 'https://foursquare.com/oauth2/authenticate',
    'apiUrl' : 'https://api.foursquare.com/v2'
    /*
      This field will indicate which version of the Foursquare API you wish to
      call. If not specified it will use the minimum date for the
      Foursquare/Swarm migration.
     */
    // 'version' : '20140806',
    /*
      This field determines how this library handles endpoints that return
      results along with an error, (e.g. deprecations).
        - If set to 'WARN' (default), log4js will write a warning to the log,
          (NOTE: You must raise the 'node-foursquare.core' log4js level to WARN
          or lower in order to see these warnings.
        - If set to 'ERROR', the library will behave as though it encountered
          an ERROR and not return results.
     */
    // 'warnings' : 'WARN'
  },
  'winston' : {
    'transports' : [
      new (winston.transports.Console)(
        {
          'level' : 'enter',
          'colorize' : true
        }
      )
    ],
    'levels': {
      'detail': 0,
      'trace': 1,
      'debug': 2,
      'enter': 3,
      'info': 4,
      'warn': 5,
      'error': 6
    },
    'colors': {
      'detail': 'grey',
      'trace': 'white',
      'debug': 'blue',
      'enter': 'inverse',
      'info': 'green',
      'warn': 'yellow',
      'error': 'red'
    },
    'loggers': {
      'default': {
        'console': {
          'level': 'none'
        }
      }
    }
  },
  'secrets' : { }
};
