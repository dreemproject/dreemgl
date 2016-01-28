define.class("$ui/view", function(require,$ui$, view,label, $$, geo, urlfetch)
{		
	var KindSet = this.KindSet = {};
	var UnhandledKindSet = this.UnhandledKindSet = {};	
	var TileSize = 1024.0 ;

	
	
	var roadwidths = {water:20, path:2,ferry:4, "rail" : 4, "minor_road": 8, "major_road" : 12, path: 3, highway:12}
	var roadcolors = {water:"#30a0ff", path:"#d0d0d0", ferry:"lightblue", "rail" : vec4("purple"), "minor_road": vec4("#505050"), "major_road" : vec4("#404040"), highway:vec4("#303030")}
	var roadmarkcolors = {water:"#30a0ff", major_road:"white", minor_road:"#a0a0a0"}
			
	var ignoreuse = {
		allotments:true, 
		apron:true, 
		cemetery:true, 
		cinema:true, 
		college:true, 
		commercial:true, 
		common:true, 
		farm:true, 
		farmland:true, 
		farmyard:true, 
		footway:true, 
		forest:false, 
		fuel:true, 
		garden:false, glacier:false, golf_course:true, grass:false, 
		hospital:true, industrial:false, land:false, library:true, 
		meadow:false, nature_reserve:false, park:false, parking:true, 
		pedestrian:true, 
		pitch:true, 
		place_of_worship:true, playground:true, quarry:true, railway:true, recreation_ground:true, residential:true, retail:true, 
		runway:true, school:true, scrub:true, sports_centre:true, stadium:true, taxiway:true, theatre:true, university:true, village_green:true, wetland:true, wood:true, "urban area":true, park:true, "protected land":true};
	
	
	var mapstyle = {
		ferry:{
			roadcolor: vec4(0.6784313917160034,0.8470588326454163,0.9019607901573181,1),
		},
		earth:{
			offset:10,
			color1: vec4("#4a644a"),
			color2: vec4("#38523d"),
		},
		national_park:{
			color1:vec4("#608010"),
			color2:vec4("#f0f020")
		},
		park:{
			offset:-7,
			color1: vec4(0.250980406999588,0.8156862854957581,0.1882352977991104,1),
			color2: vec4(0.003921568859368563,0.19607843458652496,0.125490203499794,1),
		},
		aerodrome:{
		},
		residential:{
			offset:-13,
			color1: vec4(0.501960813999176,0.501960813999176,0.501960813999176,1),
			color2: vec4(0.8274509906768799,0.8274509906768799,0.8274509906768799,1),
		},
		industrial:{
			color1:vec4("#202020"),
			color2:vec4("#d0d0d0")
		},
		recreation_ground:{
			offset:-18.8,
			color1:vec4("#8080f0"),
			color2:vec4("#6060f0")
		},
		scrub:{
		},
		wetland:{
			offset:-18.5,
			color1: vec4("darkgreen"),
			color2: vec4("darkblue")

		},
		beach:{
			offset:-19,
			color1: vec4("#f0f0a0"),
			color2: vec4("yellow")

		},
		nature_reserve:{
			offset:-18,
			color1: vec4("green"),
			color2: vec4("green")
		},
		commercial:{
		},
		golf_course:{
		},
		farm:{
			color1: vec4(1,1,0.10000000149011612,1),
			color2: vec4(1,1,0.10000000149011612,1),
		},
		grass:{
			offset:-18,
			color1: vec4(0.250980406999588,0.8156862854957581,0.125490203499794,1),
			color2: vec4(0,0.501960813999176,0,1),
		},
		sports_centre:{
			offset:-23,
			color1: vec4(1,0,0,1),
			color2: vec4(1,1,1,1),
		},
		farmland:{
			color1:vec4("#808010"),
			color2:vec4("#606020")
		},
		hospital:{
		},
		retail:{
			offset:27,
			color1: vec4(0,0,1,0.5),
			color2: vec4(0,0,1,0.5),
		},
		allotments:{
		},
		runway:{
			offset:-20,
			
				color1:vec4("gray"),
			color2:vec4("#d0d0d0")
		},
		forest:{
			offset:-30,
			color1: vec4(0.003921568859368563,0.19607843458652496,0.125490203499794,1),
			color2: vec4(0,0,0,1),
		},
		meadow:{
		},
		parking:{
			offset:-8,
			color1: vec4(0.501960813999176,0.501960813999176,0.501960813999176,1),
			color2: vec4(0.8274509906768799,0.8274509906768799,0.8274509906768799,1),
		},
		plant:{
			color1:vec4("#208020"),
			color2:vec4("#208020")
		},
		pitch:{
			offset:-17,
			color1: vec4(0.7490196228027344,1,0,1),
			color2: vec4(0,0.501960813999176,0,1),
		},
		cemetery:{
			color1: vec4("gray"),
			color2: vec4("darkgray")
		},
		zoo:{
		},
		attraction:{
		},
		university:{
			offset:-21,
			color1: vec4(1,0,0,1),
			color2: vec4(0,0,0,1),
		},
		apron:{
		},
		military:{
		},
		wastewater_plant:{
		},
		playground:{
			offset:-19,
			color1: vec4(0.7490196228027344,1,0,1),
			color2: vec4(1,0,0,1),
		},
		stadium:{
		},
		railway:{
		},
		garden:{
			offset:-14,
			color1: vec4(0,0.501960813999176,0,1),
			color2: vec4(0.250980406999588,0.8156862854957581,0.501960813999176,1),
		},
		farmyard:{
			color1:vec4("#808010"),
			color2:vec4("#606020")
		},
		generator:{
		},
		college:{
		},
		pedestrian:{
			offset:-9,
			color1: vec4(0.8274509906768799,0.8274509906768799,0.8274509906768799,1),
			color2: vec4(1,1,0,1),
		},
		school:{
		},
		substation:{
		},
		petting_zoo:{
		},
		wood:{
			color1:vec4("#208020"),
			color2:vec4("#106010")
		},
		common:{
			offset:24,
			color1: vec4(1,1,1,1),
			color2: vec4(0.501960813999176,0.501960813999176,0.501960813999176,1),
		},
		village_green:{
			offset:-15,
			color1: vec4(0,0.501960813999176,0,1),
			color2: vec4(0,0.501960813999176,0,1),
		},
		prison:{
		},
		major_road:{
			offset:-55,
			color1: vec4(1,0,0,1),
			color2: vec4(1,0,0,1),
			roadcolor: vec4(0.250980406999588,0.250980406999588,0.250980406999588,1),
		},
		highway:{
			offset:-55,
			color1: vec4(0,0,0,1),
			color2: vec4(0,0,0,1),
			roadcolor: vec4(0.1882352977991104,0.1882352977991104,0.1882352977991104,1),
		},
		minor_road:{
			offset:-55,
			color1: vec4(1,0.6470588445663452,0,1),
			color2: vec4(1,0.6470588445663452,0,1),
			roadcolor: vec4(0.3137255012989044,0.3137255012989044,0.3137255012989044,1),
		},
		undefined:{
		},
		works:{
		},
		protected_area:{
			color1: vec4("red"),
			color2: vec4("green")
		},
		theme_park:{
		},
		path:{
			roadcolor: vec4(0.8156862854957581,0.8156862854957581,0.8156862854957581,1),
		},
		quarry:{
			color1: vec4("gray"),
			color2: vec4("black")
		},
		bridge:{
			offset:-22,
			color1: vec4(0.501960813999176,0.501960813999176,0.501960813999176,1),
			color2: vec4(1,1,1,1),
		},
		breakwater:{
			offset:-20,
			color1: vec4(0,0,1,1),
			color2: vec4(0,0,1,1),
		},
		water:{
			offset:-20,
			color1: vec4(0,0,1,1),
			color2: vec4(0,0,1,1),
		},
		building:{
			color1:vec4("white"),
			color2:vec4("white")
		},
		apartments:{
		},
		garages:{
		},
		storage_tank:{
		},
		pier:{
			offset:-5,
			color1: vec4(0.250980406999588,0.250980406999588,0.250980406999588,1),
			color2: vec4(0.501960813999176,0.501960813999176,0.501960813999176,1),
		},
		place_of_worship:{
		},
		water_works:{
		},
		cinema:{
		},
		taxiway:{
		},
		fuel:{
		},
		footway:{
			offset:-12,
			color1: vec4(0.501960813999176,0.501960813999176,0.501960813999176,1),
			color2: vec4(1,1,0,1),
		},
		groyne:{
		},
		roller_coaster:{
		},
		default:
		{
			color1:vec4('white'),
			color2:vec4('blue')
		}
		
	}
	
	for (var a in mapstyle){
		var st = mapstyle[a];
		if (st.color1) st.color1 = vec4.desaturate(st.color1,0.85);
		if (st.color2) st.color2 = vec4.desaturate(st.color2,0.84);
	}
	this.attributes = {
		latlong:vec2(52.3608307,   4.8626387),
		centerx: 0, 
		centery: 0,
		zoomlevel: 16
	}
	
	this.dumpkindset = function(){
		
		
		
		var mapstylestring = "var mapstyle = {\n";
		for(var i in KindSet){
			mapstylestring += "\t" + i + ":{\n";
			if (landoffsets[i]) mapstylestring += "\t\toffset:" + landoffsets[i]+ ",\n "
			if (landcolor1[i]) mapstylestring += "\t\tcolor1: vec4(" + vec4(landcolor1[i])+ "),\n "
			if (landcolor2[i]) mapstylestring += "\t\tcolor2: vec4(" + vec4(landcolor2[i])+ "),\n "
			if (roadcolors[i]) mapstylestring += "\t\troadcolor: vec4(" + vec4(roadcolors[i])+ "),\n "
			mapstylestring +="\t},\n";
	//		console.log("Handled:", i);
		}
		for(var i in UnhandledKindSet){
			console.log("Unhandled:" , i, UnhandledKindSet[i]);
			}
		mapstylestring += "\tdefault:\n\t{\n\t\tcolor1:vec4('red')\n\t}\n}";
		
		console.log(mapstylestring);
	}
	
	
	
	function createHash (x, y, z){
			return x + "_" + y + "_" + z;
	}

	
	this.mouseleftdown = function(){
		console.log("mousedown");		
		this.mousemove = function(){
			console.log("dragging");
		}
	}
	
	this.mouseleftup = function(){
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
		buildingid: float,
		height: float
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
					
					c = 0.8 + 0.2 *Math.sin(Math.atan2(A2[1]-A1[1], A2[0]-A1[0]));
					mesh.push(A1[0],A1[1],0, c,c,c, 1, i,bid,theH);
					mesh.push(A2[0],A2[1],0, c,c,c, 1, i,bid,theH);
					mesh.push(A2[0]+isox,A2[1]+isoy,theH, c,c,c, 1, i,bid,theH);
					mesh.push(A1[0],A1[1],0, c,c,c, 1, i,bid,theH);
					mesh.push(A2[0]+isox,A2[1]+isoy,theH, c,c,c, 1, i,bid,theH);
					mesh.push(A1[0]+isox,A1[1]+isoy,theH, c,c,c, 1, i,bid,theH);
					A1 = A2;
			
				}
				c = 1.0
				for(var a = 0;a<tris.length;a++){
					var atri = tris[a];
					mesh.push(atri[0]+isox,atri[1]+isoy,theH, c,c,c, 1, i,bid,theH);
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
			var t = mapstyle[land.kind];
			if (!t) t = mapstyle["default"];
			if (t.color1) color1 = t.color1;else UnhandledKindSet[land.kind] = "land - no color1";
			if (t.color2) color2 = t.color2;else UnhandledKindSet[land.kind] = "land - no color2 ";
			if (t.offset) off = t.offset;else UnhandledKindSet[land.kind] = "land - no offset"
			
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
					
					var st = mapstyle[R.kind];
					if (!st) st = mapstyle["default"];
					if (roadwidths[R.kind]) linewidth = roadwidths[R.kind];else UnhandledKindSet[R.kind] = "road" ;
					
					if (st.roadcolor) color = st.roadcolor;else UnhandledKindSet[R.kind] = "road" ;
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
	
		
	define.class(this, "mapdataset", "$ui/view", function( $$, geo)
	{
		this.requestPending = false;
		this.loadqueue = [];
		this.loadqueuehash = [];
		this.loadedblocks = {};
		
		var geo = this.geo = geo();
		
		this.attributes = {
			centerpos: vec2(0),
			
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
				this.centerpos = vec2(x,y)
				this.zoomlevel = z;
				for(var xx = -5; xx < 5; xx++){
					for(var yy = -5; yy < 5; yy++){			
				//		this.addToQueue(x + xx,y + yy,z);	
					}
				}					
			}
			else{
				
				var anim = {}
				anim[1] = {motion:"inoutquad", value:vec2(x,y)};
				this.centerpos = Animate(anim);
				
				
				
				this.zoomlevel = z;
				
				//debugger;
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
				var dx = lb.x - this.centerpos[0];
				var dy = lb.y - this.centerpos[1];
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
					var Places = [];
				
				try{
					this.thedata = JSON.parse(str);	
				
					//console.log(this.thedata.objects);
					for (var i = 0;i<this.thedata.objects.buildings.geometries.length;i++){
						var Bb = this.thedata.objects.buildings.geometries[i];
					//	console.log(Bb.properties);
						var B = {id:Bb.properties.id,h:Bb.properties.height?Bb.properties.height:30.0,kind:Bb.properties.kind, name:Bb.properties.name, street: Bb.properties["addr_street"], housenumber: Bb.properties.addr_housenumber, arcs:[]};
							if (Bb.arcs){
								for(var k = 0;k<Bb.arcs.length;k++){
								B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);
							}
						}
						KindSet[B.kind] = true;
						Bset.push(B);
					}
					for (var i = 0;i<this.thedata.objects.places.geometries.length;i++){
						var Bb = this.thedata.objects.water.geometries[i];
						
						//console.log(Bb.properties.kind, Bb.type, Bb.properties.name);
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

						if (!ignoreuse[B.kind])
						{
								
							if (Bb.arcs)
										
							for(var k = 0;k<Bb.arcs.length;k++){
									B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);
								
							}
							KindSet[B.kind] = true;
							Lset.push(B);
							Allset.push(B);
						}
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
					var dx = this.centerpos[0] - q.x;
					var dy = this.centerpos[1] - q.y;
					var dz = (this.zoomlevel - q.z)*zscalar;
				//	console.log(dx,dy,dz);
					q.dist = dx * dx + dy * dy + dz * dz;
				}
				
				this.loadqueue = this.loadqueue.sort(function(a,b){
					if (a.dist > b.dist) return -1;
					if (a.dist < b.dist) return 1; 
					return 0;
				});
				
				//console.log(this.loadqueue);
				//var queuedist = ""
				//for (var i = 0;i<this.loadqueue.length;i++){
				//	queuedist += this.loadqueue[i].dist + " ";
				//}
				//console.log(queuedist);
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
					   seoel: [37.5275421, 126.9748078],
					   shenzhen_hqb:[22.5402897,114.0846914],
					   hongkong:[22.2854084,114.1600463]
			}
			
			this.theinterval = this.setInterval(function(){
				this.updateLoadQueue();
			}.bind(this), 50);
			
			this.loadinterval = this.setInterval(function(){
				//this.simulateLoaded();
			}.bind(this), 50);
		
			this.gotoCity("Amsterdam", 10);
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
			fog: vec4("lightblue"),
			fogstart: 1000.0,
			fogend: 5000.
			
		}
		
		this.mouseleftdown = function(){
			this.find("mapdata").setCenter(this.lastpos[0], this.lastpos[1], this.zoomlevel,1);
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
			this.coord = vec2(Math.floor(newcoord[0]), Math.floor(newcoord[1]));
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
					this.bufferloaded = 1;//Animate({1:{value:1.0, motion:"inoutquad"}});			
					this.loadBufferFromTile(bl);
					this.redraw();				
				}
				else{
					if (this.queued == 0){
						this.bgshader.update();
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
				pos = vec2(1,-1)*mesh.pos.xy + (idxpos - view.tiletrans)* view.tilesize;
				respos = vec4(pos.x, -mesh.pos.z, pos.y, 1) * view.totalmatrix * view.viewmatrix ;
				//r.w += 0.002;
				
				return respos;
			}
			
			this.mesh =  BuildingVertexStruct.array();
			
			this.update = function(){
				this.mesh =  BuildingVertexStruct.array();
				
			}
			
			this.drawtype = this.TRIANGLES
			
			this.color = function(){
				//return "blue";
			
				var noise = noise.cheapnoise(pos*0.02)*0.1+0.5 
				var prefog = mix(mesh.color1, mesh.color1, noise)
				prefog.xyz *= 0.6 + 0.4*max(0.0, min(1.0, ((mesh.pos.z - mesh.height)*0.001)+0.4));
				var zdist = max(0.,min(1.,(respos.z-view.fogstart)/view.fogend));
				//zdist *= zdist;
				return mix(prefog, view.fog, zdist);
				//return vec4(col.xyz * (0.5 + 0.5*view.bufferloaded), 0.2);
				
			}
		}
		
	});
	
	
	define.class(this,"landtile", "$ui/view", function(){
		this.attributes = {bufferloaded:0.0}
	
		this.is = tilebasemixin;
		
		this.loadBufferFromTile = function(tile){
			this.bgshader.mesh = tile.landVertexBuffer;					
		}
		
		
		
		
		this.bg = function(){
			
			this.position = function(){		
				
				idxpos = (  view.trans.xy*vec2(1,-1) ) * vec2(1,-1);;
				pos = vec2(1,-1)*mesh.pos.xy + (idxpos - view.tiletrans)* view.tilesize;
				respos = vec4(pos.x, 0, pos.y, 1) * view.totalmatrix * view.viewmatrix ;
				respos.w -= mesh.pos.z*0.01;
				
				return respos;
			}
			
			this.mesh =  LandVertexStruct.array();
			
			this.update = function(){
				this.mesh =  LandVertexStruct.array();
				var a = TileSize *0.05;
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
				var col =  vec4("#202050");
				
				var noise = noise.cheapnoise(pos*0.02)*0.2+0.5;
				var prefog = mix(mix(mesh.color1, mesh.color2, noise), col, 1.0-view.bufferloaded);
				var zdist = max(0.,min(1.,(respos.z-view.fogstart)/view.fogend));
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
			
			
			
				var pos = vec2(1,-1)*possrc.xy + (idxpos - view.tiletrans) * view.tilesize;
				 respos = vec4(pos.x, 0, pos.y, 1) * view.totalmatrix * view.viewmatrix ;
				respos.w += mesh.pos.z*0.1;
				return respos;
			}
			
			this.vertexstruct = RoadVertexStruct;
			
			this.mesh =  this.vertexstruct.array();
			
			this.update = function(){
				this.mesh =  this.vertexstruct.array();
				
				/*var a = TileSize / 4;
				var b = TileSize - a;
				this.mesh.push(a,a);
				this.mesh.push(b,a);

				this.mesh.push(b,b);
				this.mesh.push(a,a);
				this.mesh.push(b,b);
				this.mesh.push(a,b);*/
		
			}
			
			this.drawtype = this.TRIANGLES
			
			this.color = function(){
				//return "blue";
				var prefog = mix(mesh.color, vec4(0), 1.0-view.bufferloaded);
				//var prefog=  vec4(col.xyz * (0.5 + 0.5*view.bufferloaded), 0.2);
				
				
				var zdist = max(0.,min(1.,(respos.z-view.fogstart)/view.fogend));
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
		this.centerx = this.dataset.centerpos[0];
		this.centery = this.dataset.centerpos[1];
		var centervec = vec2(this.centerx, this.centery);
		var frac = vec2(this.centerx - Math.floor(this.centerx), this.centery - Math.floor(this.centery))
		var floorvec = vec2(Math.floor(this.centerx), Math.floor(this.centery));
		//console.log(this.centerx, this.centery, this.zoomlevel);
		this.zoomlevel = this.dataset.zoomlevel;

		for(var a = 0;a<this.tilestoupdate.length;a++){
			var rt = this.tilestoupdate[a];
				//rt.trans = vec2(Math.sin(this.time)*5, 0);
				rt.setpos(floorvec, this.zoomlevel, frac);
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
		
		this.tilewidth = 5;
		this.tileheight = 5;
		
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
		
		var dist = 2.5
		res.push(view({flex: 1,viewport: "3d",name:"mapinside", nearplane:100*dist,farplane: 40000*dist,
		
		camera:vec3(0,-1000 * dist,1000 * dist), fov: 40, up: vec3(0,1,0)
		,lookat:vec3(0,0,0)
		}, 
		
			view({bg:0, rotate:vec3(0,0.1,0)},
				res3d
				)
			
			));
		return res;
	}
})