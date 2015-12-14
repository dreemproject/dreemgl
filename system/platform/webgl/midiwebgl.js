/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$system/base/midi', function (require, exports){

	this.Input = define.class(function midiInput($system$base$node){
		
		this.atMidiData = function(data){
			var ch = data[0]&16
			var hi = data[0]>>4
			if(hi === 0b1000) return this.off = this.msg = {ch:ch, type:'off', key:data[1], value:data[2]}
			if(hi === 0b1001)return this.on = this.msg = {ch:ch, type:'on', key:data[1], value:data[2]}
			if(hi === 0b1010)return this.poly = this.msg = {ch:ch, type:'poly', key:data[1], value:data[2]}
			if(hi === 0b1011)return this.cc = this.msg = {ch:ch, type:'cc', ctrl:data[1], value:data[2]}
			if(hi === 0b1101)return this.single = this.msg = {ch:ch, type:'single', value:data[1]}
			if(hi === 0b1110) return this.bend = this.msg = {ch:ch, type:'bend', value:(data[2]<<7) + data[1]}
		}
		this.attributes = {
			msg:Event,
			off:Event,
			on:Event,
			poly:Event,
			cc:Event,
			single:Event,
			bend:Event
		}
	})

	this.Output = define.class(function midiOutput($system$base$node){
		this.atConstructor = function(send){
			this.send = send
		}

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
			var m = event.value
			var ch = m.ch || 0
			if(m.type === 'off')return this.send([0b1001<<4|ch, m.key, m.value])
			if(m.type === 'on')return this.send([0b1001<<4|ch, m.key, m.value])
			if(m.type === 'poly')return this.send([0b1010<<4|ch, m.key, m.value])
			if(m.type === 'cc')return this.send([0b1011<<4|ch, m.ctrl, m.value])
			if(m.type === 'single')return this.send([0b1101<<4|ch, m.value])
			if(m.type === 'bend')return this.send([0b1110<<4|ch, m.value&127, m.value>>7])
		}

		this.alloff = function(ch){
			if(!ch) ch = 0
			this.send([0b1011<<4|ch, 121, 0])
			this.send([0b1011<<4|ch, 120, 0])
		}

		this.on = function(event){
			var ev = event.value
			ev.type = 'on'
			this.msg = ev
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
