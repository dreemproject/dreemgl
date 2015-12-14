//Pure JS based composition
define.class(function($server$, composition, role, $ui$, screen, view){

	var arpeggiator = define.class(function($ui$, view, label){

		this.fwd = true
		this.inid = 4
		this.outid = 0
		this.bpm = 120
		this.last_note = -1
		this.delta = 0
		this.shift = 0

		this.attributes = {
			msg:Event,
			off:Event,
			on:Event,
			poly:Event,
			cc:Event,
			single:Event,
			bend:Event
		}

		this.msg = function(event){
			if(this.fwd) this.out.msg = event.value
		}

		this.on = function(event){
			var msg = event.value
			this.start = Date.now()
			this.delta = msg.key - 60
			this.last_note = -1
		}

		this.bend = function(event){
			var msg = event.value
			this.shift = (msg.value-8129)/4096
		}

		this.single = function(event){
			this.volume = event.value.value
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
						i = 0
					}
				}
				else{
					time += tag
					var key = arp[i++]
					if(time > beats){
						if(i !== this.last_note){
							this.last_note = i
	 						this.out.on = {ch:0, key:key + this.delta, value:this.volume}
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
			this.arpdata = []
			var midi = this.screen.midi

			midi.getIO().then(function(result){
				console.log("Midi Inputs:")
				for(var i = 0; i < result.inputs.length; i ++) console.log("\t"+i+": "+result.inputs[i])
				console.log("Midi Outputs:")
				for(var i = 0; i < result.outputs.length; i ++) console.log("\t"+i+": "+result.outputs[i])
			})

			this.timer = setInterval(this.tick.bind(this),5)

			midi.openInput(this.inid).then(function(inp){
				this.inp = inp
				inp.msg = this.emitForward('msg')
				inp.off = this.emitForward('off')
				inp.on = this.emitForward('on')
				inp.poly = this.emitForward('poly')
				inp.cc = this.emitForward('cc')
				inp.single = this.emitForward('single')
				inp.bend = this.emitForward('bend')
			}.bind(this))

			midi.openOutput(this.outid).then(function(out){
				this.out = out
				out.alloff(0)
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
		role(
			screen({clearcolor:vec4('black')},
				arpeggiator({
					arp1:function(l, m, n, o, p){
						p.c5
						p.c6
						n.c7
						this.loop
					}
				})
			)
		)
	]}
})