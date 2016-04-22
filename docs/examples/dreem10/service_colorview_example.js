/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

// service example with embedded classes for service and view
define.class("$server/composition",
	function ($server$, service, $ui$, screen, view) {
// internal

		// Embedded service class which sends a random set of pos/size values
		// to the client.
		define.class(this, "boxrandomizer", "$server/service", function(){

			this.attributes = {
				viewprops1: Config({ type:Array, value: [] }),
				viewprops2: Config({ type:Array, value: [] }),
				colors: Config({type: Array,
					value: ['uclagold', 'utahcrimson', 'richelectricblue', 'willpowerorange', 'upsdellred', 'yelloworange', 'seagreen']}),
				color1: Config({ type:String, value:'black' }),
				color2: Config({ type:String, value:'black' })
			}
			this.randinterval = null;

			// Set up the interval for calling randomizeBoxDims
			this.oninit = function(){
				this.randinterval = this.setInterval(this.randomizeViewProps, 2500);
			}

			// Gen
			this.randomizeViewProps = function() {
				var rand = this.randomInt;
				this.viewprops1 = [rand(1, 100), rand(1, 100), rand(100, 200), rand(100, 200)];
				this.viewprops2 = [rand(1, 100), rand(1, 100), rand(100, 200), rand(100, 200)];
				this.color1 = this.colors[rand(1, this.colors.length-1)]
				this.color2 = this.colors[rand(1, this.colors.length-1)]
			}

			this.randomInt = function(min, max) {
				if (max == null) {
					max = min;
					min = 0;
				}
				return min + Math.floor(Math.random() * (max - min + 1));
			};

		});

		// View class which will receive the props from boxrandomizer service
		define.class(this, "colorview", view, function() {

			this.borderradius = vec4(10);

			this.attributes = {
				dimensions: Config({value: vec4(0), type:vec4}),
				newx: Config({type:int, value:0}),
				newy: Config({type:int, value:0}),
				neww: Config({type:int, value:0}),
				newh: Config({type:int, value:0})
			};

			this.onnewx = function() {
				this.x = this.newx
			}
			this.onnewy = function() {
				this.y = this.newy
			}
			this.onneww = function() {
				this.w = this.neww
			}
			this.onnewh = function() {
				this.h = this.newh
			}

			this.ondimensions = function() {
				var dims = this.dimensions;
				this.newx = Config({value:dims[0], motion:"inoutquad", duration:.75})
				this.newy = Config({value:dims[1], motion:"inoutquad", duration:.95})
				this.neww = Config({value:dims[2], motion:"inoutquad", duration:1.1})
				this.newh = Config({value:dims[3], motion:"inoutquad", duration:.8})
			}

		})

		this.render = function() {
			var s = screen();
			return[
				this.boxrandomizer({name:'boxrandom'}),
				screen(
					{name:'default',clearcolor: 'onyx'},
					this.colorview({
						name: 'v1',
						position: 'absolute',
						dimensions: wire("this.rpc.boxrandom.viewprops1"),
						bgcolor: wire("this.rpc.boxrandom.color1"),
						opacity: 0.6
					}),
					this.colorview({
						name: 'v2',
						position: 'absolute',
						dimensions: wire("this.rpc.boxrandom.viewprops2"),
						bgcolor: wire("this.rpc.boxrandom.color2"),
						opacity: 0.4
					})

				)
			];
		};
	}
);
