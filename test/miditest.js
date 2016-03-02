/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

//Pure JS based composition
define.class('$server/composition', function(require, $ui$, screen, view){

	var arpeggiator = define.class(function($ui$, view, label){

		var midiAttributes = require('$system/platform/$platform/midi$platform').midiAttributes

		this.fwd = true
		this.inid = 1
		this.outid = 0
		this.bpm = 120
		this.last_note = -1
		this.delta = 0
		this.shift = 0
		this.volume = 127;

		this.message = function(msg){
			if(this.fwd) this.out.message = msg
		}

		this.noteon = function(msg){
			this.start = Date.now()
			this.delta = msg.key - 60
			this.last_note = -1
		}

		this.controlchange = function(msg){
			this.slide = msg.value
		}

		this.pitchbend = function(msg){
			this.shift = (msg.value - 8129)/4096
		}

		this.aftertouch = function(msg){
			this.volume = msg.value
		}

		this.tick = function(){
			//console.log(1)
			// we compute the arp
			// then we pick which note to play
			this.arpdata.length = 0
			this.arp1(this.l, this.m, this.n, this.o, this.p)
			// ok lets compute the time
			var beats = ((Date.now() - this.start) / 1000 ) * (this.bpm / 60) + this.shift
			// ok now, lets index the arp for what we need
			var time = 0
			for(var i =0, j = 0, arp = this.arpdata; i < arp.length && j < 1000;){
				j++
				var tag = arp[i++]
				if(tag === null){
					// its a parallel key
				}
				else if(tag < 0){
					if(tag == -1){
						//todo we have to compute a time delta so our loop can terminate.
						i = 0
					}
				}
				else{
					time += tag
					var key = arp[i++]
					if(time > beats){
						if(i !== this.last_note){
							this.last_note = i
							this.out.noteon = {ch:0, key:key + this.delta, value:this.volume}
	 					}
 						break
					}
				}
			}
		}

		Object.defineProperty(this, 'loop', {
			get:function(){
				this.arpdata.push(-1, 0)
			},
			set:function(delta){
				this.arpdata.push(-2, delta)
			}
		})

		this.destroy = function(){
			if(this.inp) this.inp.close()
			if(this.out) this.out.close()
			if(this.timer) clearInterval(this.timer)
		}

		this.init = function(prev){
			if(prev){
				this.last_note = prev.last_note
				this.delta = prev.delta
				this.start = prev.start
			}
			this.arpdata = []
			var midi = this.screen.midi

			midi.getIO().then(function(result){
				console.log("Midi Inputs:")
				for(var i = 0; i < result.inputs.length; i++) console.log("\t"+i+": "+result.inputs[i])
				console.log("Midi Outputs:")
				for(var i = 0; i < result.outputs.length; i++) console.log("\t"+i+": "+result.outputs[i])
			})

			this.timer = setInterval(this.tick.bind(this), 5)

			midi.openInput(this.inid).then(function(inp){
				this.inp = inp
				// slap the midi event api onto us
				var obj = this
				for(var key in midiAttributes){
					inp[key] = (function(key){
						return function(event){
							console.log(event)

							if(obj[key]) obj[key](event.value)
						}
					})(key)
				}
			}.bind(this))

			midi.openOutput(this.outid).then(function(out){
				this.out = out
			//	out.alloff(0)
			}.bind(this))

			// lets construct l,m,n,o,p
			var base = {}
			var notes = ['c','cs','d','ds','e','f','fs','g','gs','a','as','b']

			function defNote(obj, string, note){
				var wrap = Object.create(defNote.prototype)
				wrap.note = note
				Object.defineProperty(obj, string, {get:function(){
					this.owner.arpdata.push(this.weight, note)
					return wrap
				}, set:function(value){
					if(value instanceof defNote){

					}
				}})
			}

			for(var oct = 0; oct < 11; oct++){
				for(var key = 0; key < 12; key++){
					var id = oct * 12 + key
					defNote(base, notes[key]+oct, id)
					defNote(base, id, id)
				}
			}
			this.l = Object.create(base), this.l.owner = this, this.l.weight = 4
			this.m = Object.create(base), this.m.owner = this, this.m.weight = 2
			this.n = Object.create(base), this.n.owner = this, this.n.weight = 1
			this.o = Object.create(base), this.o.owner = this, this.o.weight = 0.5
			this.p = Object.create(base), this.p.owner = this, this.p.weight = 0.25
		}
	})

	this.render = function(){ return [
		screen({clearcolor:vec4('black'), init:function(){
			console.log('here')
		}},
			arpeggiator({
				arp2:function(l, m, n, o, p){
					for(var i = 4; i < 7; i++){
						p['c'+i]
						//o[this.slide]
						//if(this.volume>60) o['e'+i]
						//else o['ds'+i]

						o['g'+i]
						o['b'+i]
					}
					this.loop
				},
				arp1:function(l, m, n, o, p){
					for(var i = 4; i < 7; i++){
						p['c'+i]
						p[this.slide]
						p['g'+i]
					}
					this.loop
				}

			})
		)
	]}
})
