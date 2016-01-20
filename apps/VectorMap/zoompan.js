define.class('$server/composition', function vectormap(require,  $server$, fileio,$ui$, numberbox, button, menubar, label, screen, view, foldcontainer, speakergrid,checkbox, icon, $widgets$, colorpicker,  jsviewer, radiogroup, $3d$, ballrotate, $$, urlfetch){

	define.class(this, "tiledmap", function($ui$, view)
	{
		this.attributes = {
			centerx: 1000.0,
			centery: 1000.0,
			zoomlevel: Config({value:4, motion:"easeinout", duration:0.4}),
			levels: []
		}
		
		this.bg = function(){
			this.color = function(){
				var c = 1.0/(1.0+abs(view.zoomlevel - mesh.id));
				
				return vec4(mesh.color.xyz*c, 1);
			}
			
			this.vertexstruct =  define.struct({		
					pos:vec3,
					color:vec4, 
					id: float
				})

			this.mesh = this.vertexstruct.array();
			
			this.update = function(){
				var mesh =this.mesh = this.vertexstruct.array();
				var cx = this.view.layout.width/2;
				var cy = this.view.layout.height/2;
				var w = 100;
				var h = 200;
				for(var i = 0;i<this.view.levels.length;i++){
					w = h = Math.pow(2,i-this.view.zoomlevel) * 500;
					for(var xx = -1;xx<2;xx++){
						for(var yy = -1;yy<2;yy++){
							var x = cx - w/2 + w * xx;
							var y = cy - h/2 + h * yy;
							mesh.push(x,y,0,vec4("blue"), i);
							mesh.push(x+w,y,0,vec4("blue"), i);
							
							mesh.push(x+w,y,0,vec4("blue"), i);
							mesh.push(x+w,y+h,0,vec4("blue"), i);
							
							mesh.push(x+w,y+h,0,vec4("blue"), i);
							mesh.push(x,y+h,0,vec4("blue"), i);
							
							mesh.push(x,y+h,0,vec4("blue"), i);
							mesh.push(x,y,0,vec4("blue"), i);
						}
					}
				}
			}
			
			this.position = function(){					
					var r = vec4(mesh.pos.x, mesh.pos.y, 0, 1) * view.totalmatrix * view.viewmatrix;
					return r
			}
			
			this.drawtype = this.LINES
				
				
		};
		
		this.flex = 1;
		this.overflow = "hidden" 
		
		
		this.moveTo = function(x,y,z){
			this.centerx = x;
			this.centery = y;
			this.zoomlevel = z;		

			for(var xx = -3; xx < 3; xx++){
				for(var yy = -3; yy < 3; yy++){			
					// add square around 
					this.addToQueue(x + xx,y + yy,z);	
				}
			}
			
			
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
			
			for(var i = 0;i<18;i++){
				this.levels[i] = {}
			}
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
				,button({text:"0,0,5",click:function(){this.rpc.index.moveTo(0,0,5);}, margin:2})
				,button({text:"10,0,5",click:function(){this.rpc.index.moveTo(10,0,5);}, margin:2})
				,button({text:"0,10,5",click:function(){this.rpc.index.moveTo(0,10,5);}, margin:2})
				,button({text:"0,0,6",click:function(){this.rpc.index.moveTo(0,0,6);}, margin:2})
				,button({text:"10,0,4",click:function(){this.rpc.index.moveTo(10,0,4);}, margin:2})
				,button({text:"0,10,4",click:function(){this.rpc.index.moveTo(0,10,4);}, margin:2})
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
