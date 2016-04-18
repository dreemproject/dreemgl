/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function() {
// internal, View that visualizes the output from Google Map's static map api

    this.attributes = {

      // Google Maps API key
      apikey:   "",

      // Location for center of map, can be anything Google Maps understands
      location: "Seocho-gu, Seoul, South Korea",

      // Image format (jpg, png, etc.)
      format:   "jpg",

      // Map type (of roadmap,satellite,terrain,hybrid)
      maptype:  "roadmap",

      // Map device scale //1, 2 (or 4)
      mapscale:2,

      // Map zoom level 0 ~ 21+ (0 is whole earth, 21 is street level)
      mapzoom:14,

	  // Google Static Map's endpoint
      endpoint: "http://maps.googleapis.com/maps/api/staticmap"
    };

	this.onendpoint = this.onlocation = this.onformat = this.onmaptype = this.onmapscale = this.onmapzoom = this.onendpoint = this.oninit = function () {
		var url = this.endpoint + '?key=' + this.apikey + '&center=' + encodeURIComponent(this.location) + '&maptype=' + this.maptype + '&scale=' + this.mapscale + '&zoom=' + this.mapzoom + '&size=' + this.width + 'x' + this.height + '&format=' + this.format
		this.bgimage = url;
	}


});


