/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $ui$, dataset){
	// Sourceset is a dataset-api on source
	var jsparser = 

	this.atConstructor = function(){
		dataset.prototype.atConstructor.call(this)
	}
	
	// convert a string in to a meaningful javascript object for this dataset. The default is JSON, but you could use this function to accept any format of choice. 
	this.parse = function(source){
		// lets create an AST
		
	}
	
	// convert an object in to a string. Defaults to standard JSON, but you could overload this function to provide a more efficient fileformat. Do not forget to convert the JSONParse function as well.
	this.stringify = function(data /*Object*/) /*String*/ {
		
	}
})