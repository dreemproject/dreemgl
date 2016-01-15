//Pure JS based composition

//C:\Projects\dgl3\dreemgl>node server.js -path map:<path>


define.class('$server/composition', function vectormap(require,  $server$, fileio,$ui$, numberbox, button, menubar, label, screen, view, foldcontainer, speakergrid,checkbox, icon, $widgets$, colorpicker,  jsviewer, radiogroup){
	
	this.attributes = {
	}
	
	define.class(this, "mainscreen", function($ui$, view){
		
		var earcut = require('$system/lib/earcut-port.js')().earcut;
	
		this.attributes = {
			arcs:[], 
			buildings:[],
			roads:[],
			waters:[], 
			earths:[], 
			landuses:[]
			
		}
		
		define.class(this, "building", function($ui$, view){
			this.attributes = {
				
				building:{}
			}
			this.mouseover =  function(){
				var text = "";
				if (this.building.name) text += this.building.name;
				if (this.building.street) text += " " + this.building.street;
				if (this.building.housenumber) text += " " + this.building.housenumber;
				
				this.screen.status = text;
			}
			this.render = function(){
				var res = [];
				for (var i =0;i<this.building.arcs.length;i++){
					res.push(this.outer.arc({arc:this.building.arcs[i], color:vec4(Math.pow(this.building.h*0.07,0.5)*0.8, 0.2,0,1) }));
				}
				return res;
			};
			
		})
		
		define.class(this, "water", function($ui$, view){
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
			this.attributes = {
				
				land:{}
			}
			this.mouseover =  function(){
				var text = "Land: " + this.land.kind;				
				this.screen.status = text;
				
			}
			
			this.color1 = {pedestrian:"lightgray", parking:"gray", park:"green", earth:"green", pier:"#404040", "rail" : vec4("purple"), "minor_road": vec4("orange"), "major_road" : vec4("red"), highway:vec4("black")}
			this.color2 = {pedestrian:"yellow", parking:"lightgray", park:"lime", earth:"gray", pier:"gray", "rail" : vec4("purple"), "minor_road": vec4("orange"), "major_road" : vec4("red"), highway:vec4("black")}
						
			this.render = function(){
				var res = [];
				if (!this.land) return [];
				if (!this.land.arcs) return [];
				
				var color1 = vec4("green");
				var color2 = vec4("lime");
				
				if (this.color1[this.land.kind]) color1 = this.color1[this.land.kind];else console.log("unknown land type:", this.land.kind);
				if (this.color2[this.land.kind]) color2 = this.color2[this.land.kind];else console.log("unknown land type:", this.land.kind);
					
					
				for (var i =0;i<this.land.arcs.length;i++){
					
					
					res.push(this.outer.landpolygon({color1:color1, color2:color2,arc:this.land.arcs[i], color:vec4("lightblue") }));
				}
				return res;
			};
			
		})
		
		define.class(this, "road", function($ui$, view){
			this.attributes = {
				
				road:{}
			}
			this.widths = {path:2,ferry:4, "rail" : 5, "minor_road": 4, "major_road" : 10, path: 3, highway:12}
			this.colors = {path:"brown", ferry:"lightblue", "rail" : vec4("purple"), "minor_road": vec4("#505050"), "major_road" : vec4("#404040"), highway:vec4("#303030")}
			this.render = function(){
		//		console.log(this.road.kind);
					
				var res = [];
				for (var i =0;i<this.road.arcs.length;i++){
					
					var width = 3;
					var color = vec4("gray") 
					if (this.widths[this.road.kind]) width = this.widths[this.road.kind];else console.log("unknown road type:", this.road.kind);
					if (this.colors[this.road.kind]) color = this.colors[this.road.kind];else console.log("unknown road type:", this.road.kind);
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
					var xy = vec2(gl_FragCoord.xy)*0.1;
//					return mix("blue", "lightblue", abs(sin(xy.y*4.0  + sin(view.time*0.1)*10 - abs(sin(view.time*1.2 + xy.x*2.0)))));
					return mix("blue", "lightblue", abs(sin(xy.y*4.0  - abs(sin(xy.x*2.0)))));
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
							
				//			console.log(A);
					}
					//this.mesh.push(A0[0], A0[1], this.view.color);
					
				}
				
				this.position = function(){					
					return vec4(mesh.pos.x, 1000-mesh.pos.y, 0, 1) * view.totalmatrix * view.viewmatrix
				}
				
			this.drawtype = this.TRIANGLE_STRIP
			this.linewidth = 4;
			
			}
		});
		
		this.load = function(name){
			this.rpc.fileio.readfile("$apps/VectorMap/"+name  ).then(function(result){
			//	try{
					this.thedata = JSON.parse(result.value);	
					var Aset = [];					
					var Bset = [];
					var Rset = [];
					var Wset = [];
					var Eset = [];
					var Lset = [];
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
					
					
					console.log(this.thedata);
					this.arcs = Aset;
					this.buildings = Bset;
					this.roads = Rset;
					this.waters = Wset;
					this.earths = Eset;
					this.landuses = Lset;
				//}
			//	catch(e){
				//	console.log(e);
			//	}
				
			}.bind(this));
		
	}
	
		
		this.init = function(){
				this.load("map2.json");
		}
		this.render = function(){	
			var res = [];
			for (var i =0;i<this.arcs.length;i++){
				res.push(this.arc({arc:this.arcs[i]}));
			}
			
			for (var i =0;i<this.earths.length;i++){
				res.push(this.land({land:this.earths[i]}));
			}
			for (var i =0;i<this.waters.length;i++){
				res.push(this.water({water:this.waters[i]}));
			}
			
			for (var i =0;i<this.landuses.length;i++){
				res.push(this.land({land:this.landuses[i]}));
			}
			
			
			for(var i = 0 ;i<this.buildings.length;i++){
				res.push(this.building({building: this.buildings[i]}));			
			}

			for(var i = 0 ;i<this.roads.length;i++){
					res.push(this.road({road: this.roads[i]}));
			
			}
		
		
			return res;
		}
	})
	this.render = function(){ return [
		fileio(),
		screen({name:"index", style:{
					$:{
						fontsize:12
					}
				},
				onstatus:function(){this.find("themenu").infotext = this.status;},
				clearcolor:vec4('#303030'), overflow:'hidden', title:"VectorMap" },
			menubar({name:"themenu",menus:[
				{name:"File", commands:[
					{name:"Map 1", clickaction:function(){this.find("themap").load("map1.json");}},
					{name:"Map 2", clickaction:function(){this.find("themap").load("map2.json");}},
					{name:"Map 3", clickaction:function(){this.find("themap").load("map3.json");}},
					{name:"Map 4", clickaction:function(){this.find("themap").load("map4.json");}},
					{name:"Map 5", clickaction:function(){this.find("themap").load("map5.json");}},
					{name:"Map 6", clickaction:function(){this.find("themap").load("map6.json");}}
					
					]}
				]}),
				view({flex:1, overflow:"scroll", bg:0, clearcolor:"#505050"},
				this.mainscreen({ name:"themap", bg:0, noboundscheck:true}),
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