/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

//Pure JS based composition
define.class(function(require, $server$, composition, $ui$, screen, view, $widgets$, jseditor){
	this.render = function(){ return [
		screen({name:'default', clearcolor:vec4('black')},
			jseditor({
				atDraw:function(){
					this.zoom = sin(Date.now()/1000.)*3+4.
					return true
				},
				flex:1, overflow:'scroll',fontsize:15,
				source:require('$ui/view').module.factory.body.toString()
			},[1])
		)
	]}
})
// alright so how wide do we do this character thing (in pixels)
// and then we have a mode. dup, left, center, right
