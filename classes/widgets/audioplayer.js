/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/


define.class(function($ui$, view, label, bargraphic){
// Simple audio player, without controls. While the audio plays, a visual
// representation of the audio can be displayed in the view

	this.attributes = {
		// The URL to an audio file to play
		url: Config({type:string, value:''})

		// Audio volume (0-1)
		,volume: Config({type:float, value:0.5})

		// Number of fft frames to use. Non-zero power of two from 32 to 2048
		,fftsize: Config({type:int, value:512})

		// Amount of smoothing to apply to the fft analysis (0-1)
		,fftsmoothing: Config({type:float, value:0.8})
	}

	// True if the audio is playing
	this.playing = false;

	// Length of audio (seconds)
	this.duration = -1;

	// Current location (time) of playback
	this.currenttime = -1;

	// Current data to visualize
	this.fftData = new Uint8Array((this.fftsize > 0) ? this.fftsize/2 : 2);
	this.fftData = function() {
		//console.log('***** fftData is updated');
	}

	// Play the audio
	this.play = function() {
		if (!this.url)
			return;
		
		this.audioinit();

		// play the music
    this.audioElement.setAttribute('src', this.url)
		
		if (this.audioElement) {
			this.audioElement.currentTime = 0;
			this.currenttime = 0;
			this.audioElement.play();
			this.playing = true;

			// The ontimeupdate event happens pretty slowly. Update more frequently
			// using a timer.
			this.timer = setInterval(function() {
				this.updateviz();
			}.bind(this), 100);
			

			//console.log('play', this.audioElement);
		}
	}

	// Stop the audio
	this.stop = function() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = undefined;
		}

		var viz = this.screen.find('viz');
		if (viz)
			viz.clear();

		if (this.audioElement) {
			this.audioElement.pause();
			this.audioElement.currentTime = 0;
			this.currenttime = -1;
		}

		this.playing = false;

		this.audiocleanup ();
	}

	// Update the current visualization
	this.updateviz = function() {
		this.currenttime = this.audioElement.currentTime;
		this.fftNode.getByteFrequencyData(this.fftData);

		var viz = this.screen.find('viz');
		if (viz) {
			//viz.data = this.fftData;
			var data = [];
			for (var i=0; i<this.fftData.length; i++) {
				data.push(this.fftData[i]/255.0);
			}
			
			viz.data = data;
			//console.log('data set', viz);
		}
	}


	// Initialize the AudioContext
	this.audioinit = function() {
		if (!this.context) {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			this.context = new AudioContext();
		}

    if (!this.audioElement) {
      this.audioElement = document.createElement('audio')
      this.audioElement.setAttribute('volume', this.volume);
      this.audioElement.ondurationchange = function(data) {
        console.log('ondurationchange', this.audioElement.duration)
				this.duration = this.audioElement.duration;
      }.bind(this);
      this.audioElement.onprogress = function(evt) {
				//console.log('onprogress', evt);
      }.bind(this);

			// This event does not fire often enough
      //this.audioElement.ontimeupdate = function(evt) {
			//	this.updateviz();
			//}.bind(this);

      this.audioElement.onended = function(evt) {
				this.stop();
				console.log('onended', evt);
			}.bind(this);
			
			// Create fft
			//console.log('create fft', this.fftsize, this.fftsmoothing);
			this.fftNode = this.context.createAnalyser();
			if (this.fftsize) {
				this.fftNode.fftSize = this.fftsize;
				this.fftNode.smoothingTimeConstant = this.fftsmoothing;
			}

			// Connect the audio to the analyzer, and to the output
			this.source = this.context.createMediaElementSource(this.audioElement);
			this.source.connect(this.fftNode);
			this.fftNode.connect(this.context.destination);
			this.fftData = new Uint8Array(this.fftNode.frequencyBinCount);
    }
	}
	
	// Cleanup the AudioContext
	this.audiocleanup = function() {
    if (this.audioElement) {
			this.source = null;
			this.fftNode = null;
			this.audioElement = null;
		}

		if (this.context) {
			this.context = null;
		}

		this.currenttime = -1;
	}

	this.oninit = function(){
		console.log('oninit');
		this.play();
	}


	this.render = function(){
		return [
			bargraphic({name: 'viz', width: this.width, height: this.height, fgcolor: this.fgcolor, data: this.fftData}
								)]
	}
										
})
