/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require, 
		$ui$, view, icon, treeview, cadgrid, label, button, scrollbar, textbox, numberbox, splitcontainer,
		$widgets$, propviewer,
		$server$, sourceset, dataset, $$, dockpanel, block, connection){

	this.flex = 1
	this.attributes = {
		fontsize: Config({type:float, value: 12, meta:"fontsize"})
	}
	
	define.class(this, "menubar", function($ui$, view){
	})
		
	define.class(this, "classlibclass", function($ui$, view, icon){
		this.attributes = {
			classdesc: Config({type:Object, value: undefined}),
			col1: Config({value:vec4("#454545"),persist:true, meta:"color", motion:"linear", duration:0.1}),
			col2: Config({value:vec4("#454545"),persist:true, meta:"color", motion:"linear", duration:0.2})
		}
		
		this.bg = {
			color: function(){	
				var fill = mix(view.col1, view.col2,  (mesh.y)/0.8)
				return fill;
			}			
		}
		
		this.bg = 1; 
		this.margin = vec4(2,2,2,0);
		this.justifycontent= "flex-start";
		this.alignitems = "center"
		///this.aligncontent = "center"
		this.render = function(){
			return [
				view({bgcolor:"#3b3b3b", width:40, height:40, borderwidth:1, borderradius:2, bordercolor:"#505050", margin:5}
				,icon({icon:"flask", margin:4, fgcolor:this.fgcolor})
			)
			,label({text:this.classdesc.name, margin:8,fgcolor:this.fgcolor, bg:0, fontsize:this.fontsize})
			]
		}
	})
	
	define.class(this, "library", function($ui$, view){
		this.flex = 1;
		this.attributes = {
			dataset:Config({type:Object}),
			fontsize:Config({type:float, meta:"fontsize", value: 15})
		}
		this.flexdirection = "column" 
		this.fgcolor = "#f0f0f0"
		this.bgcolor = "#3a3a3a";
		this.render =function(){
			var data = this.dataset.data
			if (!this.dataset) return [];
			
			var res = [];
			for(var a  in data.children){
				var ds = data.children[a];
				res.push(this.outer.classlibclass({classdesc: ds, fgcolor:this.fgcolor, fontsize: this.fontsize}));
			}
			
			return res;
		}
	})
	
	this.addToSelection = function(obj){		
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
		for(var a in this.allconnections){
			var obj = this.allconnections[a];
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
			 this.updateSelectedItems();
			 this.updatepopupuiposition();
		}
	}
	
	this.removeConnection = function (conn){
		if (conn == undefined) conn = this.currentconnection;
		if (conn){
			console.log("TODO: removing connection!", conn);
			this.removeFromSelection(conn);
			this.setActiveConnection(undefined);
			 this.updateSelectedItems();
			 this.updatepopupuiposition();
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
			this.currentconnection = undefined;
				this.addToSelection(block);
		}
		this.updatepopupuiposition();
	}
	this.setActiveConnection = function(conn){
		this.currentconnection = conn;
		
		if (conn){
			this.currentblock = undefined;
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
		this.allconnections = [];
	
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
				
		}.bind(this))
	}
	
	this.layout = function(){
		this.updateconnections();
	}	
	
	this.updateZoom = function(z){	
	}
	
	this.gridclick = function(p, origin){
		if(this.screen.keyboard.shift){
		}
		else{
			this.clearSelection(true);
		
			origin.startselectposition = origin.localMouse();
			
			origin.mousemove = function(){				
				var np = this.localMouse();
				fg = this.find("flowgraph");
				sq = this.findChild("selectorrect");
				if(sq){
					var sx = Math.min(this.startselectposition[0], np[0]);
					var sy = Math.min(this.startselectposition[1], np[1]);
					var ex = Math.max(this.startselectposition[0], np[0]);
					var ey = Math.max(this.startselectposition[1], np[1]);
					
					sq.visible = true;
					sq.redraw();
				
					sq.pos = vec2(sx,sy);
					sq.size = vec3(ex-sx, ey-sy, 1);
					for(var a in fg.allblocks){
						var bl = fg.allblocks[a];
						
						cx = bl.pos[0] + bl.layout.width/2; 
						cy = bl.pos[1] + bl.layout.height/2;
						
						if (cx >= sx && cx <= ex && cy >= sy && cy <=ey) {
							bl.inselection = 1;
						}	
						else{
							bl.inselection = 0;
						}
						
					}
					
				} 
			}
			
			origin.mouseleftup = function(){
				sq.visible = false;
				sq.redraw();
				this.mousemove = function(){};
			}
			
			
		}
	}
	
	this.render = function(){
		return [
			this.menubar({})		
			,splitcontainer({}
				,splitcontainer({flex:0.3}
					,dockpanel({title:"Composition" , fontsize:this.fontsize}
						,treeview({flex:1, dataset: this.sourceset, fontsize:this.fontsize})
					)
				)
				,dockpanel({title:"Patch", flowmeta:{x:0,y:0}, bg:0, fontsize:this.fontsize}
					,view({bg:1, bgcolor:"black", clearcolor:"black"  }
						,button({text:"add"   , click:function(){console.log("add");    }, fontsize:this.fontsize})
						,button({text:"remove", click:function(){console.log("remove"); }, fontsize:this.fontsize})
					)
					,thegrid = cadgrid({name:"centralconstructiongrid", mouseleftdown: function(p){this.gridclick(p, thegrid);}.bind(this),overflow:"scroll" ,bgcolor: "#3b3b3b",gridsize:5,majorevery:5,  majorline:"#474747", minorline:"#373737", zoom:function(){this.updateZoom(this.zoom)}.bind(this)}
						,view({name:"connectionlayer", bg:0}
							,connection({from:"phone", to:"tv"})
							,connection({from:"tablet", to:"thing"})
							,connection({from:"a", to:"b"})
							,connection({from:"b", to:"c"})
							,connection({from:"c", to:"d"})
							,connection({from:"a", to:"c"})
						)
						
						,view({name:"blocklayer", bg:0}
							,block({name:"phone", title:"Phone", x:200, y:20, fontsize:this.fontsize})
							,block({name:"tv", title:"Television", x:50, y:200, fontsize:this.fontsize})
							,block({name:"tablet", title:"Tablet",x:300, y:120, fontsize:this.fontsize})						
							,block({name:"thing", title:"Thing",x:500, y:120, fontsize:this.fontsize})						
							,block({name:"a", title:"block A", x:50, y:300, fontsize:this.fontsize})
							,block({name:"b", title:"block B", x:150, y:500, fontsize:this.fontsize})
							,block({name:"c", title:"block C", x:250, y:400, fontsize:this.fontsize})
							,block({name:"d", title:"block D", x:350, y:500, fontsize:this.fontsize})
							,block({name:"e", title:"block E", x:450, y:600, fontsize:this.fontsize})
							,block({name:"f", title:"block F", x:550, y:700, fontsize:this.fontsize})
						)
												
						,view({name:"popuplayer", bg:0},
							view({name:"connectionui",x:-200,bgcolor:vec4(0,0,0,0.5),borderradius:8, borderwidth:2, bordercolor:"black",position:"absolute"},
								label({text:"connection", bg:0, margin:4, fontsize:this.fontsize})
								,button({padding:0, borderwidth:0, fontsize:this.fontsize, click:function(){this.removeConnection(undefined)}.bind(this),  icon:"remove",margin:4, fgcolor:"white", bg:0, fontsize:this.fontsize })
							)
							,view({name:"blockui",x:-200, bgcolor:vec4(0,0,0,0.5),borderradius:8, borderwidth:2, bordercolor:"black",position:"absolute"},
							//,view({name:"blockui",x:-200,bg:1,clearcolor:vec4(0,0,0,0),bgcolor:vec4(0,0,0,0),position:"absolute"},
								label({text:"block", bg:0, margin:4, fontsize:this.fontsize})
								,button({padding:0,borderwidth:0, fontsize:this.fontsize, click:function(){this.removeBlock(undefined)}.bind(this),fgcolor:"white", icon:"remove",margin:4, fgcolor:"white", bg:0, fontsize:this.fontsize})
							),view({name:"selectorrect", bordercolor:vec4(1,1,1,0.4),borderwidth:2,bgcolor:vec4(1,1,1,0.07) ,borderradius:2, position:"absolute" , width:10,height:10,x:-21,y:-21})
						)
					)
				) 
				,splitcontainer({flex:0.5,direction:"horizontal"}
					,dockpanel({title:"Library", viewport:"2D", fontsize:this.fontsize }
						,this.library({dataset:this.librarydata, fontsize:this.fontsize})
					)
					,dockpanel({title:"Properties", viewport:"2D", fontsize:this.fontsize}
						,propviewer({flex:2,name:"mainproperties", target:"centralconstructiongrid", flex:1, overflow:"scroll", fontsize:this.fontsize})		
					)	
				)
			)
		];
	}
});
	
	