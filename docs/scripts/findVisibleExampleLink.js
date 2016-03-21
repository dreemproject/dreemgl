/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/


// Script which is included into the index.html for the docs. Uses
// a timer to detect if there are any anchors visible in a guide
// in the scroll area.

var exampleTracker = (function() {

	var dreemgl = null;		// reference to iframe with dreemgl application
	var activeExample = {href:'', props: ''};
	var updated = false;

	/**
	 * fullVisible=true only returns true if the all object rect is visible
	 */
	var isReallyVisible = function(el, fullVisible) {
		if ( el.tagName == "HTML" )
			return true;
		var parentRect=el.parentNode.getBoundingClientRect();
		var rect = arguments[2] || el.getBoundingClientRect();
		return (
			( fullVisible ? rect.top    >= parentRect.top    : rect.bottom > parentRect.top ) &&
			( fullVisible ? rect.left   >= parentRect.left   : rect.right  > parentRect.left ) &&
			( fullVisible ? rect.bottom <= parentRect.bottom : rect.top    < parentRect.bottom ) &&
			( fullVisible ? rect.right  <= parentRect.right  : rect.left   < parentRect.right ) &&
			isReallyVisible(el.parentNode, fullVisible, rect)
		);
	};

	var findVisibleExample = function() {
		if (document.docrunner.define) {
			dreemgl = document.docrunner.define.rootComposition
		} else {
			console.log("docexamplerunner composition not initialized, cancelling");
		}
		var visibleLinks = jQuery('a:visible');
		var links = [];
		for (var i=0; i<visibleLinks.length; i++) {
			var link = visibleLinks[i];
			if (isReallyVisible(link) && link.href.search('/examples/') != -1) {
				links.push(link);
			}
		}

		// TODO: Add support for multiple example links within the visible area
		if (links[0]) {
			if (activeExample.href != links[0].attributes['href'].value) {
				activeExample.href = links[0].attributes['href'].value;
				console.error(links[0].attributes['data-example'].value);
				activeExample.props = links[0].attributes['data-example'].value;
				updated = false;
			}
			// If DreemGL composition has been loaded, send the activeExample object into
			// composition. See /docs/examples/docexamplerunner.js composition
			if (typeof dreemgl !== 'undefined' && updated === false) {
				dreemgl.rpc.exampleservice.loadExample(JSON.stringify(activeExample));
				updated = true;
			}
		}
	}

	var initialize = function () {
		setInterval(findVisibleExample, 500);
	}
	jQuery(initialize);

})();
