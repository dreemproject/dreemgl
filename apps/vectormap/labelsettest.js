define.class('$server/composition', function (require,  $server$, fileio,$ui$, numberbox,view, label, screen, speakergrid, splitcontainer,noisegrid,gbutton, labelset, $$, map, urlfetch, acceleroremote,$3d$, ballrotate){


	this.render = function(){
		this.thelabels = [];
		for (var i =0 ;i<1000;i++){
			var l = {text:i.toString(), pos:vec3(Math.random()*1000,Math.random()*1000,0)}
			this.thelabels.push(l);
		}
		return [
			screen({name:"index",style:{$:{fontsize:12}}},
				labelset({labels:this.thelabels, fgcolor:"white", bgcolor:"blue"})
			)
		];
	}
})
