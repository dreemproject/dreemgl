/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require,$ui$, view, textbox, label,button ){
	// Simple knob: a dial with a value
	
	this.attributes = {
		value: {type: float, value: 0},
		minvalue: {type: float, value: 0},
		maxvalue: {type: float, value: 1},
		stepvalue: {type: float, value: 0.01},
		
		bordercolor: {motion:"easeout", duration:0.2, value: "gray", meta:"color" },
		draggingbordercolor: {type:vec4, value:vec4("yellow"), meta:"color"},
		focusbordercolor: {type:vec4, value:vec4("green"), meta:"color"},

		outerradius:{type:float, value: 70},
		innerradius:{type:float, value: 30},
		offset:{type:float, value:8}
	}
		
	define.class(this, "dial", function($ui$, view){
		
		this.innerradius = 20;
		this.outerradius = 26;

		this.init = function(){
			this.width = this.parent.layout.width;
			this.height = this.parent.layout.height;
		}
				
		this.attributes = {
			start:{type:float, value:0},
			end:{type:float, value: PI*1.5},
		}
		
		this.bg = function(){
			this.mesh = vec2.array();
			
			for(var i=0;i<101;i++){
				this.mesh.push(i/100 , 0);
				this.mesh.push(i/100 , 1);				
			}
			
			this.drawtype = this.TRIANGLE_STRIP
				
			this.position = function(){
				
				var p = view.start + (mesh.x * (view.end - view.start));
				
				uv = vec2(sin(p), cos(p))*(view.innerradius + (view.outerradius-view.innerradius )*mesh.y);
				off = mesh.x / 6.283
				var rad = min(1.,1.)/2.;
				pos = vec2(view.layout.width/2 + rad * uv.x, view.layout.height/2 + rad * uv.y)
				return vec4(pos, 0, 1) * view.totalmatrix * view.viewmatrix
			}
			
			this.color = function(){
				//return view.bgcolor;
				var A = view.outerradius - view.innerradius
				var f =  abs(mesh.y* A - A/2);
				var edge = smoothstep(A/2-2, A/2 , f);
				var aaedge = pow(f,0.30);
				
				var color = view.bgcolor;
				
				var edgecolor = vec4(color.xyz,0);
				var mixed = mix(color, edgecolor, edge);
				//mixed.a *= aaedge;
				return mixed;
			}
		};
	})
	
	
	this.neutralbordercolor = this.bordercolor;
	this.tabstop = 0;
	
	//this.bg = 0;
	this.fgcolor="#101010";
	
	this.value = function(){	
		var td = this.findChild("thedial");		
		if (td) {
			td._start = this.calcstart();
			td.redraw();			
		}
	}
	
	this.focus = function(newfocus){
		if (this._focus){
			this.bordercolor = this.focusbordercolor;
		}
		else{
			this.bordercolor = this.neutralbordercolor;
		}
	}
	
	this.calcstart = function(){
		return ((this.value-this.minvalue)/(this.maxvalue -this.minvalue))* (2*PI-PI/2) +  PI/4;
	}

	this.checkandset = function(newval){
		if (isNaN(newval)) newval = 0;		
		if (this.maxvalue!=undefined && newval > this.maxvalue) newval = this.maxvalue;
		if (this.minvalue!=undefined && newval < this.minvalue) newval = this.minvalue;		
		this.value = newval;
		
		var td = this.findChild("thedial");		
		if (td) {
			td._start = this.calcstart();
			td.redraw();
		}
	}
	
	this.updatevalue = function(p){
		var l = p.local;
		this.checkandset(this.basevalue - (Math.floor((this.lasty - l[1] )/10) -  Math.floor((this.lastx - l[0] )/2))*this.stepvalue);	
	}
	
	this.mouseleftdown = function(p){
		this.bordercolor = this.draggingbordercolor
		this.lasty = p.local[1]
		this.lastx = p.local[0]
		
		this.checkandset(this.value)
		this.basevalue = this.value

		this.mousemove = function(p){
			this.updatevalue(p)
		}.bind(this)
	}
	
	this.mouseleftup = function(p){
		if (this._focus) {
			this.bordercolor = this.focusbordercolor
		}
		else {
			this.bordercolor = this.neutralbordercolor
		}
		this.mousemove = function(){}
	}
	
	//this.bgcolor = "#f0f0f0";
	this.bg = 0;
	this.padding =0;
	this.borderwidth = 0;
	this.bordercolor = "d0d0d0";
	this.borderradius = 0;			
	this.alignself = "flex-end" 
	this.justifycontent = "center";
	this.alignitems = "center";	
	this.borderwidth = 1;
	this.render = function(){
		return [
		view({minwidth: this.outerradius,minheight: this.outerradius, bg:0},
			this.dial({name:"thedialbg", position:"absolute", start: PI/4, end: 2*PI-PI/4 ,bgcolor:"#304050", outerradius:this.outerradius, innerradius:this.innerradius })
			,this.dial({name:"thedial", position:"absolute", start: PI/4, end: 2*PI-PI/4 , bgcolor:"#a0b0c0",outerradius:this.outerradius - this.offset, innerradius:this.innerradius + this.offset})
		)]
	}
})