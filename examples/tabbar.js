define.class("$server/composition",function(require, $ui$, tabbar, screen, cadgrid, $widgets$, toolkit) {
	
	this.render = function() {
		return [
			screen(
				cadgrid({
						name:"grid", 
						flex:3, 
						overflow:"scroll", 
						bgcolor:"#4e4e4e", 
						gridsize:8, 
						majorevery:5, 
						majorline:vec4(0.34117648005485535,0.34117648005485535,0.34117648005485535,1), 
						minorline:vec4(0.2823529541492462,0.2823529541492462,0.2823529541492462,1), 
						alignitems:'center', 
						alignself:'stretch', 
						flexdirection:'column', 
						justifycontent:'center', 
						anchor:vec3(0,0,0), 
						toolmove:false, 
						toolrect:false
					},
					tabbar({tabs:["a","teo","tree"], position:'absolute', x:349.6718444824219, y:110.31996154785156, width:148.8994140625, height:44.160000000000004}),
					tabbar({tabs:["a","teo","tree"], position:'absolute', x:725.0107421875, y:360}),
					tabbar({tabs:["a","teo","tree"], position:'absolute', x:349.6718444824219, y:110.31996154785156, width:148.8994140625, height:44.160000000000004}),
					tabbar({tabs:["a","teo","tree"], position:'absolute', x:725.0107421875, y:360})
				),
				toolkit({
					position:'absolute', 
					x:1068, 
					y:42.00083541870117, 
					width:393, 
					height:788, 
					visible:true, 
					components:[
						{
							label:"Tab Bar", 
							icon:"folder", 
							desc:"A tab bar", 
							classname:"tabbar", 
							classdir:"$ui$", 
							params:{
							}
						}
					]
				}
				)
			)
		]
	}
}
)