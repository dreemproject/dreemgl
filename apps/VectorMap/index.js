define.class('$server/composition', function vectormap(require,  $server$, fileio,$ui$, numberbox, button, menubar, label, screen, view, foldcontainer, speakergrid,checkbox, icon, $widgets$, colorpicker,  jsviewer, radiogroup, $3d$, ballrotate, $$, urlfetch){
	
	define.class(this, "mainscreen", function($ui$, view){		
	
	define.class(this, "tiledmap", function($ui$, view){

		
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
			console.log("scaler:", scaler);
			for(var x = 0;x<6;x++){
				for(var y = 0;y<6;y++){
					res.push(this.maptile(
						{
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
						}
					))
				
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
						
				//,view({width:2000, height:2000, bg:0})
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
