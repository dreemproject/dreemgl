/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $ui$, view, label, button, scrollbar, textbox,$widgets$){
	this.attributes = {
		target:{type:String,value:""},
		property:{type:Object},
		propertyname:{type:String,value:""}
		
	}
	
	this.margin = vec4(4);
	this.bgcolor = "blue"
	this.bg = 0;
	this.render = function(){
		
		
		if (!this.property) return [];
		//console.log(this.property);
		return [
			label({text:this.propertyname, bg:0, fgcolor:"#303030" })
			,label({text:this.property.type?this.property.type.name:"", bg:0, fgcolor:"#303030" })
		]	
	}
	
})