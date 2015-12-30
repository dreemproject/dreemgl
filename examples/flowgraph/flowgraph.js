/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('$ui/view', function(require, 
		$ui$, view, icon, treeview, cadgrid, label, button, scrollbar, textbox, numberbox, splitcontainer, menubar,
		$widgets$, propviewer,searchbox,
		$server$, sourceset, dataset, $$, dockpanel, block, connection){

	this.name = 'flowgraph'
	this.flex = 1
	this.clearcolor = "#565656" 
	this.bgcolor = "#565656" 
	this.flexdirection = "column";
	this.attributes = {
		//fontsize: Config({type:float, value: 12, meta:"fontsize"}),
		sourceset: {}
	}
	
	this.style = {
		
	}
	
	define.class(this, "selectorrect", view, function(){
		//debugger
		this.bordercolorfn = function(pos){
			var check = (int(mod(0.20*(gl_FragCoord.x + gl_FragCoord.y + time*40.),2.)) == 1)? 1.0: 0.0
			return vec4(check * vec3(0.8), 1)
		}
		this.bordercolor = vec4(1, 1, 1, 0.4)
		this.borderwidth = 2
		this.bgcolor = vec4(1, 1, 1, 0.07)
		this.borderradius = 2
		this.position = "absolute"
		this.visible = false
	})
	
	define.class(this, "classlibclass", view, function($ui$, view, label, icon){
		this.attributes = {
			classdesc: Config({type:Object, value: undefined}),
			col1: Config({value:vec4("#454545"), persist:true, meta:"color", motion:"linear", duration:0.1}),
			col2: Config({value:vec4("#454545"), persist:true, meta:"color", motion:"linear", duration:0.2})
		}
		
		this.bg = {
			color: function(){
				var fill = mix(view.col1, view.col2,  (mesh.y)/0.8)
				return fill;
			}			
		}
		
		this.bg = 1
		this.margin = vec4(2,2,2,0)
		this.justifycontent = "flex-start"
		this.alignitems = "center"
		///this.aligncontent = "center"
		this.render = function(){
			return [
				//view({bgcolor:"#707070", width:30, height:30, borderwidth:1, borderradius:2, bordercolor:"#505050", margin:2, justifycontent:"center" }
				//	,icon({icon:"cube", fgcolor:this.fgcolor,margin:0,alignself:"center", fontsize:20})
				//)
				//,
				label({text:this.classdesc.name, margin:3,fgcolor:this.fgcolor, bg:0})
			]
		}
	})
	
	define.class(this, "libraryfolder", view, function($ui$, view, foldcontainer){
		
		this.attributes = {
			dataset:Config({type:Object}),
			//fontsize:Config({type:float, meta:"fontsize", value: 15})
		}
		this.flexwrap  = "nowrap" 
		
		this.flexdirection = "column" 
		this.fgcolor = "#f0f0f0"
		this.bgcolor = "#3a3a3a"

		this.render =function(){
			var data = this.dataset

			if (!this.dataset) return [];
					
			var res = [];
			for(var a  in data.children){
				var ds = data.children[a];
				if (!ds.children || ds.children.length == 0){
					res.push(this.outer.classlibclass({classdesc: ds, fgcolor:this.fgcolor}));
				}
			}
			
			return foldcontainer({title:data.name, basecolor:vec4("#303030"),padding:0,bordercolor:vec4("#3b3b3b"),icon:undefined},view({bg:0, flex:1,flexdirection:"column"},res));
		}
	})
	
	define.class(this, "library", function($ui$, view){
		this.flex = 1;
		this.attributes = {
			dataset:{},
//			fontsize:Config({type:float, meta:"fontsize", value: 15})
		}
		this.overflow = "scroll" 
		this.flexdirection = "column" 
		this.fgcolor = "#f0f0f0"
		this.bgcolor = "#3a3a3a"
		this.render =function(){
			var data = this.dataset.data
			if (!this.dataset) return [];
			
			var res = [];
			for(var a  in data.children){
				var ds = data.children[a];
				if (ds.children && ds.children.length > 0){			
						res.push(this.outer.libraryfolder({dataset: ds, fgcolor:this.fgcolor}));
					}
				}
			
			return res;
		}
	})
	
	this.addToSelection = function(obj){		
		var f = this.currentselection.indexOf(obj)
		if (f == -1) this.currentselection.push(obj)
		else return
		
		this.updateSelectedItems()

		if (this.currentselection.length > 1) return false;
		return true;
	}
	
	this.removeFromSelection = function(obj){
		if (this.currentblock == obj){
			this.currentblock = undefined
			this.updatepopupuiposition()
		}
		
		var f = this.currentselection.indexOf(obj)
		if (f>-1) this.currentselection.splice(f,1)
				
		this.updateSelectedItems()
	}
	
	this.updateSelectedItems = function(){
		for(var a in this.allblocks){
			var obj = this.allblocks[a]
			var f = this.currentselection.indexOf(obj)
			var newval = 0
			if (f > -1) newval = 1
			if (obj._inselection != newval) obj.inselection = newval
		}
		for(var a in this.allconnections){
			var obj = this.allconnections[a]
			var f = this.currentselection.indexOf(obj)
			var newval = 0
			if (f > -1) newval = 1
			if (obj._inselection != newval) obj.inselection = newval
		}
		this.updatepopupuiposition()
	}
	
	this.inSelection = function(obj){
		var f = this.currentselection.indexOf(obj)
		if (f > -1) return true
		return false
	}
	
	this.setupSelectionMove = function(){
		for(var a in this.currentselection){
			var obj = this.currentselection[a]
			obj.setupMove()
		}		
	}

	this.moveSelected = function(dx, dy, snap){
		if (!snap) snap = 1
		for(var a in this.currentselection){
			var obj = this.currentselection[a]
			obj.updateMove(dx, dy, snap)
		}
		this.updateconnections()
		this.updatepopupuiposition()
	}
	
	this.clearSelection = function(update){
		this.currentblock = undefined
		this.currentconnection = undefined
		this.currentselection = []
		if (update) this.updateSelectedItems()
	}

		
	this.removeBlock = function (block){
		if (block == undefined) block = this.currentblock
		if (block){
			console.log("TODO: removing block!", block)
			this.removeFromSelection(block)
			this.setActiveBlock(undefined)
			this.updateSelectedItems()
			this.updatepopupuiposition()
		}
	}
	
	this.removeConnection = function (conn){
		if (conn == undefined) conn = this.currentconnection
		if (conn){
			console.log("TODO: removing connection!", conn)
			this.removeFromSelection(conn)
			this.setActiveConnection(undefined)
			this.updateSelectedItems()
			this.updatepopupuiposition()
		}
	}
	
	this.updatepopupuiposition = function(){
		var bg = this.findChild("blockui")
		var cg = this.findChild("connectionui")
		var gg = this.findChild("groupui")
		var gbg = this.findChild("groupbg")
		
		if (this.currentselection.length == 1){

			gg.visible = false;
			gbg.visible = false;
			this.currentblock = undefined;			
			this.currentconnection = undefined;
			
			var b= this.currentselection[0];
			
			if (b instanceof block) this.currentblock = b;
			if (b instanceof connection) this.currentconnection  = b;
			
			if (this.currentblock){
				bg.x = this.currentblock.pos[0];
				bg.y = this.currentblock.pos[1]-bg.layout.height - 3;
				bg.visible = true;
			}
			else{
				bg.visible = false;					
			}
			
			if (this.currentconnection){
				cg.x = (this.currentconnection.frompos[0] + this.currentconnection.topos[0])/2
				cg.y = (this.currentconnection.frompos[1] + this.currentconnection.topos[1])/2
				cg.visible = true;
			}else{
				cg.visible = false;
			}

		}
		else{
			cg.visible = false;
			bg.visible = false;
			if (this.currentselection.length > 1)
			{
				gg.visible = true;
				gbg.visible = true;
				var minx = 10000;
				var maxx = -10000;
				var miny = 10000;
				var maxy = -10000;
				var cx = 0;
				var cy = 0;
				var n = 0;
				for(a in this.currentselection){
					var bl = this.currentselection[a];
					if (bl instanceof block){
						n++;
						if (bl.pos[0] < minx) minx = bl.pos[0];else if (bl.pos[0]>maxx) maxx = bl.pos[0];
						if (bl.pos[1] < miny) miny = bl.pos[1];else if (bl.pos[1]>maxy) maxy = bl.pos[1];
						
						var x2 = bl.pos[0] + bl.layout.width;
						var y2 = bl.pos[1] + bl.layout.height;
						if (x2 < minx) minx = x2;else if (x2>maxx) maxx = x2;
						if (y2 < miny) miny = y2;else if (y2>maxy) maxy = y2;


						cx += bl.pos[0] + bl.layout.width/2; 
						cy += bl.pos[1] + bl.layout.height/2;	
					}
					else{
						if (bl instanceof connection){
							var ax = bl.frompos[0];
							var ay = bl.frompos[1];
						             
							var bx = bl.topos[0];
							var by = bl.topos[1];
						
							if (ax > maxx) maxx = ax;else if (ax<minx) minx = ax;
							if (bx > maxx) maxx = bx;else if (bx<minx) minx = bx;
							if (ay > maxy) maxy = ay;else if (ay<miny) miny = ay;
							if (by > maxy) maxy = by;else if (by<miny) miny = by;
						
							cx += (ax+bx)/2;
							cy += (ay+by)/2;
							n++;
						}
					}
				}
				cx /= n;
				cy /= n;
				
				gg.pos = vec2(cx - cg.layout.width/2, cy - cg.layout.height/2)
				
				gbg.pos = vec2(minx-20,miny-20);
				gbg.size = vec2(maxx-minx + 40, maxy-miny+ 40);
				
			}
			else{
				gg.visible = false;
				gbg.visible = false;
			
			}
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
			cl.children[a].calculateposition()
			//cl.children[a].layout = 1
		}
	}
		
	this.init = function(){		
		this.currentselection = [];
		this.currentblock = undefined;
		this.currentconnection = undefined;		
		this.allblocks = [];
		this.allconnections = [];
	
		this.model = dataset({children:[{name:"Role"},{name:"Server"}], name:"Composition"});	
		this.librarydata = dataset({children:[]});

		this.sourceset = sourceset()
		
		this.rpc.fileio.readAllPaths(['resources','server.js','resources','cache','@/\\.','.git', '.gitignore']).then(function(result){
			var lib = this.find('thelibrary');
			var tree = result.value
			tree.name = 'Library'
			tree.collapsed = false
			lib.dataset = this.librarydata  = dataset(tree)
			
		}.bind(this))
				

		this.screen.locationhash = function(event){
			if(event.value.composition)
			require.async(event.value.composition).then(function(result){
				this.sourceset.parse(result.module.factory.body.toString())
			
				this.sourceset.stringify()
			}.bind(this))
		}.bind(this)

		this.rpc.fileio.readAllPaths(['resources','server.js','resources','cache','@/\\.','.git', '.gitignore']).then(function(result){
			var filetree = this.find('filetree')
				var tree = result.value
				tree.collapsed = false
				// lets make a dataset
				
		}.bind(this))
	}

	// right before the recalculateMatrix call
	this.atMatrix = function(){
		this.updateconnections();
	}	
	
	this.updateZoom = function(z){	
	}
	
	this.gridclick = function(p, origin){
		
		this.cancelconnection();
			var cg= this.find("centralconstructiongrid");
		
			origin.startselectposition = cg.localMouse();
			this.startdragselect();
			
			origin.mousemove = function(){				
				var cg= this.find("centralconstructiongrid");
				var np = cg.localMouse();
				var fg = this.find("flowgraph");
				var sq = this.findChild("selectorrect");
				if(sq){
					var sx = Math.min(this.startselectposition[0], np[0]);
					var sy = Math.min(this.startselectposition[1], np[1]);
					var ex = Math.max(this.startselectposition[0], np[0]);
					var ey = Math.max(this.startselectposition[1], np[1]);
					
					sq.visible = true;
					sq.redraw();
				
					sq.pos = vec2(sx,sy);
					sq.size = vec3(ex-sx, ey-sy, 1);
					fg.dragselectset = [];
					for(var a in fg.allblocks){
						var bl = fg.allblocks[a];
						
						cx = bl.pos[0] + bl.layout.width/2; 
						cy = bl.pos[1] + bl.layout.height/2;
						
						if (cx >= sx && cx <= ex && cy >= sy && cy <=ey) {
							bl.inselection = 1;
							fg.dragselectset.push(bl);
						}	
						else{
							if (fg.originalselection.indexOf(bl) >-1)
							{
								bl.inselection = 1;
							}
							else{
								bl.inselection = 0;
							}
						}					
					}					
					for(var a in fg.allconnections){
						var con = fg.allconnections[a];
						
						
						ax = con.frompos[0];
						ay = con.frompos[1];
						
						bx = con.topos[0];
						by = con.topos[1];
						
						
						cx = (ax+bx)/2;
						cy = (ay+by)/2;
						
						if ( (ax >= sx && ax <= ex && ay >= sy && ay <=ey)
								||
							(bx >= sx && bx <= ex && by >= sy && by <=ey)
							|| 
							(cx >= sx && cx <= ex && cy >= sy && cy <=ey)
							)
						 {
							con.inselection = 1;
							fg.dragselectset.push(con);
						}	
						else{
							if (fg.originalselection.indexOf(con) >-1)
							{
								con.inselection = 1;
							}
							else{
								con.inselection = 0;
							}
						}					
					}					
				} 					
			}
			
			origin.mouseleftup = function(){
				var sq = this.findChild("selectorrect");
				if (sq){
					sq.visible = false;
					sq.redraw();
				}
				fg = this.find("flowgraph");
				fg.commitdragselect();
				this.mousemove = function(){};
			}	
		
	}
	this.makenewconnection = function(){
		
		// DO CONNECTION HERE!
		console.log("making connection...");
		this.cancelconnection();
	}	
	
	this.cancelconnection = function(){
		
		console.log("cancelling exiting connection setup...");

		this.newconnectionsourceblock = undefined;
		this.newconnectionsourceoutput = undefined;
		
		this.newconnectiontargetblock = undefined;
		this.newconnectiontargetinput = undefined;				
		
		var connectingconnection = this.find("openconnector");
		if (connectingconnection && connectingconnection.visible) 
		{
			this.screen.globalmousemove = function(){};
			connectingconnection.from = undefined;
			connectingconnection.fromoutput  = undefined;
			connectingconnection.to = undefined;
			connectingconnection.toinput = undefined;
			connectingconnection.visible = false;
			connectingconnection.calculateposition();
			connectingconnection.redraw();
		}
	}
	
	this.setupconnectionmousemove = function(){
		console.log("setting up new connection drag...");

		var connectingconnection = this.find("openconnector");
		if (connectingconnection)
		{
			connectingconnection.visible = true;
			connectingconnection.from = this.newconnectionsourceblock;
			connectingconnection.fromoutput = this.newconnectionsourceoutput;
			connectingconnection.to = this.newconnectiontargetblock;
			connectingconnection.toinput = this.newconnectiontargetinput;

			console.log(this.newconnectionsourceblock,this.newconnectionsourceoutput,this.newconnectiontargetblock,this.newconnectiontargetinput);
			
			if (connectingconnection.to && connectingconnection.to !== "undefined" && connectingconnection.to.length>0){
				console.log("setting to??", connectingconnection.to);
				var b = this.find(connectingconnection.to);
				if (b){
					var ball = b.findChild(connectingconnection.toinput);				
					connectingconnection.bgcolor = ball.bgcolor;
				}
			}
			else{
				if(connectingconnection.from && connectingconnection.from !== "undefined"&& connectingconnection.from.length>0){
					console.log(connectingconnection.from);
					var b = this.find(connectingconnection.from);
					if(b){
						var ball = b.findChild(connectingconnection.fromoutput);				
						connectingconnection.bgcolor = ball.bgcolor;
					}
				}				
			}
			connectingconnection.calculateposition();
			this.screen.globalmousemove = function(){
				connectingconnection.calculateposition();	
				connectingconnection.redraw();
			}
		}
	}
	
	this.setconnectionstartpoint = function(sourceblockname, outputname){		
		this.newconnectionsourceblock = sourceblockname;
		this.newconnectionsourceoutput = outputname;
		if (this.newconnectiontargetblock && this.newconnectiontargetblock !== "undefined" ){
			this.makenewconnection();
		}
		else{
			this.setupconnectionmousemove();
		}
	}
	
	this.setconnectionendpoint = function(targetblockname, inputname){		
		this.newconnectiontargetblock = targetblockname;
		this.newconnectiontargetinput = inputname;
		if (this.newconnectionsourceblock && this.newconnectionsourceblock !== "undefined" ){
			this.makenewconnection();
		}
		else{
			this.setupconnectionmousemove();
		}			
	}
	
	this.startdragselect = function(){
		this.dragselectset = [];
		if (!this.screen.keyboard.shift){
			this.clearSelection(true);
		}
		this.originalselection =[];
		for(var i in this.currentselection){
			this.originalselection.push(this.currentselection[i]);
		}
	}
	
	this.renderConnections = function(){
		if (!this.sourceset) return;
		if (!this.sourceset.data) return;
		var res = [];		
		return res;
	}
	
	this.renderBlocks = function(){
		var res = [];
		if (!this.sourceset) return;
		if (!this.sourceset.data) return;

		for(var a in this.sourceset.data.children){
			var topnode = this.sourceset.data.children[a];
			res.push(block({title:topnode.name}))
		}
		return res;
	}
	
	this.commitdragselect = function(){
		for(var i in this.dragselectset){
			var bl = this.dragselectset[i];
			this.addToSelection(bl);
		}
		this.updatepopupuiposition();
		
	}
		
	this.render = function(){
		return [
			menubar({})		
			,splitcontainer({}
				,splitcontainer({flex:0.3, flexdirection:"column", direction:"horizontal"}
					,dockpanel({title:"Composition" }
						,searchbox()
						
						,treeview({flex:1, dataset: this.sourceset})
					)
					,dockpanel({title:"Library", viewport:"2D" }
						,searchbox()
						,this.library({name:"thelibrary", dataset:this.librarydata})
					)

				)
					,thegrid = cadgrid({name:"centralconstructiongrid", mouseleftdown: function(p){this.gridclick(p, thegrid);}.bind(this),overflow:"scroll" ,bgcolor: "#3b3b3b",gridsize:5,majorevery:5,  majorline:"#474747", minorline:"#383838", zoom:function(){this.updateZoom(this.zoom)}.bind(this)}
						,view({name:"underlayer", bg:0}
							,view({name:"groupbg",visible:false, bgcolor: vec4(1,1,1,0.08) , borderradius:8, borderwidth:0, bordercolor:vec4(0,0,0.5,0.9),position:"absolute", flexdirection:"column"})							
						)
						,view({name:"connectionlayer", bg:false, dataset: this.sourceset, arender:function(){
							return this.renderConnections();
						}.bind(this)}
							,connection({from:"phone", to:"tv",fromoutput:"output 1" , toinput:"input 1" })
							,connection({from:"tablet", to:"thing",fromoutput:"output 1" , toinput:"input 2" })
							,connection({from:"a", fromoutput:"output 1",  to:"b", toinput:"input 2" })
							,connection({from:"b", fromoutput:"output 2", to:"c", toinput:"input 1" })
							,connection({from:"c", fromoutput:"output 1", to:"d", toinput:"input 1" })
							,connection({from:"a", fromoutput:"output 2", to:"c", toinput:"input 2" })
						)
						,view({bg:false}, connection({name:"openconnector", hasball: false, visible:false}))
						,view({name:"blocklayer", bg:0,  dataset: this.sourceset, arender:function(){
							return this.renderBlocks();
						}.bind(this)}
							,block({name:"phone", title:"Phone", x:200, y:20})
							,block({name:"tv", title:"Television", x:50, y:200})
							,block({name:"tablet", title:"Tablet",x:300, y:120})						
							,block({name:"thing", title:"Thing",x:500, y:120})						
							,block({name:"a", title:"block A", x:50, y:300})
							,block({name:"b", title:"block B", x:150, y:500})
							,block({name:"c", title:"block C", x:250, y:400})
							,block({name:"d", title:"block D", x:350, y:500})
							,block({name:"e", title:"block E", x:450, y:600})
							,block({name:"f", title:"block F", x:550, y:700})
						)
												
						,view({name:"popuplayer", bg:false},
							view({name:"connectionui",visible:false,bgcolor:vec4(0.2,0.2,0.2,0.5),padding:5, borderradius:vec4(1,14,14,14), borderwidth:1, bordercolor:"black",position:"absolute", flexdirection:"column"},
								label({text:"Connection", bg:0, margin:4})
								,button({padding:0, borderwidth:0, click:function(){this.removeConnection(undefined)}.bind(this),  icon:"remove",text:"delete", margin:4, fgcolor:"white", bg:0 })
							)
							,view({name:"blockui",visible:false, bgcolor:vec4(0.2,0.2,0.2,0.5),padding:5, borderradius:vec4(10,10,10,1), borderwidth:2, bordercolor:"black",position:"absolute", flexdirection:"column"},
							//,view({name:"blockui",x:-200,bg:1,clearcolor:vec4(0,0,0,0),bgcolor:vec4(0,0,0,0),position:"absolute"},
								label({text:"Block", bg:0, margin:4})
								,button({padding:0,borderwidth:0, click:function(){this.removeBlock(undefined)}.bind(this),fgcolor:"white", icon:"remove",text:"delete", margin:4, fgcolor:"white", bg:0})
							)
							,view({name:"groupui",visible:false, bgcolor:vec4(0.2,0.2,0.2,0.5),borderradius:8, borderwidth:2, bordercolor:"black",position:"absolute", flexdirection:"column"},
							//,view({name:"blockui",x:-200,bg:1,clearcolor:vec4(0,0,0,0),bgcolor:vec4(0,0,0,0),position:"absolute"},
								label({text:"Group", bg:0, margin:4})
								,button({padding:0,borderwidth:0, click:function(){this.removeBlock(undefined)}.bind(this),fgcolor:"white", icon:"remove",text:"delete", margin:4, fgcolor:"white", bg:0})
							)
							,this.selectorrect({name:"selectorrect"})							
						)
					)
				
				,splitcontainer({flex:0.5,direction:"horizontal"}
					,dockpanel({title:"Properties", viewport:"2D"}
						,propviewer({flex:2,name:"mainproperties", target:"centralconstructiongrid", flex:1, overflow:"scroll"})		
					)	
				)
			)
		];
	}
});
	
	