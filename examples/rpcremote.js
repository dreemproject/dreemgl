//Pure JS based composition
define.class(function($server$, composition, screens, service, $containers$, screen, view, $behaviors$, draggable){ this.render = function(){ return [

	service({
		attribute_test: {type:int, value:10},
		dosomething: function(){
			console.log("dosomething called on server")
			this.test = 40
			this.test = function(value){
				console.log("TEST ATTRIBUTE SET ON SERVEr")

			}
			console.log("Setting attribute on screen")
			this.rpc.screens.mobile.test1 = {my:'obj'}
		}
	}),
	screens(
		screen({
			init: function(){
				this.rpc.server.test = function(value){
					console.log("Got server attribute!"+value)
				}
				this.test1 = function(value){
					console.log('Got attribute set!', value, this.test1)
				}

				this.rpc.server.dosomething()
			},
			attributes:{
				test:{type:Object, value:{}},
				mousepos:{type:vec2, value:'${this.main.pos}'},
			},
			name:'mobile',
			},
			view({
				name:'main',
				size: vec2(200, 200),
				bgcolor: vec4('yellow'),
				is: draggable()
			})
		),
		screen({name:'desktop'},
			view({
				size: vec2(200, 200),
				pos: '${this.rpc.screens.mobile.mousepos}',
				bgcolor: 'red',
				init: function(){
					console.log("screen2", this.rpc.server.test)
				}
			})
		)
	)

]}})