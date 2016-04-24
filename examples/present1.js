/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class('$server/composition', function(
	require,  
	$server$, fileio,
	$ui$, noisegrid, numberbox, button, menubar, label, screen, view, foldcontainer, speakergrid, checkbox, icon){

	define.class(this, "calculator", "$ui/view", function(){

		this.attributes = {
			results: [],
			expression:""
		}

		this.bgcolor = 'gray'
		this.borderradius = 4
		this.dropshadowopacity = 0.2
		this.dropshadowhardness = 0
		this.dropshadowoffset = vec2(10)
		this.dropshadowradius = 30
		
		this.alignself = "center"
		this.flex = undefined
		this.flexdirection = "column"
		this.width = 600

		this.add = function(item, brackets){
			this.expression += item
		}

		this.evaluate = function(){
			try{
				var res = eval(this.expression)
				this.results.push( this.expression + "=" + res)
				this.results = this.results
				this.expression = ""
			}catch(e){
			}
		}

		this.style = {
			button:{
				padding:10,
				margin:6,
				flex:1
			}
		}

		this.clear = function(){
			this.results = []
			this.expression = ""
		}

		this.render = function(){

			var resultbox = []

			for (var i = 0; i < this.results.length;i++){
				resultbox.push(label({fgcolor:"white", text:i + ": " + this.results[i]}))
			}

			var calc = this

			return [
				view({padding:10, flexdirection:"column" },resultbox),
				view({flex:1, borderradius:4, bgcolor: "#80f0d0", flex:1, padding:5,  margin:10, name:"labelcontainer"},
					label({name:"theexpression", text:this.expression,fgcolor:"black" , alignment:"right"}),
					label({name:"cursor", text:"|",fgcolor:"black" , alignment:"right"})
				),
				view({flexdirection:"row"},
					view({flexdirection:"column", flex:1},
						view({},
							button({text:"+", click:function(){calc.add("+")}}),
							button({text:"-", click:function(){calc.add("-")}}),
							button({text:"/", click:function(){calc.add("/")}})
						),
						view({},
							button({text:"*", click:function(){calc.add("*")}}),
							button({text:"^2", click:function(){calc.add("^2")}}),
							button({text:"^y", click:function(){calc.add("^")}})
						),
						view({},
							button({text:"log", click:function(){calc.add("log(",1)}}),
							button({text:"ln", click:function(){calc.add("ln(",1)}}),
							button({text:"exp", click:function(){calc.add("exp(",1)}})
						),
						view({},
							button({text:"(", click:function(){calc.add("(")}}),
							button({text:")", click:function(){calc.add(")")}}),
							button({text:"C", click:function(){calc.clear()}})
						)
					),
					view({flexdirection:"column", flex:1},
						view({},
							button({text:"1", click:function(){calc.add("1")}}),
							button({text:"2", click:function(){calc.add("2")}}),
							button({text:"3", click:function(){calc.add("3")}})
						),
						view({},
							button({text:"4", click:function(){calc.add("4")}}),
							button({text:"5", click:function(){calc.add("5")}}),
							button({text:"6", click:function(){calc.add("6")}})
						),
						view({},
							button({text:"7", click:function(){calc.add("7")}}),
							button({text:"8", click:function(){calc.add("8")}}),
							button({text:"9", click:function(){calc.add("9")}})
						),
						view({flex:1},
							button({text:"0", click:function(){calc.add("0")}}),
							button({
								buttoncolor1:"green",
								buttoncolor2:"lime",
								textcolor:"black",
								text:"=", 
								hover:Config({motion:'inoutexpo',duration:0.5}),
								click:function(){calc.evaluate()},
								bgcolorfn:function(pos){
									var height =  sin(8.*length(vec2(2.,1.)*(pos-.5))-time)*.5+.5
									var nr = vec2(dFdx(height), dFdy(height))
									var lt = dot(nr, vec2(0,12))
									return mix('gray','white',lt)
								}
							})
						)
					)
				)
			]
		}
	})

	this.render = function(){
		return [
			screen({title:"Calculator"},
				speakergrid({justifycontent:"center",alignitems:"center" },
					this.calculator()
				)
			)
		]
	}
})
