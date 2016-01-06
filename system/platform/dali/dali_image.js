/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


/**
 * @class DaliImage
 * DaliImage represents a image loaded in dali, like how window.Image represents
 * an image loaded in the browser.
 *
 * Dali handles image loading inside the api, so this encapsulates the image
 * string.
 */

function DaliImage(path) 
{
console.trace('DALIIMAGE CTOR', path);
	this.path = path;
}


//define.class(function(require, exports){
//
//	/**
//	 * @method constructor
//	 * Create a DaliImage object by specifying the image path (optional)
//	 * @param {string} path Path to the image
//	 */
//	this.atConstructor = function(path) {
//		this.path = path;
//	}
//
//});

