/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function($ui$, screen, view) {

	define.class(this, "demo", '$ui/view', function ($ui$, view, label){

		this.attributes = {
			start: null,
			move: null,
			end: null,
			tap: null,
			hover: null,
			over: null,
			out: null,
			wheel: null,
			// multitouch move
			pointermultimove: null,
			// keyboard events
			down: null,
			// up property is reserved for up vector
			up_: null,
			press: null,
			paste: null
		}

		this.oninit = function () {
			this.pointerstart = function(event) { this.start = event }.bind(this)
			this.pointermove = function(event) { this.move = event }.bind(this)
			this.pointerend = function(event) { this.end = event }.bind(this)
			this.pointertap = function(event) { this.tap = event }.bind(this)
			this.pointerhover = function(event) { this.hover = event }.bind(this)
			this.pointerwheel = function(event) { this.wheel = event }.bind(this)
			this.pointermultimove = function(event) { this.multimove = event }.bind(this)
			this.keydown = function(event) { this.down = event }.bind(this)
			this.keyup = function(event) { this.up_ = event }.bind(this)
			this.keypress = function(event) { this.press = event }.bind(this)
			this.keypaste = function(event) { this.paste = event }.bind(this)
		}

		define.class(this, "pointerdetailview", view, function(){
			this.bgcolor = NaN
			this.attributes = {
				eventdata: Config({type: Object, value: null}),
				type: Config({type: String, value: ''})
			}
			this.render = function () {
				if (!this.eventdata) return []

				var text = this.type + ':'
				var pos = '[' + this.eventdata.position[0] + ',' + this.eventdata.position[1] + ']'
				var delta = '[' + this.eventdata.delta[0] + ',' + this.eventdata.delta[1] + ']'
				var movement = '[' + this.eventdata.movement[0] + ',' + this.eventdata.movement[1] + ']'
				var min = '[' + this.eventdata.min[0] + ',' + this.eventdata.min[1] + ']'
				var max = '[' + this.eventdata.max[0] + ',' + this.eventdata.max[1] + ']'

				switch (this.type) {
					case 'start':
					case 'end':
						text += ' position:' + pos
						text += ' button:' + this.eventdata.button
						break
					case 'move':
						text += ' position:' + pos
						text += ' delta:' + delta
						text += ' movement:' + movement
						text += ' min:' + min
						text += ' max:' + max
						break
					case 'hover':
						text += ' position:' + pos
						break
					case 'tap':
						text += ' position:' + pos
						text += ' clicker:' + this.eventdata.clicker
						break
					case 'wheel':
						text += ' position:' + pos
						text += ' wheel:' + '[' + this.eventdata.wheel[0] + ',' + this.eventdata.wheel[1] + ']'
						break
				}

				if (this.eventdata.touch) text += ' touch:true'
				if (this.eventdata.shift) text += ' shift:true'
				if (this.eventdata.ctrl) text += ' ctrl:true'
				if (this.eventdata.alt) text += ' alt:true'

				return label({
					text: text,
					bgcolor: 'transparent',
					fontsize: 24,
					drawtarget: 'color'
				})
			}
		})

		define.class(this, "keydetailview", view, function(){
			this.bgcolor = NaN
			this.attributes = {
				eventdata: Config({type: Object, value: null}),
				type: Config({type: String, value: ''})
			}
			this.render = function () {
				if (!this.eventdata) return []

				var text = this.type + ':'

				if (this.eventdata.value) text += ' value:' + this.eventdata.value
				if (this.eventdata.code) text += ' code:' + this.eventdata.code
				if (this.eventdata.meta) text += ' meta:' + this.eventdata.meta
				if (this.eventdata.shift) text += ' shift:true'
				if (this.eventdata.ctrl) text += ' ctrl:true'
				if (this.eventdata.alt) text += ' alt:true'

				return label({
					text: text,
					bgcolor: 'transparent',
					fontsize: 24,
					drawtarget: 'color'
				})
			}
		})

		define.class(this, "multimoveview", view, function(){
			this.attributes = {
				eventdata: Config({type: Object, value: null})
			}
			this.render = function () {
				if (!this.eventdata) return []
				var markers = []
				for(var i = 0; i < this.eventdata.length; i++) {
					var pos = this.globalToLocal(this.eventdata[i].position)
					markers.push(view({
						bgcolor: 'white',
						width: 30,
						height: 30,
						position: 'absolute',
						top: pos[1] - 15,
						left: pos[0] - 15,
						drawtarget: 'color',
						borderradius: 15,
					}))
				}
				return markers
			}
		})

		this.render = function() {
			return [
				this.multimoveview({eventdata: this.multimove}),
				this.pointerdetailview({eventdata: this.start, type: 'start'}),
				this.pointerdetailview({eventdata: this.move, type: 'move'}),
				this.pointerdetailview({eventdata: this.end, type: 'end'}),
				this.pointerdetailview({eventdata: this.tap, type: 'tap'}),
				this.pointerdetailview({eventdata: this.hover, type: 'hover'}),
				this.pointerdetailview({eventdata: this.wheel, type: 'wheel'}),
				this.keydetailview({eventdata: this.down, type: 'down'}),
				this.keydetailview({eventdata: this.up_, type: 'up'}),
				this.keydetailview({eventdata: this.press, type: 'press'}),
				this.keydetailview({eventdata: this.paste, type: 'paste'})
			]
		}

	})

	this.render = function() {
		return screen({name: 'default'}, [
			this.demo({
				flex: 1,
				flexdirection: 'column',
				bgcolor: vec4(0.2, 0.2, 0.2, 1),
				margin: 50
			})
		])
	}

});
