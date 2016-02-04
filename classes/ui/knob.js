/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require,$ui$, view, textbox, label,button ){
	// Simple knob: a dial with a value

	this.attributes = {
		value: Config({type: float, value: 0}),
		minvalue: Config({type: float, value: 0}),
		maxvalue: Config({type: float, value: 1}),
		stepvalue: Config({type: float, value: 0.01}),

		bordercolor: Config({motion:"easeout", duration:0.2, value: vec4(1,1,1,0), meta:"color" }),
		draggingbordercolor: Config({type:vec4, value:vec4("yellow"), meta:"color"}),
		focusbordercolor: Config({type:vec4, value:vec4("green"), meta:"color"}),

		outerradius: Config({type:float, value: 70}),
		innerradius: Config({type:float, value: 30}),
		offset: Config({type:float, value:8})
	}

	this.minwidth = 50
	this.minheight = 50

	this.atMatrix = function(){
		//console.log(" l!", this.layout);
		this.findChild("thedial").width = this.layout.width
		this.findChild("thedial").height = this.layout.width
		this.findChild("thedial").relayout()
		this.findChild("thedial").redraw()
		this.findChild("thedialbg").width = this.layout.width
		this.findChild("thedialbg").height = this.layout.width
	}

	define.class(this, "dial", function($ui$, view){

		this.innerradius = 20
		this.outerradius = 26

		this.attributes = {
			start:Config({type:float, value:0}),
			end:Config({type:float, value: PI*1.5}),
		}

		this.init = function(){
			this.width = this.parent.layout.width;
			this.height = this.parent.layout.height;
		}

		this.width = function(){
		//	console.log(this._width);
		}

		this.hardrect = function(){
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
				pos = vec2(view.width/2 + rad * uv.x, view.height/2 + rad * uv.y)
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

	this.bgcolor = NaN//{pick_only:true};
	this.fgcolor = "#101010"
	this.bgcolor = "red"

	this.value = function(){
		var td = this.findChild("thedial")
		if (td) {
			td._start = this.calcstart()
			td.redraw()
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
		return ((this.maxvalue-this.value-this.minvalue)/(this.maxvalue -this.minvalue))* (2*PI-PI/2) +  PI/4;
	}

	this.checkandset = function(newval){
		if (isNaN(newval)) newval = 0
		if (this.maxvalue!=undefined && newval > this.maxvalue) newval = this.maxvalue;
		if (this.minvalue!=undefined && newval < this.minvalue) newval = this.minvalue;
		this.value = newval;

		var td = this.findChild("thedial")
		if (td) {
			td._start = this.calcstart()
			td.redraw()
		}
	}

	this.updatevalue = function(delta){
		this.checkandset(this.basevalue - (Math.floor(delta[1]/10) -  Math.floor(delta[0]/2))*this.stepvalue);
	}

	this.pointerstart = function(event){
		this.bordercolor = this.draggingbordercolor
		this.checkandset(this.value)
		this.basevalue = this.value
	}

	this.pointermove = function(event){
		this.updatevalue(event.delta)
	}

	this.pointerend = function(event){
		if (this._focus) {
			this.bordercolor = this.focusbordercolor
		} else {
			this.bordercolor = this.neutralbordercolor
		}
	}

	//this.bgcolor = "#f0f0f0";
	//this.bg = 0;
	this.padding =0;
	this.bordercolor = vec4(1,1,1,0);
	this.borderradius = 0;
	this.alignself = "flex-end"
	this.justifycontent = "center";
	this.alignitems = "center";
	this.borderwidth = 2;

	this.drawtarget = 'pick'

	this.render = function(){
		return [
		view({minwidth: this.outerradius,minheight: this.outerradius, bgcolor:NaN},
			this.dial({name:"thedialbg", position:"absolute",x:this.width/2, y:this.height/2, start: PI/4, end: 2*PI-PI/4 ,bgcolor:"#304050", outerradius:this.outerradius, innerradius:this.innerradius })
			,this.dial({name:"thedial", position:"absolute", start: PI/4, end: 2*PI-PI/4 , bgcolor:"#a0b0c0",outerradius:this.outerradius - this.offset, innerradius:this.innerradius + this.offset})
		)]
	};

	var knob = this.constructor;
	this.constructor.examples = {
		Usage: function(){
			return [
				knob({alignself:'flex-start',
					innerradius:70,
					outerradius: 190,
					bgcolor:vec4(0,0,0,1)})
			]
		}
	}
})
