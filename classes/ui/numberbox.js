/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require,$ui$, view, textbox, label,button ){
	// Simple numberbox: a number with a plus and a minus button
	
	this.attributes = {
		value: Config({type: float, value: 0}),
		minvalue: Config({type: float, value: undefined}),
		maxvalue: Config({type: float, value: undefined}),
		stepvalue: Config({type: float, value: 1}),
		bordercolor: Config({motion:"easeout", duration:0.1, value: "#202020", meta:"color" }),
		draggingbordercolor: Config({type:vec4, value:vec4("#707070"), meta:"color"}),
		focusbordercolor: Config({type:vec4, value:vec4("#606060"), meta:"color"}),
		decimals: Config({type:int, value:0}), 
		// Font size in device-pixels.
		fontsize: Config({type: float, value: 14, meta:"fontsize" }),		
		title: Config({type:String, value:""})
	}
	
	this.tabstop = 0;
	this.bordercolor = "#202020" ;
	this.borderradius = 4;
	this.borderwidth = 2;
	this.fgcolor="#f0f0f0";
	this.bgcolor = "#3b3b3b" 

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

	this.init = function(){
		this.neutralbordercolor = this.bordercolor;
	}
	
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
		this.checkandset(this.basevalue + (Math.floor((this.lasty - l[1] )/10) -  Math.floor((this.lastx - l[0] )/2))*this.stepvalue);	
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
	
	this.justifycontent = "space-around"
		
	this.render = function(){
		
		var res = [];

		if (this.title && this.title.length > 0){
			res.push(
			view({bgcolor:this.bordercolor,bordercolor:this.bordercolor , margin:0,borderradius:vec4(1,1,1,1),borderwidth:1,  padding:0},
				label({name:"thetitle", align:"right", margin:vec4(5,0,5,0),  bg:0,text:this.title,flex:1, fontsize: this.fontsize, fgcolor:this.fgcolor})
				)
			)
		}
		
		res.push(button({margin:vec4(4,0,4,0),alignself:"center",bgcolor:this.bgcolor,fgcolor:this.fgcolor,borderwidth:0, icon:"chevron-left",  buttoncolor2:"#3b3b3b", buttoncolor1:"#3b3b3b",text:"" , fontsize: this.fontsize*(2/3),  padding:4, borderradius:0, click:function(){this.downclick()}.bind(this)}));
		res.push(label({margin:vec4(4,0,4,0),alignself:"center", padding:0,  name:"thenumber", align:"right", text:this._value.toString(),flex:1, fontsize: this.fontsize, fgcolor:this.fgcolor, bg:0}))
		res.push(button({margin:vec4(4,0,4,0),alignself:"center",bgcolor:this.bgcolor,fgcolor:this.fgcolor,borderwidth:0,text:"", icon:"chevron-right", buttoncolor2:"#3b3b3b", buttoncolor1:"#3b3b3b",fontsize: this.fontsize*(2/3),  padding:4, borderradius:0, click:function(){this.upclick()}.bind(this)}))
		return res;	
		
	}
})