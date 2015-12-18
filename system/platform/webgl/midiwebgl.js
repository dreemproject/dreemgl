/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$system/base/midi', function (require, exports){

	exports.midiAttributes = {
		message:Event,
		noteoff:Event,
		noteon:Event,
		polypressure:Event,
		controlchange:Event,
		programchange:Event,
		aftertouch:Event,
		pitchbend:Event
	}
	
	this.Input = define.class(function midiInput($system$base$node){
		
		this.atMidiData = function(data){
			var ch = data[0] & 16
			var hi = data[0] >> 4
			if(hi === 0x8) return this.noteoff = this.message = {ch:ch, type:'noteoff', key:data[1], value:data[2]}
			if(hi === 0x9) return this.noteon = this.message = {ch:ch, type:'noteon', key:data[1], value:data[2]}
			if(hi === 0xa) return this.polypressure = this.message = {ch:ch, type:'polypressure', key:data[1], value:data[2]}
			if(hi === 0xb) return this.controlchange = this.message = {ch:ch, type:'controlchange', ctrl:data[1], value:data[2]}
			if(hi === 0xc) return this.programchange = this.message = {ch:ch, type:'programchange', value:data[1]}
			if(hi === 0xd) return this.aftertouch = this.message = {ch:ch, type:'aftertouch', value:data[1]}
			if(hi === 0xe) return this.pitchbend = this.message = {ch:ch, type:'pitchbend', value:(data[2]<<7) + data[1]}
		}

		this.attributes = exports.midiAttributes
	})

	this.Output = define.class(function midiOutput($system$base$node){
		this.atConstructor = function(send){
			this.send = send
		}

		this.attributes = exports.midiAttributes

		this.alloff = function(ch){
			if(!ch) ch = 0
			this.send([0xb<<4|ch, 121, 0])
			this.send([0xb<<4|ch, 120, 0])
		}

		for(var key in exports.midiAttributes){
			this[key] = function(event){
				var ev = event.value
				ev.type = event.key
				this.message = ev
			}
		}

		this.message = function(event){
			var m = event.value
			var ch = m.ch || 0
			if(m.type === 'noteoff')return this.send([0x8<<4|ch, m.key, m.value])
			if(m.type === 'noteon')return this.send([0x9<<4|ch, m.key, m.value])
			if(m.type === 'polypressure')return this.send([0xa<<4|ch, m.key, m.value])
			if(m.type === 'controlchange')return this.send([0xb<<4|ch, m.ctrl, m.value])
			if(m.type === 'programchange')return this.send([0xc<<4|ch, m.value])
			if(m.type === 'aftertouch') return this.send([0xd<<4|ch, m.value])
			if(m.type === 'pitchbend')return this.send([0xe<<4|ch, m.value&127, m.value>>7])
		}		
	})

	function iterIO(slot, id, cb){
		return new Promise(function(resolve, reject){
			navigator.requestMIDIAccess().then(function(result){
				var i =0
				for(var item of result[slot]){
					if(typeof id === 'number' && id === i ||
					   typeof id === 'string' && item[1].name === id || 
					   typeof id === 'object' && id.match && item[1].name.match(id)){
						return resolve(cb(item[1]))
					}
					i++
				}
			})
		})
	}

	this.openInput = function(id){
		return iterIO('inputs', id, function(input){
			var inp = new this.Input()
			inp._midi_ = input
			inp.close = function(){
				this._midi_.close()
			}

			input.onmidimessage = function(message){
				inp.atMidiData(message.data)
			}
			return inp
		}.bind(this))
	}

	this.openOutput = function(id){
		return iterIO('outputs', id, function(output){
			var out = this.Output(function(buf){
				output.send(buf)
			})
			out._midi_ = output
			out.close = function(){
				this._midi_.close()
			}

			return out
		}.bind(this))
	}

	this.getIO = function(){
		return new Promise(function(resolve, reject){
			navigator.requestMIDIAccess().then(function(result){
				var res = {inputs:[], outputs:[]}
				for(var item of result.inputs) res.inputs.push(item[1].name)
				for(var item of result.outputs) res.outputs.push(item[1].name)
				resolve(res)
			})
		})
	}

	this.atConstructor = function(){
	}
})
