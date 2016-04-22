/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the 'License'); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, $server$, service){

	var earcut = require('$system/lib/earcut-port.js')().earcut
	var styleset = require('$widgets/map/mapstyle.js')()

	this.TileSize = 256.0;

	var KindSet = this.KindSet = {};
	var UnhandledKindSet = this.UnhandledKindSet = {};

	var roadwidths = {
			water: 20,
			ferry: 6,
			Ferry: 6,
			rail: 6,
			railway: 6,
			racetrack:6,
			minor_road: 4,
			major_road: 6,
			path: 4, highway:15,
			Road: 200
	}

	var roadcolors = {
		water:'#30a0ff',
		path:'#d0d0d0',
		ferry:'lightblue',
		rail: vec4('purple'),
		minor_road: vec4('#505050'),
		major_road: vec4('#404040'),
		highway:vec4('#303030')
	}

	var roadmarkcolors = {
		water:'#30a0ff',
		major_road:'white',
		 minor_road:'#a0a0a0'
	}

	//this.ignoreuse = {}
	//this.displaykinds = {}
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
		building:true,
		canal: true,
		land:true,
		park:true,
		parking:true,
		pitch:true,
		footway:true,
		playground:true,
		wood:true,
		residential:true,
		farm:true,
		rail:true,
		wetland:true,
		aerodrome:true,
		farmyard:true, scrub:true,
		forest:true,nature_reserve:false,riverbank:true, railway:true, runway:true, farmland:true
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
		runway:true, school:true, scrub:true, sports_centre:true, stadium:true, taxiway:true, theatre:true, university:true, village_green:true, wetland:true, wood:true, 'urban area':true, park:true, 'protected land':true, protected_area:true
	};

	var mapstyle = this.mapstyle = 	styleset.mapstyle;

	if (true){

		for (var a in this.mapstyle){
			var st = this.mapstyle[a];
		//	if (st.color1) st.color1 = vec4.desaturate(st.color1,0.85);
		//	if (st.color2) st.color2 = vec4.desaturate(st.color2,0.84);

		}
	}

	this.dumpkindset = function(){
		var mapstylestring = 'var mapstyle = {\n';
		for(var i in KindSet){
			mapstylestring += '\t' + i + ':{\n';
			if (landoffsets[i]) mapstylestring += '\t\toffset:' + landoffsets[i]+ ',\n '
			if (landcolor1[i]) mapstylestring += '\t\tcolor1: vec4(' + vec4(landcolor1[i])+ '),\n '
			if (landcolor2[i]) mapstylestring += '\t\tcolor2: vec4(' + vec4(landcolor2[i])+ '),\n '
			if (roadcolors[i]) mapstylestring += '\t\troadcolor: vec4(' + vec4(roadcolors[i])+ '),\n '
			mapstylestring +='\t},\n';
			// console.log('Handled:', i);
		}
		for(var i in UnhandledKindSet){
			console.log('Unhandled:' , i, UnhandledKindSet[i]);
		}
		mapstylestring += '\tdefault:\n\t{\n\t\tcolor1:vec4("red")\n\t}\n}';
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
		geom:vec4,//sidevec:vec2
		//geom:vec3,
		color: vec4
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
		var buildingcolor = mapstyle.building.color1;
		var c0 = buildingcolor[0];
		var c1 = buildingcolor[1];
		var c2 = buildingcolor[2];

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
					mesh.push(A1[0],A1[1],0, c0*c,c1*c,c2*c, 1, i,bid,theH);
					mesh.push(A2[0],A2[1],0, c0*c,c1*c,c2*c, 1, i,bid,theH);
					mesh.push(A2[0]+isox,A2[1]+isoy,theH, c0*c,c1*c,c2*c, 1, i,bid,theH);
					mesh.push(A1[0],A1[1],0, c0*c,c1*c,c2*c, 1, i,bid,theH);
					mesh.push(A2[0]+isox,A2[1]+isoy,theH, c0*c,c1*c,c2*c, 1, i,bid,theH);
					mesh.push(A1[0]+isox,A1[1]+isoy,theH, c0*c,c1*c,c2*c, 1, i,bid,theH);
					A1 = A2;
				}
				c = 1.0
				for(var a = 0;a<tris.length;a++){
					var atri = tris[a];
					mesh.push(atri[0]+isox,atri[1]+isoy,theH, c0*c,c1*c,c2*c, 1, i,bid,theH);
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

			var color1 = vec4(1,0,1,1);;
			//var color2 = ;
			var t = mapstyle[land.kind];
			if (!t) {
				t = mapstyle['default'];
			//	console.log('defaulting for:', land.kind);
			};

			if (t.color1) color1 = t.color1;else {
				UnhandledKindSet[land.kind] = 'land - no color1';
				console.log('no color for: ', land.kind);
			}
			//if (t.color2) color2 = t.color2;else UnhandledKindSet[land.kind] = 'land - no color2 ';
			//if (t.offset) off = t.offset;else UnhandledKindSet[land.kind] = 'land - no offset'

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

	this.buildRoadPolygonVertexBuffer = function(roads, zoomlevel){
		if (!zoomlevel) zoomlevel = 10;
		var mesh = RoadVertexStruct.array();
		var z = 10;
		for (var i = 0;i<roads.length;i++){

			var R = roads[i];
			var linewidth = 3;
			var color = vec4('gray') ;

			var st = mapstyle[R.kind];
			if (!st) st = mapstyle['default'];
			if (roadwidths[R.kind]) linewidth = roadwidths[R.kind];else
			{
				//console.log('no width:', R.kind);
				UnhandledKindSet[R.kind] = 'road' ;
			}

			linewidth *= Math.pow(2.0, zoomlevel - 13);
			if (st.roadcolor){
				color = st.roadcolor
			}else {
				UnhandledKindSet[R.kind] = 'road' ;
				//console.log('roadkind with no color', R.kind);
			}


			var colorid = i;
			//var markcolor = color;
			//if (roadmarkcolors[R.kind]) markcolor = vec4(roadmarkcolors[R.kind]);
			// linewidth *= Math.pow(2, this.view.zoomlevel-14);

			var showcaps = false;
			var showfill = true;
			var showcorner = true;

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
				var pre_side_delta = vec2.rotate(predelta, 3.1415/2.0);

				var dist = 0;
				var dist2 = 0;
				var lastsdelta = vec2(0,0);

				if (showcaps){
					mesh.push(
						nx,
						ny,
						pre_side_delta[0],
						pre_side_delta[1],
						1,
						dist,
						linewidth,
						colorid,
						color[0],
						color[1],
						color[2],
						color[3]
					)
					mesh.push(
						nx,
						ny,
						pre_side_delta[0],
						pre_side_delta[1],
						-1,
						dist,
						linewidth,
						colorid,
						color[0],
						color[1],
						color[2],
						color[3]
					);
					mesh.push(
						nx - predelta[0]*linewidth*0.5,
						ny - predelta[1]*linewidth*0.5,
						pre_side_delta[0],
						pre_side_delta[1],
						0.5,
						-linewidth,
						linewidth,
						colorid,
						color[0],
						color[1],
						color[2],
						color[3]
					);

					mesh.push(
						nx - predelta[0]*linewidth*0.5,
						ny - predelta[1]*linewidth*0.5,
						pre_side_delta[0],
						pre_side_delta[1],
						0.5,
						-linewidth,
						linewidth,
						colorid,
						color[0],
						color[1],
						color[2],
						color[3]
					);
					mesh.push(
						nx - predelta[0]*linewidth*0.5,
						ny - predelta[1]*linewidth*0.5,
						pre_side_delta[0],
						pre_side_delta[1],
						-0.5,
						-linewidth,
						linewidth,
						colorid,
						color[0],
						color[1],
						color[2],
						color[3]
					);
					mesh.push(
						nx,
						ny,
						pre_side_delta[0],
						pre_side_delta[1],
						-1,
						dist,
						linewidth,
						colorid,
						color[0],
						color[1],
						color[2],
						color[3]
					);
				}

				var lastdelta = vec2(0);

				for(var a = 1;a<currentarc.length;a++){
					var A =currentarc[a];

					var tnx = nx + A[0];
					var tny = ny + A[1];
					var predelt = vec2( tnx - nx, tny - ny);
					var delta = vec2.normalize(predelt);
					var sdelta = vec2.rotate(delta, PI/2);


					var dist2 = dist +  vec2.len(predelt);
					if (a>1 && showcorner){
						mesh.push(nx,ny,lastsdelta[0], lastsdelta[1], 1, dist,linewidth,colorid, color[0], color[1], color[2], color[3]);
						mesh.push(nx,ny,   sdelta[0],    sdelta[1], 1, dist,linewidth,colorid, color[0], color[1], color[2], color[3]);
						mesh.push(nx,ny,   sdelta[0],    sdelta[1],-1, dist,linewidth,colorid, color[0], color[1], color[2], color[3]);

						mesh.push(nx,ny,lastsdelta[0], lastsdelta[1], 1, dist,linewidth,colorid, color[0], color[1], color[2], color[3]);
						mesh.push(nx,ny,sdelta[0], sdelta[1], -1, dist,linewidth,colorid, color[0], color[1], color[2], color[3]);
						mesh.push(nx,ny,lastsdelta[0], lastsdelta[1], -1, dist,linewidth,colorid, color[0], color[1], color[2], color[3]);

					}
					//color = vec4(0,1,0,0.2)
					if (showfill){
						mesh.push( nx, ny,sdelta[0], sdelta[1], 1, dist ,linewidth, colorid, color[0], color[1], color[2], color[3]);
					mesh.push( nx, ny,sdelta[0], sdelta[1], -1, dist ,linewidth, colorid, color[0], color[1], color[2], color[3]);
					mesh.push(tnx,tny,sdelta[0], sdelta[1], 1, dist2,linewidth, colorid, color[0], color[1], color[2], color[3]);

					mesh.push(nx,ny,sdelta[0], sdelta[1], -1, dist,linewidth, colorid, color[0], color[1], color[2], color[3]);
					mesh.push(tnx,tny,sdelta[0], sdelta[1],1, dist2,linewidth, colorid, color[0], color[1], color[2], color[3]);
					mesh.push(tnx,tny,sdelta[0], sdelta[1], -1, dist2,linewidth, colorid, color[0], color[1], color[2], color[3]);
					}
					lastsdelta = vec2(sdelta[0], sdelta[1]);
					dist = dist2;
					nx = tnx;
					ny = tny;
					lastdelta = delta;
				}
				//color = vec4('red');
				if (showcaps){
					mesh.push(nx,ny,lastsdelta[0], lastsdelta[1], 1, dist,linewidth, colorid, color[0], color[1], color[2], color[3]);
					mesh.push(nx,ny,lastsdelta[0], lastsdelta[1], -1, dist,linewidth, colorid, color[0], color[1], color[2], color[3]);
					mesh.push(nx + lastdelta[0]*linewidth*0.5,ny + lastdelta[1]*linewidth*0.5, lastsdelta[0], lastsdelta[1], 0.5, dist+linewidth*0.5, linewidth,colorid, color[0], color[1], color[2], color[3]);

					mesh.push(nx + lastdelta[0]*linewidth*0.5,ny + lastdelta[1]*linewidth*0.5, lastsdelta[0], lastsdelta[1], 0.5, dist+linewidth*0.5 ,linewidth,colorid, color[0], color[1], color[2], color[3]);
					mesh.push(nx + lastdelta[0]*linewidth*0.5,ny + lastdelta[1]*linewidth*0.5, lastsdelta[0], lastsdelta[1], -0.5, dist+linewidth*0.5,linewidth,colorid, color[0], color[1], color[2], color[3]);
					mesh.push(nx,ny, pre_side_delta[0], pre_side_delta[1],  -1, dist,linewidth,colorid, color[0], color[1], color[2], color[3]);
				}
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

		if (Bb.type == 'MultiLineString'){
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
			if (Bb.type == 'MultiPolygon'){
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
				if ( Bb.type == 'Polygon'){

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
					if (Bb.type == 'LineString'){
						for(var k = 0; k < Bb.arcs.length;k++){
							Tarcs.push(SourceArcs[Bb.arcs[k]]);
						}
					}
				}
			}
		}
		if (Bb.type == 'LineString' ){
			// ignore linestrings stuck in things expected to be polygons.
		}
		else{
			TargetSet.push(B);
		}
	}

	this.getRoadSortKey = function(kind){
		if (!kind) return 0;
		var s = mapstyle[kind];
		if (!s) return 0;
		if (s.sortkey) return s.sortkey;
		return 0;
	}

	this.sortroads = function(a, b) {
		return a.sortkey - b.sortkey;
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
				var B = {id:Bb.properties.id,h:Bb.properties.height?Bb.properties.height:30.0,kind:Bb.properties.kind, name:Bb.properties.name, street: Bb.properties['addr_street'], housenumber: Bb.properties.addr_housenumber, arcs:[]};
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
			if (Bb.type =='Point')
			{
				var x = Bb.coordinates[0];;
				var y = Bb.coordinates[1];;
				Labels.push({x:x, y:y, kind:Bb.properties.kind, name: Bb.properties.name, scalerank: Bb.properties.scalerank})
				if (!Bb.properties.scalerank){
					//console.log(Bb.properties);
				}
				// console.log(Bb.properties.kind, Bb.properties);
			}
			else{
				console.log(Bb);
			}

		}
		var WaterGeoms = objects.water.geometries;
		for (var i = 0;i<WaterGeoms.length;i++){
			var Bb = WaterGeoms[i];
			DecodeAndAdd(Bb, Wset, Sarcs, 'water');
		}
		var EarthGeoms = objects.earth.geometries;
		for (var i = 0;i<EarthGeoms.length;i++){
			var Bb = EarthGeoms[i];
			DecodeAndAdd(Bb, Eset, Sarcs, 'earth' );
		}

		var LandUseGeoms = objects.landuse.geometries
		for (var i = 0;i<LandUseGeoms.length;i++){
			var Bb = LandUseGeoms[i];
			if (this.displaykinds[Bb.properties.kind]){
				DecodeAndAdd(Bb, Lset, Sarcs, 'landuse' );
			}
			else{
				//console.log('ignoring', Bb.properties.kind);
			}
		}

		for (var i = 0;i<objects.roads.geometries.length;i++){
			var Bb = objects.roads.geometries[i];
			var B = { arcs:[], kind: Bb.properties.kind, sortkey: this.getRoadSortKey(Bb.properties.kind)};
			var Barcs = Bb.arcs;
			for(var k = 0;k<Barcs.length;k++){
				B.arcs.push(Sarcs[Barcs[k]]);
			}
			Rset.push(B);
			KindSet[B.kind] = true;
		}

		Rset.sort(this.sortroads);

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
		target.roadVertexBuffer = this.buildRoadPolygonVertexBuffer(Rset, target.z);
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
