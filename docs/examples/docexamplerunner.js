/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

// Use to run the guideds examples on a 2nd screen. The doctracker screeen
// runs in a 1x1 pixels iframe in the guide, and the position information
// is send into the guide from a JS snippet embedded into the markdown.
define.class("$server/composition", function ($server$, service, $ui$, screen, view) {
// internal

	this.style = {
	};

	// Embedded service class which sends a random set of pos/size values
	// to the client.
	define.class(this, "docexampleservice", "$server/service", function(){

		this.attributes = {
			href: Config({type:String, value: ''}),
		}

		this.href = function() {
			console.log("onhref: href=" + this.href);
		}

		this.loadExample = function(example) {
			console.log(example);
			var example = JSON.parse(example);
			this.href = example.href;
			this.exampleProps = example.props;
			console.log("props", this.exampleProps);
		}

	});


	// Screen renders in 1x1 pixel iframe; only used to push the new composition
	// name into the iFrame's parent document.
	define.class(this, "trackscreen", screen, function() {

		this.attributes = {
			href: Config({type:String, value: ''}),
			prevExample: Config({type:String, value: ''})
		};

		// Detects if composition is running inside iFrame
		var inIframe = function() {
			try {
				return window.self !== window.top;
			} catch (e) {
				return true;
			}
		}
		this.loadExample = function(url) {
			var topDoc = window.top.document;
			var lastSlash = this.href.lastIndexOf('/');
			window.top.loadComposition(this.href, this.href.substring(lastSlash+1, this.href.length));
		}

		this.onhref = function() {
			if (inIframe()) {
				// DreemGL running inside a frame of guide-example-viewer.html
				// Now load the example composition into the iframe with id exampleRunner
				// in that document.
				if (window.top.location.href.indexOf('exviewer.html') != -1) {
					if (this.prevExample !== this.href) {
						this.prevExample = this.href;
						this.loadExample();
					}
				}
			}
		}

	})

	this.render = function() {
		return[
			this.docexampleservice({name:'exampleservice'}),
			this.trackscreen(
				{
					name: 'doctracker',
					clearcolor: 'white',
					props: wire('this.rpc.exampleservice.props'),
					href: wire('this.rpc.exampleservice.href')
				}
			)
		];
	}
});
