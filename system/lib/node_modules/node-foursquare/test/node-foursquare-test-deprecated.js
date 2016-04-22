var util = require('util'),
	express = require('express'),
	assert = require('assert'),
  winston = require('winston'),
  testUtil = require('./utilities'),
  config = require('./config');

config.foursquare.version = '20110101';
config.winston.loggers['core'] = config.winston.loggers['venues'] = {
  'console': {
    'colorize': 'true',
    'level': 'warn'
  }
};

var Foursquare = require('./../lib/node-foursquare')(config),
    test = 'ERROR, Version 20110101 : Foursquare.Venues.search(40.7, -74)',
    logger = testUtil.getLogger('Deprecations-Test');

function run(error, data) {
  if(error) {
    testUtil.reportError(logger, test, error);
  }
  else {
    try {
      testUtil.reportData(logger, test, util.inspect(data));
      assert.ok(data.groups);
      testUtil.reportOk(logger, test);
    } catch (error) {
      testUtil.reportError(logger, test, error);
    }
  }
}

function testDeprecated(accessToken) {
  Foursquare.Venues.search('40.7', '-74', null, {}, accessToken, function(error, data) {
    run(error, data);
    test = 'ERROR, Version 20110101 : Foursquare.Venues.search(40.7, -74)';
    config.foursquare.warnings = 'ERROR';
    Foursquare.Venues.search('40.7', '-74', null, {}, accessToken, function(error, data) {
      run(error, data);
    });
  });
}

// Using express was just faster... *sigh*
var app = express.createServer();

app.get('/', function(req, res) {
  var url = Foursquare.getAuthClientRedirectUrl(config.clientId, config.redirectUrl);
	res.writeHead(303, { 'location': url });
	res.end();
});

app.get('/callback', function (req, res) {
  Foursquare.getAccessToken({
    code: req.query.code
  }, function (error, accessToken) {
    if(error) {
      res.send('An error was thrown: ' + error.message);
    }
    else {
      res.redirect('/test?token=' + accessToken);
    }
  });
});

app.get('/test', function(req, res) {
  var accessToken = req.query.token || null, type = 'Testing Version + Deprecations with' + (accessToken ? '' : 'out') + ' Authorization';
  util.log('\n\n' + type + '\n');
  testDeprecated(accessToken);
  res.send('<html></html><title>Refer to Console</title><body>Testing Version + Deprecations...</body></html>');
});

app.listen(3000);