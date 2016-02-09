/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


// The server uses foursquarelib to retrieve foursquare images from the SF area.
// 
// I don't think dreemgl supports something like 'background-size: contain' to
// scale the image to the size.


define.class(function($server$, composition, service, $ui$, screen, view, label, require){

	this.render = function(){

    // Generate placeholder images (using the teem logo).
		var dynviews = [];
		var nimages = 50;
    var imagesize = vec2(128, 128);
		// Display a default image for each view
		for (var n=0; n<nimages; n++) {
			var v1 = view({
				size: imagesize
				,bgimage: 'http://teem.nu/wp-content/uploads/2015/11/TEEMlogo.png'
			})
			dynviews.push(v1);
		}

		var views = [
			// Server side service: foursquareservice
			service({
				name:'foursquareservice'

				// Retrieve urls using the foursquare streaming using the search interface.
				,runfoursquare: function() {
					//TODO $system doesn't work here
					if (this.foursquare) {
						// Stop an already running stream
						delete this.foursquare;
					}
          var FoursquareLib = require('../system/lib/foursquarelib');
          this.foursquare = new FoursquareLib();

					// The foursquarelib returns an array of venues, with photos
					// https://developer.foursquare.com/docs/responses/venue
					var callback = (function(venues) {
						var urls = [];
						for (var i=0; i<venues.length; i++) {
							var venue = venues[i];
							// Grab the first image (300x300 resolution)
							if (venue.photos && venue.photos.groups) {
								var item = venue.photos.groups[0].items[0];
								var url = item.prefix + '300x300' + item.suffix;
								urls.push(url);
							}
						}
						this.rpc.default.imageupdate(urls);

					}).bind(this);

					// The second argument will specify search parameters
					// 
					this.foursquare.explore(callback, null, {openNow: 1});
				}

			}),


			screen({
				name:'default'
				,clearcolor:'white'
				,viewindex:0
				,init: function() {
					this.rpc.foursquareservice.runfoursquare();
				}

				// Receive image urls from the server. These are displayed in sequence
				,imageupdate: function(urls) {
					for (var i=0; i<urls.length; i++) {
						var url = urls[i];
						var v = this.children[this.viewindex];
						v.bgimage = url;
						this.viewindex = (this.viewindex+1) % nimages;
					}
				}
			}
					   ,dynviews)
		];

		return views
	}
})
