var assert = require('assert'),
  util = require('util'),
  testUtil = require('./utilities');

var SettingsTest = function(config, accessToken) {
  var Foursquare = require('./../lib/node-foursquare')(config),
    logger = testUtil.getLogger('Settings-Test');

  return {
    getSetting : function() {
      var test = 'Foursquare.Settings.getSetting(\'receivePings\')';
      Foursquare.Settings.getSetting('receivePings', accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(typeof data.value !== 'undefined');
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      })
    },

    getSettings : function() {
      var test = 'Foursquare.Settings.getSettings()';
      Foursquare.Settings.getSettings(accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.settings);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    }
  };
};

module.exports = SettingsTest;