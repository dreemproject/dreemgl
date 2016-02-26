/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

// The server uses twitterlib to retrieve twitter data.

define.class(function($server$, composition, service, $ui$, screen, view, label, require){

	this.render = function(){
		// Generate placeholder images (using the teem logo).
		var dynviews = []
		var nimages = 4
		var imagesize = vec2(256, 256)
		// Display a default image for each view
		for (var n=0; n<nimages; n++) {
			var v1 = view({
				size: imagesize
				,bgimage: 'http://teem.nu/wp-content/uploads/2015/11/TEEMlogo.png'
			})
			dynviews.push(v1)
		}

		var views = [
			// Server side service: twitterservice
			service({
				name:'twitterservice'
				// Retrieve urls using the twitter streaming interface or the
				// search interface. If streaming is true, use the streaming interface.
				// Otherwise, use the search interface
				// If maxid is specified, it will be used for multi-page search
				// TODO maxid doesn't seem to work properly in the npm package
				,runtwitter: function(streaming, maxid) {
					//TODO $system doesn't work here
					if (this.twitter) {
						// Stop an already running stream
						delete this.twitter
					}
					var TwitterLib = require('../../system/lib/twitterlib')
					this.twitter = new TwitterLib()
					// The twitterlib returns an array of tweets, which contain the url.
					// The maxid can be used when running another regular search.
					var callback = (function(tweets, maxid) {
						var urls = []
						for (var i=0; i<tweets.length; i++) {
							var tweet = tweets[i]
							var media = tweet.entities.media
							if (media) {
								var url = media[0].media_url
								urls.push(url)
							}
						}
						this.rpc.default.imageupdate(urls, maxid)
					}).bind(this)
					// Start the streaming interface. images urls handles by callback
					if (streaming)
						this.twitter.streaming(callback)
					else
						this.twitter.search(callback, {nresults: 100, maxid: maxid})
				}
			}),
			screen({
				name:'default',
				clearcolor:'white',
				viewindex:0,
				init: function() {
					// Call the server to start retrieving images
					var use_streamer = true
					this.rpc.twitterservice.runtwitter(use_streamer)
				},
				// Receive image urls from the server. These are displayed in sequence
				imageupdate: function(urls, maxid) {
					for (var i=0; i<urls.length; i++) {
						var url = urls[i]
						var v = this.children[this.viewindex]
						v.bgimage = url
						this.viewindex = (this.viewindex+1) % nimages
					}
				}
			}, [
				dynviews
			])
		]
		return views
	}
})
