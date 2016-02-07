define.class("$ui/view", function(require,$ui$, view,label, labelset, $$, geo, urlfetch)
{

	var BufferGen = require("./mapbuffers")();
	var geo = this.geo = geo();

	this.attributes = {
		latlong:vec2(52.3608307,   4.8626387),
		centerx: 0,
		centery: 0,
		zoomlevel: 16
	}

	function createHash (x, y, z){
		return x + "_" + y + "_" + z;
	}

	this.pointerstart = function(){
		console.log("pointerstart");
	}

	this.pointermove = function(){
		console.log("pointermove");
	}

	this.pointerend = function(){
		console.log("pointerend");
	}


	this.gotoCity = function(city, zoomlevel){
		this.dataset.gotoCity(city, zoomlevel);
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

			var m = geo.metersForTile({x:x, y:y, z:z})
			
			console.log(x,y,z,time, m);
			if (!time || time == 0)
			{
				this.centerpos = vec2(x,y)
				this.zoomlevel = z;
				
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
				var dz = (lb.z - this.zoomlevel)*2;
				var dist  = dx*dx + dy*dy + dz*dz;
				if (dist > 5*5*5*5*5*5) {
					delete this.loadedblocks[keys[i]];
				}
			}
		}
		
		var worker = define.class('$system/rpc/worker', function(require){
			this.BufferGen = require("$apps/vectormap/mapbuffers")();

			this.build = function(str, r){
				var ret = vec2.array(10)
				
				try{
					console.log("trying to load!");
					var thedata = JSON.parse(str);
					this.BufferGen.build(r, thedata);
				console.log("loaded!");
					
				}
				catch(e){
					console.log(e);
					console.log(" while loading ", r.x, r.y, r.z);
				}
				return r;
			}
		})
		
	

		this.loadstring = function(str){
		//	if (!window.teller) window.teller = 0;
		//	window.teller += str.length;

			if (this.currentRequest) {

				var r = this.currentRequest;
				var hash = createHash(r.x, r.y, r.z);
				r.hash = hash;

					this.workers.build(str, r).then(function(result){
						
						this.loadedblocks[r.hash] = result.value
						this.loadqueuehash[r.hash] = undefined;
						this.parent.updateTiles();
					}.bind(this))
					
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

		this.init = function(prev){
			this.workers = prev && prev.workers || worker()
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
				london:[51.5091502,-0.1471011]
			}

			this.gotoCity("Amsterdam", 6);

			//this.setCenter(31,18,6);
			this.theinterval = this.setInterval(function(){
				this.updateLoadQueue();
			}.bind(this), 50);

			this.loadinterval = this.setInterval(function(){
				//this.simulateLoaded();
			}.bind(this), 50);

			
			this.rpc.urlfetch.sessionstart();
			//this.setCenter(33656/2,21534/2, 16)

		}
	})

	this.atDraw = function(){
		this.updateTiles();
		//this.setTimeout(this.updateTiles, 10);
	}

	this.init = function(){
		this.dataset = this.mapdataset({name:"mapdata", callbacktarget: this});

		//this.setTimeout(this.updateTiles, 10);
	}

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

	

	this.projectonplane = function(coord){
		var vp = this.find("mapinside");
		if (!vp) return;
		

		var sx = vp.layout.width;
		var sy = vp.layout.height;
	
		var mx = (coord[0] / (sx / 2)) - 1.0
		var my =  (coord[1] / (sy / 2)) - 1.0

		var ray_nds  = vec3(mx,my,1);
		var ray_clip = vec4(ray_nds.x, ray_nds.y, -1.0,1.0);
		
		
		var proj = vp.colormatrices.perspectivematrix;	
		var invproj = mat4.identity();
		mat4.invert(proj, invproj)


		

		var ray_eye = vec4.mul_mat4(ray_clip,invproj)
		ray_eye = vec4(ray_eye.x, ray_eye.y, -1.0, 0.0);
		
		

		var view = vp.colormatrices.lookatmatrix;	
		var invview = mat4.identity();
		mat4.invert(view, invview)
		var raywor4 = vec4.mul_mat4(ray_eye, invview)
		var ray_wor = vec3(raywor4[0], raywor4[1],raywor4[2]);
		ray_wor = vec3.normalize(ray_wor);
		var	camerapos = vp._camera;
		var end = vec3(camerapos[0] + ray_wor[0] * 30000, 
		camerapos[1] + ray_wor[1] * 30000, 
		camerapos[2] + ray_wor[2] * 30000);
		
		var R = vec3.intersectplane(camerapos, end, vec3(0,1,0), 0)
		if (!R) return null;
		
	//	this.find("MARKER").pos = vec3(R[0],R[1]-200,R[2]);
	//	this.find("MARKER").text =( Math.round(this.find("MARKER").pos[0]*100)/100) + ", "+  ( Math.round(this.find("MARKER").pos[2]*100)/100) ;
	
	
		return R;
		
	}
	this.dragging = false;
	this.startvect = vec2(0);
	this.startDrag = function(ev){
		var R = this.projectonplane( this.globalToLocal(ev.position));
		if (R){
			this.startvect = vec2(R[0]/(BufferGen.TileSize * 8),R[2]/(BufferGen.TileSize * 8))
			this.startcenter = vec2(this.centerx, this.centery);
		}
	}
	this.moveDrag = function(ev){
		var R = this.projectonplane( this.globalToLocal(ev.position));
		if (R){
			
			this.newvect = vec2(R[0]/(BufferGen.TileSize * 8),R[2]/(BufferGen.TileSize * 8) )
			
			this.find("mapdata").setCenter( this.startvect[0] - this.newvect[0] + this.startcenter[0],
			 this.startvect[1] - this.newvect[1] + this.startcenter[1], this.zoomlevel);

		}
	}
	this.stopDrag = function(){
		
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
			fogend: 50000.,
			layeroffset: 0,
			layerzmult: -10,
			layerzoff: 0
		}
		

		this.frameswaited = 0;
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
		
		this.pointertap = function(){
			this.find("mapdata").setCenter(this.lastpos[0], this.lastpos[1], this.zoomlevel,1);
		}

		this.lastpos = vec2(0);

		this.calctilepos = function(){
			var x = Math.floor( this.coord[0] + this.trans[0]);
			var y = Math.floor(this.coord[1] + this.trans[1]);
			return [x,y,this.zoomlevel ];
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

		this.checknewpos = function(time){
			var R = this.calctilepos();

			var newpos = 	vec3(R[0], R[1], R[2]);
			if (this.lastpos[0] != newpos[0] || this.lastpos[1] != newpos[1] || this.lastpos[2] != newpos[2]){
				this.lastpos = newpos;
				this.tilehash = createHash(this.lastpos[0], this.lastpos[1], this.zoomlevel );
				this.bufferloaded = 0;
				this.frameswaited = 0;
				this.bufferloadbool = false;
				this.queued  = 0;
				this.redraw();
				this.loadbuffer(time)
			}else{
				if (this.bufferloadbool == false) this.loadbuffer(time);else this.bl.lasttime = time;
			}
		}

		this.loadbuffer = function(){
			md = this.find("mapdata");
			if (md){
				this.bl = md.getBlockByHash(this.tilehash);

				if (this.bl){
				if (this.frameswaited == 0 ) {
						this.bufferloaded = 1.0
					} else{
					this.bufferloaded = Animate({1:{value:1.0, motion:"inoutquad"}});
					}
					this.bufferloadbool = true;
					this.loadBufferFromTile(this.bl);
					this.redraw();
				}
				else{
					this.frameswaited++;
					if (this.queued == 0){
						if (this.shaders.hardrect && this.shaders.hardrect.update) this.shaders.hardrect.update();
						if (this.resetbuffer) this.resetbuffer();
						md.addToQueue(this.lastpos[0], this.lastpos[1], this.lastpos[2]);
						this.queued  = 1;
					}
				}
			}
		}
		
		this.onzoomlevel = function(){
		// this.checknewpos();
		}
		
		this.oncoord = function(){
		// this.checknewpos();
		}
		this.tilesize = BufferGen.TileSize;
		this.width = this.tilesize;
		this.height = this.tilesize;

	})




	define.class(this,"buildingtile", "$ui/view", function(){
		this.is = tilebasemixin;
		this.loadBufferFromTile = function(tile){
			this.shaders.hardrect.mesh = tile.buildingVertexBuffer;
		}

		this.hardrect = function(){

			this.position = function(){

				idxpos = (  view.trans.xy*vec2(1,-1) ) * vec2(1,-1);;
				pos = vec2(1,-1)*mesh.pos.xy + (idxpos - view.tiletrans)* view.tilesize;
				respos = vec4(pos.x, -mesh.pos.z * view.bufferloaded + view.layeroffset*view.layerzmult + view.layerzoff, pos.y, 1) * view.totalmatrix * view.viewmatrix ;
				//r.w += 0.002;

				return respos;
			}

			this.mesh =  BufferGen.BuildingVertexStruct.array();

			this.update = function(){
				this.mesh =  BufferGen.BuildingVertexStruct.array();

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

			}
		}

	});


	define.class(this,"landtile", "$ui/view", function(){

		this.is = tilebasemixin;

		this.loadBufferFromTile = function(tile){
			this.shaders.hardrect.mesh = tile.landVertexBuffer;
		}
		this.pickalpha  = 0.1
		this.hardrect = function(){

			this.position = function(){

				idxpos = (  view.trans.xy*vec2(1,-1) ) * vec2(1,-1);;
				
				
				pos = vec2(1,-1)*mesh.pos.xy + (idxpos - view.tiletrans)* view.tilesize  ;
				pos.xy /= pow(2.0,view.layeroffset-2)
				
				respos = vec4(pos.x, view.layeroffset * view.layerzmult+ view.layerzoff, pos.y, 1) * view.totalmatrix * view.viewmatrix ;
				respos.w -= mesh.pos.z*0.01;
				return respos;
			}

			this.mesh =  BufferGen.LandVertexStruct.array();

			this.update = function(){
				this.mesh =  BufferGen.LandVertexStruct.array();
				var a = BufferGen.TileSize *0.05;
				var b = BufferGen.TileSize - a;
				var col =  vec4("#202050");

				this.mesh.push(a,a,0,col[0], col[1], col[2],1,col[0], col[1], col[2],1);
				this.mesh.push(b,a,0,col[0], col[1], col[2],1,col[0], col[1], col[2],1);

				this.mesh.push(b,b,0,col[0], col[1], col[2],1,col[0], col[1], col[2],1);
				this.mesh.push(a,a,0,col[0], col[1], col[2],1,col[0], col[1], col[2],1);
				this.mesh.push(b,b,0,col[0], col[1], col[2],1,col[0], col[1], col[2],1);
				this.mesh.push(a,b,0,col[0], col[1], col[2],1,col[0], col[1], col[2],1);
			}

			this.drawtype = this.TRIANGLES

			this.depth_test = ""

			this.color = function(){
				//return "blue";
				var col =  vec4(0,0,0.6,1.0);

				var noise = noise.cheapnoise(pos*0.02)*0.2+0.5;
				var prefog = mix(mix(mesh.color1, mesh.color2, noise), col, 1.0-view.bufferloaded);
				prefog.a *=0.4;
				var zdist = max(0.,min(1.,(respos.z-view.fogstart)/view.fogend));
				zdist *= zdist;
				return mix(prefog, view.fog, zdist);
			}
		}
	});

	define.class(this,"labeltile", "$ui/labelset", function(){
		this.polygonoffset = 10.0;
		this.outline = true;
		this.outline_thickness = 4;
		this.is = tilebasemixin;

		this.textpositionfn = function(pos){			
			idxpos = (  this.trans.xy*vec2(1,-1) ) * vec2(1,-1);;
			rpos = vec2(1,-1)*pos.xz + (idxpos - this.tiletrans)* this.tilesize;
			
			return vec3(rpos.x, this.layeroffset*this.layerzmult+ this.layerzoff, rpos.y+pos.y);
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
				0:40, 
				1:30, 
				2:20,
				3:10,
				4:10,
				5:10, 
				6:10, 
				7:10
			}
			
			for (var i =0 ;i<LabelSource.length;i++){
				var l = LabelSource[i];
				var f = 2;
				if (l.scalerank !== undefined){
					f = rankfontsizes[l.scalerank];
					//f+= l.scalerank?(100/l.scalerank):0;
				}
				var l2 = {text:l.name,fontsize:f,outline:false, color:vec4("white"), pos:vec3(l.x, -11,l.y)};
				thelabels.push(l2);
			}
			//console.log(ranks);
			this.labels = thelabels;
		}
		
		this.position = "absolute"
		this.bgcolor = NaN;
		//this.fontsize = 140;
		this.align ="center" 
		this.render =function(){
		
		}
	})
	
	define.class(this,"roadtile", "$ui/view", function(){
		this.is = tilebasemixin;
		this.loadBufferFromTile = function(tile){
			this.shaders.hardrect.mesh = tile.roadVertexBuffer;
		}
		this.hardrect = function(){

			this.position = function(){

				var possrc = mesh.pos.xy + mesh.sidevec * mesh.side * mesh.linewidth*0.5;

				idxpos = (  view.trans.xy*vec2(1,-1) ) * vec2(1,-1);;



				var pos = vec2(1,-1)*possrc.xy + (idxpos - view.tiletrans) * view.tilesize;
					pos.xy /= pow(2.0,view.layeroffset-2)
			
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
				//console.log(this.centerx, this.centery, this.zoomlevel);
		this.zoomlevel = this.dataset.zoomlevel;

		
		var m = geo.metersForTile({x:this.centerx, y:this.centery, z:this.zoomlevel})
			
		var level2 = geo.tileForMetersFrac(m.x, m.y, this.zoomlevel +1);
		
		level2.x +=0
		level2.y -=0
		var level3 = geo.tileForMetersFrac(m.x, m.y, this.zoomlevel +2);
		level3.x -=0.0;
		level3.y +=1;
			
		level1 = {x:this.centerx, y: this.centery};
		level1.y -=0.5;
		//	console.log(level2)
		var frac = [];
		frac.push(vec2(level1.x - Math.floor(level1.x), level1.y- Math.floor(level1.y)))
		frac.push(vec2(level2.x - Math.floor(level2.x), level2.y- Math.floor(level2.y)))
		frac.push(vec2(level3.x - Math.floor(level3.x), level3.y- Math.floor(level3.y)))
		var floorvec = [];
		floorvec.push(vec2(Math.floor(level1.x), Math.floor(level1.y)));
		floorvec.push(vec2(Math.floor(level2.x), Math.floor(level2.y)));
		floorvec.push(vec2(Math.floor(level3.x), Math.floor(level3.y)));
		;
		

		for(var a = 0;a<this.tilestoupdate.length;a++){
			var rt = this.tilestoupdate[a];
				//rt.trans = vec2(Math.sin(this.time)*5, 0);
				rt.setpos(floorvec[rt.layeroffset], this.zoomlevel + rt.layeroffset, frac[rt.layeroffset]);
			//	rt.redraw();
		}
	}

	this.render = function(){
		this.tilestoupdate = [];

		var res = [this.dataset];
		var res3d = []

		var div = 400
		this.tilewidth = Math.ceil(this.layout.width/ div);
		this.tileheight = Math.ceil(this.layout.height/ div);;

	
		//console.log("tile area", tilearea);
		for(var layer = 0;layer<3;layer++){
			
			this.tilewidth = Math.pow(2, 1+ layer);
			this.tileheight = Math.pow(2, 1+ layer);
			var tilearea = vec2(this.tilewidth, this.tileheight)
			console.log(this.tilewidth , this.tileheight);		
		
			for(var x = 0;x<this.tilewidth;x++){
				for(var y = 0;y<this.tileheight;y++){
					var tx = Math.floor(x-(this.tilewidth)/2);
					var ty = Math.floor(y-(this.tileheight)/2)
					var land = this.landtile({host:this, fog:this.bgcolor, tilearea:tilearea, trans:vec2(tx,ty), layeroffset: layer});
					this.tilestoupdate.push(land);
					res3d.push(land);
				}
			}
			
			for(var x = 0;x<this.tilewidth;x++){
				for(var y = 0;y<this.tileheight;y++){
					var tx = Math.floor(x-(this.tilewidth)/2);
					var ty = Math.floor(y-(this.tileheight)/2)
					var road = this.roadtile({host:this, fog:this.bgcolor, tilearea:tilearea, trans:vec2(tx,ty), layeroffset: layer});
					this.tilestoupdate.push(road);
					res3d.push(road);
				}
			}

			for(var x = 0;x<this.tilewidth;x++){
				for(var y = 0;y<this.tileheight;y++){
					var tx = Math.floor(x-(this.tilewidth)/2);
					var ty = Math.floor(y-(this.tileheight)/2)
					var building = this.buildingtile({host:this, fog:this.bgcolor, tilearea:tilearea, trans:vec2(tx,ty), layeroffset: layer});
					this.tilestoupdate.push(building);
					res3d.push(building);
				}
			}
			
			for(var x = 0;x<this.tilewidth;x++){
				for(var y = 0;y<this.tileheight;y++){
					var tx = Math.floor(x-(this.tilewidth)/2);
					var ty = Math.floor(y-(this.tileheight)/2)
					var labels = this.labeltile({host:this, fog:this.bgcolor, tilearea:tilearea, trans:vec2(tx,ty), layeroffset: layer});
					this.tilestoupdate.push(labels);
					res3d.push(labels);
				}
			}
		}
		var dist = 14.5
		res.push(view({flex: 1,viewport: "3d",name:"mapinside", nearplane:100*dist,farplane: 40000*dist,

		camera:vec3(0,-1000 * dist,100* dist), fov: 40, up: vec3(0,1,0)
		,lookat:vec3(0,0,0)
		},

			view({bgcolor:NaN},
				res3d
				//,label({name:"MARKER", text:"0, 0", fontsize:120,pos:[0,-200,0], bgcolor:NaN})
				)

			));
		return res;
	}
})
