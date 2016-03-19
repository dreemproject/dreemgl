/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class("$ui/view", function(require, $ui$, view, label, button, labelset, $$, geo, urlfetch)
{

	var BufferGen = require("$widgets/map/mapbuffers")();
	var geo = this.geo = geo();

	this.attributes = {
		// TODO(aki): Why latlong inverse?
		latlong:  Config({type: vec2, value: vec2(52.3608307, 4.8626387)}),
		//
		zoomlevel: Config({type: Number, value: 16}),
		latlongchange: Config({type: Event})
	}

	function createHash (x, y, z){
		return x + "_" + y + "_" + z;
	}

	this.zoomTo = function(z, time){
		this.dataset.zoomTo(z, time);
		//this.updateTiles();
	}

	this.onpointerwheel = function(ev){
		if (!ev.touch) {
			this.zoomTo(this.dataset.zoomlevel - ev.wheel[1]/120);
		}
	}

	this.onpointerend = function(ev){
		this.stopDrag();
	}

	this.onpointerstart = function(ev){
		this.startDrag(ev);
	}

	this.onpointermove = function(ev){
		this.moveDrag(ev);
	}

	this.gotoCity = function(city, zoomlevel, time){
		this.dataset.gotoCity(city, zoomlevel, time);
	}


	this.flyTo = function(lat, lng, zoom, time){
		if (this.dataset) this.dataset.flyTo(lat,lng, zoom, time);
	}

	// data interaction, needs to inherit from view because of animation
	define.class(this, "mapdataset", "$ui/view", function($$, geo){

		this.requestPending = false;
		// all the blocks that need to be loaded (empty tile objects)
		this.loadqueue = [];
		// see if a block is in the queue (array of hashes)
		this.loadqueuehash = [];
		// hash of tile objects (simple objects containing all the geometry)
		this.loadedblocks = {};
		// geo library
		var geo = this.geo = geo();

		this.attributes = {
			// cent
			centerpos: vec2(0),
			// position of the map
			latlong: vec2(52.3608307, 4.8626387),
			// tile zoom level
			zoomlevel: 16,
			// amount of blocks in the cache
			throwawaythreshold: 50,
		}

		// animatedly fly to a lat/long/zoom position in time with fly bounce (zoom level switching)
		this.flyTo = function(lat, lng, zoom, time){
			time = time ? time : 0
			if (zoom > geo.default_max_zoom) zoom = geo.default_max_zoom;

			if (time > 0){
				var anim = {}
				anim[time] = {motion:"inoutquad", value: vec2(lat,lng)};
				this.latlong = Animate(anim);
				var anim = {}
				anim[time / 2] = {motion:"inoutquad", value: Math.min(zoom - 0.5, this.zoomlevel - 0.5)};
				anim[time] = {motion:"inoutquad", value: zoom};
				this.zoomlevel = Animate(anim);
			}
			else{
				this.zoomlevel = zoom;
				this.latlong = vec2(lat, lng)
			}
		}

		// animatedly fly to lat/long without fly-bouncing
		this.setCenterLatLng = function(lat, lng, zoom, time){
			time = time ? time : 0
			if (zoom > geo.default_max_zoom) zoom = geo.default_max_zoom;
			if (time > 0){
				var anim = {}
				anim[time] = {motion:"inoutquad", value: vec2(lat,lng)};
				this.latlong = Animate(anim);
			}
			else{
				this.latlong = vec2(lat,lng);
			}
			this.zoomTo(zoom, time);
		}

		// if zoomlevel changes update tiles
		this.onzoomlevel = function(){
			if(this.parent) {
				this.parent.updateTiles();
			}
		}

		// latlong changes, for all zoomlevels calculate tile centers
		this.onlatlong = function(){
			this.parent.latlong = this.latlong;
			var m = geo.latLngToMeters(this.latlong[0], this.latlong[1])
			m[0] = Math.round(m[0]);
			m[1] = Math.round(m[1]);
			var basecenter = geo.tileForMeters(m[0], m[1], 20);
			var compmeters = geo.metersForTile({x:basecenter[0],y:basecenter[1], z:20});

			var centerset = []
			for(var i =0; i<20; i++){
				var center = geo.tileForMeters(m[0], m[1], i);
				centerset.push([center.x,center.y]);
			}
			this.centers = centerset;
		}

		// zoom to animatedly zooms to a certain zoom
		this.zoomTo = function(newz, time){
			if (newz > geo.default_max_zoom) newz = geo.default_max_zoom;

			time = time? time : 0;
			if (time > 0)
			{
				var anim = {}
				anim[time] = {motion:"inoutquad", value:newz};
				this.zoomlevel = Animate(anim);
			}
			else{
				this.zoomlevel = newz;
			}
		}

		// set the center in tile position x/y/zoom, uses to setCenterLatLng
		this.setCenter = function(x,y,z, time){
			var m = geo.metersForTile({x:x, y:y, z:z})
			var ll = geo.metersToLatLng(m.x,m.y);
			this.setCenterLatLng(ll[0], ll[1], time);
			this.zoomTo(z, time);
		}

		// queues up a block for loading at x,y,z
		this.addToQueue = function(x, y, z){
			if (x < 0 || y< 0 || z< 0 || z>geo.default_max_zoom) return;
			var hash = createHash(x, y, z);
			if (this.loadqueuehash[hash]) return; // already queued for load.
			if (this.loadedblocks[hash]) return; // already loaded.

			this.loadqueuehash[hash] = 1;
			this.loadqueue.push({x:x, y:y, z:z});
			this.updateLoadQueue();
		}

		// Stores a loaded block into the loadedblocks structure
		this.processLoadedBlock = function(x, y, z, data){
			var hash = createHash(x,y,z);
			this.loadedblocks[hash] = {x:x, y:y, z:z, blockdata:data};
		}

		// prunes the loadedblocks to live below throwawaythreshold
		this.cleanLoadedBlocks = function(){
			var keys = Object.keys(this.loadedblocks)
			if (keys.length < this.throwawaythreshold) return

			var zscalar = 1280

			var dellist = [];
			for (var i = 0; i<keys.length; i++){
					var q = this.loadedblocks[keys[i]]
					var dx = this.centers[q.z][0] - q.x;
					var dy = this.centers[q.z][1] - q.y;

					var dz = (20-q.z)*zscalar;
					var dist = (dx * dx + dy * dy) * (50000 - dz);
					dellist.push({hash:keys[i], dist:dist})

				}

				dellist = dellist.sort(function(a,b){
					if (a.dist > b.dist) return 1;
					if (a.dist < b.dist) return -1;
					return 0;
				});

			for(var i =this.throwawaythreshold ; i<dellist.length; i++){
				var todelete = dellist[i];
				delete this.loadedblocks[todelete.hash];
			}
		}

		// the geometry generation worker
		var worker = define.class('$system/rpc/worker', function(require){
			this.BufferGen = require("$widgets/map/mapbuffers")();

			this.build = function(str, r){
				var ret = vec2.array(10)

				try{
					var thedata = JSON.parse(str);
					this.BufferGen.build(r, thedata);
				}
				catch(e){
					console.log(e);
					console.log(" while loading ", r.x, r.y, r.z);
					r.transform = {translate:{x:0, y:0}};
				}
				return r;
			}
		})

		// loads a json string tile and sends it off to the worker
		this.loadstring = function(str){
			// if (!window.teller) window.teller = 0;
			// window.teller += str.length;

			if (this.currentRequest) {

				var r = this.currentRequest;
				var hash = createHash(r.x, r.y, r.z);
				r.hash = hash;

				this.workers.build(str, r).then(function(result){
					if(!result) return
					var dt = Date.now()
					this.loadedblocks[r.hash] = result.value
					this.loadqueuehash[r.hash] = undefined;
					this.parent.redraw()//updateTiles();
				}.bind(this))

				this.currentRequest = undefined;
				this.cleanLoadedBlocks();
				this.updateLoadQueue();
			}
		}

		// returns a block by hash
		this.getBlockByHash = function(hash){
			return this.loadedblocks[hash];
		}

		// Check if there are tiles in the queue and loads the next one via RPC
		this.updateLoadQueue = function(){

			if (this.currentRequest) return; // already loading something...
			if (this.loadqueue.length > 0){

				var zscalar = 1280;

				// sort queue on distance to cursor
				for (var i = 0; i<this.loadqueue.length; i++){
					var q = this.loadqueue[i];
					var dx = this.centers[q.z][0] - q.x;
					var dy = this.centers[q.z][1] - q.y;

					var dz = (20-q.z)*zscalar;
					q.dist = (dx * dx + dy * dy) * (50000 - dz);
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
			}
		}

		this.destroy = function(){
			this.clearInterval(this.theinterval);
		}

		// looks up a city by latlong in city dictionary
		this.gotoCity = function(name, zoom, time){
			if (!name || name.length == 0) return ;
			var n2 = name.toLowerCase().replace(' ', '');

			var c = this.cities[n2];
			if (c){
				this.setCenterLatLng(c[1], c[0], zoom,time);
			}
			else{
				console.log("city not found:", name);
			}
		}

		this.init = function(prev){
			this.centers = [];

			this.workers = prev && prev.workers || worker(0)
			// lookup table of cities
			this.cities = {
				manhattan: [40.7072121, -74.0067985],
				amsterdam: [52.3608307,   4.8626387],
				sanfrancisco: [37.6509102,-122.4889338],
				//sanfrancisco: [37.8838923,-122.3398295],
				sanfrancisco_goldengatepark:[37.7677892,-122.4853213],
				seoul: [37.5275421, 126.9748078],
				seoel: [37.5275421, 126.9748078],
				shenzhen_hqb:[22.5402897,114.0846914],
				hongkong:[22.2854084,114.1600463],
				sydney:[-33.8466226,151.2277997],
				london:[51.5091502,-0.1471011],
				texel:[53.0731212,4.712878]
			}

			this.gotoCity("manhattan",13);

			// interval to poll the loadqueue
			//!TODO maybe remove
			this.theinterval = this.setInterval(function(){
				this.updateLoadQueue();
			}.bind(this), 100);

			this.rpc.urlfetch.sessionstart();
			//this.setCenter(33656/2,21534/2, 16)
		}
	})

	// Every time we re-draw process the
	this.atAnimate = function(){
		this.updateTiles();
		//this.setTimeout(this.updateTiles, 10);
	}

	// make a new dataset and updatetiles
	this.oninit = function(){
		this.dataset = this.mapdataset({name:"mapdata"});
		//!TODO odd redraw might miss? please remove
		this.setInterval(this.updateTiles, 1000);
	}

	// Unproject camera to XYZ (see GLU Unproject)
	function UnProject(glx, gly, glz, modelview, projection){
		var inv = vec4()
		var A = mat4.mat4_mul_mat4(modelview, projection)
		var m = mat4.invert(A)
		inv[0] = glx
		inv[1] = gly
		inv[2] = 2.0 * glz - 1.0
		inv[3] = 1.0
		out = vec4.vec4_mul_mat4(inv, m)
		// divide by W to perform perspective!
		out[0] /= out[3]
		out[1] /= out[3]
		out[2] /= out[3]
		return vec3(out)
	}

	// Project a mousecoord to map plane decoding (in, mouse, out, GL units)
	this.projectonplane = function(coord){
		var vp = this.find("mapinside");
		if (!vp) return;

		var sx = vp.layout.width;
		var sy = vp.layout.height;


		var mx = (coord[0] / (sx / 2)) - 1.0
		var my =  (coord[1] / (sy / 2)) - 1.0

		var view = vp.colormatrices.lookatmatrix;
		var invview = mat4.identity();
		mat4.invert(view, invview)

		var aspect = vp.layout.width/vp.layout.height;
		var nearheight = Math.tan((vp.fov/2)*((Math.PI*2)/360.0)) * vp.nearplane;
		var nearwidth = nearheight * aspect;
		var zeropos = vec4(0,0,0,1.0);
		var camerainview = vec4(mx*nearwidth,my*nearheight, -vp.nearplane,0.0);
		var zeroworld = vec4.mul_mat4(zeropos, invview)
		var cameraworld = vec4.mul_mat4(camerainview, invview)
		var end = vec3(zeroworld[0] + cameraworld[0]*1000, zeroworld[1] + cameraworld[1]*1000, zeroworld[2] + cameraworld[2]*1000)

		var R = vec3.intersectplane(zeroworld, end, vec3(0,1,0), 0)
		if (!R) return null;

		var M = this.find("MARKER");
		if (M){
			M.pos = vec3(R[0],R[1]-M.fontsize,R[2]);
			M.text =( Math.round(M.pos[0]*100)/100) + ", "+  ( Math.round(M.pos[2]*100)/100) ;
		}
		return R;
	}

	this.tap = function(ev){

		//
		var coord  =  this.globalToLocal(ev.position);
		var R = this.projectonplane(coord);
		if (R){
			//
			var centermeters = geo.latLngToMeters(this.dataset.latlong[0], this.dataset.latlong[1])

			var zoomoffs = 0;
			if (ev.clicker == 2) zoomoffs ++;

			// convert GL unit to map meters
			var r0 = (R[0]/(BufferGen.TileSize*16))*geo.metersPerTile(this.zoomlevel)*Math.pow(2.0, -this.fraczoom);
			var r2 = (-R[2]/(BufferGen.TileSize*16))*geo.metersPerTile(this.zoomlevel)*Math.pow(2.0, -this.fraczoom);

			//
			//	var M = this.find("MARKER");
			var latlong = geo.metersToLatLng(centermeters[0] + r0, centermeters[1]+ r2);
			this.dataset.setCenterLatLng(latlong[0], latlong[1] ,this.dataset.zoomlevel + zoomoffs, 1);
			this.emitUpward('latlongchange', [latlong[0], latlong[1], this.zoomlevel])
		}
	}

	this.startDrag = function(ev){
		var coord  =  this.globalToLocal(ev.position);
		var R = this.projectonplane(coord);
		if (R){
			this.startvect = vec2(R[0]/(BufferGen.TileSize * 16),R[2]/(BufferGen.TileSize * 16))
			var meters = geo.latLngToMeters(this.dataset.latlong[0], this.dataset.latlong[1]);
			this.startcenter =  vec2(this.dataset.latlong[0], this.dataset.latlong[1]);
			this.moveDrag(ev);
		}
	}

	this.moveDrag = function(ev){
		var coord  =  this.globalToLocal(ev.position);
		var R = this.projectonplane( coord);		if (R){

			this.newvect = vec2(  R[0]/(BufferGen.TileSize * 16),R[2]/(BufferGen.TileSize * 16) )
			var newcenter = vec2(
				(this.startvect[0] - this.newvect[0])*geo.metersPerTile(this.zoomlevel)*Math.pow(2.0, -this.fraczoom),
				-(this.startvect[1] - this.newvect[1])*geo.metersPerTile(this.zoomlevel)*Math.pow(2.0, -this.fraczoom)
			);
			//var meters = geo.metersForTile({x:newcenter[0], y:newcenter[1], z:this.zoomlevel});
			var latlong = geo.metersToLatLng(newcenter[0], newcenter[1]);
			latlong[0] += this.startcenter[0];
			latlong[1] += this.startcenter[1];
			this.dataset.setCenterLatLng(latlong[0], latlong[1] ,this.dataset.zoomlevel);
			this.updateTiles();
		}
	}

	this.stopDrag = function(){
		this.emitUpward('latlongchange', [this.latlong[0], this.latlong[1], this.zoomlevel])
	}
	// debug tile counter
	var alltiles = 0

	// All tiles use tilebasemixin
	var tilebasemixin = define.class(Object, function(){
		this.attributes = {
			// the translate in integer units
			trans: vec2(0),
			// the coordinate in integer units
			coord: vec2(0),
			// center coordinate in mercatormeters
			centerpos: vec2(4,3),
			// zoomlevel of the tile
			zoomlevel: 16,
			// animation for bufferloaded
			bufferloaded: 0.0,

			//tiletrans: vec2(0),
			// fog color
			fog: vec4("lightblue"),
			// fog start
			fogstart: 14000.0,
			// fog end
			fogend: 24000.,
			// how many zoom levels away from basezoom
			layeroffset: 0,
			// thickness of the layer
			layerzmult: 0,
			// layer z offset
			layerzoff: 0,
			// how far inbetween two zoomlevels you are
			fraczoom: 0.5,
			// center in mercatormeters
			centermeter: vec2(0),
			// how many meters a tile spans
			meterspertile: 1
		}
		// amount of frames it has waited since it got queued in the load
		this.frameswaited = 0;
		// not animated bufferloaded as boolean
		this.bufferloadbool = false

		this.onpointerend = function(ev){
			this.host.stopDrag();
		}

		this.onpointerstart = function(ev){
			this.host.startDrag(ev);
		}

		this.onpointermove = function(ev){
			this.host.moveDrag(ev);
		}

		this.pointertap = function(ev){

			this.host.tap(ev);
		}

		this.lastpos = vec2(0);

		// return the tile position
		this.calctilepos = function(){
			var x = Math.floor( this._coord[0] + this._trans[0]);
			var y = Math.floor(this._coord[1] + this._trans[1]);
			return [x,y,this._zoomlevel ];
		}

		this.init = function(){
			var R = this.calctilepos();
			this.tilename = "tile" + alltiles.toString() + "_"+ this.layeroffset;
			alltiles++;
			this.lastpos = vec3(R[0], R[1], R[2]);
		}

		// sets the position informatio of the tile
		this.setpos = function(newcoord, newzoom, frac, fraczoom, centermeter){
			this._tiletrans = frac;
			this._centermeter = centermeter;
			this._zoomlevel = newzoom;
			this._coord = vec2(Math.floor(newcoord.x), Math.floor(newcoord.y));
			this._fraczoom = fraczoom;
			this.checknewpos();
		}

		// calculate if the position changed since the last frame, used for tile buffer recycling
		// see if it should have a new vertexbuffer compared to last frame
		this.checknewpos = function(thetime){
			var R = this.calctilepos();
			var newpos = 	vec3(R[0], R[1], R[2]);
			if (this.lastpos[0] != newpos[0] || this.lastpos[1] != newpos[1] || this.lastpos[2] != newpos[2]){
				this.lastpos = newpos;
				this.tilehash = createHash(this.lastpos[0], this.lastpos[1], this.lastpos[2] );
				this.bufferloaded = 0;
				this.frameswaited = 0;
				this.bufferloadbool = false;
				this.queued  = 0;
				this.redraw();
				this.loadbuffer(thetime)
			}else{
				if (this.bufferloadbool == false) this.loadbuffer(thetime);else this.bl.lasttime = thetime;
			}
		}

		// loads the tile buffer, wraps around loadBufferFromTile
		// called in updateTiles
		this.loadbuffer = function(){
			md = this.mapdata;
			if (md){
				this.bl = md.getBlockByHash(this.tilehash);
				if (this.bl){
					if (this.loadBufferFromTile(this.bl)){

						if (this.frameswaited == 0 ) {
							this.bufferloaded = 1.0
						} else{
							this.bufferloaded = Animate({1:{value:1.0, motion:"inoutquad"}});
						}
						this.bufferloadbool = true;

						var trans = this.bl.transform.translate;
						var mercmeter = geo.latLngToMeters(trans[0], trans[1]);
						this.centerpos =vec2(mercmeter[0], mercmeter[1]);
						this.redraw();
					}
				}
				else{
					this.frameswaited++;
					if (this.queued == 0){
						if (this.shaders && this.shaders.hardrect && this.shaders.hardrect.update) this.shaders.hardrect.update();
						if (this.resetbuffer) this.resetbuffer();
						md.addToQueue(this.lastpos[0], this.lastpos[1], this.lastpos[2]);
						this.queued  = 1;
					}
				}
			}
		}

		this.tilesize = BufferGen.TileSize;
		this.width = this.tilesize;
		this.height = this.tilesize;
	})

	// view implementation of the building
	define.class(this,"buildingtile", "$ui/view", function(){
		this.is = tilebasemixin;
		this.loadBufferFromTile = function(tile){
			if (!this.shaders || !this.shaders.hardrect) return false;
			this.shaders.hardrect.mesh = tile.buildingVertexBuffer;
			return true;
		}

		this.hardrect = function(){

			this.position = function(){
				//idxpos = (  view.trans.xy*vec2(1,-1) ) * vec2(1,-1);;
				pos = vec2(1,-1)*mesh.pos.xy ;//+ (idxpos - view.tiletrans)* view.tilesize;
				pos.xy -= (((( view.centerpos- view.centermeter)) / view.meterspertile)*1024.0) * vec2(-1.0,1.0);
				pos.xy /= pow(2.0, view.layeroffset - view.fraczoom -2);
				//pos.xy *= view.meterspertile/view.tilesize;

				respos = vec4(pos.x, -((mesh.pos.z*1024.)/(view.meterspertile / pow(2.0, view.fraczoom))) * view.bufferloaded + view.layeroffset*view.layerzmult + view.layerzoff, pos.y, 1) * view.totalmatrix * view.viewmatrix ;
				//r.w += 0.002;
				return respos;
			}

			this.mesh =  BufferGen.BuildingVertexStruct.array();

			this.update = function(){
				this.mesh =  BufferGen.BuildingVertexStruct.array();
			}

			this.drawtype = this.TRIANGLES

			this.color = function(){
				var noise = noise.cheapnoise(pos*0.02)*0.1+0.5
				var prefog = mesh.color1;
				prefog.xyz *= 0.6 + 0.4*max(0.0, min(1.0, ((mesh.pos.z - mesh.height)*0.001)+0.4));
				var zdist = max(0.,min(1.,(respos.z-view.fogstart)/view.fogend));
				//zdist *= zdist;
				return mix(prefog, view.fog, zdist);
			}
		}
	});

	// view implementation of the land
	define.class(this,"landtile", "$ui/view", function(){

		this.is = tilebasemixin;

		this.loadBufferFromTile = function(tile){
			if (!this.shaders || !this.shaders.hardrect) return false;
				this.shaders.hardrect.mesh = tile.landVertexBuffer;
			return true;
		}
		this.pickalpha  = 0.1
		this.hardrect = function(){
			this.texture = require("./mapmaterial.png");
			this.position = function(){

				idxpos = (  view.trans.xy*vec2(1,-1) ) * vec2(1,-1);;
				pos = vec2(1,-1)*mesh.pos.xy;// + (idxpos - view.tiletrans)* view.tilesize  ;
				//pos.xy *= (view.meterspertile/view.tilesize);

				pos.xy -= (((( view.centerpos- view.centermeter)) / view.meterspertile)*1024.0) * vec2(-1.0,1.0);
				pos.xy /= pow(2.0, view.layeroffset - view.fraczoom -2);
				//pos.xy /= pow(2.0,view.layeroffset - view.fraczoom - 2)

				respos = vec4(pos.x, view.layeroffset * view.layerzmult+ view.layerzoff, pos.y, 1) * view.totalmatrix * view.viewmatrix ;
				//respos.w -= mesh.pos.z*0.01;
				return respos;
			}

			this.mesh =  BufferGen.LandVertexStruct.array();

			this.update = function(){
				this.mesh =  BufferGen.LandVertexStruct.array();
				var a = BufferGen.TileSize *0.05;
				var b = BufferGen.TileSize - a;
				var col =  vec4(0,0,1,0.2);

				/*
				this.mesh.push(a,a,0,col[0], col[1], col[2],1,col[0], col[1], col[2],1);
				this.mesh.push(b,a,0,col[0], col[1], col[2],1,col[0], col[1], col[2],1);
				this.mesh.push(b,b,0,col[0], col[1], col[2],1,col[0], col[1], col[2],1);
				this.mesh.push(a,a,0,col[0], col[1], col[2],1,col[0], col[1], col[2],1);
				this.mesh.push(b,b,0,col[0], col[1], col[2],1,col[0], col[1], col[2],1);
				this.mesh.push(a,b,0,col[0], col[1], col[2],1,col[0], col[1], col[2],1);
				*/

/*				this.mesh.push(a,a,col[0],1)
				this.mesh.push(b,a,col[0],1)
				this.mesh.push(b,b,col[0],1)
				this.mesh.push(a,a,col[0],1)
				this.mesh.push(b,b,col[0],1)
				this.mesh.push(a,b,col[0],1)
*/
			}

			this.drawtype = this.TRIANGLES
			this.depth_test = "disabled"

			this.color = function(){
				//return "blue";
				PickGuid = mesh.pos.z
				//var col =  vec4(0,0,0.6,0.1);
				var noise = noise.cheapnoise(pos*0.02)*0.07+0.5;
				var texcol = mesh.color1;
				var prefog = texcol//, col, 1.0-view.bufferloaded);
				//prefog.a *=0.9;
				//prefog.a *= max(0.0, min(1.0, view.layeroffset  - view.fraczoom))
				var zdist = max(0.,min(1.,(respos.z-view.fogstart)/view.fogend));
				zdist *= zdist;
				return mix(prefog, view.fog, zdist);
			}
		}
	});

	// view implementation of the label tile
	define.class(this, "labeltile", "$ui/labelset", function(){
		//this.polygonoffset = 100.0;
		this.outline = false;
		this.outline_thickness = 0;
		this.is = tilebasemixin;
		this.outline_color = "black" ;
		this.fgcolor = "black"

		this.textpositionfn = function(pos, tag){
		//	idxpos = (  this.trans.xy*vec2(1,-1) ) * vec2(1,-1);;
		}

		this.textstyle = function(style, tag){
			var pos = style.pos
			var rpos = vec2(1,-1) * pos.xz;
			rpos.y += pos.y;
			rpos.xy -= (((( this.centerpos- this.centermeter)) / this.meterspertile)*1024.0) * vec2(-1.0,1.0);
			rpos.xy /= pow(2.0, this.layeroffset - this.fraczoom -2);

			style.pos = vec3(rpos.x, -25+ this.layeroffset*this.layerzmult+ this.layerzoff, rpos.y);

			style.fgcolor = "black";
			// style.outlinecolor = "white";
			// style.outlinethickness = 1.0;
			// style.outline = true;
			return style
		}

		this.resetbuffer = function(){
			this.labels = [];
		}

		this.loadBufferFromTile = function(tile) {
			var LabelSource = tile.Labels;

			if (!LabelSource){
				this.labels = [];
				return;
			}
			var thelabels = [];
			var rankfontsizes = {
				0:60,
				1:55,
				2:50,
				3:45,
				4:40,
				5:-1,
				6:-1,
				7:-1
			}

			for (var i =0 ; i<LabelSource.length; i++){
				var l = LabelSource[i];
				var f = 30;
				if (l.scalerank !== undefined){
					f = rankfontsizes[l.scalerank] * Math.pow(2, this.layeroffset-1);
					//f+= l.scalerank?(100/l.scalerank):0;
				}

				if (f >-1){
					var l2 = {text:l.name,fontsize:f,outline:false, color: vec4("white"), outlinecolor: vec4("black"), pos: vec3(l.x, -11,l.y)};
					thelabels.push(l2);
				}
			}
			this.labels = thelabels;
			return true;
		}

		this.typeface = function(){
			this.depth_test = 'src_depth <= dst_depth'
		}
		//this.depth_test = "enabled"

		this.position = "absolute"
		this.bgcolor = NaN;
		//this.fontsize = 140;
		this.align ="center"
		this.render =function(){}
	})

	// view class of the roadtile
	define.class(this,"roadtile", "$ui/view", function(){
		this.is = tilebasemixin;

		this.loadBufferFromTile = function(tile){
			if (!this.shaders || !this.shaders.hardrect) return;
			this.shaders.hardrect.mesh = tile.roadVertexBuffer;
			return true;
		}

		this.hardrect = function(){
			this.texture = require("./mapmaterial.png");

			this.position = function(){
				var sidevec = mesh.pos.zw
				var side = mesh.geom.x
				var dist = mesh.geom.y
				var linewidth = mesh.geom.z ;//*  pow(2.0, view.layeroffset - view.fraczoom -2);
				var possrc = mesh.pos.xy + sidevec * side * linewidth*0.5;

				//idxpos = (  view.trans.xy*vec2(1,-1) ) * vec2(1,-1);;

				var pos = vec2(1,-1)*possrc.xy ;//+ (idxpos - view.tiletrans) * view.tilesize;

				pos.xy -= (((( view.centerpos- view.centermeter)) / view.meterspertile)*1024.0) * vec2(-1.0,1.0);
				pos.xy /= pow(2.0, view.layeroffset - view.fraczoom -2);
				respos = vec4(pos.x, view.layeroffset*view.layerzmult + view.layerzoff, pos.y, 1) * view.totalmatrix * view.viewmatrix ;
				respos.w += mesh.pos.z*0.1;
				return respos;
			}

			this.vertexstruct = BufferGen.RoadVertexStruct;

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
			this.depth_test = "disabled"

			this.color = function(){
				var texcol = mesh.color ;//* (1.0 - 0.2*  pow(0.5-0.5*cos(mesh.geom.x * 3.1415),3.0))
				var prefog = texcol;//, vec4(0), 1.0-view.bufferloaded);
				//var prefog=  vec4(col.xyz * (0.5 + 0.5*view.bufferloaded), 0.2);
				var zdist = max(0.,min(1.,(respos.z-view.fogstart)/view.fogend));
				zdist *= zdist;
				return mix(prefog, view.fog, zdist);
			}
		}

		this.hardrect = true;
	});

	this.bgcolor = vec4("#c0c0d0");
	this.flex = 1;
	this.clearcolor = "black"
	this.framessincerender = 0;

	this.atDraw = function(){
		this.framessincerender++;
	}

	// update the map tiles
	this.updateTiles = function(){
		if (!this.dataset) return;
		if (!this.dataset.centers) return;

		var sourcezoom = this.dataset.zoomlevel;
		this.zoomlevel = Math.ceil(sourcezoom);
		this.fraczoom = sourcezoom - this.zoomlevel;
		this.meters_per_pixel = geo.metersPerPixel(this.zoomlevel);


		// Center of viewport in meters, and tile
		this.center_meters = geo.latLngToMeters(this.dataset.latlong[0],this.dataset.latlong[1]);

		this.center_tile = [];
		var frac = [];

		for(var i = 0; i < 3; i++){
			frac.push(vec2(0,0));
			this.center_tile.push( geo.tileForMeters(this.center_meters[0], this.center_meters[1], this.zoomlevel + i ));
		}



		for(var a = 0; a < this.tilestoupdate.length; a++){
			var rt = this.tilestoupdate[a];
			// rt.trans = vec2(Math.sin(this.time)*5, 0);
			rt.meterspertile = geo.metersPerTile(this.zoomlevel + rt._layeroffset);
			rt.setpos(this.center_tile[rt.layeroffset], this.zoomlevel + rt._layeroffset, frac[rt._layeroffset], this.fraczoom, this.center_meters);
			rt.redraw();
		}
	}

	this.dumpdebug = function(){
		for(var a = 0; a < this.tilestoupdate.length; a++){
			var rt = this.tilestoupdate[a];
			console.log(rt.lastpos);
		}
	}

	this.render = function(){
		this.tilestoupdate = [];

		var res = [this.dataset];
		var res3d = []
		var buildings3d = [];
		var labels3d = [];
		var poi3d = [];
//		var fov = 30 * (this.layout.width/this.layout.height);
		var div = 512;
		this.tilewidth = Math.ceil(this.layout.width / div);
		this.tileheight = Math.ceil(this.layout.height / div);;

		this.camdist = 20000;//(this.layout.width)/Math.tan((fov/2)*((Math.PI*2.0)/360.0));

		var aspect = this.layout.width/ this.layout.height;
		var fov = (Math.atan(((this.layout.width/2)*40)/this.camdist) * 360/6.283) / aspect;

		var basew = this.tilewidth/2;
		var baseh = this.tileheight/2;
		var showland = true;

		//for(var layer = 1;layer>=0;layer--){ // reverse layers for reverse painter order

		for(var layer = 0; layer < 2; layer++){

			this.tilewidth = 0;// Math.pow(2, 0 + layer);
			this.tileheight = 0;//= Math.pow(2, 0 + layer);
			var tilearea = vec2(this.tilewidth, this.tileheight)
			var ltx = 0;
			var lty = 0;
			var extw = basew * Math.pow(2.0, layer-0.5);;
			var exth = baseh * Math.pow(2.0, layer-0.5);;
			//ext = 0;
			xs = -extw
			xe = -xs +1;
			ys = -exth;
			ye = -ys+1;
			if (showland){
				for(var x = xs;x<xe;x++){
					for(var y = ys;y<ye;y++){
						var land = this.landtile({host:this, mapdata:this.dataset,fog:this.bgcolor, tilearea:tilearea, trans: vec2(x,y), layeroffset: layer});
						this.tilestoupdate.push(land);
						res3d.push(land);
					}
				}
			}

			for(var x = xs;x<xe;x++){
				for(var y = ys;y<ye;y++){
					var road = this.roadtile({host:this, mapdata:this.dataset,fog:this.bgcolor, tilearea:tilearea, trans: vec2(x,y), layeroffset: layer});
					this.tilestoupdate.push(road);
					res3d.push(road);
				}
			}

			for(var x = xs;x<xe;x++){
				for(var y = ys;y<ye;y++){
					var building = this.buildingtile({host:this, mapdata:this.dataset,fog:this.bgcolor, tilearea:tilearea, trans: vec2(x,y), layeroffset: layer});
					this.tilestoupdate.push(building);
					buildings3d.push(building);
				}
			}

			if (layer == 1){
				for(var x = xs;x<xe;x++){
					for(var y = ys;y<ye;y++){
						var labels = this.labeltile({host:this, mapdata:this.dataset,fog:this.bgcolor, tilearea:tilearea, trans: vec2(x,y), layeroffset: layer});
						this.tilestoupdate.push(labels);
						labels3d.push(labels);
					}
				}
			}
		}
		var zoom = 0.25
		//
		//console.log(-this.camdist*zoom*0.13,this.camdist*zoom*0.3)
		res.push(
			view({
				bgcolor:"red",
				flex: 1,
				viewport: "3d",
				name: "mapinside",
				nearplane: 100 ,
				fov: fov,
				farplane: this.camdist * 2,
				camera: vec3(0,-this.camdist*zoom*0.13,this.camdist*zoom*0.3),
				fov: fov,
				up: vec3(0,1,0),
				lookat: vec3(0,0,0)
			},[
				view({bgcolor:NaN},[
					res3d,
					buildings3d,
					//label({name:"MARKER", text:"0, 0", outlinethickness: 2, outlinecolor:"black", outline:true, fontsize:30,pos:[0,0,0], bgcolor:NaN, fgcolor: "white" }),
					labels3d,
					this.constructor_children
				])
			])
		);
		//res.push(this.constructor_children);
		var camdist = this.camdist
		res.push(button({
			position:'absolute',
			top:20,
			label:'2D/3D',
			mode:1,
			click:function(){
				var map = this.find('mapinside')
				if(this.mode == 1){
					this.mode = 2
					map.camera = Animate({1:vec3(0,-4650,150)})
				}
				else {
					this.mode = 1
					map.camera = Animate({1:vec3(0,-camdist*zoom*0.13,camdist*zoom*0.3)})
				}

			}
		}))
		res.push(label({
			bottom:10,
			fontsize:8,
			position:'absolute',
			fgcolor:'black',
			text:"Vector data copyright OpenStreetMap contributors, Whos On First. Webservice by mapzen."
		}))
		this.framessincerender = 0;
		return res;
	}

	this.atChildrenRendered = function(){
		this.updateTiles();
		this.redraw();
	}

})
