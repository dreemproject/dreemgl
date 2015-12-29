//Pure JS based composition
define.class('$server/composition', function($ui$, screen, view, button,label, speakergrid){
	
	define.class(this, "popupmenu", function($ui$, view, label, button){
		this.bgcolor = "#585858" 
		this.flexdirection = "row" 
		this.attributes = {
				menus:[
					{name:"File", commands:[				
							{name:"New project", action:function(){console.log("new project with a long name") ;}},
							{name:"Open", action:function(){console.log("Open") ;}},
							{name:"Save", action:function(){console.log("Save") ;}}
						]
					}
					,{name:"Edit", commands:[				
							{name:"Undo", action:function(){console.log("Undo") ;}},
							{name:"Redo", action:function(){console.log("Redo") ;}},
							{name:"Cut", action:function(){console.log("Cut") ;}},
							{name:"Copy", action:function(){console.log("Copy") ;}},
							{name:"Paste", action:function(){console.log("Paste") ;}}
						]
					}
			]}
			
			
		this.render = function(){
			if (!this.menus) return [];

			var mres = []
				
			for(var m in this.menus){
				var res = [];
				var menu = this.menus[m];
				console.log("menu:" , menu);
				mres.push(button({buttoncolor1:"#737373",buttoncolor2:"#737373",hovercolor1:"#3b3b3b",hovercolor2:"#3b3b3b",borderwidth:0, borderradius:4,margin:vec4(4,0,0,0),padding:5,  text:menu.name, menucommands: menu.commands, click: function()
				{
					// lets open a modal dialog
					var res = [];
					//console.log("full menucommands array", this.menucommands);
					for(var a in this.menucommands){
						var c = this.menucommands[a];
						console.log("menucommand: ", c);
						res.push(button({padding:5,margin:vec4(4),text:c.name,buttoncolor1:"#505050",borderwidth:0,hovercolor1:"#3b3b3b",hovercolor2:"#3b3b3b", buttoncolor2:"#505050",   clickaction: c.action, click:function(){if(this.clickaction) this.clickaction(); this.closeModal(true);}, margin:1}))
					}
					
					this.screen.openModal(
						view({bgcolor:"#505050",flexdirection:"column",
							miss:function(){
								this.closeModal(false)
							},
							init:function(){
								console.log('here')
							},
							pos:[this.layout.absx,this.layout.absy + this.layout.height],
							size:[300,NaN],position:'absolute'
						}, res)
					).then(function(result){
						console.log(result)
					})
					
				
				}}));
			}
			return mres;
		}
	})
	
	this.justifycontent = "center" ;
	this.alignitems = "center" 
	
	this.render = function(){ return [
		screen({clearcolor:vec4('black'), title:"Small menu bar test frame"},
			view({flex:1, bg:'false'},
				speakergrid({ }
				,view({bgcolor:vec4(0,0.1,0.2,0.8) , flexdirection:"column"},view({bg:false},this.popupmenu({position:"relative",margin:0,flex:1}))))
			)
		)
	]}
})