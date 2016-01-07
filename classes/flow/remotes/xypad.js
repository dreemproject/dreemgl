/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/screen', function(require, $ui$,cadgrid, view, icon, label, button, scrollbar,$behaviors$, draggable){
	this.attributes = {
		mousepos: Config({type:vec2, flow:"out"})
	}
	bg:false
	this.render = function(){	
		return cadgrid({bgcolor:"#000030", majorline: "#003040", minorline: "#002030" },view({
			name:'main',
			size: vec2(100, 100),
			bgcolor: vec4('#006070'),		
			borderradius: 40,
			is: draggable(),
			onpos: function(){
				this.mousepos = this.pos;
			}.bind(this)
		}))
	}
})