/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


/**
 * @class DaliApi
 * Top-level, static, class to manage the dali stage.
 */

define.class(function(exports){
	var DaliApi = exports

	/**
	 * @property dali
	 * static dali object to access dali api.
	 */
	DaliApi.dali_obj = undefined;
	Object.defineProperty(DaliApi, 'dali', {
		get: function() {
			if (!this.value) {
				console.log('DaliApi: Dali has not been initialized');
			}
			return this.value;
		}
		,set: function(v) {
			if (this.value) {
				console.log('DaliApi: Dali has already been initialized');
			}
			this.value = v;
		}
	});


	/**
	 * @method initialize
	 * Static method to initialize and create the dali stage
	 * @param {number} width Width of stage
	 * @param {number} height Height of stage
	 * @param {string} name Name of stage
	 */
	DaliApi.initialize = function(width, height, name) {
		this.window= {
			x:0,
			y:0,
			width:width,
			height: height,
			transparent: false,
			name: name
		};

		this.viewMode={
			'stereoscopic-mode':'mono',
			'stereo-base': 65
		};

		this.options= {
			'window': this.window,
			'view-mode': this.viewMode,
		}

		// Dali/nodejs interface (nodejs package at top-level of dreemgl repository)
		//TODO Use a fixed location to locate dali code
		DaliApi.dali = define.require('/home/dali/teem/src/dreemgl/Release/dali')(this.options);
    }

});
