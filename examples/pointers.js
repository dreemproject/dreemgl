/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function($ui$, screen) {

	define.class(this, "demo", '$ui/view', function ($ui$, view, label){

			this.flex = 1
			this.bgcolor = 'gray'
			this.margin = 50

			this.attributes = {
				start: null,
				move: null,
				end: null,
				tap: null,
				hover: null,
				over: null,
				out: null,
				wheel: null
			}

			this.oninit = function () {
				this.pointerstart = function(event) {
					this.start = event
				}.bind(this)

				this.pointermove = function(event) {
					this.move = event
				}.bind(this)

				this.pointerend = function(event) {
					this.end = event
				}.bind(this)

				this.pointertap = function(event) {
					this.tap = event
				}.bind(this)

				this.pointerhover = function(event) {
					this.hover = event
				}.bind(this)

				this.pointerover = function(event) {
					this.over = event
				}.bind(this)

				this.pointerout = function(event) {
					this.out = event
				}.bind(this)

				this.pointerwheel = function(event) {
					this.wheel = event
				}.bind(this)
			}

			this.renderLabels = function (type, color) {
				var markers = []
				this[type]
				if (this[type]) {
					var pos = this.globalToLocal(this[type].position)
					markers.push(label({
						text: this[type].id,
						icon: 'play',
						position: 'absolute',
						bgcolor: 'transparent',
						left: pos[0],
						top: pos[1],
						fgcolor: color,
						bordercolor: color,
						borderradius: 0,
						borderwidth: vec4(1,0,1,0),
						padding: vec4(10,0,0,0)
					}, label({
						text: type,
						fgcolor: color,
						bgcolor: 'transparent',
						fontsize: 12,
						position: 'relative',
						top: -22,
						left: -12
					})))
				}
				return markers
			}

			this.render = function() {
				return [
					this.renderLabels('start', 'red'),
					this.renderLabels('move', 'green'),
					this.renderLabels('end', 'blue'),
					this.renderLabels('tap', 'cyan'),
					this.renderLabels('hover', 'white'),
					this.renderLabels('over', 'yellow'),
					this.renderLabels('out', 'brown'),
					this.renderLabels('wheel', 'black')
				]
			}

	})

	this.render = function() {
		return [
			screen({name:'index'},
				this.demo({})
			)
		];
	};

});
