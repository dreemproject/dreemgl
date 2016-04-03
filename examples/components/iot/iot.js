/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/service", function() {

	this.attributes = {
		things: Config({type: Array, value: {}, flow: 'out'})
	}

	var updateState = function(thing) {
    var id = thing.thing_id();
    var meta = thing.state("meta");

    // copy over fields
    var index = meta['iot:thing-number'] - 1;
		this.things[index] = {
			state: thing.state("istate"),
    	id: meta['iot:thing-id'],
    	name: meta['schema:name'],
    	reachable: meta['iot:reachable']
		};

		// shouldn't this be enough to update the attribute in the browser over RPC?
		this.things = this.things;
    // console.log("updated state\n", this.things);
	}.bind(this);

	this.oninit = function() {
		var iotdb = require("iotdb");

		var things = iotdb.connect('HueLight', {poll: 1});
		// console.log(things);

		// listen for new things
		things.on("thing", function(thing) {
			updateState(thing);
			// register for changes to each thing
			thing.on("istate", function(thing_inner) {
				updateState(thing_inner);
			});
		});
	}
});
