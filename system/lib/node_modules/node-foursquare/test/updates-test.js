var assert = require('assert'),
  util = require('util'),
  testUtil = require('./utilities');

var UpdatesTest = function(config, accessToken) {
  var Foursquare = require('./../lib/node-foursquare')(config),
    logger = testUtil.getLogger('Updates-Test');

  return {
    getUpdate : function() {
      testUtil.reportError(
        logger,
        'Foursquare.Updates.getUpdate(\'[xxxx]\')',
        'Cannot test: Foursquare does not supply a mock.'
      );
    },

    getNotifications : function() {
      var test = 'Foursquare.Updates.getNotifications()';
      Foursquare.Updates.getNotifications({}, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.notifications);
            assert.ok(data.notifications.count >= 0);
            assert.ok(data.notifications.items);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    }
  }
};

module.exports = UpdatesTest;
