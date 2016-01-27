define.class("$ui/view", function(require,$ui$, view,label, $$, geo, urlfetch)
{		
	var KindSet = this.KindSet = {};
	var UnhandledKindSet = this.UnhandledKindSet = {};	
	var TileSize = 1024.0 ;
	this.attributes = {
		latlong:vec2(52.3608307,   4.8626387),
		centerx: 0, 
		centery: 0,
		zoomlevel: 16
	}
	
	
	function createHash (x, y, z){
			return x + "_" + y + "_" + z;
	}

		
	var landcolor1 = {farm:vec4(1,1,0.1,1), retail:vec4(0,0,1,0.5), tower:"white",library:"white",common:"white", sports_centre:"red", bridge:"gray", university:"red", breakwater:"blue", playground:"lime",forest:"darkgreen",pitch:"lime", grass:"#40d020", village_green:"green", garden:"green",residential:"gray" , footway:"gray", pedestrian:"gray", water:"#40a0ff",pedestrian:"lightgray", parking:"gray", park:"#40d030", earth:"lime", pier:"#404040", "rail" : vec4("purple"), "minor_road": vec4("orange"), "major_road" : vec4("red"), highway:vec4("black")}
	var landcolor2 = {farm:vec4(1,1,0.1,1), retail:vec4(0,0,1,0.5), tower:"gray", library:"gray", common:"gray", sports_centre:"white", bridge:"white", university:"black", breakwater:"blue", playground:"red", forest:"black",pitch:"green", grass:"green", village_green:"green", garden:"#40d080", residential:"lightgray" , footway:"yellow", pedestrian:"blue",water:"#000080",pedestrian:"yellow", parking:"lightgray", park:"darkgreen", earth:"green", pier:"gray", "rail" : vec4("purple"), "minor_road": vec4("orange"), "major_road" : vec4("red"), highway:vec4("black")}
	//var landcolor1 ={water:"#40a0ff",park:"darkgreen", grass:"white" };
	
	var roadwidths = {water:20, path:2,ferry:4, "rail" : 4, "minor_road": 8, "major_road" : 12, path: 3, highway:12}
	var roadcolors = {water:"#30a0ff", path:"#d0d0d0", ferry:"lightblue", "rail" : vec4("purple"), "minor_road": vec4("#505050"), "major_road" : vec4("#404040"), highway:vec4("#303030")}
	var roadmarkcolors = {water:"#30a0ff", major_road:"white", minor_road:"#a0a0a0"}
			
	var landoffsets = {
		retail:27, 
		tower:26, 
		library:25, 
		common:24, 
		sports_centre:-23, 
		bridge:-22, 
		university:-21, 
		breakwater:-20, 
		playground:-19, 
		forest:-30,
		pitch:-17, 
		grass:-18, 
		village_green:-15, 
		garden:-14, 
		residential:-13, 
		footway:-12, 
		pedestrian:-11,
		water:-50,
		pedestrian:-9, 
		parking:-8, 
		park:-7, 
		earth:10, 
		pier:-5, 
		rail : -4,
		minor_road:-55, 
		major_road :-55, highway:-55
	}
	
	this.mouseleftdown = function(){
		console.log("mousedown");		
		this.mousemove = function(){
			console.log("dragging");
		}
	}
	
	this.mouseleftup = function(){
		console.log("up!");
		this.mousemove = function(){};
	}
	
	var earcut = require('$system/lib/earcut-port.js')().earcut;
	
	this.gotoCity = function(city, zoomlevel){
		this.dataset.gotoCity(city, zoomlevel);
	}
	
	var BuildingVertexStruct = define.struct({		
		pos:vec3,
		color1:vec4, 
		id: float,
		buildingid: float
	})
	
	var RoadVertexStruct = define.struct({		
		pos:vec3,
		color:vec4,
		side: float, 
		dist: float,
		linewidth:float,
		sidevec:vec2, 
		markcolor: vec4
	})
	
	var LandVertexStruct = define.struct({
		pos:vec3,
		color1:vec4,
		color2:vec4, 
		id: float
	})
	
	function arctotriangles(arc){
		if (!arc) return []
		var verts = []
		var flatverts = []
		var A0 = arc[0]
		var nx = A0[0]
		var ny = A0[1]

		flatverts.push(nx)
		flatverts.push(ny)
		
		for (var i = 1; i < arc.length; i++){
			var A = arc[i]
			nx += A[0]
			ny += A[1]
			flatverts.push(nx)
			flatverts.push(ny)
		}
		
		var triangles = earcut(flatverts)
		
		for(var i = 0; i < triangles.length; i++){
			idx = triangles[i]
			verts.push([flatverts[idx * 2], flatverts[idx * 2 + 1]])
		}

		return verts
	}

	
	function buildBuildingVertexBuffer(buildings){
		var mesh = BuildingVertexStruct.array(buildings.length * 30);
		
		for(var i = 0;i<buildings.length;i++){
			var building = buildings[i];
			
			var theH = building.h;
			var isofac = 0 
			var isox = (theH*0.5)*isofac
			var isoy = (theH)*isofac
			var bid = building.id;
				
			if (building.arcs)
			for(var j = 0;j<building.arcs.length;j++){
				var arc = building.arcs[j];
				
				var tris = arctotriangles(arc);
				var A1 = [arc[0][0], arc[0][1]]
				var OA1 = A1;
				var c = 0.3;
				for(var a = 1;a<arc.length+1;a++)
				{
					var ca = arc[a%arc.length];
					
					var A2 = [A1[0] + ca[0], A1[1] + ca[1]];
					if (a  == arc.length){
						A2[1] -= OA1[1];
						A2[0] -= OA1[0];
					}
					
					c = 0.4 + 0.3 *Math.sin(Math.atan2(A2[1]-A1[1], A2[0]-A1[0]));
					mesh.push(A1[0],A1[1],0, c,c,c, 1, i,bid);
					mesh.push(A2[0],A2[1],0, c,c,c, 1, i,bid);
					mesh.push(A2[0]+isox,A2[1]+isoy,theH, c,c,c, 1, i,bid);
					mesh.push(A1[0],A1[1],0, c,c,c, 1, i,bid);
					mesh.push(A2[0]+isox,A2[1]+isoy,theH, c,c,c, 1, i,bid);
					mesh.push(A1[0]+isox,A1[1]+isoy,theH, c,c,c, 1, i,bid);
					A1 = A2;
			
				}
				c = 0.4
				for(var a = 0;a<tris.length;a++){
					var atri = tris[a];
					mesh.push(atri[0]+isox,atri[1]+isoy,theH, c,c,c, 1, i,bid);
				}
			}							
		}
		//if (!window.teller) window.teller = 0;
		//window.teller += mesh.length * 40;
		return mesh;
	}
	
	function buildAreaPolygonVertexBuffer(areas, targetmesh){
		//console.log(areas);
		var mesh = targetmesh?targetmesh: LandVertexStruct.array();
		
		for(var i = 0;i<areas.length;i++){
			var off = 0;
			var land = areas[i];
			
			var color1 = vec4(1,0,1,1);
			var color2 = vec4(1,0,1,1);
			
			if (landcolor1[land.kind]) color1 = landcolor1[land.kind];else UnhandledKindSet[land.kind] = true;
			if (landcolor2[land.kind]) color2 = landcolor2[land.kind];else UnhandledKindSet[land.kind] = true;
			if (landoffsets[land.kind]) off = landoffsets[land.kind];
			
			if (land.arcs){
				for(var j = 0;j<land.arcs.length;j++){
					var arc = land.arcs[j];
					var tris = arctotriangles(arc);
					for(var a = 0;a<tris.length;a++){
						mesh.push(tris[a],off, vec4(color1), vec4(color2), i);
					}
				}
			}
		}
		return mesh;
	}

	function buildRoadPolygonVertexBuffer(roads){
		var mesh = RoadVertexStruct.array();
		var z = 10;
		for (var i = 0;i<roads.length;i++){							
					
					
	//						console.log(z);
					var R = roads[i];
					//console.log(R);
					var linewidth = 3;
					var color = vec4("gray") ;
					if (roadwidths[R.kind]) linewidth = roadwidths[R.kind];
					if (roadcolors[R.kind]) color = vec4(roadcolors[R.kind]);
					var markcolor = color;
					if (roadmarkcolors[R.kind]) markcolor = vec4(roadmarkcolors[R.kind]);
				
				//	linewidth *= Math.pow(2, this.view.zoomlevel-14);
					
					for(var rr = 0;rr<R.arcs.length;rr++){
						var currentarc = R.arcs[rr]
						if (currentarc.length == 1){
							continue
						}
						//	console.log(R, currentarc, currentarc.length, currentarc[0].length);
						
						//console.log(R, currentarc);
						//continue;
						var A0 = currentarc[0];
						var A1 = vec2(currentarc[1][0]+A0[0],currentarc[1][1]+A0[1]) ;
						
						//mesh.push(A0[0], A0[1], this.view.color);
						var nx = A0[0];
						var ny = A0[1];
						
						var odx = A1[0]-A0[0];
						var ody = A1[1]-A0[1];
						
						var predelta = vec2.normalize(vec2(odx, ody));
						var presdelta = vec2.rotate(predelta, 3.1415/2.0);
					
					
					
						var dist = 0;
						var dist2 = 0;
						var lastsdelta = vec2(0,0);
					//	color = vec4("blue");
						mesh.push(nx,ny,z, color, 1, dist,linewidth,presdelta, markcolor);
						mesh.push(nx,ny,z, color, -1, dist,linewidth,presdelta, markcolor);

						mesh.push(nx - predelta[0]*linewidth*0.5,ny - predelta[1]*linewidth*0.5,z, color, 0.5, -10 ,linewidth,presdelta, markcolor);

						mesh.push(nx - predelta[0]*linewidth*0.5,ny - predelta[1]*linewidth*0.5,z, color, 0.5, -10 ,linewidth,presdelta, markcolor);
						mesh.push(nx - predelta[0]*linewidth*0.5,ny - predelta[1]*linewidth*0.5,z, color, -0.5, -10 ,linewidth,presdelta, markcolor);

						//mesh.push(nx,ny, color, 1, dist,linewidth,presdelta, markcolor);
						mesh.push(nx,ny, z, color, -1, dist,linewidth,presdelta, markcolor);


					//	color = vec4(0,0,0.03,0.1)
					var lastdelta = vec2(0);
						for(var a = 1;a<currentarc.length;a++){					
							var A =currentarc[a];
							
							var tnx = nx + A[0];
							var tny = ny + A[1];
							var predelt = vec2( tnx - nx, tny - ny);
							var delta = vec2.normalize(predelt);
							var sdelta = vec2.rotate(delta, PI/2);
					
							var dist2 = dist +  vec2.len(predelt);
							
							if (a>1){
								mesh.push(nx,ny,z, color, 1, dist,linewidth,lastsdelta, markcolor);
								mesh.push(nx,ny,z, color, 1, dist,linewidth,sdelta, markcolor);
								mesh.push(nx,ny,z, color, -1, dist,linewidth,sdelta, markcolor);
								
								mesh.push(nx,ny,z, color, 1, dist,linewidth,lastsdelta, markcolor);
								mesh.push(nx,ny,z, color,-1, dist,linewidth,sdelta, markcolor);
								mesh.push(nx,ny,z, color, -1, dist,linewidth,lastsdelta, markcolor);
									
							}
							//color = vec4(0,1,0,0.2)
							mesh.push( nx, ny,z,color, 1, dist ,linewidth, sdelta, markcolor);
							mesh.push( nx, ny,z,color,-1, dist ,linewidth, sdelta, markcolor);
							mesh.push(tnx,tny,z,color, 1, dist2,linewidth, sdelta, markcolor);
							
							mesh.push(nx,ny,z,color,-1, dist,linewidth, sdelta, markcolor);
							mesh.push(tnx,tny,z,color,1,dist2,linewidth, sdelta, markcolor);
							mesh.push(tnx,tny,z,color,-1, dist2,linewidth, sdelta, markcolor);
							
							lastsdelta = vec2(sdelta[0], sdelta[1]);
							dist = dist2;									
							nx = tnx;
							ny = tny;
							lastdelta = delta;
						}
						//color = vec4("red");
						mesh.push(nx,ny,z, color, 1, dist,linewidth,lastsdelta, markcolor);
						mesh.push(nx,ny,z, color, -1, dist,linewidth,lastsdelta, markcolor);
						mesh.push(nx + lastdelta[0]*linewidth*0.5,ny + lastdelta[1]*linewidth*0.5,z, color, 0.5, dist+linewidth*0.5 ,linewidth,lastsdelta, markcolor);

						mesh.push(nx + lastdelta[0]*linewidth*0.5,ny + lastdelta[1]*linewidth*0.5,z, color, 0.5, dist+linewidth*0.5 ,linewidth,lastsdelta, markcolor);
						mesh.push(nx + lastdelta[0]*linewidth*0.5,ny + lastdelta[1]*linewidth*0.5,z, color, -0.5, dist+linewidth*0.5,linewidth,lastsdelta, markcolor);
						mesh.push(nx,ny, z,color, -1, dist,linewidth,presdelta, markcolor);

					}
				}
				
		return mesh;
		
	}
	
		
	define.class(this, "mapdataset", "$system/base/node", function( $$, geo)
	{
		this.requestPending = false;
		this.loadqueue = [];
		this.loadqueuehash = [];
		this.loadedblocks = {};
		
		var geo = this.geo = geo();
		
		this.attributes = {
			centerx: 0,
			centery: 0,
			latlong: vec2(52.3608307,   4.8626387),
			zoomlevel: 15,
			callbacktarget: {}
		}
		
		this.setCenterLatLng = function(lat, lng, zoom, time){	
			zoom = Math.floor(zoom);
			var llm = geo.latLngToMeters(lat, lng)
			var tvm = geo.tileForMeters(llm[0], llm[1], zoom );
			this.setCenter(tvm.x , tvm.y , zoom, time);
		}
		
		this.setCenter = function(x,y,z, time){
			
			if (!time || time == 0)
			{
				this.centerx = x;
				this.centery = y;
				this.zoomlevel = z;
				for(var xx = -5; xx < 5; xx++){
					for(var yy = -5; yy < 5; yy++){			
						this.addToQueue(x + xx,y + yy,z);	
					}
				}					
			}
			else{
				console.log("todo: set up animation");
				debugger;
			}
		}
		

		this.addToQueue = function(x, y, z){		
			var hash = createHash(x, y, z);
			if (this.loadqueuehash[hash]) return; // already queued for load.
			if (this.loadedblocks[hash]) return; // already loaded.
			
			this.loadqueuehash[hash] = 1;
			this.loadqueue.push({x:x, y:y, z:z});
			this.updateLoadQueue();
		}

		this.processLoadedBlock = function(x, y, z, data){
			var hash = createHash(x,y,z);
			this.loadedblocks[hash] = {x:x, y:y, z:z, blockdata:data};
		}
		
		this.simulateLoaded = function(){
			if (this.currentRequest) {
				
				var r = this.currentRequest;
				var hash = createHash(r.x, r.y, r.z);
				this.loadedblocks[hash] = this.currentRequest
				this.loadqueuehash[hash] =  undefined;
				this.currentRequest = undefined;
				this.cleanLoadedBlocks();
				this.updateLoadQueue();
			}		
		}
		
		this.cleanLoadedBlocks = function(){
			var keys = Object.keys(this.loadedblocks);
			if (keys.length < 150) return;
			for(var i =0 ;i<keys.length;i++)
			{
				var lb = this.loadedblocks[keys[i]]
				var dx = lb.x - this.centerx;
				var dy = lb.y - this.centery;
				var dz = (lb.z - this.zoomlevel)*25;
				var dist  = dx*dx + dy*dy + dz*dz;
				if (dist > 5*5*5*5) {
					delete this.loadedblocks[keys[i]];
				}
			}
		}
		
		this.loadstring = function(str){
		//	if (!window.teller) window.teller = 0;
		//	window.teller += str.length;
			
			if (this.currentRequest) {
					var Bset = [];
					var Rset = [];
					var Wset = [];
					var Eset = [];
					var Lset = [];
					var Allset = [];
				
				
				try{
					this.thedata = JSON.parse(str);	
				
					
					for (var i = 0;i<this.thedata.objects.buildings.geometries.length;i++){
						var Bb = this.thedata.objects.buildings.geometries[i];
					//	console.log(Bb.properties);
						var B = {id:Bb.properties.id,h:Bb.properties.height?Bb.properties.height:3.0,kind:Bb.properties.kind, name:Bb.properties.name, street: Bb.properties["addr_street"], housenumber: Bb.properties.addr_housenumber, arcs:[]};
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
						if(Bb.arcs)
							if (Bb.type == "MultiLineString"){
								var arc = [];
								for(var k = 0;k<Bb.arcs.length;k++){
									var sourcearc = this.thedata.arcs[Bb.arcs[k]];
									var x = sourcearc[0][0];
									var y = sourcearc[0][1];
									arc.push(x,y);
									for(var l = 1;l<sourcearc.length;l++)
									{
										x+= sourcearc[l][0];
										y+= sourcearc[l][1];
										arc.push(x,y);
									}
								}
								B.arcs.push(arc);
							}
							else
							for(var k = 0; k < Bb.arcs.length;k++){
								B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);							
						}
						if (Bb.type == "LineString" ){
							// uncomment to get waterworks added as roads.
							//Rset.push(B);
						}
						else{
							Wset.push(B);
							Allset.push(B);
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
						Allset.push(B);
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
						Allset.push(B);
					}
					
					for (var i = 0;i<this.thedata.objects.roads.geometries.length;i++){
						var Bb = this.thedata.objects.roads.geometries[i];
						var B = { arcs:[], kind: Bb.properties.kind};						
							for(var k = 0;k<Bb.arcs.length;k++){
								B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);	
							}
							Rset.push(B);
						KindSet[B.kind] = true;							
					}		
					
					for (var i = 0;i<this.thedata.objects.transit.geometries.length;i++){
						var Bb = this.thedata.objects.transit.geometries[i];
						var B = { arcs:[]};
						
						for(var k = 0;k<Bb.arcs.length;k++){
							B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);	
						}
						KindSet[B.kind] = true;
						//Rset.push(B);
					}
				}
					
				catch(e){
					console.log(e, str);
					var r = this.currentRequest;
					console.log(" while loading ", r.x, r.y, r.z);
				}
			
				var r = this.currentRequest;
				r.buildings = Bset;
				r.roads = Rset;
				
				r.waters = Wset;
				r.earths = Eset;
				r.landuses = Lset;
				r.roadVertexBuffer = buildRoadPolygonVertexBuffer(r.roads);
				r.buildingVertexBuffer = buildBuildingVertexBuffer(r.buildings);
				
				var landmesh = buildAreaPolygonVertexBuffer(Eset);
				buildAreaPolygonVertexBuffer(Lset, landmesh);
				buildAreaPolygonVertexBuffer(Wset, landmesh);
				r.landVertexBuffer = landmesh;
		
				var hash = createHash(r.x, r.y, r.z);
				
				this.loadedblocks[hash] = this.currentRequest
				this.loadqueuehash[hash] =  undefined;
				this.currentRequest = undefined;
				this.cleanLoadedBlocks();
				this.updateLoadQueue();
			}
		}
		
		this.getBlockByHash = function(hash){
			//console.log(hash);
			return this.loadedblocks[hash];
		}
			
		
		this.updateLoadQueue = function(){
			
			if (this.currentRequest) return; // already loading something...
			//console.log("queuelen: " , this.loadqueue.length);
			if (this.loadqueue.length > 0){
			//	console.log("queuelen: " , this.loadqueue.length);
				var zscalar = 1;
				
				// sort queue on distance to cursor
				for (var i = 0;i<this.loadqueue.length;i++){
					var q = this.loadqueue[i];
					var dx = this.centerx - q.x;
					var dy = this.centery - q.y;
					var dz = (this.centerz - q.z)*zscalar;
					q.dist = dx * dx + dy * dy + dz * dz;
				}
				
				this.loadqueue = this.loadqueue.sort(function(a,b){
					if (a.dist > b.dist) return -1;
					if (a.dist < b.dist) return 1; 
					return 0;
				});
				
				var R =	this.currentRequest = this.loadqueue.pop(); 
				this.rpc.urlfetch.grabmap(R.x, R.y, R.z).then(function(result){
					this.loadstring(result.value)
				}.bind(this));
				
				// take closest one from the queue
				// this.requestPending = true;
			}
		}
		
		this.destroy = function(){
			this.clearInterval(this.theinterval);
		}
		
		this.gotoCity = function(name, zoom){
			//console.log(this, name, this.cities);
			if (!name || name.length == 0) return ;
			var n2 = name.toLowerCase().replace(' ', '');
			
			var c = this.cities[n2];
			if (c){
				this.setCenterLatLng(c[1], c[0], zoom,0);
			}			
			else{
				console.log("city not found:", name);
			}
		}
		
		this.init = function(){
			
			this.cities = {
				   manhattan: [40.7072121, -74.0067985],
				   amsterdam: [52.3608307,   4.8626387],
				sanfrancisco: [37.6509102,-122.4889338],
			//	sanfrancisco: [37.8838923,-122.3398295],
				sanfrancisco_goldengatepark:[37.7677892,-122.4853213],
					   seoul: [37.5275421, 126.9748078],
					   seoel: [37.5275421, 126.9748078]
			}
			
			this.theinterval = this.setInterval(function(){
				this.updateLoadQueue();
			}.bind(this), 50);
			
			this.loadinterval = this.setInterval(function(){
				//this.simulateLoaded();
			}.bind(this), 50);
		
			this.gotoCity("manhattan", 16);
			//this.setCenter(33656/2,21534/2, 16)
			
		}
	})
	
	this.atDraw = function(){
		this.updateTiles();
		this.setTimeout(this.updateTiles, 10);
	}
	
	this.init = function(){
		this.dataset = this.mapdataset({name:"mapdata", callbacktarget: this});
		
		this.setTimeout(this.updateTiles, 10);
	}
	
	
	var tilebasemixin = define.class(Object, function(){
		this.attributes = {
			trans: vec2(0),
			coord: vec2(0),
			centerpos: vec2(4,3),
			tilearea:vec2(10,6),
			zoomlevel: 16,
			bufferloaded: 0.0,
			tiletrans: vec2(0),
			fog: vec4("lightblue")
			
		}
		
		this.lastpos = vec2(0);
		
		this.calctilepos = function(){
			var x = this.coord[0] + this.trans[0];
			var y = this.coord[1] + this.trans[1];
			return [x,y,this.zoomlevel];
		}
		
		this.init = function(){
			
			var R = this.calctilepos();
			
			this.lastpos = vec3(R[0], R[1], R[2]);		
		}
		
		this.setpos = function(newcoord, newzoom, frac){
			this.tiletrans = frac;
			this.zoomlevel = newzoom;
			this.coord = newcoord;
			this.checknewpos();
		}
	
		this.checknewpos = function(){
			var R = this.calctilepos();
			
			var newpos = 	vec3(R[0], R[1], R[2]);		
			if (this.lastpos[0] != newpos[0] || this.lastpos[1] != newpos[1]){
				this.lastpos = newpos;
				this.tilehash = createHash(this.lastpos[0], this.lastpos[1], this.zoomlevel);
				this.bufferloaded = 0;
				this.queued  = 0;
				this.redraw();
				this.loadbuffer()
				
			}else{
				if (this.bufferloaded == 0) this.loadbuffer();
			}

		}

		this.loadbuffer = function(){
			var md = this.find("mapdata");
			if (md){
				var bl = md.getBlockByHash(this.tilehash);
				if (bl){
					this.bufferloaded = 1;
			
					this.loadBufferFromTile(bl);
					this.redraw();
					
				}
				else{
					if (this.queued == 0){
						this.bgshader.update();
						//this.redraw();
						md.addToQueue(this.lastpos[0], this.lastpos[1], this.lastpos[2]);
						this.queued  = 1;
					}
				}
			}
		}
		this.onzoomlevel = function(){
			this.checknewpos();
		}
		this.oncoord = function(){
			this.checknewpos();
		
		}
		this.tilesize = TileSize;
		
	})
	
	var tileshadermixin = define.class(Object, function(){
		
	})
	
	
	define.class(this,"buildingtile", "$ui/view", function(){
		this.is = tilebasemixin;
		this.loadBufferFromTile = function(tile){
			this.bgshader.mesh = tile.buildingVertexBuffer;					
		}
		
		this.bg = function(){
			
			this.position = function(){		
				
				idxpos = (  view.trans.xy*vec2(1,-1) ) * vec2(1,-1);;
				pos = vec2(1,-1)*mesh.pos.xy + (idxpos + view.tiletrans)* view.tilesize;
				respos = vec4(pos.x, -mesh.pos.z, pos.y, 1) * view.totalmatrix * view.viewmatrix ;
				//r.w += 0.002;
				
				return respos;
			}
			
			this.mesh =  BuildingVertexStruct.array();
			
			this.update = function(){
				this.mesh =  BuildingVertexStruct.array();
				var a = TileSize / 4;
				var b = TileSize - a;
				this.mesh.push(a,a);
				this.mesh.push(b,a);

				this.mesh.push(b,b);
				this.mesh.push(a,a);
				this.mesh.push(b,b);
				this.mesh.push(a,b);
			}
			
			this.drawtype = this.TRIANGLES
			
			this.color = function(){
				//return "blue";
				var col =  pal.pal2(
							(sin((idxpos.x + view.trans.x)*0.2)*0.5+0.5) * 
							(0.5 + 0.5*sin((idxpos.y + view.trans.y)*0.2)));
			
				var noise = noise.cheapnoise(pos*0.02)*0.1+0.5 
				var prefog = mix(mix(mesh.color1, mesh.color1, noise), col, 1.0-view.bufferloaded)
				prefog.xyz *= max(0.4, min(1.0, (mesh.pos.z*0.01)+0.4));
				var zdist = max(0.,min(1.,(respos.z-1000.)/4000.));
				zdist *= zdist;
				return mix(prefog, view.fog, zdist);
				//return vec4(col.xyz * (0.5 + 0.5*view.bufferloaded), 0.2);
				
			}
		}
		
	});
	
	
	define.class(this,"landtile", "$ui/view", function(){
		this.is = tilebasemixin;
		this.loadBufferFromTile = function(tile){
			this.bgshader.mesh = tile.landVertexBuffer;					
		}
		
		this.bg = function(){
			
			this.position = function(){		
				
				idxpos = (  view.trans.xy*vec2(1,-1) ) * vec2(1,-1);;
				pos = vec2(1,-1)*mesh.pos.xy + (idxpos + view.tiletrans)* view.tilesize;
				 respos = vec4(pos.x, 0, pos.y, 1) * view.totalmatrix * view.viewmatrix ;
				respos.w -= mesh.pos.z*0.01;
				
				return respos;
			}
			
			this.mesh =  LandVertexStruct.array();
			
			this.update = function(){
				this.mesh =  LandVertexStruct.array();
				var a = TileSize / 4;
				var b = TileSize - a;
				this.mesh.push(a,a);
				this.mesh.push(b,a);

				this.mesh.push(b,b);
				this.mesh.push(a,a);
				this.mesh.push(b,b);
				this.mesh.push(a,b);
			}
			
			this.drawtype = this.TRIANGLES
			
			this.color = function(){
				//return "blue";
				var col =  pal.pal2(
							(sin((idxpos.x + view.trans.x)*0.2)*0.5+0.5) * 
							(0.5 + 0.5*sin((idxpos.y + view.trans.y)*0.2)));
			
				var noise = noise.cheapnoise(pos*0.02)*0.1+0.5;
				var prefog = mix(mix(mesh.color1, mesh.color2, noise), col, 1.0-view.bufferloaded);
				var zdist = max(0.,min(1.,(respos.z-1000.)/4000.));
				zdist *= zdist;
				return mix(prefog, view.fog, zdist);
				
				//return vec4(col.xyz * (0.5 + 0.5*view.bufferloaded), 0.2);
				
			}
		}
		
	});
	
	
	define.class(this,"roadtile", "$ui/view", function(){
		this.is = tilebasemixin;
		this.loadBufferFromTile = function(tile){
			this.bgshader.mesh = tile.roadVertexBuffer;					
		}
		this.bg = function(){
			
			this.position = function(){		
						
				var possrc = mesh.pos.xy + mesh.sidevec * mesh.side * mesh.linewidth*0.5;
				
				idxpos = (  view.trans.xy*vec2(1,-1) ) * vec2(1,-1);;
			
			
			
				var pos = vec2(1,-1)*possrc.xy + (idxpos + view.tiletrans) * view.tilesize;
				 respos = vec4(pos.x, 0, pos.y, 1) * view.totalmatrix * view.viewmatrix ;
				respos.w += mesh.pos.z;
				return respos;
			}
			
			this.vertexstruct = RoadVertexStruct;
			
			this.mesh =  this.vertexstruct.array();
			
			this.update = function(){
				this.mesh =  this.vertexstruct.array();
				var a = TileSize / 4;
				var b = TileSize - a;
				this.mesh.push(a,a);
				this.mesh.push(b,a);

				this.mesh.push(b,b);
				this.mesh.push(a,a);
				this.mesh.push(b,b);
				this.mesh.push(a,b);
		
			}
			
			this.drawtype = this.TRIANGLES
			
			this.color = function(){
				//return "blue";
				var col =  pal.pal2(
							(sin(( idxpos.x + view.trans.x)*0.2)*0.5+0.5) * 
							(0.5 + 0.5*sin(( idxpos.y + view.trans.y)*0.2)));
				var prefog = mix(mesh.color*vec4(1,1,1,0.8), col, 1.0-view.bufferloaded);
				//var prefog=  vec4(col.xyz * (0.5 + 0.5*view.bufferloaded), 0.2);
				
				
				var zdist = max(0.,min(1.,(respos.z-1000.)/4000.));
				zdist *= zdist;
				return mix(prefog, view.fog, zdist);
				
				
			}
		}	
	});

	
	this.bgcolor = vec4("#101030");
	this.flex = 1;
	this.clearcolor = "black"
	this.time = 0;
	
	this.updateTiles = function(){
		if (!this.dataset) return;
		this.centerx = this.dataset.centerx;
		this.centery = this.dataset.centery;
		var centervec = vec2(this.centerx, this.centery);
		var frac = vec2(this.centerx - Math.floor(this.centerx), this.centery - Math.floor(this.centery))
		//console.log(this.centerx, this.centery, this.zoomlevel);
		this.zoomlevel = this.dataset.zoomlevel;

		for(var a = 0;a<this.tilestoupdate.length;a++){
			var rt = this.tilestoupdate[a];
				//rt.trans = vec2(Math.sin(this.time)*5, 0);
				rt.setpos(centervec, this.zoomlevel, frac);
				rt.redraw();
		}
	}
	
	this.render = function(){
		this.tilestoupdate = [];
		
		var res = [this.dataset];
		//res.push(label({bg:0, text:"I am a map" }),this.dataset)
		var res3d = []
		
		var div = 400
		this.tilewidth = Math.ceil(this.layout.width/ div);
		this.tileheight = Math.ceil(this.layout.height/ div);;
		
		//this.tilewidth = 1;
		//this.tileheight = 1;
		
		var tilearea = vec2(this.tilewidth, this.tileheight)
		console.log("tile area", tilearea);
		for(var x = 0;x<this.tilewidth;x++){
			
			
			for(var y = 0;y<this.tileheight;y++){
				var land = this.landtile({fog:this.bgcolor, tilearea:tilearea, trans:vec2(Math.floor(x-(this.tilewidth-1)/2),Math.floor(y-(this.tileheight-1)/2))});
				this.tilestoupdate.push(land);
				res3d.push(land);
			}
		}

		for(var x = 0;x<this.tilewidth;x++){
			
			
			for(var y = 0;y<this.tileheight;y++){
				var road = this.roadtile({fog:this.bgcolor, tilearea:tilearea, trans:vec2(Math.floor(x-(this.tilewidth-1)/2),Math.floor(y-(this.tileheight-1)/2))});
				this.tilestoupdate.push(road);
				res3d.push(road);
			}
		}
		
		for(var x = 0;x<this.tilewidth;x++){
			
			
			for(var y = 0;y<this.tileheight;y++){
				var building = this.buildingtile({fog:this.bgcolor, tilearea:tilearea, trans:vec2(Math.floor(x-(this.tilewidth-1)/2),Math.floor(y-(this.tileheight-1)/2))});
				this.tilestoupdate.push(building);
				res3d.push(building);
			}
		}
		
		var dist = 1.5
		res.push(view({flex: 1,viewport: "3d",name:"mapinside", nearplane:100*dist,farplane: 40000*dist,camera:vec3(0,-1400 * dist,1000 * dist), fov: 20, up: vec3(0,1,0)}, 
		
			view({bg:0, rotate:vec3(0,0.1,0)},
				res3d
				)
			
			));
		return res;
	}
})