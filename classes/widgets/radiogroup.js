/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $ui$, view, label, button, scrollbar, textbox, icon){
	
	this.attributes ={
		values:{type:Object, value:[]},
		currentvalue:{type:String, value:""},
		fgcolor: {type:vec4, value:vec4("#303030"), meta:"color"},
		fontsize: {type: float, value: 12, meta:"fontsize"}
	}
	this.flexdirection = "row"
	
	this.render = function(){
		var res = [];
		
		var radio = this;
		for(var i =0 ;i<this.values.length;i++)
		{
			var v = (this.values[i])?this.values[i].toString():"undefined";
			if (v == this.currentvalue || ((v==undefined || v=="undefined") && !this.currentvalue)){
				
				res.push(icon({icon:"check", bg:0, margin:vec4(8,8,0,8), fontsize:this.fontsize, fgcolor: this.fgcolor}),label({text:(v&&v.trim().length > 0)?v:"undefined",fontsize:14,margin:vec4(0,8,8,8), bg:0, fgcolor:this.fgcolor,fontsize:this.fontsize}))
			}
			else{
				res.push(button({
						padding:2,text:(v===undefined)?"unD": ((v.trim().length > 0)?v:"AAA"), onclick:function(){
							radio.currentvalue = (this.text=="undefined" ||this.text=="unD") ? undefined:this.text;
						},fontsize:this.fontsize
					}))
			}
		}
		return res;
	}
})