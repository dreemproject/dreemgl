define.class('$server/composition', function vectormap(require,  $server$, fileio,$ui$, numberbox, button, menubar, label, screen, view, foldcontainer, speakergrid,checkbox, icon, $widgets$, colorpicker,  jsviewer, radiogroup, $3d$, ballrotate, $$, urlfetch){

	define.class(this, "tiledmap", function($ui$, view)
	{
		this.bg = 0;
		this.flex = 1;
		this.overflow = "hidden" 
		this.attributes = {
			centerx: 1000.0,
			centery: 1000.0,
			zoomlevel: 10.5
		}
		
		this.moveTo = function(x,y,z){
			this.centerx = x;
			this.centery = y;
			this.zoomlevel = z;						
		}
		
		this.requestPending = false;
		this.loadqueue = [];
		
		this.addToQueue = function(x,y,z){
			this.loadqueue.push({x:x, y:y, z:z});
			this.updateLoadQueue();
		}
		
		this.updateLoadQueue = function(){
			if (this.requestPending) return;
			if (this.loadqueue.length > 0){
				// sort queue on distance to cursor

				
				
			}
		}

		this.init = function(){
			
		}
	})
	
	this.render = function(){
		
		return [
			urlfetch({name:"urlfetch"}),
			screen({name:"index", clearcolor:vec4("#000030"), moveTo:function(x,y,z){
				this.find("tiledmap").moveTo(x,y,z)
			}}			
				,this.tiledmap({name:"tiledmap" })
				
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
				,button({text:"Manhattan",click:function(){this.rpc.index.moveTo(9647*2,12320*2, 16);}, margin:2})
				,button({text:"Amsterdam",click:function(){this.rpc.index.moveTo(33656,21534, 16);}, margin:2})
				,button({text:"Noord Amsterdam",click:function(){this.rpc.index.moveTo(33656,21434, 16);}, margin:2})
				,button({text:"Sausalito",click:function(){this.rpc.index.moveTo(9647,12320, 16);}, margin:2})
				,button({text:"San Fransisco",click:function(){this.rpc.index.moveTo(9647,12320, 16);}, margin:2})
			))
		)
		]
	}

})
