define.class('$server/composition', function vectormap(require,  $server$, fileio,$ui$, numberbox, button, menubar, label, screen, view, foldcontainer, speakergrid,checkbox, icon, $widgets$, colorpicker,  jsviewer, radiogroup, $3d$, ballrotate, $$, urlfetch, geo){
	define.class(this, "mapdataset", function($ui$, view)
	{
		this.requestPending = false;
		this.loadqueue = [];
		this.loadqueuehash = [];
		this.loadedblocks = {};
		this.geo = geo();
		this.attributes = {
			centerx: 0,
			centery: 0
		}
		
		this.setCenter = function(x,y,z){
			this.centerx = x;
			this.centery = y;
			this.centerz = z;
			
			for(var xx = -3; xx < 3; xx++){
				for(var yy = -3; yy < 3; yy++){			
//					// add square around 
					this.addToQueue(x + xx,y + yy,z);	
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
			
//			console.log("adding ",x,y,z);
			
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
			//	console.log("loaded " , hash);
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
		
		this.init = function(){
			console.log(this.geo.tile_size);
			this.theinterval = this.setInterval(function(){
				this.updateLoadQueue();
			}.bind(this), 50);
			
			this.loadinterval = this.setInterval(function(){
				this.simulateLoaded();
			}.bind(this), 50);
		}
	})
	
	define.class(this, "tiledmap", function($ui$, view)
	{		
		this.render = function(){
			//console.log("rendering!");
			var res = [];
			var keys = Object.keys(this.datasource.loadedblocks);
			for(var i =0 ;i<keys.length;i++){
				var lb = this.datasource.loadedblocks[keys[i]]
			//	console.log(lb.x, lb.y);
				res.push(view({width:18, height:18, position:"absolute", x: 100 + 20*lb.x, y:100 + 20*lb.y,bgcolor:vec4(Math.sin(lb.z), Math.cos(lb.z), 1, 1)}))
			}
			return res;
		}
		
		this.attributes = {
			centerx:   Config({value:0}),
			centery:   Config({value:0}),
			zoomlevel: Config({value:4, motion:"inoutquad", duration:1.7}),
			levels: [],
			blocksize: 150,
			dataset: {}				
		}
		
		
		this.oncenterx = function(){
			if (this.dataset){
				
				this.datasource.setCenter(Math.floor(this.centerx),Math.floor(this.centery),Math.floor(this.zoomlevel));		
		
			}
		}
		this.oncentery = function(){
			if (this.dataset){
				
				this.datasource.setCenter(Math.floor(this.centerx),Math.floor(this.centery),Math.floor(this.zoomlevel));		
		
			}
		}
	

		this.keydownLeftarrow = function(){
			this.centerx --;
		}
		
		this.keydownRightarrow = function(){
			this.centerx ++;
		}
		
		this.keydown = function(v){	
			this.screen.defaultKeyboardHandler(this, v);					
		}

		this.bg = function(){
			this.color = function(){		
				var dist = abs(view.zoomlevel - mesh.id );	
				if (dist > 1.0) dist = 1.0;
				return vec4(vec4("blue").xyz*(1.0-dist), 1.0);
			}

			this.color_blend = 'src_alpha * src_color + dst_color'
  
			this.vertexstruct =  define.struct({		
				pos:vec3,
				id: float
			})

			this.mesh = this.vertexstruct.array(10000);
			
			this.update = function(){
				var mesh = this.mesh ;
				mesh.length = 0;
				var cx = this.view.layout.width/2;
				var cy = this.view.layout.height/2;
				var w = 100;
				var h = 200;
				var view = this.view;
				
				var low = Math.max(0, Math.floor(view.zoomlevel-1));
				var high = Math.min(view.levels.length, Math.ceil(view.zoomlevel + 1));
				
				for(var i = low ;i<high;i++){
					w = h = Math.pow(2,i-this.view.zoomlevel-0) * this.view.blocksize;
					var bw = (Math.ceil(this.view.layout.width / (w)));
					var bh = (Math.ceil(this.view.layout.height /(h)));
					
					var sx = Math.floor(view.centerx) ;
					var sy = Math.floor(view.centery) ;

					var ex = sx + bw+1;
					var ey = sy + bw+1;
					
					for(var xx = sx;xx<ex;xx++){
						for(var yy = sy;yy<ey;yy++){
							var x = w * xx ;
							var y = h * yy;
							
							mesh.push(x,y,0, i);
							mesh.push(x+w,y,0, i);
							
							mesh.push(x+w,y,0, i);
							mesh.push(x+w,y+h,0, i);
							
							mesh.push(x+w,y+h,0, i);
							mesh.push(x,y+h,0, i);
							
							mesh.push(x,y+h,0, i);
							mesh.push(x,y,0, i);
						}
					}
				}
			}
			
			this.position = function(){		

				var xy = mesh.pos.xy;		
				xy -= vec2(view.centerx, view.centery)*view.blocksize  ;			
					var r = vec4(xy, 0, 1) * view.totalmatrix * view.viewmatrix;
					return r
			}
			
			this.drawtype = this.LINES
		};
		
		this.flex = 1;
		this.overflow = "hidden" 
		
		this.moveTo = function(x,y,z){	

			//this.datasource.setCenter(x,y,z);		
			var dist = vec2((x?x:this.centerx) - this.centerx,(y?y:this.centery) - this.centery);
			var l = vec2.len(dist);
			var totaltime = Math.max(1.,Math.min(10, l*0.3));
			var halftime = totaltime / 2;	
			
			if (x !== undefined) {
				var xanim = {}
				xanim[totaltime] = {motion:"inoutquad", value:x};
			}
			
			if (y !== undefined) {
				var yanim = {}
				yanim[totaltime] = {motion:"inoutquad", value:y};
				this.centerx = Animate(xanim);
				this.centery = Animate(yanim);
			}
			
			if (z !== undefined) {
				var zanim = {}
				if ( z < this.zoomlevel){					
					zanim[totaltime] = {motion:"inoutquad", value:z};
				}
				else {
					zanim[halftime] = {motion:"outquad", value:this.zoomlevel-0.4};
					zanim[totaltime] = {motion:"inquad", value:z};
				}
				this.zoomlevel = Animate(zanim);		
			}

		}
		
	
		this.init = function(){
			
			for(var i = 0;i<18;i++){
				this.levels[i] = {}
			}			
		}		
	})
	
	this.renderbuttongrid = function(z){
				res = [];
				
				for (var y = 0;y<10;y+=2){
					var R = [];
				for (var x = 0;x<10;x+=2){
					var t = x + " " + y
					R.push(button({xtarget:x, ytarget:y, ztarget:z, text:t,click:function(){this.rpc.index.moveTo(this.xtarget,this.ytarget,this.ztarget);}, margin:2}))
				}
					res.push(view({bg:0},R));
				}
				return res;
			}
	this.render = function(){
		
		return [
			urlfetch({name:"urlfetch"}),
			screen({name:"index", clearcolor:vec4("#000030"), moveTo:function(x,y,z){
				this.find("tiledmap").moveTo(x,y,z)
			}}		
				,mapdata =this.mapdataset()

				,this.tiledmap({name:"tiledmap", datasource: mapdata})				
			) 
			
		,screen({
			name:"remote", 
			style:{$:{fontsize:12}},
			init:function(){
				console.log(this.rpc.index)
			},
			
			clearcolor:vec4('darkgray'), overflow:'hidden', title:"VectorMap remote" },
			speakergrid({justifycontent:"center", alignitems:"center" }, view({width:300, bg:0, flexdirection:"column", alignself:"center"}
				,label({fontsize:40, text:"Zoompan" , bg:0})
				,label({fontsize:20, text:"level 5" , bg:0})
				,view({bg:0},this.renderbuttongrid(5))
				,label({fontsize:20, text:"level 4" , bg:0})
				,view({bg:0},this.renderbuttongrid(4))
				,label({fontsize:20, text:"level 3" , bg:0})
				,view({bg:0},this.renderbuttongrid(3))
				,button({text:"Manhattan",click:function(){this.rpc.index.moveTo(9647*2,12320*2, 16);}, margin:2})
				,button({text:"Amsterdam",click:function(){this.rpc.index.moveTo(33656,21534, 16);}, margin:2})
					))
		)
		]
	}

})
