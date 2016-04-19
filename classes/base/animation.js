/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, exports){

	// track is {1:value, 2:value} time:value track
	// can also contain any of the setting variables
	this.track = undefined
	// the first value
	this.first_value = undefined	
	// time skew to start in seconds
	this.delay = 0
	// how many times to repeat
	this.repeat = 1
	// use bounce looping when repeating
	this.bounce = false
	// the type of the value
	this.type = float32
	// motion mapping of the whole animation
	this.motion = float.ease.linear
	// speed multiplier of the whole animation
	this.speed = 1
	// the interpolator
	this.interpolator = mix

	this.compute = function(local_time, time_skew){
		// lazily initialize order of the track keys
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
						if(value.motion) desc.motion = (typeof value.motion === 'string'? float.ease[value.motion]: value.motion) || this.motion
					}
					else{
						desc.value = this.type(value)
					}

					this.values[key] = desc
					this.order.push(key)
					if(time > this.end_time) this.end_time = time
				}
			}
			this.order.sort()
		}

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

	// internal, instance of checkable end object
	this.End = function(){
	}	
})