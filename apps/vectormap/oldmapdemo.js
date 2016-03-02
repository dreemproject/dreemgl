/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function vectormap(require,  $server$, fileio,$ui$, numberbox, button, menubar, label, screen, view, foldcontainer, speakergrid,checkbox, icon, $widgets$, colorpicker,  jsviewer, radiogroup, $3d$, ballrotate, $$, urlfetch){

	define.class(this, "mainscreen", function($ui$, view){

	define.class(this, "tiledmap", function($ui$, view){

	var earcut = require('$system/lib/earcut-port.js')().earcut;

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
			verts.push(vec2(flatverts[idx * 2], flatverts[idx * 2 + 1]))
		}

		return verts
	}

	define.class(this, "building", function($ui$, view){

		this.attributes = {
			buildings: [],
			scalefactor: 1.0,
			currentbuilding: -1,
			currentbuildingid: -1
		}

		this.boundscheck = false

		this.onbuildings = function(){
			this.pickrange = this.buildings.length
			//console.log("setting pickrange:", this.pickrange);
		}

		this.pointerout = function(){
			this.currentbuilding = -1;
			this.currentbuildingid = -1;
		}

		this.pointerhover =  function(){
			var building = this.buildings[this.last_pick_id]
			this.currentbuilding = this.last_pick_id
			if(building){
				this.currentbuildingid = building.id;
				// console.log(this.currentbuildingid, building.id, building);
				var text = "Building"
				//console.log(building);
				if(building.kind) text += " " + building.kind
				if(building.name) text += " " + building.name
				if(building.street) text += " " + building.street
				if(building.housenumber) text += " " + building.housenumber
				this.screen.status = text
			}
			else {
				this.currentbuildingid = -1;
			}
		}

		this.bg = function(){

			this.vertexstruct =  define.struct({
				pos:vec3,
				color:vec4,
				id: float,
				buildingid: float
			})

			this.mesh = this.vertexstruct.array();
			this.color = function(){

				PickGuid = mesh.id;
				if (abs(view.currentbuilding - mesh.id)<0.2) return vec4(mesh.color.x, 0, 0, 1);
				if (abs(view.currentbuildingid - mesh.buildingid)<0.2) return vec4(mesh.color.x * 0.8, 0, 0, 1);
				//return pal.pal1(mesh.pos.z/300.-0.1*view.time +mesh.id/100.) * mesh.color
				return mesh.color;
			}

			this.update = function(){
				this.mesh = this.vertexstruct.array();

				for(var i = 0;i<this.view.buildings.length;i++){
					var building = this.view.buildings[i];

					var theH = building.h;
					var isofac =0
					var isox = (theH*0.5)*isofac
					var isoy = (theH)*isofac

					if (building.arcs)
					for(var j = 0;j<building.arcs.length;j++){
						var arc = building.arcs[j];
						var tris = arctotriangles(arc);
						var A1 = vec2(arc[0][0], arc[0][1])
						var OA1 = A1;
						var c = 0.3;
						for(var a = 1;a<arc.length+1;a++)
						{
							var ca = arc[a%arc.length];

							var A2 = vec2(A1[0] + ca[0], A1[1] + ca[1]);
							if (a  == arc.length){
								A2[1] -= OA1[1];
								A2[0] -= OA1[0];
							}

							c = 0.4 + 0.3 *Math.sin(Math.atan2(A2[1]-A1[1], A2[0]-A1[0]));

							this.mesh.push(A1[0],A1[1],0, c,c,c, 1, i,building.id);
							this.mesh.push(A2[0],A2[1],0, c,c,c, 1, i,building.id);
							this.mesh.push(A2[0]+isox,A2[1]+isoy,theH, c,c,c, 1, i,building.id);
							this.mesh.push(A1[0],A1[1],0, c,c,c, 1, i,building.id);
							this.mesh.push(A2[0]+isox,A2[1]+isoy,theH, c,c,c, 1, i,building.id);
							this.mesh.push(A1[0]+isox,A1[1]+isoy,theH, c,c,c, 1, i,building.id);
							A1 = A2;

						}
						c = 0.4
						for(var a = 0;a<tris.length;a++){
							this.mesh.push(tris[a][0]+isox,tris[a][1]+isoy,theH, c,c,c, 1, i,building.id);
						}
					}
				}
			}

			this.position = function(){
				return vec4(mesh.pos.x, 1000-mesh.pos.y, mesh.pos.z, 1) * view.totalmatrix * view.viewmatrix
			}

			this.drawtype = this.TRIANGLES
			this.linewidth = 4

		}
	})

	define.class(this, "land", function($ui$, view){
		this.boundscheck = false
		this.attributes = {
			lands:[],
			currentland: -1
		}

		this.pointerhover =  function(evt){
			this.currentland = this.last_pick_id ;
			var text = "Land: " + this.lands[this.last_pick_id ].kind;
			this.screen.status = text;
		}
		this.pointerout = function(){
			this.currentland = -1;
		}

		this.onlands = function(){
			this.pickrange = this.lands.length;
		}

		this.bg = function(){

			this.color1 = {farm:vec4(1,1,0.1,0.5), retail:vec4(0,0,1,0.5), tower:"white",library:"white",common:"white", sports_centre:"red", bridge:"gray", university:"red", breakwater:"blue", playground:"lime",forest:"darkgreen",pitch:"lime", grass:"lime", village_green:"green", garden:"green",residential:"gray" , footway:"gray", pedestrian:"gray", water:"#40a0ff",pedestrian:"lightgray", parking:"gray", park:"lime", earth:"lime", pier:"#404040", "rail" : vec4("purple"), "minor_road": vec4("orange"), "major_road" : vec4("red"), highway:vec4("black")}
			this.color2 = {farm:vec4(1,1,0.1,0.5), retail:vec4(0,0,1,0.5), tower:"gray", library:"gray", common:"gray", sports_centre:"white", bridge:"white", university:"black", breakwater:"green", playground:"red", forest:"black",pitch:"green", grass:"green", village_green:"green", garden:"#40d080", residential:"lightgray" , footway:"yellow", pedestrian:"blue",water:"#f0ffff",pedestrian:"yellow", parking:"lightgray", park:"yellow", earth:"green", pier:"gray", "rail" : vec4("purple"), "minor_road": vec4("orange"), "major_road" : vec4("red"), highway:vec4("black")}
			this.landoffsets = {
					retail:27,
					tower:26,
					library:25,
					common:24,
					sports_centre:-23,
					bridge:-22,
					university:-21,
					breakwater:-20,
					playground:-19,
					forest:-18,
					pitch:-17,
					grass:-16,
					village_green:-15,
					garden:-14,
					residential:-13,
					footway:-12,
					pedestrian:-11,
					water:-5,
					pedestrian:-9,
					parking:-8,
					park:-7,
					earth:10,
					pier:-5,
					"rail" : -4,
					"minor_road":-55,
					"major_road" :-55, highway:-55}

			this.vertexstruct =  define.struct({
				pos:vec3,
				color1:vec4,
				color2:vec4,
				id: float
			})


			this.mesh = this.vertexstruct.array();

			this.color = function(){
				var xy = vec2(mesh.pos.xy)*0.2
				//var n1 = (noise.noise2d(xy))*0.25 + 0.25;
				//var n2 = 0.8*noise.noise2d(xy*2.3)
				var themix = 0.5
				PickGuid = mesh.id
				if (abs(view.currentland - mesh.id)<0.2) return "red";
				//mod(mesh.id, 256.)
				//PickGuid.y = floor(mesh.id/256.)
				return mix(mesh.color1, mesh.color2,themix);
			}

			this.update = function(){
				this.mesh = this.vertexstruct.array();
				var z = 0
				for(var i = 0;i<this.view.lands.length;i++){
					var off = 0;
					//z+=0.1;
					var land = this.view.lands[i];

					var color1 = vec4("black");
					var color2 = vec4("black");

					if (this.color1[land.kind]) color1 = this.color1[land.kind];else UnhandledKindSet[land.kind] = true;
					if (this.color2[land.kind]) color2 = this.color2[land.kind];else UnhandledKindSet[land.kind] = true;
					if (this.landoffsets[land.kind]) off = this.landoffsets[land.kind];

					if (land.arcs){
						for(var j = 0;j<land.arcs.length;j++){
							var arc = land.arcs[j];
							var tris = arctotriangles(arc);
							for(var a = 0;a<tris.length;a++){
								this.mesh.push(tris[a],off, vec4(color1), vec4(color2), i);
							}
						}
					}
				}
			}

			this.position = function(){
				var r = vec4(mesh.pos.x, 1000-mesh.pos.y, 0, 1) * view.totalmatrix * view.viewmatrix;


				r.w -= mesh.pos.z*0.01;
				return r
			}

			this.drawtype = this.TRIANGLES
			this.linewidth = 4
		}
	})

	define.class(this, "road", function($ui$, view){
		this.boundscheck = false;

		this.attributes = {
			roads:[],
			zoomlevel: 16,
			zoomscale: 2.0
		}
		this.bg = function(){
			this.vertexstruct =  define.struct({
				pos:vec3,
				color:vec4,
				side: float,
				dist: float,
				linewidth:float,
				sidevec:vec2,
				markcolor: vec4
			})

			this.mesh = this.vertexstruct.array();

			this.color = function(){
				if (abs(mesh.side) > 0.85) return mix("black", mesh.color, 0.8)
			//	if (abs(mesh.side) > 0.75) return mix(mesh.markcolor, mesh.color, 0.6)
					if (abs(mesh.side) < 0.1) return  mix(mesh.markcolor, mesh.color, 0.6 * (min(1., max(0.0,0.8 + 5.0*sin(mesh.dist*0.5)))))
				return mesh.color;
			}

			this.widths = {water:20, path:2,ferry:4, "rail" : 4, "minor_road": 8, "major_road" : 12, path: 3, highway:12}
			this.colors = {water:"#30a0ff", path:"#d0d0d0", ferry:"lightblue", "rail" : vec4("purple"), "minor_road": vec4("#505050"), "major_road" : vec4("#404040"), highway:vec4("#303030")}
			this.markcolors = {water:"#30a0ff", major_road:"white", minor_road:"#a0a0a0"}

			this.update = function(){
				//console.log("updating");
				this.mesh = this.vertexstruct.array();
				var 	z = 0.1;

				for (var i = 0;i<this.view.roads.length;i++){


							console.log(z);
					var R = this.view.roads[i];
					//console.log(R);
					var linewidth = 3;
					var color = vec4("gray") ;
					if (this.widths[R.kind]) linewidth = this.widths[R.kind];
					if (this.colors[R.kind]) color = vec4(this.colors[R.kind]);
					var markcolor = color;
					if (this.markcolors[R.kind]) markcolor = vec4(this.markcolors[R.kind]);

				//	linewidth *= Math.pow(2, this.view.zoomlevel-14);

					for(var rr = 0;rr<R.arcs.length;rr++){

						//z+=10 ;

						var currentarc = R.arcs[rr]
						if (currentarc.length == 1){
							continue
						}
						//	console.log(R, currentarc, currentarc.length, currentarc[0].length);

						//console.log(R, currentarc);
						//continue;
						var A0 = currentarc[0];
						var A1 = vec2(currentarc[1][0]+A0[0],currentarc[1][1]+A0[1]) ;

						//this.mesh.push(A0[0], A0[1], this.view.color);
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
						this.mesh.push(nx,ny,z, color, 1, dist,linewidth,presdelta, markcolor);
						this.mesh.push(nx,ny,z, color, -1, dist,linewidth,presdelta, markcolor);

						this.mesh.push(nx - predelta[0]*linewidth*0.5,ny - predelta[1]*linewidth*0.5,z, color, 0.5, -10 ,linewidth,presdelta, markcolor);

						this.mesh.push(nx - predelta[0]*linewidth*0.5,ny - predelta[1]*linewidth*0.5,z, color, 0.5, -10 ,linewidth,presdelta, markcolor);
						this.mesh.push(nx - predelta[0]*linewidth*0.5,ny - predelta[1]*linewidth*0.5,z, color, -0.5, -10 ,linewidth,presdelta, markcolor);

						//this.mesh.push(nx,ny, color, 1, dist,linewidth,presdelta, markcolor);
						this.mesh.push(nx,ny, z, color, -1, dist,linewidth,presdelta, markcolor);


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
								this.mesh.push(nx,ny,z, color, 1, dist,linewidth,lastsdelta, markcolor);
								this.mesh.push(nx,ny,z, color, 1, dist,linewidth,sdelta, markcolor);
								this.mesh.push(nx,ny,z, color, -1, dist,linewidth,sdelta, markcolor);

								this.mesh.push(nx,ny,z, color, 1, dist,linewidth,lastsdelta, markcolor);
								this.mesh.push(nx,ny,z, color,-1, dist,linewidth,sdelta, markcolor);
								this.mesh.push(nx,ny,z, color, -1, dist,linewidth,lastsdelta, markcolor);

							}
							//color = vec4(0,1,0,0.2)
							this.mesh.push( nx, ny,z,color, 1, dist ,linewidth, sdelta, markcolor);
							this.mesh.push( nx, ny,z,color,-1, dist ,linewidth, sdelta, markcolor);
							this.mesh.push(tnx,tny,z,color, 1, dist2,linewidth, sdelta, markcolor);

							this.mesh.push(nx,ny,z,color,-1, dist,linewidth, sdelta, markcolor);
							this.mesh.push(tnx,tny,z,color,1,dist2,linewidth, sdelta, markcolor);
							this.mesh.push(tnx,tny,z,color,-1, dist2,linewidth, sdelta, markcolor);

							lastsdelta = vec2(sdelta[0], sdelta[1]);
							dist = dist2;
							nx = tnx;
							ny = tny;
							lastdelta = delta;
						}
						//color = vec4("red");
						this.mesh.push(nx,ny,z, color, 1, dist,linewidth,lastsdelta, markcolor);
						this.mesh.push(nx,ny,z, color, -1, dist,linewidth,lastsdelta, markcolor);
						this.mesh.push(nx + lastdelta[0]*linewidth*0.5,ny + lastdelta[1]*linewidth*0.5,z, color, 0.5, dist+linewidth*0.5 ,linewidth,lastsdelta, markcolor);

						this.mesh.push(nx + lastdelta[0]*linewidth*0.5,ny + lastdelta[1]*linewidth*0.5,z, color, 0.5, dist+linewidth*0.5 ,linewidth,lastsdelta, markcolor);
						this.mesh.push(nx + lastdelta[0]*linewidth*0.5,ny + lastdelta[1]*linewidth*0.5,z, color, -0.5, dist+linewidth*0.5,linewidth,lastsdelta, markcolor);
						this.mesh.push(nx,ny, z,color, -1, dist,linewidth,presdelta, markcolor);

					}
				}
			}
			this.position = function(){
				var pos = mesh.pos.xy + mesh.sidevec * mesh.side * view.zoomscale*mesh.linewidth*0.5;
				var res = vec4(pos.x, 1000-pos.y, 0, 1.0) * view.totalmatrix * view.viewmatrix;
				res.w += mesh.pos.z;
				return res
			}

			this.drawtype = this.TRIANGLES
			this.linewidth = 4;

		}
	})

		var KindSet = this.KindSet = {};
		var UnhandledKindSet = this.UnhandledKindSet = {};


		//9647*2,12320*2
		//33656,21534
		var L = 0;

		this.attributes = {
			mapxcenter: Math.floor(9647*2/Math.pow(2, L)),
			mapycenter: Math.floor(12320*2/Math.pow(2,L)),
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

		this.moveTo = function(x,y,z){
			this.mapxcenter = x;
			this.mapycenter = y;
			this.zoomlevel = z;
		}

		this.setZoomLevel = function(z, width, height){
			//console.log(z, width, height);

			var x = Math.ceil((width * z )/ 1024);
			var y = Math.ceil((height * z )/ 1024);
		//	this.find("theroads").zoomscale = z;
			//console.log(x,y);
			//console.log(z, Math.floor(log(z)/log(2)));
		//	this.zoomlevel = 16  + Math.floor( log(z)/log(2));
		}

		this.render = function(){
		//console.log(	this.screen.width);
			var res = []
			var scalefac = Math.pow(2, this.zoomlevel - 16);
			var scaler = 1024 ;//* scalefac;
				for(var x = 0;x<6;x++){
				for(var y = 0;y<6;y++){
					res.push(
						this.maptile({
							name:"tile1",
							tilex: this.mapxcenter + x,
							tiley: this.mapycenter + y,
							position:"absolute",
							x: x * scaler ,
							y: y * scaler   ,
							scalefac: scalefac,
							//width: scaler,
							//height: scaler,
							zoomlevel: this.zoomlevel,
						})
					)
				}
			}
			return res;
		}

		this.tilesets = [];

		define.class(this, "maptile", function($ui$, view){

			this.attributes = {
				tilex:19295,
				tiley:24641,
				zoomlevel: 16,
				arcs:[],
				buildings:[],
				roads:[],
				roadpolies:[],
				waters:[],
				earths:[],
				landuses:[]	,
				scalefactor: 1.0
			}

			this.init = function(){
				this.rpc.urlfetch.grabmap(this.tilex, this.tiley, this.zoomlevel).then(function(result){
					this.loadstring(result.value)
				}.bind(this));
			}

			this.loadstring = function(str){
				this.thedata = JSON.parse(str);

					var Bset = [];
					var Rset = [];
					var Wset = [];
					var Eset = [];
					var Lset = [];

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
						//console.log(Bb);
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
//										console.log(l, sourcearc[l]);
										x+= sourcearc[l][0];
										y+= sourcearc[l][1];
										arc.push(x,y);
	//									arc.push(sourcearc[l]);
									}
								}
								B.arcs.push(arc);
							}
							else
							for(var k = 0; k < Bb.arcs.length;k++){
								B.arcs.push(this.thedata.arcs[Bb.arcs[k]]);

						}
						if (Bb.type == "LineString" ){
							//Rset.push(B);
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

					this.buildings = Bset;
					this.roads = Rset;
					this.waters = Wset;
					this.earths = Eset;
					this.landuses = Lset;
					//for(var i in KindSet){console.log(i)};
			}

			this.load = function(name){
				this.rpc.fileio.readfile("$apps/VectorMap/"+name  ).then(function(result){
					this.loadstring(result.value);
				}.bind(this));
			}

			this.render = function(){
				var res = [];
				res.push(this.outer.land({lands:this.earths}));
				res.push(this.outer.land({lands:this.landuses}));
				res.push(this.outer.land({lands:this.waters}));
				res.push(this.outer.road({name:"theroads", roads: this.roads, zoomscale:Math.pow(2.0, this.zoomlevel-15)}));
				res.push(this.outer.building({buildings: this.buildings}));
				return res;
			}
		})
	})

		this.render = function(){
			return this.tiledmap({name:"themap"});
		}

	})

	var myclass = define.class('$system/base/node', function(){
	})

	this.render = function(){ return [
		fileio(),
		urlfetch({name:"urlfetch"}),

		screen({name:"index", style:{
					$:{
						fontsize:12
					}
				},
				moveTo: function(x,y,zoom){
					this.find("themap").moveTo(x,y,zoom);
				},
				onstatus:function(){this.find("themenu").infotext = this.status;},
				clearcolor:vec4('#303030'), overflow:'hidden', title:"VectorMap"},
				menubar({
					name:"themenu",menus:[
						{name:"File", commands:[
							{name:"Dump KindSet", clickaction:function(){for(var i in this.find("themap").KindSet){console.log(i)};for(var i in this.find("themap").UnhandledKindSet){console.log("unhandled:", i)};}}
						]}
					]}
				),
				myclass({}),
				view({flex:1, overflow:"scroll", bgcolor:"darkblue", clearcolor:"#505050", onzoom: function(){this.find("themap").setZoomLevel(this.zoom, this.layout.width, this.layout.height);}},
				this.mainscreen({ name:"mainscreen",
					//perspective cam:
					//camera:[0,0,1000 ], lookat:[1000,1000,0],nearplane:10, farplane:12000, up:[0,0,-1],viewport:"3d",
					// "ortho" cam:
					camera:vec3(3000,3000,6000), fov:30, lookat:vec3(3000,3000,0),nearplane:10, farplane:12000, up:vec3(0,1,0),viewport:"3d",
					boundscheck:false, flex:1,
				}),
				ballrotate({name:"ballrotate1", position:"absolute",width:100, height:100, target:"mainscreen"})
			)
		)

		,screen({
			name:"remote",
			style:{$:{fontsize:12}},
			init:function(){
				console.log(this.rpc.index)
			},
			clearcolor:vec4('darkgray'), overflow:'hidden', title:"VectorMap remote" },
			speakergrid({justifycontent:"center", alignitems:"center" }, view({width:300, bg:0, flexdirection:"column", alignself:"center"}
			,label({fontsize:40, text:"Vectormap" , bg:0})
			,button({text:"Manhattan",click:function(){this.rpc.index.moveTo(9647*2,12320*2, 16);}, margin:2})
			,button({text:"Amsterdam",click:function(){this.rpc.index.moveTo(33656,21534, 16);}, margin:2})
			,button({text:"Noord Amsterdam",click:function(){this.rpc.index.moveTo(33656,21434, 16);}, margin:2})
			,button({text:"Sausalito",click:function(){this.rpc.index.moveTo(9647,12320, 16);}, margin:2})
			,button({text:"San Fransisco",click:function(){this.rpc.index.moveTo(9647,12320, 16);}, margin:2})
			))
		)
	]}
})
