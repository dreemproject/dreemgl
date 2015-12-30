/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class('$system/base/node', function(){
	this.atConstructor = function(){}
	
	this.attributes = {
		start:Config({type:Event}),
		end:Config({type:Event}),
		cancel:Config({type:Event}),
		leave:Config({type:Event}),
		move:Config({type:Event}),
		x: Config({type:int}),
		y: Config({type:int}),
		x1: Config({type:int}),
		y1: Config({type:int}),
		x2: Config({type:int}),
		y2: Config({type:int}),
		x3: Config({type:int}),
		y3: Config({type:int}),
		x4: Config({type:int}),
		y4: Config({type:int}),
		fingers: Config({type:int})
	}
})