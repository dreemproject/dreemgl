//Pure JS based composition

//C:\Projects\dgl3\dreemgl>node server.js -path map:<path>


define.class('$server/composition', function vectormap(require,  $server$, fileio,$ui$, numberbox, button, menubar, label, screen, view, foldcontainer, speakergrid,checkbox, icon, $widgets$, colorpicker,  jsviewer, radiogroup){
	
	this.attributes = {
	
	}	
	
	define.class(this, "mainscreen", function($ui$, view){		
	
	var L = 2;
		this.attributes = {
			mapxcenter: Math.floor(33656/Math.pow(2, L)),
			mapycenter: Math.floor(21534/Math.pow(2,L)),
			zoomlevel: 16 - L
			
		}
		console.log("addfactor:", Math.pow(2, L));
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
					//console.log(this.last_pick_id)
					var text = "Land: " + this.lands[this.last_pick_id - 1].kind;				

					this.screen.status = text;				
				}			
				
				
				this.onlands = function(){
					this.pickrange = this.lands.length;
				}
				
				this.bg = function(){
				
					this.color1 = {water:"#40a0ff",pedestrian:"lightgray", parking:"gray", park:"lime", earth:"lime", pier:"#404040", "rail" : vec4("purple"), "minor_road": vec4("orange"), "major_road" : vec4("red"), highway:vec4("black")}
					this.color2 = {water:"#f0ffff",pedestrian:"yellow", parking:"lightgray", park:"yellow", earth:"green", pier:"gray", "rail" : vec4("purple"), "minor_road": vec4("orange"), "major_road" : vec4("red"), highway:vec4("black")}
					
						
					this.vertexstruct =  define.struct({		
						pos:vec2,
						color1:vec4,
						color2:vec4, 
						id: float
					})
					
					this.mesh = this.vertexstruct.array();
					
					//this.pick = function(){
				//		return mesh.id;
				//	}
					
					this.color = function(){						
						var xy = vec2(mesh.pos.xy)*0.2;
						var n1 = (noise.noise2d(xy))*0.25 + 0.25;
						var n2 = 0.8*noise.noise2d(xy*2.3)
						
						PickGuid.x = floor(mesh.id/256.);
						PickGuid.y = mod(mesh.id, 256.);
						return mix(mesh.color1, mesh.color2,n1+n2);						
					}
			
					this.update = function(){
						this.mesh = this.vertexstruct.array();
						
						for(var i = 0;i<this.view.lands.length;i++){
							var land = this.view.lands[i];
							
							var color1 = vec4("green");
							var color2 = vec4("lime");
							
							if (this.color1[land.kind]) color1 = this.color1[land.kind];
							if (this.color2[land.kind]) color2 = this.color2[land.kind];
						
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
					roads:[]
				}
				
				this.bg = function(){		
					this.vertexstruct =  define.struct({		
						pos:vec2,
						color:vec4,
						side: float, 
						dist: float,
						linewidth:float,
						sidevec:vec2, 
						markcolor: vec4
					})
					
					this.mesh = this.vertexstruct.array();
					
					this.color = function(){
						//if (abs(mesh.side) > 0.85) return mix("black", mesh.color, 0.8)
						if (abs(mesh.side) > 0.75) return mix(mesh.markcolor, mesh.color, 0.6)
						if (abs(mesh.side) < 0.1) return  mix(mesh.markcolor, mesh.color, 0.6 * (min(1., max(0.0,0.8 + 5.0*sin(mesh.dist*0.5)))))
						return mesh.color;
					}
					
					this.widths = {water:20, path:2,ferry:4, "rail" : 5, "minor_road": 4, "major_road" : 10, path: 3, highway:12}
					this.colors = {water:"#30a0ff", path:"brown", ferry:"lightblue", "rail" : vec4("purple"), "minor_road": vec4("#505050"), "major_road" : vec4("#404040"), highway:vec4("#303030")}
					this.markcolors = {water:"#30a0ff"}
				
					this.update = function(){
						//console.log("updating");
						this.mesh = this.vertexstruct.array();
						
						for (var i = 0;i<this.view.roads.length;i++){
							var R = this.view.roads[i];
							//console.log(R);
							var linewidth = 3;
							var color = vec4("gray") ;
							var markcolor = vec4("white");
							if (this.widths[R.kind]) linewidth = this.widths[R.kind];
							if (this.colors[R.kind]) color = vec4(this.colors[R.kind]);
							if (this.markcolors[R.kind]) markcolor = vec4(this.markcolors[R.kind]);

								
							for(var rr = 0;rr<R.arcs.length;rr++){
								
								
								var currentarc = R.arcs[rr]
								
								//console.log(R, currentarc);
								//continue;
								var A0 = currentarc[0];
								//this.mesh.push(A0[0], A0[1], this.view.color);
								var nx = A0[0];
								var ny = A0[1];
								var dist = 0;
								var dist2 = 0;
								var lastsdelta = vec2(0,0);
								for(var a = 1;a<currentarc.length;a++){					
									var A =currentarc[a];
									var tnx = nx + A[0];
									var tny = ny + A[1];
									var predelt = vec2( tnx - nx, tny - ny);
									var delta = vec2.normalize(predelt);
									var sdelta = vec2.rotate(delta, PI/2);
							
									var dist2 = dist +  vec2.len(predelt);

									if (a>1){
										this.mesh.push(nx,ny, color, 1, dist,linewidth,lastsdelta, markcolor);
										this.mesh.push(nx,ny, color,-1, dist,linewidth,lastsdelta, markcolor);
										this.mesh.push(nx,ny, color, 1, dist,linewidth,sdelta, markcolor);
										
										this.mesh.push(nx,ny, color, 1, dist,linewidth, lastsdelta, markcolor);
										this.mesh.push(nx,ny, color, 1, dist,linewidth, sdelta, markcolor);
										this.mesh.push(nx,ny, color,-1, dist,linewidth, sdelta, markcolor);
											
									}
									
									this.mesh.push( nx, ny,color, 1, dist ,linewidth, sdelta, markcolor);
									this.mesh.push( nx, ny,color,-1, dist ,linewidth, sdelta, markcolor);
									this.mesh.push(tnx,tny,color, 1, dist2,linewidth, sdelta, markcolor);
									
									this.mesh.push(nx,ny,color,-1, dist,linewidth, sdelta, markcolor);
									this.mesh.push(tnx,tny,color,1,dist2,linewidth, sdelta, markcolor);
									this.mesh.push(tnx,tny,color,-1, dist2,linewidth, sdelta, markcolor);
									
									lastsdelta = vec2(sdelta[0], sdelta[1]);
									dist = dist2;									
									nx = tnx;
									ny = tny;
								}
							}
						}
					}
					this.position = function(){					
						var pos = mesh.pos + mesh.sidevec * mesh.side * mesh.linewidth*0.5;
						return vec4(pos.x, 1000-pos.y, 0, 1) * view.totalmatrix * view.viewmatrix
					}
					
					this.drawtype = this.TRIANGLES
					this.linewidth = 4;		
				
				}
				
				
			})
					
			function arctotriangles(arc){
				if (!arc) return [];
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
					var KindSet = {};
					//console.log(this.thedata);
					for (var i = 0;i<this.thedata.objects.buildings.geometries.length;i++){
						var Bb = this.thedata.objects.buildings.geometries[i];
						var B = {h:Bb.properties.height, name:Bb.properties.name, street: Bb.properties["addr_street"], housenumber: Bb.properties.addr_housenumber, arcs:[]};
							if (Bb.arcs){
								for(var k = 0;k<Bb.arcs.length;k++){
								B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);
							}
						}
						KindSet[B.kind] = true;
						Bset.push(B);
					}
					
					for (var i = 0;i<this.thedata.objects.water.geometries.length;i++){
						var Bb = this.thedata.objects.water.geometries[i];
						var B = {arcs:[], kind:"water" };
						//console.log(Bb);
						if(Bb.arcs)
							for(var k = 0;k<Bb.arcs.length;k++){
								B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);
							
						}
						if (Bb.type == "LineString" || Bb.type=="MultiLineString" ){
							Rset.push(B);
						}
						else{
							Wset.push(B);
						}
					}
					
					for (var i = 0;i<this.thedata.objects.earth.geometries.length;i++){
						var Bb = this.thedata.objects.earth.geometries[i];
						var B = {arcs:[], kind:"earth"};
							for(var k = 0;k<Bb.arcs.length;k++){
								B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);
							
						}
						KindSet[B.kind] = true;
						Eset.push(B);
					}
					
					for (var i = 0;i<this.thedata.objects.landuse.geometries.length;i++){
						var Bb = this.thedata.objects.landuse.geometries[i];
						var B = {arcs:[], kind:Bb.properties.kind, name:Bb.properties.name};
								if (Bb.arcs)
						for(var k = 0;k<Bb.arcs.length;k++){
								B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);
							
						}
						KindSet[B.kind] = true;
						Lset.push(B);
					}
					
					for (var i = 0;i<this.thedata.objects.roads.geometries.length;i++){
						var Bb = this.thedata.objects.roads.geometries[i];
						var B = { arcs:[], kind: Bb.properties.kind};						
						for(var k = 0;k<Bb.arcs.length;k++)
						{
							B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);	
						}
						KindSet[B.kind] = true;
						Rset.push(B);
					}		
					
					for (var i = 0;i<this.thedata.objects.transit.geometries.length;i++){
						var Bb = this.thedata.objects.transit.geometries[i];
						var B = { arcs:[]};
						
						for(var k = 0;k<Bb.arcs.length;k++){
							B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);	
						}
						KindSet[B.kind] = true;
						Rset.push(B);
					}
					
					//console.log(this.thedata);
					this.arcs = Aset;
					this.buildings = Bset;
					this.roads = Rset;
					this.waters = Wset;
					this.earths = Eset;
					this.landuses = Lset;
			//		console.log(KindSet);
			}
			
			this.load = function(name){
				this.rpc.fileio.readfile("$apps/VectorMap/"+name  ).then(function(result){
					this.loadstring(result.value);					
				
				}.bind(this));		
			}	
			
			
			this.render = function(){	
				var res = [];
				
			//	for (var i =0;i<this.arcs.length;i++){
		//			res.push(this.arc({arc:this.arcs[i]}));
			//	}
				
				res.push(this.land({lands:this.earths}));
				
				res.push(this.land({lands:this.waters}));
				
				res.push(this.land({lands:this.landuses}));
				
				res.push(this.building({buildings: this.buildings}));			
				
				res.push(this.road({roads: this.roads}));			
				
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
				menubar({
					name:"themenu",menus:[
						{name:"File", commands:[
							{name:"Map 1", clickaction:function(){this.find("tile1").load("map1.json");}},
							{name:"Map 2", clickaction:function(){this.find("tile1").load("map2.json");}},
							{name:"Map 3", clickaction:function(){this.find("tile1").load("map3.json");}},
							{name:"Map 4", clickaction:function(){this.find("tile1").load("map4.json");}},
							{name:"Map 5", clickaction:function(){this.find("tile1").load("map5.json");}},
							{name:"Map 6", clickaction:function(){this.find("tile1").load("map6.json");}}						
						]}
					]}
				),
				view({flex:1, overflow:"scroll", bgcolor:"darkblue", clearcolor:"#505050", onzoom: function(){this.find("themap").setZoomLevel(this.zoom, this.layout.width, this.layout.height);}},
				this.mainscreen({ name:"themap",  boundscheck:false}),
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
