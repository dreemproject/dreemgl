/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require,$ui$, view, textbox, label,button ){
	// Simple numberbox: a number with a plus and a minus button
	
	this.attributes = {
		value: {type: float, value: 0},
		minvalue: {type: float, value: undefined},
		maxvalue: {type: float, value: undefined},
		stepvalue: {type: float, value: 1},
		bordercolor: {motion:"easeout", duration:0.1, value: "#383838", meta:"color" },
		draggingbordercolor: {type:vec4, value:vec4("#707070"), meta:"color"},
		focusbordercolor: {type:vec4, value:vec4("#606060"), meta:"color"},
		decimals: {type:int, value:0}, 
		// Font size in device-pixels.
		fontsize: {type: float, value: 14, meta:"fontsize" },		
		title: {type:String, value:""}
	}
	
	
	
	this.neutralbordercolor = this.bordercolor;
	this.tabstop = 0;
	
	
	this.bordercolor = "#383838" ;
	this.borderradius = 10;
	this.borderwidth = 2;
	this.fgcolor="#f0f0f0";
	
	this.bgcolor = "#4D4D4D" 

	this.alignself = "flex-end" 
	this.justifycontent = "center";
	this.alignitems = "center";	
	
	
	
	this.value = function(){
		var tn = this.findChild("thenumber");
		if (tn) {
			tn.text = this._value.toString();
			this.relayout();
		}
	}
	
	
	this.keydownUparrow = function(){this.checkandset(this.value + this.stepvalue);}
	this.keydownDownarrow =function(){this.checkandset(this.value - this.stepvalue);}
	this.keydownRightarrow = function(){this.checkandset(this.value + this.stepvalue*100);}
	this.keydownLeftarrow = function(){this.checkandset(this.value - this.stepvalue*100);}

	this.keydownUparrowShift = function(){this.checkandset(this.value + this.stepvalue*10);}
	this.keydownDownarrowShift =function(){this.checkandset(this.value - this.stepvalue*10);}
	this.keydownRightarrowShift =function(){this.checkandset(this.value + this.stepvalue*1000);}
	this.keydownLeftarrowShift =function(){this.checkandset(this.value - this.stepvalue*1000);}



	
	this.keydown = function(v){			
		console.log(v);
			this.screen.defaultKeyboardHandler(this, v);
	}
	
	this.focus = function(newfocus){
		if (this._focus){
			this.bordercolor = this.focusbordercolor;
		}
		else{
			this.bordercolor = this.neutralbordercolor;
		}
	}
	
	this.checkandset = function(newval){
		
		if (isNaN(newval)) newval = 0;		
		
		if (this.maxvalue!=undefined && newval > this.maxvalue) newval = this.maxvalue;
		if (this.minvalue!=undefined && newval < this.minvalue) newval = this.minvalue;		
		var expo = Math.pow(10, this.decimals);
		this.value = Math.round(newval * expo) / expo;
		nb = this.findChild("thenumber");
		if (nb) nb.value = this.value.toString();
	}

	this.upclick = function(){
		this.checkandset(this.value + this.stepvalue);
	}
	
	this.downclick = function(){
		this.checkandset(this.value - this.stepvalue);
	}
		
	this.updatevalue = function(p){
		var l = p.local;
		this.checkandset(this.basevalue - (Math.floor((this.lasty - l[1] )/10) -  Math.floor((this.lastx - l[0] )/2))*this.stepvalue);	
	}
	
	this.mouseleftdown = function(p){
		this.bordercolor = this.draggingbordercolor
		this.lasty = p.local[1];
		this.lastx = p.local[0];
		
		this.checkandset(this.value);
		this.basevalue = this.value;

		this.mousemove = function(p){			
			this.updatevalue(p);
		}.bind(this);
	}
	
	this.mouseleftup = function(p){
		if (this._focus) {
			this.bordercolor = this.focusbordercolor
		}
		else{
			this.bordercolor = this.neutralbordercolor
		}
		this.mousemove = function(){}
	}
	
		
	this.render = function(){
		
		var res = [];

		if (this.title && this.title.length > 0){
			res.push(
			view({bgcolor:this.bordercolor, margin:0,borderradius:vec4(4,1,1,4), padding:4},
				label({name:"thetitle", align:"right",  bg:0,text:this.title,flex:1, fontsize: this.fontsize, fgcolor:this.fgcolor})
				)
			)
		}
		
		res.push(button({bgcolor:this.bgcolor,fgcolor:this.fgcolor,borderwidth:0, icon:"chevron-left", text:"" , fontsize: this.fontsize*(2/3), margin:0, padding:2, borderradius:0, click:function(){this.downclick()}.bind(this)}));
		res.push(label({name:"thenumber", align:"right", text:this._value.toString(), margin:0,flex:1, fontsize: this.fontsize, fgcolor:this.fgcolor, bg:0}))
		res.push(button({bgcolor:this.bgcolor,fgcolor:this.fgcolor,borderwidth:0,text:"", icon:"chevron-right", fontsize: this.fontsize*(2/3), margin:0, padding:2, borderradius:0, click:function(){this.upclick()}.bind(this)}))
	
		return res;	
		
	}
})