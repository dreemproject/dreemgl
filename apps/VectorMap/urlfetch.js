define.class(function(require, $server$, service){
		this.grabmap = function(x,y,z){
			
			var nodehttp = require('$system/server/nodehttp');
			var fs = require('fs');
			var cachedname = define.expandVariables(define.classPath(this) + "tilecache/" + x +"_"+y+"_" + z+".json");
			
			if (fs.existsSync(cachedname)){
				console.log("Serving map from cache:",x,y,z);
				var data = fs.readFileSync(cachedname).toString();
				if (data.slice(0, 100).indexOf("<?xml")<0)
				{
					//console.log(data.slice(0,1000));
					return data;
				}
				console.log("Cached slice has an error... loading again");
			}
			
			console.log("Serving map through mapzen proxy:",x,y,z);
			var fileurl = "http://vector.mapzen.com/osm/all/"+z+"/"+x+"/"+y+".topojson?api_key=vector-tiles-Qpvj7U4" 
			var P = define.deferPromise()

			nodehttp.get(fileurl).then(function(v){
				fs.writeFileSync(cachedname, v);				
				P.resolve(v);
			})
			
			return P;
		}.bind(this)		
	})