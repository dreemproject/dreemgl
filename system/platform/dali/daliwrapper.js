/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

// dali wrapper file, adapted from dali example applications.
// (For example: dali-nodejs/dali-toolkit/node-addon/line-mesh.js).

define.class(function(require, exports, self){

	// Initialize and show the dali screen
	this.atConstructor = function(width, height, name) {
		width = width || 1920
		height = height || 1080
		name = name || 'dreemgl'

		this.dali_initialize(width, height, name);
	};

	// Initialize dali/nodejs and display the screen
	this.dali_initialize = function(width, height, name) {
		if (this.dali) {
			console.warn('warning: dali_wrapper already initialized');
			return;
		}

		this.window= {
			x:0,
			y:0,
			width:width,
			height: height,
			transparent: false,
			name: name
		};

		this.viewMode={
			'stereoscopic-mode':'mono', // stereo-horizontal, stereo-vertical, stereo-interlaced,
			'stereo-base': 65 // Distance in millimeters between left/right cameras typically between (50-70mm)
		};

		this.options= {
			'window': this.window,
			'view-mode': this.viewMode,
		}

		// Dali/nodejs interface (nodejs package at top-level of dreemgl repository)
		//TODO Use a fixed location to locate dali code

		this.dali = define.require('./Release/dali')(this.options);

	    // Application
	    this.daliApp = {};
    }

    // Application
    this.daliApp = {};

    // Pass the dali object to createMeshActor
    this.daliApp.createMeshActor = function(dali, daliapp) {
      daliapp.actors(dali);
    };


});
