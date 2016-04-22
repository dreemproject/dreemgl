/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

/**
 * @class FourSquareLib
 * Interface class between npm node-foursquare and dreemgl
 * Requires the flickr npm modules:
 *   'npm install node-foursquare'.
 */

define.class(function(exports){
	var FourSquareLib = exports

	/**
	 * @method constructor
	 * Create a FourSquareLib object with default parameters. The credentials
	 * are read from environment variables,
	 *   FOURSQUARE_CLIENT_ID
	 *   FOURSQUARE_SECRET
	 *
	 * Install the foursquare object via 'npm install node-foursquare'.
	 */
	this.atConstructor = function(clientid, secret) {
		var config = {
			foursquare: {},
			secrets: {
				clientId: process.env.FOURSQUARE_CLIENT_ID || clientid,
				clientSecret: process.env.FOURSQUARE_SECRET || secret,
				redirectUrl: 'redirect'
			}
		}
		this.foursquare = require('node-foursquare')(config)
		// We're using calls that don't require an access token
		this.accessToken = ''
	}

	// Search interface to query recomended locations. Only locations with
	// images are returned.
	// https://developer.foursquare.com/docs/venues/explore
	//
	// callback Callback method which is passed the returned venues, as an array.
	// location Location to search around [lat, lon]. If missing, SF is used
	// options  Hash of search options. If not defined, defaults are used.
	this.search = function(options, callback) {
		options = options || {}

		if (options['location'] === undefined) options['location'] = [37.859603, -122.491075]
		if (options['openNow'] === undefined) options['openNow'] = 0
		if (options['venuePhotos'] === undefined) options['venuePhotos'] = 1
		if (options['limit'] === undefined) options['limit'] = 250
		if (options['radius'] === undefined) options['radius'] = 1000
		if (options['section'] === undefined) options['section'] = 'coffee'

		// Search for locations
		this.foursquare.Venues.explore(options.location[0], options.location[1], null, options, this.accessToken, function(error, data) {
			if (error) console.error('error', error)
			//console.log('data', data)

			venues = []
			// Return information for the first set of items
			if (data && data.groups) {
				var items = data.groups[0].items
				for (var i in items) {
					var venue = items[i].venue
					var photoUrl
					if (venue.photos && venue.photos.groups) {
						// Ignore any issues with the returned data
						try {
							var group = venue.photos.groups[0]
							if (!group) continue
							var item = venue.photos.groups[0].items[0]
							photoUrl = item.prefix + '300x300' + item.suffix
						}
						catch (ex) {
							console.error('Exception', ex)
						}
					}

					venues.push({
						url: photoUrl,
						id: venue.id,
						title: venue.name,
						width: 300,
						height: 300,
						latitude: venue.location.lat,
						longitude: venue.location.lng,
						category: venue.categories[0].shortName,
						rating: venue.rating,
						price: venue.price ? venue.price.tier : 0
					})

				}
			}
			callback(venues)
		})

	}

})
