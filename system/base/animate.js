/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, exports){

	// instance of checkable end object
	this.End = function(){
	}

	this.delay = 0
	this.interrupt = false
	this.repeat = 1
	this.bounce = false
	this.type = float32
	this.motion = ease.linear
	this.speed = 1
	this.interpolator = mix

	this.atConstructor = function(config, obj, key, track, first_value, last_value){
		this.config = config
		this.obj = obj
		this.key = key
		// the internal track construct
		if(track) this.track = track
		else this.track = config
		if(config.motion) this.motion = config.motion

		if(typeof this.motion === 'string') this.motion = ease[this.motion] || ease.linear
		if(!config) debugger
		if(config.type) this.type = config.type
		this.first_value = first_value
		this.last_value = last_value
	}
 	
	this.compute = function(local_time, time_skew){
		// lazily initialize order
		if(!this.order){
			this.order = [0]
			this.values = {}
			this.end_time = 0
			for(var key in this.track){
				var time = parseFloat(key)
				if(parseFloat(key) == time){
					var desc = {}
					var value = this.track[key]
					if(value === undefined) continue
					//check if we have a descriptor object in the key
					if(value && typeof value == 'object' && value.value !== undefined){
						desc.value = this.type(value.value)	// parse it
						if(value.motion) desc.motion = (typeof value.motion === 'string'? ease[value.motion]: value.motion) || this.motion
					}
					else{
						desc.value = this.type(value)
					}

					this.values[key] = desc
					this.order.push(key)
					if(time > this.end_time) this.end_time = time
				}
			}
			if(this.config.duration !== undefined){
				var duration = this.config.duration
				this.order.push(duration)
				this.values[duration] = {value:this.type(this.last_value)}
				if(duration > this.end_time) this.end_time = duration
			}
			this.order.sort()
		}
		// alright lets process the tracks.
		/*if(this.reset_time){
			this.last_time_stamp = time_stamp

			this.start_time_stamp = time_stamp - (time_skew || 0)
			// initialize slot 0
			if(this.values[0] === undefined){
				this.first_value = first_value !== undefined? first_value: (this.first_value || 0)
			}
			this.reset_time = false
		}
		if(this.pause_time !== undefined){
			// just skid the start_time for as long as it is stopped
			this.start_time_stamp = time_stamp - this.pause_time
			return this.value
		}
		//var local_time = (time_stamp - this.start_time_stamp )
		*/

		// alright now, we have to compute the right time.

		if(this.delay !== undefined){
			if(local_time - this.delay <= 0) local_time = 0
			else local_time -= this.delay
		}

		if(this.reverse_time !== undefined){
			// essentially we are going to count backwards starting this.reverse_time
			local_time = this.reverse_time - (local_time - this.reverse_time)
		}

		// norm time goes from 0 to 1 over the length of the track 
		var norm_time = (local_time / this.end_time) * this.speed
		// lets check the looping
		var end_gap = undefined

		if (this.bounce){
			if(norm_time >= this.repeat) end_gap = norm_time - this.repeat, norm_time = this.repeat
			norm_time = norm_time % 2
			if(norm_time > 1) norm_time = 2 - norm_time
		}
		else if (this.repeat){
			if(norm_time >= this.repeat) end_gap = norm_time - this.repeat, norm_time = this.repeat - 0.000001
			norm_time = norm_time % 1
		}

		if(norm_time < 0){
			end_gap = -norm_time
		}

		if(end_gap !== undefined){ // alright we are stopping
			var end = new this.End()
			// fetch the last key of our track and pass it in as the new first for the next one 

			end.last_value = norm_time >= 0.99? this.values[this.order[this.order.length - 1]].value: this.values[this.order[0]].value
			end.skew = end_gap * this.end_time
			return end
		}

		if(norm_time > 1) norm_time = 1
		if(norm_time < 0) norm_time = 0
		var motion_time = this.motion(norm_time)
		if(motion_time < 0.001 ) motion_time = 0
		if(motion_time > 0.999 ) motion_time = 1
		// lets convert it back to keyspace time
		var track_time = motion_time * this.end_time
		// the key pair to interpolate between
		var key1, key2
		// find the right keys
		if(!this.clamped && (track_time <= this.order[0] || track_time >= this.order[this.order.length-1])){
			if(track_time <= this.order[0]){
				key1 = this.order[0]
				key2 = this.order[1]
			}
			else{
				key1 = this.order[this.order.length - 2] || 0
				key2 = this.order[this.order.length - 1]
			}
		}
		else{ // scan for it
			for(var i = 0, len = this.order.length; i<len; i++){
				var key = this.order[i]
				if(track_time <= key){
					key1 = this.order[i-1] || 0
					key2 = key
					break
				}
			}
		}
		// if has atleast 1 key, do something
		if(key1 !== undefined){
			// only key1, the check is to deal with the 'computed' 0 key
			if(key2 === undefined) return key1 in this.values? this.values[key1].value: this.first_value
			else{ // interpolate
				var inter_key_time
				if(Math.abs(key2 - key1) <0.0001) inter_key_time = 0
				else inter_key_time = (track_time - key1) / (key2 - key1)

				var value1 = key1 in this.values? this.values[key1]: {value:this.first_value}
				var value2 = this.values[key2]
								
				if(value2.motion) inter_key_time = value2.motion(inter_key_time)
				var out = mix(value1.value, value2.value, inter_key_time)
				return out
			}
		}
	}
	/*
	// stops an animation, untill resumed
	this.pause = function(){
		this.pause_time = this.last_time_stamp - this.start_time_stamp
	}

	// resume a paused track
	this.resume = function(){
		this.pause_time = undefined
	}

	// this reverses the playback. it will just play the current trackbackwards starting now
	this.reverse = function(){
		// alright if we have reverse time, calculate the right start_time_stamp
		if(this.reverse_time !== undefined){
			// calculate the current time
			this.start_time_stamp = 2*(this.last_time_stamp - this.reverse_time) - this.start_time_stamp
			//this.start_time_stamp = this.last_time_stamp-this.reverse_time
			this.reverse_time = undefined
		}
		else{
			this.reverse_time = this.last_time_stamp - this.start_time_stamp
		}
	}*/
})