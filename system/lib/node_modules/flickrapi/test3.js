/**
 * This is a test runner that sets up the Flickr
 * API, and uses its connect/express proxy function
 * to listen for API calls that are POST'ed to the
 * API url. In this case:
 *
 *  http://127.0.0.1:3000/service/rest/flickr.method.name
 *
 * A test page for this API can be accessed by
 * loading http://127.0.0.1:3000 in your browser.
 */
var habitat = require("habitat"),
    env = habitat.load(),
    Flickr = require("./src/FlickrApi"),
    FlickrOptions = env.get("FLICKR"),
    // node test => auth test; node test false => token only test
    testAuthenticated = process.argv.indexOf("testAuthenticated") > -1,
    testUpload = process.argv.indexOf("testUpload") > -1,
    server;


Flickr.authenticate(FlickrOptions, function(error, flickr) {

    var util = require('util');

    flickr.people.getPhotos({
        api_key: flickr.options.api_key,
        user_id: flickr.options.user_id,
        page: 1,
        per_page: 2,
        authenticated: false
    }, function(err, result) {
        console.log(util.inspect(result, false, null));
    });
    
    console.log("k, we're done.");
    
});
