/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, $server$, service){

	var earcut = require('$system/lib/earcut-port.js')().earcut;

	this.TileSize = 256.0;

	var KindSet = this.KindSet = {};
	var UnhandledKindSet = this.UnhandledKindSet = {};

	var roadwidths = {water:20, path:2,ferry:4, "rail" : 4, "minor_road": 8, "major_road" : 12, path: 3, highway:12}
	var roadcolors = {water:"#30a0ff", path:"#d0d0d0", ferry:"lightblue", "rail" : vec4("purple"), "minor_road": vec4("#505050"), "major_road" : vec4("#404040"), highway:vec4("#303030")}
	var roadmarkcolors = {water:"#30a0ff", major_road:"white", minor_road:"#a0a0a0"}

	//this.ignoreuse = {}
	this.displaykinds ={
		water: true, 
		meadow:true, 
		playa:true, 
		forest: true,
		pedestrian: true,
		earth:true, 
		river:true,
		beach: true,
		grass: true,
		lake:true,
		canal: true,
		land:true,
		forest:true,nature_reserve:true,riverbank:true, railway:true, runway:true, farmland:true
	}
	
	this.noignoreuse = {
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
		national_park:true,
		place_of_worship:true, playground:true, quarry:true, railway:true, recreation_ground:false, residential:false, retail:true,
		riverbank:true,reservoir:true,
		runway:true, school:true, scrub:true, sports_centre:true, stadium:true, taxiway:true, theatre:true, university:true, village_green:true, wetland:true, wood:true, "urban area":true, park:true, "protected land":true, protected_area:true};

	var watercolor = vec4("ocean");
	
	var mapstyle = this.mapstyle = {
		ferry:{
			roadcolor: vec4(0.6784313917160034,0.8470588326454163,0.9019607901573181,1),
		},
		riverbank:{color1:watercolor},
		marina:{color1:watercolor},
		reservoir:{color1:watercolor},
		stream:{color1:watercolor},
		canal:{color1:watercolor},
		lake:{color1:watercolor},
		playa:{color1:vec4("#f0f0c0")},
		river:{color1:watercolor},
		basin:{color1:watercolor},
		swimming_pool:{color1:watercolor},
		sea:{
			color1:watercolor
		},
		ocean:{
			color1:watercolor
		},
		
		earth:{
			offset:10,
			color1: vec4("#4a644a"),
			color2: vec4("#38523d"),
		},
		national_park:{
			color1:vec4("lime"),
			color2:0.22
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
			color1:vec4("lightgreen"),
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
			color1: vec4("lightblue"),
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
			color1: watercolor,
			color2: 0,
		},
		water:{
			offset:0,
			color1: watercolor,
			color2: 0,
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
			color1:vec4('red'),
			color2:vec4('blue')
		}
	}

	if (true){

	for (var a in this.mapstyle){
		var st = this.mapstyle[a];
	//	if (st.color1) st.color1 = vec4.desaturate(st.color1,0.85);
	//	if (st.color2) st.color2 = vec4.desaturate(st.color2,0.84);
	
	}}

	this.dumpkindset = function(){
		var mapstylestring = "var mapstyle = {\n";
		for(var i in KindSet){
			mapstylestring += "\t" + i + ":{\n";
			if (landoffsets[i]) mapstylestring += "\t\toffset:" + landoffsets[i]+ ",\n "
			if (landcolor1[i]) mapstylestring += "\t\tcolor1: vec4(" + vec4(landcolor1[i])+ "),\n "
			if (landcolor2[i]) mapstylestring += "\t\tcolor2: vec4(" + vec4(landcolor2[i])+ "),\n "
			if (roadcolors[i]) mapstylestring += "\t\troadcolor: vec4(" + vec4(roadcolors[i])+ "),\n "
			mapstylestring +="\t},\n";
			// console.log("Handled:", i);
		}
		for(var i in UnhandledKindSet){
			console.log("Unhandled:" , i, UnhandledKindSet[i]);
		}
		mapstylestring += "\tdefault:\n\t{\n\t\tcolor1:vec4('red')\n\t}\n}";
		console.log(mapstylestring);
	}

	var BuildingVertexStruct = this.BuildingVertexStruct = define.struct({
		pos:vec3,
		color1:vec4,
		id: float,
		buildingid: float,
		height: float
	})

	var RoadVertexStruct = this.RoadVertexStruct = define.struct({
		pos:vec4,
		geom:vec4//sidevec:vec2
		//geom:vec3,
		//color: float,
		//side: float,
		//dist: float,
		//linewidth:float,
	})

	var LandVertexStruct = this.LandVertexStruct =	define.struct({
			pos:vec4,
			color1:vec4,
		//color1:vec4,
		//color2:vec4,
			//id: float
	})

	function arcToFlatVertices(arc, flatverts){
		if (!arc) return []
		if (!flatverts) flatverts = []
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

		return flatverts;
	}

	function polyToTriangles(poly){
		if (!poly) return [];
			var verts = []

		var flatverts = arcToFlatVertices(poly.outline);
		var holeindices = [];

		for (var i =0 ;i<poly.holes.length;i++){
			holeindices.push(flatverts.length/2);
			arcToFlatVertices(poly.holes[i], flatverts);
		}
		var triangles = earcut(flatverts, holeindices)

		for(var i = 0; i < triangles.length; i++){
			idx = triangles[i]
			verts.push(flatverts[idx * 2], flatverts[idx * 2 + 1])
		}

		return verts
	}

	function arcToTriangles(arc){
		if (!arc) return []
		var verts = []

		var flatverts = arcToFlatVertices(arc);
		var triangles = earcut(flatverts)

		for(var i = 0; i < triangles.length; i++){
			idx = triangles[i]
			verts.push([flatverts[idx * 2], flatverts[idx * 2 + 1]])
		}

		return verts
	}

	this.buildBuildingVertexBuffer = function(buildings){
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

				var tris = arcToTriangles(arc);
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

	this.calculateAreaPolygonVertexBuffer = function(areas){
		var total = 0
		for(var i = 0;i<areas.length;i++){
			land = areas[i]
			if (land.arcs){
				for(var j = 0;j<land.arcs.length;j++){
					var arc = land.arcs[j]
					var tris = arcToTriangles(arc)
					arc.tris = tris
					total += tris.length
				}
			}
			if (land.polygons){
				for(var j = 0;j<land.polygons.length;j++){
					var poly = land.polygons[j];
					var tris = polyToTriangles(poly);
					poly.tris = tris
					total += tris.length / 2
				}
			}
		}
		return total
	}

	this.buildAreaPolygonVertexBuffer = function(areas, mesh){
		//console.log(areas);
		for(var i = 0;i<areas.length;i++){
			var off = 0;
			var land = areas[i];

			var color1 = vec4(1,1,0,1);;
			//var color2 = ;
			var t = mapstyle[land.kind];
			if (!t) {t = mapstyle["default"];console.log(land.kind);};
			
			if (t.color1) color1 = t.color1;else UnhandledKindSet[land.kind] = "land - no color1";
			//if (t.color2) color2 = t.color2;else UnhandledKindSet[land.kind] = "land - no color2 ";
			if (t.offset) off = t.offset;else UnhandledKindSet[land.kind] = "land - no offset"

			if (land.arcs){
				for(var j = 0;j<land.arcs.length;j++){
					var arc = land.arcs[j];
					var tris = arc.tris
					for(var a = 0;a<tris.length;a++){
						mesh.push(tris[a][0], tris[a][1], color1[0],  i);
					}
				}
			}
			if (land.polygons){

				var array = mesh.array
				var o = mesh.length * 8

				for(var j = 0;j<land.polygons.length;j++){
					var poly = land.polygons[j];
					var tris = poly.tris
					for(var a = 0; a < tris.length; a += 2, o += 8){
						array[o + 0] = tris[a]
						array[o + 1] = tris[a + 1]
						array[o + 2] = i
						array[o + 3] = 0
						
						//array[o + 2] = off
						array[o + 4] = color1[0]
						array[o + 5] = color1[1]
						array[o + 6] = color1[2]
						array[o + 7] = color1[3]
						//array[o + 4] = color1[1]
						//array[o + 5] = color1[2]
						//array[o + 6] = color1[3]
						//array[o + 7] = color2[0]
						//array[o + 8] = color2[1]
						//array[o + 9] = color2[2]
						//array[o + 10] = color2[3]
						mesh.length ++
					}
				}
			}
		}
		return mesh;
	}

	this.buildRoadPolygonVertexBuffer = function(roads){
		var mesh = RoadVertexStruct.array();
		var z = 10;
		for (var i = 0;i<roads.length;i++){

			var R = roads[i];
			var linewidth = 3;
			var color = vec4("gray") ;

			var st = mapstyle[R.kind];
			if (!st) st = mapstyle["default"];
			if (roadwidths[R.kind]) linewidth = roadwidths[R.kind];else UnhandledKindSet[R.kind] = "road" ;

			if (st.roadcolor) color = st.roadcolor;else UnhandledKindSet[R.kind] = "road" ;
			// make color an id

			var colorid = color[0]
			//var markcolor = color;
			//if (roadmarkcolors[R.kind]) markcolor = vec4(roadmarkcolors[R.kind]);
			// linewidth *= Math.pow(2, this.view.zoomlevel-14);

			for(var rr = 0;rr<R.arcs.length;rr++){
				var currentarc = R.arcs[rr]
				if (currentarc.length == 1){
					continue
				}
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
				// it used to be
				//posx, posy, posz,
				//colorr, colorg, colorb, colora,
				//side, dist, linewidth, sidevec2, markcolor
				// now it is
				// posx, posy, sidex, sidey, side, dist, linewidth, colorid
				/*
				mesh.push(nx,ny,z, color, 1, dist,linewidth,presdelta, markcolor);
				mesh.push(nx,ny,z, color, -1, dist,linewidth,presdelta, markcolor);
				mesh.push(nx - predelta[0]*linewidth*0.5,ny - predelta[1]*linewidth*0.5,z, color, 0.5, -10 ,linewidth,presdelta, markcolor);

				mesh.push(nx - predelta[0]*linewidth*0.5,ny - predelta[1]*linewidth*0.5,z, color, 0.5, -10 ,linewidth,presdelta, markcolor);
				mesh.push(nx - predelta[0]*linewidth*0.5,ny - predelta[1]*linewidth*0.5,z, color, -0.5, -10 ,linewidth,presdelta, markcolor);
				mesh.push(nx,ny, z, color, -1, dist,linewidth,presdelta, markcolor);
				*/
				mesh.push(nx,ny,predelta[0], predelta[1], 1, dist, linewidth, colorid)//z, color, 1, dist,linewidth,presdelta, markcolor);
				mesh.push(nx,ny,presdelta[0], presdelta[1], -1, dist, linewidth, colorid)//z, color, -1, dist,linewidth,presdelta, markcolor);
				mesh.push(nx - predelta[0]*linewidth*0.5,ny - predelta[1]*linewidth*0.5, presdelta[0], presdelta[1], 0.5, -10 ,linewidth,colorid);

				mesh.push(nx - predelta[0]*linewidth*0.5,ny - predelta[1]*linewidth*0.5, presdelta[0], presdelta[1], 0.5, -10 ,linewidth,colorid);
				mesh.push(nx - predelta[0]*linewidth*0.5,ny - predelta[1]*linewidth*0.5, presdelta[0], presdelta[1], -0.5, -10 ,linewidth,colorid);
				mesh.push(nx                            ,ny                            , presdelta[0], presdelta[1], -1, dist,linewidth,colorid);

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
						mesh.push(nx,ny,lastdelta[0], lastdelta[1], 1, dist,linewidth,colorid);
						mesh.push(nx,ny,sdelta[0], sdelta[1], 1, dist,linewidth,colorid);
						mesh.push(nx,ny,sdelta[0], sdelta[1], -1, dist,linewidth,colorid);

						mesh.push(nx,ny,lastsdelta[0], lastsdelta[1], 1, dist,linewidth,colorid);
						mesh.push(nx,ny,sdelta[0], sdelta[1], -1, dist,linewidth,colorid);
						mesh.push(nx,ny,lastsdelta[0], lastsdelta[1], -1, dist,linewidth,colorid);

					}
					//color = vec4(0,1,0,0.2)
					mesh.push( nx, ny,sdelta[0], sdelta[1], 1, dist ,linewidth, colorid);
					mesh.push( nx, ny,sdelta[0], sdelta[1], -1, dist ,linewidth, colorid);
					mesh.push(tnx,tny,sdelta[0], sdelta[1], 1, dist2,linewidth, colorid);

					mesh.push(nx,ny,sdelta[0], sdelta[1], -1, dist,linewidth, colorid);
					mesh.push(tnx,tny,sdelta[0], sdelta[1],1, dist2,linewidth, colorid);
					mesh.push(tnx,tny,sdelta[0], sdelta[1], -1, dist2,linewidth, colorid);

					lastsdelta = vec2(sdelta[0], sdelta[1]);
					dist = dist2;
					nx = tnx;
					ny = tny;
					lastdelta = delta;
				}
				//color = vec4("red");
				mesh.push(nx,ny,lastsdelta[0], lastsdelta[1], 1, dist,linewidth, colorid);
				mesh.push(nx,ny,lastsdelta[0], lastsdelta[1], -1, dist,linewidth, colorid);
				mesh.push(nx + lastdelta[0]*linewidth*0.5,ny + lastdelta[1]*linewidth*0.5, lastsdelta[0], lastsdelta[1], 0.5, dist+linewidth*0.5, linewidth,colorid);

				mesh.push(nx + lastdelta[0]*linewidth*0.5,ny + lastdelta[1]*linewidth*0.5, lastsdelta[0], lastsdelta[1], 0.5, dist+linewidth*0.5 ,linewidth,colorid);
				mesh.push(nx + lastdelta[0]*linewidth*0.5,ny + lastdelta[1]*linewidth*0.5, lastsdelta[0], lastsdelta[1], -0.5, dist+linewidth*0.5,linewidth,colorid);
				mesh.push(nx,ny, presdelta[0], presdelta[1],  -1, dist,linewidth,colorid);
			}
		}
		return mesh;
	}

	function DecodeAndAdd(Bb, TargetSet, SourceArcs, defaultkind){
		var Barcs = Bb.arcs;
		var Bprops = Bb.properties;
		if (!Barcs) return ;
		var B = {arcs:[], polygons:[],kind:Bprops.kind?Bprops.kind:defaultkind };
		if (Bprops.name) B.name = Bprops.name;
		var Tarcs = B.arcs;
		var Tpolies = B.polygons;

		if (Bb.type == "MultiLineString"){
			var arc = [];
			for(var k = 0;k<Barcs.length;k++){
				var sourcearc = SourceArcs[Barcs[k]];
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
			Tarcs.push(arc);
		}
		else{
			if (Bb.type == "MultiPolygon"){
				for(var k = 0; k < Bb.arcs.length;k++){
					var L  = Bb.arcs[k].length;
					var outlinearc = SourceArcs[Bb.arcs[k][0]];
					var holes = [];
						for (var m = 1;m<L;m++){
							var holearc = SourceArcs[Bb.arcs[k][m]];
							holes.push(holearc);
						}
					Tpolies.push({outline: outlinearc, holes: holes});
				}
			}
			else{
				if ( Bb.type == "Polygon"){

					var outlinearc = SourceArcs[Bb.arcs[0][0]];
					var holes = [];
					for(var k = 1; k < Bb.arcs.length;k++){
						var L  = Bb.arcs[k].length;
						var holearc = SourceArcs[Bb.arcs[k]];
						holes.push(holearc);
					}
					Tpolies.push({outline: outlinearc, holes: holes});
				}
				else{
					if (Bb.type == "LineString"){
						for(var k = 0; k < Bb.arcs.length;k++){
							Tarcs.push(SourceArcs[Bb.arcs[k]]);
						}
					}
				}
			}
		}
		if (Bb.type == "LineString" ){
			// ignore linestrings stuck in things expected to be polygons.
		}
		else{
			TargetSet.push(B);
		}
	}

	this.build = function(target, sourcedata){
		var dt = Date.now()
		var Bset = [];
		var Rset = [];
		var Wset = [];
		var Eset = [];
		var Lset = [];
		var Labels = [];
		var Allset = [];
		var Places = [];
		var Sarcs= sourcedata.arcs;

		target.transform = sourcedata.transform;
		var objects = sourcedata.objects;
		var BuildingGeoms = objects.buildings.geometries
		for (var i = 0;i<BuildingGeoms.length;i++){
			var Bb = BuildingGeoms[i];
			var Barcs = Bb.arcs;
			if (Barcs){
				var B = {id:Bb.properties.id,h:Bb.properties.height?Bb.properties.height:30.0,kind:Bb.properties.kind, name:Bb.properties.name, street: Bb.properties["addr_street"], housenumber: Bb.properties.addr_housenumber, arcs:[]};
				var Tarcs = B.arcs;
				for(var k = 0;k<Bb.arcs.length;k++){
					Tarcs.push(Sarcs[Barcs[k]]);
				}
				KindSet[B.kind] = true;
				Bset.push(B);
			}
		}
		var PlacesGeoms = objects.places.geometries;
		for (var i = 0;i<PlacesGeoms.length;i++){
			var Bb = PlacesGeoms[i];
			if (Bb.type =="Point")
			{
				var x = Bb.coordinates[0];;
				var y = Bb.coordinates[1];;
				Labels.push({x:x, y:y, kind:Bb.properties.kind, name: Bb.properties.name, scalerank: Bb.properties.scalerank})
				// console.log(Bb.properties.kind, Bb.properties);
			}
			else{
				console.log(Bb);
			}

		}
		var WaterGeoms = objects.water.geometries;
		for (var i = 0;i<WaterGeoms.length;i++){
			var Bb = WaterGeoms[i];
			DecodeAndAdd(Bb, Wset, Sarcs, "water");
		}
		var EarthGeoms = objects.earth.geometries;
		for (var i = 0;i<EarthGeoms.length;i++){
			var Bb = EarthGeoms[i];
			DecodeAndAdd(Bb, Eset, Sarcs, "earth" );
		}

		var LandUseGeoms = objects.landuse.geometries
		for (var i = 0;i<LandUseGeoms.length;i++){
			var Bb = LandUseGeoms[i];
			if (this.displaykinds[Bb.properties.kind]){
				DecodeAndAdd(Bb, Lset, Sarcs, "landuse" );
			}
		}

		for (var i = 0;i<objects.roads.geometries.length;i++){
			var Bb = objects.roads.geometries[i];
			var B = { arcs:[], kind: Bb.properties.kind};
			var Barcs = Bb.arcs;
			for(var k = 0;k<Barcs.length;k++){
				B.arcs.push(Sarcs[Barcs[k]]);
			}
			Rset.push(B);
			KindSet[B.kind] = true;
		}

		/*  Skip transits for now..
		for (var i = 0;i<objects.transit.geometries.length;i++){
			var Bb = objects.transit.geometries[i];
			var B = { arcs:[]};

			for(var k = 0;k<Bb.arcs.length;k++){
				B.arcs.push(Sarcs[Bb.arcs[k]]);
			}
			KindSet[B.kind] = true;
			//Rset.push(B);
		}*/


		//target.buildings = Bset;
		//target.roads = Rset;
		target.Labels = Labels;
		//target.waters = Wset;
		//target.earths = Eset;
		//target.landuses = Lset;

		var empty = []
		target.roadVertexBuffer = this.buildRoadPolygonVertexBuffer(Rset);
		//target.roadVertexBuffer = this.buildRoadPolygonVertexBuffer([]);
		target.buildingVertexBuffer = this.buildBuildingVertexBuffer(Bset);

	if(1){
		var geomsize = 0
		geomsize += this.calculateAreaPolygonVertexBuffer(Eset)
		geomsize += this.calculateAreaPolygonVertexBuffer(Lset)
		geomsize += this.calculateAreaPolygonVertexBuffer(Wset)
		var landmesh = LandVertexStruct.array(geomsize)

		this.buildAreaPolygonVertexBuffer(Eset,landmesh)
		this.buildAreaPolygonVertexBuffer(Lset, landmesh)
		this.buildAreaPolygonVertexBuffer(Wset, landmesh)
		target.landVertexBuffer = landmesh
	}

	//	target.landVertexBuffer = this.buildAreaPolygonVertexBuffer(Wset);

	}
})
