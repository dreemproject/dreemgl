/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others. 
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


/**
 * @class FlickrLib
 * Interface class between npm flickrapi and dreemgl
 * Requires the flickr npm modules:
 *   'npm install flickrapi'.
 */

define.class(function(exports){
	var FlickrLib = exports

	// No credentials are stored in source. You must define them as an
	// environment variable
	Flickr = require('flickrapi')

	/**
	 * @method constructor
	 * Create a FlickrLib object with default parameters. The credentials
	 * are read from environment variables,
	 *   FLICKR_KEY
	 *   FLICKR_SECRET
	 *   FLICKR_USER_ID
	 *   FLICKR_ACCESS_TOKEN
	 *   FLICKR_ACCESS_TOKEN_SECRET
	 * 
	 * Install the flickr object via 'npm install flickrapi'.
	 * If you don't have the access tokens, you will be prompted to log into your
	 * flickr account and give permission.
	 *
	 * You can access the flickr npm object using this.flickr. It won't exist
	 * until authentication is finished.
	 */
	this.atConstructor = function() {
	}

	// Execute a flickr method(func), after authentication is complete.
	// This can be immediate, or delayed if the flickr object does not exist yet.
	this.execute = function(func) {
		if (this.flickr) {
			// Already authenticated.
			func();
			return;
		}
		
		// Authenticate
		var options = {
			api_key: process.env.FLICKR_KEY
			,secret: process.env.FLICKR_SECRET
			,user_id: process.env.FLICKR_USER_ID
			,access_token: process.env.FLICKR_ACCESS_TOKEN
			,access_token_secret: process.env.FLICKR_ACCESS_TOKEN_SECRET
			,silent: true
			,progress: false
		};

		var self = this;
		Flickr.authenticate(options, function(error, flickr) {
			if (error) {
				this.autherror = error;
				console.log('flickr Auth error', error);
				return;
			}
			self.flickr = flickr;

			// console.log("AUTH COMPLETE");

			func();
		});
	}


	// Search interface to retrieve images. You can call this routine multiple
	// times if you need more images, but you run the risk of hitting rate limits.
	// If 0 results are returned you should not continue searcing.
	// Multiple pages is not currently working. You can retrieve up to 100
	// results per query.
	//
	// cb      Callback method which is passed the returned tweets, as an array,
	//         and the next maxid argument if you need additional tweets.
	// options is a hash of search options. Default values to do a SF search
	//         will be used if no options are specified.
	this.search = function(cb, options) {

		if (!this.flickr) {
			if (this.autherror) {
				// Auth has already failed so exit
				return;
			}
			
			// Authenticate first and then run this method again
			var self = this;
			var func = (function() {
				//console.log('func callback after auth');
				self.search(cb, options)
			}.bind(this));
			this.execute(func);
			return;
		}

		// Already authenticated

		// Default options
		// https://www.flickr.com/services/api/flickr.photos.search.html
		if (!options) {
			options = {
				api_key : process.env.FLICKR_KEY
				//,sort: 'date-taken-desc'
				,lat: 37.7842
				,lon: -122.4016
				,radius: 2 // 2 km
				,per_page: 50
				,extras: 'geo, url_m'
				,min_taken_date: '2016-02-01'
			};
		}

		this.flickr.photos.search(options, function(err, result) {
			cb(result);
		});

		
		return;
	}

});
