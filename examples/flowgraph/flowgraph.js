/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, $ui$, splitcontainer, treeview, cadgrid,  view, label, button, scrollbar, textbox, numberbox, $widgets$, propviewer){	
	var Shader = this.Shader = require('$system/platform/$platform/shader$platform')

		
	define.class(this, "menubar", function($ui$, view){
		
	})
	
	define.class(this, "dockpanel", function($ui$, view, label){
		this.attributes = {
			title:{type:String, value:"Untitled"}
		}
		
		this.padding = 0;
		this.margin = 0;
		this.bgcolor = vec4("#506050");
		this.flex = 1;
		this.flexdirection ="column" 
		this.bg = 0;
		
		this.render = function(){
			return [
				view({bgcolor:"#202220", margin:vec4(0,0,0,0), padding:vec4(0)},
					view({margin:vec4(1,1,2,0),bgcolor:"#8080a0", borderwidth:0,borderradius:vec4(4,4,0,0),padding:vec4(10,2,10,2)},
						label({text:this.title, margin:1, bg:0, fontsize:12, fgcolor: "white" })
					)
				)
				,this.constructor_children
			];
		}
	})
	
	define.class(this, "connection",function($ui$, view){	
		this.attributes = {
			from:{type:String, value:""},
			to:{type:String, value:""},
			linewidth:{type:float, value:10, duration:0.5, motion:"bounce"},
			focussedcolor:{type:vec4, value:vec4("#90b0c0"), meta:"color" },
			hoveredcolor:{type:vec4, value:vec4("#c0d0e0"), meta:"color" },
			focussedwidth:{type:float, value:15},
			hoveredwidth:{type:float, value:25},
			bgcolor:{motion:"linear", duration: 0.1}
		}
		
		this.init = function(){
			this.neutralcolor = this.bgcolor;
			this.neutrallinewidth = this.linewidth;
		}
		
		this.over = false;
		
		this.updatecolor = function(){
			
			if (this.focus) {
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
			this.updatecolor();
		}
		
		
		this.mouseover = function(){
			this.over = true;
			this.updatecolor();
			
		}
		
		this.mouseout = function(){
			this.over = false;
			this.updatecolor();
		}
		
		this.frompos= vec2(0,0);
		this.topos= vec2(0,100);
		
		this.bgcolor = "#8090a0" 
		
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
			
			var F = this.find(this.from);
			var T = this.find(this.to);
			if (F && T){

				this.frompos = vec2(F.pos[0]+ F.layout.width-3,F.pos[1]+20);
				this.topos = vec2(T.pos[0],T.pos[1]+20);
			}
		
		}
		this.calculateposition();
		this.layout = function(){
			this.calculateposition();
		}
		this.render = function(){
			return [];
		}
	})
	
	define.class(this, "block", function($ui$, view, label){
				
		this.position = "absolute" ;
		this.bgcolor = vec4("#708090" )
		this.padding = 0;
		this.borderradius = vec4(10,10,1,1);
		this.borderwidth = 2;
		
		this.bordercolor = vec4("#607080")
		
		this.attributes = {
			pos:{persist: true},
			inputattributes:{type:Object, value:["color"]},
			outputattributes:{type:Object, value:["clicked","something"]},
			title:{type:String, value:"Untitled"},
			snap:{type:int, value:1}	
		}
			
		this.mouseleftdown = function(p){
			var props = this.find("mainproperties");
			if (props) props.target = this.name;
			this.startposition = p.global;
			this.startx = this.pos[0];
			this.starty = this.pos[1];
			
			this.mousemove = function(p){
				
				var dx = p.global[0] - this.startposition[0];
				var dy = p.global[1] - this.startposition[1];
				var x = Math.floor((this.startx+dx)/this.snap)*this.snap;
				var y = Math.floor((this.starty+dy)/this.snap)*this.snap;	

				this.pos = vec2(x,y);
				
				this.redraw();
				this.relayout();
				this.outer.updateconnections();
				
			}.bind(this);
		}
		
		this.mouseleftup = function(p){
			var x = Math.floor(this.pos[0]/this.snap)*this.snap;
			var y = Math.floor(this.pos[1]/this.snap)*this.snap;
			this.pos = vec2(x,y);
			this.redraw();
			this.relayout();
			
			this.mousemove = function(){};
		}
		
		this.flexdirection = "column"
		

		this.render = function(){
			return [
				label({text:this.title, bg:0, margin:4, fontsize: 12})
				,view({flexdirection:"row", alignitems:"stretch", bg:0 }
					,button({icon:"flask", text:"button" })
					,button({icon:"flask"})
				)
			]
		}
	})
	
	this.updateconnections = function(){
		var cl = this.find("connectionlayer");
		for(a in cl.children)
		{
			cl.children[a].layout =1 ;
		}
	}
	
	this.layout = function(){
		console.log("hmm");
		this.updateconnections();
	}
	
	this.render = function()
	{
		return [
			this.menubar({})
			
			,splitcontainer({}
				,splitcontainer({flex:0.3}
					,this.dockpanel({title:"Composition"}
						,treeview({flex:1})
					)
				)
				,this.dockpanel({title:"Patch"}
					,cadgrid({name:"centralconstructiongrid", overflow:"scroll" ,bgcolor: "#303030",minorsize:5,majorsize:25,  majorline:"#505040", minorline:"#404040"}
						,view({name:"connectionlayer", bg:0}
							,this.connection({from:"phone", to:"tv"})
							,this.connection({from:"tablet", to:"thing"})
							,this.connection({from:"a", to:"b"})
							,this.connection({from:"b", to:"c"})
							,this.connection({from:"c", to:"d"})
							,this.connection({from:"a", to:"c"})
						)
						,view({name:"blocklayer", bg:0, layout:function(){console.log("layout")}}
							,this.block({name:"phone", title:"Phone", x:200, y:20})
							,this.block({name:"tv", title:"Television", x:50, y:200})
							,this.block({name:"tablet", title:"Tablet",x:200, y:20})						
							,this.block({name:"thing", title:"Thing",x:200, y:20})						
							,this.block({name:"a", title:"block A", x:50, y:200})
							,this.block({name:"b", title:"block B", x:50, y:200})
							,this.block({name:"c", title:"block C", x:50, y:200})
							,this.block({name:"d", title:"block D", x:50, y:200})
							,this.block({name:"e", title:"block E", x:50, y:200})
							,this.block({name:"f", title:"block F", x:50, y:200})
						)
					)
				) 
				,splitcontainer({flex:0.5,direction:"horizontal"}
					,this.dockpanel({title:"Library", viewport:"2D" }
						,propviewer({flex:1,name:"mainpropviewer", target:"thebutton", flex:1, overflow:"scroll"})
					)
					,this.dockpanel({title:"Properties", viewport:"2D"}
						,propviewer({flex:2,name:"mainproperties", target:"centralconstructiongrid", flex:1, overflow:"scroll"})		
					)	
				)
			)
		];
	}
});
	
	