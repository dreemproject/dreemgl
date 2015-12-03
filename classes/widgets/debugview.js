/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $containers$, view, $controls$){

	this.attributes = {
		// The code to display
		source: {type:String, value:""},
		// wrap the text
		wrap: {type:Boolean, value:false}
	}

	this.bgcolor = vec4(12/255,33/255,65/255,1)
	this.viewport = '2D'

	this.render = function(){ return [
		view({bgcolor:'red', position:'absolute', width:300, height:300})
	]}
})