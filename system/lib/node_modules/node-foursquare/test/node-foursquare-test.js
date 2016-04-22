var util = require('util'),
	express = require('express'),
	assert = require('assert'),
  winston = require('winston'),
  config = require('./config'),
  testUtil = require('./utilities'),
  Foursquare = require('./../lib/node-foursquare')(config);

function TestSuite(accessToken) {
  var Tests = {
    'Checkins' : require('./checkins-test')(config, accessToken),
    'Events' : require('./events-test')(config, accessToken),
    'Lists' : require('./lists-test')(config, accessToken),
    'Photos' : require('./photos-test')(config, accessToken),
    'Settings' : require('./settings-test')(config, accessToken),
    'Specials' : require('./specials-test')(config, accessToken),
    'Tips' : require('./tips-test')(config, accessToken),
    'Updates' : require('./updates-test')(config, accessToken),
    'Users' : require('./users-test')(config, accessToken),
    'Venues' : require('./venues-test')(config, accessToken)
  };

  return {
    'Tests' : Tests,
    'execute' : function(testGroup, testName) {
      for(var group in Tests) {
        if(!testGroup || (testGroup && testGroup == group)) {
          for(var test in Tests[group]) {
            if(!testName ||(testName && testName == test)) {
              var t = Tests[group][test];
              if(t && typeof(t) == 'function') {
                t.call(this);
              }
            }
          }
        }
      }
    }
  }
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
  var accessToken = req.query.token || null, type = 'Testing with' + (accessToken ? '' : 'out') + ' Authorization';

  if (!accessToken) {
    type += ' (tests of API endpoints requiring an access token will not pass)';
  }

  util.log('\n\n' + type + '\n');
  TestSuite(accessToken).execute();
  res.send('<html></html><title>Refer to Console</title><body>' + type + '...</body></html>');
});

app.listen(3000);
