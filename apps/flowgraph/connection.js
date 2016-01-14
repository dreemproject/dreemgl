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
		glowlinewidth: Config({type:float, value:12, duration:0.5, motion:"bounce"}),
		focussedcolor: Config({type:vec4, value:vec4("#d0d0d0"), meta:"color" }),
		hoveredcolor: Config({type:vec4, value:vec4("#f0f0f0"), meta:"color" }),
		focussedwidth: Config({type:float, value:3}),
		hoveredwidth: Config({type:float, value:3}),
		color1: Config({type:vec4, value:vec4("blue"), animinit:true, motion:"linear", duration: 0.1}),
		color2: Config({type:vec4, value:vec4("red"), animinit:true,  motion:"linear", duration: 0.1}),
		centralcolor: Config({type:vec4, value:vec4("red"), animinit:true, motion:"linear", duration: 0.1}),
		inselection : Config({type:boolean, value:false}),
		hasball: true
	
	}
		
	this.B1 = function (t) { return t * t * t; }
	this.B2 = function (t) { return 3 * t * t * (1 - t); }
	this.B3 = function (t) { return 3 * t * (1 - t) * (1 - t); }
	this.B4 = function (t) { return (1 - t) * (1 - t) * (1 - t); }

	this.bezier = function(percent,C1,C2,C3,C4) {		
		
		var b1 = this.B1(percent);
		var b2 = this.B2(percent);
		var b3 = this.B3(percent);
		var b4 = this.B4(percent);
		
		//return 
		var A1 = vec2.vec2_mul_float32(C1, b1 )
		var A2 = vec2.vec2_mul_float32(C2, b2 )
		var A3 = vec2.vec2_mul_float32(C3, b3 )
		var A4 = vec2.vec2_mul_float32(C4, b4 )

		return vec2.add(A1, vec2.add(A2, vec2.add(A3, A4)));			
	}
		
	this.noboundscheck = true
	
	this.oninselection = function(){	
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
		this.neutralcolor1 = this.color1;
		this.neutralcolor2 = this.color2;
		this.neutrallinewidth = this.linewidth;
		this.find("flowgraph").allconnections.push(this);	
		
		this.updatecount = 0;

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
		if (this.inselection) {
			this.color1 = this.focussedcolor;
			this.color2 = this.focussedcolor;
			this.linewidth = this.focussedwidth;
		}
		else{
			if (this.over){
				this.color1 = this.hoveredcolor;
				this.color2 = this.hoveredcolor;
				
				this.linewidth = this.hoveredwidth;
			}
			else{
				this.color1 = this.neutralcolor1;
				this.color2 = this.neutralcolor2;
				this.linewidth = this.neutrallinewidth;
			}
		}

		this.centralcolor = mix(this.color1, this.color2, 0.5)//, !this.updatecount);;
				var H = this.findChild("handle");
		
		if (H){
			H.bordercolor = this.centralcolor;
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
			//return 'blue'
			var a= 1.0 - pow(abs(mesh.y*2.0), 2.5);
			return vec4(vec3(0.01) + mix(view.color1.xyz,view.color2.xyz, mesh.x)*1.1,a);
			return vec4(view.bgcolor.xyz,a);
		}	
	}) 
	
	define.class(this, "glowconnectionshader", this.Shader,function($ui$, view){	
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
			var b = mesh.y * view.glowlinewidth;
			
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
		//this.color_blend = 'src_alpha * src_color + dst_color'
  
		this.color = function(){
			//return 'red'
			var a= 1.0-pow(abs(mesh.y*2.0), 2.5);
			return vec4(mix(view.color1.xyz,view.color2.xyz, mesh.x),a*0.3);
			return vec4(vec3(0.0) + view.bgcolor.xyz*1.0,a);
		}	
	}) 

	this.bg = this.connectionshader;
	this.glowconnectionshader = 1;
	this.calculateposition = function(){
		var F = this.find(this._from);
		var T = this.find(this._to);
		
		var color2 = undefined;
		var color1 = undefined;
		if (F){
			var out = F.findChild(this._fromoutput);
			var yoff = 0;
			if (out) {
				color2 = out.bgcolor;
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
				color1 = inp.bgcolor;
				
				yoff += inp.layout.top;
				yoff += inp.parent.layout.top;
				yoff += inp.parent.parent.layout.top + 10;
				if (!F) this.neutralcolor = this.bgcolor = inp.bgcolor;
		
			}
			
			this.topos = vec2(T._pos[0],T._pos[1]+yoff)
		}
		else{
		//	console.log(" no T", this._to);
			this.topos = this.localMouse();;
		}
				
		if (color1 && !color2) color2 = color1;else if (color2 && !color1) color1 = color2;
		if (color1) this.neutralcolor1 = this.color1 = color1//Mark(color1, !this.updatecount);
		if (color2) this.neutralcolor2 = this.color2 =  color2//Mark(color2, !this.updatecount);

		this.centralcolor = mix(this.color1, this.color2, 0.5)//, !this.updatecount);;
		//console.log(this.centralcolor)
		//this.updatecount++;
		
		var H = this.findChild("handle");
		
		if (H){
			H.bordercolor = this.centralcolor;
			H.pos = vec2((this.frompos[0] + this.topos[0])*0.5 - 12,(this.frompos[1] + this.topos[1])*0.5 - 12);
			
			var ddp = vec2.sub(this.topos, this.frompos);
			//console.log(ddp);
			var curve = min(100.,vec2.len(ddp)/2);
			
					var F2 = vec2.add(this.frompos, vec2(curve,0));
					var T2 = vec2.add(this.topos, vec2(-curve,0));
			var A1 = this.bezier(0.49, this.frompos, F2,T2, this.topos);
			var A2 = this.bezier(0.51, this.frompos, F2,T2, this.topos);
			var delta = vec2.sub(A1, A2);
			var angle = Math.atan2(delta[1], delta[0]);
			H.triangleangle = angle;
			
		
		}
	}

	this.render = function(){
		if (this.hasball) return [ballbutton({click:function(){
			this.screen.contextMenu([{name:"Remove", icon:"remove", clickaction:function(){
				this.keydownDelete()
			}.bind(this)}])
		}.bind(this),name:"handle", position:"absolute", ballsize: 24, triangle:true, bgcolor:"#303030"})];
		return [];
	}
})
