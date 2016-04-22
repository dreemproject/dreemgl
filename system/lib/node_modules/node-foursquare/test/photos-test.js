var assert = require('assert'),
  util = require('util'),
  testUtil = require('./utilities');

var PhotosTests = function(config, accessToken) {
  var Foursquare = require('./../lib/node-foursquare')(config),
    logger = testUtil.getLogger('Photos-Test');

  return {
    getPhoto : function() {
      var test = 'Foursquare.Photos.getPhoto(4d0fb8162d39a340637dc42b)';
      Foursquare.Photos.getPhoto('4d0fb8162d39a340637dc42b', accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.photo);
            assert.equal(data.photo.id, '4d0fb8162d39a340637dc42b');
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    }
  }
};

module.exports = PhotosTests;
