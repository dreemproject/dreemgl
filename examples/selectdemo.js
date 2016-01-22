//Pure JS based composition
define.class(function($server$, composition, $ui$, screen, cadgrid, view){

	define.class(this, "selectorrect", view, function(){ 
		this.name = 'selectorrect'
		this.bordercolorfn = function(pos){
			var check = (int(mod(0.20 * (gl_FragCoord.x + gl_FragCoord.y + time * 40.),2.)) == 1)? 1.0: 0.0
			return vec4(check * vec3(0.8), 1)
		}
		this.bordercolor = vec4(1, 1, 1, 0.4)
		this.borderwidth = 2
		this.bgcolor = vec4(1, 1, 1, 0.07)
		this.borderradius = 2
		this.position = "absolute"
		this.visible = false
	})
	
	this.render = function(){ return [
		screen({name:'default', clearcolor:vec4('black')},
			cadgrid({
				flex:1,
				onmouseleftdown:function(event){
					var select = this.find('selectorrect')
					select.visible = true
					var start = select.pos = event.local
					select.size = vec2(0)
					this.onmousemove = function(event){
						select.size = vec2(event.local[0] - start[0], event.local[1] - start[1])
					}
					this.onmouseleftup = function(){
						this.onmousemove = undefined
						this.onmouseleftup = undefined
						select.visible = false
					}
				},
				},
				this.selectorrect({

				})
			)
		)
	]}
})
