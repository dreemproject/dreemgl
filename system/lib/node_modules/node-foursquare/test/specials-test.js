var assert = require('assert'),
  util = require('util'),
  testUtil = require('./utilities');

var SpecialsTest = function(config, accessToken) {
  var Foursquare = require('./../lib/node-foursquare')(config),
    logger = testUtil.getLogger('Specials-Test');

  return {
    getSpecial : function() {
      var test = 'Foursquare.Specials.getSpecial(\'4c06d48086ba62b5f05988b3\', \'4e0deab3922e6f94b1410af3\')';
      Foursquare.Specials.getSpecial('4c06d48086ba62b5f05988b3', '4e0deab3922e6f94b1410af3', {}, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.special);
            assert.ok(data.special.id == '4c06d48086ba62b5f05988b3');
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    search : function() {
      var test = 'Foursquare.Specials.search(40.7, -74)';
      Foursquare.Specials.search('40.7', '-74', {}, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.specials);
            assert.ok(data.specials.count >= 0);
            assert.ok(data.specials.items);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    }
  }
};

module.exports = SpecialsTest;
