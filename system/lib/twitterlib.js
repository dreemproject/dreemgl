/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

/**
 * @class TwitterLib
 * Interface class between npm twitter and dreemgl
 * Requires the twitter npm modules:
 *   'npm install twitter'.
 */

define.class(function(exports){
	var TwitterLib = exports

	// No credentials are stored in source. You must define them as an
	// environment variable
	Twitter = require('twitter')

	/**
	 * @method constructor
	 * Create a TwitterLib object with default parameters. The credentials
	 * are read from environment variables,
	 *   TWITTER_CONSUMER_KEY
	 *   TWITTER_CONSUMER_SECRET
	 *   TWITTER_ACCESS_TOKEN_KEY
	 *   TWITTER_ACCESS_TOKEN_SECRET
	 *
	 *   All four values are required to use the streaming interface. If you
	 *   do not specify the TWITTER_ACCESS_TOKEN_* for a search query, the
	 *   application rate-limits will apply.
	 *
	 * Install the twitter object via 'npm install twitter'.
	 * You can access the twitter npm object using this.twitter
	 */
	this.atConstructor = function(view) {
		// Create the twitter object using environment creds
		//console.log('twitterlib')
		this.twitter = new Twitter({
			consumer_key: process.env.TWITTER_CONSUMER_KEY,
			consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
			access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
			access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
		})
	}

	// Search interface to retrieve images. You can call this routine multiple
	// times if you need more images, but you run the risk of hitting rate limits.
	// If 0 results are returned you should not continue searcing.
	// Multiple pages is not currently working. You can retrieve up to 100
	// results per query.
	//
	// cb      Callback method which is passed the returned tweets, as an array,
	//         and the next maxid argument if you need additional tweets.
	// options is a hash of:
	//   query    The twitter query string
	//            See: https://dev.twitter.com/rest/public/search
	//   geocode  Optional geocode location
	//   nresults The number of results to return. Default = 25
	//   maxid    (multi-page support). The maxid parameter. This is the
	//            tweet.id_str-1 from the last tweet returned.
	this.search = function(options, cb) {
		// Parse the arguments
		options = options || {}
		var nresults = options.nresults || 25
		var maxid = options.maxid || 25

		var defaultquery='-RT&filter:images'
		var query = options.query || defaultquery

		var defaultgeocode='37.781157,-122.398720,4mi'
		var geocode = options.geocode || defaultgeocode

		if (nresults > 100) nresults = 100
		var args = {q: query, geocode: geocode, result_type: 'recent', count: nresults, maxid: maxid}
		console.log('multi-page maxid', maxid)

		// Decrement the string id (64-bit) without using a bigint package
		// http://webapplog.com/decreasing-64-bit-tweet-id-in-javascript/
		var decid = function(id) {
			var result=id
			var i=id.length-1
			while (i>-1) {
				if (id[i]==="0") {
					result=result.substring(0,i)+"9"+result.substring(i+1)
					i--
				}
				else {
					result=result.substring(0,i)+(parseInt(id[i],10)-1).toString()+result.substring(i+1)
					return result
				}
			}
			return result
		}

		// Retrieve a page of results
		this.twitter.get('search/tweets', args, function(error, tweets, response){
			var result_tweets = []

			// Check each tweet before adding it to the list.
			var lastid
			console.log(error, tweets)
			console.log('received', tweets.statuses.length, ' tweets')
			for (var i=0; i<tweets.statuses.length; i++) {
				var tweet = tweets.statuses[i]
				lastid = tweet.id_str
				var media = tweet.entities.media
				if (media && !tweet.possibly_sensitive) {
					result_tweets.push(tweet)
				}
			}

			// The next id is the lastid-1, but this is a 64-bit quantity
			// Instead of adding another npm module, do it manually
			if (lastid) {
				lastid = decid(lastid)
			}
			cb(result_tweets, lastid)
		})
	}

	// Search interface. This returns an array of tweets, which will invoke
	// a callback method for each one. Same calling interface as streaming
	// If you don't specify a query, a default SF query is used
	// Watch out for rate limits
	this.oldsearch = function(cb, query) {
		// Test the twitter search interface
		var defaultquery='-RT&geocode:"37.781157,-122.398720,2mi"&filter:images'
		query = query || defaultquery
		this.twitter.get('search/tweets', {q: query, result_type: 'recent', count: 25}, function(error, tweets, response){
			//console.log('tweets', tweets)
			for (var i=0; i<tweets.statuses.length; i++) {
				var tweet = tweets.statuses[i]
				var media = tweet.entities.media
				if (media && !tweet.possibly_sensitive) {
					// Take the first url
					var url = media[0].media_url
					console.log('twitter url', url)
					cb(url, tweet)
				}
			}
		})
	}

	// Streaming interface. Returns the tweet to a callback method.
	// This is hardcoded to return images posted from San Francisco
	this.streaming = function(cb) {
		// Test the twitter streaming interface
		var locations = '-122.75,36.7,-121.75,37.9'
		var track = 'filter:images'
		this.twitter.stream('statuses/filter', {locations: locations, track: track}, function(stream) {
			stream.on('data', function(tweet) {
				// Only return tweets with images
				if (tweet.entities && tweet.entities.media && !tweet.possibly_sensitive) {
					// Return as an array to match search interface
					cb([tweet])
				}
			})
			stream.on('error', function(error) {
				//console.log('ERROR', error)
			})
		})
	}

})
