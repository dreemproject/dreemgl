/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Sprite class

define.class( function(require, $ui$, view, label, button){	

	this.bgcolor = "#585858" 
	this.flexdirection = "row" 
	this.dropshadowradius = 20;
	this.dropshadowopacity = 0.3;
	this.dropshadowhardness = 0;
	
	this.attributes = {
		menus:[
			{name:"File", commands:[				
				{name:"New project", action:function(){console.log("new project with a long name") ;}},
				{name:"Open", action:function(){console.log("Open") ;}},
				{name:"Save", action:function(){console.log("Save") ;}}
			]}
			,{name:"Edit", commands:[				
				{name:"Undo", action:function(){console.log("Undo") ;}},
				{name:"Redo", action:function(){console.log("Redo") ;}},
				{name:"Cut", action:function(){console.log("Cut") ;}},
				{name:"Copy", action:function(){console.log("Copy") ;}},
				{name:"Paste", action:function(){console.log("Paste") ;}}
			]}
		]
	}	
		
	this.render = function(){
		if (!this.menus) return []

		var mres = []
			
		for(var m in this.menus){
			var res = []
			var menu = this.menus[m]

			mres.push(
				button({
					buttoncolor1:"#585858",
					buttoncolor2:"#585858",
					hovercolor1:"#737373",
					hovercolor2:"#737373",
					bold:false,
	
					borderwidth:0, 
					borderradius:8,
					margin:vec4(4,0,0,0),
					padding:5,  
					text:menu.name, 
					menucommands: 
					menu.commands, 
					click: function(){
						// lets open a modal dialog
						this.screen.openModal(function(){
							var res = [];
							console.log("full menucommands array", this.menucommands);
							for(var a in this.menucommands){
								var c = this.menucommands[a];
								//console.log("menucommand: ", c);
								res.push(
									button({
										padding:vec4(5 ,0,5,4),
										margin:0,
										borderradius: 6,
										bold:false,
										text:c.name,
										
										buttoncolor1:"#a3a3a3",
										borderwidth:0,
										hovercolor1:"#737373",
										hovercolor2:"#737373", 
										buttoncolor2:"#a3a3a3",
										textcolor:"#3b3b3b",
										textactivecolor:"white",
										clickaction: c.action,
										click:function(){
											if(this.clickaction) this.clickaction()
											this.screen.closeModal(true);
										}
									})
								)
							}

							return view({bgcolor:"#a3a3a3",flexdirection:"column",
								dropshadowopacity: 0.4,
								padding:4,
								dropshadowhardness:0,
								dropshadowradius: 20,
								dropshadowoffset:vec2(9,9), 
								borderradius:7,
								miss:function(){
									this.screen.closeModal(false)
								},
								init:function(){
									console.log('here')
								},
								pos:[this.layout.absx,this.layout.absy + this.layout.height],
								size:[300,NaN],position:'absolute'
							}, res)
						}.bind(this)).then(function(result){
							console.log(result)
						})
					}
			}))
		}
		return mres;
	}
	
})