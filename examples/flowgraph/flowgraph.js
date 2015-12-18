/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require, 
		$ui$, view, icon, treeview, cadgrid, label, button, scrollbar, textbox, numberbox, splitcontainer,
		$widgets$, propviewer,
		$server$, sourceset, dataset){

	this.attributes = {
		activeconnectioncolor:{type:vec4, value:"#f0f090", meta:"color"}
	}

	this.flex = 1

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
	
	define.class(this, "classlibclass", function($ui$, view, icon){
		this.attributes = {
			classdesc:{type:Object, value: undefined},
			col1: {value:vec4("#c0d0e0"),persist:true, meta:"color", motion:"linear", duration:0.1},
			col2: {value:vec4("#f0f0f0"),persist:true, meta:"color", motion:"linear", duration:0.2}
		}
		
		this.bg = {
			color: function(){	
				var fill = mix(view.col1, view.col2,  (mesh.y)/0.8)
				return fill;
			}			
		}
		
		
		this.justifycontent= "flex-start";
		this.alignitems = "center"
		///this.aligncontent = "center"
		this.render = function(){
			return [
			view({width:40, height:40, borderwidth:1, borderradius:2, bordercolor:"#303030", margin:5}
				,icon({icon:"flask", margin:4, fgcolor:this.fgcolor})
			)
			,label({text:this.classdesc.name, margin:8,fgcolor:this.fgcolor, bg:0, fontsize:this.fontsize})
			]
		}
	})
	
	define.class(this, "library", function($ui$, view){
		this.flex = 1;
		this.attributes = {
				dataset:{type:dataset},
				fontsize:{type:float, meta:"fontsize", value: 15}
		}
		this.flexdirection = "column" 
		this.fgcolor = "#303030"
		this.render =function(){
			
			if (!this.dataset) return [];
			
			var res = [];
			//console.log(this.dataset);
			for(var a  in this.dataset.children[0].children){
				var ds = this.dataset.children[0].children[a];
				res.push(this.outer.classlibclass({classdesc: ds, fgcolor:this.fgcolor, fontsize: this.fontsize}));
			}
			
			return res;
		}
	})
	
	define.class(this, "connection",function($ui$, view){	
		
		this.attributes = {
			from:{type:String, value:""},
			to:{type:String, value:""},
			linewidth:{type:float, value:10, duration:0.5, motion:"bounce"},
			focussedcolor:{type:vec4, value:vec4("#f0f090"), meta:"color" },
			hoveredcolor:{type:vec4, value:vec4("#c0d0e0"), meta:"color" },
			focussedwidth:{type:float, value:15},
			hoveredwidth:{type:float, value:25},
			bgcolor:{motion:"linear", duration: 0.1},
			inselection :{type:boolean, value:false}
		
		}
		
		this.inselection = function(){	
			if (this._inselection == 1) this.bordercolor = this.focusbordercolor;else this.bordercolor = this.neutralbordercolor;		
			this.redraw();
			this.updatecolor ();
		}

		
		
		this.init = function(){
			this.neutralcolor = this.bgcolor;
			this.neutrallinewidth = this.linewidth;
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
			this.updatecolor();
			if (this.focus){
			}
			else{
				this.find("flowgraph").setActiveConnection(undefined);
			}
		}
		
		
		this.mouseleftdown = function(){
			var fg = this.find("flowgraph");
			var performactivation = true;
			if (fg && this.screen.keyboard.shift) performactivation = fg.addToSelection(this);
			if (performactivation){
				this.find("flowgraph").setActiveConnection(this);
			}
		}
		
		this.mouseover = function(){
			this.over = true;
			this.updatecolor();
			
		}
		this.updateMove = function(){
			
		}
		this.setupMove = function(){
			
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
			snap:{type:int, value:1},
			bordercolor:{motion:"linear", duration: 0.1},
			focusbordercolor:{motion:"linear", duration: 0.1, type:vec4, value:"#f0f0c0", meta:"color"},
			fontsize:{type:float, value:12},
			inselection :{type:boolean, value:false}
		
		}
		
		this.inselection = function(){	
			if (this._inselection == 1) this.bordercolor = this.focusbordercolor;else this.bordercolor = this.neutralbordercolor;		
			this.redraw();
		}
		
		this.move = function(x,y)
		{
			var nx = this.pos[0] + x;
			var ny = this.pos[1] + y;
			console.log(nx,ny);
			if (nx<0) nx = 0;
			if (ny<0) ny = 0;
			this.pos = vec2(Math.round(nx),Math.round(ny));
			var fg = this.find("flowgraph")
			fg.setActiveBlock(this);
			fg.updateconnections();
		}
		
		this.keydownUparrow = function(){this.move(0,-1);}
		this.keydownDownarrow = function(){this.move(0,1);}
		this.keydownLeftarrow = function(){this.move(-1,0);}
		this.keydownRightarrow = function(){this.move(1,0);}
		this.keydownUparrowShift = function(){this.move(0,-10);}
		this.keydownDownarrowShift = function(){this.move(0,10);}
		this.keydownLeftarrowShift = function(){this.move(-10,0);}
		this.keydownRightarrowShift = function(){this.move(10,0);}
		
		this.keydownDelete = function(){
			var fg = this.find("flowgraph")
			fg.removeBlock(this);
		}
		
		this.keydown = function(v){			
			this.screen.defaultKeyboardHandler(this, v);
		}
		
		this.init = function(){
			this.neutralbordercolor = this.bordercolor;
			this.find("flowgraph").allblocks.push(this);	
		}
		
		this.destroy = function(){
			fg = this.find("flowgraph");
			if (fg){
				var index = fg.allblocks.indexOf(this);
				if (index > -1) fg.allblocks.splice(index, 1);
			}
		}
		
		this.focus = function(){
				if (this.focus){
//					this.bordercolor = this.focusbordercolor;
				}
				else{
	//				this.bordercolor = this.neutralbordercolor;
	//				this.find("flowgraph").setActiveBlock(undefined);
				}
		}
			
			
		this.setupMove = function(){
			this.startx = this.pos[0];
			this.starty = this.pos[1];
			
		}
		
		

		this.updateMove = function(dx, dy, snap){
			var x = Math.floor((this.startx+dx)/snap)*this.snap;
			var y = Math.floor((this.starty+dy)/snap)*this.snap;	

			this.pos = vec2(x,y);
			
		}
		
		this.mouseleftdown = function(p){
			var props = this.find("mainproperties");
			if (props) props.target = this.name;
			
			var	fg = this.find("flowgraph");
			var performactivation = true;
			
			if (!this.screen.keyboard.shift && !fg.inSelection(this)){
				fg.clearSelection();
			}
			if (this.screen.keyboard.shift && fg.inSelection(this)){
				fg.removeFromSelection(this);
				fg.updateSelectedItems();
		
				return;
			}
			fg.setActiveBlock(this);
			fg.updateSelectedItems();
			
			console.log("currentselection", fg.currentselection);
			
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
				label({text:this.title, bg:0, margin:4, fontsize: this.fontsize})
				,view({flexdirection:"row", alignitems:"stretch", bg:0}
					,button({icon:"plus", fontsize: this.fontsize})
					,button({icon:"plus", fontsize: this.fontsize})
				)
			]
		}
	})
	
	this.addToSelection = function(obj)
	{		
		var f = this.currentselection.indexOf(obj);
		if (f==-1) this.currentselection.push(obj);else return;
		
		console.log(this.currentselection);
		this.updateSelectedItems();
		if (this.currentselection.length > 1) return false;
		return true;
	}
	
	this.removeFromSelection = function(obj){
		if (this.currentblock == obj) 
		{
			this.currentblock = undefined;
			this.updatepopupuiposition();
		}
		console.log("before:", this.currentselection);
		var f = this.currentselection.indexOf(obj);
		if (f>-1) this.currentselection.splice(f,1);
		
		
		console.log("after:" , this.currentselection);
		this.updateSelectedItems();
		
	}
	
	this.updateSelectedItems = function(){
		for(var a in this.allblocks){
			var obj = this.allblocks[a];
			var f = this.currentselection.indexOf(obj);
			var newval = 0;
			if (f > -1) newval = 1;
			if (obj._inselection != newval) obj.inselection = newval;
		
		}
		this.updatepopupuiposition();
	}
	
	this.inSelection = function(obj){
		var f = this.currentselection.indexOf(obj);
		if (f > -1) return true;
		return false;		
	}
	
	this.setupSelectionMove = function(){
		for(var a in this.currentselection){
			var obj = this.currentselection[a];
			obj.setupMove();
		}		
	}

	this.moveSelected = function(dx, dy, snap){
		if (!snap) snap = 1;
		for(var a in this.currentselection){
			var obj = this.currentselection[a];
			obj.updateMove(dx,dy,snap);
		}
		this.updateconnections();
		this.updatepopupuiposition();

	}
	
	this.clearSelection = function(update){
		console.log("clearing selection");
		this.currentblock = undefined;
		this.currentconnection = undefined;
		this.currentselection = [];
		if (update) this.updateSelectedItems();
	}

		
	this.removeBlock = function (block){
		if (block == undefined) block = this.currentblock;
		if (block){
			console.log("TODO: removing block!", block);
			this.removeFromSelection(block);
			this.setActiveBlock(undefined);
		}
	}
	
	this.removeConnection = function (conn){
		if (conn == undefined) conn = this.currentconnection;
		if (conn){
			console.log("TODO: removing connection!", conn);
			this.removeFromSelection(conn);
			this.setActiveConnection(undefined);
		}
	}
	this.updatepopupuiposition = function(){
		var bg = this.findChild("blockui")
		var cg = this.findChild("connectionui")
		
		if (this.currentblock){
			bg.x = this.currentblock.pos[0];
			bg.y = this.currentblock.pos[1]-bg.layout.height;
		}
		else{
			bg.x = - bg.layout.width
			bg.y = - bg.layout.height
		}
		
		if (this.currentconnection){
			cg.x = (this.currentconnection.frompos[0] + this.currentconnection.topos[0])/2
			cg.y = (this.currentconnection.frompos[1] + this.currentconnection.topos[1])/2
		}else{
			cg.x = -cg.layout.width
			cg.y = -cg.layout.height	
		}
	}
	
	this.setActiveBlock = function(block){
		this.currentblock = block
		if ( block){
				this.addToSelection(block);
		}
		this.updatepopupuiposition();
	}
	this.setActiveConnection = function(conn){
		this.currentconnection = conn;
		if (conn){
			this.addToSelection(conn);								
		}
	
		this.updatepopupuiposition();
	}
	
	this.updateconnections = function(){
		var cl = this.find("connectionlayer");
		for(var a in cl.children){
			cl.children[a].layout = 1
		}
	}
	
	
	this.init = function(){
		
		this.currentselection = [];
		this.currentblock = undefined;
		this.currentconnection = undefined;		
		this.allblocks = [];
	
		this.model = dataset({children:[{name:"Role"},{name:"Server"}], name:"Composition"});	
		this.librarydata = dataset({children:[{name:"button" }, {name:"label"}, {name:"checkbox"}]});

		this.sourceset = sourceset(require('./index.js').module.factory.body.toString())

		this.screen.locationhash = function(event){
			//console.log(event.value);
		}
		//console.log(" hmm  ");
		
		// lets load the entire directory structure
		this.rpc.fileio.readAllPaths(['resources','server.js','resources','cache','@/\\.','.git', '.gitignore']).then(function(result){
			var filetree = this.find('filetree')
				var tree = result.value
				tree.collapsed = false
				// lets make a dataset
				//console.log(tree);
				
		}.bind(this))
	}
	
	this.layout = function(){
		//console.log("layout on flowgraph - attempting to arrange the connections");
		this.updateconnections();
	}	
	
	this.updateZoom = function(z){	
	}
	
	this.render = function(){
		return [
			this.menubar({})		
			,splitcontainer({}
				,splitcontainer({flex:0.3}
					,this.dockpanel({title:"Composition"}
						,treeview({flex:1, dataset: this.model})
					)
				)
				,this.dockpanel({title:"Patch", flowmeta:{x:0,y:0}, bg:0}
					,view({bg:1, bgcolor:"black", clearcolor:"black"  }
						,button({text:"add"   , margin:1, padding:3, borderradius:0, click:function(){console.log("add");    }})
						,button({text:"remove", margin:1, padding:3, borderradius:0, click:function(){console.log("remove"); }})
					)
					,cadgrid({name:"centralconstructiongrid", mouseleftdown: function(){this.clearSelection(true);}.bind(this),overflow:"scroll" ,bgcolor: "#101020",gridsize:5,majorevery:5,  majorline:"#202040", minorline:"#151530", zoom:function(){this.updateZoom(this.zoom)}.bind(this)}
						,view({name:"connectionlayer", bg:0}
							,this.connection({from:"phone", to:"tv"})
							,this.connection({from:"tablet", to:"thing"})
							,this.connection({from:"a", to:"b"})
							,this.connection({from:"b", to:"c"})
							,this.connection({from:"c", to:"d"})
							,this.connection({from:"a", to:"c"})
						)
						
						,view({name:"blocklayer", bg:0, layout:function(){
							//console.log("layout")
							}}
							,this.block({name:"phone", title:"Phone", x:200, y:20})
							,this.block({name:"tv", title:"Television", x:50, y:200})
							,this.block({name:"tablet", title:"Tablet",x:300, y:120})						
							,this.block({name:"thing", title:"Thing",x:500, y:120})						
							,this.block({name:"a", title:"block A", x:50, y:300})
							,this.block({name:"b", title:"block B", x:150, y:500})
							,this.block({name:"c", title:"block C", x:250, y:400})
							,this.block({name:"d", title:"block D", x:350, y:500})
							,this.block({name:"e", title:"block E", x:450, y:600})
							,this.block({name:"f", title:"block F", x:550, y:700})
						)
												
						,view({name:"popllayer", bg:0},

							view({name:"connectionui",x:-200,bgcolor:vec4(0,0,0,0.5),borderradius:8, borderwidth:2, bordercolor:"black",position:"absolute"},
								label({text:"connection", bg:0, margin:4})
								,button({padding:0, borderwidth:0, click:function(){this.removeConnection(undefined)},  icon:"remove",margin:4, fgcolor:"white", bg:0, fontsize:20 })
							)
							,view({name:"blockui",x:-200, bgcolor:vec4(0,0,0,0.5),borderradius:8, borderwidth:2, bordercolor:"black",position:"absolute"},
							//,view({name:"blockui",x:-200,bg:1,clearcolor:vec4(0,0,0,0),bgcolor:vec4(0,0,0,0),position:"absolute"},
								label({text:"block", bg:0, margin:4})
								,button({padding:0,borderwidth:0, click:function(){this.removeBlock(undefined)},fgcolor:"white", icon:"remove",margin:4, fgcolor:"white", bg:0, fontsize:20})
							)
						)
				
					)
				) 
				,splitcontainer({flex:0.5,direction:"horizontal"}
					,this.dockpanel({title:"Library", viewport:"2D" }
						,this.library({dataset:this.librarydata})
					)
					,this.dockpanel({title:"Properties", viewport:"2D"}
						,propviewer({flex:2,name:"mainproperties", target:"centralconstructiongrid", flex:1, overflow:"scroll"})		
					)	
				)
			)
		];
	}
});
	
	