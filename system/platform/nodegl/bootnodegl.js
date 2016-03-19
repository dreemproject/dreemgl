/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, exports){
	
	

	this.atConstructor = function(args){
		// allright lets fire up 
		define.$platform = 'nodegl'

		var Image = require('node-webgl/lib/image') 

		define.loadImage = function(name){
			var img = new Image()
			img.src = name
			return img
		}

		console.log(args['-nodegl'])
		console.log('Downloading nodegl')
		// lets make the math library requireable
		
		require.async(args['-nodegl']).then(function(composition){	
			console.log('Booting nodegl')
			this.comp = new composition(undefined, undefined, args['-nodegl'])
			
		}).catch(function(error){
			console.log(error.stack)
		})
	}

})