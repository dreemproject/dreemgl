/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require, $ui$, view, icon, treeview, cadgrid, label, button, $$, ballbutton){
				
	this.attributes = {
		from: Config({type:String, value:""}),
		to: Config({type:String, value:""}),
		fromoutput: Config({type:String, value:""}),
		toinput: Config({type:String, value:""}),
		linewidth: Config({type:float, value:3, duration:0.5, motion:"bounce"}),
		focussedcolor: Config({type:vec4, value:vec4("#d0d0d0"), meta:"color" }),
		hoveredcolor: Config({type:vec4, value:vec4("#f0f0f0"), meta:"color" }),
		focussedwidth: Config({type:float, value:3}),
		hoveredwidth: Config({type:float, value:3}),
		bgcolor: Config({motion:"linear", duration: 0.1}),
		inselection : Config({type:boolean, value:false}),
		hasball: true
	
	}

	this.noboundscheck = true
	
	this.inselection = function(){	
		if (this._inselection == 1) this.bordercolor = this.focusbordercolor;else this.bordercolor = this.neutralbordercolor;		
		this.redraw();
		this.updatecolor ();
	}

	
	this.destroy = function(){
		fg = this.find("flowgraph");
		if (fg){
			var index = fg.allconnections.indexOf(this);
			if (index > -1) fg.allconnections.splice(index, 1);
		}
	}
	
	
	
	this.init = function(){
		this.neutralcolor = this.bgcolor;
		this.neutrallinewidth = this.linewidth;
		this.find("flowgraph").allconnections.push(this);	
	}
	
	this.keydownDelete = function(){
		this.find("flowgraph").removeConnection(this);
	}
	
	this.keydownHandler = function(name){
		console.log("connection handles key:", name);
	}
	
	this.keydown = function(v){			
		this.screen.defaultKeyboardHandler(this, v);
	}

	
	this.over = false;
	
	this.updatecolor = function(){	
		if (this._inselection) {
			this.bgcolor = this.focussedcolor;
			this.linewidth = this.focussedwidth;
		}
		else{
			if (this.over){
				this.bgcolor = this.hoveredcolor;
				this.linewidth = this.hoveredwidth;
			}
			else{
				this.bgcolor = this.neutralcolor;
				this.linewidth = this.neutrallinewidth;
			}
		}
	}
	
	this.focus =function(){
	}
	
	
	this.mouseleftdown = function(){
		var fg = this.find("flowgraph");
		
		
		if (!this.screen.keyboard.shift && !fg.inSelection(this)){
			fg.clearSelection();
		}
		if (this.screen.keyboard.shift && fg.inSelection(this)){
			fg.removeFromSelection(this);
			fg.updateSelectedItems();
	
			return;
		}
		fg.setActiveConnection(this);
		fg.updateSelectedItems();
		
		this.startposition = this.parent.localMouse();
		fg.setupSelectionMove();
		this.mousemove = function(evt){
			p = this.parent.localMouse()
			var dx = p[0] - this.startposition[0];
			var dy = p[1] - this.startposition[1];
	
			var	fg = this.find("flowgraph");
			fg.moveSelected(dx,dy);
			
			
		}.bind(this);
	
	
	}
	
	this.mouseleftup = function(p){
	
		this.mousemove = function(){};
	}

	this.mouseover = function(){
		this.over = true;
		this.updatecolor();
	}
	
	this.mouseout = function(){
		this.over = false;
		this.updatecolor();
	}
	
	this.updateMove = function(){			
	}
	
	this.setupMove = function(){		
	}
	
	this.frompos= vec2(0,0);
	this.topos= vec2(0,100);
	
	this.bgcolor = "#00ffff" 
	
	define.class(this, "connectionshader", this.Shader,function($ui$, view){	
		this.mesh = vec2.array()
		
		for(var i = 0;i<100;i++){
			this.mesh.push([i/100.0,-0.5])
			this.mesh.push([i/100.0, 0.5])
		}
					
		this.drawtype = this.TRIANGLE_STRIP
		
		this.B1 = function (t) { return t * t * t; }
		this.B2 = function (t) { return 3 * t * t * (1 - t); }
		this.B3 = function (t) { return 3 * t * (1 - t) * (1 - t); }
		this.B4 = function (t) { return (1 - t) * (1 - t) * (1 - t); }

		 this.bezier = function(percent,C1,C2,C3,C4) {		
			
			var b1 = B1(percent);
			var b2 = B2(percent);
			var b3 = B3(percent);
			var b4 = B4(percent);
			
			return C1* b1 + C2 * b2 + C3 * b3 + C4 * b4;		
		}
			
		this.position = function(){
			var a = mesh.x;
			var a2 = mesh.x+0.001;
			var b = mesh.y * view.linewidth;
			
			var ddp = view.topos - view.frompos;
			
			var curve = min(100.,length(ddp)/2);
			posA = this.bezier(a, view.frompos, view.frompos + vec2(curve,0), view.topos - vec2(curve,0), view.topos);
			posB = this.bezier(a2, view.frompos, view.frompos + vec2(curve,0), view.topos - vec2(curve,0), view.topos);
			
			var dp = normalize(posB - posA);
			
			var rev = vec2(-dp.y, dp.x);
			posA += rev * b;
			//pos = vec2(mesh.x * view.layout.width, mesh.y * view.layout.height)
			return vec4(posA, 0, 1) * view.totalmatrix * view.viewmatrix
		}
		
		this.color = function(){
			var a= 1.0-pow(abs(mesh.y*2.0), 2.5);
			return vec4(view.bgcolor.xyz,a);
		}	
	}) 

	this.bg = this.connectionshader;
	this.calculateposition = function(){
		var F = this.find(this._from);
		var T = this.find(this._to);
		
	
		if (F){
			var out = F.findChild(this._fromoutput);
			var yoff = 0;
			if (out) {
				yoff += out.layout.top;
				yoff += out.parent.layout.top;
				yoff += out.parent.parent.layout.top + 10;
				this.neutralcolor = this.bgcolor = out.bgcolor;
			}
			this.frompos = vec2(F._pos[0]+ F._layout.width-3,F._pos[1]+yoff)
		}
		else{
			//console.log(" no F:", this._from);
			//this.frompos = vec2(200,100);
			this.frompos = this.localMouse();;
		}
		
		if (T){
			var inp = T.findChild(this._toinput);
			var yoff = 0;
			if (inp) {
				yoff += inp.layout.top;
				yoff += inp.parent.layout.top;
				yoff += inp.parent.parent.layout.top + 10;
			}
			
			this.topos = vec2(T._pos[0],T._pos[1]+yoff)
		}
		else{
		//	console.log(" no T", this._to);
			this.topos = this.localMouse();;
		}
		
		var H = this.findChild("handle");
		
		if (H){
			H.pos = vec2((this.frompos[0] + this.topos[0])*0.5 - 12,(this.frompos[1] + this.topos[1])*0.5 - 12);
		}
	}

	this.render = function(){
		if (this.hasball) return [ballbutton({name:"handle", position:"absolute", ballsize: 24, icon:"play", bgcolor:"#3b3b3b", bordercolor:wire("this.parent.bgcolor")})];
		return [];
	}
})
