//Pure JS based composition

//C:\Projects\dgl3\dreemgl>node server.js -path map:<path>


define.class('$server/composition', function vectormap(require,  $server$, fileio,$ui$, numberbox, button, menubar, label, screen, view, foldcontainer, speakergrid,checkbox, icon, $widgets$, colorpicker,  jsviewer, radiogroup){
	
	this.attributes = {
	
	}	
	
	define.class(this, "mainscreen", function($ui$, view){		
	
	
		this.attributes = {
			mapxcenter: Math.floor(19296/2),
			mapycenter: Math.floor(24641/2),
			zoomlevel: 15
			
		}
		
		define.class(this, "debugmaptile", function($ui$, view, label){
			this.attributes = {
				tilex:19295,
				tiley:24641,
				zoomlevel: 14
			}
			this.padding =10;
			this.width = 1024;
			this.height = 1024;
			this.position="absolute" 
			this.borderwidth = 10;
			this.bgcolor = "gray";
			this.bordercolor = "lightblue" 
			this.borderradius = 0.1;
			this.justifycontent = "flex-start" 
			this.render =function(){
					return [label({fontsize: 40,alignself:"flex-start",bg:0,text:"x: " + this.tilex + " y: " + this.tiley + " zoomlevel: " + this.zoomlevel})]
			}
		})
	
		this.setZoomLevel = function(z, width, height){
			//console.log(z, width, height);
			
			var x = Math.ceil((width * z )/ 1024);
			var y = Math.ceil((height * z )/ 1024);
			//console.log(x,y);
			//console.log(z, Math.floor(log(z)/log(2)));
		//	this.zoomlevel = 16  + Math.floor( log(z)/log(2));
		}
		
		this.render = function(){
		//console.log(	this.screen.width);
			var res = []
			var scalefac = Math.pow(2, this.zoomlevel - 16);
			var scaler = 1024 ;//* scalefac;
			console.log("scaler:", scaler);
			for(var x = 0;x<6;x++){
				for(var y = 0;y<6;y++){
					res.push(this.maptile(
						{
							name:"tile1",
							tilex: this.mapxcenter + x, 
							tiley: this.mapycenter + y,
							position:"absolute", 
							x: x * scaler , 
							y: y * scaler   ,
							scalefac: scalefac,
							//width: scaler,
							//height: scaler,
							zoomlevel: this.zoomlevel
						}
					))
				
				}
			}
			return res;
		}
		
		define.class(this, "maptile", function($ui$, view){
			var earcut = require('$system/lib/earcut-port.js')().earcut;
		
			this.attributes = {
				tilex:19295,
				tiley:24641,
				zoomlevel: 16,
				arcs:[], 
				buildings:[],
				roads:[],
				waters:[], 
				earths:[], 
				landuses:[]	, 
				scalefactor: 1.0
			}
			
			this.init = function(){
				console.log("init maptile");
				
				this.rpc.urlfetch.grabmap(this.tilex, this.tiley, this.zoomlevel).then(function(result){
					this.loadstring(result.value)
				}.bind(this));
				
					
			}
			
			define.class(this, "building", function($ui$, view){
				
				this.attributes = {				
					buildings:[],
					scalefactor: 1.0
				}
				this.boundscheck = false;
				this.NOTmouseover =  function(){
					var text = "";
					if (this.building.name) text += this.building.name;
					if (this.building.street) text += " " + this.building.street;
					if (this.building.housenumber) text += " " + this.building.housenumber;				
					this.screen.status = text;
				}
				
				
				this.bg = function(){
					
					
					this.vertexstruct =  define.struct({		
						pos:vec2,
						color:vec4
					})
					this.mesh = this.vertexstruct.array();
					this.color = function(){
						//return mesh.color;
						var sizer = 0.7
						return mesh.color;
//						return mix("#f0f0a0", mesh.color, 1.0-min(pow(0.5 + 0.5 *sin((gl_FragCoord.x + gl_FragCoord.y)*sizer),0.2),pow((0.5 + 0.5 *sin((-gl_FragCoord.x + gl_FragCoord.y)*sizer)),0.2)));

					}
			
					this.update = function(){
						this.mesh = this.vertexstruct.array();
						
						for(var i = 0;i<this.view.buildings.length;i++){
							var building = this.view.buildings[i];
							if (building.arcs)
							for(var j = 0;j<building.arcs.length;j++){
								var arc = building.arcs[j];
								var tris = arctotriangles(arc);
								for(var a = 0;a<tris.length;a++){
									var c = 0.3;
									this.mesh.push(tris[a], vec4(c,c,c, 1));
								}
							}
							
						}
					}
					
					this.position = function(){					
						return vec4(mesh.pos.x, 1000-mesh.pos.y, 0, 1) * view.totalmatrix * view.viewmatrix
					}
					
				this.drawtype = this.TRIANGLES
				this.linewidth = 4;
				
				}
				
							
			})
			
			define.class(this, "water", function($ui$, view){
				
				this.boundscheck = false;
				
				this.attributes = {		
					water:{}
				}
				
				this.mouseover =  function(){
					var text = "Water!";				
					this.screen.status = text;	
				}
				
				this.render = function(){
					var res = [];
					for (var i =0;i<this.water.arcs.length;i++){
						res.push(this.outer.waterpolygon({arc:this.water.arcs[i], color:vec4("lightblue") }));
					}
					return res;
				};			
			})
		
			define.class(this, "land", function($ui$, view){
				this.boundscheck = false;
				this.attributes = {				
					lands:[]
				}
				
				this.mouseover =  function(evt){
					var text = "Land: " + this.lands[evt.pickid].kind;				
					this.screen.status = text;				
				}			
				
				
				this.onlands = function(){
					this.pickrange = this.lands.length;
				}
				
				this.bg = function(){
				
					this.color1 = {pedestrian:"lightgray", parking:"gray", park:"lime", earth:"lime", pier:"#404040", "rail" : vec4("purple"), "minor_road": vec4("orange"), "major_road" : vec4("red"), highway:vec4("black")}
					this.color2 = {pedestrian:"yellow", parking:"lightgray", park:"yellow", earth:"green", pier:"gray", "rail" : vec4("purple"), "minor_road": vec4("orange"), "major_road" : vec4("red"), highway:vec4("black")}
					
						
					this.vertexstruct =  define.struct({		
						pos:vec2,
						color1:vec4,
						color2:vec4, 
						id: float
					})
					
					this.mesh = this.vertexstruct.array();
					this.pick = function(){
						return mesh.id;
					}
					this.color = function(){
						
						var xy = vec2(gl_FragCoord.xy)*0.2;
						var n1 = (noise.noise2d(xy))*0.25 + 0.25;
						var n2 = 0.8*noise.noise2d(xy*14.3)
						return mix(mesh.color1, mesh.color2,n1+n2);

						
					}
			
					this.update = function(){
						this.mesh = this.vertexstruct.array();
						
						for(var i = 0;i<this.view.lands.length;i++){
							var land = this.view.lands[i];
							
							var color1 = vec4("green");
							var color2 = vec4("lime");
							
							if (this.color1[land.kind]) color1 = this.color1[land.kind];else console.log("unknown land type:", land.kind);
							if (this.color2[land.kind]) color2 = this.color2[land.kind];else console.log("unknown land type:", land.kind);
						
							if (land.arcs){
								for(var j = 0;j<land.arcs.length;j++){
									var arc = land.arcs[j];
									var tris = arctotriangles(arc);
									for(var a = 0;a<tris.length;a++){
										this.mesh.push(tris[a], vec4(color1), vec4(color2), i);
									}
								}
							}
						}
					}
					
					this.position = function(){					
						return vec4(mesh.pos.x, 1000-mesh.pos.y, 0, 1) * view.totalmatrix * view.viewmatrix
					}
						
					this.drawtype = this.TRIANGLES
					this.linewidth = 4;
					
				}
					
							
			})
			
			define.class(this, "road", function($ui$, view){
				this.boundscheck = false;
				
				this.attributes = {
					
					road:{}
				}
				this.widths = {path:2,ferry:4, "rail" : 5, "minor_road": 4, "major_road" : 10, path: 3, highway:12}
				this.colors = {path:"brown", ferry:"lightblue", "rail" : vec4("purple"), "minor_road": vec4("#505050"), "major_road" : vec4("#404040"), highway:vec4("#303030")}
				this.render = function(){
						
					var res = [];
					for (var i =0;i<this.road.arcs.length;i++){
						
						var width = 3;
						var color = vec4("gray") 
						if (this.widths[this.road.kind]) width = this.widths[this.road.kind];
						if (this.colors[this.road.kind]) color = this.colors[this.road.kind];
						res.push(this.outer.linestring({linewidth: width, arc:this.road.arcs[i], color:color}));
					}
					return res;
				};
				
			})
					
			function arctotriangles(arc){
				var verts = [];
				var flatverts = [];
				var A0 = arc[0];
				var nx = A0[0];
				var ny = A0[1];
	//			verts.push(A0);
				flatverts.push(nx);
				flatverts.push(ny);
				for (var i =1 ;i<arc.length;i++){
					var A = arc[i];
					nx +=  A[0];
					ny +=  A[1];
			//		verts.push(vec2(nx,ny));
					flatverts.push(nx);
					flatverts.push(ny);
				}
				
				var triangles = earcut(flatverts);
				
				for(var i = 0;i<triangles.length;i++){
					idx = triangles[i];
					verts.push(vec2(flatverts[idx*2],flatverts[idx*2 + 1]));
				}
				return verts;
				
			}
		
			define.class(this, "arc", function($ui$, view){
				this.boundscheck = false;
				
				this.attributes = {
					arc:[],
					color:vec4("red")
				}
				this.bg = function(){
					
					
					this.vertexstruct =  define.struct({		
						pos:vec2,
						color:vec4
					})
					this.mesh = this.vertexstruct.array();
						this.color = function(){
					return mesh.color;
				}
			
					this.update = function(){
						this.mesh = this.vertexstruct.array();
						
						var tris = arctotriangles(this.view.arc);
						
						for(var a = 0;a<tris.length;a++){
							this.mesh.push(tris[a], this.view.color);
						}
						
					}
					
					this.position = function(){					
						return vec4(mesh.pos.x, 1000-mesh.pos.y, 0, 1) * view.totalmatrix * view.viewmatrix
					}
					
				this.drawtype = this.TRIANGLES
				this.linewidth = 4;
				
				}
			});
			
			define.class(this, "waterpolygon", function($ui$, view){
				this.boundscheck = false;
				
				this.time = 0;
				
				this.attributes = {
					arc:[],
					color:vec4("red")
				}
				
				this.bg = function(){
									
					this.vertexstruct =  define.struct({		
						pos:vec2,
						color:vec4
					})
					
					this.mesh = this.vertexstruct.array();
					this.color = function(){
						//var xy = vec2(gl_FragCoord.xy);
						//var n1 = noise.noise2d(xy*0.5)*0.2+0.2;
						return "#78b0d3";
					}
				
					this.update = function(){
						this.mesh = this.vertexstruct.array();
						
						var tris = arctotriangles(this.view.arc);
						
						for(var a = 0;a<tris.length;a++){
							this.mesh.push(tris[a], this.view.color);
						}
						
					}
					
					this.position = function(){					
						return vec4(mesh.pos.x, 1000-mesh.pos.y, 0, 1) * view.totalmatrix * view.viewmatrix
					}
					
				this.drawtype = this.TRIANGLES
				this.linewidth = 4;
				
				}
			});
			
			define.class(this, "landpolygon", function($ui$, view){
				this.boundscheck = false;
				
				this.time = 0;
				this.attributes = {
					arc:[],
					color1:vec4("red"),
					color2: vec4("green")
				}
				this.bg = function(){
					
					
					this.vertexstruct =  define.struct({		
						pos:vec2,
						color:vec4
					})
					this.mesh = this.vertexstruct.array();
					this.color = function(){
						var xy = vec2(gl_FragCoord.xy)*0.2;
						var n1 = (noise.noise2d(xy))*0.25 + 0.25;
						var n2 = 0.5*noise.noise2d(xy*14.3)
						return mix(view.color1, view.color2,n1+n2);
					}
				
					this.update = function(){
						this.mesh = this.vertexstruct.array();
						
						var tris = arctotriangles(this.view.arc);
						
						for(var a = 0;a<tris.length;a++){
							this.mesh.push(tris[a], this.view.color);
						}
						
						
					}
					
					this.position = function(){					
						return vec4(mesh.pos.x, 1000-mesh.pos.y, 0, 1) * view.totalmatrix * view.viewmatrix
					}
					
				this.drawtype = this.TRIANGLES
				this.linewidth = 4;
				
				}
			});

			define.class(this, "linestring", function($ui$, view){
				this.boundscheck = false;
				
				this.attributes = {
					arc:[],
					color:vec4("red"), linewidth: 10.0
				}
				
				this.bg = function(){		
					this.vertexstruct =  define.struct({		
						pos:vec2,
						color:vec4,
						side: float, 
						dist: float
					})
					
					this.mesh = this.vertexstruct.array();
					this.color = function(){
						if (abs(mesh.side) > 0.85) return mix("black", mesh.color, 0.8)
						if (abs(mesh.side) > 0.75) return mix("#f0f0f0", mesh.color, 0.6)
						if (abs(mesh.side) < 0.1) return  mix("#f0f0f0", mesh.color, 0.6 * (min(1., max(0.0,0.8 + 5.0*sin(mesh.dist*0.5)))))
						return mesh.color;
					}
			
					this.update = function(){
						this.mesh = this.vertexstruct.array();
						var A0 = this.view.arc[0];
						//this.mesh.push(A0[0], A0[1], this.view.color);
						var nx = A0[0];
						var ny = A0[1];
						var dist = 0;
						for(var a = 1;a<this.view.arc.length;a++){					
							var A = this.view.arc[a];
							var tnx = nx + A[0];
							var tny = ny + A[1];
							var predelt = vec2( tnx - nx, tny - ny);
							var delta = vec2.normalize(predelt);
							var sdelta = vec2.rotate(delta, PI/2);
							
							this.mesh.push(nx+ sdelta[0]*this.view.linewidth,ny+ sdelta[1]*this.view.linewidth, this.view.color,1, dist);
							this.mesh.push(nx- sdelta[0]*this.view.linewidth,ny- sdelta[1]*this.view.linewidth, this.view.color,-1, dist);
							
							dist += vec2.len(predelt);
							
							this.mesh.push(tnx+ sdelta[0]*this.view.linewidth,tny+ sdelta[1]*this.view.linewidth, this.view.color,1,dist);
							this.mesh.push(tnx- sdelta[0]*this.view.linewidth,tny- sdelta[1]*this.view.linewidth, this.view.color,-1, dist);
													
							nx = tnx;
							ny = tny;
						}
					}
					
					this.position = function(){					
						return vec4(mesh.pos.x, 1000-mesh.pos.y, 0, 1) * view.totalmatrix * view.viewmatrix
					}
					
					this.drawtype = this.TRIANGLE_STRIP
					this.linewidth = 4;		
				}
			});
			
			this.loadurl = function(x,y,z){	
				//http://vector.mapzen.com/osm/{layers}/{z}/{x}/{y}.{format}?api_key=vector-tiles-Qpvj7U4
				//console.log("grabbing", x,y,z);
				
				var res = this.rpc.urlfetch.grabmap(x,y,z).then(function(result){
					console.log(result.value);
				})			
			}
			
			this.loadstring = function(str){
				this.thedata = JSON.parse(str);	
					
					var Aset = [];					
					var Bset = [];
					var Rset = [];
					var Wset = [];
					var Eset = [];
					var Lset = [];
					//console.log(this.thedata);
					for (var i = 0;i<this.thedata.objects.buildings.geometries.length;i++){
						var Bb = this.thedata.objects.buildings.geometries[i];
						var B = {h:Bb.properties.height, name:Bb.properties.name, street: Bb.properties["addr_street"], housenumber: Bb.properties.addr_housenumber, arcs:[]};
							if (Bb.arcs){
								for(var k = 0;k<Bb.arcs.length;k++){
								B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);
							}
						}
						Bset.push(B);
					}
					
					for (var i = 0;i<this.thedata.objects.water.geometries.length;i++){
						var Bb = this.thedata.objects.water.geometries[i];
						var B = {arcs:[]};
						if(Bb.arcs)
							for(var k = 0;k<Bb.arcs.length;k++){
								B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);
							
						}
						Wset.push(B);
					}
					
					for (var i = 0;i<this.thedata.objects.earth.geometries.length;i++){
						var Bb = this.thedata.objects.earth.geometries[i];
						var B = {arcs:[], kind:"earth"};
							for(var k = 0;k<Bb.arcs.length;k++){
								B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);
							
						}
						Eset.push(B);
					}
					
					for (var i = 0;i<this.thedata.objects.landuse.geometries.length;i++){
						var Bb = this.thedata.objects.landuse.geometries[i];
						var B = {arcs:[], kind:Bb.properties.kind, name:Bb.properties.name};
								if (Bb.arcs)
						for(var k = 0;k<Bb.arcs.length;k++){
								B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);
							
						}
						Lset.push(B);
					}
					
					for (var i = 0;i<this.thedata.objects.roads.geometries.length;i++){
						var Bb = this.thedata.objects.roads.geometries[i];
						var B = { arcs:[], kind: Bb.properties.kind};						
						for(var k = 0;k<Bb.arcs.length;k++)
						{
							B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);	
						}
						Rset.push(B);
					}		
					
					for (var i = 0;i<this.thedata.objects.transit.geometries.length;i++){
						var Bb = this.thedata.objects.transit.geometries[i];
						var B = { arcs:[]};
						
						for(var k = 0;k<Bb.arcs.length;k++){
							B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);	
						}
						Rset.push(B);
					}
					
					//console.log(this.thedata);
					this.arcs = Aset;
					this.buildings = Bset;
					this.roads = Rset;
					this.waters = Wset;
					this.earths = Eset;
					this.landuses = Lset;
			}
			
			this.load = function(name){
				this.rpc.fileio.readfile("$apps/VectorMap/"+name  ).then(function(result){
					this.loadstring(result.value);					
				
				}.bind(this));		
			}	
			
			
			this.render = function(){	
				var res = [];
				
				for (var i =0;i<this.arcs.length;i++){
					res.push(this.arc({arc:this.arcs[i]}));
				}
				
				res.push(this.land({lands:this.earths}));
				
				for (var i =0;i<this.waters.length;i++){
					res.push(this.water({water:this.waters[i]}));
				}
				
				for (var i =0;i<this.landuses.length;i++){
					res.push(this.land({land:this.landuses[i]}));
				}
				
				res.push(this.building({buildings: this.buildings}));			
				
				for(var i = 0 ;i<this.roads.length;i++){
					res.push(this.road({road: this.roads[i]}));			
				}
			
				return res;
			}
		})			
	})
		
	
	define.class(this, "urlfetch", function($server$, service){
		this.grabmap = function(x,y,z){
			
			var nodehttp = require('$system/server/nodehttp');
			var fs = require('fs');
			var cachedname = define.expandVariables(define.classPath(this) + "tilecache/" + x +"_"+y+"_" + z+".json");
			if (fs.existsSync(cachedname)){
				return fs.readFileSync(cachedname).toString()
			}
			
			var fileurl = "http://vector.mapzen.com/osm/all/"+z+"/"+x+"/"+y+".topojson?api_key=vector-tiles-Qpvj7U4" 
			
			
			var P = define.deferPromise()

			nodehttp.get(fileurl).then(function(v){
				fs.writeFileSync(cachedname, v);				
				P.resolve(v);
			})
			
			return P;
		}.bind(this)		
	})
	
	this.render = function(){ return [
		fileio(),
		this.urlfetch({name:"urlfetch"}),
		screen({name:"index", style:{
					$:{
						fontsize:12
					}
				},
				onstatus:function(){this.find("themenu").infotext = this.status;},
				clearcolor:vec4('#303030'), overflow:'hidden', title:"VectorMap" },
			menubar({name:"themenu",menus:[
				{name:"File", commands:[
					{name:"Map 1", clickaction:function(){this.find("tile1").load("map1.json");}},
					{name:"Map 2", clickaction:function(){this.find("tile1").load("map2.json");}},
					{name:"Map 3", clickaction:function(){this.find("tile1").load("map3.json");}},
					{name:"Map 4", clickaction:function(){this.find("tile1").load("map4.json");}},
					{name:"Map 5", clickaction:function(){this.find("tile1").load("map5.json");}},
					{name:"Map 6", clickaction:function(){this.find("tile1").load("map6.json");}}
					
					]}
				]}),
				view({flex:1, overflow:"scroll", bg:0, clearcolor:"#505050", onzoom: function(){this.find("themap").setZoomLevel(this.zoom, this.layout.width, this.layout.height);}},
				this.mainscreen({ name:"themap", bg:0, boundscheck:false}),
				view({width:2000, height:2000, bg:0}))
			
			
		)

		,screen({name:"remote", style:{
					$:{
						fontsize:12
					}
				},
				init:function(){
					console.log(this.rpc.index)
				},
				clearcolor:vec4('darkgray'), overflow:'hidden', title:"VectorMap remote" },
				speakergrid({justifycontent:"center", alignitems:"center" })
			
			
		)
	
	]}
})
