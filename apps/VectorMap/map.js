define.class("$ui/view", function(require,$ui$, view,label, $$, geo, urlfetch)
{		
	
	var BufferGen = require("./mapbuffers")();
	
	this.attributes = {
		latlong:vec2(52.3608307,   4.8626387),
		centerx: 0, 
		centery: 0,
		zoomlevel: 16
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
				
				try{
					this.thedata = JSON.parse(str);	
					BufferGen.build(this.currentRequest, this.thedata);
	
					
				}					
				catch(e){
					console.log(e);
					var r = this.currentRequest;
					console.log(" while loading ", r.x, r.y, r.z);
				}
				this.thedata = undefined;
				var r = this.currentRequest;	
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
			fogend: 5000.,
			
		}
		
		this.frameswaited = 0;
		this.bufferloadbool = false	
		
		this.mouseleftdown = function(){
			this.find("mapdata").setCenter(this.lastpos[0], this.lastpos[1], this.zoomlevel,1);
		}
	
		this.lastpos = vec2(0);
		
		this.calctilepos = function(){
			var x = Math.floor( this.coord[0] + this.trans[0]);
			var y = Math.floor(this.coord[1] + this.trans[1]);
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
				this.frameswaited = 0;
				this.bufferloadbool = false;
				this.queued  = 0;
				this.redraw();
				
				this.loadbuffer()
				
			}else{
				if (this.bufferloadbool == false) this.loadbuffer();
			}
		}

		this.loadbuffer = function(){
			var md = this.find("mapdata");
			if (md){
				var bl = md.getBlockByHash(this.tilehash);
				
				if (bl){
				if (this.frameswaited == 0) {
						this.bufferloaded = 1.0
					} else{
					this.bufferloaded = Animate({1:{value:1.0, motion:"inoutquad"}});	
					}
					this.bufferloadbool = true;					
					this.loadBufferFromTile(bl);
					this.redraw();				
				}
				else{
					this.frameswaited++;
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
		this.tilesize = BufferGen.TileSize;
		
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
				respos = vec4(pos.x, -mesh.pos.z * view.bufferloaded, pos.y, 1) * view.totalmatrix * view.viewmatrix ;
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
			
			this.mesh =  BufferGen.LandVertexStruct.array();
			
			this.update = function(){
				this.mesh =  BufferGen.LandVertexStruct.array();
				var a = BufferGen.TileSize *0.05;
				var b = BufferGen.TileSize - a;
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