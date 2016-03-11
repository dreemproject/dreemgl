/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $ui$, view, label, bargraphic){
	// Simple video player, without controls. Frames from a html5 video are
	// copied into a canvas element. Each image is written to the view's texture.
	// The view needs to use the hardimage shader, so the view is initialized
	// with an empty texture. The video and canvas resources are allocated when
	// the video plays, and released when the video is finished.

	var Shader = require('$system/platform/$platform/shader$platform')
  var emptytexture = Shader.Texture.fromArray(new Uint8Array(4, 1), 1, 1);


	this.attributes = {
		// The URL to an video file to play
		url: Config({type:string, value:''})

		// When true (default), start the video track automatically.
		,autoplay: Config({type:bool, value:true})

		// Video volume (0-1)
		,volume: Config({type:float, value:0.5})

		// Event generated when screen updates
		,update: Config({type:Event}),
	}

	// True if the video is playing
	this.playing = false;

	// True if the video is paused
	this.paused = false;

	// Length of video (seconds)
	this.duration = -1;

	// Dimensions of video vec2;
	this.dimensions = vec2(0,0);

	// Current location (time) of playback
	this.currenttime = -1;

	// We want to use the hardimage shader, so specifying a bgimage is needed.
	// In our case, we specify a texture instead of an image.
	this.bgimage = emptytexture;

	// Play the video
	this.play = function() {
		if (!this.url)
			return;
		
		this.videoinit();

		// play the video
    this.videoElement.setAttribute('src', this.url)
		this.videoElement.load();
		
		this.videoElement.currentTime = 0;
		this.currenttime = 0;
		this.videoElement.play();
		this.playing = true;

		// Updating in the animation loop is better than waiting for
		// the infrequent ontimeupdate events.
		this.animFrame = function(time){
			this.updatevideo();
			if (this.playing)
				window.requestAnimationFrame(this.animFrame)
		}.bind(this);
		
		window.requestAnimationFrame(this.animFrame)
	}

	// Pause or restart the video
	this.pause = function() {
		if (this.playing) {
			if (this.paused) {
				this.paused = false;
				this.videoElement.play();
			}
			else {
				this.paused = true;
				this.videoElement.pause();
			}
		}
	}

	// Stop the video
	this.stop = function() {
		if (this.videoElement) {
			this.videoElement.pause();
			this.videoElement.currentTime = 0;
			this.currenttime = -1;
		}

		this.playing = false;

		this.videocleanup ();
	}

	// Update the texture with a current screenshot from the video.
	this.updatevideo = function() {
		if (!this.videoElement)
			return;
		
		this.currenttime = this.videoElement.currentTime;
		t0 = new Date();

		// Create the canvas once the video frame size is known
		if (this.dimensions.x === 0)
			return;
		
		if (!this.canvas) {
			this.canvas = document.createElement('canvas');
			this.canvas.width = this.dimensions.x;
			this.canvas.height = this.dimensions.y;
			this.canvasContext = this.canvas.getContext('2d');
		}

		// Draw the current video frame to the canvas
		this.canvasContext.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);

		// Retrieve the canvas image as a rgba buffer
		var pels = this.canvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height);

		// Save to a texture and use as the background image
		var texture = Shader.Texture.fromArray(pels.data, this.canvas.width, this.canvas.height);
		this.setBgImage(texture);

		pels = null;
		texture = null;

		t1 = new Date();
		//console.log('update elapsed', (t1-t0));

		this.emit('update')
	}


	// Initialize the VideoContext
	this.videoinit = function() {
    if (!this.videoElement) {
      this.videoElement = document.createElement('video')
      this.videoElement.setAttribute('volume', this.volume);
      this.videoElement.setAttribute('width', this.width);
      this.videoElement.setAttribute('height', this.height);

			// Try and prevent CORS issues when loading from another domain
      this.videoElement.setAttribute('crossorigin', 'anonymous');

			if (this.autoplay)
				this.videoElement.setAttribute('autoplay', true);

			// On chrome, preload loads a lot of content, increasing memory usage.
			this.videoElement.setAttribute('preload', 'none');
			
      this.videoElement.ondurationchange = function(data) {
				if (!this.videoElement)
					return;
				
        //console.log('ondurationchange', this.videoElement.duration)
				this.dimensions = vec2(this.videoElement.videoWidth, this.videoElement.videoHeight);
				this.duration = this.videoElement.duration;
      }.bind(this);

			// This event does not fire often enough. Use animation frame instead.
      //this.videoElement.ontimeupdate = function(evt) {
			//	if (!this.videoElement)
			//		return;
			//
			//	console.log('ontimeupdate', this.videoElement.currentTime);
			//	this.updatevideo();
			//}.bind(this);

			// When the video is done, stop the playback and delete the canvas and
			// video element.
      this.videoElement.onended = function(evt) {
				this.stop();
				//console.log('onended', evt);
			}.bind(this);

    }
	}
	
	// Cleanup the VideoContext and canvas
	this.videocleanup = function() {
		if (this.canvas) {
			this.canvasContext = null;
			this.canvas = null;
		}
		
    if (this.videoElement) {
			this.videoElement.setAttribute('src', '');
			this.videoElement = null;
		}

		this.currenttime = -1;
	}



	this.oninit = function(){
		// console.log('oninit');
		if (this.autoplay)
			this.play();
	}


	this.render = function(){
		return [
		]
	}
										
})
