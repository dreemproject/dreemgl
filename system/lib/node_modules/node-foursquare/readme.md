node-foursquare
==================

Fault-tolerant Foursquare API wrapper for Node JS.


Install
-------

    npm install node-foursquare

Version History
---------------

*  v0.0.1 - First release
*  v0.0.2 - Bug Fixes and Downstream Merges
*  v0.1.0 - Suggested Refactoring and latest endpoints from Foursquare (VERY NON-PASSIVE)
    * Surround results with field name.
    * Userless Access Tokens (for Venues.explore, etc).
    * Ability to load single portions of the library, (e.g. only import Venues).
    * Users - Leaderboard, Requests
    * Venues - Categories, Explore
*  v0.1.1 - Support for Foursquare API Version + Deprecation Warnings (via configuration).
*  v0.1.2 - Added new mayorships endpoint, removed extraneous field from User.getBadges (non-passive).
*  v0.1.3 - Added Updates endpoint, updated to log4js v0.3.x.
*  v0.1.4 - Added Lists and Events endpoints.
*  v0.2.0 - Overhaul
    * Replaced log4js with winston.
    * Added new endpoints, modules, methods.
    * Refactored testing suite.
*  v0.2.1 - Unit test fixes and bugs/merges
*  v0.3.0 - Remove deprecated Foursquare API endpoints, support new parameters.

Use
---

The Foursquare module takes a configuration parameter containing logging and
client keys. It also supports alternate Foursquare URLs if necessary, (but that
is unlikely).

    var config = {
      'secrets' : {
        'clientId' : 'CLIENT_ID',
        'clientSecret' : 'CLIENT_SECRET',
        'redirectUrl' : 'REDIRECT_URL'
      }
    }

    var foursquare = require('node-foursquare')(config);

Once instantiated, you just need to set up endpoints on your own server that
match your OAuth configuration in Foursquare.  Using Express, for example:

    var app = express();

    app.get('/login', function(req, res) {
      res.writeHead(303, { 'location': foursquare.getAuthClientRedirectUrl() });
      res.end();
    });


    app.get('/callback', function (req, res) {
      foursquare.getAccessToken({
        code: req.query.code
      }, function (error, accessToken) {
        if(error) {
          res.send('An error was thrown: ' + error.message);
        }
        else {
          // Save the accessToken and redirect.
        }
      });
    });

Foursquare API Version and Deprecation Warnings
-----------------------------------------------

Foursquare allows consumers to specify a 'version' of their API to invoke,
based on the date that version became active. For example, passing a version
string of '20110101' uses the API as of Jan 1, 2011.  By default, this library
will use a version of '20140806', the minimum date for the Foursquare/Swarm
migration.

To enable a different version of the API, add the following to configuration:

    var config = {
      ...
      'foursquare' : {
        ...
        'version' : '20140806',
        ...
      }
      ...
    }


The Foursquare API now supports a 'mode' parameter, either 'foursquare' or
'swarm'.  This parameter is now required.  By default, this library will assume
'foursquare'.  You can change this through configuration:

    var config = {
      ...
      'foursquare' : {
        ...
        'mode' : 'swarm',
        ...
      }
      ...
    }


When using an older API, Foursquare will provide deprecation warnings, (if
applicable). By default, this library will write these warnings to the log,
which will only be visible if logging for 'node-foursquare' is turned on, (see
'Logging', below).

You can configure this library to throw an error instead:

    var config = {
      ...
      'foursquare' : {
        ...
        'warnings' : 'ERROR',
        ...
      }
      ...
    }


Logging
-------

This module uses winston to log events. By default, the logging level is set to
'none'.  If you  want to output logging messages from the different modules of
this library, you can add overrides to your configuration object.  For example,
to log debug (and higher) messages in Venues and warnings in Core to the console:

    var config = {
      'winston' : {
        'loggers': {
           'core': {
             'console': {
               'level': 'warn'
             }
           },
           'venues': {
             'console': {
               'level': 'debug'
             }
           }
         }
      ...
    }

    var foursquare = require('node-foursquare')(config);

For a list of existing logging points, refer to [config-default.js](https://github.com/clintandrewhall/node-foursquare/blob/master/lib/config-default.js).

For more information, see: https://github.com/flatiron/winston

I18n
----

Add locale param to config:

    var config = {
        ...
        'locale' : 'it'
        ...
    }

Valid locales are listed in https://developer.foursquare.com/overview/versioning

Testing
-------

To test, you need to create a config.js file in the /test directory as follows:

    module.exports = {
      'secrets' : {
        'clientId' : 'YOUR_CLIENT_ID',
        'clientSecret' : 'YOUR_CLIENT_SECRET',
        'redirectUrl' : 'http://localhost:3000/callback' // This should also be set in your OAuth profile.
      }
    };

Then, simply invoke the test.js file with Node.JS:

    node test.js

If you hit [http://localhost:3000](http://localhost:3000), you'll be redirected
for an authentication token.

If you hit [http://localhost:3000/test](http://localhost:3000/test), you'll
test the entire library with no authentication, (and get appropriate errors for
protected endpoints).

Testing results will be logged to the console.

All tests use examples as suggested by the [Foursquare Endpoint Explorer](https://developer.foursquare.com/docs/explore.html).

Notes
-----

This module is a read-only subset of the full Foursquare API, but further
capability, (adding, posting, updating, etc), is forthcoming. Bugs and Pull
Requests are, of course, accepted! :-)

This project is a refactoring and enhancement of:
https://github.com/yikulju/Foursquare-on-node
