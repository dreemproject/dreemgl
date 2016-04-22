var assert = require('assert'),
  util = require('util'),
  testUtil = require('./utilities');

var ListsTests = function(config, accessToken) {
  var Foursquare = require('./../lib/node-foursquare')(config),
    logger = testUtil.getLogger('Lists-Test');

  return {
    getList : function() {
      var test = 'Foursquare.Lists.getList(4e4e804fd22daf51d267e1dd)';
      Foursquare.Lists.getList('4e4e804fd22daf51d267e1dd', accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.list);
            assert.equal(data.list.id, '4e4e804fd22daf51d267e1dd');
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },
  
    getFollowers : function() {
      var test = 'Foursquare.Lists.getFollowers(4e4e804fd22daf51d267e1dd)';
      Foursquare.Lists.getFollowers('4e4e804fd22daf51d267e1dd', accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.count);
            assert.ok(data.followers);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },
  
    getSuggestedPhotos : function() {
      var test = 'Foursquare.Lists.getSuggestedPhotos(4e4e804fd22daf51d267e1dd, v4bc49ceff8219c74ea97b710)';
      Foursquare.Lists.getSuggestedPhotos('4e4e804fd22daf51d267e1dd', 'v4bc49ceff8219c74ea97b710', accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.photos);
            assert.ok(data.photos.user);
            assert.ok(data.photos.user.count);
            assert.ok(data.photos.user.items);
            assert.ok(data.photos.others);
            assert.ok(data.photos.others.count);
            assert.ok(data.photos.others.items);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },
  
    getSuggestedTips : function() {
      var test = 'Foursquare.Lists.getSuggestedTips(4e4e804fd22daf51d267e1dd, v4bc49ceff8219c74ea97b710)';
      Foursquare.Lists.getSuggestedPhotos('4e4e804fd22daf51d267e1dd', 'v4bc49ceff8219c74ea97b710', accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.photos);
            assert.ok(data.photos.user);
            assert.ok(data.photos.user.count);
            assert.ok(data.photos.user.items);
            assert.ok(data.photos.others);
            assert.ok(data.photos.others.count);
            assert.ok(data.photos.others.items);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getSuggestedVenues : function() {
      var test = 'Foursquare.Lists.getSuggestedVenues(4e4e804fd22daf51d267e1dd)';
      Foursquare.Lists.getSuggestedVenues('4e4e804fd22daf51d267e1dd', accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.suggestedVenues);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    }
  }
};

module.exports = ListsTests;
