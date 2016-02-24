define.class("$server/composition",function(require, $ui$, screen, view) {
	this.render = function() {
		return [screen({
				clearcolor:'black'
			},
			view({
				flex:1,
				bgcolor:'red',
				mousepos:vec2(0,0),
				pointermove:function(event){
					this.mousepos = event.value
				},
				hardrect:{
					color:function(){						
						if(mesh.depth>13.){
							var len = min(pow(1.5-length(mesh.pos),8.),1.)								
							if(mesh.isberry>0.){
								// render a berry
								//var len = min(pow(1.5-length(mesh.pos),8.)*0.15,1.)		
								return mycolor*len
							}
							else{
								// render a leaf
								return mycolor*len
							}
						}
						// render a branch
						return mix('brown',mycolor,mesh.depth/12)*sin(mesh.pos.y*PI)
					},
					// the geometry structure, position, path (a power of 2 float mask) and depth of the rect
					// also note we are only using 'floats' for this data, videocards dont really like other types
					mesh:define.struct({
						pos:vec2,
						path:float,
						depth:float,
						isberry:float
					}).array(),
					position:function(){
						var mainscale = vec2(30,30)
						var mainoffset = vec2(300,400)
						var mousepos = (view.mousepos - mainoffset) / mainscale
						// the path is a set of float 'bits' that can be walked to go left or right
						var path = mesh.path
						// cumulative position of the tree branch or leaf
						var pos = vec2(0,0)
						// cumulative scale
						var scale = vec2(1,1)
						// the direction vector is rotated as we go
						var dir = vec2(0,-0.8)
						// the turbulence factor
						var turbulence = 3.
						// the depth of the rectangle we are processing
						var depth = int(mesh.depth)
						// run over the whole depth, note we don't use i < depth because thats not allowed in webGL, has to be fixed number
						for(var i = 0; i < 14; i++){
							if(i >= depth) break
							// this is like path&1 binary arithmetic done using floats
							var right = mod(path, 2.)	
							// its the right branch
							var angle = 25.*math.DEG+0.01*turbulence*sin(view.time)
						    if(right>0.){
						    	angle = -1.*angle
						    }

							// rotate by mouse position
							var dist = max(50.-10.*length(mousepos - pos)-sin(view.time),0.)
							angle -= dist*0.01

							dir = math.rotate2d(dir,angle)

						    // accumulate position scale
						    pos += (dir * scale)*1.9
						    scale = scale * vec2(0.85,0.85)
						    // this is like path = path >>1 in float
							path = floor(path / 2.)
						}
						// our colornoise varying
						colornoise = 0.
						// the leaves have a different scale/center than the branches so make it tweakable
						var vscale = vec2(1.,.5)
						var vcen = vec2(-.8,-.4)
						// we are a leaf or berry
						if(depth > 13){
							var noise = noise.noise3d(vec3(pos.x*.3,pos.y*.3,0.5*view.time)) * turbulence
							colornoise = noise
							// only rotate the leaves

							if(mesh.isberry > 0.){
								mycolor = 'red'
								scale *= vec2(0.5,0.5)
							}
							else{
								dir = math.rotate2d(dir, -50.*math.DEG*noise)
								mycolor = pal.pal5(0.1*colornoise+0.1*view.time)
							}
							scale *= vec2(1,4.)
							vscale = vec2(3.,.5)
							vcen = vec2(0.8,0.)
						}
						else{
							mycolor = pal.pal5(0.1*colornoise + mesh.pos.y+mesh.depth/14+0.1*view.time)
						}

						// compute the final position
						var p = (math.rotate2d((mesh.pos*vscale+vcen)*scale, atan(dir.y,dir.x)) + pos)  * mainscale + mainoffset

						return vec4(p, 0, 1) * view.totalmatrix * view.viewmatrix
					},
					update:function(){
						var mesh = this.mesh = this.mesh.struct.array()

						// first triangle
						function recur(path, depth){
							
							var isberry = 0
							// probabilistically spread the berries through the tree
							if(depth > 13 && Math.random()<0.1) isberry = 1
							// we push plain rectangles in the geometry buffer with just the path + depth added
							mesh.pushQuad(
								-1,-1, path, depth, isberry,
								1,-1, path, depth, isberry,
								-1,1, path, depth, isberry,
								1,1, path, depth, isberry
							)
							// bail when at level 14
							if(depth>13)return
							// recur left and right, encode the 'right' with a power of 2 'flag' in the path boolean
							recur(path, depth+1)
							recur(path + Math.pow(2, depth), depth+1)
						}
						recur(0,0)
					}
				}
			})
		)]
	}
})
