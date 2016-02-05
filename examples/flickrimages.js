/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


// The server uses flickrlib to retrieve flickr images from the SF area.
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
			// Server side service: flickrservice
			service({
				name:'flickrservice'

				// Retrieve urls using the flickr streaming using the search interface.
				,runflickr: function() {
					//TODO $system doesn't work here
					if (this.flickr) {
						// Stop an already running stream
						delete this.flickr;
					}
          var FlickrLib = require('../system/lib/flickrlib');
          this.flickr = new FlickrLib();

					// The flickrlib returns an array of photos
					var callback = (function(images) {
						//console.log('CALLBACK images', images);
						var photos = images.photos.photo;
						var urls = [];
						for (var i=0; i<photos.length; i++) {
							var photo = photos[i];
							var url = photo.url_m;
							if (url)
								urls.push(url);
							//console.log(i, photo);
						}
						this.rpc.default.imageupdate(urls);

					}).bind(this);

					// The second argument will specify search parameters
					this.flickr.search(callback);
				}

			}),


			screen({
				name:'default'
				,clearcolor:'white'
				,viewindex:0
				,init: function() {
					this.rpc.flickrservice.runflickr();
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
