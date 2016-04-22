var assert = require('assert'),
    util = require('util'),
    testUtil = require('./utilities');

var UsersTests = function(config, accessToken) {
  var Foursquare = require('./../lib/node-foursquare')(config),
    logger = testUtil.getLogger('Users-Test');

  return {
    getCheckins : function() {
      var test = 'Foursquare.Users.getCheckins(self)';
      Foursquare.Users.getCheckins(null, null, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(logger, data.checkins);
            assert.ok(logger, data.checkins.count >= 0);
            assert.ok(logger, data.checkins.items);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getFriends : function() {
      var test = 'Foursquare.Users.getFriends(self)';
      Foursquare.Users.getFriends(null, null, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(logger, data.friends);
            assert.ok(logger, data.friends.count >= 0);
            assert.ok(logger, data.friends.items);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getLists : function() {
      var test = 'Foursquare.Users.getLists(self)';
      Foursquare.Users.getLists(null, null, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(logger, data.lists);
            assert.ok(logger, data.lists.count >= 0);
            assert.ok(logger, data.lists.groups);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getMayorships : function() {
      var test = 'Foursquare.Users.getMayorships(self)';
      Foursquare.Users.getMayorships(null, null, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(logger, data.mayorships);
            assert.ok(logger, data.mayorships.count >= 0);
            assert.ok(logger, data.mayorships.items);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getPhotos : function() {
      var test = 'Foursquare.Users.getPhotos(self)';
      Foursquare.Users.getPhotos(null, null, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(logger, data.photos);
            assert.ok(logger, data.photos.count >= 0);
            assert.ok(logger, data.photos.items);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getRequests : function() {
      var test = 'Foursquare.Users.getRequests()';
      Foursquare.Users.getRequests(accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(logger, data.requests);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getTips : function() {
      var test = 'Foursquare.Users.getTips(self)';
      Foursquare.Users.getTips(null, null, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(logger, data.tips);
            assert.ok(logger, data.tips.count >= 0);
            assert.ok(logger, data.tips.items);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getUser : function() {
      var test = 'Foursquare.Users.getUser(self)';
      Foursquare.Users.getUser('self', accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(logger, data.user);
            assert.ok(logger, data.user.id);
            assert.ok(logger, data.user.firstName);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });

      Foursquare.Users.getUser('33', accessToken, function (error, data) {
        var test = 'Foursquare.Users.getUser(33)';
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(logger, data.user);
            assert.equal(data.user.id, '33');
            assert.equal(data.user.firstName, 'naveen');
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getVenueHistory : function() {
      var test = 'Foursquare.Users.getVenueHistory(self)';
      Foursquare.Users.getVenueHistory(null, null, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(logger, data.venues);
            assert.ok(logger, data.venues.count >= 0);
            assert.ok(logger, data.venues.items);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    search : function() {
      var params = { 'twitter': 'naveen' },
        test = 'Foursquare.Users.search(twitter=naveen)';
      Foursquare.Users.search(params, accessToken, function(error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(logger, data.results);
            assert.equal(data.results[0].id, '33');
            assert.equal(data.results[0].firstName, 'naveen');
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    }
  }
};

module.exports = UsersTests;
