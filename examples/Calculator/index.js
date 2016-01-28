define.class('$server/composition', function (require,  $server$, fileio,$ui$, noisegrid, numberbox, button, menubar, label, screen, view, foldcontainer, speakergrid,checkbox, icon, $widgets$, colorpicker,  jsviewer, radiogroup, $3d$, ballrotate){
	
	this.calculate = function(){
		
	}
	
	define.class(this, "calculator", "$ui/noisegrid", function(){
		this.borderradius = 4;
		this.attributes = {
			results: []
		}
		this.alignself="center";
		this.flex = undefined;
		this.flexdirection = "column";
		this.width =600;
		this.expression = "";
		this.openbrackets = 0;
		this.add = function(item, brackets){
			if (brackets) this.openbrackets += brackets;
			
			this.expression += item;	
			var ex = this.find("theexpression");
			ex.text = this.expression;
			var brack = "";
			
			for(var i =0 ;i<this.openbrackets;i++){
				brack+= ")";
			}
			this.find("thebrackets").text = brack;
			this.find("labelcontainer").relayout();
	//		console.log(this.expression);
		}
		
		this.evaluate = function(){
			var brack = "";
			
			for(var i =0 ;i<this.openbrackets;i++){
				brack+= ")";
			}
			this.expression += brack;
			this.find("thebrackets").text = "";
			this.find("theexpression").text = this.expression ;
			var res = 0;
			try{
				
				res = eval(this.expression);
				console.log(res);
				this.results.push( this.expression + "=" + res);
				console.log(this.results);
				this.results = this.results;
				this.expression = "";
				this.openbrackets = 0;
				this.find("thebrackets").text = "";
				this.find("theexpression").text = "";
			}catch(e){
				console.log(e);
			}
			
			
			
			this.find("labelcontainer").relayout();
			
			
		}
		this.render = function(){
			var resultbox = [];
			console.log("rendering");
			for (var i =0 ;i<this.results.length;i++){
				console.log("tadaa", this.results[i]);
				resultbox.push(label({bg:0, fgcolor:"white", text:i + ": " + this.results[i]}));
			}
			return [
			view({padding:10,bg:0,flexdirection:"column" },resultbox),
			view({flex:1, borderradius:4, bgcolor: "#80f0d0", flex:1, padding:5,  margin:10, name:"labelcontainer"}
				,label({bg:0, name:"theexpression", text:this.expression,fgcolor:"black" , alignment:"right"})
				,label({bg:0, name:"cursor", text:"_",fgcolor:"black" , alignment:"right"})
				,label({bg:0, name:"thebrackets", text:this.expression, fgcolor:"black" ,alignment:"right"})
			),
				view({bg:0, flexdirection:"row", flex:1},
					view({bg:0, flexdirection:"column", flex:1},
						view ({bg:0, flex:1}
							,button({padding:10,margin:6,text:"+", click:function(){this.add("+")}.bind(this),flex:1})
							,button({padding:10,margin:6,text:"-", click:function(){this.add("-")}.bind(this), flex:1})
							,button({padding:10,margin:6,text:"/", click:function(){this.add("/")}.bind(this), flex:1})
						)                              
						,view ({bg:0, flex:1}                  
							,button({padding:10,margin:6,text:"*", click:function(){this.add("*")}.bind(this), flex:1})
							,button({padding:10,margin:6,text:"^2", click:function(){this.add("^2")}.bind(this), flex:1})
							,button({padding:10,margin:6,text:"^y", click:function(){this.add("^")}.bind(this), flex:1})
						)                              
						,view ({bg:0, flex:1}                  
							,button({padding:10,margin:6,text:"log", click:function(){this.add("log(",1)}.bind(this), flex:1})
							,button({padding:10,margin:6,text:"ln", click:function(){this.add("ln(",1)}.bind(this), flex:1})
							,button({padding:10,margin:6,text:"exp", click:function(){this.add("exp(",1)}.bind(this), flex:1})
						)
						,view ({bg:0, flex:1}                  
							,button({padding:10,margin:6,text:"(", click:function(){this.add("(",1)}.bind(this), flex:1})
							,button({padding:10,margin:6,text:")", click:function(){this.add(")",-1)}.bind(this), flex:1})
						)
					),
					
					view({bg:0, flexdirection:"column", flex:1},
						view ({bg:0}
							,button({padding:10,margin:6,text:"1", click:function(){this.add("1")}.bind(this), flex:1})
							,button({padding:10,margin:6,text:"2", click:function(){this.add("2")}.bind(this), flex:1})
							,button({padding:10,margin:6,text:"3", click:function(){this.add("3")}.bind(this), flex:1})
						)                              
						,view ({bg:0}                  
							,button({padding:10,margin:6,text:"4", click:function(){this.add("4")}.bind(this), flex:1})
							,button({padding:10,margin:6,text:"5", click:function(){this.add("5")}.bind(this), flex:1})
							,button({padding:10,margin:6,text:"6", click:function(){this.add("6")}.bind(this), flex:1})
						)                              
						,view ({bg:0}                  
							,button({padding:10,margin:6,text:"7", click:function(){this.add("7")}.bind(this), flex:1})
							,button({padding:10,margin:6,text:"8", click:function(){this.add("8")}.bind(this), flex:1})
							,button({padding:10,margin:6,text:"9", click:function(){this.add("9")}.bind(this), flex:1})
						)
						,view ({bg:0, flex:1}                  
							,button({padding:10,margin:6,text:"0", click:function(){this.add("0")}.bind(this), flex:1})
							,button({buttoncolor1:"green",buttoncolor2:"lime",textcolor:"black" , padding:10,margin:6,text:"EXE", click:function(){this.evaluate()}.bind(this), flex:1})
						)
					)
				
				// +  -  / *  1 / 2 pi r c 
				)
			]
		}
	})
	
	this.render = function(){
		return [screen({title:"calculator",style:{$:{fontsize:20}, button:{margin:2}}}
			,speakergrid({justifycontent:"center",alignitems:"center" }, 
				this.calculator()
			)
		)];
	}
})
