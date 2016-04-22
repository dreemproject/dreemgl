var assert = require('assert'),
  util = require('util'),
  testUtil = require('./utilities');

var VenuesTest = function(config, accessToken) {
  var Foursquare = require('./../lib/node-foursquare')(config),
    logger = testUtil.getLogger('Venues-Test');

  return {

    explore : function() {
      var test = 'Foursquare.Venues.explore(40.7, -74, \'wine\')';
      Foursquare.Venues.explore('40.7', '-74', null, {}, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
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
      });
    },

    getCategories : function() {
      var test = 'Foursquare.Venues.getCategories()';
      Foursquare.Venues.getCategories({}, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.categories);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getEvents : function() {
      var test = 'Foursquare.Venues.getEvents(\'40afe980f964a5203bf31ee3\')';
      Foursquare.Venues.getEvents('40afe980f964a5203bf31ee3', accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.events);
            assert.ok(data.events.count >= 0);
            assert.ok(data.events.items);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getHereNow : function() {
      var test = 'Foursquare.Venues.getHereNow(\'5104\')';
      Foursquare.Venues.getHereNow('5104', null, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.hereNow);
            assert.ok(data.hereNow.count >= 0);
            assert.ok(data.hereNow.items);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getHours : function() {
      var test = 'Foursquare.Venues.getHours(\'40afe980f964a5203bf31ee3\')';
      Foursquare.Venues.getHours('40afe980f964a5203bf31ee3', accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.hours);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getLikes : function() {
      var test = 'Foursquare.Venues.getLikes(\'40afe980f964a5203bf31ee3\')';
      Foursquare.Venues.getLikes('40afe980f964a5203bf31ee3', accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.likes);
            assert.ok(data.likes.count >= 0);
            assert.ok(data.likes.items);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });},

    getLinks : function() {
      var test = 'Foursquare.Venues.getLinks(\'5104\')';
      Foursquare.Venues.getLinks('5104', accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.links);
            assert.ok(data.links.count >= 0);
            assert.ok(data.links.items);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getListed : function() {
      var test = 'Foursquare.Venues.getListed(\'40afe980f964a5203bf31ee3\')';
      Foursquare.Venues.getListed('40afe980f964a5203bf31ee3', null, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.lists);
            assert.ok(data.lists.count >= 0);
            assert.ok(data.lists.groups);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getManaged : function() {
      var test = 'Foursquare.Venues.getManaged()';
      Foursquare.Venues.getManaged(accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.venues);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getMenu : function() {
      var test = 'Foursquare.Venues.getMenu(\'40afe980f964a5203bf31ee3\')';
      Foursquare.Venues.getMenu('40afe980f964a5203bf31ee3', accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.menu);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getPhotos : function() {
      var test = 'Foursquare.Venues.getPhotos(\'5104\')';
      Foursquare.Venues.getPhotos('5104', null, null, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.photos);
            assert.ok(data.photos.count >= 0);
            assert.ok(data.photos.items);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getSimilar : function() {
      var test = 'Foursquare.Venues.getSimilar(\'40afe980f964a5203bf31ee3\')';
      Foursquare.Venues.getSimilar('40afe980f964a5203bf31ee3', accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.similarVenues);
            assert.ok(data.similarVenues.count >= 0);
            assert.ok(data.similarVenues.items);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getStats : function() {
      testUtil.reportError(
        logger,
        'Foursquare.Venues.getSimilar(\'40afe980f964a5203bf31ee3\')',
        'Cannot test: Foursquare does not supply a mock.'
      );
    },

    getSuggestcompletion : function() {
      var test = 'Foursquare.Venues.getSuggestcompletion(\'40.7\', \'-74\', \'foursqu\')';
      Foursquare.Venues.getSuggestcompletion('40.7', '-74', 'foursqu', null, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.minivenues);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getTimeseries : function() {
      testUtil.reportError(
        logger,
        'Foursquare.Venues.getTimeseries(\'40afe980f964a5203bf31ee3\')',
        'Cannot test: Foursquare does not supply a mock.'
      );
    },

    getTips : function() {
      var test = 'Foursquare.Venues.getTips(\'5104\')';
      Foursquare.Venues.getTips('5104', null, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.tips);
            assert.ok(data.tips.count >= 0);
            assert.ok(data.tips.items);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getTrending : function() {
      var test = 'Foursquare.Venues.getTrending(40.7, -74)';
      Foursquare.Venues.getTrending('40.7', '-74', {}, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.venues);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getVenue : function() {
      var test = 'Foursquare.Venues.getVenue(\'5104\')';
      Foursquare.Venues.getVenue('5104', accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.venue);
            assert.equal(data.venue.id, '40a55d80f964a52020f31ee3');
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    search : function() {
      var test = 'Foursquare.Venues.search(40.7, -74)';
      Foursquare.Venues.search('40.7', '-74', null, {}, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.venues);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    }
  }
};

module.exports = VenuesTest;
