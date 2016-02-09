define.class(function(require, $server$, service){
	
	var BufferGen = require("./mapbuffers")();
	
		this.generatebuffer = function(targetfile, datastring){
			try{
				var thedata = JSON.parse(datastring);	
				var targetobj = {}
			//	BufferGen.build(targetobj, thedata);
		//		console.log(targetobj.landVertexBuffer.length, targetobj.roadVertexBuffer.length, targetobj.buildingVertexBuffer.length);
			}
			catch(e){
				console.log("exception during bugger generation:", e)
			}
		}
		this.sessionstart = function(){
			console.log("[Map] Session started");
		}
		this.grabmap = function(x,y,z){
			
			var nodehttp = require('$system/server/nodehttp');
			var fs = require('fs');
			var cachedname = define.expandVariables(define.classPath(this) + "tilecache/" + x +"_"+y+"_" + z+".json");
			var cachedbuffername = define.expandVariables(define.classPath(this) + "tilecache/BUFFER_" + x +"_"+y+"_" + z+".json");
			
			var dogeneratebuffer = fs.existsSync(cachedbuffername)?false:true;
			
			if (fs.existsSync(cachedname)){
				//console.log("[Map] Cache:", x,y,z);
				var data = fs.readFileSync(cachedname).toString();
				//if (dogeneratebuffer) this.generatebuffer(cachedbuffername, data);
				
				// small error check... mapzen returns html/xml pages for all its errors
			//	if (data.slice(0, 100).indexOf("<?xml")<0){					
					return data;
				//}
				console.log("[Map] Cached slice has an error... loading again");
			}
			
			//console.log("[Map] Downloading from mapzen:",x,y,z,"..." );
			var fileurl = "http://vector.mapzen.com/osm/all/"+z+"/"+x+"/"+y+".topojson?api_key=vector-tiles-Qpvj7U4" 
			var P = define.deferPromise()

			nodehttp.get(fileurl).then(function(data){
				fs.writeFileSync(cachedname, data);	
				if (data.slice(0, 100).indexOf("<?xml")<0){					
				//	console.log(" -- done. Saved to cache: ",x,y,z,"!" );
					//if (dogeneratebuffer) this.generatebuffer(cachedbuffername, v);
				
					P.resolve(data);
						
				}
				else{
					console.log("Mapzen returned error:" , data);
					P.resolve("<?xml>" + error);
				}
			})
			
			return P;
		}.bind(this)		
	})