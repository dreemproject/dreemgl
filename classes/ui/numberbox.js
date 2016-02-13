/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require,$ui$, view, textbox, label, button){
	// Simple numberbox: a number with a plus and a minus button

	this.attributes = {
		value: Config({type: float, value: 0}),
		minvalue: Config({type: float, value: undefined}),
		maxvalue: Config({type: float, value: undefined}),
		stepvalue: Config({type: float, value: 1}),
		bordercolor: Config({motion:"easeout", duration:0.1, value: "#262626", meta:"color" }),
		draggingbordercolor: Config({type:vec4, value:vec4("#707070"), meta:"color"}),
		focusbordercolor: Config({type:vec4, value:vec4("#606060"), meta:"color"}),
		decimals: Config({type:int, value:0}),
		// Font size in device-pixels.
		fontsize: Config({type: float, value: 14, meta:"fontsize" }),
		title: Config({type:String, value:""}),

		//internal
		textfocus:Config({type:boolean})
	}

	this.tabstop = 0;
	this.bordercolor = "#262626" ;
	this.borderradius = 4;
	this.borderwidth = 2;
	this.fgcolor="#f0f0f0";
	this.bgcolor = "#3b3b3b"

	this.alignself = "flex-end"
	this.justifycontent = "center";
	this.alignitems = "center";

	this.onvalue = function() {

		var expo = Math.pow(10, this.decimals);
		this._value = Math.round(this.value * expo) / expo;


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

	this.pointerstart = function(){
		this.bordercolor = this.draggingbordercolor
		this.checkandset(this.value)
		this.basevalue = this.value
	}

	this.pointermove = function(event){
		this.checkandset(this.basevalue + (Math.floor(event.delta[0] / 2) - Math.floor(event.delta[1] / 10)) * this.stepvalue)
	}

	this.pointerend = function(){
		if (this._focus) {
			this.bordercolor = this.focusbordercolor
		} else {
			this.bordercolor = this.neutralbordercolor
		}
	}

	this.justifycontent = "space-around";

	this.render = function(){

		var res = [];

		if (this.title && this.title.length > 0){
			res.push(
			view({alignitems:"center", justifycontent:"center", bgcolor:this.bordercolor,bordercolor:this.bordercolor , margin:0,borderradius:vec4(1,1,1,1),borderwidth:1,  padding:0},
				label({name:"thetitle", align:"right", alignself:"center", margin:vec4(5,0,5,0),  bgcolor:NaN,text:this.title,flex:1, fontsize: this.fontsize, fgcolor:this.fgcolor})
				)
			)
		}

		res.push(button({margin:vec4(4,0,4,0),alignself:"center",bgcolor:this.bgcolor,fgcolor:this.fgcolor,borderwidth:0, icon:"chevron-left",  buttoncolor2:"#3b3b3b", buttoncolor1:"#3b3b3b",label:"" , fontsize: this.fontsize*(2/3),  padding:4, borderradius:0, click:function(){this.downclick()}.bind(this)}));
		res.push(textbox({
			margin:vec4(4,0,4,0),
			alignself:"center",
			padding:0,
			bgcolor:"white",
			hardrect:{pickonly:true},
			name:"thenumber",
			align:"right",
			value:this._value.toString(),
			flex:1,
			fontsize:this.fontsize,
			fgcolor:this.fgcolor,
			multiline:false,
			onfocus: function(ev,v,o) {
				this.textfocus = v;
			}.bind(this),
			onvalue:function(ev,v,o) {
				var txval = parseFloat(o.value);
				if (!isNaN(txval)) {
					if (Math.abs(this.value - txval) >= 0.01) {
						this.value = txval;
					}
				}
			}.bind(this)
	}));
		res.push(button({margin:vec4(4,0,4,0),alignself:"center",bgcolor:this.bgcolor,fgcolor:this.fgcolor,borderwidth:0,label:"", icon:"chevron-right", buttoncolor2:"#3b3b3b", buttoncolor1:"#3b3b3b",fontsize: this.fontsize*(2/3),  padding:4, borderradius:0, click:function(){this.upclick()}.bind(this)}));
		return res;

	}

	var numberbox = this.constructor;
	this.constructor.examples = {
		Usage: function(){
			return [
				numberbox({alignself:'flex-start'})
			]
		}
	}

});
