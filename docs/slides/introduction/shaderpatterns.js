/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(){

	this.wave = function(pos, x, y){
		return sin(pos.x*x*8) + sin(pos.y*y*8)
	}

	this.stripe = function(pos, amount, spacing){
		var stripex = (floor(mod((pos.x )* spacing  + 0.05,1.0) *amount ) / amount) < 0.1?1.0:0.0;
		var stripey = (floor(mod((pos.y  )*spacing + 0.05, 1.0)*amount ) / amount) < 0.1?1.0:0.0;
		var maxstripe = max(stripex, stripey);
		return maxstripe
	}
})
