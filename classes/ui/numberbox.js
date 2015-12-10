/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require,$ui$, view, textbox, label,button ){
	// Simple button: a rectangle with a textlabel and an icon
	
	this.attributes = {
		// The label for the button
		value: {type: float, value: 0, persist: true},
		minvalue: {type: float, value: undefined},
		maxvalue: {type: float, value: undefined},
		stepvalue: {type: float, value: 1},
		
		// Font size in device-pixels.
		fontsize: {type: float, value: 14},		
	}
	this.bg = 0;
	this.fgcolor="#101010";
	
	this.checkandset = function(newval){
		if (isNaN(newval)) newval = 0;		
		if (this.maxvalue!=undefined && newval > this.maxvalue) newval = this.maxvalue;
		if (this.minvalue!=undefined && newval < this.minvalue) newval = this.minvalue;		
		this.value = newval;
		nb = this.find("thenumber");
		if (nb) nb.value = this.value.toString();
	}

	this.upclick = function(){
		this.checkandset(this.value + this.stepvalue);
	}
	
	this.downclick = function(){
		this.checkandset(this.value - this.stepvalue);
	}
		
	this.bgcolor = "#f0f0f0";
	this.padding =0;
	this.borderwidth = 0;
	this.bordercolor = "d0d0d0";
	this.borderradius = 0;			
	this.alignself = "flex-end" 
	this.justifycontent = "center";
	this.alignitems = "center";	
	this.borderwidth = 1;
	this.padding = vec4(3,0,0,0);
		
	this.render = function(){
		return [
				label({name:"thenumber", align:"right", text:this.value.toString(), margin:5,flex:1, fontsize: this.fontsize, fgcolor:this.fgcolor, bg:0})
				,view({flexdirection:"column", bg:0}
					,button({text:"", icon:"plus", fontsize: this.fontsize*(2/3), margin:0, padding:0, borderradius:0, click:function(){this.upclick()}.bind(this)})
					,button({icon:"minus", text:"" , fontsize: this.fontsize*(2/3), margin:0, padding:0, borderradius:0, click:function(){this.downclick()}.bind(this)})
				)
		]
	}
})