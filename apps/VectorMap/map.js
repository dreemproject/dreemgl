define.class("$ui/view", function($ui$, view,label, $$, geo)
{	
	this.bgcolor = "white" 
	
	this.flex = 1;
	define.class(this, "mapdataset", "$system/base/node", function( $$, geo)
	{
		this.requestPending = false;
		this.loadqueue = [];
		this.loadqueuehash = [];
		this.loadedblocks = {};
		var geo = this.geo = geo();
		
		this.attributes = {
			centerx: 0,
			centery: 0
		}
		
		this.setCenterLatLng = function(lat, lng, zoom){	
			console.log("Setting center to (latlng): ", lat, lng, zoom);
		
			zoom = Math.floor(zoom);
			var llm = geo.latLngToMeters(lat, lng)
			console.log("latlng to meters", llm);
			var tvm = geo.tileForMeters(llm[0], llm[1], zoom);
			console.log("meters to tile coord:", tvm);
			this.setCenter(tvm.x, tvm.y, zoom);
		}
		
		this.setCenter = function(x,y,z){
			console.log("Setting center to:",x,y,z);
			this.centerx = x;
			this.centery = y;
			this.centerz = z;
			
			for(var xx = -3; xx < 3; xx++){
				for(var yy = -3; yy < 3; yy++){			
//					this.addToQueue(x + xx,y + yy,z);	
				}
			}					
		}
		
		this.createHash = function(x, y, z){
			return x + "_" + y + "_" + z;
		}

		this.addToQueue = function(x, y, z){		
			var hash = this.createHash(x, y, z);
			if (this.loadqueuehash[hash]) return; // already queued for load.
			if (this.loadedblocks[hash]) return; // already loaded.
			
			this.loadqueuehash[hash] = 1;
			this.loadqueue.push({x:x, y:y, z:z});
			this.updateLoadQueue();
		}

		this.processLoadedBlock = function(x, y, z, data){
			var hash = this.createHash(x,y,z);
			this.loadedblocks[hash] = {x:x, y:y, z:z, blockdata:data};
		}
		
		this.simulateLoaded = function(){
			if (this.currentRequest) {
				
				var r = this.currentRequest;
				var hash = this.createHash(r.x, r.y, r.z);
				this.loadedblocks[hash] = this.currentRequest
				this.loadqueuehash[hash] =  undefined;
				this.currentRequest = undefined;
				this.cleanLoadedBlocks();
				this.updateLoadQueue();
				this.find("tiledmap").datasource = this;
			}		
		}
		
		this.cleanLoadedBlocks = function(){
			var keys = Object.keys(this.loadedblocks);
			
			for(var i =0 ;i<keys.length;i++)
			{
				var lb = this.loadedblocks[keys[i]]
				var dx = lb.x - this.centerx;
				var dy = lb.y - this.centery;
				var dz = (lb.z - this.centerz)*5;
				var dist  = dx*dx + dy*dy + dz*dz;
				if (dist > 5*5*5) {
					delete this.loadedblocks[keys[i]];
				}
			}
			
			this.find("tiledmap").datasource = this;		
		}
		
		this.updateLoadQueue = function(){
			
			if (this.currentRequest) return; // already loading something...
			
			if (this.loadqueue.length > 0){
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
				
				this.currentRequest = this.loadqueue.pop(); 
				// take closest one from the queue
				// this.requestPending = true;
			}
		}
		
		this.destroy = function(){
			this.clearInterval(this.theinterval);
		}
		this.gotoCity = function(name, zoom){
			if (!name || name.length == 0) return ;
			var n2 = name.toLowerCase().replace(' ', '');
			
			var c = this.cities[n2];
			if (c){
				this.setCenterLatLng(c[0], c[1], zoom);
			}			
			else{
				console.log("city not found:", name);
			}
		}
		
		this.init = function(){
			this.cities = {
				amsterdam: [52.3608307,4.8626387],
				sanfrancisco: [37.6509102,-122.4889338],
				seoul:[37.5275421,126.9748078],
				seoel:[37.5275421,126.9748078]
			}
			
			this.theinterval = this.setInterval(function(){
				this.updateLoadQueue();
			}.bind(this), 50);
			
			this.loadinterval = this.setInterval(function(){
				this.simulateLoaded();
			}.bind(this), 50);
		
			this.gotoCity("sanfrancisco", 12);
			this.gotoCity("Amsterdam", 13);
			this.gotoCity("seoul", 14);
			this.gotoCity("amsterdam", 15);
			
			
		}
	})
	
	this.init = function(){
		
	}
	this.render = function(){
		return [label({bg:0, text:"I am a map" }),this.mapdataset()]
	}
})