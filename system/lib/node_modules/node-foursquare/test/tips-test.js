var assert = require('assert'),
  util = require('util'),
  testUtil = require('./utilities');

var TipsTest = function(config, accessToken) {
  var Foursquare = require('./../lib/node-foursquare')(config),
    logger = testUtil.getLogger('Tips-Test');

  return {
    getDone : function() {
      var test = 'Foursquare.Tips.getDone(4e5b969ab61c4aaa3e183989)';
      Foursquare.Tips.getDone('4e5b969ab61c4aaa3e183989', {}, accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.done);
            assert.ok(data.done.count >= 0);
            assert.ok(data.done.groups);
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    },

    getLikes : function() {
      var test = 'Foursquare.Tips.getLikes(4e5b969ab61c4aaa3e183989)';
      Foursquare.Tips.getLikes('4e5b969ab61c4aaa3e183989', accessToken, function (error, data) {
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
      });
    },

    getListed : function() {
      var test = 'Foursquare.Tips.getListed(4e5b969ab61c4aaa3e183989)';
      Foursquare.Tips.getListed('4e5b969ab61c4aaa3e183989', {}, accessToken, function (error, data) {
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

    getTip : function() {
      var test = 'Foursquare.Tips.getTip(4b5e662a70c603bba7d790b4)';
      Foursquare.Tips.getTip('4b5e662a70c603bba7d790b4', accessToken, function (error, data) {
        if(error) {
          testUtil.reportError(logger, test, error.message);
        }
        else {
          try {
            testUtil.reportData(logger, test, util.inspect(data));
            assert.ok(data.tip);
            assert.equal(data.tip.id, '4b5e662a70c603bba7d790b4');
            testUtil.reportOk(logger, test);
          } catch (error) {
            testUtil.reportError(logger, test, error);
          }
        }
      });
    }
  }
};

module.exports = TipsTest;
