var assert = require('assert'),
  util = require('util'),
  testUtil = require('./utilities');

var EventsTests = function(config, accessToken) {
  var Foursquare = require('./../lib/node-foursquare')(config),
    logger = testUtil.getLogger('Events-Test');

  return {
    getEvent : function() {
      var test = 'Foursquare.Events.getEvent(4e173d2cbd412187aabb3c04)';
      Foursquare.Events.getEvent('4e173d2cbd412187aabb3c04', accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.event);
            assert.ok(data.event.id == '4e173d2cbd412187aabb3c04');
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getCategories : function() {
      var test = 'Foursquare.Events.getCategories()';
      Foursquare.Events.getCategories(null, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.categories);
            assert.ok(data.categories.length > 0);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },
  
    search : function() {
      var test = 'Foursquare.Events.search(domain=songkick.com,eventId=8183976)',
        params = {
          'domain' : 'songkick.com',
          'eventId' : '8183976'
        };
      Foursquare.Events.search(params, accessToken, function (error, data) {
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
    }
  }
};

module.exports = EventsTests;
