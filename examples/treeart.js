define.class("$server/composition",function(require, $ui$, screen, view) {
	this.render = function() {
		return [screen(
			view({
				flex:1,
				init:function(){
					console.log('here')
				},
				bgcolor:'red',
				hardrect:{
					color:function(){
						return mix('brown',pal.pal1(mesh.depth/14+0.1*view.time),mesh.depth/12)*sin(mesh.pos.y*PI)*pow(sin(mesh.pos.x*PI),0.2)
					},
					mesh:define.struct({
						pos:vec2,
						path:float,
						depth:float
					}).array(),
					position:function(){
						
						// lets walk
						var path = mesh.path
						var pos = vec2(0,0)
						var scale = vec2(1,1)
						var dir = vec2(0,-1)
						var depth = int(mesh.depth)
						for(var i = 0; i < 32; i++){
							if(i >= depth) break
							var right = mod(path, 2.)	
						    if(right>0.){
						    	dir = math.rotate2d(dir, 30.*math.DEG*sin(view.time))
						    }
						    else{
						    	dir = math.rotate2d(dir, -30.*math.DEG*sin(1.2*view.time+0.1*mesh.depth))
						    }
						    pos += (dir * scale)*1.8
						    scale = scale * vec2(0.9,0.9)
							path = floor(path / 2.)
						}
						// alright we found a pos and dir
						
						var p = (math.rotate2d(mesh.pos*scale, atan(dir.y,dir.x)) + pos)  * vec2(30,30) + vec2(300,600)

						return vec4(p, 0, 1) * view.totalmatrix * view.viewmatrix
					},
					update:function(){
						var mesh = this.mesh = this.mesh.struct.array()

						// first triangle
						function recur(path, depth){

							mesh.pushQuad(
								-1,-1, path, depth,
								1,-1, path, depth,
								-1,1, path, depth,
								1,1, path, depth
							)
							if(depth>13)return
							
							recur(path, depth+1)
							recur(path + Math.pow(2, depth), depth+1)
						}
						recur(0,0)
						
						10101101

					}
				}
			})
		)]
	}
})
