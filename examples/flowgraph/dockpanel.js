/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require, $ui$, view, icon, label, button, scrollbar){
	this.attributes = {
		title:{type:String, value:"Untitled"},
		fontsize:{type:float, value:12, meta:"fontsize"}
	}
	
	this.padding = 0;
	this.margin = 0;
	this.bgcolor = vec4("#505050");
	this.flex = 1;
	this.flexdirection ="column" 
	this.bg = 0;
	
	this.render = function(){
		return [
			view({bgcolor:"#454545", margin:vec4(0,0,0,0), padding:vec4(0)},
				view({margin:vec4(1,1,2,0),bgcolor:"#3a3a3a", borderwidth:0,borderradius:vec4(0),padding:vec4(10,2,10,2)},
					label({font: require('$resources/fonts/opensans_bold_ascii.glf'),margin:5, text:this.title, bg:0, fontsize:this.fontsize, fgcolor: "white" })
				)
			)
			,this.constructor_children
		];
	}
})