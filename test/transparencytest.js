/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

//Pure JS based composition
define.class('$server/composition', function($ui$, screen, view, label){
	this.render = function(){ return [
		screen({clearcolor:vec4('blue')},
			view({flex:1, bgcolor:'blue'},
				view({bgcolor:'red', flex:1, borderradius:40, borderwidth:30, bordercolor:'orange'})
			)
		)
	]}
})
